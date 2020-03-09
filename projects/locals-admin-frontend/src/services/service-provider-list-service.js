import Ajax from '../utils/axios.js'
export default {
    getTable: (data) =>{
        return Ajax.get('/old/business/business-providers',data) // 获取table列表
    },
    getProvider: (data) =>{
        return Ajax.get('/old/business/business-provider/',data,true) // 删除接口
    },
    updateProvider: (data) =>{
        return Ajax.put('/old/business/business-provider',data,true) // 更新评论
    },
    addProvider: (data) =>{
        return Ajax.post('/old/business/business-provider',data) // 增加评论
    },
    getLinkProvider: (data) =>{
        return Ajax.get('/old/business/business-provider-services',data,true) // 获取关联服务项
    }
}