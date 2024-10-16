/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
const { tokenHook, getCleanedParams, queryOptions } = require('shared-service');
const glob = require('glob');
const _ = require('lodash');

function removeDangerousChars(params) {
  if (_.isString(params)) return params.replace(/['|"|;]/g, '');
  if (_.isArray(params)) return params.map(x => removeDangerousChars(x));
  if (_.isObject(params)) {
    const result = {};
    for (const [key, value] of Object.entries(params)) {
      result[key] = removeDangerousChars(value);
    }
    return result;
  }
  return params;
}

const reportService = {
  name: 'reports',
  mixins: [tokenHook()],
  methods: {
    removeDangerousChars,
  },
  actions: {},
};

function paramsToArray(params) {
  if (!params) return [];
  const keys = Object.keys(params);
  const result = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result.push({ ...params[key], name: key });
  }
  return result;
}

function decorateHandler(service, name) {
  if (!service.query) {
    throw new Error(
      `Report service need to have a query defined${service.name}`,
    );
  }
  // eslint-disable-next-line no-param-reassign
  service.name = name.replace('.js', '');

  if (service.cache !== false) {
    // eslint-disable-next-line no-param-reassign
    service.cache = {
      keys: _.uniq([
        ..._.keys(_.get(service, 'params', {})),
        'page',
        'sort',
        'supplierNumbers',
        '#sessionUser.activeMembership',
        '#sessionUser.roles',
        '#sessionUser.organization',
      ]),
      ttl: _.get(service, 'cache.ttl', 60 * 60),
    };
  }

  if (_.get(service, 'params.range.columnOptions')) {
    _.set(service, 'params.rangeColumn', {
      type: 'string',
      optional: true,
    });
  }
  _.set(service, 'params.page', {
    type: 'number',
    convert: true,
    optional: true,
  });
  _.set(service, 'params.pageSize', {
    type: 'number',
    convert: true,
    optional: true,
  });
  _.set(service, 'params.sort', { type: 'string', optional: true });
  _.set(service, 'params.supplierNumbers', {
    type: 'array',
    optional: true,
  });

  // eslint-disable-next-line no-param-reassign
  service.handler = async ctx => {
    ctx.params = getCleanedParams(ctx);
    ctx.params = reportService.methods.removeDangerousChars(ctx.params);
    if (!ctx.params.page) {
      ctx.params.page = 1;
    }

    const options = queryOptions.getReportOptions(ctx, service);

    const result = await service.query(ctx, options);

    // vi kan kolla om result.rows innehåller columns som vi förväntar oss, eller krascha

    return {
      ...result,
      columns: service.columns,
      type: service.type,
      isDeprecated: !!service.isDeprecated,
      filterables: paramsToArray(service.params).filter(
        x => !x.isServicParameter && x.name !== 'sort' && x.name !== 'page',
      ),
    };
  };

  return service;
}

const files = glob.globSync(['services/reports/**/*.js'], {
  ignore: '**/*.spec.*',
});
const actions = files
  .map(x => {
    const trimmedFile = x.replace('services/reports/', '').replace('.js', '');
    const name = trimmedFile.replace(/\//g, '.');
    return {
      name,
      // eslint-disable-next-line
      implementation: require('./' + trimmedFile),
    };
  })
  .filter(x => x.implementation.query);

for (let i = 0; i < actions.length; i++) {
  const action = actions[i];
  reportService.actions[action.name] = decorateHandler(
    action.implementation,
    action.name,
  );
}

reportService.actions.list = {
  name: 'list',
  requiredRole: ['super', 'supplier', 'customerSubUnitPurchaserManager'],
  async handler(ctx) {
    const actionList = (
      await Promise.all(
        await ctx.broker.registry.actions
          .list({ onlyAvailable: true })
          .filter(x => _.startsWith(x.name, 'reports'))
          .map(x => ctx.broker.registry.actions.get(x.name)),
      )
    ).map(x => _.get(x, 'endpoints[0].action'));

    const fullList = actionList
      .filter(x => x.type === 'list')
      .map(x =>
        _.pick(x, [
          'title',
          'category',
          'description',
          'name',
          'requiredRole',
          'entityBound',
          'standalone',
          'standaloneAndCopack',
        ]),
      );

    if (_.get(ctx.meta, 'sessionUser.organization.usesSupplierCustomer')) {
      return fullList.filter(x => x.standalone || x.standaloneAndCopack);
    }

    return fullList.filter(x => !x.standalone);
  },
};

module.exports = reportService;
