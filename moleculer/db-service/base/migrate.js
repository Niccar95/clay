/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const BaseTransporter = require('moleculer').Transporters.Base;
const perf = require('execution-time')();
const { ServiceBroker } = require('moleculer');
const fs = require('fs');
const readline = require('readline');
const AWS = require('aws-sdk');
const tar = require('tar');
const _ = require('lodash');

const { sequelize, db } = require('./dataaccess');
const { writeDBDigest } = require('./createDBDigest');
const events = require('./events');

sequelize.options.logging = false;

if (process.env.PRODUCTION === 'TRUE') {
  throw new Error("You need to write PRODUCTION='true' ");
}

const DBNAME = process.env.DBNAME;
const IN_PRODUCTION = process.env.PRODUCTION === 'true';

// SETUP MOLECULER
class MyTransporter extends BaseTransporter {
  connect() {
    this.connected = true;
    this.client = {};
    this.onConnected(true);
    return Promise.resolve();
  }

  disconnect() {
    this.connected = false;
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  subscribe() {
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  publish() {
    return Promise.resolve();
  }
}

// PREPARE FOR MIGRATION
async function throwErrorIfHistoryTableExists() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables({});
  if (tables.find(x => x === 'history')) {
    throw new Error(
      'There is a history table already. Fix this then re-run the migration',
    );
  }
}

async function moveEventsourceAndDeleteIndexesIfItExists() {
  // eslint-disable-next-line no-console
  console.log('moveEventsourceAndDeleteIndexesIfItExists');
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables({});

  if (tables.find(x => x === 'eventsources')) {
    const transaction = await sequelize.transaction();
    try {
      const queryResults = await sequelize.query(
        "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'eventsources';",
        { raw: true },
      );
      const indexNames = queryResults[0]
        .map(x => x.indexname)
        .filter(x => !_.includes(x, '_pkey'));

      await Promise.all(
        indexNames.map(indexName =>
          queryInterface.removeIndex('eventsources', indexName, {
            transaction,
          }),
        ),
      );

      await queryInterface.renameTable('eventsources', 'history', {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Couldn't drop eventsource and its index");
      await transaction.rollback();
      throw new Error(err);
    }
  }
}

async function cleanUpTables() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables({});
  const tablesToRemove = tables.filter(x => x !== 'eventsources');

  // eslint-disable-next-line no-console
  console.log('cleaning up old tables');

  for (let i = 0; i < tablesToRemove.length; i++) {
    const tn = tablesToRemove[i];
    // eslint-disable-next-line no-await-in-loop
    await sequelize.query(`DROP TABLE IF EXISTS "${tn}" CASCADE;`);
  }
  // eslint-disable-next-line no-console
  console.log('table cleanup complete, removed: ', tablesToRemove);
}

async function removeMaterializedViews() {
  // This should be changed to remove all views in the existing database.
  // Otherwise we need to manually remove the views that are not needed.
  if (fs.existsSync('./database/materializedViews')) {
    const fileNames = fs.readdirSync('./database/materializedViews');
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const viewName = fileName.replace('.psql', '');
      // eslint-disable-next-line no-console
      console.log(`removing materialized view: ${viewName}`);
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS "${viewName}";`);
    }
  }
}

// DO MIGRATION - SNAPSHOT
async function downloadSnapshotFromS3() {
  if (
    !process.env.S3_ACCESS_KEY_ID ||
    process.env.USE_SNAPSHOT_FOR_DB_MIGRATE !== 'true'
  ) {
    // eslint-disable-next-line no-console
    console.log(
      'No S3_ACCESS_KEY_ID found or EXPLICITLY not using snapshot, skipping snapshot download',
    );
    return new Promise(resolve => {
      resolve();
    });
  }
  AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const s3 = new AWS.S3();

  const prefix = `${IN_PRODUCTION ? 'production' : 'development'}/${DBNAME}/`;

  const listObjectsResponse = await s3
    .listObjectsV2({
      Bucket: 'flaivy-eventsource-snapshots',
      Prefix: prefix,
    })
    .promise();

  const latestSnapshot = _.get(
    _.maxBy(listObjectsResponse.Contents, 'LastModified'),
    'Key',
  );

  // eslint-disable-next-line no-console
  console.log('downloading', prefix);

  if (!latestSnapshot || latestSnapshot === prefix) {
    return new Promise(resolve => {
      resolve();
    });
  }

  const filename = latestSnapshot.substring(
    latestSnapshot.lastIndexOf('/') + 1,
  );

  const tmpDir = './tmp';

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const downloadPath = `${tmpDir}/${filename}`;

  const file = fs.createWriteStream(downloadPath);
  const stream = s3
    .getObject({
      Bucket: `flaivy-eventsource-snapshots`,
      Key: latestSnapshot,
    })
    .createReadStream()
    .pipe(file);

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(downloadPath);
    });
    stream.on('error', err => {
      reject(err);
    });
  });
}

function extractFile(downloadPath) {
  const extractedPath = downloadPath.replace('.tar.gz', '');
  return new Promise(resolve => {
    tar
      .x({
        file: `${downloadPath}`,
        C: './tmp',
      })
      .then(() => {
        resolve(extractedPath);
      });
  });
}

async function* eventStreamFromSnapshot(snapshotFileName) {
  const fileStream = fs.createReadStream(snapshotFileName);

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let counter = 0;
  perf.start('batchTimer');

  for await (const line of rl) {
    const event = JSON.parse(line);

    if (counter % 1000 === 0) {
      const batchTimer = perf.stop('batchTimer');
      // eslint-disable-next-line no-console
      console.log(
        'batch timer',
        _.padStart(_.round(batchTimer.time, 4), 14, ' '),
        'last date executed: ',
        event.createdAt,
      );
      perf.start('batchTimer');
    }
    counter += 1;
    yield event;
  }
}

// DO MIGRATION - DB
async function* eventStreamFromDB(startingId = 0) {
  // eslint-disable-next-line no-console
  console.log('migration from db starting at id: ', startingId);

  const fetchBatch = page => {
    const query = `select * from history as eventsource where id > ${startingId} order by id asc limit 1000 offset ${
      page * 1000
    }`;
    return sequelize.query(query, { model: sequelize.model('eventsource') });
  };

  let page = 0;
  perf.start('batchTimer');
  let batch = await fetchBatch(0);

  while (batch.length !== 0) {
    for (let i = 0; i < batch.length; i++) {
      const event = batch[i];
      yield event;
    }
    const batchTimer = perf.stop('batchTimer');
    // eslint-disable-next-line no-console
    console.log(
      'batch timer',
      _.padStart(_.round(batchTimer.time, 4), 14, ' '),
      'batch',
      _.padStart(page, 4, '0'),
      'last date executed: ',
      _.get(_.last(batch), 'createdAt'),
    );
    perf.start('batchTimer');
    page += 1;
    // eslint-disable-next-line no-await-in-loop
    batch = await fetchBatch(page);
  }
}
async function syncDatabaseSchema() {
  await sequelize.sync({ force: true });
}
async function turnOffAllDbConstraints() {
  await sequelize.query(`SET session_replication_role TO 'replica'`);

  const queryInterface = sequelize.getQueryInterface();

  for (const model of Object.keys(db)) {
    // this is for when a new database is created being migrated for the first time
    try {
      // eslint-disable-next-line no-underscore-dangle
      const uniqueIndexes = db[model]._indexes.filter(
        x => x.unique || x.using === 'gin',
      );
      for (let i = 0; i < uniqueIndexes.length; i++) {
        const index = uniqueIndexes[i];
        // eslint-disable-next-line no-console
        console.log('removing index', index);
        // eslint-disable-next-line no-await-in-loop
        await queryInterface.removeIndex(db[model].tableName, index.name);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('could not remove index', err);
    }
  }
}
async function turnOnAllDbConstraints() {
  // eslint-disable-next-line no-console
  console.log('restoring constraints');

  await sequelize.query(`SET session_replication_role TO 'origin'`);
  await sequelize.sync();
}

// DO MIGRATION - EVENTSTREAM
async function* eventStream({ snapshotFileName, startingAtDBEventId }) {
  if (snapshotFileName) {
    yield* eventStreamFromSnapshot(snapshotFileName);
  }
  yield* eventStreamFromDB(startingAtDBEventId);
}

// FINALIZE
async function restoreEventsource() {
  // eslint-disable-next-line no-console
  console.log('Cleaning up history table');
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables({});

  if (!tables.find(x => x === 'history')) {
    throw new Error(
      'Not possible to restore eventsource. There is no history table.',
    );
  }

  const restoreEventsourceSql =
    'begin transaction; drop table eventsources; alter table history rename to eventsources; commit transaction;';

  await sequelize.query(restoreEventsourceSql);
  await sequelize.models.eventsource.sync(); // creates new indexes
}

async function refreshMaterializedViews() {
  if (fs.existsSync('./database/materializedViews')) {
    const fileNames = fs.readdirSync('./database/materializedViews');
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const viewName = fileName.replace('.psql', '');
      // eslint-disable-next-line no-console
      console.log(`refreshing materialized view: ${viewName}`);
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`REFRESH MATERIALIZED VIEW "${viewName}";`);
    }
  }
}

// DO MIGRATION - MAIN
async function migrate(options) {
  process.env.PORT = 9999; // so we wont conflict with the gateway ports
  const broker = new ServiceBroker({
    logLevel: 'info',
    disableBalancer: true,
    transporter: new MyTransporter(),

    validator: true,
  });

  // eslint-disable-next-line no-console
  console.log('loading service');
  const x = await broker.loadServices('services');
  broker.waitForServices = () => Promise.resolve();

  // eslint-disable-next-line no-console
  console.log('started services', x);

  await broker.start();
  // eslint-disable-next-line no-await-in-loop
  let count = 0;
  let transaction = await sequelize.transaction();
  for await (const eventsourceEntry of eventStream(options)) {
    try {
      const eventFactory = events[eventsourceEntry.eventName];
      const event = eventFactory({
        ...eventsourceEntry.eventParams,
        id: eventsourceEntry.entityId,
      });

      // eslint-disable-next-line no-await-in-loop
      await event.commit(
        transaction,
        eventsourceEntry.createdAt,
        eventsourceEntry.sessionUser,
      );
      count++;
      if (count % 1000 === 0) {
        await transaction.commit();

        transaction = await sequelize.transaction();
      }
    } catch (error) {
      broker.logger.error(error);
      broker.emit('SYSTEM_ERROR', error);

      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify(eventsourceEntry.get({ plain: true })).slice(0, 10000),
      );

      // eslint-disable-next-line no-await-in-loop
      await restoreEventsource();

      throw error;
    }
  }

  // eslint-disable-next-line no-await-in-loop
  await transaction.commit();
  await broker.stop();
}

function getNrOfEventsFromTmpSnapshotPath(str) {
  const noTmp = str.replace('./tmp/', '');
  return noTmp.substring(0, noTmp.indexOf('.'));
}

function showDiff(before, after) {
  const diff1 = _.differenceWith(
    before,
    after,
    (a, b) => a.name === b.name && a.digest === b.digest,
  );

  const diff2 = _.differenceWith(
    after,
    before,
    (a, b) => a.name === b.name && a.digest === b.digest,
  );

  // eslint-disable-next-line no-console
  console.log('_.differenceWith old/new:', diff1);

  // eslint-disable-next-line no-console
  console.log('_.differenceWith new/old:', diff2);
}

async function run() {
  await sequelize.ensureDatabaseExists();
  const beforeDigest = await writeDBDigest('beforeMigration');

  perf.start('migrationTimer');
  const migrationOptions = { startingAtDBEventId: 0 };

  // assert that we are not in broken state
  await throwErrorIfHistoryTableExists();

  // SETUP
  await removeMaterializedViews();
  await cleanUpTables();
  await moveEventsourceAndDeleteIndexesIfItExists();

  // eslint-disable-next-line no-console
  console.log('Looking for SNAPSHOT');
  const snapshotArchiveFileName = await downloadSnapshotFromS3();

  if (snapshotArchiveFileName) {
    // eslint-disable-next-line no-console
    console.log(
      `SNAPSHOT found: ${snapshotArchiveFileName}, starting eventstreaming from snapshot file`,
    );
    const snapshotFileName = await extractFile(snapshotArchiveFileName);

    // eslint-disable-next-line no-console
    console.log('SNAPSHOT file extracted', snapshotFileName);

    migrationOptions.startingAtDBEventId =
      getNrOfEventsFromTmpSnapshotPath(snapshotFileName);

    migrationOptions.snapshotFileName = snapshotFileName;
  } else {
    // eslint-disable-next-line no-console
    console.log('SNAPSHOT not found');
  }

  process.on('SIGINT', async () => {
    // eslint-disable-next-line no-console
    console.log('Caught interrupt signal, cleaning up');
    await restoreEventsource();
    // eslint-disable-next-line no-console
    console.log('Done');
  });

  // eslint-disable-next-line no-console
  console.log('syncing database schema');
  await syncDatabaseSchema(); // skapa eventsource och index

  try {
    await turnOffAllDbConstraints();

    // eslint-disable-next-line no-console
    console.log('starting acting on eventstream');
    await migrate(migrationOptions);

    await turnOnAllDbConstraints();
  } finally {
    await restoreEventsource();
  }

  await refreshMaterializedViews();
  const afterDigest = await writeDBDigest('afterMigration');

  // eslint-disable-next-line no-console
  console.log('migration done');
  return showDiff(beforeDigest, afterDigest);
}
run();
