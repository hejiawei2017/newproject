import { createAction } from 'redux-actions'

export const serachIngRole = createAction('SEARCH_NEW_ROLE_ING',data=>data)
export const serachRoleSuccess = createAction('SEARCH_NEW_ROLE_SUCCESS',data=>data)

export const queryingRoleCode = createAction('QUERY_NEW_ROLECODE_ING',data=>data)
export const queryRoleCodeSuccess = createAction('QUERY_NEW_ROLECODE_SUCCESS',data=>data)

export const delingRoleCode = createAction('DEL_NEW_ROLECODE_ING')
export const delRoleCodeSuccess = createAction('DEL_NEW_ROLECODE_SUCCESS')

export const addingAuthorities = createAction('ADD_AUTHORITIES_ING',data=>data)
export const addAuthoritiesSuccess = createAction('ADD_AUTHORITIES_SUCCESS',data=>data)
export const addAuthoritiesSuccessEnd = createAction('ADD_AUTHORITIES_SUCCESS_END',data=>data)

export const batchingAuthorities = createAction('BATCH_AUTHORITIES_ING',data=>data)
export const batchAuthoritiessSuccess = createAction('BATCH_AUTHORITIES_SUCCESS',data=>data)
export const batchAuthoritiessSuccessEnd = createAction('BATCH_AUTHORITIES_SUCCESS_END',data=>data)
