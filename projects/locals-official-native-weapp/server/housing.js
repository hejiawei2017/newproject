const request = require('../utils/request.js')

function getUserDetail (id) {
  return request.get(`platform/user/user-info/${id}`)
}
function fetchHotHouseList(data) {
  return request.get('prod-plus/house/heat', data)
}
function getHouseList (data) {
    return request.get('prod-plus/es/houses', data)
}
//房源详情
function getHouseDetail(data) {
  return request.get('prod-plus/es/houses/' + data)
}
function getHouseSimpleDetail(data) {
  return request.get('prod-plus/house/' + data +'/simple-info')
}

//房源设施
function getSystemParametersFacility(data) {
  return request.get('base/system-parameters/facility')
}
//房源评论
function getHouseComments(data) {
  return request.get('prod-plus/comment-views', data)
}
//房源收藏
function postCollct(data){
  return request.post('v2/prod/house/favorite', data)
}

//房源日历
function getHouseCalendar(id) {
  return request.get(`prod-plus/house/${id}/calendar`)
}

// 房源日历详情
function getHouseCalendarDetail(id, data) {
  return request.get(`prod-plus/house/${id}/calendar/detail`, data)
}

// 获取周边信息
function getPOIs(cityName) {
  return request.get(`prod-plus/pois/city-name/${cityName}`)
}
// 获取房东评论
function getLandlordComment(data){
  return request.get(`prod-plus/mini/comments`,data)
}
// 获取房东信息
function getHouseLandlord(data) {
  return request.get('platform/landlord/' + data)
}
// 关注或取消关注房东
function followOwer(data){
  return request.post('platform/user/follow',data)
}

// 标签二级显示
function getCustomerTagMap(categoryType) {
  return request.get(`prod-plus/category/type/${categoryType}/customer/tag`)
}
// 获取标签
function getCustomerTag(data) {
  return request.get('prod-plus/customer/tag', data)
}
// 获取lotel主页详情
function getLotelDetail(data) {
  return request.get(`prod-plus/mini-lotel-store/${data}`)
}
function getLotelHouses(data) {
  return request.get(`prod-plus/mini-lotel-store-houses`, data)
}
function getLotelComment(data) {
  return request.get(`prod-plus/mini-lotel-store-house-comments`, data)
}

// 检查房源库存
function checkStock(houseSourceId, data) {
  return request.get(`prod-plus/house/${houseSourceId}/calendar/stock/check`, data)
}

function getlotelProperty(lotelId) {
  return request.get(`prod-plus/mini-lotel-store/${lotelId}/property`)
}

function getFeaturedCity() {
  return request.fetchJSON('https://oss.localhome.cn/localhomeqy/featured-city.json')
}

// 获取标签列表
function getTagList(data) {
  return request.get('prod-plus/customer/tag/list', data)
}

/**
 * 根据房源id列表批量查询房源列表
 * @param {*} data {"idIn":1000,10001}
 */
function getHouseListByIds (data) {
  return request.get('prod-plus/houses/list', data)
}
// 获取国外民宿的规则文案
function fetchForeignRuleText() {
  return request.get('weapp/forgein-house-rule NODE');
}

module.exports = {
  getHouseList,
  getHouseDetail,
  getSystemParametersFacility,
  getHouseComments,
  postCollct,
  getHouseSimpleDetail,
  getUserDetail,
  getHouseCalendar,
  getHouseCalendarDetail,
  getPOIs,
  getCustomerTag,
  getCustomerTagMap,
  getLandlordComment,
  followOwer,
  fetchHotHouseList,
  getHouseLandlord,
  getLotelDetail,
  getLotelHouses,
  getLotelComment,
  checkStock,
  getlotelProperty,
  getFeaturedCity,
  getTagList,
  getHouseListByIds,
  fetchForeignRuleText
}