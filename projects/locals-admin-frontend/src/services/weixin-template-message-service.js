import Ajax from '../utils/axios.js'

export default {
    getTemplates: data => {
        return Ajax.get('/wechat/templates', data)
    },
    postTemplate: data => {
        return Ajax.post('/wechat/template', data)
    },
    getWeixinTemplates: data => {
        return Ajax.get('/wechat/weixintemplates', data)
    },
    getTemplate: id => {
        return Ajax.get(`/wechat/template/${id}`)
    },
    pmsCheckIn: data => {//发送PMS办理入住模板
        return Ajax.post(`/wechat/wechat/pms/check-in`,data)
    }
}
