const wechat = require('./utils/wechat.js')
const mtjwxsdk = require('./utils/mtj-wx-sdk.js')
const { getUserDetail } = require('./server/mine')
const { getSelfInviteCode, getInviteCodeByUid } = require('./server/marketing')
const fundebug = require('./libs/fundebug.1.2.1.min.js')
const { getDiffDays, parseUrlParams, catchLoading, formatParams } = require('./utils/util')
const regeneratorRuntime = require('./libs/regenerator-runtime')
const SearchParams = require('./common/search-params')
const { getCoupon } = require('./utils/getCoupon')
fundebug.init({apikey : '2aa858eefcb7f08b36ad6c723aa5cc76e94322a415771993d52999bddc67b6af'})

var gio = require('libs/gio-minp/index.js').default;

App({
  onLaunch(e) {
    console.log('e', e)
    const channel = e.query.channel;
    if (channel) {
      wx.setStorageSync('from_channel', channel);
    } else {
      wx.removeStorageSync('from_channel')
    } 
    // 清除邀请码 在onshow中进行更新
    wx.removeStorageSync('inviteCode')
    if (e.scene) {
      let scene = this.globalData.scene = '' + e.scene
      let fromAppScene = ['1036', '1069']
      // 是否从App分享小程序或者从App打开小程序
      this.globalData.fromApp = fromAppScene.indexOf(scene) > -1
      // 是否点击公众号消息模板
      let weixinTemplateScene = '1043'
      this.globalData.fromWeixinTemplate = scene === weixinTemplateScene
      this.globalData.fromScene = scene
    }
    // 检查更新
    this.updateManager()
    //获取用户手机信息
    this.getSystemInfoFun()
    this.checkToekn()
    this.addSignUpCbs(getCoupon)
  },
  onShow(e){
    this.getInviteCode(e)
    // 如带有推广编码，进行保存
    const sid = e.query.sid;
    if(sid) this.globalData.sid = sid;
  },
  onPageNotFound(res) {
		console.log("TCL: onPageNotFound -> res", res)
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  getInviteCode(e) {
    let inviteCode = e.query.inviteCode || ''
    let userid = ''
    // 分解scene字段，获取邀请码，无邀请码检查是否有userid有则换取邀请码
    const queryScene = e.query.scene
    const params = formatParams(queryScene)
    if ('inviteCode' in params) inviteCode = params.inviteCode
    if ('sid' in params) this.globalData.sid = params.sid;
    if ('userid' in params) userid = params.userid
    if (inviteCode) {
      wx.setStorageSync('inviteCode', inviteCode);
    } else {
      let receiptorId = e.query.userid || userid
      if(receiptorId) {
        getInviteCodeByUid(receiptorId).then(res => {
          if(res.success && res.data.state === 1) wx.setStorageSync('inviteCode', res.data.invitationCode);
        }).catch(() => wx.setStorageSync('inviteCode', userid))
      }
    }
  },
  LongPressQRcode(options) {
    if (options && options.q) {
        let url = decodeURIComponent(options.q)
        let paramsObj = parseUrlParams(url)
        if (paramsObj && paramsObj['path']) {
          return decodeURIComponent(paramsObj['path'])
        } else {
          return false
        }
    } else {
      return false
    }
  },
  checkToekn() {
    // 检查token和openId是否存在
    let toekn = wx.getStorageSync('token')
    let openId = wx.getStorageSync('openId')
    if (toekn && openId) {
      // 检查token是否过期
      let date = new Date()
      let currentTime = date.getTime()
      let tokenExpire = wx.getStorageSync('token_expire')
      // 如果期限不超过6天，则代表登录成功...
      let saveTokenDays = getDiffDays(tokenExpire, currentTime)
      if (saveTokenDays < 5) {
        // isAuthentication 此字段可能即将没用
        this.globalData.isAuthentication = true
      } else {
        wx.clearStorageSync()
      }
    }
  },
  updateManager() {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版已更新，确定后即可使用。',
        showCancel: false,
        success: function (res) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
        }
      })
    })

    updateManager.onUpdateFailed(function (res) {
      // 新版本下载失败
      fundebug.notifyError(new Error('新版本下载失败'))
    })
  },
  getSystemInfoFun() {
    wx.getSystemInfo({
      success: (res) => {
        let index = res.model.indexOf('iPhone X')
        if (index > -1) {
          this.globalData.isFullScreen = true
        }
        this.globalData.deviceModel=res.model
        this.globalData.system = res.system
      }
    })
  },
  getUserInfoDetail(callback) {
    // 获取用户信息
    let params = {
      additionalFields: 'isNew'
    }
    getUserDetail(params)
      .then(res => {
        let { isNew, platformUser = {}, platformUserDetail = {}, userOpenIds } = res.data

        for (let key in userOpenIds) {
          if (this.globalData.appId === userOpenIds[key]['appId']) {
            wx.setStorageSync('openId', userOpenIds[key]['openId'])
            break
          }
        }
        
        let userInfo = {
          ...platformUser,
          ...platformUserDetail,
          isNew
        } 

        wx.setStorageSync('userInfo', userInfo)
        this.globalData.userInfo = userInfo;

        wx.hideLoading();

        (callback && typeof callback === 'function') && callback(userInfo)
        
        // while (this.globalData.taskList.length) {
        //   let task  = this.globalData.taskList
        //   typeof task === 'function' && task(userInfo)
        // }
      })
      .then(() => {
        getSelfInviteCode().then(res => {
          if (res.success && res.data.state === 1) wx.setStorageSync('selfInviteCode', res.data.invitationCode)
        })
      })
      .catch(e => {
        // 没有登录不显示
        let notShowErrorCodeArray = ['20116']
        // 登录异常清空缓存
        let errorCodeArray = ['20113', '20118', '20119', '20120', '10014']
        if (errorCodeArray.indexOf(e.errorCode) >= 0) {
          wx.clearStorageSync()
          return
        }
        if (notShowErrorCodeArray.indexOf(e.errorCode) === -1) {
          catchLoading(e)
        }
      })
  },
  addSignUpCbs (fn) {
    const cbs = this.globalData.signUpCbs
    if (typeof fn !== 'function') return
    const res = cbs.filter(fnc => fnc.toString() === fn.toString())
    if (res.length > 0) return // 避免重复注册
    this.globalData.signUpCbs.push(fn)
  },

  canIUse: wx.canIUse('button.open-type.getUserInfo'),
  /**
   * WeChat API
   */
  wechat: wechat,

  fundebug: fundebug,

  // 极光IM
  jim: null,
  globalData: {
    // growingio统计gio对象
    gio,
    // 缓存精选栏目的房源
    cacheFeaturedHouses: {},
    appId: 'wxdb6b6dc4977e6ef0',
    // 记录登录后的任务列表， 该列表会在 getUserInfo 执行成功之后清空执行
    taskList: [],
    fromApp: false,
    fromWeixinTemplate: false,
    unreadNum: null,
    // 是否是全屏手机（iPhone X）
    isFullScreen: false,
    // 是否重新加载聊天列表，更新一次后会重置为false
    isReloadConversations: false,
    // 是否已授权登录
    isAuthentication: false,
    userInfo: wx.getStorageSync('userInfo') || {},
    openid: null,
    token: wx.getStorageSync('token') || '',
    landlordCity: {
      name: '',
      code: ''
    },
    defaultHouseImage: 'https://oss.localhome.cn/new_icon/pic_lose.png',
    defaultAvatar: 'https://oss.localhome.cn/logo.png',
    defaultCity: '广州市',
    defaultCityCenter: {
      longitude: 113.280637,
      latitude: 23.125178
    },
    // 推广编码
    sid: null,
    searchParams: new SearchParams({
      limitImage: 5,
      pageSize: 10,
    }),
    // 设备型号
    deviceModel:'',
    // 设备系统
    system:'',
    clickId: null, // 用户从H5落地页点击广告进入小程序，带的点击ID参数，做微信广告数据转化统计回传需要使用此参数
    parentId: null, // 小程序有可能是分享页面而来，这里记录了分享者的id
    signUpCbs: [], // 任意位置登录成功后都会触发的回调
    fromScene: null, //进入小程序的场景值
  },
  onError(err) {
    console.log(err)
    fundebug.notifyError(err);
  }
})
