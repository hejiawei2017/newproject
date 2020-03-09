import { handleActions } from 'redux-actions'

export const userList = handleActions({//用户列表
    'SEARCH_USER_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_USER_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])

export const userCodeList = handleActions({//拥有权限列表
    'QUERY_USERCODE_ING' (state, action) {
        return {
            list:[],
            userId: action.payload.userId,
            loading: true
        }
    },
    'QUERY_USERCODE_SUCCESS' (state, action) {
        return {
            list:action.payload.list,
            userId: action.payload.userId,
            loading: false
        }
    }
}, [])

export const delUserCode = handleActions({//刪除权限
    'DEL_USERCODE_ING' (state, action) {
        return {loading: true}
    },
    'DEL_USERCODE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const addUser = handleActions({//獲取增加权限列表
    'ADD_USER_ING' (state, action) {
        return {list:action.payload, loading: true}
    },
    'ADD_USER_SUCCESS' (state, action) {
        return {list:action.payload, loading: false}
    },
    'ADD_USER_SUCCESS_END' (state, action) {
        return {list:action.payload, loading: true}
    }
}, {loading: true})

export const batchUser = handleActions({//增加权限
    'BATCH_USER_ING' (state, action) {
        return {list:action.payload, loading: true}
    },
    'BATCH_USER_SUCCESS' (state, action) {
        return {list:action.payload, loading: false}
    },
    'BATCH_USER_SUCCESS_END' (state, action) {
        return {list:action.payload, loading: true}
    }
}, {loading: true})
