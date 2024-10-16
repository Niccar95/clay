/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
{{#each actions}}
import { {{pascalCase name}}Form } from './{{pascalCase name}}Form';
import { {{pascalCase name}}ModalForm } from './{{pascalCase name}}ModalForm';
{{/each}}

export {
{{#each actions}}
{{pascalCase name}}Form,
{{pascalCase name}}ModalForm,
{{/each}}
};
