/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require('lodash')
_.mixin(require('lodash-uuid'))
const domainModel = require('domain-model');

/* eslint-disable */
const { tokenHook, isSameImage, transformToSequelizeOperators, queryOptions, accessRules: {isInternalService, getRoles} } = require('shared-service');
const moment = require('moment');
const {convertHashWhereToSequelize} = require('shared-service');
let extensions = {}
//const perf = require('execution-time')();

const { getGlobalFilters } = queryOptions;


try {
  extensions = require('./{{name}}.model.extensions')
} catch(e) {}
/* eslint-enable */

{{#eachUnique fields 'relation'}}
{{#if relation}}
{{#ifCond relation '==' ../name}}
{{else}}
const {{camelCase relation}} = require('./{{{relation}}}.model')
{{/ifCond}}
{{/if}}
{{/eachUnique}}

{{#each children}}
{{#each belongs_to}}
const {{camelCase this}} = require('./{{{this}}}.model')
{{/each}}
{{/each}}
const { sequelize, Sequelize } = require('./sequelize');
const { userListAccessFilter, userGetFilter, verifyWriteAccess, verifyReadAccess
 } = require('./{{name}}.model.useraccess')

 const userGetFilterServiceOverride = sessionUser => {
  if (isInternalService(sessionUser)) {
    return { includesForUserAccess: [], whereForUserAccess: {} };
  }
  return userGetFilter(sessionUser);
};

const userListAccessFilterServiceOverride = (sessionUser, requestMeta) => {
  if (isInternalService(sessionUser)) {
    return { includesForUserAccess: [], whereForUserAccess: {} };
  }
  return userListAccessFilter(sessionUser, requestMeta);
};
const verifyWriteAccessServiceOverride = (existing, sessionUser, requestMeta) => {
  if (isInternalService(sessionUser)) {
    // es-lint-disable-next-line consistent-return
    return true;
  }
  return verifyWriteAccess(existing, sessionUser, requestMeta);
};
const verifyReadAccessServiceOverride = (existing, sessionUser, requestMeta) => {
  if (isInternalService(sessionUser)) {
    // es-lint-disable-next-line consistent-return
    return true;
  }
  return verifyReadAccess(existing, sessionUser, requestMeta);
};


const {{camelCase this.name}} = sequelize.define('{{camelCase this.name}}', {
  {{> table-fields fields=fields}}
}, {
  indexes: [
    {{#each fields}}
    {{#ifCond type "==" "relation"}}
    {
    fields: ['{{camelCase @key}}Id'],
    {{#if index_name}}name: '{{index_name}}'{{/if}}
    },
    {{/ifCond}}
    {{#ifCond type "==" "userAccessString"}}
    {
    fields: ['{{camelCase @key}}'],
    {{#if index_name}}name: '{{index_name}}'{{/if}}
    },
    {{/ifCond}}
    {{#if fuzzy_searchable}}{{#ifCond type '!=' 'relation'}}{{#ifCond type '!=' 'enum'}}{{#ifCond type '!=' 'datetime'}}{{#ifCond type '!=' 'number'}}{{#ifCond type '!=' 'integer'}}{{#ifCond type '!=' 'boolean'}}
    {
      fields: ['{{@key}}'],
      using: 'gin',
      operator: 'gin_trgm_ops',

    },
    {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/if}}
    {{#if searchable}}{{#ifCond type '!=' 'relation'}}{{#ifCond type '!=' 'enum'}}{{#ifCond type '!=' 'datetime'}}{{#ifCond type '!=' 'number'}}{{#ifCond type '!=' 'integer'}}{{#ifCond type '!=' 'boolean'}}
    {
      fields: ['{{@key}}'],
    },
    {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/if}}
    {{#if (or unique_with unique_with_literal unique_when)}}
    {

     {{#if index_name}}name: '{{index_name}}',{{else}}name: '{{../name}}_unique_{{@key}}',{{/if}}
      unique: true,
      {{#if (or unique_with unique_with_literal)}}
      fields: [{{#ifCond type '!=' 'relation'}} '{{@key}}', {{else}} '{{camelCase @key}}Id', {{/ifCond}} {{#each unique_with}} '{{{this}}}' ,{{/each}} {{#if unique_with_literal}} {{#each unique_with_literal}} Sequelize.literal(`{{{this}}}`),{{/each}}{{/if}}],
      {{else}}
      fields: ['{{camelCase @key}}'],
      {{/if}}
      {{#if unique_when}}
      where: transformToSequelizeOperators({{{json unique_when}}})
      {{/if}}
    },
    {{/if}}
  {{/each}}
  ]
});

{{#each fields}}
{{#ifCond type '==' 'relation'}}
{{#ifCond relation '==' ../name}}
{{camelCase ../name}}.belongsTo({{camelCase relation}}, { onDelete: 'restrict', as: '{{camelCase @key}}', foreignKey: { allowNull: true } });
{{else}}
{{camelCase ../name}}.belongsTo({{camelCase relation}}.{{camelCase relation}}, { onDelete: 'restrict',
 {{#ifCond @key '!=' relation}}as: '{{camelCase @key}}',{{/ifCond}}
  foreignKey: { allowNull: true } });
{{/ifCond}}
{{/ifCond}}
{{/each}}

{{#each children}}
const {{@key}} = sequelize.define('{{@key}}', {
  {{> table-fields fields=fields}},
  {{#ifCond doNotGenerateRowNumbers '==' true}}
  {{else}}
  rowNumber: { type: Sequelize.INTEGER }
  {{/ifCond}}
}, {
  indexes: [
    {{#unless skipForeignReferenceIndex}}
    {
      fields: ['{{../name}}Id']
    },
    {{/unless}}
    {{#each fields}}
    {{#ifCond type "==" "relation"}}
    {{#unless skipForeignReferenceIndex}}
    {
    fields: ['{{camelCase @key}}Id']
    },
    {{/unless}}
    {{/ifCond}}
    {{#ifCond type "==" "userAccessString"}}
    {
    fields: ['{{camelCase @key}}'],
    },
    {{/ifCond}}
  {{/each}}
  ]
});
{{#each fields}}

{{#ifCond type "==" "relation"}}
{{camelCase @../key}}.belongsTo({{camelCase relation}}.{{camelCase relation}}, {  onDelete: 'restrict',
{{#ifCond relation "!=" @key}}
as: '{{camelCase @key}}',
{{/ifCond}}
foreignKey: { allowNull: true } });
{{camelCase relation}}.{{camelCase relation}}.hasOne({{camelCase @../key}}, { onDelete: 'restrict',
{{#ifCond relation "!=" @key}}
as: '{{camelCase @key}}',
{{/ifCond}}
foreignKey: { allowNull: true } });
{{/ifCond}}
{{/each}}
{{camelCase @key}}.belongsTo({{camelCase ../name}}, { onDelete: 'restrict',  foreignKey: { allowNull: false } });
{{camelCase ../name}}.hasMany({{@key}}, {  foreignKey: { allowNull: false } });
{{/each}}

function excludesAttributesForUser(sessionUser){
  const rolesForRead = {
  {{#each fields}}
  {{#if roles_for_read}}
    {{@key}}: [
    {{#each roles_for_read}}
      '{{this}}',
    {{/each}}
  ],
  {{/if}}
  {{/each}}
  {{#each calculatedFields}}
  {{#if roles_for_read}}
    {{@key}}: [
    {{#each roles_for_read}}
      '{{this}}',
    {{/each}}
  ],
  {{/if}}
  {{/each}}
  }
  const result = [];
  for (const [key, requireRolesForField] of Object.entries(rolesForRead)) {
      if(!_.intersection(requireRolesForField, getRoles(sessionUser)).length > 0) {
      result.push(key);
      }
  }
  return result;
}

function calculatedFieldsForEntityGet(path, sessionUser, options={}) {
  if(!path) throw new Error('We need to have a path to calculate the literals')

  const { useAttributesInReference, useAttributesInMinimumReference, as } = options;
  /* eslint-disable */
 const globals = getGlobalFilters(path, sessionUser);

  if (as) {
    globals.tableName = as;
  }
  /* eslint-enable */
  const allCalculatedFields = [
    {{#each calculatedFields ~}}
    {{~#ifCond only_available_in_list '!=' true}}
      [Sequelize.literal(`({{{selfContainedQuery}}})`), "{{@key}}"],
    {{/ifCond}}
    {{/each ~}}
    ];

  const calculatedFieldsInReference = [
    {{#each calculatedFields ~}}{{~#ifCond is_available_in_reference '==' true}}
        [Sequelize.literal(`({{{selfContainedQuery}}})`), "{{@key}}"],
    {{/ifCond}}{{/each ~}}
    ];

  const calculatedFieldsInMinimumReference = [
      {{#each calculatedFields ~}}{{~#ifCond is_available_in_minimum_reference '==' true}}
          [Sequelize.literal(`({{{selfContainedQuery}}})`), "{{@key}}"],
      {{/ifCond}}{{/each ~}}
  ];

  let calculatedFieldsToUse = allCalculatedFields;
  if (useAttributesInMinimumReference) {
    calculatedFieldsToUse = calculatedFieldsInMinimumReference;
  } else if (useAttributesInReference) {
    calculatedFieldsToUse = calculatedFieldsInReference;
  }

  const excludeAttributes = excludesAttributesForUser(sessionUser);
  return calculatedFieldsToUse.filter(x=>!_.includes(excludeAttributes, x[1]))
}

function calculatedFieldsForEntityList(path, sessionUser) {
  if(!path) throw new Error('We need to have a path to calculate the literals')

  /* eslint-disable */
  const globals = getGlobalFilters(path, sessionUser)
  /* eslint-enable */

  const allCalculatedFields = [
    {{#each calculatedFields ~}}
      {{~#ifCond is_available_in_reference '==' true}}[Sequelize.literal(`({{{selfContainedQuery}}})`), "{{@key}}"],{{/ifCond}}
      {{~#ifCond only_available_in_list '==' true}}[Sequelize.literal(`({{{selfContainedQuery}}})`), "{{@key}}"],{{/ifCond}}
    {{/each ~}}
    ];
  const excludeAttributes = excludesAttributesForUser(sessionUser);
  return allCalculatedFields.filter(x=>!_.includes(excludeAttributes, x[1]))
}

function includeAttributesForReference(sessionUser) {
  if(!sessionUser) {
    throw new Error('We need to have a sessionUser to get attributes for reference')
  }
  const { internalService } = sessionUser;

  const allReferences = [ 'id',
    {{#each fields}}
      {{#ifCond type '!=' 'relation'}}{{~#ifCond is_available_in_reference '==' true}}'{{@key}}', {{/ifCond}}{{/ifCond}}
      {{#ifCond type '==' 'relation'}}{{~#ifCond is_available_in_reference '==' true}}'{{camelCase @key}}Id', {{/ifCond}}{{/ifCond}}
    {{/each}}
    'metadata'
   ];
  if(internalService){
    return allReferences;
  }

  const excludeAttributes = excludesAttributesForUser(sessionUser);
  return allReferences.filter(x=>!_.includes(excludeAttributes, x))
}

function includeAttributesForMinimalReference(sessionUser) {
  if(!sessionUser) {
    throw new Error('We need to have a sessionUser to get attributes for reference')
  }
  const { internalService } = sessionUser;

  const allReferences = [ 'id',
    {{#each fields}}
      {{#ifCond type '!=' 'relation'}}{{~#ifCond is_available_in_minimum_reference '==' true}}'{{@key}}', {{/ifCond}}{{/ifCond}}
      {{#ifCond type '==' 'relation'}}{{~#ifCond is_available_in_minimum_reference '==' true}}'{{camelCase @key}}Id', {{/ifCond}}{{/ifCond}}
    {{/each}}
   ];
  if(internalService){
    return allReferences;
  }

  const excludeAttributes = excludesAttributesForUser(sessionUser);
  return allReferences.filter(x=>!_.includes(excludeAttributes, x))
}

function attributesForUserEntityList(sessionUser){
  // we never include calculated fields in  the list
  const excludeAttributes = excludesAttributesForUser(sessionUser);
  return includeAttributesForReference(sessionUser)
            .filter(x=>!_.includes(excludeAttributes, x))
}

function attributesForEntityGet(path, options = {}){
  const { excludeCalculatedFields, useAttributesInReference, useAttributesInMinimumReference } = options;
  let include = [];

  if(!excludeCalculatedFields) {
    const superUser = tokenHook.createInternalServiceMeta('getAccess').meta.sessionUser;
    include = [...calculatedFieldsForEntityGet(path, superUser, options)]
  }
  if(useAttributesInMinimumReference){
    include = [...include, ...includeAttributesForMinimalReference({internalService: true})];
  } else if(useAttributesInReference) {
    include = [...include, ...includeAttributesForReference({internalService: true})];
  } else {
    return { include }; // include all attributes for the entity plus possible calculated fields
  }
  return include; // this selects these attributes
}

function attributesForUserEntityGet(sessionUser, path, options = {}){
  const { excludeCalculatedFields, useAttributesInReference, useAttributesInMinimumReference } = options;
  let include = [];

  if(!excludeCalculatedFields) {
    include = [...calculatedFieldsForEntityGet(path, sessionUser, options)]
  }
  if(useAttributesInMinimumReference){
    include = [...include, ...includeAttributesForMinimalReference(sessionUser)];
  } else if(useAttributesInReference) {
    include = [...include, ...includeAttributesForReference(sessionUser)];
  } else {
    return { include, exclude: excludesAttributesForUser(sessionUser) }; // intentionally different from the above function
  }
  return include;
}

async function get(query) {
  if(!query.where) {
    throw new Error('If no query is provided it will return a random result');
  }

  const includeForEntityGet = [
    {{#each fields}}
    {{#ifCond type '==' 'relation'}}
    {{#ifCond relation '==' ../name}}   // this is a self reference
    {
      model: {{camelCase relation}},
      as: '{{camelCase @key}}',
      attributes: attributesForEntityGet(
        ['{{camelCase ../name}}'],
        {
          {{#ifCond use_minimum_reference '==' true}}
            useAttributesInMinimumReference: true,
          {{else}}
            useAttributesInReference: true,
          {{/ifCond}}
          {{#ifCond exclude_calculated_fields '==' true}}
            excludeCalculatedFields: true,
          {{/ifCond}}
        })
    },
    {{else}}
    {
      model: {{camelCase relation}}.{{camelCase relation}},
      as: '{{camelCase @key}}',
      attributes: {{camelCase relation}}.attributesForEntityGet(
        [ '{{camelCase relation}}'],
        {
          as: '"{{camelCase @key}}"',
          {{#ifCond use_minimum_reference '==' true}}
            useAttributesInMinimumReference: true,
          {{else}}
            useAttributesInReference: true,
          {{/ifCond}}
          {{#ifCond exclude_calculated_fields '==' true}}
            excludeCalculatedFields: true,
          {{/ifCond}}
        },
      )
    },
    {{/ifCond}}{{/ifCond}}
    {{/each}}
  ];

  //perf.start("get {{camelCase name}} found")
  const found{{pascalCase name}}s = await {{{camelCase name}}}.findAll({
    attributes: attributesForEntityGet(['{{camelCase this.name}}'], { excludeCalculatedFields: false }),
    include: includeForEntityGet,
    subQuery: false,
    ...query,
    raw: true,
    nest: true,
  });
  // console.log("get {{camelCase name}} found", perf.stop("get {{camelCase name}} found").time)
  if(found{{pascalCase name}}s.length > 1) {
    throw new Error(`query returned unexpected amount of results. ${JSON.stringify(query)}`)
  }
  if(found{{pascalCase name}}s.length === 0) {
    return undefined;
  }
  const found{{pascalCase name}} = found{{pascalCase name}}s[0];

  {{#each fields}}
  {{#ifCond type '==' 'relation'}}
  if(!found{{{pascalCase ../name}}}.{{camelCase @key}}Id){
    found{{pascalCase ../name}}.{{camelCase @key}}Id = null;
  }
  if(!found{{{pascalCase ../name}}}.{{camelCase @key}}.id){
    found{{pascalCase ../name}}.{{camelCase @key}} = null;
  }
  {{/ifCond}}
  {{/each}}


  {{#each children}}
  //perf.start("get {{camelCase @key}} findall")
  const {{camelCase @key}}List = await {{camelCase @key}}.findAll({
    where:  { {{camelCase ../name}}Id: found{{pascalCase ../name}}.id },
    include: [
      {{#each fields}}
      {{#ifCond type '==' 'relation'}}
      {
        model: {{camelCase relation}}.{{camelCase relation}},
        {{#ifCond relation '!=' @key}}
        as: '{{camelCase @key}}',
        {{/ifCond}}

        attributes: {{camelCase relation}}.attributesForEntityGet(
          [ '{{camelCase relation}}'],
          {
            {{#ifCond use_minimum_reference '==' true}}
              useAttributesInMinimumReference: true,
            {{else}}
              useAttributesInReference: true,
            {{/ifCond}}
            {{#ifCond exclude_calculated_fields '==' true}}
              excludeCalculatedFields: true,
            {{/ifCond}}
          },
        ),
      },
      {{/ifCond}}
      {{/each}}
    ],
    order: [
      {{#ifCond doNotGenerateRowNumbers '==' true}}
      ['id', 'ASC'],
      {{else}}
      ['rowNumber', 'ASC'],
      {{/ifCond}}
      ],
    raw: true,
    nest: true,
  });
  // console.log("get {{camelCase @key}} findall", perf.stop("get {{camelCase @key}} findall").time)

  // eslint-disable-next-line no-unused-vars, no-empty, @typescript-eslint/no-unused-vars
  for (const row of {{camelCase @key}}List) {
    {{#each fields}}
    {{#ifCond type '==' 'relation'}}
    if(!row.{{camelCase @key}}Id){
      row.{{camelCase @key}}Id = null;
    }
    if(!row.{{camelCase @key}}.id){
      row.{{camelCase @key}} = null;
    }
    {{/ifCond}}
    {{/each}}
  }
  {{/each}}

  return {
    ...found{{pascalCase name}},
    {{#each children}}{{camelCase @key}}: {{camelCase @key}}List,{{/each}}
  }
}

async function getEntityForUser(query, sessionUser) {
  if(!query.where) {
    throw new Error('If no query is provided it will return a random result');
  }

  if (!sessionUser) throw new Error('decoded token must be provided');
  const {includesForUserAccess,whereForUserAccess} = userGetFilterServiceOverride(sessionUser);
  const newWhere = { ...query.where, ...whereForUserAccess };

  const includesForUserEntityGet = [
    {{#each fields}}
    {{#ifCond type '==' 'relation'}}
    {{#ifCond relation '==' ../name}}
    {
      model: {{camelCase relation}},
      as: '{{camelCase @key}}',
      attributes: attributesForUserEntityGet(sessionUser,
        ['{{camelCase ../name}}'],
        {
          {{#ifCond use_minimum_reference '==' true}}
            useAttributesInMinimumReference: true,
          {{else}}
            useAttributesInReference: true,
          {{/ifCond}}
          {{#ifCond exclude_calculated_fields '==' true}}
            excludeCalculatedFields: true,
          {{/ifCond}}
        })
    },
    {{else}}
    {
      model: {{camelCase relation}}.{{camelCase relation}},
      as: '{{camelCase @key}}',
      attributes: {{camelCase relation}}.attributesForUserEntityGet(sessionUser,
        [ '{{camelCase relation}}'],
        {
          as: '"{{camelCase @key}}"',
          {{#ifCond use_minimum_reference '==' true}}
            useAttributesInMinimumReference: true,
          {{else}}
            useAttributesInReference: true,
          {{/ifCond}}
          {{#ifCond exclude_calculated_fields '==' true}}
            excludeCalculatedFields: true,
          {{/ifCond}}
        },
      )
    },
    {{/ifCond}}{{/ifCond}}
    {{/each}}
    {{#each children}}
      {
        model: {{camelCase @key}},
        include: [
          {{#each fields}}
          {{#ifCond type '==' 'relation'}}
          {
            model: {{camelCase relation}}.{{camelCase relation}},
            {{#ifCond relation '!=' @key}}
            as: '{{camelCase @key}}',
            {{/ifCond}}
            attributes: {{camelCase relation}}.attributesForUserEntityGet(sessionUser,
              ['{{camelCase ../this.name}}', '{{camelCase relation}}'],
              {
                {{#ifCond use_minimum_reference '==' true}}
                  useAttributesInMinimumReference: true,
                {{else}}
                  useAttributesInReference: true,
                {{/ifCond}}
                {{#ifCond exclude_calculated_fields '==' true}}
                  excludeCalculatedFields: true,
                {{/ifCond}}
              },
            )
          },
          {{/ifCond}}
          {{/each}}
        ],
      },
    {{/each}}
  ];

  const include = [...includesForUserEntityGet, ...includesForUserAccess]
  const all = await {{{camelCase name}}}.findAll({
    attributes: attributesForUserEntityGet(sessionUser, ['{{camelCase this.name}}'], { excludeCalculatedFields: true }),
    include,
    subQuery: false,
    ...query,
    where:newWhere,
    order: [
      {{#each children}}
      {{#ifCond doNotGenerateRowNumbers '==' true}}
      [{{@key}}, 'id', 'ASC'],
      {{else}}
      [{{@key}}, 'rowNumber', 'ASC'],
      {{/ifCond}}
      {{/each}}
    ],
  });

  if(all.length > 1) {
    throw new Error(`query returned unexpected amount of results. ${JSON.stringify(query)}`)
  }
  if(all.length === 0) {
    return undefined;
  }
  const found = all[0].get({plain: true});

  {{#unless calculatedFields}}
  return found;
  {{/unless}}
  {{#if calculatedFields}}
  const calculatedFieldsDAO = await {{{camelCase name}}}.findOne({
    attributes: attributesForUserEntityGet(sessionUser, ['{{camelCase this.name}}'], {}),
    where: { id:  found.id },
  });
  const calculatedFieldsResult = calculatedFieldsDAO.get({plain:true});
  return {...calculatedFieldsResult, ...found, };
  {{/if}}
}

function replaceSqlLiteralFieldInQuerySpec(
  calculatedFields,
  querySpecification = {},
) {
  const result = { ...querySpecification };
  const calculatedFieldsWhere = [];
  const trueBooleanCalculatedFields = [];
  for (let i = 0; i < calculatedFields.length; i++) {
    const [sqlLitteral, field] = calculatedFields[i];
    if (_.has(querySpecification, field)) {
      if (result[field] === true) {
        trueBooleanCalculatedFields.push(sqlLitteral);
      } else {
        calculatedFieldsWhere.push(sequelize.where(sqlLitteral, result[field]));
      }
      delete result[field];
    }
  }
  return {
    [Sequelize.Op.and]: [
      ...trueBooleanCalculatedFields,
      ...calculatedFieldsWhere,
      result,
    ],
  };
}

function replaceSqlLitteralFieldInArray(arr, calculatedFields) {
  const map = {};
  for (let i = 0; i < calculatedFields.length; i++) {
    const [sqlLitteral, field] = calculatedFields[i];
    map[field] = sqlLitteral;
  }
  return arr.map(x => (map[x] ? map[x] : x));
}

async function getFacetForAttributeForUser(inputQuery, attribute, sessionUser, requestMeta) {
  if (!sessionUser) throw new Error('decoded token must be provided');
  const calculatedFields = calculatedFieldsForEntityList(['{{name}}'], sessionUser);

  const { includesForUserAccess, whereForUserAccess } =
    userListAccessFilterServiceOverride(sessionUser, requestMeta);

  const litteralAttribute = replaceSqlLitteralFieldInArray([attribute], calculatedFields)[0]
  const include = [
     {{#each fields}}
     {{#ifCond type '==' 'relation'}}
     {{#ifCond relation '==' ../name}}
     {
       model: {{camelCase relation}},
       as: '{{camelCase @key}}',
       attributes: []
     },
     {{else}}
     {
       model: {{camelCase relation}}.{{camelCase relation}},
       {{#ifCond @key '!=' relation}}as: '{{camelCase @key}}',{{/ifCond}}
       attributes: []
     },
     {{/ifCond}}
     {{/ifCond}}
     {{/each}}
     ...includesForUserAccess,
     ];

  const { where: newWhere, include: newInclude } = convertHashWhereToSequelize(inputQuery.where, include, sequelize.models);

  const combinedWhere = {
    ...replaceSqlLiteralFieldInQuerySpec(calculatedFields, newWhere),
    ...whereForUserAccess,
  };

  const list = await {{{camelCase name}}}.count({
    where: combinedWhere,
    include: newInclude,
    distinct: true,
    subQuery: false,
    group: [litteralAttribute]
  });

  // because sequlize returns random string for the attribute name when counting on complex query
  let attributeNameInResult = attribute;
  if (list.length > 0) {
    attributeNameInResult = _.keys(list[0]).filter(x => x !== 'count')[0];
  }

  return _.sortBy(
    list
      .map(x => ({
        value: x[attributeNameInResult],
        filterKey: attribute,
        count: _.toNumber(x.count),
      }))
      .filter(x => x.value !== null),
    x => -x.value,
  );
}


async function listForUser(inputQuery, sessionUser, requestMeta) {
  if (!sessionUser) throw new Error('decoded token must be provided');

  let trustNumberOfRowsAsNumberOfEntities = true;

  const calculatedFields = calculatedFieldsForEntityList(['{{name}}'], sessionUser);

  const { includesForUserAccess, whereForUserAccess} = userListAccessFilterServiceOverride(sessionUser, requestMeta);

  if(includesForUserAccess && !_.isEmpty(includesForUserAccess)) {
    trustNumberOfRowsAsNumberOfEntities = false;
  }

  const attributes = [
    ...attributesForUserEntityList(sessionUser),
    ...calculatedFields,
    'createdAt', 'updatedAt'];

  const include = [
    ...includesForUserAccess,
    {{#each fields}}
    {{#ifCond type '==' 'relation'}}
    {{#ifCond is_available_in_reference '==' true}}
    {{#ifCond relation '==' ../name}}
    {
      model: {{camelCase relation}},
      as: '{{camelCase @key}}',
      attributes: attributesForUserEntityList(sessionUser)
    },
    {{else}}
    {
      model: {{camelCase relation}}.{{camelCase relation}},
      {{#ifCond @key '!=' relation}}as: '{{camelCase @key}}',{{/ifCond}}
      attributes: {{camelCase relation}}.attributesForUserEntityList(sessionUser)
    },
    {{/ifCond}}
    {{/ifCond}}
    {{/ifCond}}
    {{/each}}
  ];

    {{#each children}}
    // eslint-disable-next-line no-empty
    if (_.some(Object.keys(inputQuery.where), k=>k.indexOf('${{camelCase @key}}.')===0)) {
      trustNumberOfRowsAsNumberOfEntities = false;
      include.push({ model: {{camelCase @key}}, attributes: [] })
    }
    {{/each}}

  const { where: newWhere, include: newInclude } = convertHashWhereToSequelize(inputQuery.where, include, sequelize.models);

  const combinedWhere = {
    ...replaceSqlLiteralFieldInQuerySpec(calculatedFields, newWhere),
    ...whereForUserAccess
  }

  const findAllParams = {
    where: combinedWhere,
    include: newInclude,
    attributes,
    offset: inputQuery.offset,
    limit: inputQuery.limit,
    order: inputQuery.order,
    subQuery: false,
  }
  if(!trustNumberOfRowsAsNumberOfEntities) {
    findAllParams.group = [ '{{name}}.id',
      {{#each fields}}
        {{#ifCond is_available_in_reference '==' true}}{{#ifCond type '==' 'relation'}}'{{{camelCase @key}}}.id',{{/ifCond}}{{/ifCond}}
      {{/each}}
    ]
  }
  const findAllQuery = {{camelCase name}}.findAll(findAllParams);

  const countParams = {
    where: combinedWhere,
    include: newInclude,
    attributes:[],
    subQuery: false
  };
  if(!trustNumberOfRowsAsNumberOfEntities) {
    countParams.distinct = true
  }
  const countQuery = {{camelCase name}}.count(countParams)

  const [ rows, total ] = await Promise.all([findAllQuery, countQuery]);
  const pageSize = inputQuery.limit || total;
  const page = Math.ceil(inputQuery.offset / pageSize) + 1;

  return {
    rows: rows.map(x => x.get({ plain: true })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// eslint-disable-next-line
async function prepareUpdateChildren(parentId, params, transaction, parentEntityUpdatedAt) {
  const mutations = [];
  if(!parentEntityUpdatedAt) {
    throw new Error('parentEntityUpdatedAt have to be provided');
  }

  {{#each children }}

  if(params.{{@key}}) {
    params.{{@key}}.forEach((x) => {
      if(!x.id) throw new Error('children - {{@key}} - need ids for storage')
    })

    const new{{pascalCase @key}}List = params.{{@key}}.map(
      {{#ifCond doNotGenerateRowNumbers '==' true}}
      x => ({ ...x }),
      {{else}}
      (x, index) => ({ ...x, rowNumber: index + 1 }),
      {{/ifCond}}
    );

    const existing{{@key}}Seq = await {{@key}}.findAll({
      where: { {{{../name}}}Id: parentId },
      transaction
    });

    const existing{{@key}} = existing{{@key}}Seq.map(x =>
      x.get({ plain: true }),
    );

    const rowsWithPotentialUpdates = _.intersectionBy(
      new{{pascalCase @key}}List,
      existing{{@key}},
      'id',
    );

    const rowsToUpdate = rowsWithPotentialUpdates.filter(x => {
      const existingRow = existing{{@key}}.find(y => y.id === x.id);
      const isEqual = _.isEqual(
        _.omit(x, ['createdAt', 'updatedAt', '{{{camelCase ../name}}}Id', ]),
        _.omit(existingRow, [
          'createdAt',
          'updatedAt',
          '{{{camelCase ../name}}}Id',
        ]),
      );
      return !isEqual;
    });

    const rowsToDelete = _.differenceBy(
      existing{{@key}},
      new{{pascalCase @key}}List,
      'id',
    );
    const rowsToInsert = _.differenceBy(
      new{{pascalCase @key}}List,
      existing{{@key}},
      'id',
    );
    mutations.push({{camelCase @key}}.destroy(
      {
        where: { id: {[Sequelize.Op.in]: rowsToDelete.map(x=>x.id) }},
        transaction
      },
    ));

    mutations.push({{camelCase @key}}.bulkCreate(rowsToInsert.map(x=>({
      createdAt: parentEntityUpdatedAt,
      updatedAt: parentEntityUpdatedAt,
      ...x,
      {{../name}}Id: parentId,
    })), {transaction, silent:true}));

    rowsToUpdate.forEach(x => {
      mutations.push(
        {{camelCase @key}}.update(
          {
            updatedAt: parentEntityUpdatedAt,
            ...x,
            {{{../name}}}Id: parentId,
          },
          { where: { id: x.id }, transaction, silent: true },
        ),
      );
    });


  }

  if (params.{{@key}}Changes) {
    const {
      rowsToInsert,
      rowsToDelete,
      rowsToUpdate,
    } = params.{{@key}}Changes;

    mutations.push({{camelCase @key}}.bulkCreate(rowsToInsert.map(x=>({
      {{../name}}Id: parentId,
      createdAt: parentEntityUpdatedAt,
      updatedAt: parentEntityUpdatedAt,
      ...x,
    })), {transaction, silent:true}));

    rowsToUpdate.forEach(x => {
      mutations.push(
        {{camelCase @key}}.update(
          {
            {{{../name}}}Id: parentId,
            updatedAt: parentEntityUpdatedAt,
            ...x,
          },
          { where: { id: x.id }, transaction, silent: true },
        ),
      );
    });
    mutations.push({{camelCase @key}}.destroy(
      {
        where: { id: {[Sequelize.Op.in]: rowsToDelete.map(x=>x.id) }},
        transaction
      },
    ));
  }
  {{/each}}
  return mutations
}

/* eslint-disable */
function changeNestedObjectsToForeignKeysHelper(params, key){
  if (params[key] === null) {
    params[`${key}Id`] = null;
    delete params[key];
  }
  const foreignKey = _.get(params, `${key}.id`);
  if (foreignKey) {
    params[`${key}Id`] = foreignKey
    delete params[key];
  }
  return params;
}


{{#each children ~}}
const fixChildFKsFor{{pascalCase @key}} = (child) => {
  {{#each fields ~}}
  {{#ifCond type '==' 'relation'}}
    changeNestedObjectsToForeignKeysHelper(child, '{{camelCase @key}}');
  {{/ifCond}}
  {{/each}}
  return child;
};
{{/each}}


const changeNestedObjectsToForeignKeys = inParams => {
  const params = {...inParams};
  {{#each children ~}}
  if(params.{{name}}) {
    for (let i = 0; i < params.{{name}}.length; i++) {
      const child = params.{{name}}[i];
      fixChildFKsFor{{pascalCase @key}}(child)
    }
  }
  if (params.{{@key}}Changes) {
    const {
      rowsToInsert,
      rowsToUpdate,
    } = params.{{@key}}Changes;

    for (let i = 0; i < rowsToInsert.length; i++) {
      const child = rowsToInsert[i];
      fixChildFKsFor{{pascalCase @key}}(child)
    }
    for (let i = 0; i < rowsToUpdate.length; i++) {
      const child = rowsToUpdate[i];
      fixChildFKsFor{{pascalCase @key}}(child)
    }
    // no need to process deletes as we just remove everything
  }
  {{/each}}
  {{#each fields ~}}
  {{#ifCond type '==' 'relation'}}
    changeNestedObjectsToForeignKeysHelper(params, '{{camelCase @key}}')
  {{/ifCond}}
  {{/each}}
  return params;
}
/* eslint-enable */

function prepareCreate(paramsWithNestedObjects, createdAt) {
  const params = changeNestedObjectsToForeignKeys(paramsWithNestedObjects);
  if(!params.id){
    throw new Error('update requires id');
  }
  if(!createdAt) {
    throw new Error('createdAt have to be provided');
  }
  return async transaction => {
    const mutations = [];
    const createParams = {createdAt, updatedAt:createdAt, ...params}
    mutations.push({{camelCase name}}.create(createParams, {transaction, silent: true}))
    return  mutations.concat(await prepareUpdateChildren(params.id, params, transaction, createdAt));
  }
}

function prepareUpdate({id, ...changesWithNestedObjects}, updatedAt) {
  const changes = changeNestedObjectsToForeignKeys(changesWithNestedObjects);
  if(!id){
    throw new Error('update requires id');
  }
  if(!updatedAt) {
    throw new Error('updatedAt have to be provided');
  }
  return async transaction => {
    const updateParams = {updatedAt, ...changes}
    const mutations = [];
    mutations.push(
      {{camelCase name}}.update(updateParams, { where: {id}, transaction, silent: true })
    );
    return mutations.concat(await prepareUpdateChildren(id, changes, transaction, updatedAt));
  }
}

/* eslint-disable */
function shortenNestedObjectForEventHelper(params, key){
  const foreignKey = _.get(params, `${key}.id`);
  if (foreignKey) {
    delete params[key];
    params[`${key}`] = {id: foreignKey}
  }
}

const shortenNestedObjectForEvent = inParams => {
  const params = {...inParams};
  {{#each children ~}}
    {{#each fields ~}}
    {{#ifCond type '==' 'relation'}}
  if(params.{{../name}}) {
    for (let i = 0; i < params.{{../name}}.length; i++) {
      const child = params.{{../name}}[i];
      shortenNestedObjectForEventHelper(child, '{{@key}}')
    }
  }
    {{/ifCond}}
    {{/each}}
  {{/each}}
  {{#each fields ~}}
  {{#ifCond type '==' 'relation'}}
  shortenNestedObjectForEventHelper(params, '{{@key}}')
  {{/ifCond}}
  {{/each}}
  return params;
}

function expandRelationsToIds(entity){
  {{#each children ~}}
  {{#each fields ~}}
    {{#ifCond type '==' 'relation'}}
    if(entity.{{../name}}) {
    for (let i = 0; i < entity.{{../name}}.length; i++) {
      const child = entity.{{../name}}[i];
      if(child.{{camelCase @key}}Id) {
        child.{{camelCase @key}} = { id: child.{{camelCase @key}}Id };
        delete child.{{camelCase @key}}Id;
      }
      }
    }
    {{/ifCond}}
    {{/each}}
  {{/each}}
  {{#each fields ~}}
  {{#ifCond type '==' 'relation'}}
  if(entity.{{camelCase @key}}Id) {
    entity.{{camelCase @key}} = { id: entity.{{camelCase @key}}Id };
    delete entity.{{camelCase @key}}Id;
  }
  {{/ifCond}}
  {{/each}}
  return entity;
}

/* eslint-enable */

/* eslint-disable */
const resolveLookups = async imParams => {
  const params = {...imParams};
  {{#each children ~}}
    {{#each fields ~}}
    {{#ifCond type '==' 'relation'}}
  if(params.{{../name}}) {
    for (let i = 0; i < params.{{../name}}.length; i++) {
      const child = params.{{../name}}[i];
      const {{camelCase @key}}Query = _.get(child, 'lookups.{{@key}}')
      if({{camelCase @key}}Query) {
        const {{camelCase @key}}Entity = await {{camelCase relation}}.get({
          where: {{camelCase @key}}Query,
        });

        if(!{{camelCase @key}}Entity) {
          throw new Error('Entity not found {{@key}}' + JSON.stringify({{camelCase @key}}Query));
        }
        child['{{@key}}'] = {{camelCase @key}}Entity;
      }
      delete child.lookups;
    }
  }
    {{/ifCond}}
    {{/each}}
  {{/each}}
  {{#each fields ~}}
  {{#ifCond type '==' 'relation'}}
    const {{camelCase @key}}Query = _.get(params, 'lookups.{{@key}}')
    if({{camelCase @key}}Query) {
      const {{camelCase @key}}Entity = await {{camelCase relation}}.get({
        where: {{camelCase @key}}Query,
      });

      if(!{{camelCase @key}}Entity) {
        throw new Error('Entity not found {{@key}}' + JSON.stringify({{camelCase @key}}Query));
      }
      params['{{@key}}'] = {{camelCase @key}}Entity;

    }

  {{/ifCond}}
  {{/each}}
  delete params.lookups;
  return params;
}

function assertNonNaN(entity){
  {{#each fields ~}}
    {{#ifCond type '==' 'number'}}
      if(entity.{{@key}} === NaN) {
        throw new Error('{{@key}} is NaN');
      }
    {{/ifCond}}
  {{/each}}
}

async function ensureInvariants(entity) {
  const ensureExtraInvariants = _.get(
    extensions,
    'ensureExtraInvariants',
    x => x,
  );

  // ensureInvariants sometimes creates lookups
  const ensured = await resolveLookups(domainModel.{{camelCase name}}.ensureInvariants(entity))
  const extraEnsured = await ensureExtraInvariants(ensured);
  {{#each children }}
  // By ensuring id generation for children here we make sure id's reach the
  // eventParams for migration
  if(extraEnsured.{{@key}}){
    extraEnsured.{{@key}} = extraEnsured.{{@key}}.map((x) =>(
      {
        ...x,
        id: x.id || _.uuid(),
      })
  );
  }
  {{/each}}
  assertNonNaN(extraEnsured);
  // resolving lookups again in case ensureExtraInvariants also creates lookups
  return resolveLookups(extraEnsured);
}

{{#each children}}
const {{camelCase @key}}ChildChanges = (changedEntity, existingEntity) => {

  const changes = {}

  {{#each fields ~}}
  {{#switch type}}
    {{#case "relation" ~}}
      if(_.get(changedEntity,'{{camelCase @key}}.id') && _.get(changedEntity,'{{camelCase @key}}.id') !== _.get(existingEntity, '{{camelCase @key}}.id')){
        changes.{{camelCase @key}} = {id: changedEntity.{{camelCase @key}}.id};
      }
      if(changedEntity.{{camelCase @key}} === null && existingEntity.{{camelCase @key}} !== null) {
        changes.{{camelCase @key}} = null;
      }
    {{/case}}
    {{#case "stringArray" "imageArray" "object" "openingHours" "regionSpecifics" "referenceList" "labels"  ~}}
      if(!_.isEqual(changedEntity.{{@key}},existingEntity.{{@key}})) {
        changes.{{@key}} = changedEntity.{{@key}};
      }
    {{/case}}
    {{#case "croppedS3image" "S3image" "s3file"}}
    if(changedEntity.{{@key}} !== undefined && (
      !isSameImage(existingEntity.{{@key}}, changedEntity.{{@key}}) ||
      // stored entity does not have flaivy asset link
      (_.includes(changedEntity.{{@key}}, 'assets.flaivy') &&
      !_.includes(existingEntity.{{@key}}, 'assets.flaivy'))
      )){
      changes.{{@key}} = changedEntity.{{@key}};
    }
    {{/case}}
    {{#case "reference"}}
    const isEqual = _.isEqual(
      _.omit(changedEntity.{{@key}}, ['createdAt', 'updatedAt', ]),
      _.omit(existingEntity.{{@key}}, [
        'createdAt',
        'updatedAt',
      ]));
      if(!isEqual) {
        changes.{{@key}} = changedEntity.{{@key}};
      }
    {{/case}}
    {{#default ~}}
      if(changedEntity.{{@key}} !== undefined && changedEntity.{{@key}} !== existingEntity.{{@key}}){
        changes.{{@key}} = changedEntity.{{@key}};
      }
    {{/default}}
  {{/switch}}
  {{/each}}

  {{#ifCond doNotGenerateRowNumbers '==' true}}
  {{else}}
  if(changedEntity.rowNumber !== undefined && changedEntity.rowNumber !== existingEntity.rowNumber){
    changes.rowNumber = changedEntity.rowNumber;
  }
  {{/ifCond}}

  changes.id = existingEntity.id;
  changes.metadata = {
    ...existingEntity.metadata,
    ...changedEntity.metadata,
  };
  if (_.isEqual(changes.metadata, existingEntity.metadata || {})) {
    // existing metadata can sometimes be null thats why we compare with existing or empty object
    delete changes.metadata;
  }
  if(_.isEqual(Object.keys(changes), ['id'])) {
      return {};
  }
  {{#ifCond doNotGenerateRowNumbers '==' true}}
  {{else}}
// This needs to be added after the above check to allow reordering but also have row numbers in changes as output
  changes.rowNumber = changedEntity.rowNumber;
  {{/ifCond}}
  return changes;
};
{{/each}}



async function getChanges(existingEntity, actionChanges) {

  if(existingEntity instanceof {{camelCase name}}) {
    throw new Error("existingEntity is not what you think it is")
  }
  const requestedChanges = {...actionChanges};
  delete requestedChanges.lookups;
  delete requestedChanges.target;
  const changedEntity = await ensureInvariants({...existingEntity, ...requestedChanges});

  const changes = {}
  {{#each fields ~}}
    {{#switch type}}
      {{#case "relation" ~}}
        if(_.get(changedEntity,'{{camelCase @key}}.id') && _.get(changedEntity,'{{camelCase @key}}.id') !== _.get(existingEntity, '{{camelCase @key}}.id')){
          changes.{{camelCase @key}} = {id: changedEntity.{{camelCase @key}}.id};
        }
        if(changedEntity.{{camelCase @key}} === null && existingEntity.{{camelCase @key}} !== null) {
          changes.{{camelCase @key}} = null;
        }
      {{/case}}
      {{#case "stringArray"  "imageArray" "object" "openingHours" "regionSpecifics" "labels" "referenceList" ~}}
        if(!_.isEqual(changedEntity.{{@key}},existingEntity.{{@key}})) {
          changes.{{@key}} = changedEntity.{{@key}};
        }
      {{/case}}
      {{#case "croppedS3image" "S3image" "s3file"}}
      if(changedEntity.{{@key}} !== undefined && (
        !isSameImage(existingEntity.{{@key}}, changedEntity.{{@key}}) ||
        // stored entity does not have flaivy asset link
        (_.includes(changedEntity.{{@key}}, 'assets.flaivy') &&
        !_.includes(existingEntity.{{@key}}, 'assets.flaivy'))
        )){
        changes.{{@key}} = changedEntity.{{@key}};
      }
      {{/case}}
      {{#default ~}}
        if(changedEntity.{{@key}} !== undefined && changedEntity.{{@key}} !== existingEntity.{{@key}}){
          changes.{{@key}} = changedEntity.{{@key}};
        }
      {{/default}}
    {{/switch}}
  {{/each}}

  {{#each children ~}}

  const {{camelCase @key}}Changes = {
    rowsToDelete: [],
    rowsToInsert: [],
    rowsToUpdate: [],
  };

  changedEntity.{{camelCase @key}}.forEach((changedChild, index) => {
    const existingChild = _.find(
      existingEntity.{{camelCase @key}},
      r => r.id === changedChild.id,
    );

    {{#ifCond doNotGenerateRowNumbers '==' true}}
    {{else}}
      changedChild.rowNumber = index + 1;
    {{/ifCond}}
    if (!existingChild) {
      {{camelCase @key}}Changes.rowsToInsert.push(changedChild);
    } else {
      const childChanges = {{camelCase @key}}ChildChanges(changedChild, existingChild);
      if (!_.isEmpty(childChanges)) {
        {{camelCase @key}}Changes.rowsToUpdate.push(childChanges);
      }
    }
  });

  {{camelCase @key}}Changes.rowsToDelete = _.differenceBy(
    existingEntity.{{camelCase @key}},
    changedEntity.{{camelCase @key}},
    'id',
  ).map(x=>{
    {{#each fields ~}}
    {{#ifCond type '==' 'relation'}}
      shortenNestedObjectForEventHelper(x, '{{@key}}')
    {{/ifCond}}
    {{/each}}
    return x;
  });



  if (
    {{camelCase @key}}Changes.rowsToDelete.length !== 0 ||
    {{camelCase @key}}Changes.rowsToInsert.length !== 0 ||
    {{camelCase @key}}Changes.rowsToUpdate.length !== 0
  ) {
    changes.{{camelCase @key}}Changes = {{camelCase @key}}Changes;
  }
  {{/each}}


  if (
    !_.isEmpty(changes) ||
    !_.isEqual(changedEntity.metadata, existingEntity.metadata)
  ) {
    // We dont allow changing id
    changes.id = existingEntity.id;
    changes.metadata = {
      ...existingEntity.metadata,
      ...actionChanges.metadata,
    };
    if(_.isEqual(changes.metadata, existingEntity.metadata)) {
      delete changes.metadata;
    }
    if(_.isEqual(Object.keys(changes), ['id'])) {
        return {};
    }
    return changes;
  }
  return {};
}

// This one is needed to ensure that autoLoading references of child fields when doing parent get
async function ensureAutoLoadChildReferences(broker, childrenToUpdate, fieldToUpdate, meta)  {
  {{#each fields}}
  {{#ifCond type "==" "reference" ~}}
  {{#if autoLoadReference}}

  if (childrenToUpdate?.length && fieldToUpdate) {
    const itemsToUpdate{{pascalCase @key}} = [];
    for (const child of childrenToUpdate) {
      if (child[fieldToUpdate]) {
        itemsToUpdate{{pascalCase @key}}.push(child[fieldToUpdate]);
      }
    }
    if (itemsToUpdate{{pascalCase @key}}.length) {
      const references{{pascalCase @key}} = await broker.call('v1.{{referenceType}}.list', { query: { id: { in: _.uniq(itemsToUpdate{{pascalCase @key}}.map(x => x.{{@key}}?.id)) } }, pageSize: -1 }, { meta });
      for (const row of references{{pascalCase @key}}.rows) {
        for (const item of itemsToUpdate{{pascalCase @key}}) {
          if (item.{{@key}}?.id === row.id) {
            item.{{@key}} = row;
          }
        }
      }
    }
  }

  {{/if}}
  {{/ifCond}}
  {{/each}}
}

// This one is needed to ensure that autoLoading references of item fields when doing list
async function ensureAutoLoadReferences(broker, items, meta)  {
  {{#each fields}}
  {{#ifCond type "==" "reference" ~}}
  {{#if autoLoadReference}}
  {{#if is_available_in_reference}}

  if (items?.length) {
    const references{{pascalCase @key}} = await broker.call('v1.{{referenceType}}.list', { query: { id: { in: _.uniq(items.map(x => x.{{@key}}?.id)) } }, pageSize: -1 }, { meta });
    for (const row of references{{pascalCase @key}}.rows) {
      for (const item of items) {
        if (item.{{@key}}?.id === row.id) {
          item.{{@key}} = row;
        }
      }
    }
  }

  {{/if}}
  {{/if}}
  {{/ifCond}}
  {{/each}}
}

/* eslint-enable */
{{camelCase this.name}}.get = get
{{camelCase this.name}}.getEntityForUser = getEntityForUser
{{camelCase this.name}}.listForUser = listForUser
{{camelCase this.name}}.prepareCreate = prepareCreate
{{camelCase this.name}}.prepareUpdate = prepareUpdate
{{camelCase this.name}}.resolveLookups = resolveLookups
{{camelCase this.name}}.attributesForUserEntityList = attributesForUserEntityList
{{camelCase this.name}}.attributesForUserEntityGet = attributesForUserEntityGet

module.exports = {
  {{camelCase this.name}},
  {{#each children}} {{@key}}, {{/each}}
  get,
  getEntityForUser,
  listForUser,
  prepareCreate,
  prepareUpdate,
  getFacetForAttributeForUser,
  attributesForUserEntityList,
  attributesForEntityGet,
  attributesForUserEntityGet,
  expandRelationsToIds,
  changeNestedObjectsToForeignKeys,
  shortenNestedObjectForEvent,
  verifyWriteAccess: verifyWriteAccessServiceOverride,
  verifyReadAccess : verifyReadAccessServiceOverride,
  ensureInvariants,
  getChanges,
  ensureAutoLoadChildReferences,
  ensureAutoLoadReferences,
  name: '{{camelCase this.name}}',
  ...extensions
}
