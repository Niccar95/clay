/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
{{#each types}}
const {{camelCase name}}Events = require('./{{name}}.events');
{{/each}}

const retentionPolicies = {
  {{#each types}}
    
  {{#each events}}
  {{#if retention}}
    {{@key}}: {
      retention: {{retention}},
      {{#if keep}}
      keep: {{keep}},
      {{/if}}
    },
    {{/if}}
  {{/each}}
  {{/each}}
}

module.exports = {
  retentionPolicies,
  {{#each types}}
    ...{{camelCase name}}Events,
  {{/each}}
}
