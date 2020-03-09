import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/wechat/users', data)
    },
    getUser: (id)=>{
        return Ajax.get(`/wechat/user/${id}`)
    },
    getLabel: (data)=>{
        let id = data.urlData
        data.urlData = undefined
        return Ajax.get(`/wechat/user/tags/${id}`,data)
    },
    getSearchList: data => {
        return Ajax.post('/wechat/user/tag-users', data) // 获取搜索后的数据
    },
    getTableByTag: (data, tagId) => {
        return Ajax.get(`/wechat/users/${tagId}/tag`, data)
    }
}