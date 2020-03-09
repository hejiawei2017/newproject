import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/wechat/tags',data)
    },
    getUserAll:(data)=>{
        let id = data.urlData
        data.urlData = undefined
        return Ajax.get(`/wechat/tags/users/${id}`,data)
    },
    updateUserTag:(data)=>{
        return Ajax.post('/wechat/tag',data)
    },
    deleteUserTag:(id)=>{
        return Ajax.delete(`/wechat/tag/${id}`)
    },
    addUserTag:(data)=>{
        return Ajax.post('/wechat/tag',data)
    },
    actionUserLabel:(data)=>{
        return Ajax.post('/wechat/tag/user',data)
    }
}