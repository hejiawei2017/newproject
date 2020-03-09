import Ajax from '../utils/axios.js'

export default {
    getActAds: (data)=>{
        // 获取banner列表
        return Ajax.get('/act/ads', data)
    },
    deleteActAds: (data)=>{
        // 删除banner
        return Ajax.delete(`/act/ads/${data}`)
    },
    getActAdsInfo: (data)=>{
        // 获取banner信息
        return Ajax.get(`/act/ads/${data}`)
    },
    putActAdsInfo: (data)=>{
        // 增加banner
        return Ajax.put('/act/ads', data)
    },
    addActAds: (data)=>{
        // 增加banner
        return Ajax.post('/act/ads', data)
    },
    imgUpload: (data,id)=>{
        // 上传图片
        const formData = new FormData()
        formData.append('file', data, data.type.replace('/','.'))
        return Ajax.uploadPost(`/atta/attachment-byte/model/${id}/name/article`, formData)
    }
}