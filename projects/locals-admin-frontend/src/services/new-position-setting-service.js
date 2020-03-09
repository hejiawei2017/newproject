import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/platform/positions', {...data, statusNotEqual: '0'}) // 获取table列表
    },
    addPosition: (data) =>{
        return Ajax.post('/platform/position',data) // 获取table列表
    },
    putPosition: (data) =>{
        return Ajax.put('/platform/position',data) // 获取table列表
    },
    deletePosition: (id) =>{
        return Ajax.delete(`/platform/position/${id}`,) // 获取table列表
    },
    getComMobileList: (data) =>{
        return Ajax.get('/platform/com-mobile/list', data) // 获取公司手机号
    },
    getComMobileHistoryList: (data) =>{
        return Ajax.get(`/platform/com-mobile-history/list`, data) // 获取公司手机号历史
    },
    addcComMobile: (data) =>{
        return Ajax.post(`/platform/com-mobile/add`, data) // 添加公司手机号
    }
}
