import { handleActions } from 'redux-actions'

export const serviceProviderListM = handleActions({
    'GET_SERVICE_PROVIDER_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const getProviderItemM = handleActions({//获取详情的服务项
    'GET_PROVIDER_ITEM_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const getLinkProviderM = handleActions({//获取关联的服务项
    'GET_LINK_PROVIDER_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const getLinkItemProviderM = handleActions({//获取关联的服务项
    'GET_LINK_ITEM_PROVIDER_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const addProviderM = handleActions({//增加服务商
    'ADD_PROVIDER_ING' (state, action) {
        return {loading: true}
    },
    'ADD_PROVIDER_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const updateProviderM = handleActions({//更新服务商
    'UPDATE_PROVIDER_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_PROVIDER_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

