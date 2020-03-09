import { handleActions } from 'redux-actions'

export const weixinLabelM = handleActions({
    'GET_LABEL_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const weixinLabelDetailM = handleActions({
    'GET_LABEL_DETAIL_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const addUserTagM = handleActions({//增加服务商
    'ADD_LABEL_ING' (state, action) {
        return {loading: true}
    },
    'ADD_LABEL_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const updateUserTagM = handleActions({//更新服务商
    'UPDATE_LABEL_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_LABEL_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const actionUserLabelM = handleActions({//更新服务商
    'ACTION_LABEL_ING' (state, action) {
        return {loading: true}
    },
    'ACTION_LABEL_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})