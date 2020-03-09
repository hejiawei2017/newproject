import Ajax from '../utils/axios.js'
export default {
    getMaketList: data =>{
        return Ajax.get('/act/mark-bonus-rule/list',data)
    },
    getBonusDetail : data => {
        return Ajax.get('/act/mark-bonus-detail/list',data)
    },
    putNewRule : data => {
        return Ajax.post('/act/mark-bonus-rule',data)
    },
    updateRule : data => {
        return Ajax.put('/act/mark-bonus-rule',data)
    },
    getRuleData : data => {
        return Ajax.get('/act/mark-bonus-rule/id',data)
    },
    deleteRule : id => {
        return Ajax.delete(`/act/mark-bonus-rule/id?id=${id}`)
    },
    getGiftData : () => {
        return Ajax.get('/mall/items')
    },
    getMallTrade : (data) => {//获取商城交易记录
        return Ajax.getMiddlewareApi('/mall/trade', data)
    },
    // 获取分销上下级关系
    getDnUser :(data) => {
        return Ajax.get('/act/mark-user/dn-user/list',data)
    }
}
