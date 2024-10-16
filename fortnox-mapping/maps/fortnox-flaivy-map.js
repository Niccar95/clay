/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require("lodash")

const flaivyToFortnoxMap = {
  {{#each types}}
  "{{name}}" : {
  {{#each fields}}
  {{#if fortnox_equivalent}}
  {{#ifCond @key '!==' 'articleNumber'}}
  {{#ifCond readonly '!=' true}}
    {{@key}} : "{{fortnox_equivalent}}",
  {{/ifCond}}
  {{/ifCond}}
  {{/if}}
  {{/each}}
  },
  {{#each children}}
  {{@key}} : {
  {{#each fields}}
  {{#if fortnox_equivalent}}
  {{#ifCond @key '!==' 'articleNumber'}}
  {{#ifCond readonly '!=' true}}
    {{@key}} : "{{fortnox_equivalent}}",
  {{/ifCond}}
  {{/ifCond}}
  {{/if}}
  {{/each}}
  },
  {{/each}}

  {{/each}}

};

const fortnoxToFlaivyMap = {
  {{#each types}}
  "{{name}}" : {
  {{#each fields}}
  {{#if fortnox_equivalent}}
    {{fortnox_equivalent}}: "{{@key}}",
  {{/if}}
  {{/each}}
  },

  {{#each children}}
  {{@key}} : {
  {{#each fields}}
  {{#if fortnox_equivalent}}
    {{fortnox_equivalent}}: "{{@key}}",
  {{/if}}
  {{/each}}
  },
  {{/each}}

  {{/each}}
};


const nullableInFortnox = {
  {{#each types}}
  "{{name}}" : {
  {{#each fields}}
  {{#if fortnox_nullable}}
    {{@key}}: true,
  {{/if}}
  {{/each}}
  },

  {{#each children}}
  {{@key}} : {
  {{#each fields}}
  {{#if fortnox_nullable}}
    {{@key}}: true,
  {{/if}}
  {{/each}}
  },
  {{/each}}

  {{/each}}
};


const getFortnoxField = (type, flaivyField) => {
  return _.get(flaivyToFortnoxMap, `${type}.${flaivyField}`)
}

const isFlaivyFieldNullableInFortnox = (type, flaivyField) => {
  return _.get(nullableInFortnox, `${type}.${flaivyField}`, false)
}


const getFlaivyField = (type, fortnoxField) => {
  return _.get(fortnoxToFlaivyMap, `${type}.${fortnoxField}`)
}


module.exports = {getFlaivyField, getFortnoxField, isFlaivyFieldNullableInFortnox}
