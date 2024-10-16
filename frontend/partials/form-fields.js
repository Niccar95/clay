{{#each fields}}
{{#ifCond @key '!=' 'id'}}{{#ifCond @key '!=' 'metadata'}}{{#ifCond type '!=' 'userAccessString'}}
{ /* eslint-disable-next-line */ }
{ ({{#if display_if }} {{{display_if}}} && {{/if}} {{#ifCond type "==" "relation" ~}}
typeof immutableFields.{{camelCase @key}} === 'undefined') && (
{{else}}
typeof immutableFields.{{@key}} === 'undefined') && (
{{/ifCond}}

{{#ifCond this.type '==' 'boolean'}}
<Col md={modal?12:4}>
{{else}}
<Col xl={12}>
{{/ifCond}}
<FormGroup>
{ /* eslint-disable-next-line */ }

  {{#ifCond this.type '==' 'array'}}<h4>{{this.localized_name}}</h4> {{/ifCond}}
  {{#ifCond this.type '!=' 'array'}}<Label>{{this.localized_name}}{{#if helpLink }} <Link href="{{helpLink}}" target="_blank">{{#if helpLinkIcon}}<FontAwesomeIcon icon={ {{helpLinkIcon}} } />{{else}}{{helpLinkText}}{{/if}}</Link>{{/if}}</Label> {{/ifCond}}

  {{> form-input parent=../parent action=../action}}
  {{#if explanation}}
    <div color="muted" className="mb-1">
        {/* eslint-disable-next-line */}
      {{{explanation}}}
    </div>
  {{else}}
  <div color="muted" className="mb-1">
        {/* eslint-disable-next-line */}
      {" "} &nbsp;
    </div>
  {{/if}}
</FormGroup>
</Col>
)}
{{/ifCond}}{{/ifCond}}{{/ifCond}}
{{/each}}
