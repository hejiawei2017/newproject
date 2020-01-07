const { reciveRedpacket } = require('../server/order')
const { gioTrack } = require('./util')
function getCoupon() {
    const app = getApp();
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const prePages = [pages[pages.length - 2] || null, pages[pages.length - 3] || null]
    const blackList = [
      'pages/activity/new-user-redpacket-20190626/index',
      'pages/activity/new-user-redpacket/index',
      'https://i.localhome.cn/v/1908171819953'
    ]
    if (blackList.includes(currentPage.route)) { // 新人领取红包页有自定义回调，此处不做处理
      return
    }

    // 查看h5是否有新人红包，是的话不作处理
    // if (currentPage.route === 'pages/h5/login/index'
    // && prePages.route === 'pages/h5/index'
    // && prePages.options
    // && blackList.includes(prePages.options.url)) {
    //   return
    // }
    let flag = false
    prePages.forEach(item => {
      if (!item) return
      if (item.route === 'pages/h5/index' && item.options
      && blackList.includes(item.options.url)) {
        flag = true
      }
    })
    if (flag) return
    const params = {
        phone: app.globalData.userInfo.mobile,
        userInfo: JSON.stringify(app.globalData.userInfo),
        traceId: app.globalData.sid,
        activity_id: '1902220547571'
    }
    reciveRedpacket(params)
        .then((res) => {
            gioTrack('mini_register_new_red_packet')
            wx.showToast({
                title: '获得100元红包',
                duration: 1500
            })
        })
        .catch((e = {}) => {
            if (e.errorMsg && e.errorMsg.indexOf('已存在')) {
                // 不做任何操作
                return
            }
        })
}

  export {
      getCoupon
  }
