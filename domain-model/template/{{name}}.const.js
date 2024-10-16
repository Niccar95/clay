module.exports = {
  entityModel: '{{name}}',
  events: {
    {{#each events}}
      '{{@key}}': '{{@key}}',
    {{/each}}
  },
  actions: {
    'get': 'v1.{{name}}.get',
    'list': 'v1.{{name}}.list',
    {{#each actions}}
      '{{name}}': 'v1.{{../name}}.{{name}}',
    {{/each}}
  },

  {{#each fields}}

    {{#if values }}
    {{pluralize @key}}: {
      {{#each values}}
      {{key}}: '{{key}}',
      {{/each}}
    },
    {{/if}}
    {{#if restrictedValues }}
    {{pluralize @key}}: {
      {{#each restrictedValues}}
      '{{value}}': '{{value}}',
      {{/each}}
    },
    {{/if}}
    {{/each}}
    {{#each calculatedFields}}

    {{#if values }}
    {{pluralize @key}}: {
      {{#each values}}
      {{key}}: '{{key}}',
      {{/each}}
    },
    {{/if}}
    {{#if restrictedValues }}
    {{pluralize @key}}: {
      {{#each restrictedValues}}
      '{{value}}': '{{value}}',
      {{/each}}
  },
  {{/if}}
  {{/each}}

  {{#each children}}
  {{camelCase this.name}} : {
  {{#each fields}}

  {{#if values }}
  {{pluralize @key}}: {
    {{#each values}}
    {{key}}: '{{key}}',
    {{/each}}
  },
  {{/if}}
  {{#if restrictedValues }}
  {{pluralize @key}}: {
    {{#each restrictedValues}}
    '{{value}}': '{{value}}',
    {{/each}}
  },
  {{/if}}
  {{/each}}
  {{#each calculatedFields}}

  {{#if values }}
  {{pluralize @key}}: {
    {{#each values}}
    {{key}}: '{{key}}',
    {{/each}}
  },
  {{/if}}
  {{#if restrictedValues }}
  {{pluralize @key}}: {
    {{#each restrictedValues}}
    '{{value}}': '{{value}}',
    {{/each}}
},
{{/if}}
{{/each}}
},
{{/each}}

};