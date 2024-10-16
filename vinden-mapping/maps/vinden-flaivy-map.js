/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const _ = require("lodash")

const flaivyToVindenMap = {
  {{#each types}}
  "{{name}}" : {
  {{#each fields}}
  {{#if vinden_equivalent}}
  {{#ifCond @key '!==' 'articleNumber'}}
  {{#ifCond readonly '!=' true}}
    "{{@key}}" : "{{vinden_equivalent}}",
  {{/ifCond}}
  {{/ifCond}}
  {{/if}}
  {{/each}}
  },
  {{#each children}}
  {{@key}} : {
  {{#each fields}}
  {{#if vinden_equivalent}}
  {{#ifCond @key '!==' 'articleNumber'}}
  {{#ifCond readonly '!=' true}}
    "{{@key}}" : "{{vinden_equivalent}}",
  {{/ifCond}}
  {{/ifCond}}
  {{/if}}
  {{/each}}
  },
  {{/each}}

  {{/each}}

};

const vindenToFlaivyMap = {
  {{#each types}}
  "{{name}}" : {
  {{#each fields}}
  {{#if vinden_equivalent}}
    "{{vinden_equivalent}}": "{{@key}}",
  {{/if}}
  {{/each}}
  },

  {{#each children}}
  {{@key}} : {
  {{#each fields}}
  {{#if vinden_equivalent}}
    "{{vinden_equivalent}}": "{{@key}}",
  {{/if}}
  {{/each}}
  },
  {{/each}}

  {{/each}}
};

const getVindenField = (type, flaivyField) => {
  return _.get(flaivyToVindenMap, `${type}.${flaivyField}`)
}

const getFlaivyField = (type, vindenField) => {
  return _.get(vindenToFlaivyMap, `${type}.${vindenField}`)
}

module.exports = {getFlaivyField, getVindenField, vindenToFlaivyMap, flaivyToVindenMap}
