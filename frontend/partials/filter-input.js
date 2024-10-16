
{{#if restrictedValues}}
<Label>{{localized_name}}</Label>
<Select
  type="{{type}}"
  instanceId="select-{{@key}}"
  name="{{@key}}"

  value={ _.get(resolvedQuery, '{{@key}}') }
  onChange={handleChange}
{{#ifCond type '==' 'number'}}
  options={ [ {{#each restrictedValues}} {label:'{{label}}', value:{{value}} },  {{/each}} {label:'Alla', value:undefined } ] }
{{else}}
  options={ [ {{#each restrictedValues}} {label:'{{label}}', value:'{{value}}' },  {{/each}} {label:'Alla', value:undefined } ] }
{{/ifCond}}
/>
{{else}}
{{#switch type}}
  {{#case "object" ~}}
  {{/case ~}}
  {{#case "boolean" ~}}
  <Label>{{localized_name}}</Label><br/>
  <ButtonGroup>
  <Button color="secondary" active={ _.get(resolvedQuery, '{{@key}}') === undefined}
    onClick={()=>{ handleChange('{{@key}}', undefined)} }>
    Alla
  </Button>
  <Button color="secondary" active={ _.get(resolvedQuery, '{{@key}}') === true  || _.get(resolvedQuery, '{{@key}}') === 'true' }
    onClick={()=>{ handleChange('{{@key}}', true)} }>
    Ja
  </Button>
  <Button color="secondary" active={ _.get(resolvedQuery, '{{@key}}') === false ||  _.get(resolvedQuery, '{{@key}}') === 'false' }
  onClick={()=>{ handleChange('{{@key}}', false)} }>
    Nej
  </Button>
</ButtonGroup>
  {{/case ~}}
  {{#case "relation" ~}}
  <Label>{{localized_name}}</Label>
  {{#if original_relation}}
  <{{pascalCase original_relation}}Select
  {{else}}
  <{{pascalCase relation}}Select
  {{/if}}
    defaultOptions={false}
    instanceId="select-{{camelCase @key}}"
    name="{{camelCase @key}}"
    value={ _.get(resolvedQuery, '{{camelCase @key}}') }
    onChange={handleChange}
  />
  {{/case ~}}
  {{#case "labels" ~}}
  <Label>{{localized_name}}</Label>
  <LabelInput
    instanceId="select-{{camelCase @key}}"
    name="{{camelCase @key}}"
    value={ _.get(resolvedQuery, '{{camelCase @key}}') }
    onChange={handleChange}
  />
  {{/case ~}}

  {{#case "pipeString" ~}}
  <Label>{{localized_name}}</Label>
  <PipeStringFilter
    name="{{@key}}"
    value={ _.get(resolvedQuery, '{{@key}}') }
    onChange={handleChange}
  />
  {{/case ~}}

  {{#case "enum" ~}}
  <Label>{{localized_name}}</Label>
  <Select
    instanceId="select-{{@key}}"
    name="{{@key}}"
    value={ _.get(resolvedQuery, '{{@key}}','') }
    onChange={handleChange}
    {{#if linkedField}}
      options={ [ {{#each values}}
        { value: '{{key}}', label: ('{{label}}'||'{{key}}'), link: '{{link}}' },
        {{/each}} {label:'', value:undefined } ].filter(x => x.link === resolvedQuery.{{linkedField}} ) }
    {{else}}
      options={ [ {{#each values}} { value: '{{key}}', label: ('{{label}}'||'{{key}}') }, {{/each}} {label:'Alla', value:undefined } ] }
    {{/if}}
  />
  {{/case ~}}

  {{#case "currency" ~}}
  <Label>{{localized_name}}</Label>
  <Select
    instanceId="select-{{@key}}"
    name="{{@key}}"
    value={ _.get(resolvedQuery, '{{@key}}','') }
    onChange={handleChange}
    options={ [ {value: "SEK", label: "SEK"}, {value: "NOK", label: "NOK"}, {value: "DKK", label: "DKK"} ] }
  />
  {{/case ~}}

  {{#case "number" ~}}

  <Label>{{localized_name}}</Label>
        <NumberFilterInput
          name="{{@key}}"
          value={ _.get(resolvedQuery, '{{@key}}') }
          onChange={handleChange}
        />
  {{/case ~}}

  {{#case "date" "deliveryDate" "datetime" ~}}
    <Label>{{localized_name}}</Label>
    <DateRangePicker
      name="{{@key}}"
      value={_.get(resolvedQuery, '{{@key}}') }
      onChange={handleChange}
      />
  {{/case}}
  {{#default ~}}

  {{/default}}
{{/switch}}
{{/if}}
