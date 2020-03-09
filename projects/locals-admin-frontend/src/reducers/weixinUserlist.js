import { handleActions } from 'redux-actions'

export const weixinUserlist = handleActions({
    'SEARCH_WEXINUSERLIST_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_WEXINUSERLIST_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])

export const weixinUserLabellist = handleActions({
    'GET_LABEL_LIST_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'GET_LABEL_LIST_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])

export const weixinUserLabel = handleActions({
    'SEARCH_WEXINUSERLABEL_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_WEXINUSERLABEL_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])
