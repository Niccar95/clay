{{#ifCond @key '!=' 'id'}}{{#ifCond @key '!=' 'metadata'}}
{{#switch type}}
  {{#case 'boolean' }}
    {{@key}}: true,
  {{/case}}
  {{#case 'datetime' }}
    {{@key}}: new Date(),
  {{/case}}
  {{#case 'date' 'deliveryDate' }}
    {{@key}}: '1987-03-25',
  {{/case}}
  {{#case 'relation' }}
    //{{@key}}: {},
  {{/case}}
  {{#case 'user' 'openingHours' 'regionSpecifics' }}
    {{@key}}: null,
  {{/case}}
  {{#case 'array' }}
  {{/case}}
  {{#case 'string' }}
    {{@key}}: 'string value',
  {{/case}}
  {{#case 'password' }}
    {{@key}}: 'password value',
  {{/case}}
  {{#case 'email' }}
    {{@key}}: 'text@email.se',
  {{/case}}
  {{#case 'html' 'htmlTextArea'}}
    {{@key}}: '<p>html value</p>',
  {{/case}}
  {{#case 'croppedS3image' 'S3image' }}
    {{@key}}: 'puppy.png',
  {{/case}}
  {{#case 'pipeString' }}
    {{@key}}: 'dog|puppy',
  {{/case}}
  {{#case 'text' }}
    {{@key}}: 'text value',
  {{/case}}
  {{#case 'enum' 'currency' }}
    {{@key}}: '{{values.0.key}}',
  {{/case}}
  {{#case 'number' 'integer' 'money'}}
    {{@key}}: 13,
  {{/case}}
  {{#default}}
    {{@key}}: undefined,
  {{/default}}
{{/switch}}
{{/ifCond}}{{/ifCond}}
