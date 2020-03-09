import { handleActions } from 'redux-actions'

export const serviceItemManageM = handleActions({
    'GET_SERVICE_ITEM_MANAGE_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const statusServiceItemManageM = handleActions({//停用服务项
    'STATUS_SERVICE_ITEM_MANAGE_ING' (state, action) {
        return {loading: true}
    },
    'STATUS_SERVICE_ITEM_MANAGE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const serviceItemM = handleActions({
    'GET_SERVICE_ITEM_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const areaM = handleActions({
    'GET_AREA_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const cityM = handleActions({
    'GET_CITY_SUCCESS' (state, action) {
        return action.payload
    }
}, [])


export const addServiceItemM = handleActions({//增加服务商
    'ADD_SERVICE_ITEM_ING' (state, action) {
        return {loading: true}
    },
    'ADD_SERVICE_ITEM_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})


export const updateServiceItemM = handleActions({//更新服务商
    'UPDATE_SERVICE_ITEM_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_SERVICE_ITEM_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const getProviderListM = handleActions({ //关联服务商
    'GET_SERVICE_PROVIDER_LIST_SUCCESS' (state, action) {
        return action.payload
    }
}, [])

export const submitTemplateM = handleActions({//提交模版
    'SUBMIT_TEMPLATE_ING' (state, action) {
        return {loading: true}
    },
    'SUBMIT_TEMPLATE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const updateTemplateM = handleActions({//更新模版
    'UPDATE_TEMPLATE_ING' (state, action) {
        return {loading: true}
    },
    'UPDATE_TEMPLATE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})

export const delTemplateM = handleActions({//删除模版
    'DEL_TEMPLATE_ING' (state, action) {
        return {loading: true}
    },
    'DEL_TEMPLATE_SUCCESS' (state, action) {
        return {loading: false}
    }
}, {loading: true})
