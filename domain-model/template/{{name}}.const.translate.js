/* eslint-disable no-dupe-keys */
module.exports = {
  '{{name}}':  '{{localized_name}}' || '{{name}}',
  {{#each fields}}
  {{#ifCond type "==" "relation" ~}}
  {{camelCase @key}}:  '{{localized_name}}' || '{{@key}}',
  {{else}}
  {{@key}}:  '{{localized_name}}' || '{{@key}}',
  {{/ifCond}}
    {{#if values }}
    {{pluralize @key}}: {
      {{#each values}}
      {{key}}: '{{label}}' || '{{key}}',
      {{/each}}
    },
    {{/if}}
    {{#if restrictedValues }}
    {{pluralize @key}}: {
      {{#each restrictedValues}}
      '{{value}}':  '{{label}}' || '{{value}}',
      {{/each}}
    },
    {{/if}}
    {{/each}}
    {{#each calculatedFields}}
    {{@key}}:  '{{localized_name}}' || '{{@key}}',
    {{#if values }}
    {{pluralize @key}}: {
      {{#each values}}
      {{key}}: '{{label}}' || '{{key}}',
      {{/each}}
    },
    {{/if}}
    {{#if restrictedValues }}
    {{pluralize @key}}: {
      {{#each restrictedValues}}
      '{{value}}':  '{{label}}' || '{{value}}',
      {{/each}}
  },
  {{/if}}
  {{/each}}
  {{#each children}}
  {{camelCase this.name}} : {
  {{#each fields}}
  {{#ifCond type "==" "relation" ~}}
  {{camelCase @key}}:  '{{localized_name}}' || '{{@key}}',
  {{else}}
  {{@key}}:  '{{localized_name}}' || '{{@key}}',
  {{/ifCond}}
  {{#if values }}
  {{pluralize @key}}: {
    {{#each values}}
    {{key}}: '{{label}}' || '{{key}}',
    {{/each}}
  },
  {{/if}}
  {{#if restrictedValues }}
  {{pluralize @key}}: {
    {{#each restrictedValues}}
    '{{value}}': '{{label}}' || '{{value}}',
    {{/each}}
  },
  {{/if}}
  {{/each}}
  {{#each calculatedFields}}
  {{@key}}: '{{localized_name}}' || '{{@key}}',
  {{#if values }}
  {{pluralize @key}}: {
    {{#each values}}
    {{key}}: '{{label}}' || '{{key}}',
    {{/each}}
  },
  {{/if}}
  {{#if restrictedValues }}
  {{pluralize @key}}: {
    {{#each restrictedValues}}
    '{{value}}':  '{{label}}' || '{{value}}',
    {{/each}}
},
{{/if}}
{{/each}}
},
{{/each}}
};

