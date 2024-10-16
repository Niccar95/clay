{{#switch parameter.type}}
  {{#case "text" "recurrence" "string" "pipeString" "html" "htmlTextArea" "password" "GTIN" "GLN" "markdown" "stackTrace" "userAccessString" ~}}
  type: 'string',
  convert: true,
  {{/case}}
  {{#case "email" ~}}
  {{#if allow_multiple}}
    type: 'string',
    empty:true,
  {{else}}
    type: 'email',
    normalize: true,
    empty:true,
  {{/if}}
  {{/case}}
  {{#case "taxNumber"}}
    type: 'string',
    convert: true,
    max: 13,
    min: 13,
  {{/case}}
  {{#case  "croppedS3image" "S3image" "s3file" ~}}
    type: 'string',
    max: 1024,
    isImage: true,
  {{/case}}
  {{#case "relation" ~}}
    type: 'object',
    relation: '{{camelCase parameter.relation}}',
    props: {
      id: {
        type: "string"
    }},
  {{/case}}
  {{#case "reference" ~}}
  type: 'object',
  referenceType: '{{camelCase parameter.referenceType}}',
  {{/case}}
  {{#case 'enum'}}
    type: 'enum', values: [ {{#each parameter.values}} '{{key}}', {{/each}} ],
  {{/case}}
  {{#case 'currency'}}
    type: 'enum', values: [ 'SEK', 'NOK', 'DKK','EUR', 'USD', 'GBP' ],
  {{/case}}
  {{#case 'date' 'deliveryDate'}}
    type: 'date',
    onlyDatePart: true,
    convert: true,
  {{/case}}
  {{#case 'datetime' }}
  type: 'date',
  convert: true,
  {{/case}}
  {{#case 'boolean'}}
    type: 'boolean',
  {{/case}}
  {{#case 'number' 'integer' 'money' 'articleQuantity'}}
    type: 'number',
    convert: true,
  {{/case}}
  {{#case 'object' 'openingHours' 'pageLayout' 'navbarConfig' 'cartProgressBarsColors' 'intercomConfig' 'regionSpecifics' 'mapping' 'articleFilterPanelConfig' 'querySpecification'}}
    type: 'object',
  {{/case}}
  {{#case 'attachments'}}
    type: 'array',
    items: {
      type: 'object',
      props: {
        filename: { type: 'string' },
        content: { type: 'object' },
      },
    },
  {{/case}}
  {{#case 'referenceList' 'labels'}}
  type: 'array',
  items: {
    type: 'object',
    props: {
      id: { type: 'string' },
      name: { type: 'string' },
      color: { type: 'string' },
    },
  },
  {{/case}}
{{/switch}}
{{#if parameter.min_length ~}}min: {{parameter.min_length}}, {{/if ~}}
{{#if parameter.max_length ~}}max: {{parameter.max_length}}, {{/if }}
{{#if parameter.pattern ~}} /* eslint-disable no-useless-escape */ pattern: /^{{{parameter.pattern}}}$/,  /* eslint-enable */ {{/if }}
{{#unless parameter.required }}optional: true, {{/unless }}
