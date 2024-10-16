
import {
  Service,
  ServiceContext,
  QueryParams,
  GetParams,
  ListOf,
} from 'shared-service/types';

const _ = require('lodash');
_.mixin(require('lodash-uuid'));
const { tokenHook, prepareQuery, getCleanedParams, getTargetQuery, inflateParams } = require("shared-service")

const models = require('../dataaccess');

/* eslint-disable */
const { MoleculerServerError, MoleculerClientError } = require("moleculer").Errors;

/* eslint-enable */
const { {{name}} } = require('../dataaccess');
const events = require('../events/index');

module.exports = {
  name: "{{this.name}}",
  version: 1,
  mixins: [tokenHook()],
  settings: { },
  actions: {
    get : {
      requiredRole: [
        'super',
        'supplier',
        'customerSubUnit',
        'customerSubUnitAdmin',
        'customerSubUnitPurchaser',
        'customerSubUnitPurchaserManager',
        'customerSubUnitEconomy'
      ],
      params: {
        id: { type: 'string', optional: false },
      },
      cache: {
        keys: [
          'id',
          '#sessionUser.roles',
          '#sessionUser.organization',
          '#sessionUser.activeMembership.role',
          '#sessionUser.activeMembership.customerSubUnit',
          '#cacheBuster',
        ],
        ttl: 60,
      },
      async handler(this: Service<GetParams>, ctx: ServiceContext<GetParams>) {
        const { sessionUser } = ctx.meta;
        const targetQuery = getTargetQuery(ctx.params);
        throw new MoleculerClientError(
          `{{name}} Not implemented`,
          500,
          'NOTIMPLEMENTED',
        );
      },
    },

    list : {
      requiredRole: [
        'super',
        'supplier',
        'customerSubUnit',
        'customerSubUnitAdmin',
        'customerSubUnitPurchaser',
        'customerSubUnitPurchaserManager',
        'customerSubUnitEconomy'
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
        query: { type: 'object', optional: true },
      },
      async handler(this: Service<QueryParams>, ctx: ServiceContext<QueryParams>) {
        ctx.params = getCleanedParams(ctx);
        const query = prepareQuery(ctx.params, {{name}}.{{name}}, models);
        const { sessionUser } = ctx.meta;

        throw new MoleculerClientError(
          `{{name}} Not implemented`,
          500,
          'NOTIMPLEMENTED',
        );
      },
    },
  },
};
