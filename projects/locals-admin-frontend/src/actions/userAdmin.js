import { createAction } from 'redux-actions'

export const serachIngUser = createAction('SEARCH_USER_ING',data=>data)
export const serachUserSuccess = createAction('SEARCH_USER_SUCCESS',data=>data)

export const queryingUserCode = createAction('QUERY_USERCODE_ING',data=>data)
export const queryUserCodeSuccess = createAction('QUERY_USERCODE_SUCCESS',data=>data)

export const delingUserCode = createAction('DEL_USERCODE_ING')
export const delUserCodeSuccess = createAction('DEL_USERCODE_SUCCESS')

export const addingAuthorities = createAction('ADD_USER_ING',data=>data)
export const addUserSuccess = createAction('ADD_USER_SUCCESS',data=>data)
export const addUserSuccessEnd = createAction('ADD_USER_SUCCESS_END',data=>data)

export const batchingAuthorities = createAction('BATCH_USER_ING',data=>data)
export const batchUsersSuccess = createAction('BATCH_USER_SUCCESS',data=>data)
export const batchUsersSuccessEnd = createAction('BATCH_USER_SUCCESS_END',data=>data)
