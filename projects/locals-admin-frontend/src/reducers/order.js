import { handleActions } from 'redux-actions'
import {GET_ORDER_LIST, GET_CURRENT_ORDER, GET_ORDERID_ORDER, GET_OPERATION_LOGS} from '../types/order'

const orderState = {
    orderList: [],
    total: 0,
    currentOrder: {},
    operationLogs: {}
}

function getOrderList (state, action) {
    return {
        ...state,
        orderList: action.payload.list,
        total: action.payload.total
    }
}

function getOrderDetail (state, action) {
    return {
        ...state,
        currentOrder: action.payload
    }
}

function getOrderIdOrder (state, action) {
    return {
        ...state,
        orderIdOrder: action.payload
    }
}

function getOperationLogs (state, action) {
    return {
        ...state,
        operationLogs: action.payload
    }
}

export default handleActions(
    {
        [GET_ORDER_LIST]: getOrderList,
        [GET_CURRENT_ORDER]: getOrderDetail,
        [GET_ORDERID_ORDER]: getOrderIdOrder,
        [GET_OPERATION_LOGS]: getOperationLogs
    },
    orderState
);