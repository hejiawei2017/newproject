import Ajax from '../utils/axios.js'

export default {
    getTable: (data)=>{
        return Ajax.get('/prod-plus/goods', data)
    },
    del: (id)=>{
        return Ajax.delete(`/prod-plus/goods/${id}`)
    },
    update: (data)=>{
        return Ajax.put(`/prod-plus/goods`,data)
    },
    add: (data)=>{
        return Ajax.post('/prod-plus/goods', data)
    },
    setProfits: (data)=>{
        return Ajax.post('/prod-plus/profits', data)
    },
    getProfits: (id)=>{
        return Ajax.get(`/prod-plus/profits/${id}`)
    },
    getWechatQRCode: (data) => {
        return Ajax.post('/wechat/param/mini-qr-code', data)
    },
    getUatQRCode: (data) =>{
        return Ajax.post('http://uat.localhome.cn/api/getWXACode/mini-program',data)
    }
}