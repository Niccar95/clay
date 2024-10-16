{{#if restrictedValues}}
<Select
  type="{{type}}"
  instanceId="select-{{@key}}"
  name="{{@key}}"
  placeholder="Skriv för att söka ..."
  {{#if this.required ~}} required {{/if ~}}
  {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
  {{#if readonly}}
  isDisabled
  {{else}}
  {{#if readonly_if }}
  isDisabled={readonly || {{readonly_if}} }
  {{else}}
  isDisabled={readonly}
  {{/if}}
  {{/if}}
{{#if readonly_in_ui}}
  // eslint-disable-next-line no-underscore-dangle
  isDisabled={!entity._recentCreate}
{{/if}}
  value={ entity.{{camelCase @key}} }
  onChange={this.handleChange}
{{#ifCond type '==' 'number'}}
  options={ [ {{#each restrictedValues}} {label:'{{label}}', value:{{value}} },  {{/each}} ] }
{{else}}
  options={ [ {{#each restrictedValues}} {label:'{{{label}}}', value:'{{value}}' },  {{/each}} ] }
{{/ifCond}}
/>
{{else}}

{{#switch type}}
  {{#case "confirm" ~}}
  <ConfirmInput
    name="{{@key}}"
  >
  </ConfirmInput>
  {{/case ~}}


  {{#case "object" "imageArray" "stringArray" "referenceList"  ~}}
  <JsonInput name="{{@key}}" value={ entity.{{@key}} } onChange={this.handleChange}/>
  {{/case ~}}
  {{#case "labels" ~}}
  <LabelSelect name="{{@key}}" value={ entity.{{@key}} } onChange={this.handleChange}     {{#if readonly}}
  disabled
  {{/if}}/>
  {{/case ~}}

  {{#case "boolean" ~}}
  <BooleanInput name="{{@key}}" id={`{{@key}}Field-${entity.id}`}
    value={ !! entity.{{@key}} }


    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
    onChange={this.handleChange}
  />
  {{/case ~}}
  {{#case "relation" ~}}
  {{#if original_relation}}
  <{{pascalCase original_relation}}Select
  {{else}}
  <{{pascalCase relation}}Select
  {{/if}}
    instanceId="select-{{@key}}"
    name="{{camelCase @key}}"

    {{#if immutableQuery}}
    immutableQuery={ {{{json immutableQuery}}} }
    {{/if}}
    {{#if readonly}}
    isDisabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     isDisabled={!entity._recentCreate}

     {{else}}
     isDisabled={readonly}
     {{/if}}
     {{/if}}

    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    value={ entity.{{camelCase @key}} }
    onChange={this.handleChange}
    {{#if this.fallbackEntity ~}} fallbackEntity={ {{{fallbackEntity}}} } {{/if }}
  />
  {{/case ~}}


  {{#case "reference" ~}}
  <{{pascalCase referenceType}}Select
  instanceId="select-{{@key}}"
  name="{{camelCase @key}}"

  {{#if immutableQuery}}
  immutableQuery={ {{{json immutableQuery}}} }
  {{/if}}
  {{#if readonly}}
  isDisabled
  {{else}}
  {{#if readonly_in_ui}}
  // eslint-disable-next-line no-underscore-dangle
   isDisabled={!entity._recentCreate}

   {{else}}
   isDisabled={readonly}
   {{/if}}
   {{/if}}

  {{#if this.required ~}} required {{/if ~}}
  {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
  value={ entity.{{camelCase @key}} }
  onChange={this.handleChange}
/>
  {{/case ~}}

  {{#case "S3image" "s3file" ~}}
  <FileUploader name="{{@key}}"

                value={ entity.{{@key}} }
                onChange={this.handleChange}
                {{#if this.required ~}} required {{/if ~}}
                {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
                />
  {{/case ~}}
  {{#case "croppedS3image" ~}}
  <FileCropper name="{{@key}}"

                value={ entity.{{@key}} }
                onChange={this.handleChange}
                {{#if this.required ~}} required {{/if ~}}
                {{#if this.width ~}} width={ {{{width}}} } {{/if ~}}
                {{#if this.height ~}} height={ {{{height}}} } {{/if ~}}
                {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
                />
  {{/case ~}}
  {{#case "pageLayout" ~}}
  <PageLayoutEditorModal name="{{@key}}"
                parentEntity={ parentEntity }
                value={ entity.{{@key}} }
                onChange={this.handleChange}
                />
  {{/case ~}}
  {{#case "articleFilterPanelConfig" ~}}
  <ArticleFilterConfigEditor name="{{@key}}"
                value={ entity.{{@key}} }
                onChange={this.handleChange}
                />
  {{/case ~}}

  {{#case "openingHours" ~}}

  <OpeningHoursInput name="{{@key}}"
                {{#if readonly}}
                disabled
                {{else}}
                disabled={readonly}
                {{/if}}
                value={ entity.{{@key}} }
                onChange={this.handleChange}
                />
  {{/case ~}}

  {{#case "regionSpecifics" ~}}
  <RegionSpecificsInput name="{{@key}}"
                value={ entity.{{@key}} }
                supplier={entity.supplier}
                customerSubUnit={entity.customerSubUnit}
                onChange={this.handleChange}
                />
  {{/case ~}}

  {{#case "html" ~}}
  <HtmlEditor name="{{@key}}"
              value={ entity.{{@key}} }

              onChange={this.handleChange}
              {{#if this.required ~}} required {{/if ~}}
              {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
              />
  {{/case ~}}
  {{#case "htmlTextArea" ~}}
  <div>
    <HtmlTextAreaEditor name="{{@key}}"
    value={ entity.{{@key}} }
    
    onChange={this.handleChange}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    />
  </div>
  {{/case ~}}
  {{#case "pipeString" ~}}
  <PipeString name="{{@key}}"
              value={ entity.{{@key}} }

              onChange={this.handleChange}
              {{#if filterOn}} filterOn={ {{{filterOn}}} || true } {{/if}}
              {{#if this.required ~}} required {{/if ~}}
              {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
              />
  {{/case ~}}
  {{#case "mapping" ~}}
  <MappingEditorModal name="{{@key}}"
              value={ entity.{{@key}} }
              integration={ parentEntity }
              reader={ entity.reader }
              onChange={this.handleChange}
              {{#if this.required ~}} required {{/if ~}}
              {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
              />
  {{/case ~}}
  {{#case "array" ~}}
  <{{pascalCase parent.name}}{{pascalCase action.name}}{{pascalCase name}}Input
              name="{{@key}}"
              editMode="{{editMode}}"
              parentEntity={ entity }
              sessionUser={sessionUser}
              entities={ entity.{{@key}} }
              onChange={this.handleChange}
              />
  {{/case ~}}

  {{#case "enum" ~}}
  <Select
    instanceId="select-{{@key}}"
    name="{{@key}}"

    placeholder="Skriv för att söka ..."
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if readonly}}
    isDisabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     isDisabled={!entity._recentCreate}

     {{else}}
     isDisabled={readonly}
     {{/if}}
     {{/if}}
    value={ entity.{{@key}} }
    {{#if filterOn}} filterOn={ {{{filterOn}}} } {{/if}}
    onChange={this.handleChange}
    options={ [ {{#each values}} { value: '{{key}}', label: ('{{{label}}}'||'{{{key}}}') }, {{/each}} ] }
  />
  {{/case ~}}
  {{#case "currency" ~}}
  <CurrencyInput
    instanceId="select-{{@key}}"
    name="{{@key}}"
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if readonly}}
    isDisabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     isDisabled={!entity._recentCreate}

     {{else}}
     isDisabled={readonly}
     {{/if}}
     {{/if}}
    value={ entity.{{@key}} }
    {{#if filterOn}} filterOn={ {{{filterOn}}} } {{/if}}
    onChange={this.handleChange}
  />
  {{/case ~}}
  {{#case "number" "money" "integer"~}}
  <NumberInput
    name="{{@key}}"
    id={`{{@key}}Field-${entity.id}`}

    value={ entity.{{@key}} }
    onChange={this.handleChange}
    {{#ifCond type '==' 'integer'}}
    isInteger={ true }
    {{/ifCond}}
    {{#if this.step ~}} step={ {{this.step}} } {{/if ~}}
    validationError="Ej giltig siffra"
    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if this.min_length ~}} min={ {{this.min_length}} } {{/if ~}}
    {{#ifCond this.min_length '===' 0 }} min={ 0 } {{/ifCond}}
    {{#if this.max_length ~}} max={ {{this.max_length}} } {{/if ~}}
  />
  {{/case ~}}
  {{#case "text" "markdown"}}
  <TextareaInput
    name="{{@key}}"
    id={`{{@key}}Field-${entity.id}`}
    {{#if this.disableValidations ~}}
    disableValidations
    {{/if ~}}
    value={entity.{{@key~}} }
    onChange={this.handleChange}
    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if this.min_length ~}} minLength={ {{this.min_length}} } {{/if ~}}
    {{#if this.max_length ~}} maxLength={ {{this.max_length}} } {{else}} maxLength={65535} {{/if ~}}
  />
  {{/case ~}}
  {{#case "date" ~}}
  <DatePicker
    name="{{@key}}"

    id={`{{@key}}Field-${entity.id}`}
    value={ entity.{{@key}} }
    onChange={this.handleChange}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if this.min_length ~}} minDate={ {{this.min_length}} } {{/if ~}}
    {{#if this.min_in_ui ~}} minDate={ {{this.min_in_ui}} } {{/if ~}}
    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
    {{#if weekdaysOnly}} filterDate={ date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    }}{{/if}}
    {{#if this.minDate ~}} minDate {{/if ~}}
    {{#if this.expanded ~}} expanded {{/if ~}}

  />
  {{/case}}
  {{#case "deliveryDate" ~}}
  <DeliveryDatePicker
    name="{{@key}}"

    id={`{{@key}}Field-${entity.id}`}
    value={ entity.{{@key}} }
    onChange={this.handleChange}
    entity={entity}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
  />
  {{/case}}
  {{#case "datetime" ~}}
  <DateTimePicker
    name="{{@key}}"

    id={`{{@key}}Field-${entity.id}`}
    value={ entity.{{@key}} }
    onChange={this.handleChange}
    {{#if this.required ~}} required {{/if ~}}
    {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
    {{#if weekdaysOnly}} filterDate={ date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    }}{{/if}}
    {{#if readonly}}
    disabled
    {{else}}
    {{#if readonly_in_ui}}
    // eslint-disable-next-line no-underscore-dangle
     disabled={!entity._recentCreate}

     {{else}}
     disabled={readonly}
     {{/if}}
     {{/if}}
  />
  {{/case}}
  {{#case "recurrence"}}
  <ReoccurenceInput
    name="{{@key}}"

    id={`{{@key}}Field-${entity.id}`}
    value={entity.{{@key~}} }
    onChange={this.handleChange}
    localized_name='{{this.localized_name}}'
  />
  {{/case}}
  {{#case "email" ~}}
  <EmailInput
      name="{{@key}}"

      id={`{{@key}}Field-${entity.id}`}
      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      onChange={this.handleChange}
      {{#if this.pattern ~}} pattern="{{{pattern}}}" {{/if }}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.allow_multiple ~}} allowMultiple {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      {{#if this.min_length ~}} minLength="{{this.min_length}}" {{/if ~}}
      {{#if this.max_length ~}} maxLength="{{this.max_length}}" {{/if ~}}
      />
  {{/case}}
  {{#case "taxNumber" ~}}
  <TaxNumberInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}
      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      onChange={this.handleChange}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      />
  {{/case}}
  {{#case "GTIN" ~}}
  <GTINInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}
      value={ entity.{{@key}} }
      article={entity}
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      {{#if show_import_button}}
      showImportButton
      {{/if}}
      onChange={this.handleChange}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      owningSupplierOrganizationId={sessionUser.organization.id}
      />
  {{/case}}
  {{#case "GLN" ~}}
  <GLNInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}
      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      onChange={this.handleChange}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      />
  {{/case}}
  {{#case "password" ~}}
  <TextInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}

      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      type="password"
      onChange={this.handleChange}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      {{#if this.require_repeat_of ~}} requireRepeatOf="{{this.require_repeat_of}}" {{/if ~}}
      {{#if this.min_length ~}} minLength={ {{this.min_length}} } {{/if ~}}
      {{#if this.max_length ~}} maxLength={ {{this.max_length}} } {{/if ~}}
  />
  {{/case}}
  {{#case "querySpecification" ~}}
  <{{pascalCase specificationForType}}FilterPanelModal
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}
      querySpecification={ entity.{{@key}} }
      onSubmit={(newValue) => this.handleChange('{{@key}}', newValue)}
  />
  <pre>{JSON.stringify(entity.{{@key}}, null, 2)}</pre>
  {{/case}}
  {{#case "articleQuantity" ~}}
  <ArticleQuantityInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}
      {{#if this.article_reference ~}}
      article={entity.{{this.article_reference}} }
      {{else}}
      article={entity.article}
      {{/if ~}}
      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      disabled={readonly}
      {{/if}}
      {{#if warehouseIsWeighingForDistribution}}
      warehouseIsWeighingForDistribution
      {{/if}}
      onChange={this.handleChange}
      showOrderUnitSelect
  />
  {{/case}}
  {{#case "navbarConfig" ~}}
  <div>
    <Link href={`/app/shop-configs/${entity.id}/navbar-edit`}>
      <Button>Navbar konfiguration</Button>
    </Link>
  </div>
  {{/case}}
  {{#case "cartProgressBarsColors" ~}}
  <CartProgressBarsColorsEditor 
    onChange={this.handleChange} 
    value={entity.cartProgressBarsColors}
    name="{{@key}}"
  />
  {{/case}}
  {{#case "intercomConfig" ~}}
    <IntercomConfigEditor 
      name="{{@key}}"
      value={ entity.{{@key}} }
      onChange={this.handleChange}
      />
  {{/case}}
  {{#case "attachments" ~}}
  {{/case}}
  {{#case "userAccessString" ~}}
  {{/case}}
  {{#default ~}}
  <TextInput
      name="{{@key}}"
      id={`{{@key}}Field-${entity.id}`}

      value={ entity.{{@key}} }
      {{#if readonly}}
      disabled
      {{else}}
      {{#if readonly_if }}
      disabled={readonly || {{readonly_if}} }
      {{else}}
      disabled={readonly}
      {{/if}}
      {{/if}}
      onChange={this.handleChange}
      {{#if this.pattern ~}} pattern="{{{pattern}}}" {{/if }}
      {{#if this.required ~}} required {{/if ~}}
      {{#if this.required_in_ui ~}} required={ {{{required_in_ui}}} } {{/if }}
      {{#if this.min_length ~}} minLength={ {{this.min_length}} } {{/if ~}}
      {{#if this.max_length ~}} maxLength={ {{this.max_length}} } {{/if ~}}
      />
  {{/default}}
{{/switch}}
{{/if}}
