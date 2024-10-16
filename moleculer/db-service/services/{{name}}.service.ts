/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
import { ServiceContext, Service, ListOf } from 'shared-service/types';
{{#each actions}}
import {{@key}}Implementation from '../actions/{{../name}}/{{@key}}';
import {
  {{pascalCase ../name}}{{pascalCase @key}}Parameters,
} from 'domain-model/types/{{../clay_parent.clay_parent.name}}';
{{/each}}
{{#each fields}}
{{#ifCond type "==" "reference" ~}}
import { {{pascalCase referenceType}}Reference } from 'domain-model/types/{{referenceDomain}}';
{{/ifCond}}
{{/each}}
{{#each children}}
{{#each fields}}
{{#ifCond type "==" "reference" ~}}
import { {{pascalCase referenceType}}Reference } from 'domain-model/types/{{referenceDomain}}';
{{/ifCond}}
{{/each}}
{{/each}}

import {
  {{pascalCase name}},
  {{pascalCase name}}Reference,
  {{#each children}}
  {{pascalCase (singularize @key)}},
  {{/each}}
} from 'domain-model/types/{{clay_parent.clay_parent.name}}';

{{#each children}}
interface {{pascalCase (singularize @key)}}Parameter extends {{pascalCase (singularize @key)}} {
  target?: any;
  lookups?: any;
  lookupsIgnoreNotFound?: any;
}

{{/each}}


const { channels, tokenHook, loggerHook, prepareQuery, getCleanedParams, getTargetQuery,inflateParams, prettyPrintObject, createInflateParamsCache, appendParamsCache } = require('shared-service');

const _ = require('lodash');
_.mixin(require('lodash-uuid'));
const perf = require('execution-time')();

const models = require('../dataaccess');

/* eslint-disable */
const { MoleculerServerError, MoleculerClientError } = require("moleculer").Errors;

/* eslint-enable */
const { {{camelCase name}} } = require('../dataaccess');

{{#each children}}
{{#each fields}}
{{#ifCond type "==" "relation" ~}}
const { {{camelCase relation}} } = require('../dataaccess');
{{/ifCond}}
{{/each}}
{{/each}}

const events = require('../events/index');

const getChangedEntity = ( existingEntity?:{{pascalCase name}}, params?:any)=>{
  const changedEntity = _.cloneDeep(existingEntity||{});
  {{#each fields}}
  {{#ifCond type "==" "relation" ~}}
  if(params.{{camelCase @key}} !== undefined) {
    changedEntity.{{camelCase @key}} = params.{{camelCase @key}}
  }
  {{else}}
  if(params.{{@key}} !== undefined) {
    changedEntity.{{@key}} = params.{{@key}};
  }
  {{/ifCond}}
  {{/each}}
  {{#each children}}
  if(params.{{camelCase @key}} !== undefined) {
    changedEntity.{{camelCase @key}} = params.{{camelCase @key}};
  }
  if(params.{{camelCase @key}}Changes) {

    const {
      rowsToUpsert,
      rowsToDelete,
    } = params.{{camelCase @key}}Changes;
    if(!changedEntity.{{@key}}){
      changedEntity.{{@key}} = [];
    }
    if(rowsToUpsert) {
      rowsToUpsert.forEach((changedChild:{{pascalCase (singularize @key)}}Parameter) => {

      const matchFunction = changedChild.target? _.matches(changedChild.target): (r:{{pascalCase (singularize @key)}})=> r.id === changedChild.id;
      const existingChild = changedEntity.{{camelCase @key}}?.find(matchFunction);

      if(!existingChild) {
        changedEntity.{{@key}}.push(changedChild);
      } else {
        Object.assign(existingChild, changedChild);
      }
    });
    }
    if(rowsToDelete) {
      rowsToDelete.forEach((changedChild:{{pascalCase (singularize @key)}}Parameter) => {

      const matchFunction = changedChild.target? _.matches(changedChild.target): (r:{{pascalCase (singularize @key)}})=> r.id === changedChild.id;

      // eslint-disable-next-line no-param-reassign
      changedEntity.{{camelCase @key}} = changedEntity.{{camelCase @key}}.filter(_.negate(matchFunction));

    });
    }
  }
  {{/each}}
  if(params.metadata !== undefined) {
    changedEntity.metadata = _.merge(changedEntity.metadata, params.metadata);
  }
  return changedEntity;
}

module.exports = {
    name: "{{this.name}}",
    version: 1,
    mixins: [tokenHook(), loggerHook()],
    settings: { },
    actions: {
        {{#each actions}}
        {{clay_parent}}
        {{@key}}: {
            {{#if cache}}
              cache: {
                {{#if cache.cacheKeys }} keys: {{{json cache.cacheKeys}}}, {{/if}}
                {{#if cache.ttl }} ttl: {{cache.ttl}}, {{/if}}
              },
            {{/if}}
            requiredRole: [{{#each requiredRole}} "{{this}}",{{/each}}],
            params: {
              {{#each parameters}}
              {{#unless ui_only ~}}
              {{#ifCond type "==" "relation" ~}}
              {{camelCase @key}}: {
              {{else}}
              {{@key}}: {
              {{/ifCond}}
                {{> service-params parameter=this}}
                {{#ifCond type "==" "array" ~}}
                    type: 'array',
                    items: {
                      type: "object", props: {
                        {{#each props}}
                        {{#ifCond type "==" "relation" ~}}
                        {{camelCase @key}}: {
                        {{else}}
                        {{@key}}: {
                        {{/ifCond}}
                          {{> service-params parameter=this}}
                        },
                        {{/each}}
                        lookups: {type: 'object', optional: true },
                        lookupsIgnoreNotFound: {type: 'object', optional: true },
                        metadata: {type: 'object', optional: true },
                      }
                    }
                {{/ifCond}}
                {{#ifCond type "==" "imageArray" ~}}
                    type: 'array',
                {{/ifCond}}
                {{#ifCond type "==" "childrenChanges" ~}}
                    type: 'object',
                    props: {
                      rowsToUpsert: {
                        optional: true,
                        type: 'array',
                        items: {
                          type: 'object',
                          props: {
                            {{#each props}}
                            {{#ifCond type "==" "relation" ~}}
                            {{camelCase @key}}: {
                            {{else}}
                            {{@key}}: {
                            {{/ifCond}}
                              {{> service-params parameter=this}}
                            },
                            {{/each}}
                            target: { type: 'object', optional: true },
                            lookups: {type: 'object', optional: true },
                            lookupsIgnoreNotFound: {type: 'object', optional: true },
                            metadata: {type: 'object', optional: true },
                          }
                        },
                      },
                      rowsToDelete: {
                        optional: true,
                        type: 'array',
                        items: {
                          type: 'object',
                          props: {
                            id: {
                              type: 'string',
                              convert: true,
                              optional: true,
                            },
                            target: { type: 'object', optional: true },
                          },
                        },
                      },
                    }
                {{/ifCond}}
                {{#ifCond type "==" "stringArray" ~}}
                type: 'array',
            {{/ifCond}}
              },
              {{/unless}}
                {{/each}}
                lookups: {type: 'object', optional: true },
                lookupsIgnoreNotFound: {type: 'object', optional: true },
                metadata: {type: 'object', optional: true },
                target: {type: 'object', optional: true }
        },
      async handler(this:Service<{{pascalCase ../name}}{{pascalCase @key}}Parameters>, ctx:ServiceContext<{{pascalCase ../name}}{{pascalCase @key}}Parameters>):Promise<any> {
        perf.start('{{../name}}.{{@key}}: total');
        // eslint-disable-next-line
        ctx.actionDate = _.get(ctx,'meta.eventDate', new Date());
        ctx.params = getCleanedParams(ctx);
        // eslint-disable-next-line no-unused-vars
        let existing: {{pascalCase ../name}}|undefined;

        try {
          {{#unless snowflakeAccessControlPattern}}
          const { params } = ctx;

          // @ts-ignore
          if (params.id || params.target) {
            const query = getTargetQuery(params);

            // GET EXISTING
            perf.start('{{../name}}.{{@key}}: get');
            existing = await {{camelCase ../name}}.get({
              ...query,
            });
            ctx.broker.logger.info(`{{../name}}.{{@key}} - GET time: ${perf.stop('{{../name}}.{{@key}}: get').time}ms`);
          }
          if(existing) {
            const sessionUser = ctx.meta.sessionUser;
            // owningSupplierOrganizationId is a special case. Only allowed to be changed by internalServiceAccount

            if(
              // @ts-ignore
              existing.owningSupplierOrganizationId &&
              // @ts-ignore
              existing.owningSupplierOrganizationId !==
              // @ts-ignore
                ctx.params.owningSupplierOrganizationId &&
              !sessionUser.internalService) {
                // @ts-ignore
                delete ctx.params.owningSupplierOrganizationId;
            }


            {{#if overrideEntityAccessToUseReadAccess}}
            await {{{camelCase ../name}}}.verifyReadAccess(existing, sessionUser, ctx.meta)
            {{else}}
            await {{{camelCase ../name}}}.verifyWriteAccess(existing, sessionUser, ctx.meta)
            {{/if}}
            // @ts-ignore
            ctx.existingEntity = existing;
          }
          {{#unless canCreate}}
          else {
            throw new MoleculerClientError(`{{../name}} not found: ${prettyPrintObject(getTargetQuery(params), { multiline: false})}`, 404, "NOT_FOUND")
          }
          {{/unless}}
          {{/unless}}

          if(!existing) {
            const sessionUser = ctx.meta.sessionUser;

            // @ts-ignore
            const paramsOwningSupplierOrganizationId = _.get(ctx.params, 'owningSupplierOrganizationId');
            if (!paramsOwningSupplierOrganizationId && _.get(sessionUser, 'organization.usesSupplierCustomer')) {
              const orgId = _.get(sessionUser, 'organization.id');
              if(!orgId) {
                throw new MoleculerClientError('No organization found on sessionUser');
              }
              // @ts-ignore
              ctx.params.owningSupplierOrganizationId = orgId
            }
          }

            const finderObject = {};
            {{#each parameters}}
            {{#ifCond type "==" "array" ~}}
            {{#each props}}
            {{#ifCond type "==" "relation" ~}}
            if(ctx.params.{{../name}}) {
              // @ts-ignore
              finderObject.{{camelCase relation}} =
              // @ts-ignore
               finderObject.{{camelCase relation}} || [];
              // @ts-ignore
              finderObject.{{camelCase relation}} =
              // @ts-ignore
               finderObject.{{camelCase relation}}.concat(ctx.params.{{../name}}.map((r:any) => _.get(r, '{{camelCase @key}}.id')).filter(_.identity));
            }
            {{/ifCond}}
            {{/each}}
            {{/ifCond}}
            {{#ifCond type "==" "relation" ~}}
            // @ts-ignore
            finderObject.{{camelCase relation}} =
            // @ts-ignore
             finderObject.{{camelCase relation}} || [];
            if(ctx.params.{{camelCase @key}}){
              // @ts-ignore
              finderObject.{{camelCase relation}}.push(ctx.params.{{camelCase @key}}.id)
            }
            {{/ifCond}}
            {{/each}}

          // INFLATE PARAMS
          perf.start('{{../name}}.{{@key}}: inflate');
          ctx.params = await inflateParams(
            ctx,
            models,
            await appendParamsCache(
              // @ts-ignore
              createInflateParamsCache(ctx.existingEntity),
              finderObject,
              models,
            ),
          );
          ctx.broker.logger.info(`{{../name}}.{{@key}} - inflate time: ${perf.stop('{{../name}}.{{@key}}: inflate').time}ms`);
          
          const result = await {{@key}}Implementation.apply(this, 
            // @ts-ignore
            [ctx, ctx.params, existing]);
          return result;
        } catch(e) {
          if(e.code === 'MODULE_NOT_FOUND') {
            throw new MoleculerServerError("Not implemented", 500, "NOT_IMPLEMENTED", e)
          } else if(e instanceof MoleculerClientError) {
            throw e
          } else if (e.name === 'MoleculerClientError') {
            throw new MoleculerClientError(e.message, e.code, e.type, e.data);
          } else if(e instanceof MoleculerServerError) {
            throw e
          } else if (e.name === 'MoleculerServerError') {
            throw new MoleculerServerError(e.message, e.code, e.type, e.data);
          } else {
            ctx.broker.logger.error('action error', e);
            throw new MoleculerServerError("Action Error", 500, "INTERNAL_SERVER_ERROR", e);
          }
        }
      }
    },
        {{/each}}
        get : {
          requiredRole: [
            'super',
            'supplier',
            'customerSubUnitAdmin',
            'customerSubUnitPurchaser',
            'customerSubUnitPurchaserManager',
            'customerSubUnitEconomy'
          ],
          params: {
            id: { type: 'string', optional: true },
            target: { type: 'object', optional: true },
          },
          cache: {
            keys: [
              'id',
              'target',
              '#sessionUser.roles',
              '#sessionUser.organization.id',
              '#sessionUser.activeMembership.role',
              '#sessionUser.activeMembership.customerSubUnit',
              '#cacheBuster'
            ],
            ttl: 300,
          },
          async handler(this: Service<any>, ctx:ServiceContext<any>):Promise<any> {
            const { sessionUser } = ctx.meta;
            if(!ctx.params.id && !ctx.params.target) {
              throw new MoleculerClientError('Parameter target or id must be specified, both are missing', 400)
            }
            const targetQuery = getTargetQuery(ctx.params);

            const result = await {{camelCase name}}.getEntityForUser(
              targetQuery,
              sessionUser,
            );
            if (!result) {
              throw new MoleculerClientError(
                `{{name}} not found`,
                404,
                'NOTFOUND',
              );
            }
            await {{camelCase name}}.verifyReadAccess(result, sessionUser, ctx.meta);
            {{#each children}}
            {{#each fields}}
            {{#ifCond type "==" "relation" ~}}
            await {{camelCase relation}}.ensureAutoLoadChildReferences(this.broker, result.{{@../key}}, '{{@key}}', ctx.meta);
            {{/ifCond}}
            {{#ifCond type "==" "reference" ~}}
            {{#if autoLoadReference}}

            if (result.{{@../key}}?.length) {
              const references{{pascalCase @key}} = <ListOf<{{pascalCase referenceType}}Reference>> await this.callAsLoggedInUser(ctx, 'v1.{{referenceType}}.list', { query: { id: { in: _.uniq(result.{{@../key}}.map((x: any) => x.{{@key}}?.id)) } }, pageSize: -1 });
              for (const row of references{{pascalCase @key}}.rows) {
                for (const item of result.{{@../key}}) {
                  if (item.{{@key}}?.id === row.id) {
                    item.{{@key}} = row;
                  }
                }
              }
            }

            {{/if}}
            {{/ifCond}}
            {{/each}}
            {{/each}}

            {{#each fields}}
            {{#ifCond type "==" "reference" ~}}
            {{#if autoLoadReference}}

            if (result.{{@key}}?.id) {
              const references{{pascalCase @key}} = <ListOf<{{pascalCase referenceType}}Reference>> await this.callAsLoggedInUser(ctx, 'v1.{{referenceType}}.list', { query: { id: result.{{@key}}.id } });
              result.{{@key}} = references{{pascalCase @key}}.rows[0];
            }

            {{/if}}
            {{/ifCond}}
            {{/each}}
            return result;
          },
        },

        list: {
          requiredRole: [
            'super',
            'supplier',
            'customerSubUnitAdmin',
            'customerSubUnitPurchaser',
            'customerSubUnitPurchaserManager',
            'customerSubUnitEconomy',
          ],
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
            searchString: { type: 'string', optional: true },
            query: { type: 'object', optional: true },
          },
          async handler(ctx:ServiceContext<any>):Promise<ListOf<{{pascalCase name}}Reference>> {
            ctx.params = getCleanedParams(ctx);
            const query = prepareQuery(
              ctx.params,
              {{camelCase name}}.{{camelCase name}},
              models
            );
            const { sessionUser } = ctx.meta;

            // required for querying using associations
            const result = await {{camelCase name}}.listForUser(query, sessionUser, ctx.meta);
            await {{camelCase name}}.ensureAutoLoadReferences(ctx.broker, result.rows, ctx.meta);
            return result;
          },
        },
      },

    events: {
      {{#each listeners}}
        {{{@key}}}: {
           async handler(this: Service<any>, event:any,  sender:string, eventName:string):Promise<any> {
            {{#each reactions}}
            try{
              // eslint-disable-next-line global-require
              const implementation = require('../listeners/{{../name}}/{{this}}')
              await implementation.apply(this, [event,eventName ])
            } catch(e) {
              const isProductionCluster = process.env.PRODUCTION === 'true';
              if (!isProductionCluster) {
                // eslint-disable-next-line no-console
                console.error('crash in listener isProductionCulster = ', isProductionCluster);
                // eslint-disable-next-line no-console
                console.error(e);
              } else {
                try {
              const subject = isProductionCluster
              ? `Warning! PRODUCTION ENVIRONMENT Reaction failed with unexpected error: ${e.name} ${e.message}`
              : `DEVELOPMENT ENVIRONMENT Reaction failed with unexpected error: ${e.name} ${e.message}`;
              await this.broker.call(
                'v1.email.sendEmail',
                {
                  to: 'dev@flaivy.com',
                  subject,
                  markupBody: `
                  A reaction to an event failed to execute with the following error

                  **REACTION**
                  {{this}}

                  **TRIGGERING EVENT**
                  ${eventName}

                  **ERROR**
                  ${e.stack}

                  ${prettyPrintObject(e)}

                  **EVENT**
                  ${prettyPrintObject(event)}

                  **CREATE INBOX URL**

                  https://trello.com/en-GB/add-card?name=${encodeURI(
                    subject,
                  )}&desc=${encodeURI(e.stack)}&idList=612507755e32ed5cc898d4ad

                  `,
                },
                tokenHook.createInternalServiceMeta('listener'),
              );
              }  catch (err2) {
                  // eslint-disable-next-line no-console
                  console.error('crash in listener isProductionCulster = ', isProductionCluster);
                  // eslint-disable-next-line no-console
                  console.error(e);
              }
              }
            }
            {{/each}}
          },
        },
      {{/each}}
    },

    methods: {
      async updateOrCreate(ctx:ServiceContext<any>, params:any, existingEntity?:{{pascalCase name}}):Promise<void> {
        if(!params) {
          // eslint-disable-next-line no-param-reassign
          params = ctx.params;
        }
        if(!existingEntity) {
          // eslint-disable-next-line no-param-reassign
          existingEntity = ctx.existingEntity;
        }
        const changedEntity = getChangedEntity( existingEntity, params);
        // CREATE NEW
        if (!existingEntity) {
          // eslint-disable-next-line no-param-reassign
          changedEntity.id = changedEntity.id || _.uuid();
          const ensuredParams = await {{camelCase name}}.ensureInvariants(changedEntity);
          const event = events.{{{toUpper (snakeCase name)}}}_CREATED(ensuredParams);
          await event.publish(ctx);
          return
        }

        // UPDATE
        perf.start('{{camelCase name}}.getChanges');
        const changes = await {{camelCase name}}.getChanges(existingEntity,changedEntity);
        ctx.broker.logger.info(`{{camelCase name}}.getChanges  ${perf.stop('{{camelCase name}}.getChanges').time}ms`);
        const event = events.{{{toUpper (snakeCase name)}}}_UPDATED(changes);
        await event.publish(ctx);
      },
      callAsLoggedInUser(ctx:ServiceContext<any>, actionName:string, params:any):any {
        return ctx.call(actionName, params);
      },
      callAsSystemUser(ctx:ServiceContext<any>, actionName:string, params:any):any {
        return ctx.broker.call(
          actionName,
          params,
          tokenHook.createInternalServiceMeta('{{@root.name}}'),
        );
      },
      queueCallAsLoggedInUser(ctx:ServiceContext<any>, actionName:string, params:any):void {
         channels(ctx.broker).queueCall(
          actionName,
          params,
          {meta: ctx.meta},
        );
      },

      queueCallAsSystemUser(this: Service<any>,actionName:string, params:any):void {
        channels(this.broker).queueCall(
          actionName,
          params,
          tokenHook.createInternalServiceMeta('{{@root.name}}'),
        );
      },
    },

    created() {},

    started() {},

    stopped() {}
};
