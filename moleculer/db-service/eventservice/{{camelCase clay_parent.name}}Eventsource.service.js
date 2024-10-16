/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require('lodash');
_.mixin(require('lodash-uuid'));

const moment = require('moment');

const { tokenHook, prepareQuery } = require('shared-service');
const models = require('../dataaccess');

const { eventsource, Sequelize } = models;

const events = require('../events');

const blacklistedParams = [
  'password',
  'token',
  'resetTokenExpires',
  'verificationToken',
  'forgotPasswordToken',
];

module.exports = {
  name: '{{camelCase clay_parent.name}}Eventsource',
  version: 1,
  mixins: [tokenHook()],
  settings: {},
  hooks: {
    after: {
      '*': 'outputCleanUp',
    },
  },
  actions: {
    list: {
      requiredRole: ['super', 'supplier'],
      params: {
        page: {
          type: 'number',
          integer: true,
          min: 1,
          optional: true,
          convert: true,
        },
        pageSize: {
          type: 'number',
          integer: true,
          min: -1,
          optional: true,
          convert: true,
        },
        sort: { type: 'string', optional: true },
        query: { type: 'object', optional: true },
      },
      handler(ctx) {
        const query = prepareQuery(ctx.params, eventsource.eventsource, models);
        const { sessionUser } = ctx.meta;
        // required for querying using associations
        return eventsource.listForUser(query, sessionUser, ctx.meta);
      },
    },
    get: {
      requiredRole: ['super', 'supplier'],
      params: {
        id: {
          type: 'number',
          convert: true,
        },
      },
      async handler(ctx) {
        const { sessionUser } = ctx.meta;

        const event = await eventsource.get({
          where: { id: ctx.params.id },
        });
        //only standalone suppliers can get eventsources
        await eventsource.verifyReadAccess(event, sessionUser);

        //only standalone suppliers that have readaccess to this entityModel can get eventsources
        const fullEntity = await models[event.entityModel].get({
          where: { id: event.entityId },
        });
        await models[event.entityModel].verifyReadAccess(
          fullEntity,
          ctx.meta.sessionUser,
          ctx.meta,
        );

        return event;
      },
    },
    reEmit: {
      requiredRole: ['super'],
      params: {
        id: {
          type: 'number',
        },
      },
      async handler(ctx) {
        const event = await eventsource.get({
          where: { id: ctx.params.id },
          raw: true,
        });
        const fullEntity = await models[event.entityModel].get({
          where: { id: event.entityId },
        });

        ctx.broker.emit(event.eventName, {
          ...event,
          fullEntity: { ...fullEntity, ...event.eventParams },
        });
      },
    },
    undoEvent: {
      requiredRole: ['super'],
      params: {
        id: {
          type: 'number',
        },
      },
      async handler(ctx) {
        const event = await eventsource.get({
          where: { id: ctx.params.id },
        });

        const allPreviousEvents = await eventsource.eventsource.findAll({
          where: {
            entityId: event.entityId,
            entityModel: event.entityModel,
            id: { [Sequelize.Op.lt]: event.id },
          },
          order: ['id'],
        });

        const lastExecutedEvent =
          allPreviousEvents[allPreviousEvents.length - 1];

        /// merge all event params on events into a single object
        const mergedParams = allPreviousEvents.reduce((acc, e) => {
          return { ...acc, ...e.eventParams };
        }, {});

        // TODO: If we want changes to get calculated we need to figure out how to have inital empty arrays of children
        // const changes = await models[event.entityModel].getChanges(
        //   fullEntity ||
        //     models[event.entityModel][event.entityModel]
        //       .build({
        //         id: event.entityId,
        //       })
        //       .get({ plain: true }),
        //   mergedParams,
        // );

        // if the last event was a created event we need to change it to an update, otherwise we get double inserts
        const eventName = lastExecutedEvent.eventName.replace(
          '_CREATED',
          '_UPDATED',
        );

        // publish a new event with all the merged params
        ctx.actionDate = new Date();
        events[eventName](mergedParams).publish(ctx);
      },
    },
    cleanUpOldEvents: {
      requiredRole: ['super'],
      handler() {
        return this.deleteEventsByRetentionPolicy(events.retentionPolicies);
      },
    },
  },
  methods: {
    outputCleanUp(ctx, res) {
      if (res && res.eventParams) {
        blacklistedParams.forEach(blParam => {
          delete res.eventParams[blParam];
        });
      }
      return res;
    },
    async deleteEventsByRetentionPolicy(retentionPolicies) {
      for (const event in retentionPolicies) {
        if (Object.prototype.hasOwnProperty.call(retentionPolicies, event)) {
          const policy = retentionPolicies[event];
          const isCreatedEvent = event.includes('_CREATED');
          if (isCreatedEvent) {
            // eslint-disable-next-line no-await-in-loop
            const oldEvents = await eventsource.eventsource.findAll({
              attributes: ['id', 'entityId', 'entityModel'],
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: moment()
                    .utc()
                    .add(-1 * policy.retention, 'days')
                    .format('YYYY-MM-DD'),
                },
                eventName: event,
              },
              limit: 90000,
            });
            for (const e of oldEvents) {
              // eslint-disable-next-line no-await-in-loop
              await models[e.entityModel][e.entityModel].destroy({
                where: { id: e.entityId },
              });
              // eslint-disable-next-line no-await-in-loop
              await eventsource.eventsource.destroy({
                where: { entityId: e.entityId },
              });
              // eslint-disable-next-line no-await-in-loop
              await e.destroy();
            }
            // eslint-disable-next-line no-continue
            continue;
          }
          // eslint-disable-next-line no-await-in-loop
          const oldEvents = await eventsource.eventsource.findAll({
            attributes: ['id', 'entityId'],
            where: {
              createdAt: {
                [Sequelize.Op.lt]: moment()
                  .utc()
                  .add(-1 * policy.retention, 'days')
                  .format('YYYY-MM-DD'),
              },
              eventName: event,
            },
            order: [['createdAt', 'DESC']],
            offset: policy.keep,
            limit: 90000,
          });
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(
            oldEvents.map(e =>
              eventsource.eventsource.destroy({
                where: { id: e.id },
              }),
            ),
          );
        }
      }
    },
  },
  events: {},
  created() {},
  started() {},
  stopped() {},
};
