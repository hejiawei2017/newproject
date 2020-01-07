const { formatTime2, validator, showLoading, catchLoading } = require('../../../utils/util.js')
const { putUserDetail, sendAuthCode, updateMobile } = require('../../../server/mine')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 能否修改/保存
    connotUpdate: false,
    originMobile: null,
    isSaveing: false,
    code: null,
    mobile: '',
    email: '',
    realName: '',
    idCard: '',
    birthday: '',
    nickName:'',
    label: '',
    cityName: '',
    weiXinNo: '',
    introduce: '',
    timeVersion: '',
    // 更改[手机|身份证|等]类型的关键字
    key: '',
    input:'',
    endDate: formatTime2(new Date()),
    // 显示内容
    item: null,
    overTime: 60,
    list: [
      {
        key: 'nickName',
        type: 'text',
        msg: '请填写昵称',
        placeholder: '您的昵称'
      }, {
        key: 'realName',
        type: 'text',
        msg: '请填写真实姓名\n以便获得相关会员权益',
        placeholder: '您的真实姓名'
      }, {
        key: 'idCard',
        type: 'text',
        msg: '请填写本人身份证号\n以便获得相关会员权益',
        placeholder: '您的18位身份证号码',
        instr: '填写后不可修改，如有错误请与客服联系'
      }, {
        key: 'birthday',
        type: 'text',
        msg: `请选择您的出生日期\n生日可能会有惊喜哦`,
        placeholder: '您的出生日期',
        instr: 'picker'
      }, {
        key: 'email',
        type: 'text',
        msg: '请填写常用电子邮箱',
        placeholder: '您的电子邮箱'
      }, {
        key: 'mobile',
        type: 'number',
        msg: '请输入新的手机号',
        placeholder: '您的手机号'
      }
    ]
  },
  onShow(){
    this.selectComponent("#im-message").imLogin()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let key = options.type
    let { list } = this.data
    let item = null
    let userInfo = wx.getStorageSync('userInfo')
    // 设置内容信息
    for (let value of list) {
      if (value.key === key) {
        item = value
      }
    }
    this.setData({
      connotUpdate: options.connotUpdate === '1',
      key,
      item,
      userInfo
    })
    this.init()
  },
  init() {
    if(app.globalData.userInfo){
      let { 
        id, realName, idCard, birthday, email, mobile: originMobile,
        nickName, cityName, weiXinNo, introduce, timeVersion,
      } = app.globalData.userInfo
      
      this.setData({
        originMobile,
        id: id,
        realName: realName,
        idCard: idCard,
        birthday: formatTime2(new Date(birthday)),
        email: email,
        nickName: nickName ? nickName.slice(0, 12) : '',
        cityName: cityName,
        weiXinNo: weiXinNo,
        introduce: introduce,
        timeVersion:timeVersion,
        input: this.data.key !== 'mobile' ? app.globalData.userInfo[this.data.key] : ''
      })
    }
  },
  bindInput(e) {
    let { key } = this.data
    this.setData({
      [key]: e.detail.value,
      input: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value,
      input: e.detail.value
    })
  },
  save() {
    showLoading()
    let { key, originMobile, connotUpdate } = this.data
    if (connotUpdate) {
      catchLoading('填写后不可修改，如有错误请与客服联系')
      return false
    }
    if (key === 'mobile') {
      let { code, mobile } = this.data
      if (mobile === originMobile) {
        catchLoading('与原号码一致')
        return false
      }
      if (!mobile || !code) {
        catchLoading('请输入手机号和验证码')
        return false
      }
      if (!validator(mobile, 'phone')) {
        return false
      }
      let params = {
        code,
        mobile
      }
      this.setData({
        isSaveing: true
      })
      updateMobile(params)
        .then(res => {
          let token = res.data
          wx.setStorageSync('token', token)
          this.successToast()
        })
        .catch(e => {
          this.setData({
            isSaveing: false
          })
          catchLoading(e)
        })
    } else {
      let { 
        id, realName, email, nickName, key,
        idCard, birthday, timeVersion 
      } = this.data

      if (key === 'idCard' && !validator(idCard, 'idCard')) {
        return false
      }
      if (!nickName || nickName.length > 12) {
        wx.showToast({
          title: '请输入少于12个字的昵称',
          icon: 'none'
        });
        return false
      }
      // 设置生日
      if (idCard && validator(idCard, 'idCard')) {
        birthday = idCard.substr(6, 8)
        birthday = birthday.slice(0, 4) 
                  + '-' + birthday.slice(4, 6) 
                  + '-' + birthday.slice(6, birthday.length)
      }

      if (key === 'email' && !validator(email, 'email')) {
        return false
      }

      let platformUser = {
        'id': id,
        'idCard': idCard,
        'realName': realName,
        'email': email,
        'nickName': nickName ? nickName.slice(0, 12) : ''
      }
      let platformUserDetail = {
        'id': id,
        'birthday': birthday,
        "timeVersion": timeVersion
      }
      let params = {
        platformUser,
        platformUserDetail
      }
      this.setData({
        isSaveing: true
      })
      putUserDetail(params)
        .then((res) => {
          if (res.success) {
            this.successToast()
          }
        })
        .catch(e => {
          this.setData({
            isSaveing: false
          })
          catchLoading(e)
        })
    }
  },
  successToast() {
    // 重新获取用户信息
    app.getUserInfoDetail(() => {
      wx.hideLoading()
      wx.showToast({
        title: '修改成功~',
        icon: 'none'
      })
      setTimeout(() => {
        this.setData({
          isSaveing: false
        })
        wx.navigateBack()
      }, 1000) 
    })
    
  },
  getCode() {
    showLoading()
    // 获取验证码
    let self = this
    let { mobile, overTime, originMobile } = this.data
    if (mobile === originMobile) {
      catchLoading('与原号码一致')
      return false
    }
    if (!validator(mobile, 'phone')) {
      return false
    }
    if(overTime === 60){
      self.setData({
        overTime: this.data.overTime - 1
      })
      let setTime = setInterval(()=>{
        let overTime = self.data.overTime
        if(overTime > 0){
          self.setData({
            overTime: overTime - 1
          })
        }else{
          clearInterval(setTime)
          self.setData({
            overTime: 60
          })
        }
      },1000)
      sendAuthCode({
        mobile
      })
      .then(res => {
        wx.showToast({
          icon: 'success',
          title: res.data
        })
        wx.hideLoading()
      })
      .catch(e => {
        catchLoading(e)
      })
    }
  },
  updateCode(e) {
    let { value } = e.detail
    this.setData({
      code: value
    })
  }
})