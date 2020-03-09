import { handleActions } from 'redux-actions'

export const weixinTemplateList = handleActions({
    'SEARCH_WEXINUSERTEMPLATE_ING' (state, action) {
        return {...action.payload, loading: true}
    },
    'SEARCH_WEXINTEMPLATELIST_SUCCESS' (state, action) {
        return {...action.payload, loading: false}
    }
}, [])
