const {
  showLoading,
  catchLoading,
  validator,
  gioTrack
} = require('../../../utils/util')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

const {
  sendCodeEmail,
  checkCodeEmail,
  createVip,
  sendCoupon
} = require('../../../server/business-trip')

const { env } = require('../../../config/env-config')

/**
 * 验证错误信息
 */
const validateObj = {
  name: '姓名不能为空',
  companyName: '企业不能为空',
  email: '邮箱不能为空',
  emailFormat: '邮箱格式不正确',
  code: '验证码不能为空'
}

let codeBtnTimer = null // 验证码倒计时

Page({
  data: {
    name: '', // 姓名
    companyName: '', // 企业
    email: '', // 邮箱
    code: '', // 验证码

    dialogVisible: false, // 弹出框展示标志位
    dialogType: 0, // 弹框类型
    dialogTypes: {
      // 弹框类型基础数据
      0: 'success',
      1: 'toast-success',
      2: 'toast-fail'
    },

    codeBtnClicked: false, // 验证码按钮是否点击标志位
    codeBtnWaitTime: 0 // 验证码等待时间
  },

  onLoad() {
    wx.hideShareMenu() // 当前页面不能分享
  },

  /**
   * input 数据变化，劫持绑定到data上
   * @param {*} e 事件
   */
  inputChange: function(e) {
    const target = e.target.dataset.key
    const value = e.detail.value
    const obj = {}
    obj[target] = value
    this.setData(obj)
  },

  /**
   * 跳转vip页
   */
  routeToVIP: function() {
    wx.redirectTo({
      url: '/pages/business-trip/vip/index'
    })
  },

  /**
   * 跳转查看权益
   */
  routeToBusinessIndex: function() {
    wx.redirectTo({
      url: '/pages/business-trip/index/index'
    })
  },

  /**
   * 关闭dialog
   */
  closeDialog: function() {
    this.setData({
      dialogVisible: false
    })
  },

  /**
   * 发送验证码
   */
  sendEmailCode: function() {
    if (this.codeBtnClicked) return

    if (!this.data.email) {
      this.toastMsg('email')
      return
    }
    if (!validator(this.data.email, 'email')) {
      this.toastMsg('emailFormat')
      return
    }

    this.setData({
      codeBtnClicked: true
    })

    showLoading()

    sendCodeEmail({
      account: this.data.email
    })
      .then(res => {
        if (res.success) {
          this.codeBtnToWait()
          wx.showToast({
            icon: 'none',
            title: '验证码已发送'
          })
        } else {
          this.setData({
            codeBtnClicked: false
          })
        }
      })
      .catch(e => {
        catchLoading(e)
        this.setData({
          codeBtnClicked: false
        })
      })
    wx.hideLoading()
  },

  /**
   * 倒计时
   */
  codeBtnToWait() {
    this.setData({
      codeBtnWaitTime: 80
    })

    codeBtnTimer = setInterval(() => {
      const timeNow = this.data.codeBtnWaitTime - 1
      this.setData({
        codeBtnWaitTime: timeNow
      })
    }, 1000)

    setTimeout(() => {
      this.setData({
        codeBtnClicked: false
      })
      clearInterval(codeBtnTimer)
    }, 80000)
  },

  /**
   * 弹出toas，提示验证错误信息
   * @param {*} key 验证的key
   * @param {*} str 展示的字符串
   */
  toastMsg: function(key, str) {
    if (!key && !str) return
    wx.showToast({
      icon: 'none',
      title: validateObj[key] || str
    })
  },

  /**
   * 提交表单
   */
  confirmSubmit: async function() {
    const keys = ['name', 'companyName', 'email', 'code']
    for (let i = 0; i < keys.length; ++i) {
      if (!this.data[keys[i]]) {
        this.toastMsg(keys[i])
        return
      }
    }

    if (!validator(this.data.email, 'email')) {
      this.toastMsg('emailFormat')
      return
    }

    const codeCorrect = await this.codeConfirm() // 验证验证码准确性

    if (codeCorrect) {
      const userId = wx.getStorageSync('userInfo').id

      try {
        // 创建vip
        const resCreateVip = await createVip({
          userId,
          companyEmail: this.data.email,
          companyName: this.data.companyName
        })

        if (resCreateVip.success) {
          // 成功
          gioTrack('biz_trip_verify_success')

          const mobile = wx.getStorageSync('userInfo').mobile

          // 成功即发券， prod： 6A2F05B4F， dev：53E01518F
          const code = env === 'prod' ? '6A2F05B4F' : '53E01518F'
          const resCoupon = await sendCoupon({
            couponCode: code,
            mobile: mobile,
            quantity: 1
          })

          if (resCoupon.success) {
            gioTrack('biz_trip_send_coupon')
            this.setData({
              dialogVisible: true
            })
            // this.toastMsg('success', '验证成功，卷已经成功发放')
          } else {
            this.toastMsg('success', '验证成功，但是卷发放失败')
          }
          return
        }

        this.toastMsg('fail', resCreateVip.errorMsg)
      } catch (e) {
        // 失败
        this.toastMsg('fail', e.errorMsg || '认证失败')
      }
    }
  },

  /**
   * 验证码校验
   */
  codeConfirm: async function() {
    try {
      const res = await checkCodeEmail({
        account: this.data.email,
        authCode: this.data.code
      })
      if (res.success) {
        return true
      } else {
        catchLoading(res.errorMsg)
        return false
      }
    } catch (e) {
      catchLoading(e)
    }

    return false
  },

  catchEvent: function() {
    return false
  }
})
