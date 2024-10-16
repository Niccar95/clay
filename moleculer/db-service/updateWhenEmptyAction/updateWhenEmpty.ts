/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import { ServiceContext, Service } from 'shared-service/types';
import type { {{pascalCase name}}UpdateWhenEmptyParameters, {{pascalCase name}} } from 'domain-model/types/{{clay_parent.clay_parent.name}}';


const _ = require('lodash')

function propertyIsAllowedToBeUpdated(params: {{pascalCase name}}UpdateWhenEmptyParameters,  property:keyof {{pascalCase name}}, existingEntity: {{pascalCase name}}) {
  // @ts-ignore
  if(!params[property]) return false;
  // @ts-ignore
  if(_.isArray(params[property]))  {
    if(_.isEmpty(existingEntity[property])) {
      return true;
    }
    return false;
  }
  
  return existingEntity[property] === undefined || 
  existingEntity[property] === null || 
  existingEntity[property] === ''
}

export default function updateWhenEmpty(this:Service<{{pascalCase name}}UpdateWhenEmptyParameters>,ctx: ServiceContext<{{pascalCase name}}UpdateWhenEmptyParameters>, params: {{pascalCase name}}UpdateWhenEmptyParameters, existingEntity?: {{pascalCase name}}) {
  if(!existingEntity) {
    // eslint-disable-next-line consistent-return
    return;
  }
  {{#each fields}}
  {{#ifCond type "==" "relation" ~}}
  if(!propertyIsAllowedToBeUpdated(params,  '{{camelCase @key}}', existingEntity )) {
    // @ts-ignore
    delete ctx.params.{{camelCase @key}}
  {{else}}
  if(!propertyIsAllowedToBeUpdated(params,  '{{@key}}', existingEntity )) {
    // @ts-ignore
    delete ctx.params.{{@key}}
  {{/ifCond}}
  }
  {{/each}}

  {{#each children}}
  {{#ifCond type "==" "relation" ~}}
  if(!propertyIsAllowedToBeUpdated(params,  '{{camelCase @key}}', existingEntity )) {
    // @ts-ignore
    delete ctx.params.{{camelCase @key}};
  {{else}}
  if(!propertyIsAllowedToBeUpdated(params,  '{{@key}}', existingEntity )) {
    // @ts-ignore
    delete ctx.params.{{@key}};
  {{/ifCond}}
    }
  {{/each}}

  // eslint-disable-next-line consistent-return
  return this.updateOrCreate(ctx);
};

