const app = getApp();
const { formatTime2, showLoading, catchLoading } = require('../../utils/util.js')
const uploadImage = require('../../libs/aliyunOss/uploadAliyun')
const { putUserDetail } = require('../../server/mine')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')

Page({
  data:{//按照页面的顺序
    defaultAvatar: app.globalData.defaultAvatar,
    nickName: '',
    realName: '',
    idCard: '',
    email: '',
    birthday: '',
    mobile: '',
    avatar: ''
  },
  onShow() {
    this.init()
    this.selectComponent("#im-message").imLogin()
  },
  async init() {
    try {
      showLoading()
      app.getUserInfoDetail(userInfo => {
        if (userInfo) {
          let { mobile, idCard } = userInfo
          let phoneExp = new RegExp(/^1[3-9]\d{9}$/)

          if (phoneExp.test(mobile)) {
            mobile = mobile.substr(0,3) 
                  + '****' 
                  + mobile.slice(-4, mobile.length)
          } else {
            mobile = ''
          }

          idCard = idCard ? idCard.substr(0, 14) + '****' : null

          this.setData({
            mobile,
            idCard,
            avatar: userInfo.avatar,
            nickName: userInfo.nickName,
            realName: userInfo.realName,
            birthday: userInfo.birthday ? formatTime2(new Date(userInfo.birthday)) : '',
            email: userInfo.email,
          })
        }
        wx.hideLoading()
      })
    } catch(e) {
      catchLoading(e)
    }
  },
  tojump(e) {
    let type = e.currentTarget.dataset.type;
    switch(type) {
      case 'idCard':
        let url = './change/index?type=' + type
        // 已经设置了身份证，进入不能修改身份证
        if (this.data.idCard) {
          url += '&connotUpdate=1'
        }
        wx.navigateTo({
          url
        })
        return
      case 'mobile':
        wx.navigateTo({
          url: './change/index?type=' + type
        })
        return
    }
    wx.navigateTo({
      url: './change/index?type=' + type
    })
  },
  loginOut() {
    wx.showModal({
      title: '退出登录',
      content: '请确认是否退出登录?',
      cancelText: '否',
      confirmText: '是',
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.isAuthentication = false
          wx.setStorageSync('isUserClickLoginOut', true)
          wx.reLaunch({
            url: '/pages/mine/mine'
          })
        }
      }
    })
  },
  modifyUserInfoInStorage({key , value}) {
    if (key && value) {
      let userInfo = wx.getStorageSync('userInfo')
      userInfo[key] = value
      wx.setStorageSync('userInfo', userInfo)
    }
  },
  chooseImage() {
    wx.chooseImage({
      success: res => {
        const tempFilePaths = res.tempFilePaths
        showLoading('上传中...')
        uploadImage({
          filePath: tempFilePaths[0],
          dir: "",
          success: async res => {
            let { aliyunServerURL, aliyunFileKey } = res
            let newAvatar = aliyunServerURL + '/' + aliyunFileKey
            
            try {
              let { id } = wx.getStorageSync('userInfo')
              let params = {
                platformUser: {
                  id,
                  avatar: newAvatar
                }
              }
              showLoading('上传中...')
              let result = await putUserDetail(params)
              if (result.success) {
                  this.modifyUserInfoInStorage({
                    key: 'avatar',
                    value: newAvatar
                  })
                  this.setData({
                    avatar: newAvatar
                  })
                  wx.showToast({
                    title: '成功修改头像~'
                  })
              } else {
                wx.showToast({
                  icon: 'error',
                  title: '成功失败'
                })
              }
            } catch(e) {
              catchLoading(e)
            }
          },
          fail: function (res) {
            catchLoading("上传失败")
          }
        })
      }
    })
  },
  binderror() {
    this.setData({
      avatar: ''
    })
  }
})