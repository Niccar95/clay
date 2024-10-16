const actionParameters = {
    {{#each types}}
    {{#each actions}}
    "v1.{{../name}}.{{camelCase name}}": {
      {{#each parameters}}
      {{#ifCond @key '!=' 'id'}}{{#ifCond @key '!=' 'metadata'}}{{#ifCond @key '!=' 'owningSupplierOrganizationId'}}{{#ifCond readonly '!=' true}}
      "{{camelCase @key}}": {
        "name": "{{camelCase @key}}",
        "label": "{{localized_name}}",
        {{#switch type}}
      {{#case "enum" ~}}
        type: 'enum',
        values: [{{#each values}}{key: '{{key}}', label: '{{label}}'},{{/each}}]
      {{/case ~}}
      {{#case "currency" ~}}
        type: 'enum',
        values: [{key: 'SEK', label: 'SEK'}, {key: 'NOK', label: 'NOK'}, {key: 'DKK', label: 'DKK'}, {key: 'EUR', label: 'EUR'}, {key: 'GBP', label: 'GBP'}, {key: 'USD', label: 'USD'}]
      {{/case ~}}
      {{#case "croppedS3image" "S3image" "s3file" ~}}
       type: "string"
      {{/case ~}}
      {{#case "object" "openingHours" "regionSpecifics" "attachments" "stringArray" "imageArray" "referenceList" "labels" ~}}
        type: "json"
      {{/case ~}}
      {{#case "datetime" ~}}
      type: "date"
    {{/case ~}}
      {{#case "date" "deliveryDate" ~}}
        type: "dateonly"
      {{/case ~}}
      {{#case "recurrence" "email" "password" "GTIN" "GLN" ~}}
        type: "string"
      {{/case ~}}
      {{#case "userAccessString" ~}}
        type: "string"
      {{/case ~}}
      {{#case "taxNumber" ~}}
        type: "string"
      {{/case ~}}
      {{#case "pageLayout" "navbarConfig" "cartProgressBarsColors" "intercomConfig" "mapping" "articleFilterPanelConfig"}}
        type: "json"
      {{/case ~}}
      {{#case "number" "money" "articleQuantity" ~}}
        type: "number"
      {{/case ~}}
      {{#case "integer" ~}}
      type: "number"
      {{#if this.autoIncrement }}, autoIncrement: true {{/if}}
    {{/case ~}}
      {{#case "boolean" ~}}
        type: "boolean",
        {{#ifCond this.default '!=' undefined }} defaultValue: {{{this.default}}}{{/ifCond}}
        {{#ifCond this.default '==' undefined }} defaultValue: false{{/ifCond}}
      {{/case ~}}
      {{#case "text" "html" "markdown" "htmlTextArea" ~}}
        type: "string"
      {{/case ~}}
      {{#case "reference" ~}}
        referenceType: "{{referenceType}}",
        type: "reference"
      {{/case ~}}
      {{#default ~}}
        type: "{{type}}"
      {{/default}}
    {{/switch}},
        {{#ifCond required "==" true }}
        "required": {{required}},
        {{/ifCond}}
        {{#ifCond required_in_ui "==" true }}
        "required_in_ui": {{required_in_ui}},
        {{/ifCond}}
        {{#if unique_with }}
        "unique": true,
        {{/if}}
        {{#if restrictedValues }}
        "restrictedValues": [{{#each restrictedValues}}{value: '{{value}}', label: '{{label}}'},{{/each}}],
        {{/if}}
        {{#if max_length }}
        "max_length": {{max_length}},
        {{/if}}
        {{#if min_length }}
        "min_length": {{min_length}},
        {{/if}}
        {{#if explanation }}
        "explanation": "{{explanation}}",
        {{/if}}
        {{#if use_if }}
        "use_if": "{{use_if}}",
        {{/if}}
        {{#ifCond required "==" true}} 
        "tab": "Grunduppgifter"
        {{else}}
        {{#ifCond required_in_ui "==" true}}
        "tab": "Grunduppgifter"
        {{else}}
        {{#ifCond @key '==' 'articleNumber'}}
        "tab": "Grunduppgifter"
        {{else}}
        {{#if tab }}
        "tab": "{{tab}}"
        {{/if}}
        {{/ifCond}}   
        {{/ifCond}}
        {{/ifCond}}
      },
      {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}
      {{/each}}
    }, 
    {{/each}}
    {{/each}}
  } 

  export default actionParameters;