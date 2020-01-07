const app = getApp();
const request = require("../../utils/request")
const regeneratorRuntime = require('../../libs/regenerator-runtime')
const { showLoading, catchLoading, validator, isHasLogin } = require('../../utils/util')
const { signUp, getUserInfoByCode } = require('../../server/mine')
const { reportFormid } = require('../../server/message')
const { getCurrentPageUrl } = require('../../utils/util')

Component({
  properties: {
    // 用途：用户页面中不强制登录，但触发某个功能时需要显示登录框，
    // 让其先隐藏登录框，触发时signInSuccessCallback时显示登录框
    initHide:{
      type: Boolean,
      value: false
    },
    bindMobile: {
      type: Boolean,
      value: true
    },
    isCanCancel: {
      type: Boolean,
      value: false
    }
  },
  data: {
    code: '',
    phone: '',
    mobile: '',
    overTime: 60,
    weixinUserInfo: {},
    canIUse: app.canIUse,
    isCancelBindMobile: false,
    isLogin: isHasLogin(),
    hasBindMobile:false,
    formids: []
  },
  ready() {
    this.showLoadingToastTimes = 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // public function: 检查登录状态, 在Page中放在onShow生命周期中
    async checkRole () {
      let isLogin = isHasLogin()
      this.setData({
        isLogin,
        isCancelBindMobile: false
      })
      // token设置缓存时效,小程序进入后台时5分钟，微信会主动销毁小程序，则之后点击会是冷启动，这时需要判断token的时效
      let userInfo = await this.codeExchangeUserInfo()
      
      // 未登录时用户信息为空
      if (!userInfo && !isLogin) {
        this.setMobileDisplayStatus(userInfo)
        return false
      }
      if (!isLogin) {
        // 登录toast只显示一次
        if (this.showLoadingToastTimes < 1) {
          showLoading('登录中...')
          this.showLoadingToastTimes++
        }
        wx.getSetting({
          success: res => {
            let isUserClickLoginOut = wx.getStorageSync('isUserClickLoginOut')
            if (userInfo && res.authSetting['scope.userInfo'] && !isUserClickLoginOut) {
              wx.setStorageSync('isUserClickLoginOut', false)
              this.wechatLogin(this.setUserInfo.bind(this))
            } else {
              this.setMobileDisplayStatus(userInfo)
            }
          },
          fail: e => {
            console.log('fail getSetting', e)
            this.setMobileDisplayStatus(userInfo)
          }
        })
      } else {
        this.setAuthSuccess()
      }
    },
    setMobileDisplayStatus(userInfo) {
      let mobile = null
      let phoneExp = new RegExp(/^1[3-9]\d{9}$/)
      let isHasMobile = userInfo && phoneExp.test(userInfo.mobile)
      if (isHasMobile) {
        this.hasBindMobile=true;
        mobile = userInfo.mobile
        mobile = mobile ? mobile.slice(0, 3) + '****' + mobile.slice(7) : ''
      } else {
        this.hasBindMobile=false;
        mobile = '';
      }
      this.setAuthFail({ mobile })
    },
    // pulibc function，触发登录成功的回调
    signInSuccessCallback() {
      if (!isHasLogin()) {
        this.showAuthBox()
      } else {
        this.signInCallback()
      }
    },
    // public function, 提供给page调用，触发是否已经授权登录
    async showAuthBox () {
      showLoading('登录中...')
      let userInfo = await this.codeExchangeUserInfo()
      this.setMobileDisplayStatus(userInfo)
    },
    signInCallback() {
      //触发回调, 执行次数由page来控制
      this.triggerEvent("cancelEvent", app.globalData.userInfo)
    },
    setAuthFail(extendsData = {}) {
      let data = {
        isLogin: isHasLogin(),
        initHide: false,
        showBindMobile: false,
        isCancelBindMobile: false
      }
      data = {
        ...data,
        ...extendsData
      }
      this.setData(data)
      wx.hideLoading()
    },
    setAuthSuccess() {
      this.setData({
        isLogin: true,
        initHide: true
      })
      this.signInCallback()
    },
    // 用code换取用户信息
    async codeExchangeUserInfo () {
      // 登录获取用户信息换取token
      try {
        let { code } = await app.wechat.login()
        if (!code) {
          throw new Error('无法获取code，登录失败!')
        }
        let { appId } = app.globalData
        if (!appId) {
          throw new Error('appId丢失!') 
        }
        let { data: userInfo } = await getUserInfoByCode({ code, appId })
           // 判断会员等级是否有变化，有则更新
           const { memberCardCode } = userInfo
           const tempUserInfo = wx.getStorageSync('userInfo');
           if (tempUserInfo && tempUserInfo.memberCardCode !== memberCardCode) {
             tempUserInfo.memberCardCode = memberCardCode
             wx.setStorageSync('userInfo', tempUserInfo)
           }

        return userInfo
      } catch(e) {
        // 非超时错误时，大数情况是未登录
        if (e !== 'request:fail timeout') {
          this.setAuthFail({
            notSubscribed: true
          })
        }
      }
    },
    /**
     * 登录
     * @param {Function} callback 
     * @param {Object} data : { encryptedData, iv, loginType: 1:直接登录 2:换个帐号登录 3:授权手机登录 }
     */
    async wechatLogin (callback, data = {}) {
      // 登录获取用户信息换取token
      try {
        let code = null
        // 在未关注的流程中，保证只获取一次code，所以在getUserInfo的时候拿code，之后绑定手机时不需要再次获取code
        if (!data.code) {
          let loginResult = await app.wechat.login()
          code = loginResult.code
        } else {
          code = data.code
        }

        if (!code) {
          throw new Error('无法获取code，登录失败!')
        }

        let { loginType } = data
        let loginTypeForMobile = [2, 3]

        data.code = code
        
        if (loginTypeForMobile.indexOf(loginType) > -1) {
          this.getToken(callback, data)
        } else {
          // 直接登录
          let result = await app.wechat.getUserInfo()
          let { encryptedData, iv } = result
          data = {
            ...data,
            iv,
            encryptedData,
            loginType: 1,
            withCredentials: true
          }
          this.getToken(callback, data)
        }
      } catch(e) {
        this.setAuthFail()
        catchLoading(e, 3000)
      }
    },
    async getToken(callback, data) {
      try {
        const inviteCode = wx.getStorageSync('inviteCode')
        // 获取token
        let { 
            code, encryptedData, iv, phone, 
            validCode, loginType, withCredentials, 
            mobileIv, mobileEncryptedData
        } = data
        let params = {
          iv,
          code,
          loginType,
          validCode,
          mobileIv,
          mobile: phone,
          encryptedData,
          mobileEncryptedData,
          withCredentials,
          platform: 'NEW_MINI',
          appId: app.globalData.appId,
          deviceModel:app.globalData.deviceModel,
          promotionCode: inviteCode
        }
         // 判断是否为全新用户，保存标识
         if (this.hasBindMobile === false) { this.needReport = true }
         if(this.hasBindMobile === false && app.globalData.sid){
          params.traceId = app.globalData.sid
        }

        let { data: token } = await signUp(params)
        this.setTokenToStorage(token)
        app.getUserInfoDetail(userInfo => {
          callback && callback(userInfo)
          app.globalData.signUpCbs.forEach(fn => { // 登录成功触发
            fn(userInfo)
            this.sendFormid()
          });
        })

      } catch (e) {
        console.log(e)
        this.setAuthFail()
        catchLoading(e, 5000)
      }
    },
    setTokenToStorage(token) {
      let date = new Date()
      wx.setStorageSync('token', token)
      wx.setStorageSync('token_expire', date.getTime() )
      app.globalData.token = token;
    },
    async notSubscribedGetUserInfo(e) {
      if (e.detail.errMsg === "getUserInfo:ok") { 
        showLoading('登录中...')
        let loginResult = await app.wechat.login()
        // 获取用户信息
        let { encryptedData, iv } = e.detail
        this.willLoginParams = {
          iv,
          // 直接登录
          loginType: 1,
          encryptedData,
          withCredentials: true,
          code: loginResult.code
        }
        this.setData({
          notSubscribed: true,
          showBindMobile: true
        })
        wx.hideLoading()
      } else {
        this.setAuthFail()
        catchLoading('登录失败!')
      }
    },
    async bindGetUserInfo(e) {
      try {
        if (e.detail.errMsg === "getUserInfo:ok") {
          showLoading('登录中...')
          let { code } = await app.wechat.login()
          // 获取用户信息
          let { encryptedData, iv } = e.detail
          let params = {
            iv,
            code,
            // 直接登录
            loginType: 1,
            encryptedData,
            withCredentials: true
          }
          
          // 在获取token后执行回调，解决tablist中页面的加载数据的问题
          this.wechatLogin(this.loginSuccess.bind(this), params)
        } else {
          this.setAuthFail()
          catchLoading('登录失败!')
        }
      } catch(e) {
        console.log('bindGetUserInfo',e)
        this.setAuthFail()
        catchLoading(e)
      }
    },
    async bindGetPhoneNumber(e) {
      try {
        if (e.detail.errMsg === "getPhoneNumber:ok") {
          showLoading('绑定中...')
          let { code } = await app.wechat.login()
          // 获取用户信息
          let { encryptedData, iv } = e.detail

          let params = {
            code,
            mobileIv: iv,
            mobileEncryptedData: encryptedData,
            loginType: 3,
          }

          if (this.data.notSubscribed) {
            let { iv, encryptedData, withCredentials, code } = this.willLoginParams 
            params = {
              ...params,
              iv,
              code,
              encryptedData,
              withCredentials
            }
          }
          
          this.wechatLogin(this.loginSuccess.bind(this), params)
        } else {
          if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {
            this.setData({
              isCancelBindMobile: true
            })
          } else {
            this.setAuthFail()
          }
          catchLoading('绑定失败!')
        }
      } catch(e) {
        console.log('bindGetPhoneNumber', e)
        this.setAuthFail()
        catchLoading(e)
      }
    },
    loginByMobile() {
      let { phone, code: validCode } = this.data
      if (!validator(phone, 'phone')) {
        return false
      }
      if (validCode.length < 3) {
        wx.showToast({
          icon: 'none',
          title: '请输入验证码'
        })
        return false
      }
      
      let params = {
        phone,
        validCode,
        loginType: 2
      }

      if (this.data.notSubscribed) {
        let { iv, encryptedData, withCredentials, code } = this.willLoginParams 
        params = {
          ...params,
          iv,
          code,
          encryptedData,
          withCredentials
        }
      }

      showLoading('登录中...')
      this.wechatLogin(this.loginSuccess.bind(this), params)
    },
    loginSuccess(userInfo) {
      this.setUserInfo(userInfo)
      wx.showToast({
        icon: 'success',
        title: '登录成功!'
      })
    },
    changeAccountLogin() {
      this.setData({
        isCancelBindMobile: true
      })
    },
    updateMobile(params) {
      request.put('platform/user/user-info-wechat-mobile', params)
      .then((e)=>{
        this.bingPhoneSuccess(e)
      })
      .catch(e => {
        this.setAuthFail()
        catchLoading(e.errorDetail + ',绑定失败!', 5000)
      })
    },
    setUserInfo(userInfo) {
      // 更新数据
      if (!userInfo.mobile && this.data.bindMobile){
        // 用户没有绑定电话时，绑定电话modal
        wx.hideLoading()
        this.setData({
          mobile: '',
          initHide: false
        })
      }else{
        this.setAuthSuccess()
      }
    },
    changeInput(e) {
      let key = e.currentTarget.dataset.name
      let value = e.detail.value
      this.setData({[key]: value})
    },
    getCode() {
      // 获取验证码
      let phone = this.data.phone
      let overTime = this.data.overTime
      let that = this
      if(validator(phone, 'phone') && (overTime == 60)){
        that.setData({
          overTime: this.data.overTime - 1
        })
        let setTime = setInterval(()=>{
          let overTime = that.data.overTime
          if(overTime > 0){
            that.setData({
              overTime: overTime - 1
            })
          }else{
            clearInterval(setTime)
            that.setData({
              overTime: 60
            })
          }
        },1000)
        request.post('/platform/auth/auth-code/send',{
          mobile: phone
        }).then((e)=>{
          if(e.success){
            wx.showToast({
              icon: 'success',
              title: e.data,
              duration: 3000
            })
          }
        })
      }
    },
    bingPhoneAntCode(e){
      let {phone, code} = this.data
      if(validator(phone, 'phone') && (code.length > 3)){
        request.put('/platform/user/user-info-mobile',{
          mobile: phone,
          code
        }).then((e)=>{
          this.bingPhoneSuccess(e)
        }).catch(e => {
          catchLoading(e, 5000)
        })
      }
    },
    bingPhoneSuccess: function(e){
      wx.hideLoading()
      if(e.success && e.data){
        // 修改token
        app.getUserInfoDetail(this.setUserInfo.bind(this))
        wx.showToast({
          icon: 'success',
          title: '绑定成功!'
        })
      }else{

      }
    },
    stopWxBind: function(){
      this.setData({
        isCancelBindMobile: true
      })
    },
    bindPhoneCancal: function(){
      this.setData({
        isCancelBindMobile: false
      })
    },
    stopTouchMove() {
      return false
    },
    cancelLogin() {
      let { isCanCancel } = this.data
      if (isCanCancel) {
        this.setData({
          initHide: true
        })
        this.signInCallback()
      }
    },
    // 上报formid
    sendFormid(){
      const { formids } = this.data
      formids.forEach(item => {
        reportFormid({
          formId:item,
          type:1,
        })
      })
    },
    // 登陆手机formid
    formSubmit(e){
      const formId = e.detail.formId
      let { formids } = this.data
      if (Array.isArray(formids)) formids.push(formId)
      else formids = [ formId ]
      this.setData({formids})
    },
    // 不登录
    noSign() {
      wx.navigateBack({
        fail(){
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  }
})
