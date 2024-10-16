/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/

import React, { Component } from 'react';
import Async from 'react-select/async';
import domainModel from 'domain-model';
import { components } from 'react-select';
import qs from 'qs';
import axios from 'axios';
import PropTypes from 'prop-types';
import withFormsyValidations from 'flaivy-react/components/withFormsyValidations';
import {propTypes} from 'formsy-react';
import _ from 'lodash';
import getAxiosInstance from 'app/config/api'

const endPoint = '/{{pluralize name}}'

let cancelTokenSource = null;

/* eslint-disable */
const MenuList = props => {
  return (
    <components.MenuList {...props}>
      <table className="table w-100 mt-n1">
        <caption>Lista med sökresultat, {props.options.length === 0 ? 'sökningen gav inget resultat' : 'skriv för att söka efter fler.'}</caption>
        <thead className="table-light">
          <tr>
          {{#each fields}}{{#ifCond @key '!=' 'id'}}{{#ifCond is_available_in_reference '==' true}}{{#ifCond is_available_in_reference_ui '!=' false}}{{#ifCond type '!=' 'relation'}}{{#ifCond type '!=' 'datetime'}}{{#ifCond type '!=' 'S3image'}}{{#ifCond type '!=' 'croppedS3image'}}{{#ifCond type '!=' 'boolean'}}{{#ifCond type '!=' 'regionSpecifics'}}{{#ifCond type '!=' 'userAccessString'}}{{#ifCond type '!=' 'labels'}}
          <th className="text-nowrap text-center w-100 py-1">{{this.localized_name}}</th>
          {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/each}}
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </table>
    </components.MenuList>
  );
};

const Option = props => {
  return (
    <tr
      id={props.innerProps.id}
      ref={props.innerRef}
      className={
        (props.isSelected ? 'table-active' : '') +
        ' ' +
        (props.isFocused ? 'bg-light' : '') +
        ' select-option'
      }
      onClick={() => {
        props.selectOption(props.data);
      }}
    >
      {{#each fields}}{{#ifCond @key '!=' 'id'}}{{#ifCond is_available_in_reference '==' true}}{{#ifCond is_available_in_reference_ui '!=' false}}{{#ifCond type '!=' 'relation'}}{{#ifCond type '!=' 'datetime'}}{{#ifCond type '!=' 'S3image'}}{{#ifCond type '!=' 'croppedS3image'}}{{#ifCond type '!=' 'boolean'}}{{#ifCond type '!=' 'regionSpecifics'}}{{#ifCond type '!=' 'userAccessString'}}{{#ifCond type '!=' 'labels'}}
      <td className="text-nowrap py-1">{ props.data.{{@key}} }</td>
      {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/each}}
    </tr>
  );
};

/* eslint-enable */
class {{pascalCase name}}Select extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      value: PropTypes.object,
      isDisabled: PropTypes.bool,
      onChange: PropTypes.func.isRequired,
      styles: PropTypes.object,
      immutableQuery: PropTypes.object,
      ...propTypes,
    };
  }

  static get defaultProps() {
    return {
      isDisabled: false,
      value: null,
      styles: undefined,
      immutableQuery: {},

    };
  }
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.loadCurrentValueIfOnlyIdIsAvailable = this.loadCurrentValueIfOnlyIdIsAvailable.bind(this);
  }

  async selectHandler(selectedEntity) {
    const {
      onChange, name, setValue,
    } = this.props;
    if(!selectedEntity){
      onChange(name, null)
      setValue(null)
      return
    }
    const requestUrl = `${endPoint}/${selectedEntity.id}`;
    const response = await getAxiosInstance().get(requestUrl);
    const fullEntity = response.data;
    setValue(fullEntity);
    onChange(name, fullEntity);
  }

  loadCurrentValueIfOnlyIdIsAvailable() {
    const keys = Object.keys(this.props.value);
    if(keys.length === 1 && keys[0] === 'id'){
      this.selectHandler(this.props.value);
    }
  };
  
  componentDidMount() {
    if(this.props.value === null){
      return;
    }
    this.loadCurrentValueIfOnlyIdIsAvailable();
  }

  async search(inputValue){
    const { immutableQuery } = this.props;
    const queryStr = qs.stringify({query:{
      {{#if fields.active}}
      active: true,
      {{/if}}

      {{#if fields.cancelled}}
      cancelled: false,
      {{/if}}
      ...domainModel.{{camelCase name}}.createSearchStringQuery(inputValue),
      ...immutableQuery
    }, cacheBuster: new Date().getTime()});
    const requestUrl = `${endPoint}?${queryStr}`;
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }
    cancelTokenSource = axios.CancelToken.source();
    const response = await getAxiosInstance().get(`${requestUrl}`, {
      cancelToken: cancelTokenSource.token,
    });

    cancelTokenSource = null; // we never get here on a cancelled request. See api.js
    return response.data.rows;
  }

  render() {
    const {
      props: {
        name, value, isDisabled, isValid, styles
      }, search,
    } = this;
    return (
      <Async cacheOptions
        instanceId={"select-"+name}
        className={!isValid ? 'border border-danger' : ''}
        components={ { MenuList, Option } }
        name={name}
        value={value}
        isDisabled={isDisabled}
        placeholder="Skriv för att söka ..."
        isClearable
        noOptionsMessage={()=>""}
        loadOptions={search}
        getOptionValue={(option) => (option['id'])}
        getOptionLabel={(option) => [
          {{#each fields}}{{#ifCond @key '!=' 'id'}}{{#ifCond is_available_in_reference '==' true}}{{#ifCond is_available_in_reference_ui '!=' false}}{{#ifCond type '!=' 'relation'}}{{#ifCond type '!=' 'datetime'}}{{#ifCond type '!=' 'S3image'}}{{#ifCond type '!=' 'croppedS3image'}}{{#ifCond type '!=' 'boolean'}}{{#ifCond type '!=' 'regionSpecifics'}}{{#ifCond type '!=' 'userAccessString'}}
          option.{{@key}},
          {{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/ifCond}}{{/each}}].filter(x=>x).join(' - ')}
          onChange={this.selectHandler}
          styles={styles}
      />
    )
  }
}

export default withFormsyValidations({{pascalCase name}}Select, props => ({
  requiredValidation(values, value) {
    if (props.required) {
      return !!value && !_.isEmpty(value);
    }
    return true;
  },
}));

