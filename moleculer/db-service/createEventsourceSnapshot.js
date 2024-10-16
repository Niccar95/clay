/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const tar = require('tar');
const { exec } = require('child_process');

const perf = require('execution-time')();
const models = require('./dataaccess');

const { sequelize, eventsource: eventsourceModel } = models;

sequelize.options.logging = false;

const DBNAME = process.env.DBNAME;

function compressFile(filename) {
  return tar.c(
    {
      gzip: true,
      file: `${filename}.tar.gz`,
    },
    [filename],
  );
}

function appendJSONToFile(str, fileName) {
  fs.appendFileSync(path.join(__dirname, fileName), `${str}\n`);
}

async function* eventStreamFromDB() {
  const fetchBatch = async page => {
    const query = `SELECT e."createdAt", a."maxCreatedAt", e."entityId", "entityModel", "eventName"
    FROM "eventsources" e
    JOIN
    (
      SELECT "entityId",
      min("createdAt") AS "minCreatedAt",
      max("createdAt") AS "maxCreatedAt",
      min("id") AS "minId"
      FROM eventsources
      GROUP BY "entityId"
    ) a ON a."entityId" = e."entityId" AND a."minId" = "e"."id"
    ORDER BY id asc limit 1000 offset ${page * 1000}`;
    // important to use createdAt instead of updatedAt
    const result = await sequelize.query(query, sequelize.QueryTypes.SELECT);
    return result[0];
  };

  let page = 0;
  perf.start('batchTimer');
  let batch = null;
  try {
    batch = await fetchBatch(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

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

async function main() {
  const latestEvent = await eventsourceModel.eventsource.findOne({
    order: [['id', 'DESC']],
  });
  const latestEventId = _.get(latestEvent, 'id', 0);
  const FILE_NAME = `${latestEventId}.${DBNAME}-eventsource-SNAPSHOT`; // the dot is important

  if (fs.existsSync(FILE_NAME)) {
    // eslint-disable-next-line no-console
    console.log('file already exists, exiting');
    return;
  }

  for await (const event of eventStreamFromDB()) {
    // perf.start('getEntity');

    const model = models[event.entityModel];

    // eslint-disable-next-line no-await-in-loop
    const entity = await model.get({
      where: { id: event.entityId },
    });

    // const getEntityTimer = perf.stop('getEntity');
    // appendJSONToFile(
    //   `${event.entityId},${getEntityTimer.time},${event.entityModel}`,
    //   'timelogger.csv',
    // );

    const eventParams = model.shortenNestedObjectForEvent(entity);

    const newEvent = {
      eventName: event.eventName,
      createdAt: event.createdAt,
      overrideUpdatedAt: event.maxCreatedAt,
      entityId: event.entityId,
      eventParams,
    };
    appendJSONToFile(JSON.stringify(newEvent), FILE_NAME);
  }
  await compressFile(FILE_NAME);

  // eslint-disable-next-line no-console
  console.log(
    `to upload file for DEVELOPMENT use: aws s3 cp ${FILE_NAME}.tar.gz s3://flaivy-eventsource-snapshots/development/${DBNAME}/`,
  );
  // eslint-disable-next-line no-console
  console.log(
    `to upload file for PRODUCTION use: aws s3 cp ${FILE_NAME}.tar.gz s3://flaivy-eventsource-snapshots/production/${DBNAME}/`,
  );

  // important since we are sharing this folder in jenkins
  const moveToSnapshotFolder = `mkdir -p ./snapshots && mv ${FILE_NAME}.tar.gz ./snapshots`;

  exec(moveToSnapshotFolder, (err, stdout, stderr) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    // eslint-disable-next-line no-console
    console.log(stdout);
    // eslint-disable-next-line no-console
    console.log(stderr);
  });
}

main();
