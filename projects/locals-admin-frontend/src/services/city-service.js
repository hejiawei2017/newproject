import Ajax from '../utils/axios.js'

export default {
    getChinaAreas: (data)=>{
        // 获取城市列表
        return Ajax.get('/base/china-areas', data)
    },
    deleteChinaAreas: (data)=>{
        // 删除城市
        return Ajax.delete(`/base/china-areas/${data}`)
    },
    getChinaAreasInfo: (data)=>{
        // 获取城市信息
        return Ajax.get(`/base/china-areas/${data}`)
    },
    putChinaAreasInfo: (data)=>{
        return Ajax.put('/base/china-areas', data)
    },
    addChinaAreas: (data)=>{
        // 增加城市
        return Ajax.post('/base/china-areas', data)
    },
    imgUpload: (data,id)=>{
        // 上传图片
        const formData = new FormData()
        formData.append('file', data, data.type.replace('/','.'))
        return Ajax.uploadPost(`/atta/attachment-byte/model/${id}/name/city`, formData)
    }
}