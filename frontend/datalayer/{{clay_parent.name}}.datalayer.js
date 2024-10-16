/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import getAxiosInstance from '../config/api'
import domainModel from 'domain-model'
import qs from 'qs';
 
export default {
    {{#each types}}

    {{camelCase name}}: {
        list: async (query, req, options) => {
            const instance = await getAxiosInstance(req);
            // the catch handle cancel events, the code for cancel is in getAxiosInstance and actions

            const result = await instance.post(`{{pluralize name}}/search`, query, options).catch(()=>null)
            if (!result) return undefined;
            if(domainModel.{{camelCase name}}.getViewModel)
            {
                result.data.rows = result.data.rows.map(row => {

                    return domainModel.{{camelCase name}}.getViewModel(row)
                })
                return result.data;
            }
            return result.data
        },
        get: async (query, req, options) =>{
            const instance = await getAxiosInstance(req);
            const result = await instance.get(`{{pluralize name}}/${query.id}`, options)
            if(domainModel.{{camelCase name}}.getViewModel)
            {
                return domainModel.{{camelCase name}}.getViewModel(result.data)
            }
            return result.data
        },
    },
    {{/each}}
    {{#each projections}}

    {{camelCase name}}: {
        list: async (query, req, options) => {
            const instance = await getAxiosInstance(req);
            // the catch handle cancel events, the code for cancel is in getAxiosInstance and actions
            const result = await instance.post(`{{pluralize name}}/search`, query, options).catch(()=>null)
            
            if (!result) return undefined;
            if(domainModel.{{camelCase name}}.getViewModel)
            {
                result.data.rows = result.data.rows.map(row => {

                    return domainModel.{{camelCase name}}.getViewModel(row)
                })
                return result.data;
            }
            return result.data
        },
        get: async (query, req, options) =>{
            const instance = await getAxiosInstance(req);
            const result = await instance.get(`{{pluralize name}}/${query.id}`, options)
            if(domainModel.{{camelCase name}}.getViewModel)
            {
                return domainModel.{{camelCase name}}.getViewModel(result.data)
            }
            return result.data
        },
    },
    {{/each}}
};