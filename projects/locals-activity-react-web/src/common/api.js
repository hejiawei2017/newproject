import { post, put, get, getByOptions } from './request'
import EnvConfig from '../config/env-config'

const JHost = EnvConfig.envConfig.api // java host
const Host = EnvConfig.envConfig.apiBoost

export const statisticsEvent = data => post(`${Host}/statistics/event`, data)
export const statisticsJoin = data =>
  post(`${Host}/statistics/share_join`, data)

export const getCouponDouyin = phone =>
  post(`/coupon/record/admin/receive-coupon/mobile?mobile=${phone}`)
export const getCoupon = data => post(`${Host}/report/index`, data)
// 支付接口
export const pay = data => post('/pay-center/pay', data)
// 查询支付状态
export const checkPay = data => post('/pay-center/order/query', data)
// 新增订单（抖音）
export const douyinOrder = data => post('/act/douyin/order', data)
// 更新订单（抖音）
export const douyinUpdate = data =>
  put(
    `/act/douyin/${data.orderId}/pay-status?payId=${data.payId}&payStatus=${data.payStatus}`
  )
// 查询订单（抖音）
export const phoneOrders = phone => get(`/act/douyin/phone-orders/${phone}`)
// 发送短信提示
export const sendMessage = data => post('/act/douyin/message', data)
// 发送手机验证码
export const sentMobile = data => post('/platform/validation/sent-mobile', data)
// 验证手机验证码
export const checkMobile = data =>
  put('/platform/validation/check-mobile', data)

// 获取荣德78折券
export const getRongDeCoupon = data => post(`${Host}/report/index`, data)

/**
 * 新的发送手机验证码功能提供给下边的注册接口使用
 */
// 发送手机验证码
export const sendVerificationCode = data =>
  post('/platform/auth/auth-code/send', data)
// 根据电话号码和验证码注册(注册成功会自动登录)
export const register = data => post('/platform/auth/sign-up', data)
// 根据电话号码和验证码登录
export const login = data => post('/platform/auth/auth-code/sign-in', data)
// 登录成功之后调用此接口，可以注册会员信息
export const registerMemberInfo = (data, options) =>
  getByOptions('/platform/membership/token', data, options)

// 发放新人优惠券
export const sendCouponNewUser = (data, options) =>
  post(`${Host}/new_use_redpacket/index`, data, options)

// 发放活动优惠券100元
export const sendCouponActivity = (data, options) =>
  post(`${Host}/new_use_redpacket/sendActivityCoupon`, data, options)

//给新人发优惠券
export const sendNewUserCoupon = (data, options) =>
  post(`/act/gift-pack/sendNewUserCoupon`, data, options)

//腾讯统计
export const trackingConversionAd = data =>
  post(`${Host}/wechat/trackingConversionAd`, data)
// 根据token，获取用户信息
export const queryUserInfoByToken = (data, options) =>
  getByOptions('/platform/user/user-info-token', data, options)

//判断商品购买资格
export const purchaseRight = (data, options) =>
  post(`/mall/purchase-right/grant`, data, options)

// 获取个人详情
export const getUserDetail = token =>
  get(`${JHost}/platform/user/user-info-detail`, null, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=UTF-8',
      'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
    }
  })

/**
 * 查看单个砍价订单活动详情
 */
export const queryBargainDetail = ({ orderId, createrId }) =>
  get(`${Host}/bargain/detail`, {
    creater_id: createrId,
    order_id: orderId
  })

/**
 * 获取单个砍价订单活动的所有帮助人
 */
export const queryBargainFriends = orderId =>
  get(`${Host}/bargain/bargain-friends`, {
    order_id: orderId
  })

/**
 * 帮助好友砍价
 */
export const bargainPrice = (
  { orderId, createrId, helperId, helperInfo },
  options
) =>
  post(
    `${Host}/bargain/bargain-price`,
    {
      order_id: orderId,
      creater_id: createrId,
      helper_id: helperId,
      helper_info: helperInfo
    },
    options
  )

/**
 * 活动发券
 * @param data
 * @param options
 */
export const giftPack = (data, options) =>
  post(`${Host}/giftPack`, data, options)

/**
 * 记录发券操作
 * @param data
 * @param options
 */
export const importStaffs = (data, options) =>
  post(`${Host}/importStaffs`, data, options)

// 邀请好友
export const inviteFriendsRecords = (userId, page, pageSize, token) => {
  return get(
    `${Host}/house_share/getShareReport`,
    { userId, page, pageSize },
    {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
      }
    }
  )
}

export const getInviteFriendsBonusNum = (userId, token) => {
  return get(
    `${Host}/house_share/getAllBonus`,
    { userId },
    {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'LOCALS-ACCESS-TOKEN': 'Bearer ' + token
      }
    }
  )
}

//获取小程序码
export const minaCode = data => post(`${Host}/wechat/qrcode/unlimited`,data);
//ipad手工单详情页
export const ipadOrderLotel = data => get('/booking-plus/orderlotel/ipad/order',data);
//获取门店图片
export const lotelInfo = houseId => get(`/prod-plus/pms/hotel/${houseId}/info`);
