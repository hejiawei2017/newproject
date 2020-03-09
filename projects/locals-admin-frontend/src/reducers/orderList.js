import { handleActions } from 'redux-actions'

export const orderListM = handleActions({
    'GET_ORDER_LIST_SUCCESS' (state, action) {
        return {list:action.payload.list, total: action.payload.total}
    }
}, [])

export const updateOrderM = handleActions({//取消
    'ORDER_DISSENT_ING' (state, action) {
        return {loading: true}
    },
    'OEDER_DISSENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const orderDissentM = handleActions({//取消
    'ORDER_CANCEL_ING' (state, action) {
        return {loading: true}
    },
    'OEDER_CANCEL_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})