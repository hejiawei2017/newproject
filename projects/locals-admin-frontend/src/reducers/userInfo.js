import { handleActions } from 'redux-actions'

export const userRoleInfo = handleActions({
    'USER_ROLE_INFO' (state, action) {
        return action.payload
    }
}, [])

export const userLoginInfo = handleActions({
    'USER_LOGIN_INFO' (state, action) {
        return {...action.payload}
    }
}, {})
export const userAuthInfo = handleActions({
    'USER_AUTH_INFO' (state, action) {
        return action.payload
    }
}, [])