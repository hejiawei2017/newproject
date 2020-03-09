import { createAction } from 'redux-actions'

export const serachingWeixinUserlist = createAction('SEARCH_WEXINUSERLIST_ING',data=>data)
export const serachWeixinUserlistSuccess = createAction('SEARCH_WEXINUSERLIST_SUCCESS',data=>data)

export const serachingWeixinUserLabel = createAction('SEARCH_WEXINUSERLABEL_ING',data=>data)
export const serachWeixinUserLabelSuccess = createAction('SEARCH_WEXINUSERLABEL_SUCCESS',data=>data)

export const getWeixinSearchList = createAction('GET_WEIXIN_SEARCH_LIST_ING',data=>data)
export const getWeixinSearchListSuccess = createAction('GET_WEIXIN_SEARCH_LIST_SUCCESS',data=>data)
