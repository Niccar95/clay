import { ServiceContext, Service } from 'shared-service/types';
import type { {{pascalCase clay_parent.clay_parent.name}}{{pascalCase name}}Parameters, {{pascalCase clay_parent.clay_parent.name}} } from 'domain-model/types/{{clay_parent.clay_parent.clay_parent.clay_parent.name}}';

/*
  {{description}}
*/
export default async function {{name}}(this:Service<{{pascalCase clay_parent.clay_parent.name}}{{pascalCase name}}Parameters>,ctx: ServiceContext<{{pascalCase clay_parent.clay_parent.name}}{{pascalCase name}}Parameters>, params: {{pascalCase clay_parent.clay_parent.name}}{{pascalCase name}}Parameters, existingEntity{{#ifCond canCreate '!=' true}}?{{/ifCond}}: {{pascalCase clay_parent.clay_parent.name}}) {
  {{#ifCond name '==' 'upsert'}}
  // below is the default in case of upsert or just plain updates
  return this.updateOrCreate(ctx, params, existingEntity);
  {{else}}
  // generate co-pilot code here by pressing enter and use tab completion to select the correct function
  {{/ifCond}}
};
