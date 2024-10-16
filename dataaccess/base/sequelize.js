/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const Sequelize = require('sequelize');
const fs = require('fs');
const { Client } = require('pg');

const isProduction =
  process.env.PRODUCTION === true || process.env.PRODUCTION === 'true';

Sequelize.postgres.DECIMAL.parse = function parse(value) {
  return parseFloat(value);
};

const sequelizeSettingsMap = {
  test: {
    logging: false,
    username: 'postgres',
    password: 'Password!1',
    host: 'localhost',
    database: '{{replace (replace clay_parent.name '-' '') '-' ''}}_test',
    pool: {
      max: 1,
      min: 0,
      idle: 0,
    },
  },
  production: {
    logging: false,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
  },
  dev: {
    logging: true,
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
  },
};

let runEnv = isProduction ? 'production' : 'dev';
if (process.env.TEST) {
  runEnv = 'test';
}
const dbConfig = {
  dialect: 'postgres',
  host: process.env.DBHOST,
  pool: {
    max: 50,
    min: 0,
    idle: 10 * 1000,
  },
  ...sequelizeSettingsMap[runEnv],
};

const sequelize = new Sequelize(dbConfig);

const syncFunc = sequelize.sync;

async function ensureDatabaseExists() {
  let connectionSuccessfull = false;
  try {
    // Authenticate with the PostgreSQL server
    await sequelize.authenticate();
    connectionSuccessfull = true;
  } catch (error) {
    connectionSuccessfull = false;
  }

  if (connectionSuccessfull) {
    return;
  }

  try {
    const conStringPri = `postgres://${sequelize.config.username}:${sequelize.config.password}@${sequelize.config.host}/postgres`;

    // connect to postgres db
    const clientForCreate = new Client(conStringPri);
    await clientForCreate.connect();
    await clientForCreate.query(`CREATE DATABASE ${sequelize.config.database}`);
    await clientForCreate.end(); // close the connection
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to create the database:', error);
  }
  try {
    await sequelize.authenticate();
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    // eslint-disable-next-line no-console
    console.log('pg_trgm extension has been installed.');

    // eslint-disable-next-line no-console
    console.log('syncinc schema');
    await syncFunc.call(sequelize, {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to connect to the database:', error);
  }
}

async function createMaterializedViews() {
  const materializedViewsDir = './database/materializedViews';
  if (!fs.existsSync(materializedViewsDir)) {
    return;
  }

  const fileNames = fs.readdirSync(materializedViewsDir);

  for (const fileName of fileNames) {
    const query = fs
      .readFileSync(`${materializedViewsDir}/${fileName}`)
      .toString();

    const viewName = fileName.replace('.psql', '');

    if (process.env.TEST) {
      const updatedQuery = query.replace(
        /-- REMOVE BELOW IN TEST[.|\s\S]*/g,
        '',
      );
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`DROP VIEW IF EXISTS "${viewName}";`);
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`CREATE VIEW "${viewName}" AS ${updatedQuery};`);
    } else {
      // eslint-disable-next-line no-console
      console.log("Creating materialized view '%s'", viewName);
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS "${viewName}";`);
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(
        `CREATE MATERIALIZED VIEW "${viewName}" AS ${query};`,
      );
    }
  }
}

async function createIndexes() {
  const indexDir = './database/indexes';
  if (!fs.existsSync(indexDir)) {
    return;
  }

  const fileNames = fs.readdirSync(indexDir);

  for (const fileName of fileNames) {
    const query = fs.readFileSync(`${indexDir}/${fileName}`).toString();
    // eslint-disable-next-line no-await-in-loop
    await sequelize.query(query);
  }
}

// eslint-disable-next-line func-names
sequelize.sync = async function (options) {
  await ensureDatabaseExists(sequelize);
  const result = await syncFunc.call(sequelize, options);
  await createMaterializedViews();
  await createIndexes();
  return result;
};

sequelize.ensureDatabaseExists = ensureDatabaseExists;

module.exports = { Sequelize, sequelize };
