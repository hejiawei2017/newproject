import { handleActions } from 'redux-actions'

export const promotionList = handleActions({
    'GET_PROMOTION_LIST' (state, action) {
        return action.payload
    }
}, [])

export const deapartmentList = handleActions({
    'GET_DEAPAT_LIST' (state, action) {
        return action.payload
    }
}, [])
export const groupList = handleActions({
    'GET_GROUP_LIST' (state, action) {
        return action.payload
    }
}, [])