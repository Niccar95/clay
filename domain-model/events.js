module.exports = {
  {{#each types ~}}
    {{#each events ~}}
      {{#if localized_name }}
      {{@key}}:'{{localized_name}}',
      {{else}}
      {{@key}}:'{{@key}}',
      {{/if}}
    {{/each~}}
    {{/each~}}
  };

