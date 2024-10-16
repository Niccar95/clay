/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import lodashUUID from 'lodash-uuid';
_.mixin(lodashUUID);

import domainModel from 'domain-model';
import flaivyReact from 'flaivy-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'

import {
  FormGroup,Input, Alert,
  Col, Row, Button, Label, Table, TabContent, TabPane, Nav, NavItem, NavLink, Collapse,
  FormText,
} from 'reactstrap';
import Formsy from 'formsy-react';
import {
  NumberInput, BooleanInput, Select, HtmlEditor, HtmlTextAreaEditor, TextInput, TextareaInput,
  DateTimePicker,DatePicker, EmailInput, DeliveryDatePicker, ArticleFilterConfigEditor,
  ConfirmInput, ShowWhenContainsOtherThanH5, OpeningHoursInput, RegionSpecificsInput,
  PipeString, FileCropper, FileUploader, GTINInput, GLNInput, TaxNumberInput, ArticleQuantityInput,
  JsonInput, CurrencyInput, LabelInput, LabelSelect, ArticleFilterPanelModal, CartProgressBarsColorsEditor, 
  IntercomConfigEditor
} from 'components/inputs'
import { confirm } from 'flaivy-react';

import { RegionSpecifics } from 'flaivy-react/components/detail-fields';

