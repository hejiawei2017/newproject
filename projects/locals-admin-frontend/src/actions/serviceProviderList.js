import { createAction } from 'redux-actions'


export const getServiceProviderListSuccess = createAction('GET_SERVICE_PROVIDER_LIST_SUCCESS')

export const getProviderItemSuccess = createAction('GET_PROVIDER_ITEM_SUCCESS')

export const addProvider = createAction('ADD_PROVIDER_ING')
export const addProviderSuccess = createAction('ADD_PROVIDER_SUCCESS')

export const updateProvider = createAction('UPDATE_PROVIDER_ING')
export const updateProviderSuccess = createAction('UPDATE_PROVIDER_SUCCESS')

export const getLinkProviderSuccess = createAction('GET_LINK_PROVIDER_SUCCESS')
export const getLinkItemProviderSuccess = createAction('GET_LINK_ITEM_PROVIDER_SUCCESS')


