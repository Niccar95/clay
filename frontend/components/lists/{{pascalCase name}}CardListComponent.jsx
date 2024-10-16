/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { {{pascalCase name}}FilterPanel, {{pascalCase name}}FilterPanelModal } from 'components/filterPanels';
import  { {{pascalCase name}}SortOrderDropdown } from 'components/SortOrderDropdowns';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import UseWindowSize from 'flaivy-react/hooks/UseWindowSize';

import {
  faSearch,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Button,
  Input,
  InputGroup
} from 'reactstrap';
import { {{camelCase name}} as {{camelCase name}}Domain } from 'domain-model';
import { fetchMoreAndReturnNewState } from '../../shared/actions/generated/{{kebabCase name}}.actions';

import { ListToExcel, EXCELEXPORTLIMIT } from 'components/ExcelCreationButtons';
import EntityCard from '../{{kebabCase name}}/{{pascalCase name}}Card';


_.mixin(require('lodash-uuid'))

const {createSearchStringQuery} = {{camelCase name}}Domain;


// This needs to be singleton, ie. it cant be created in the render function.
const debounceInstance = _.debounce(
  (v, action) => {
    action(v);
  },
  250,
  { maxWait: 1000, leading: false, trailing: true },
);

function SearchInput({ handleSearchChange, search, style, className }) {
  const [value, setValue] = useState(search);
  const handleChange = event => {
    setValue(event.target.value);
    debounceInstance(event.target.value, handleSearchChange);
  }

  return (
    <Formsy className={className} style={style}>
      <InputGroup>
        <span className="input-group-text">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <Input
          className="form-control"
          name="searchfield"
          type="text"
          onKeyPress={(e) => e.key === 'Enter' && handleChange(e)}
          onChange={handleChange}
          value={value}
          placeholder="Search..."
        />
      </InputGroup>
    </Formsy>
  );
}

SearchInput.propTypes = {
  search: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  handleSearchChange: PropTypes.func.isRequired,
}

SearchInput.defaultProps = {
  search: '',
  style: {},
  className: ''
}

