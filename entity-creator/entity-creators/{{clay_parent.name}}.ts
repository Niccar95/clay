/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/

// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '../../faker-setup';
import moment from 'moment';
import * as Types from 'domain-model/types/{{kebabCase clay_parent.name}}';

interface Subentity {
    relation: string;
    field: string;
    subentities: {};
  }

function calculateCheckDigit(digits: string): string {
  const gtinArray = digits.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < gtinArray.length; i++) {
    sum += i % 2 === 0 ? gtinArray[i] * 3 : gtinArray[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
}

function gtin13OrGln(): string {
  let gtinDigits = '';
  for (let i = 0; i < 12; i++) {
    gtinDigits += faker.number.int({ min: 0, max: 9 }).toString();
  }

  const checkDigit = calculateCheckDigit(gtinDigits);
  return gtinDigits + checkDigit;
}


const {{camelCase clay_parent.name}} = {
    {{#each types}}
        "{{camelCase name}}": {
            "fullEntity": (fields?: Partial<Types.{{pascalCase name}}>): {
                name: string;
                subentities: Subentity[];
                entity: Types.{{pascalCase name}};
              } => {

                const subentities: Subentity[] = [];

                {{#each fields}}
                {{~#ifCond type '==' 'enum'}}
                const {{@key}}Array: Types.{{pascalCase @key}}[] = [
                    {{#each values}}Types.{{pascalCase @../key}}.{{key}},{{/each}}
                ]
                {{/ifCond}}
                {{~#ifCond type '==' 'currency'}}
                const currencyArray: Types.Currency[] = [
                    Types.Currency.SEK, 
                    Types.Currency.NOK, 
                    Types.Currency.DKK,
                    Types.Currency.EUR, 
                    Types.Currency.USD, 
                    Types.Currency.GBP
                ]
                {{/ifCond}}
                {{~#ifCond type '==' 'relation'}}
                subentities.push({relation: '{{relation}}', field: '{{camelCase @key}}', subentities: {{camelCase ../../clay_parent.name}}.{{camelCase relation}}.minimalEntity().subentities, })
                {{/ifCond}}
                {{/each}}
                

                return {
                    "name": "{{camelCase name}}",
                    subentities,
                    "entity": {
                        {{#each fields}}
                            {{~#ifCond @key '==' 'id'}}
                                id: fields?.id || faker.string.uuid(),
                            {{/ifCond}}
                            {{~#ifCond @key '==' 'childId'}}
                                childId: fields?.childId || faker.string.uuid(),
                            {{/ifCond}}
                            {{~#ifCond @key '!=' 'id'}}
                                {{~#ifCond @key '!=' 'childId'}}
                                    {{#ifCond @key '!=' 'metadata'}}
                                        {{> faker-types parent=../../clay_parent.name}} 
                                    {{/ifCond~}}
                                {{/ifCond~}}
                            {{/ifCond~}}
                        {{/each}}
                        {{#each children}}
                            "{{@key}}": [],
                        {{/each}}     
                    }
                }
            },
            "minimalEntity": (fields?: Partial<Types.{{pascalCase name}}>): {
                name: string;
                subentities: Subentity[];
                entity: Types.{{pascalCase name}};
              } => {

                const subentities: Subentity[] = [];

                {{#each fields}}
                {{~#ifCond required '==' true}}
                {{~#ifCond type '==' 'enum'}}
                const {{@key}}Array: Types.{{pascalCase @key}}[] = [
                    {{#each values}}Types.{{pascalCase @../key}}.{{key}},{{/each}}
                ]
                {{/ifCond}}
                {{~#ifCond type '==' 'currency'}}
                const currencyArray: Types.Currency[] = [
                    Types.Currency.SEK, 
                    Types.Currency.NOK, 
                    Types.Currency.DKK,
                    Types.Currency.EUR, 
                    Types.Currency.USD, 
                    Types.Currency.GBP
                ]
                {{/ifCond}}
                {{~#ifCond type '==' 'relation'}}
                subentities.push({relation: '{{relation}}', field: '{{camelCase @key}}', subentities: {{camelCase ../../clay_parent.name}}.{{camelCase relation}}.minimalEntity().subentities, })
                {{/ifCond}}
                {{/ifCond}}
                {{/each}}
                

                return {
                    "name": "{{camelCase name}}",
                    subentities,
                    "entity": {
                        {{#each fields}}
                            {{~#ifCond @key '==' 'id'}}
                                id: fields?.id || faker.string.uuid(),
                            {{/ifCond}}
                            {{~#ifCond @key '==' 'childId'}}
                                childId: fields?.childId || faker.string.uuid(),
                            {{/ifCond}}
                            {{~#ifCond @key '!=' 'id'}}
                                {{~#ifCond @key '!=' 'childId'}}
                                    {{#ifCond @key '!=' 'metadata'}}
                                        {{~#ifCond required '==' true}}
                                        {{> faker-types parent=../../clay_parent.name}}
                                        {{/ifCond}} 
                                    {{/ifCond~}}
                                {{/ifCond~}}
                            {{/ifCond~}}
                        {{/each}}
                        {{#each children}}
                            "{{@key}}": [],
                        {{/each}}    
                    }
                }
            }, 
        },
    {{/each}}
}

module.exports = {{camelCase clay_parent.name}};