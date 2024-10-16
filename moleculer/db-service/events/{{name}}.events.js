/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
// EventSource
const perf = require('execution-time')();
const { MoleculerServerError, MoleculerClientError } = require("moleculer").Errors;
const { {{camelCase name}}, eventsource, sequelize } = require('../dataaccess');
const _ = require('lodash');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {channels} = require('shared-service');
const {
    Transaction,
    ValidationError,
    ValidationErrorItem,
    UniqueConstraintError,
    ExclusionConstraintError,
    ForeignKeyConstraintError,
    DatabaseError
  } = require('sequelize');

const MAX_TRANSACTION_RETRIES = 3;

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });


function errorIsDueToDbIsolationLevel(error) {
  if(error instanceof ValidationError ||
    error instanceof ValidationErrorItem ||
    error instanceof UniqueConstraintError ||
    error instanceof ExclusionConstraintError ||
    error instanceof ForeignKeyConstraintError )
    {
      return false
    }
  if(error instanceof DatabaseError){
    if( /.*invalid input syntax for type numeric.*/g.test(error.message) ) return false
  }
    return true;
}



module.exports = {
  {{#each events}}
  {{{@key}}}(fullChanges){
    const changes = {{camelCase ../name}}.shortenNestedObjectForEvent(fullChanges);
    // eslint-disable-next-line func-names
    const migrate = function (potentiallyOldChanges, sessionUsr) {
      const changesWithoutMigration = potentiallyOldChanges;
      try {
        // eslint-disable-next-line
        let implementation = require('../events/{{../name}}/{{@key}}.migration')
        return implementation.apply(this, [potentiallyOldChanges, sessionUsr])
      } catch(e) {
        if(e.code === 'MODULE_NOT_FOUND') {
          return changesWithoutMigration;
        }
        throw new MoleculerServerError("Event Migration Error", 500, "INTERNAL_SERVER_ERROR", e);
    }};


    async function commit(transaction, eventDate, sessionUser) {
      if(!transaction || !eventDate)
        throw new Error('Missing arguments to commit event (transaction, eventDate)');

      const migratedChanges = migrate(changes,sessionUser);
      {{#endsWith @key 'CREATED' }}
      const mutationsGenerator = {{camelCase ../name}}.prepareCreate(migratedChanges, eventDate);
      {{else}}
      const mutationsGenerator = {{camelCase ../name}}.prepareUpdate(migratedChanges, eventDate);
      {{/endsWith}}
      const mutations = await mutationsGenerator(transaction);
      await Promise.all(mutations);
    }

    return {
      name: '{{@key}}',

    commit,
    async publish(ctx, retry = 0) {
      if (_.isEmpty(changes)) { return }
      if (
        _.isEqual(_.sortBy(Object.keys(changes)), ['id',]) ||
        _.isEqual(_.sortBy(Object.keys(changes)), ['id', 'target'])
      ) {
        // double check for noop events - usually caused by fortnoxOrder action
        return;
      }

      perf.start('@{{../name}}.{{@key}}.publish');

      const { actionDate } = ctx;
      const { requestOrigin, sessionUser } = ctx.meta;
      

      const userId = sessionUser.id;

      const entityId = changes.id;
      const eventParams = migrate(changes, sessionUser);
      delete eventParams.lookups;
      delete eventParams.target;

      if (
        !(
          actionDate &&
          entityId &&
          eventParams &&
          _.isObject(eventParams) &&
          !_.isEmpty(eventParams) &&
          userId &&
          requestOrigin
        )
      ) {
        throw new Error(`event: ${actionDate} | ${entityId} | ${JSON.stringify(eventParams)} cant be published, missing input`);
      }

      perf.start('@{{../name}}.{{@key}}.commitToDb');
      const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
      });
      try {
        // for publish events we use the actionDate as the createdAt and updatedAt
        await commit(transaction, actionDate);
        await eventsource.eventsource.create(
          {
            eventName: '{{@key}}',
            eventParams,
            entityModel: '{{../name}}',
            entityId,
            userId,
            sessionUser,
            requestOrigin,
            createdAt: actionDate
          },
          { transaction }
        );
        await transaction.commit();
      } catch (error) {
        try{
          await transaction.rollback();
        } catch(e){
          ctx.broker.logger.error(e);
        }
        if (error instanceof UniqueConstraintError) {
          ctx.broker.logger.error(`UniqueConstraintError: ${error}`);
          throw new MoleculerClientError(
            'UniqueConstraintError',
            409,
            'UNIQUE_CONSTRAINT_ERROR',
            error.errors.map(e => ({
              message: e.message,
              type: e.type,
              path: e.path,
            })),
          );
        }
        if(errorIsDueToDbIsolationLevel(error)) {
          if(retry < MAX_TRANSACTION_RETRIES) {
            await sleep(200);
            ctx.broker.logger.error(`retry attempt: ${retry} ${error}`);
            await this.publish(ctx, retry + 1);
            return;
          }
        }
        ctx.broker.logger.error(`retry count: ${retry}`);
        ctx.broker.logger.error(error);
        ctx.emit("SYSTEM_ERROR", error);
        throw error;
      }

      ctx.broker.logger.info(
        `@{{../name}}.{{@key}}.commitToDb ${
          perf.stop('@{{../name}}.{{@key}}.commitToDb').time
        }ms`,
      );
      {{#ifCond should_inform_service '==' true}}
      const {  onBehalfOf, requestId } = ctx.meta;
      perf.start('{{../name}}.{{@key}}.publish.get')
      const fullEntity = await {{camelCase ../name}}.{{camelCase ../name}}.get({
        where: { id: entityId }
      });
      ctx.broker.logger.info(
        `{{../name}}.{{@key}}.publish.get ${
          perf.stop('{{../name}}.{{@key}}.publish.get').time
        }ms`,
      );


      if(ctx.broker.cacher){
        await ctx.broker.cacher.clean(`v1.{{../name}}.get:${entityId}**`);
      }


      perf.start('@{{../name}}.{{@key}}.emit');
      const event = {
        eventName: '{{@key}}',
        eventParams,
        entityModel: '{{../name}}',
        entityId,
        fullEntity: fullEntity,
        userId,
        sessionUser,
        requestOrigin,
        onBehalfOf,
        shouldInformUser:{{~#ifCond should_inform_user '==' true}} true {{else}} false {{/ifCond}},
        requestId
      };
      await channels(ctx.broker).queueEmit('{{@key}}', event);
      ctx.broker.logger.info(
        `@{{../name}}.{{@key}}.emit ${
          perf.stop('@{{../name}}.{{@key}}.emit').time
        }ms`,
      );
      ctx.broker.logger.info(
        `@{{../name}}.{{@key}}.publish ${
          perf.stop('@{{../name}}.{{@key}}.publish').time
        }ms`,
      );
      {{else}}   
      if(ctx.broker.cacher){
        await ctx.broker.cacher.clean(`v1.{{../name}}.get:${entityId}**`);
      }
      {{/ifCond}}
      return
    }
    }
  },
  {{/each}}
}
