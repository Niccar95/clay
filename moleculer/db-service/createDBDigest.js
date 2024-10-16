/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require('lodash');
const fs = require('fs');
const { sequelize } = require('./dataaccess');

async function createDBDigest() {
  const query = `SELECT "table_name",
                  "column_name", "data_type"
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE "table_schema" = 'public' AND "table_name" != 'eventsources'
                ORDER BY "table_name", "column_name";`;

  const allColumnsInfo = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  const md5s = [];
  for (const column of allColumnsInfo) {
    const md5Query = `SELECT md5(
      CAST(array_agg(
        COALESCE(CAST( "${column.table_name}"."${column.column_name}" as text), '')
        ORDER BY "id","createdAt") AS text)) as "digest", '${column.table_name}${column.column_name}' as "name"
      FROM "${column.table_name}";`;

    // eslint-disable-next-line no-await-in-loop
    const md5Result = await sequelize.query(md5Query, {
      type: sequelize.QueryTypes.SELECT,
    });
    md5s.push(md5Result[0]);
  }
  return md5s;
}

async function writeDBDigest(filename) {
  // eslint-disable-next-line no-console
  console.log('getting current db md5 hash');

  const digest = await createDBDigest();

  fs.writeFileSync(`./${filename}.digest`, JSON.stringify(digest, null, 2));
  return digest;
}

// only run if called directly
if (_.includes(process.argv[1], 'createDBDigest')) {
  const now = new Date();

  if (process.argv[2]) {
    writeDBDigest(process.argv[2]);
  } else {
    const filename = `dbdigest-${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    writeDBDigest(filename);
  }
}

module.exports = {
  createDBDigest,
  writeDBDigest,
};
