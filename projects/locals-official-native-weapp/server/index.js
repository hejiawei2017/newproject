const request = require('../utils/request.js')
const { env } = require('../config/config')
function fetchAdsList(data) {
  return request.get('act/ads', data)
}

function getActivityData() {
  let data = new Date()
  let version = data.getTime()
  return request.fetchJSON(`https://oss.localhome.cn/localhomeqy/weapp-activity-20190917.json?v=${version}`)
}

function springRelation(data) {
  return request.post(`https://uat.localhome.cn/api/weixin/act/spring/relation`, data)
}

module.exports = {
  fetchAdsList,
  getActivityData,
  springRelation,
}
