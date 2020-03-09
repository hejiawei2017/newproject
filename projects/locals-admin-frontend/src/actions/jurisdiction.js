import { createAction } from 'redux-actions'

export const serachIngRole = createAction('SEARCH_ROLE_ING',data=>data)
export const serachRoleSuccess = createAction('SEARCH_ROLE_SUCCESS',data=>data)

export const fetchJurisdictionIng = createAction('FETCH_JSUISDICTION_ING')
export const fetchJurisdictionSuccess = createAction('FETCH_JSUISDICTION_SUCCESS')

export const delJurisdictionIng = createAction('DEL_JSUISDICTION_ING')
export const delJurisdictionSuccess = createAction('DEL_JSUISDICTION_SUCCESS')