function {{pascalCase name}}CardListComponent ({
  sortProperties,
  listStore,
  immutableQuery,
  defaultSort,
  storeUpdate,
  onQueryUpdate,
  hideFilterPanel,
  hasFiltersOpenByDefault,
  noResultComponent,firstPageComponent,
  CardOverride,
  getScrollParent,
  showExcel,
  onCardClick
}) {
  const [state, setState] = useState({
    currentPage: 0,
    hasMore: true,
    loading: false,
    entities: [],
    total: 0,
    sort: defaultSort || '{{defaultSort}}',
    search: '',
    query: immutableQuery || {},
  });
  const [filtersOpen, setFiltersOpen] = useState(hasFiltersOpenByDefault)
  const [loading, setLoading] = useState(false);

  const updateStore = (newState) => {
    if(!newState) return; // request was cancelled
    if (listStore) {
      storeUpdate(newState);
    } else {
      setState(newState);
    }
  };

  const store = listStore || state;

  const fetchMoreData = async () => {
    const newState = await fetchMoreAndReturnNewState(
      store.query,
      store,
    );
    if(!newState) return; // request cancelleds
    updateStore(newState);
  };

  useEffect(()=>{
    if(firstPageComponent){
      return;
    }
    if (listStore && !storeUpdate) {
      throw new Error(
        'You need to provide a way to update the store if you use an externalStore',
      );
    }
    async function getData(){
      await fetchMoreData();
    }
    if (!listStore ) {
      getData();
    }
  /* eslint-disable-next-line */
  },[]);

  const handleSortChange = async value => {
    const toggleSortOrder = value => {
      if (_.startsWith(value, '-')) {
        return value.slice(1);
      }
      return `-${value}`;
    };

    const { sort, query } = store;
    setLoading(true);
    const newState = await fetchMoreAndReturnNewState(query, {
      ...store,
      sort: sort === value ? toggleSortOrder(value) : value,
      currentPage: 0,
    });

    if (!newState) return; // request cancelled
    updateStore(newState);
    setLoading(false);
  };

  const handleSearchChange = async (value = '') => {
    // eslint-disable-next-line no-unused-vars
    const { sort } = store;

    const newQuery = {
      ...store.query,
      ...createSearchStringQuery(value),
      ...immutableQuery,
    };
    if(_.isArray(newQuery.or) && _.isEmpty(newQuery.or)) {
      delete newQuery.or;
    }
    setLoading(true);
    const newState = await fetchMoreAndReturnNewState(newQuery, {
      ...store,
      search: value,
      sort: value ? 'similarity.{{defaultSimilaritySortField}}' : '{{defaultSort}}',
      currentPage: 0,
    });
    if(!newState) return; // request cancelled

    updateStore(newState);

    if (onQueryUpdate || onQueryUpdate === "") {
      onQueryUpdate(newState.query, newState.search);
    }
    setLoading(false);
  };

  const handleFiltersChanged = async (filterPanelQuery) => {
    const { search } = store;
    const newQuery = {
      ...filterPanelQuery,
    };

    if (search) {
      _.merge(newQuery, createSearchStringQuery(search));
    }
    _.merge(newQuery, immutableQuery);

    setLoading(true);
    const newState = await fetchMoreAndReturnNewState(newQuery, {
      ...store,
      currentPage: 0,
    });

    if(!newState) return; // request cancelled
    updateStore(newState);

    if (onQueryUpdate) {
      onQueryUpdate(newState.query, newState.search);
    }
    setLoading(false);
  };

  const toggleFilter = () => {
    setFiltersOpen(!filtersOpen);
  };

  const { entities, hasMore, currentPage, total, sort, search, query } = store;
  
  const showFirstIfNoSearchText = search === "" && firstPageComponent;
  const isLargeScreen = UseWindowSize().width > 992;
  return (
    <>
      <div className="clearfix">
        <SearchInput className="float-start" style={ {maxWidth: "400px", minWidth: "300px"} }
          handleSearchChange={handleSearchChange}
          search={search}
        />
        <div className="d-inline-block">
        {!hideFilterPanel && (
            <>
              {isLargeScreen ? (
                <Button outline onClick={toggleFilter}>
                  Filtrera
                </Button>
              ) : (
              <{{pascalCase name}}FilterPanelModal
                  querySpecification={query}
                  onSubmit={handleFiltersChanged}
                  immutableQuery={immutableQuery}
                />
              )}
            </>
          )}
        {(sortProperties === null || sortProperties.length !== 0) &&
        <{{pascalCase name}}SortOrderDropdown
          sortProperties={sortProperties}
          query={query}
          sort={sort}
          onSelect={(s) => handleSortChange(s) } />
        }
        </div>
        {total > 0  && (
        <div className="d-block float-end">

          <span className="mx-2">{total} träffar</span>
          {showExcel && total <= EXCELEXPORTLIMIT &&
          <ListToExcel
            entityName="{{name}}"
            url="{{pluralize name}}"
            querySpecification={query}
          />
          }{showExcel && total > EXCELEXPORTLIMIT &&
            <Button color="light">För många träffar för Excel</Button>
            }
        </div>)}
      </div>
      
      
      {loading && <Row><Col xs={12} className="text-center pt-5">
          <FontAwesomeIcon size="7x" spin icon={faSync} color="#ccc" /></Col></Row>}
      {showFirstIfNoSearchText && firstPageComponent}
      {!showFirstIfNoSearchText && (<Row className={loading ? 'invisible' : 'visible'}>
      {filtersOpen && isLargeScreen && (
          <Col md={3}>
            <{{pascalCase name}}FilterPanel
              querySpecification={query}
              onChange={handleFiltersChanged}
              immutableQuery={immutableQuery}
            />
          </Col>
        )}
        <Col md={filtersOpen && isLargeScreen ? 9 : 12}>
          <InfiniteScroll
            pageStart={currentPage}
            loadMore={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="loader" key={0}>Laddar ...</div>}
            getScrollParent={getScrollParent}
            useWindow={!getScrollParent}
          >
            <Row>
              {entities.map(
                (entity) => (
                  <React.Fragment key = {entity.id}>
                  {CardOverride && (
                    <CardOverride
                      entity={entity}
                      query={query}
                    />
                  )}
                  {!CardOverride && (
                    <EntityCard entity={entity} query={query} onCardClick={onCardClick} />
                  )}
                </React.Fragment>
                  )
                )}
            </Row>
          </InfiniteScroll>
       
          {!hasMore &&_.isEmpty(entities) && (
              <>
                {noResultComponent}
                {!noResultComponent && (
                  <Row className="mt-5">
                    <Col className="text-center">
                      <h2 className="text-muted">Sökningen gav inga träffar</h2>
                    </Col>
                  </Row>
                )
                }
              </>
            )}
        </Col>
      </Row> )}
    </>
  );
}


{{ pascalCase name }}CardListComponent.propTypes = {
  sortProperties: PropTypes.array,
  listStore: PropTypes.object,
  immutableQuery: PropTypes.object,
  defaultSort: PropTypes.string,
  storeUpdate: PropTypes.func,
  onQueryUpdate: PropTypes.func,
  noResultComponent: PropTypes.element,
  firstPageComponent: PropTypes.element,
  hideFilterPanel: PropTypes.bool,
  hasFiltersOpenByDefault: PropTypes.bool,
  CardOverride: PropTypes.func,
  getScrollParent: PropTypes.func,
  showExcel: PropTypes.bool,
  onCardClick: PropTypes.func,
}

{{ pascalCase name }}CardListComponent.defaultProps = {
  sortProperties: null,
  listStore: null,
  immutableQuery: {},
  defaultStore: null,
  storeUpdate: null,
  onQueryUpdate: null,
  hideFilterPanel: false,
  hasFiltersOpenByDefault: false,
  noResultComponent: null,  firstPageComponent: null,
  CardOverride: null,
  getScrollParent: undefined,
  showExcel: true,
  onCardClick: undefined,
};

export default {{pascalCase name}}CardListComponent;
