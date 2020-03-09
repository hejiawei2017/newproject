import { createAction } from 'redux-actions'

export const searchingWeixinTemplateList = createAction('SEARCH_WEXINUSERTEMPLATE_ING', data => data)
export const searchWeixinTemplateListSuccess = createAction('SEARCH_WEXINTEMPLATELIST_SUCCESS', data => data)