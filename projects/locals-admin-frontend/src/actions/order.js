import { createAction } from 'redux-actions'
import * as API from 'services'
import {
    GET_ORDER_LIST,
    GET_CURRENT_ORDER,
    GET_ORDERID_ORDER,
    GET_OPERATION_LOGS,
    ORDER_DISSENT_ING,
    OEDER_DISSENT_SUCCESS,
    ORDER_CANCEL_ING,
    OEDER_CANCEL_SUCCESS
} from '../types/order'

export const getOrderList = createAction(GET_ORDER_LIST, API.orderService.getOrderList)

export const getOrderDetail = createAction(GET_CURRENT_ORDER, API.orderService.getOrderDetail)

export const getOperationLogs = createAction(GET_OPERATION_LOGS, API.orderService.getOperationLogs)

export const getOrderIdOrder = createAction(GET_ORDERID_ORDER)

export const orderDissent = createAction(ORDER_DISSENT_ING)
export const orderDissentSuccess = createAction(OEDER_DISSENT_SUCCESS)

export const orderCancel = createAction(ORDER_CANCEL_ING)
export const orderCancelSuccess = createAction(OEDER_CANCEL_SUCCESS)


