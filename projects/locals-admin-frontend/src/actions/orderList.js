import { createAction } from 'redux-actions'


export const getOrderListSuccess = createAction('GET_ORDER_LIST_SUCCESS',data=>data)

export const orderDissent = createAction('ORDER_DISSENT_ING')
export const orderDissentSuccess = createAction('OEDER_DISSENT_SUCCESS',data=>data)

export const orderCancel = createAction('ORDER_CANCEL_ING')
export const orderCancelSuccess = createAction('OEDER_CANCEL_SUCCESS',data=>data)