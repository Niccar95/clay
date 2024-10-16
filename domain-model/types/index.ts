import * as extension from './extension';
export * from './extension';


export enum Currency {
  SEK = 'SEK', 
  NOK = 'NOK', 
  DKK = 'DKK',
  EUR = 'EUR', 
  USD = 'USD', 
  GBP = 'GBP'
}

// this needs to be shared because labels exist on entities in multiple services
export interface LabelSharedOverDomains {
  /**
   * primary key
   */
  id?: string;
  name: string;
  color?: string;
  active?: boolean;
  owningSupplierOrganizationId?: string;
  metadata?: { [key: string]: string };
}

{{#eachUniqueJSONPath types '$..[?(@.restrictedValues&&!@.skipTSEnumGeneration)]'}}
{{> description }}
export enum {{pascalCase @key}} {
  {{#each restrictedValues}}{{#isNumber value}}'num_{{value}}'{{else}}'{{value}}'{{/isNumber}}='{{value}}',{{/each}}
}
{{/eachUniqueJSONPath}}

{{#each types}}
{{#each fields}}

{{#ifCond type '==' 'enum'}}
{{> description }}
export enum {{pascalCase @key}} {
  {{#each values}}{{key}}='{{key}}',{{/each}}
}
{{/ifCond}}
{{/each}}

{{#each children}}
{{#each fields}}
{{#ifCond type '==' 'enum'}}
{{> description }}
export enum {{pascalCase ../name}}{{pascalCase @key}} {
  {{#each values}}{{key}}='{{key}}',{{/each}}
}
{{/ifCond}}
{{/each}}
{{/each}}
{{/each}}


{{#each types}}
{{#each children}}
// generated children types, need to be generated before head entities
      {{> description }}
      export interface {{singularize (pascalCase name)}} {
        {{#each fields}}
        {{> description }}
          {{> typescript-fields fields=fields parent=..}}
        {{/each}}
        {{#ifCond doNotGenerateRowNumbers '==' true}}
        {{else}}
          rowNumber?: number;
        {{/ifCond}}
        metadata?:  {[key: string]: string};
        [key: string]: object | string | number | boolean | undefined;
      }
{{/each}}

// Generated main entities

{{> description }}
    export interface {{singularize (pascalCase name)}} {
      {{#each children}}
      {{pluralize name}}: Array<{{singularize (pascalCase name)}}>;
      {{/each}}
      {{#each fields}}
        {{> description }}
        {{> typescript-fields fields=fields parent=..}}
    {{/each}}
    {{#each calculatedFields}}
    {{> description }}
    {{> typescript-fields fields=fields parent=.. calculated=true }}
    {{/each}}
    metadata?:  {[key: string]: string};
    [key: string]: object | string | number | boolean | undefined;
    }

    /**
     * A {{pascalCase name}}Reference is a shortened form of {{pascalCase name}} used in lists and references
     */
    export interface {{singularize (pascalCase name)}}Reference {
      {{#each fields}}
      {{#ifCond is_available_in_reference '==' true}}
        {{> typescript-fields fields=fields parent=..}}
        {{/ifCond}}
    {{/each}}
    {{#each calculatedFields}}
    {{#ifCond is_available_in_reference '==' true}}
        {{> typescript-fields fields=fields parent=..}}
        {{/ifCond}}
    {{/each}}

    metadata?:  {[key: string]: string};
    [key: string]: object | string | number | boolean | undefined;
    }

    {{#each actions}}

    {{#each parameters}}
    {{#ifCond type '==' 'enum'}}
    {{> description }}
    export enum {{pascalCase ../name}}{{pascalCase @key}} {
      {{#each values}}{{key}}='{{key}}',{{/each}}
    }
    {{/ifCond}}
    
    {{#ifCond type '==' 'array'}}

    {{#each props}}
    {{#ifCond type '==' 'enum'}}
    {{> description }}
    export enum {{pascalCase ../name}}{{pascalCase @key}} {
      {{#each values}}{{key}}='{{key}}',{{/each}}
    }
    {{/ifCond}}
    {{/each}}

    // parameter generation input below
    {{#if props}}
    {{> description }}
    export interface {{pascalCase ../name}}{{singularize (pascalCase name)}}Parameters {
      {{#each props}}
      {{> description }}
        {{> typescript-fields fields=fields parent=..}}
      {{/each}}
      metadata?: {[key: string]: string};
      lookups?:  {[key: string]: any};
      lookupsIgnoreNotFound?:  {[key: string]: any};
      target?:  {[key: string]: any};
      [key: string]: object | string | number | boolean | undefined;
    }
    {{/if}}
    {{/ifCond}}
    {{/each}}
    {{/each}}

{{#each actions}}

  {{> description }}
  export interface {{pascalCase ../name}}{{pascalCase name}}Parameters {
    {{#each parameters}}
      {{> description }}
      {{> typescript-fields fields=fields parent=..}}
  {{/each}}

  metadata?: {[key: string]: string};
  lookups?:  {[key: string]: any};
  lookupsIgnoreNotFound?:  {[key: string]: any};
  target?:  {[key: string]: any};
  [key: string]: object | string | number | boolean | undefined;
  }

  {{/each}}
{{/each}}
