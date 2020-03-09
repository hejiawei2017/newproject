import { handleActions } from 'redux-actions'

export const payBatch = handleActions({
    'PAYMENT-TYPE-LIST_SUCCESS' (state, action) {
        return {
            payTypeList: action.payload.payTypeList,
            payTypeNum: action.payload.payTypeNum,
            loading: false
        }
    }
}, [])