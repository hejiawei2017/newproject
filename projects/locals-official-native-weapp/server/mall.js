const request = require('../utils/request.js')
//商品信息
function getGoods(id) {
    return request.get(`mall/item/view/${id}`);
}
//生成订单
function createMallOrder (data) {
    return request.post('mall/trade/item/v2', data)
}
//我的订单列表
function myOrderList(data) {
    return request.get('mall/trade/my-trade-list',data)
}
//提取商品
function claim(data) {
    return request.put('mall/trade/receive-present',data)
}
//检查是否已领取商品
function checkTradepresent(data) {
    return request.get('mall/trade/receive-present',data)
}
//查询领取订单列表
function claimList(data) {
    return request.get('mall/trade/receive-present/record',data)
}
//关闭订单
function closeTrade(data) {
    return request.put('mall/trade/close-trade',data)
}

function tempConfig(id) {
  return request.fetchJSON('https://oss.localhome.cn//localhomeqy/mall_tempconfig/test.json')
  .then(res => {
    if (res.some(v => v.id === id)) {
      return res.filter(v => v.id === id)[0];
    }

    return request.fetchJSON(`https://oss.localhome.cn//localhomeqy/mall_tempconfig/item_${id}.json`)
  })
}



function mallTempConfig() {
    return request.fetchJSON(`https://oss.localhome.cn//localhomeqy/mall/malltempconfig.json`)
}

function mallRelevance() {
  return request.fetchJSON('https://oss.localhome.cn//localhomeqy/mall_tempconfig/relevance.json')
}


module.exports = {
    mallRelevance,
    createMallOrder,
    getGoods,
    myOrderList,
    claim,
    checkTradepresent,
    claimList,
    closeTrade,
    tempConfig,
    mallTempConfig 
}