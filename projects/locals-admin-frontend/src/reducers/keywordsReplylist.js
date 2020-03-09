import { handleActions } from 'redux-actions'

export const keywordsReplylist = handleActions({
    'SEARCH_KEYWORDSREPLY_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_KEYWORDSREPLY_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])
