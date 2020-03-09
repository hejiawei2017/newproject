import { handleActions } from 'redux-actions'

export const paymentTypeList = handleActions({
    'PAYMENT_TYPE_LIST' (state, action) {
        let payTypeItemMap = new Map()
        action.payload.forEach(item => {
            payTypeItemMap.set(item.code, item)
        })
        return payTypeItemMap
    }
}, new Map())