import { createAction } from 'redux-actions'


export const getServiceIncrementManageSuccess = createAction('GET_SERVICE_INCREMENT_MANAE_SUCCESS')

export const getServiceIncrementDteailSuccess = createAction('GET_SERVICE_INCREMENT_DETAIL_SUCCESS')

export const getServiceIncrementProviderListSuccess = createAction('GET_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS')

export const linkServiceIncrementProviderListSuccess = createAction('LINK_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS')

export const getServiceIncrementServiceListSuccess = createAction('GET_SERVICE_INCREMENT_SERVICE_LIST_SUCCESS')

export const getServiceIncrementAuditingLogSuccess = createAction('GET_SERVICE_INCREMENT_AUDITING_LOG_SUCCESS')//审核记录

export const stuatusServiceIncrementManageIng = createAction('STATUS_SERVICE_INCREMENT_MANAGE_ING')
export const statusServiceIncrementManageSuccess = createAction('STATUS_SERVICE_INCREMENT_MANAGE_SUCCESS')

export const delServiceIncrementIng = createAction('DEL_SERVICE_INCREMENT_ING')
export const delServiceIncrementSuccess = createAction('DEL_SERVICE_INCREMENT_SUCCESS')

export const addServiceIncrementIng = createAction('ADD_SERVICE_INCREMENT_ING')
export const addServiceIncrementSuccess = createAction('ADD_SERVICE_INCREMENT_SUCCESS')

export const updateServiceIncrementIng = createAction('IUPDATE_SERVICE_INCREMENT_ING')
export const updateServiceIncrementSuccess = createAction('UPDATE_SERVICE_INCREMENT_SUCCESS')


