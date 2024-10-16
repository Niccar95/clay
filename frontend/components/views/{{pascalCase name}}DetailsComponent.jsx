/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React from 'react';
import { connect } from 'react-redux';
import PropTypes, { useState } from 'prop-types';
import { marked } from 'marked';
import moment from 'moment';
import Image from 'flaivy-react/components/Image';
import { RegionSpecifics } from 'flaivy-react/components/detail-fields';
import JSONViewer from 'flaivy-react/components/JSONViewer';
import {
  Col, Row, Button, Label, Table, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroller';
import Money from 'flaivy-react/components/Money';
import LabelBadges from 'flaivy-react/components/LabelBadges';
import classnames from 'classnames';
import domainModel from 'domain-model';
import RequiresRole from 'flaivy-react/components/RequiresRole';
import flaivyReact from 'flaivy-react';

import { getTranslation, getEntityName } from 'domain-model'
import _ from 'lodash';

import Link from 'next/link';

{{#each children}}
{{#if linkedActions}}
{{#each linkedActions}}
import {
  {{pascalCase @key}}ModalForm,
} from 'components/action-forms/{{kebabCase ../../name}}/{{pascalCase @key}}ModalForm';
{{/each}}
{{/if}}
{{/each}}

/* eslint-enable */


import { get } from '../../shared/actions/generated/{{kebabCase name}}.actions';

{{#group displayFields by="tab"}}
{{#if value}}
export class {{pascalCase value}}DetailsComponent extends React.Component {
  static get propTypes() {
    return {
      entity: PropTypes.object.isRequired,
    };
  }
  constructor(props) {
    super(props);
    {{#each items}}
    {{#ifCond type '==' 'array'}}
    this.loadMore{{@key}} = this.loadMore{{@key}}.bind(this);
    {{/ifCond}}
    {{/each}}
    this.state = {
      {{#each items}}
    {{#ifCond type '==' 'array'}}
      {{@key}}InfiniteScroll: {
        numberOfRowsCurrentlyShowing: 20,
        totalNumberOfRows: this.props.entity.{{camelCase @key}}?.length || 0, 
        hasMore: this.props.entity.{{camelCase @key}}?.length > 20
      },
      {{/ifCond}}
    {{/each}}
    }
  }

  {{#each items}}
  {{#ifCond type '==' 'array'}}
  loadMore{{@key}} = () => {
    const { entity } = this.props
    const { {{@key}}InfiniteScroll } = this.state
    const numberOfRowsToShow = {{@key}}InfiniteScroll.numberOfRowsCurrentlyShowing + 20;
    const totalNumberOfRows = entity.{{camelCase @key}}.length || 0;
    this.setState({
      {{@key}}InfiniteScroll: {
        numberOfRowsCurrentlyShowing: numberOfRowsToShow,
        totalNumberOfRows, 
        hasMore: totalNumberOfRows > numberOfRowsToShow
      }
    });
  };
  {{/ifCond}}
  {{/each}}
  

  render() {
    // eslint-disable-next-line
    const { entity, sessionUser } = this.props; 
    // eslint-disable-next-line
    const aggregateId = entity.id;

    return (<>
      {{#each items}}
      {{#ifCond type '!=' 'S3image'}}
      {{#ifCond type '!=' 'croppedS3image'}}
      {{#ifCond type '!=' 'imageArray'}}
      {{#ifCond type '!=' 'stringArray'}}
      {{#ifCond type '!=' 'array'}}
      {{#ifCond type '!=' 'userAccessString'}}

    {{#if roles_for_read}}<RequiresRole requiredRoles={[{{#each roles_for_read}}"{{this}}",{{/each}}]} >{{/if}}
    {{#ifCond type "==" "relation" ~}}
    { (entity.{{camelCase @key}} !== undefined && entity.{{camelCase @key}} !== null && entity.{{camelCase @key}} !== '')  &&
    {{else}}    
    { (entity.{{@key}} !== undefined && entity.{{@key}} !== null && entity.{{@key}} !== '' {{#if display_if }} && {{{display_if}}}  {{/if}})  &&
    {{/ifCond}}
      
      <div className="text-muted mt-1">
        <strong>{{localized_name}}:{' '}</strong>
        {{> detail-fields parent=../../name}}
      </div>
      }
      {{/ifCond}}
      {{/ifCond}}
      {{/ifCond}}
      {{/ifCond}}
      {{/ifCond}}
      {{/ifCond}}
    {{#if roles_for_read}}</RequiresRole>{{/if}}

    {{#ifCond type '==' 'array'}}
    {{#if roles_for_read}}<RequiresRole requiredRoles={[{{#each roles_for_read}}"{{this}}",{{/each}}]} >{{/if}}
    <div className="mt-3" >
      <h4>{{localized_name}}</h4>
     {/* eslint-disable-next-line */}
      {{#if explanation}}<p>{{explanation}}</p>{{/if}}
      {entity.{{camelCase @key}}Changes && (<>
        {entity.{{camelCase @key}}Changes.rowsToUpdate && entity.{{camelCase @key}}Changes.rowsToUpdate.length !== 0 && (<>
        <h5>Ändrade rader</h5>
        <Table responsive hover className="table-bordered table-striped">
                <thead className="thead-light">
                  <tr>     
                  {{#unless doNotGenerateRowNumbers }}                        
                  <th>Rad</th>
                  {{/unless}}
                  {{#each fields}}
                  {{#ifCond  @key '!=' 'id' ~}}
                  {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                    <th>
                      {{localized_name}}
                    </th>
                  {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                  {{/each}}
                  {{#if linkedActions}}
                  {{/if}}
                  </tr>

                </thead>
                <tbody>
                {/* eslint-disable-next-line no-shadow */}
                  { entity.{{camelCase @key}}Changes.rowsToUpdate.map((entity,i)=>{
                     if (i > this.state.{{@key}}InfiniteScroll.numberOfRowsCurrentlyShowing)
                     return <></>;
                    return (
                    <tr key={entity.id || i}>
                    {{#ifCond doNotGenerateRowNumbers '==' true}}
                    {{else}}              
                    <td>{entity.rowNumber}</td>
                    {{/ifCond}}
                      {{#each fields}}
                      {{#ifCond  @key '!=' 'id' ~}}
                      {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                      <td>
              {{> detail-fields parent=../name }}
              </td>
              {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                      {{/each}}
                    </tr>
                    )
                    }
                  )
                  }
                </tbody>
              </Table>
              </>)}
              {entity.{{camelCase @key}}Changes.rowsToInsert && entity.{{camelCase @key}}Changes.rowsToInsert.length !== 0 && (<>

              <h5>Skapade rader</h5>
              <Table responsive hover className="table-bordered table-striped">
                      <thead className="thead-light">
                        <tr>
                        {{#unless doNotGenerateRowNumbers }}                        
                        <th>Rad</th>
                        {{/unless}}
                        {{#each fields}}
                        {{#ifCond  @key '!=' 'id' ~}}
                        {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                          <th>
                            {{localized_name}}
                          </th>
                        {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                        {{/each}}
                        {{#if linkedActions}}
                        {{/if}}
                        </tr>
      
                      </thead>
                      <tbody>
                      {/* eslint-disable-next-line no-shadow */}
                        { entity.{{camelCase @key}}Changes.rowsToInsert.map((entity,i)=>{
                           if (i > this.state.{{@key}}InfiniteScroll.numberOfRowsCurrentlyShowing)
                           return <></>;
                          return (
                          <tr key={entity.id || i}>
                          {{#ifCond doNotGenerateRowNumbers '==' true}}
                          {{else}}              
                          <td>{entity.rowNumber}</td>
                          {{/ifCond}}
                                  {{#each fields}}
                            {{#ifCond  @key '!=' 'id' ~}}
                            {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                            <td>
                    {{> detail-fields parent=../name }}
                    </td>
                    {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                            {{/each}}
                          </tr>
                          )
                          }
                        )
                        }
                      </tbody>
                    </Table>

                    </>)}
                    {entity.{{camelCase @key}}Changes.rowsToDelete && entity.{{camelCase @key}}Changes.rowsToDelete.length !== 0 && (<>
              <h5>Borttagna rader</h5>
              <Table responsive hover className="table-bordered table-striped">
                      <thead className="thead-light">
                        <tr>
                        {{#unless doNotGenerateRowNumbers }}                        
                        <th>Rad</th>
                        {{/unless}}
                        {{#each fields}}
                        {{#ifCond  @key '!=' 'id' ~}}
                        {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                          <th>
                            {{localized_name}}
                          </th>
                        {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                        {{/each}}
                        {{#if linkedActions}}
                        {{/if}}
                        </tr>
      
                      </thead>
                      <tbody>
                      {/* eslint-disable-next-line no-shadow */}
                        { entity.{{camelCase @key}}Changes.rowsToDelete.map((entity,i)=>{
                           if (i > this.state.{{@key}}InfiniteScroll.numberOfRowsCurrentlyShowing)
                           return <></>;
                          return (
                          <tr key={entity.id || i}>
                          {{#ifCond doNotGenerateRowNumbers '==' true}}
                          {{else}}              
                          <td>{entity.rowNumber}</td>
                          {{/ifCond}}
                                  {{#each fields}}
                            {{#ifCond  @key '!=' 'id' ~}}
                            {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                            <td>
                    {{> detail-fields parent=../name }}
                    </td>
                    {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                            {{/each}}
                          </tr>
                          )
                          }
                        )
                        }
                      </tbody>
                    </Table>
                    </>)}
              </>)}
        {entity.{{camelCase @key}} && (
          <Row>
            <Col md="12">
            <InfiniteScroll
                pageStart={0}
                loadMore={() => this.loadMore{{@key}}()}
                hasMore={this.state.{{@key}}InfiniteScroll.hasMore}
              >
              <Table responsive hover className="table-bordered table-striped">
                <thead className="thead-light">
                  <tr>
                  {{#each fields}}
                  {{#ifCond  @key '!=' 'id' ~}}
                  {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
                  {{#if use_if }} { {{{use_if}}} && ({{/if}}
                    <th>
                      {{localized_name}}
                    </th>
                    {{#if use_if }} )} {{/if}}
                  {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                  {{/each}}
                  {{#if linkedActions}}
                  <th>{' '}</th>
                  {{/if}}
                  </tr>

                </thead>
                <tbody>
                {/* eslint-disable-next-line no-shadow */}
                  { entity.{{@key}}.map((entity,i)=>{
                     if (i > this.state.{{@key}}InfiniteScroll.numberOfRowsCurrentlyShowing)
                     return <></>;
                    return (
                    <tr key={entity.id || i}>
                      {{#each fields}}
                      {{#ifCond  @key '!=' 'id' ~}}
                      {{#ifCond is_available_in_reference '==' true~}}{{#ifCond is_available_in_reference_ui '!=' false~}}
              {{#if use_if }} { {{{use_if}}} && ({{/if}}
                      <td>
              {{> detail-fields parent=../name }}
              </td>
              {{#if use_if }} )} {{/if}}
              {{/ifCond~}}{{/ifCond~}}{{/ifCond~}}
                      {{/each}}
                      {{#if linkedActions}}
                      <td>
                      {{#each linkedActions}}
                        <span className="me-2">
                          <{{pascalCase @key}}ModalForm immutableFields={ {childId: entity.id, id:aggregateId} } icon="{{icon}}" entity={ entity }/>
                        </span>
                      {{/each}}
                      </td>
                      {{/if}}
                    </tr>
                    )
                    }
                  )
                  }
                </tbody>
              </Table>
                  </InfiniteScroll>
            </Col>
          </Row>
      )}
    </div>
    {{#if roles_for_read}}</RequiresRole>{{/if}}
    {{/ifCond}}
    {{/each}}
    </>
    )
  }
}
{{/if}}
{{/group}}


class DetailsComponent extends React.Component {
  static get propTypes() {
    return {
      entity: PropTypes.object.isRequired,
    };
  }
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'Detaljer',
    };
  }

  toggle(tab) {
    const {activeTab} = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { entity, sessionUser } = this.props;
    const { activeTab } = this.state;

    return (
      <>
        <Nav tabs className="nav-bordered mb-2">
          {{#group displayFields by="tab"}}
          {{#if value}}
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '{{value}}' })}
                onClick={() => { this.toggle('{{value}}'); }}
              >
                {{value}}
              </NavLink>
            </NavItem>
          {{/if}}
          {{/group}}
        </Nav>

        <TabContent activeTab={activeTab}>
          {{#group displayFields by="tab"}}
          {{#if value}}
          <TabPane tabId='{{value}}'>
            <div className="text-start">
            <{{pascalCase value}}DetailsComponent entity={entity} sessionUser={sessionUser}/>
            </div>
          </TabPane>
          {{/if}}
          {{/group}}
        </TabContent>
      </>
    )
  }
}

const mapStateToProps = (
  { authentication: { sessionUser } },
  {  entity },
  ) => ({
  entity,
  sessionUser,
});

const mapDispatchToProps = { get };
export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent)
