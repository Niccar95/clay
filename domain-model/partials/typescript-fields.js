{{#if typeScriptObject}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:extension.{{typeScriptObject}};
{{/if}}

{{#unless typeScriptObject}}
{{#switch type}}
{{#case "enum"  }}
{{#if parent.props}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}: {{pascalCase parent.name}}{{pascalCase @key}};
{{else}}
{{#if parent.parameters}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}: {{pascalCase parent.name}}{{pascalCase @key}};
{{else}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}: {{pascalCase @key}};
{{/if}}
{{/if}}
{{/case }}
{{#case "croppedS3image" "S3image" "s3file"}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/case }}
{{#case "object" "openingHours" "regionSpecifics" "attachments" "querySpecification" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:{[key:string]:any};
{{/case }}
{{#case "stringArray" "imageArray" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Array<string>;
{{/case }}
{{#case "datetime" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Date;
{{/case }}
{{#case "date" "deliveryDate" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Date;
{{/case }}
{{#case "recurrence" "email" "password" "GTIN" "GLN" "pipeString" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/case }}
{{#case "taxNumber" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/case }}
{{#case "pageLayout" "navbarConfig" "cartProgressBarsColors" "intercomConfig" "reference" "mapping" "articleFilterPanelConfig" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:object;
{{/case }}
{{#case "number" "money" "articleQuantity" "integer"}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:number;
{{/case }}
{{#case "boolean" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:boolean;
{{/case }}
{{#case "text" "html" "markdown" "htmlTextArea" }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/case }}
{{#case 'relation'}}
{{camelCase @key}}{{#ifCond required '!=' true}}?{{/ifCond}}:{{singularize (pascalCase relation)}}Reference;
{{/case}}
{{#case 'array'}}
{{#if props}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Array<{{pascalCase parent.name}}{{pascalCase (singularize name)}}Parameters>;
{{else}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Array<{{pascalCase (singularize name)}}>;
{{/if}}
{{/case}}
{{#case 'labels'}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Array<LabelSharedOverDomains>;
{{/case}}
{{#case 'currency' }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:Currency;
{{/case}}
{{#case 'string' }}
{{#if restrictedValues}}
{{#unless skipTSEnumGeneration}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}: {{pascalCase @key}};
{{else}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/unless}}
{{else}}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/if}}
{{/case}}
{{#default }}
{{#if calculated}}readonly {{/if}}{{@key}}{{#ifCond required '!=' true}}?{{/ifCond}}:string;
{{/default}}
{{/switch}}
{{/unless}}
