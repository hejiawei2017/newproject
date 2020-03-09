import { handleActions } from 'redux-actions'

export const authrotyList = handleActions({
    'SEARCH_AUTHORIT_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_AUTHORIT_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])
