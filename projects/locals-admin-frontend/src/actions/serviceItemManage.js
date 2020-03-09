import { createAction } from 'redux-actions'


export const getServiceItemManageSuccess = createAction('GET_SERVICE_ITEM_MANAGE_SUCCESS')

export const getAreaeSuccess = createAction('GET_AREA_SUCCESS')

export const getCitySuccess = createAction('GET_CITY_SUCCESS')

export const getServiceProviderListSuccess = createAction('GET_SERVICE_PROVIDER_LIST_SUCCESS')

export const statusServiceItemManageIng = createAction('STATUS_SERVICE_ITEM_MANAGE_ING')
export const statusServiceItemManageSuccess = createAction('STATUS_SERVICE_ITEM_MANAGE_SUCCESS')

export const getServiceItemSuccess = createAction('GET_SERVICE_ITEM_SUCCESS')

export const updateServiceItem = createAction('UPDATE_SERVICE_ITEM_ING')
export const updateServiceItemSuccess = createAction('UPDATE_SERVICE_ITEM_SUCCESS')

export const addServiceItem = createAction('ADD_SERVICE_ITEM_ING')
export const addServiceItemSuccess = createAction('ADD_SERVICE_ITEM_SUCCESS')

export const updateTemplateIng = createAction('UPDATE_TEMPLATE_ING')
export const updateTemplateSuccess = createAction('UPDATE_TEMPLATE_SUCCESS')

export const delTemplateIng = createAction('DEL_TEMPLATE_ING')
export const delTemplateSuccess = createAction('DEL_TEMPLATE_SUCCESS')

export const submitTemplateIng = createAction('SUBMIT_TEMPLATE_ING')
export const submitTemplateSuccess = createAction('SUBMIT_TEMPLATE_SUCCESS')



