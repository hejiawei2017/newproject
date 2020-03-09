import { handleActions } from 'redux-actions'

export const newRoleList = handleActions({//角色列表
    'SEARCH_NEW_ROLE_ING' (state, action) {
        return {...action.payload,loading: true}
    },
    'SEARCH_NEW_ROLE_SUCCESS' (state, action) {
        return {...action.payload,loading: false}
    }
}, [])

export const newRoleCodeList = handleActions({//拥有权限列表
    'QUERY_NEW_ROLECODE_ING' (state, action) {
        return {list:[],roleCode: action.payload.roleCode,roleName:'', loading: true}
    },
    'QUERY_NEW_ROLECODE_SUCCESS' (state, action) {
        return {list:action.payload.list,roleCode: action.payload.roleCode,roleName: action.payload.roleName, loading: false}
    }
}, [])

export const delRoleCode = handleActions({//刪除权限
    'DEL_NEW_ROLECODE_ING' (state, action) {
        return {loading: true}
    },
    'DEL_NEW_ROLECODE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const addAuthorities = handleActions({//獲取增加权限列表
    'ADD_AUTHORITIES_ING' (state, action) {
        return {list:action.payload, loading: true}
    },
    'ADD_AUTHORITIES_SUCCESS' (state, action) {
        return {list:action.payload, loading: false}
    },
    'ADD_AUTHORITIES_SUCCESS_END' (state, action) {
        return {list:action.payload, loading: true}
    }
}, {loading: true})

export const batchAuthorities = handleActions({//增加权限
    'BATCH_AUTHORITIES_ING' (state, action) {
        return {list:action.payload, loading: true}
    },
    'BATCH_AUTHORITIES_SUCCESS' (state, action) {
        return {list:action.payload, loading: false}
    },
    'BATCH_AUTHORITIES_SUCCESS_END' (state, action) {
        return {list:action.payload, loading: true}
    }
}, {loading: true})
