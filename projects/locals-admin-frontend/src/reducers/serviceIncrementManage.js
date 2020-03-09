import { handleActions } from 'redux-actions'

export const serviceIncrementManageM = handleActions({
    'GET_SERVICE_INCREMENT_MANAE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const statusServiceIncrementManageM = handleActions({//暂停服务项
    'STATUS_SERVICE_INCREMENT_MANAGE_ING' (state, action) {
        return {loading: true}
    },
    'STATUS_SERVICE_INCREMENT_MANAG_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const delServiceIncrementServiceM = handleActions({//删除服务项
    'DEL_SERVICE_INCREMENT_ING' (state, action) {
        return {loading: true}
    },
    'DEL_SERVICE_INCREMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const updateServiceIncrementServiceM = handleActions({//更新服务项
    'UPDATE_SERVICE_INCREMENT_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_SERVICE_INCREMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const addServiceIncrementServiceM = handleActions({//新增服务项
    'ADD_SERVICE_INCREMENT_ING' (state, action) {
        return {loading: true}
    },
    'ADD_SERVICE_INCREMENT_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const serviceIncrementDetailM = handleActions({ //获取详情
    'GET_SERVICE_INCREMENT_DETAIL_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const serviceIncrementServiceListM = handleActions({ //获取服务项
    'GET_SERVICE_INCREMENT_SERVICE_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const serviceIncrementProviderListM = handleActions({ //获取服务商
    'GET_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const linkIncrementProviderListM = handleActions({ //关联服务商
    'LINK_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const serviceIncrementAuditingLogM = handleActions({ //获取审核记录
    'GET_SERVICE_INCREMENT_AUDITING_LOG_SUCCESS' (state, action) {
        return action.payload
    }
}, [])


