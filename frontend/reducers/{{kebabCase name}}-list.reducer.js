/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import {
  SUCCESS, SOCKET
} from 'flaivy-react/reducers/action-type';
import _ from 'lodash';
import { replaceInlistIfExists } from 'flaivy-react/utils/array-helper';
import { ACTION_TYPES } from '../../actions/generated/{{kebabCase name}}.actions'

const initialState = {
  errorMessage: null,
  entities: [],
  hasMore: true,
  currentPage: 0,
  total: 0,
  query: {},
  loading: false,
  sort: '{{defaultSort}}',
  search: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_{{toUpper (snakeCase name)}}_LIST: {
        return {
          ...state,
          ...action.payload,
        };
    }


    case SOCKET('{{toUpper (snakeCase name)}}_CREATED'): {
      const entity = action.payload.fullEntity;
      // eslint-disable-next-line  no-underscore-dangle
      entity._recentCreate = true;
      const merged = _.merge(_.keyBy([entity], 'id'), _.keyBy(state.entities, 'id'));
      const entities = _.values(merged);
      return {
        ...state,
        // needs to be replace in list as events might trigger twice due to generated code below
        entities,
        total: state.total + 1,
      };
    }
    {{#each events}}
    case SOCKET('{{@key}}'):
    {{/each}}
    {
      const entity = action.payload.fullEntity;
      const entities = replaceInlistIfExists([entity], state.entities);
      return {
        ...state,
        entities,
      };
    }
    default:
      return state;
  }
};

export default reducer;
