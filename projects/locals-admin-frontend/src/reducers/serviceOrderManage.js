import { handleActions } from 'redux-actions'

export const serviceOrderManageM = handleActions({
    'GET_SERVICE_ORDER_MANAE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const serviceOrderM = handleActions({
    'GET_SERVICE_ORDER_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const serviceRefundM = handleActions({
    'GET_SERVICE_REFUND_ORDER_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const cancelServiceOrderManageM = handleActions({//提交服务订单
    'CANCEL_SERVICE_ORDER_MANAGE_ING' (state, action) {
        return {loading: true}
    },
    'CANCEL_SERVICE_ORDER_MANAG_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})
