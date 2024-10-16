/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React, { useState, useEffect } from 'react';
/* eslint-disable */
import DatePicker from 'react-datepicker';
import {
  FormGroup,Input,
  Col, Row, Button, Label, Table, TabContent, TabPane, Nav, NavItem, NavLink, Collapse,
  ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import Formsy from 'formsy-react';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import {
  NumberInput, BooleanInput, Select,
  HtmlEditor, HtmlTextAreaEditor, TextInput, TextareaInput, DateTimePicker, ReoccurenceInput,
  SecureFormsy, LabelInput
} from 'flaivy-react/components/inputs'
import {
  DateRangePicker,NumberFilterInput, PipeStringFilter
} from 'components/filters'
import RequiresRole from 'flaivy-react/components/RequiresRole';

import {
{{#eachUnique fields 'relation'}}
{{#if relation}}
{{#if original_relation}}
{{pascalCase original_relation}}Select,
{{else}}
{{pascalCase relation}}Select,
{{/if}}
{{/if}}
{{/eachUnique}}
 } from 'components/Selects'
/* eslint-enable */
{{#each belongs_to}}
import { resolve as {{{camelCase this}}}Resolve } from '../../shared/actions/generated/{{kebabCase this}}.actions';
{{/each}}

import _ from 'lodash';

import PropTypes from 'prop-types';

// eslint-disable-next-line
async function resolveQuery(query) {
  const resolvedQuery = {...query};
  // eslint-disable-next-line
  {{#each belongs_to}}
    if(query.{{{camelCase this}}}) {
      resolvedQuery.{{{camelCase this}}} = await {{{camelCase this}}}Resolve(query.{{camelCase this}})
    }
  {{/each}}
  return resolvedQuery;
}

const defaultActionValues = ()=>({
      {{#each parameters}}
      {{#ifCond @key '==' 'id'}}
        id: _.uuid(),
      {{/ifCond}}
      {{#ifCond @key '!=' 'id'}}
      {{#switch type}}
      {{#case 'boolean' }}
        {{@key}}: false,
      {{/case}}
      {{#case 'date' 'deliveryDate' }}
        {{@key}}: undefined,
      {{/case}}
      {{#case 'relation' }}
        {{camelCase @key}}: {},
      {{/case}}
      {{#case 'user' }}
        {{@key}}: null,
      {{/case}}
      {{#default}}
      {{#if this.default}}
        {{@key}}: {{{this.default}}},
      {{else}}
        {{@key}}: undefined,
      {{/if}}
      {{/default}}
      {{/switch}}
      {{/ifCond}}
      {{/each}}
  })


function {{ pascalCase name }}FilterPanel({querySpecification,
  onChange,
  isSubForm,
  isModal,
  // eslint-disable-next-line
  immutableQuery
}){
  const [state, setState] = useState({
    querySpecification,
  });
  
  useEffect(()=>{
    async function getResolvedQuery(){
      const fullyResolvedFilter = await resolveQuery(querySpecification || []);
      setState({
      querySpecification: {
        ...(querySpecification || defaultActionValues()),
      },
      resolvedQuery: {
        ...(fullyResolvedFilter || defaultActionValues()),
      }
      });
    };
    if(querySpecification){
      getResolvedQuery();
    };
  /* eslint-disable-next-line */
  },[])

  /* eslint-disable-next-line */
  const handleChange = async (key, value) => {
    const { querySpecification, resolvedQuery } = state;
    const newQuerySpecification = { ...querySpecification, [key]: _.get(value, 'id') || value };
    const newResolvedQuery = { ...resolvedQuery, [key]: value };
    setState({ querySpecification: newQuerySpecification, resolvedQuery: newResolvedQuery });
    // eslint-disable-next-line
    await onChange(newQuerySpecification);
  }

  const reset = async () => {
    setState({
      querySpecification: { ...immutableQuery },
      resolvedQuery: {}
    });
    // eslint-disable-next-line
    await onChange({});
  }

  
  /* eslint-disable no-unused-vars */
  const { resolvedQuery } = state;
  /* eslint-enable */

  return (
    <>
    <SecureFormsy isSubForm={isSubForm}>
      { !isModal && (
        <Button onClick={reset} className="my-2" color="secondary" block >
          Rensa filter
        </Button>
      )}


    {{#each displayFields}}
    {{#if roles_for_read}}<RequiresRole requiredRoles={[{{#each roles_for_read}}"{{this}}",{{/each}}]} >{{/if}}


    {{#ifCond @key '!=' 'id'}}
    {{#ifCond type "==" "relation" ~}}

    { typeof immutableQuery.{{camelCase @key}} === 'undefined' && (
                        {{else}}
    { typeof immutableQuery.{{@key}} === 'undefined' && (
      {{/ifCond}}
      <FormGroup>
      {{> filter-input fields=items parent=../.. action=..}}
      </FormGroup>
    )}
    {{/ifCond}}
    {{#if roles_for_read}}</RequiresRole>{{/if}}

    {{/each}}
    {typeof immutableQuery.createdAt === 'undefined' && (
      <FormGroup>
        <Label>Skapad</Label>
        <DateRangePicker
          name="createdAt"
          value={_.get(resolvedQuery, 'createdAt')}
          onChange={handleChange}
        />
      </FormGroup>
    )}
    {typeof immutableQuery.updatedAt === 'undefined' && (
      <FormGroup>
        <Label>Uppdaterad</Label>
        <DateRangePicker
          name="updatedAt"
          value={_.get(resolvedQuery, 'updatedAt')}
          onChange={handleChange}
        />
      </FormGroup>
    )}
    </SecureFormsy>
    { isModal && (
      <Button onClick={reset} className="mt-3">
        Rensa filter
      </Button>
    )}
    </>
  );
}

{{ pascalCase name}}FilterPanel.propTypes = {
  querySpecification: PropTypes.object,
  immutableQuery: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isSubForm: PropTypes.bool,
  isModal: PropTypes.bool
}

{{ pascalCase name }}FilterPanel.defaultProps = {
  querySpecification: defaultActionValues(),
  immutableQuery: {},
  isSubForm: false,
  isModal: false
}

function {{ pascalCase name }}FilterPanelModal({ 
  onSubmit, querySpecification, immutableQuery 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = newQuerySpecification => {
    onSubmit(newQuerySpecification);
  };

  const applyFilters = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal toggle={toggle} isOpen={isOpen} centered scrollable>
        <ModalHeader toggle={toggle}>Filtrera</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <{{ pascalCase name }}FilterPanel
                onChange={handleChange}
                querySpecification={querySpecification}
                immutableQuery={immutableQuery}
                isModal
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Row>
            <Col>
              <Button 
              onClick={applyFilters} 
              color="primary" 
              className="float-end mt-3"
              >
                Stäng
              </Button>
            </Col>
          </Row></ModalFooter>
      </Modal>
      <Button color="outline-secondary" onClick={toggle}>
        Filtrera
      </Button>
    </>
  );
}

{{ pascalCase name }}FilterPanelModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  querySpecification: PropTypes.object,
  immutableQuery: PropTypes.object,
};

{{ pascalCase name }}FilterPanelModal.defaultProps = {
  querySpecification: null,
  immutableQuery: {},
};


module.exports = { {{ pascalCase name }}FilterPanel, {{ pascalCase name }}FilterPanelModal }

