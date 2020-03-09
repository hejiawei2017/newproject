import Ajax from '../../utils/axios.js'


export default {
    getMaterialsList: (data) => {//素材列表
        return Ajax.get('/wechat/materials', data)
    },
    AddMaterial: (data) => {//新增素材
        return Ajax.POST(`/wechat/material`,data)
    },
    delMaterial: (id) => {//删除素材
        return Ajax.DELETE(`/wechat/material/${id}`)
    },
    getLabels: (id) => {//获取标签列表
        return Ajax.get(`/wechat/tags`)
    },
    postSelectItems:(data)=>{//提交
        return Ajax.get(`/wechat/postSelectItems`,data)
    }
}

