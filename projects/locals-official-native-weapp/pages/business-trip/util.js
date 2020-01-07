const {
  getBuinessInfo,
  getAvailableServiceOrder
} = require('../../server/business-trip')

// vip类型
const vipTypeMeta = {
  1: '个人商旅',
  2: '企业商旅',
  3: '商务VIP'
}

const app = getApp()

/**
 * 请求当前用户的bz状态
 * 设置当前用户的会员状态及会员类型
 */
export function getBuinessStatus() {
  const userId = wx.getStorageSync('userInfo').id

  return getBuinessInfo({
    userId
  })
    .then(res => {
      // 是否是会员
      const isCashVip = !!res.data // 是否商务旅客
      const isVip = res.data ? res.data.isVip : false
      const vipType = res.data && res.data.vipType ? res.data.vipType : null

      // 设置会员状态位
      this.setData({
        isCashVip,
        isVip,
        vipType
      })
      // 全局同步会员状态
      app.globalData.isCashVip = isCashVip
      app.globalData.isVip = isVip
      app.globalData.vipType = vipType
    })
    .catch(e => {
      catchLoading(e)
    })
}

/**
 * 获取会员可用服务类型及数量
 *
 */
export function fetchAvailableServiceOrder() {
  const params = {
    memberId: wx.getStorageSync('userInfo').id
  }
  return getAvailableServiceOrder(params).then(res => {
    if (!res.success) return
    const serviceMap = res.data || {}
    const serviceNames = Object.keys(serviceMap)
    this.setData({
      serviceMap,
      serviceNames
    })
  })
}
