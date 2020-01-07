const request = require('../utils/request.js')
const { memberCardInfo } = require('../utils/dictionary')
const { nodeApi } = require('../config/param-config.js')
function signUp(data) {
  return request.post('platform/auth/wechat-mini-program/sign-up', data)
  //return request.post('http://10.0.7.6:8703/auth/wechat-mini-program/sign-up', data)
}
function getUserDetail(data) {
  //用户信息
  return request.get('platform/user/user-info-detail', data)
}
function putUserDetail(data) {
  //修改用户信息
  return request.put('platform/user/user-info', data)
}
function getMembership(data) {
  //查询会员等级
  return request.get('platform/membership/token', data)
}
function getInvoice(data) {
  //发票列表
  return request.get('booking-plus/invoice/canopen', data)
}
function getLandlordNickName(id) {
  //根据发票列表中的bookingId去获取landlordNickName
  return request.get(`booking-plus/order/${id}/detail`)
}
function getWallte(data) {
  //我的钱包优惠券
  return request.get('coupon/v2/records', data)
}
// 领取优惠券
function receiveCoupon(data) {
  return request.post('coupon/record/receive-coupon', data)
}
function getCollct(data) {
  //获取收藏列表
  return request.get('prod-plus/mini/favorites', data)
}
function getAllCollct(data) {
  return request.get('prod-plus/mini/favorites/all')
}
function getCollctLand(data) {
  //获取收藏房东列表
  return request.get('platform/user/follows', data)
}
function getGuests(data) {
  //入住人列表
  return request.get('booking-plus/guests', data)
}
function getGuest(guestId) {
  return request.get(`booking-plus/guest/${guestId}/detail`)
}
function postGuests(data) {
  //添加入住人
  return request.post('booking-plus/guest', data)
}
function putGuests(data) {
  //修改入住人
  return request.put('booking-plus/guest', data)
}
function delGuests(id) {
  //删除入住人
  return request.delete(`booking-plus/guest/${id}`)
}
function getCashVip(data) {
  return request.get(`platform/cash-vip/user-id`, data)
}
function getUserBiz() {
  return request.get(`platform/user-biz/simple`)
}
function getWallet() {
  return request.get(`member/wallet`)
}
// 获取钱包明细
function getWalletDetail(data) {
  return request.get(`member/wallet-detail`, data)
}
// 发送验证码
function sendAuthCode(data) {
  return request.post(`platform/auth/auth-code/send`, data)
}
// 修改手机号
function updateMobile(data) {
  return request.put(`platform/user/user-info-mobile`, data)
}

// 获取分销权限
function getPermission(data) {
  return request.get(`act/mark-invitation-code/valid`, data)
}

function getMemberCard({ code }) {
  //return request.get('platform/member/card/code', data)
  return new Promise((resolve, reject) => {
    let cardInfo = memberCardInfo[code]
    if (cardInfo) {
      let result = {
        data: cardInfo
      }
      resolve(result)
    } else {
      resolve(memberCardInfo['NORMAL'])
    }
  })
}

// code获取用户
function getUserInfoByCode(data) {
  return request.get(`platform/auth/wechat-mini-program/code`, data)
}

/**
 * 判断当前用户是否是新用户， 只在新注册后5分钟内有效
 */
function getIsNewUser() {
  return request.get('platform/user/isNew')
}

//判断用户角色
function checkRole(data) {
  return request.get('platform/role-authorities/user-id', data)
}
//获取我的页面用户的相关信息
function getMineInfo(data) {
  return request.ajaxGet(`${nodeApi}/weapp/get-mine-info`, data)
}

module.exports = {
  getUserDetail,
  putUserDetail,
  getMembership,
  getInvoice,
  getLandlordNickName,
  getWallte,
  getCollct,
  getCollctLand,
  getGuests,
  postGuests,
  putGuests,
  delGuests,
  signUp,
  getCashVip,
  getUserBiz,
  getWallet,
  getWalletDetail,
  getAllCollct,
  sendAuthCode,
  updateMobile,
  getMemberCard,
  getUserInfoByCode,
  receiveCoupon,
  getGuest,
  getIsNewUser,
  getPermission,
  checkRole,
  getMineInfo
}
