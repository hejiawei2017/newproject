import { handleActions } from 'redux-actions'

export const userList = handleActions({//用户列表
    'SEARCH_USER_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_USER_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])

export const sendByAdmin = handleActions({//拥有权限列表
    'SEND_BY_ADMIN' (state, action) {
        return {
            userId: action.payload
        }
    }
}, [])