import {
{{#each parameters}}
{{#ifCond type '==' 'reference'}}
{{pascalCase referenceType}}Select,
 {{/ifCond}}
 {{#ifCond type '==' 'relation'}}
 {{#if original_relation}}
 {{pascalCase original_relation}}Select,
 {{else}}
 {{pascalCase relation}}Select,
 {{/if}}
 {{/ifCond}}
 {{/each}}
 } from 'components/Selects'

{{#each parameters}}
{{#ifCond type '==' 'array'}}
import {{pascalCase ../clay_parent.clay_parent.name}}{{pascalCase ../name}}{{pascalCase name}}Input
 from 'components/inputs/generated/{{pascalCase ../clay_parent.clay_parent.name}}{{pascalCase ../name}}{{pascalCase name}}Input'
 {{/ifCond}}
 {{#ifCond type '==' 'reference'}}
import {{pascalCase ../clay_parent.clay_parent.name}}{{pascalCase ../name}}{{pascalCase name}}Input
 from 'components/inputs/generated/{{pascalCase ../clay_parent.clay_parent.name}}{{pascalCase ../name}}{{pascalCase name}}Input'
 {{/ifCond}}

 {{/each}}

import {
  {{ camelCase name }},
} from 'app/shared/actions/generated/{{kebabCase clay_parent.clay_parent.name}}.actions';

class {{ pascalCase name }}Form extends React.Component {

  static get propTypes() {
    return {
      entity: PropTypes.object.isRequired,
      immutableFields: PropTypes.object,
      onChange: PropTypes.func,
      resetOnSubmit: PropTypes.bool,
      onSubmit: PropTypes.func,
      translateError: PropTypes.func,
      transformParamsPreSubmit: PropTypes.func,
      className: PropTypes.string,
      mutateEntityOnChange: PropTypes.func,
      submitButtonText: PropTypes.string,
      color: PropTypes.string,
      readonly: PropTypes.bool,
      disabled: PropTypes.bool,
      modal: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      immutableFields: {},
      submitButtonText: "{{#if submitButtonText}}{{submitButtonText}}{{else}}{{#if localized_name}}{{localized_name}}{{else}}Spara{{/if}}{{/if}}",
      resetOnSubmit: false,
      transformParamsPreSubmit: (params) => params,
      onChange: () => {},
      color: undefined,
      className: '',
      readonly:false,
      disabled:false,
      modal: false,
      mutateEntityOnChange: (entity) => entity,
      onSubmit:  () => {},
      translateError: err => {
        if (_.get(err, 'response.status') === 409) {
          const uniqueErrors = err.response.data.data.filter(error => error.path !== 'owningSupplierOrganizationId');
          
          const result = uniqueErrors.map(uniqueError => `${domainModel.getTranslation('{{clay_parent.clay_parent.name}}',uniqueError.path)} finns redan och måste vara unikt`).join('\n');
          return result;
        }
        if (_.get(err, 'response.status') === 422) {
          const validationErrors = err.response.data.data;
          const result = validationErrors.map(validation => validation.message);
          return result.join('\n');
        }
        return _.get(err, 'response.data.message', JSON.stringify(err));
      },
    };
  }

  static defaultActionValues() {
    return {
        {{#each parameters}}
        {{~#ifCond @key '==' 'id'}}
          id: _.uuid(),
        {{/ifCond}}
        {{~#ifCond @key '==' 'childId'}}
        childId: _.uuid(),
        {{/ifCond}}
        {{~#ifCond @key '!=' 'id'}}{{~#ifCond @key '!=' 'childId'}}{{#ifCond @key '!=' 'metadata'}}
        {{~#ifCond this.default '!=' undefined}}
          {{@key}}: {{{this.default}}},
        {{else}}
        {{~#switch type}}
        {{#case 'boolean' }}
          {{@key}}: false,
        {{/case}}
        {{#case 'date' }}
          {{@key}}: undefined,
        {{/case}}
        {{#case 'relation' }}
          {{camelCase @key}}: undefined,
        {{/case}}
        {{#case 'user' }}
          {{@key}}: null,
        {{/case}}
        {{#case 'array' }}
        {{@key}}: [],
        {{/case}}
        {{#case 'string' }}
        {{@key}}: '',
        {{/case}}
        {{#case 'text' }}
        {{@key}}: '',
        {{/case}}
        {{#case 'number' }}
        {{@key}}: undefined,
        {{/case}}
        {{#case 'userAccessString'~}}{{/case~}}
        {{#default}}
          {{@key}}: undefined,
        {{/default}}
        {{/switch}}
        {{/ifCond}}
        {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
        {{/each}}
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { submitting: false, errorMessage: JSON.stringify({message:error.message, stack: error.stack}) }
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setFormToValid = this.setFormToValid.bind(this);
    this.setFormToInvalid = this.setFormToInvalid.bind(this);
    this.createMergedEntity = this.createMergedEntity.bind(this);
    this.update = this.update.bind(this);

    this.state =  {
      entity: this.createMergedEntity(),
      formIsValid: true,
    };
  }

  componentDidUpdate(prevProps) {
    const { entity } = this.props;
    if (entity !== prevProps.entity) {
      // eslint-disable-next-line
      this.setState({entity: this.createMergedEntity()});
    }
  }

  handleOnClick(event){
    event.stopPropagation();
    if(event.detail !== 1) {
      return;
    }
    this.handleSubmit(event);
  }

  async handleSubmit(event) {
    event.stopPropagation();

    const { immutableFields, onSubmit, resetOnSubmit, transformParamsPreSubmit, translateError} = this.props;
    const { entity } = this.state;

    {{#if conditional}}
    /* eslint-disable */
    if (!await confirm('{{conditional}}')) {
      return;
    }
    /* eslint-enable */
    {{/if}}

    await this.setState({submitting: true})

    let submitParams = entity;
    if (transformParamsPreSubmit && _.isFunction(transformParamsPreSubmit)) {
       submitParams = transformParamsPreSubmit(entity);
    }

    let result = null;

    try{
      const response = await {{ camelCase name }}(submitParams);
      result = response.data;
    } catch(err){
      await this.setState({submitting: false, errorMessage: translateError(err)})
      return;
    }

    if (resetOnSubmit) {
      this.form && this.form.reset();
      await this.update(
        { ...{{ pascalCase name }}Form.defaultActionValues(), ...immutableFields }
      );
    }
    try{
      await onSubmit(submitParams, result);
    }
    catch(err){
    /* eslint-disable-next-line no-console */
      console.error(err)
    }
    await this.setState({submitting: false})
  }

  async handleChange(modifiedKey, value, modifiedChildEntity = undefined) {
    const { entity } = this.state;
    await this.update(
        { ...entity, [modifiedKey]: value },
        modifiedKey,
        modifiedChildEntity
      );
  }

  setFormToValid() {
    this.setState({ formIsValid: true });
  }

  setFormToInvalid() {
    this.setState({ formIsValid: false });
  }

  createMergedEntity() {
    const { entity, immutableFields } = this.props;
    return domainModel.{{ camelCase  clay_parent.clay_parent.name }}.ensureInvariants( {
      ...{{ pascalCase name }}Form.defaultActionValues(),
      ...entity,
      ...immutableFields
    });
  }

  update(entity, modifiedKey, modifiedChildEntity = undefined) {
    const {mutateEntityOnChange, onChange, immutableFields } = this.props;
    const mutatedEntity = mutateEntityOnChange(entity, modifiedChildEntity);
    const ensuredEntity = domainModel.{{ camelCase  clay_parent.clay_parent.name }}.ensureInvariants({...mutatedEntity, ...immutableFields});
    this.setState({entity: ensuredEntity});
    onChange(entity, modifiedKey, modifiedChildEntity);
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      props: { immutableFields, submitButtonText, color, className, readonly, disabled, sessionUser, modal },
      state: { entity, recurrenceOpen, formIsValid, submitting, errorMessage },
    } = this;
    /* eslint-enable */



    return (
      <Formsy onValid={this.setFormToValid}
            onInvalid={this.setFormToInvalid}
            ref={(c) => { (this.form = c); }}>
          {{#group parameters by="tab"}}
            { /* eslint-disable-next-line */ }
            {{#if value}}
            <Row>
              <ShowWhenContainsOtherThanH5>
              {{#ifCond value '!=' 'Detaljer' }}<h5>{{value}}</h5>{{/ifCond}}
              {{> form-fields fields=items parent=../clay_parent/clay_parent action=..}}
              </ShowWhenContainsOtherThanH5>
            </Row>
            {{/if}}
          {{/group}}
          {errorMessage && <Alert color="danger"  style={ {whiteSpace: "pre-wrap"} }>{errorMessage}</Alert>}
          {!readonly && (
              <Button id="{{name}}SubmitButton"
              onClick={(event)=> { this.handleOnClick(event) } }
              className={`float-end d-print-none ${className}`}
              color={color ||"{{#if color}}{{color}}{{else}}primary{{/if}}"}
              disabled={(!formIsValid || submitting || disabled )}>
                {submitButtonText}
              </Button>
        )}
      </Formsy>
    );
  }
};

const mapStateToProps = (
  { authentication: { sessionUser } },
  { onSubmit, immutableFields, entity },
  ) => ({
  entity,
  sessionUser,
  onSubmit,
  immutableFields,
});

const {{ camelCase name }}Export = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(
{{pascalCase name}}Form,
);

// eslint-disable-next-line import/prefer-default-export
export { {{ camelCase name }}Export as {{pascalCase name}}Form };
