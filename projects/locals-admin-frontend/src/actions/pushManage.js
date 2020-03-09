import { createAction } from 'redux-actions'

export const serachIngUser = createAction('SEARCH_USER_ING',data=>data)
export const serachUserSuccess = createAction('SEARCH_USER_SUCCESS',data=>data)

export const sendByAdmin = createAction('SEND_BY_ADMIN',data=>data)


