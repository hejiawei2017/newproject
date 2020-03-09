import { handleActions } from 'redux-actions'

export const cityList = handleActions({
    'SET_CITY_LIST' (state, action) {
        return action.payload
    }
}, null)
