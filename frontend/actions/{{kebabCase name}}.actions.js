/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import {
  REQUEST, SUCCESS, FAILURE, SOCKET
} from 'flaivy-react/reducers/action-type';
import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import { arrayMerge } from 'flaivy-react/utils/array-helper';
import getAxiosInstance from '../../../config/api';
import datalayer from '../../../datalayer';

export const ACTION_TYPES = {
  {{#each actions}}
  {{toUpper (snakeCase @key)}}_{{toUpper (snakeCase ../name)}}:  '{{toUpper (snakeCase ../name)}}/{{toUpper (snakeCase @key)}}_{{toUpper (snakeCase ../name)}}',
  {{/each}}
  FETCH_{{toUpper (snakeCase name)}}: '{{toUpper (snakeCase name)}}/FETCH_{{toUpper (snakeCase name)}}',
  'SET_{{toUpper (snakeCase name)}}_LIST': 'SET_{{toUpper (snakeCase name)}}_LIST',
};

let cancelTokenSource = null;

export async function fetchMoreAndReturnNewState(newQuery, state, req) {
  const { entities,  currentPage, hasMore, sort } = state;

  if (cancelTokenSource) {
    cancelTokenSource.cancel();
  }

  const page = currentPage + 1;

  if (!hasMore && page !== 1) return state;
  
  cancelTokenSource = axios.CancelToken.source();
  const query = { query: newQuery, page, sort, searchString: state.search };
  const options = { cancelToken: cancelTokenSource.token };
  const responseData = await datalayer.{{camelCase name}}.list(query, req, options);
  if(responseData === undefined){
    //canceled request
    return undefined;
  }
  

  cancelTokenSource = null;
  const recievedEntities = responseData.rows;
  const newHasMore = responseData.page < responseData.totalPages;
  let newEntities = [];
  if (responseData.page === 1) {
    newEntities = recievedEntities;
  } else {
    newEntities = arrayMerge(recievedEntities, entities);
  }
  return {
    query: newQuery,
    hasMore: newHasMore,
    total: responseData.total,
    entities: newEntities,
    currentPage: responseData.page,
    search: state.search,
    sort: _.get(newQuery, 'sort', sort),
  };
}

export const refreshListOnQueryDiff =
  (newListState, req) => async (dispatch, getState) => {
    let payload = newListState;
    const currentState = _.get(getState(), '{{camelCase name}}List');
    const currentQuery = currentState.query;
    if (!_.isEqual(newListState.query, currentQuery)) {
      payload = await fetchMoreAndReturnNewState(
        newListState.query,
        { ...currentState,
          ...newListState,
          currentPage: 0 },
        req,
      );
    }
    if(!payload) {return} // cancelled loading, dont update the store
    await dispatch({
      type: ACTION_TYPES.SET_{{toUpper (snakeCase name)}}_LIST,
      payload,
    });
  };


export const setSortOrder = sort => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_{{toUpper (snakeCase name)}}_LIST,
    payload: { sort },
  });
};

export const setListStore = newListState => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_{{toUpper (snakeCase name)}}_LIST,
    payload: newListState,
  });
};

export const resolve = async (id, req) => {
  return await datalayer.{{camelCase name}}.get({id}, req)
}

export const get = (req, id) => (dispatch) => {
  return dispatch({
    type: ACTION_TYPES.FETCH_{{toUpper (snakeCase name)}},
    payload: datalayer.{{camelCase name}}.get({id}, req)
  });
};

{{#each actions}}

export const {{ camelCase @key }} = (actionParams) =>
    {{~#unless alternateEndpoint}}
     getAxiosInstance().post('actions', { payload: actionParams, action: 'v1.{{../name}}.{{@key}}' });
    {{~else}}
     getAxiosInstance().post('{{alternateEndpoint}}', { ...actionParams });
    {{/unless}}

{{/each}}
