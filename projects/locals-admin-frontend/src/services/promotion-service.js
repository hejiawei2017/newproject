import Ajax from '../utils/axios.js'

export default {
    getPromotionTable: (data)=>{
        // 获取推广渠道列表
        return Ajax.get('/platform/promotion/channel', data)
    },
    addDepartment: (data)=>{
        // 增加推广部门
        return Ajax.post('/platform/promotion/department', data)
    },
    modifyDepartment: (data)=>{
        // 修改部门
        return Ajax.put('/platform/promotion/department', data)
    },
    getDeapartmentTable: (data)=>{
        // 查询部门列表
        return Ajax.get('/platform/promotion/department', data)
    },
    addGroup: (data)=>{
        // 添加分组
        return Ajax.post('/platform/promotion/group', data)
    },
    modifyGroup: (data)=>{
        // 修改分组
        return Ajax.put(`/platform/promotion/group/`,data)
    },
    getGroup: (data)=>{
        // 查询分组
        return Ajax.get('/platform/promotion/group',data)
    },
    addChannel: (data)=>{
        // 添加渠道
        return Ajax.post('/platform/promotion/channel', data)
    },
    modifyChannel: (data)=>{
        // 修改推广渠道
        return Ajax.put('/platform/promotion/channel', data)
    },
    deleteChannel: (data)=>{
        // 删除推广渠道
        return Ajax.delete(`/platform/promotion/channel/${data}`)
    }
}