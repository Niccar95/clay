{{#each this.fields}}
  {{#ifCond type "!=" "relation" }}
  {{@key}}: {
    {{#switch type}}
      {{#case "enum" ~}}
        type: Sequelize.ENUM({{#each values}}'{{key}}',{{/each}})
      {{/case ~}}
      {{#case "currency" ~}}
        type: Sequelize.ENUM('SEK', 'NOK', 'DKK', 'EUR', 'GBP', 'USD')
      {{/case ~}}
      {{#case "croppedS3image" "S3image" "s3file"~}}
       type: Sequelize.STRING(2000)
      {{/case ~}}
      {{#case "object" "openingHours" "regionSpecifics" "attachments" "stringArray" "imageArray" "referenceList" "labels" "querySpecification" ~}}
        type: Sequelize.JSONB
      {{/case ~}}
      {{#case "datetime" ~}}
      type: Sequelize.DATE,
      get () {
        const value = this.getDataValue('{{@key}}');

        if(value && value.getTime() === 0){
          return null;
        };

        return value
      }
    {{/case ~}}
      {{#case "date" "deliveryDate" ~}}
        type: Sequelize.DATEONLY,
        get () {
          const value = this.getDataValue('{{@key}}');

          if(!value){
            return null;
          };
          return moment.utc(value).format('YYYY-MM-DD');
        }
      {{/case ~}}
      {{#case "recurrence" "email" "password" "GTIN" "GLN" "pipeString" ~}}
        type: Sequelize.STRING
      {{/case ~}}
      {{#case "userAccessString" ~}}
        type: Sequelize.STRING(36)
      {{/case ~}}
      {{#case "taxNumber" ~}}
        type: Sequelize.STRING(13)
      {{/case ~}}

      {{#case "pageLayout" "navbarConfig" "cartProgressBarsColors" "intercomConfig" "reference" "mapping" "articleFilterPanelConfig"}}
        type: Sequelize.JSONB
      {{/case ~}}
      {{#case "number" "money" "articleQuantity" ~}}
        type: Sequelize.DECIMAL
      {{/case ~}}
      {{#case "integer" ~}}
      type: Sequelize.INTEGER
      {{#if this.autoIncrement }}, autoIncrement: true {{/if}}
    {{/case ~}}
      {{#case "boolean" ~}}
        type: Sequelize.BOOLEAN,
        {{#ifCond this.default '!=' undefined }} defaultValue: {{{this.default}}} {{/ifCond}}
        {{#ifCond this.default '==' undefined }} defaultValue: false {{/ifCond}}
      {{/case ~}}
      {{#case "text" "html" "markdown" "htmlTextArea" ~}}
        type: Sequelize.TEXT
      {{/case ~}}
      {{#default ~}}
        type: Sequelize.{{toUpper type}}{{#if max_length}}({{ max_length }}){{/if}}
      {{/default}}
    {{/switch}}
    {{#if this.primary }}, primaryKey: true {{/if}}
    {{#if this.unique }}, unique: true {{/if}}
    {{#if this.required }}, allowNull: false {{/if}}
    {{#ifCond type '!=' 'boolean' }}{{#ifCond this.default '!=' undefined }}, defaultValue: {{{this.default}}} {{/ifCond}}{{/ifCond}}
  },
  {{/ifCond}}
{{/each}}
metadata: { type: Sequelize.JSONB }

