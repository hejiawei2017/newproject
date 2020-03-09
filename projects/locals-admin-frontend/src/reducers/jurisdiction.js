import { handleActions } from 'redux-actions'

export const fetchJurisdiction = handleActions({//刷新
    'FETCH_JSUISDICTION_ING' (state, action) {
        return {loading: true}
    },
    'FETCH_JSUISDICTION_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const delJurisdiction = handleActions({//删除
    'DEL_JSUISDICTION_ING' (state, action) {
        return {loading: true}
    },
    'DEL_JSUISDICTION_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})