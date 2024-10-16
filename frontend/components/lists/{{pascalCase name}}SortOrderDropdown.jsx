/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SortDirection from 'flaivy-react/components/SortDirection';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';

// eslint-disable-next-line no-unused-vars
const isQueried = (query, field) => query && query[field] && (typeof query[field] !== 'object')

// eslint-disable-next-line no-unused-vars
function SortDropdown({sort, onSelect, sortProperties, query}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const shouldSort = (property) => {
    if (sortProperties === null) return true;
    return _.includes(sortProperties, property);
  }

  return (
    <ButtonDropdown isOpen={isDropdownOpen} toggle={() => setIsDropdownOpen(!isDropdownOpen)}>
      <DropdownToggle outline caret>
        Sortera
      </DropdownToggle>
      <DropdownMenu>
      {{#each fields}}
      {{#ifCond type '!=' 'userAccessString'}}{{#ifCond is_available_in_reference '==' true}}{{#ifCond is_available_in_reference_ui '!=' false}}
      {!isQueried(query, '{{@key}}') && shouldSort('{{@key}}') &&
      <DropdownItem
        active={_.includes(sort, '{{@key}}')}
        {{#ifCond type '==' 'number'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'date'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'integer'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'datetime'}} onClick={()=>onSelect('-{{@key}}')}{{else}}
        onClick={()=>onSelect('{{@key}}')}{{/ifCond}}>
        {{localized_name}}
        <SortDirection
          myColumn='{{@key}}'
          activeColumn={sort}
        />
      </DropdownItem>

      }
      {{/ifCond}}{{/ifCond}}{{/ifCond}}
      {{/each}}

      {{#each calculatedFields}}
      {{#ifCond is_available_in_reference '==' true}}{{#ifCond is_available_in_reference_ui '!=' false}}

      <DropdownItem active={_.includes(sort, '{{@key}}')}

        {{#ifCond type '==' 'number'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'date'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'integer'}} onClick={()=>onSelect('-{{@key}}')}
        {{else ifCond type '==' 'datetime'}} onClick={()=>onSelect('-{{@key}}')}{{else}}
        onClick={()=>onSelect('{{@key}}')}{{/ifCond}}>
        {{localized_name}}
        <SortDirection
          myColumn='{{@key}}'
          activeColumn={sort}
        />
      </DropdownItem>
      {{/ifCond}}{{/ifCond}}
      {{/each}}

      <DropdownItem active={_.includes(sort, 'createdAt')}
        onClick={()=>onSelect('-createdAt')}>
        Skapad
        <SortDirection
          myColumn='createdAt'
          activeColumn={sort}
        />
      </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}
SortDropdown.propTypes = {
  sort: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  sortProperties: PropTypes.array,
  query: PropTypes.object.isRequired,
}

SortDropdown.defaultProps = {
  sortProperties: null
}


export default SortDropdown;
