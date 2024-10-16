/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React from 'react';
/* eslint-disable */
import _ from 'lodash';
_.mixin(require('lodash-uuid'))
import moment from 'moment';
import {
  FormGroup,Input,
  Col, Row, Button, Label, Table, TabContent, TabPane, Nav, NavItem, NavLink, Collapse
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import {
  NumberInput, BooleanInput, Select, HtmlEditor, HtmlTextAreaEditor, TextInput, TextareaInput,
  DateTimePicker,DatePicker, EmailInput, DeliveryDatePicker,
  ConfirmInput, ShowWhenContainsOtherThanH5, OpeningHoursInput, RegionSpecificsInput,
  PipeString, FileCropper, FileUploader, ArticleQuantityInput, JsonInput, CurrencyInput
} from 'components/inputs'

import { PageLayoutEditorModal, MappingEditorModal } from 'components/editors';


import {
  {{#each props}}
  {{#ifCond type '==' 'relation'}}
  {{#if original_relation}}
  {{pascalCase original_relation}}Select,
  {{else}}
  {{pascalCase relation}}Select,
  {{/if}}
  {{/ifCond}}
  {{#ifCond type '==' 'reference'}}
  {{pascalCase referenceType}}Select,
  {{/ifCond}}
  {{/each}}
} from 'components/Selects'


/* eslint-enable */
import PropTypes from 'prop-types';

const styles = {
  tableHeader: { cursor: "pointer" }
}

class TableRow extends React.PureComponent {
  static get propTypes() {
    return {
      editMode: PropTypes.string,
      parentEntity: PropTypes.object.isRequired,
      entity: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      onRowDelete: PropTypes.func.isRequired,
      readonly: PropTypes.bool,
    };
  }
  static get defaultProps() {
    return {
      editMode: "standard",
      readonly:false
    };
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, value) {
    const { onChange, entity } = this.props;
    entity[key] = value;
    onChange(entity.id, entity);
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { entity, onRowDelete, editMode, readonly, sessionUser } = this.props;
    const { parentEntity } = this.props;
    /* eslint-enable */

    return (
    <tr id={entity.id} >
      {{#each props }}
      
      {{#ifCond @key '!=' 'id'}}
      {{#ifCond display_if '!=' 'false'}}

      {{#if use_if }} { {{{use_if}}} && ({{/if}}
        <td>
          {{#if display_if }} { {{{display_if}}} && ({{/if}}
          {{> form-input parent=../clay_parent.clay_parent.clay_parent.clay_parent action=../clay_parent.clay_parent.clay_parent}}
          {{#if display_if }} )} {{/if}}
        </td>
        {{#if use_if }} )} {{/if}}
      {{/ifCond}}
      {{/ifCond}}
      {{/each}}


      {editMode !== "no-add-no-delete" &&
      (<td>
        <Button
            color="secondary"
            className="float-end m-0"
            onClick={() => onRowDelete(entity)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </td>)
      }
    </tr>
    )
  }
}

export default class ListComponent extends React.Component {
  static get propTypes() {
    return {
      editMode: PropTypes.string,
      parentEntity: PropTypes.object.isRequired,
      entities: PropTypes.array.isRequired,
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired
    };
  }

  static get defaultProps() {
    return {
      editMode: "standard",
    };
  }

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.addRow = this.addRow.bind(this);
    this.handleRowDelete = this.handleRowDelete.bind(this);
    this.endRef = React.createRef();
  }

  handleChange(id, entity) {

    const { onChange, entities, name } = this.props;
    const existingIndex = _.findIndex(entities,x => x.id === id)
    if(existingIndex === -1) {
      entities.push(entity);
    } else {
      entities[existingIndex] = {...entity};
    }
    onChange(name, entities, entity);
  }

  handleRowDelete(entity) {
    const { onChange, entities, name } = this.props;
    onChange(name, entities.filter(x => x.id !== entity.id), entity)
  }

  async addRow() {
    const id = _.uuid();
    await this.handleChange(id, {id, _recentCreate: true });
    this.endRef.current.scrollIntoView(false);
  }

  render() {
    const { entities, parentEntity, editMode, sessionUser } = this.props;
    return (
      <>      {editMode !== "no-add-no-delete" && entities.length > 3 &&
      <div>
        <Button onClick={this.addRow}>Lägg till {{add_button_text}}</Button>
      </div>
      }
      {entities.length > 0 &&
      <Table className="table-striped table-bordered" hover>
        <thead className="thead-light">
          <tr>
            {{#each props}}
            {{#ifCond @key '!=' 'id'}}
            {{#ifCond display_if '!=' 'false'}}
            {{#if use_if }} { {{{use_if}}} && ({{/if}}
              <th style={styles.tableHeader} >
                {{localized_name}}
              </th>
            {{#if use_if }} )} {{/if}}
            {{/ifCond}}
            {{/ifCond}}
            {{/each}}
            {editMode !== "no-add-no-delete" && <th>{" "}</th>}
          </tr>
        </thead>
        <tbody>
         {
          entities.map((entity) => (
            <TableRow key={entity.id}
                      editMode={editMode}
                      parentEntity={parentEntity}
                      entity={entity}
                      onChange={this.handleChange}
                      onRowDelete={this.handleRowDelete}
                      sessionUser={sessionUser}/>
          ))
         }
        </tbody>
      </Table>
      
      }
      {editMode !== "no-add-no-delete" &&
      <div><div ref={this.endRef}/>
        <Button onClick={this.addRow}>Lägg till {{add_button_text}}</Button>
      </div>
      }
      </>
    );
  }
}
