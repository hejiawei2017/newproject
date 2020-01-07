const request = require('../utils/request.js')

function getInvoiceTitleList(data){//获取发票抬头列表
    return request.get('booking-plus/invoice/title/app/list/page', data)
}
function addInvoiceTitle(data){//添加发票抬头
    return request.post('booking-plus/invoice/title', data)
}
function updateInvoiceTitle(data){//修改发票抬头，比添加多了一个id字段
    return request.put('booking-plus/invoice/title', data)
}
function delInvoiceTitle(id){//删除发票抬头
    return request.delete(`booking-plus/invoice/title/${id}`)
}
function getInvoiceTitle(id){//获取发票抬头
    return request.get(`booking-plus/invoice/title/${id}`)
}
function getInvoiceList(data) {//获取已开发票列表
  return request.get(`booking-plus/invoice/list/page`, data)
}
function addInvoice(data) {//添加发票
  return request.post(`booking-plus/invoice`, data)
}
function getInvoice(id) {//获取发票详情
  return request.get(`booking-plus/invoice/${id}`)
}


module.exports = {
  getInvoiceTitleList,
  addInvoiceTitle,
  updateInvoiceTitle,
  delInvoiceTitle,
  getInvoiceTitle,
  getInvoiceList,
  addInvoice,
  getInvoice
}