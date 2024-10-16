/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require('lodash');
_.mixin(require('lodash-uuid'));

const { sequelize, Sequelize } = require('./sequelize');
const {
  userListAccessFilter,
  verifyReadAccess,
} = require('./eventsource.model.useraccess');

const eventsource = sequelize.define(
  'eventsource',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: Sequelize.STRING,
    },
    eventParams: {
      type: Sequelize.JSONB,
    },
    entityModel: {
      type: Sequelize.STRING,
    },
    entityId: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
    sessionUser: {
      type: Sequelize.JSONB,
    },
    requestOrigin: {
      type: Sequelize.STRING,
    },
    metadata: { type: Sequelize.JSONB },
  },
  {
    indexes: [
      {
        fields: ['entityId'],
      },
      {
        fields: ['eventName'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  },
);

// eslint-disable-next-line
function includesForUserEntityList(sessionUser) {
  return [];
}

function listForUser(inputQuery, sessionUser) {
  if (!sessionUser) throw new Error('decoded token must be provided');

  const query = { ...inputQuery };
  const { includesForUserAccess, whereForUserAccess } =
    userListAccessFilter(sessionUser);
  const include = [
    ...includesForUserEntityList(sessionUser),
    ...includesForUserAccess,
  ];

  query.where = { ...query.where, ...whereForUserAccess };
  const countParams = { ...query, include };

  return Promise.all([
    // Get rows
    eventsource.findAll({
      ...query,
      include,
      attributes: [
        'id',
        'eventName',
        'entityModel',
        'entityId',
        'userId',
        'sessionUser',
        'requestOrigin',
        'metadata',
        'createdAt',
        'updatedAt',
      ],
      subQuery: false,
    }),
    // Get count of all rows
    eventsource.count(countParams),
  ]).then(res => {
    const total = res[1];
    const pageSize = query.limit || total;
    const page = Math.ceil(query.offset / pageSize) + 1;
    return {
      rows: res[0],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  });
}

function get(query) {
  return eventsource.findOne({
    ...query,
    subQuery: false,
  });
}

eventsource.listForUser = listForUser;

module.exports = {
  eventsource,
  listForUser,
  get,
  verifyReadAccess,
};
