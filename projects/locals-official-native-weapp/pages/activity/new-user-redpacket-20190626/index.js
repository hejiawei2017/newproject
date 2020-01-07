const request = require('../../../utils/request')
const { validator, shareDataFormat } = require('../../../utils/util')
const { joinShare, statisticsEvent } = require('../../../server/hd')
// const BASE_API = 'http://127.0.0.1:7001/api/';
const BASE_API = 'https://i.localhome.cn/api/'
// const BASE_API = 'http://tp.localhome.cn:9999/api/';
const DEFAULT_OVERTIME = 60
const app = getApp()
let t = 0

const ACTIVITY_NAME = 'new-user-redpacket'

Page({
    data: {
        overTime: DEFAULT_OVERTIME,
        modalHidden: true,
        phone: '',
        code: '',
        channel: null,
        failModalHidden: true
    },
    goHomePage() {
        //返回到首页
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    newuserCloseModel: function() {
        this.setData({ modalHidden: true })
    },
    onLoad: function(options) {
        wx.redirectTo({ // 重定向，使用h5页面
            url: '/pages/h5/index?url=https%3A%2F%2Fi.localhome.cn%2Fv%2F1908171819953%2F%23%2F%3Fchannel%3Dmini_red_packet_act'
        })
        let { channel } = options
        // 记录渠道号
        channel && this.setData({ channel: channel })
        const userInfo = app.globalData.userInfo
        if (userInfo && userInfo.isNew === false) {
            this.setData({ failModalHidden: false })
        }
    },
    onShow() {
        // this.selectComponent("#auth-drawer-box").checkRole()
        wx.pageScrollTo({ scrollTop: 500 })
    },
    signInCallback() {
        const channel = wx.getStorageSync('from_channel')
        if (channel) {
            joinShare({
                ticket_id: ACTIVITY_NAME,
                share_user_id: channel
            })
        }
        console.log('调用回调')
        // 授权登录成功后进行劵
        this.getCoupon()
    },
    /**
     * 重置定时器
     *
     */
    resetTiming() {
        clearInterval(t)
        this.setData({
            overTime: DEFAULT_OVERTIME
        })
    },
    /**
     * 输入框事件
     *
     * @param {*} e
     */
    changeInput(e) {
        let key = e.currentTarget.dataset.name
        let value = e.detail.value
        this.setData({ [key]: value })
    },
    signIn() {
        return this.selectComponent('#auth-drawer-box').checkRole()
    },
    /**
     * 获取验证码失败
     *
     */
    getCodeFail() {
        wx.showModal({
            title: '',
            content: '获取验证码失败， 请稍后再试',
            showCancel: false
        })
        this.resetTiming()
    },
    /**
     * 获取验证码
     *
     * @returns
     */
    getCode() {
        const { phone, overTime } = this.data
        if (!validator(phone, 'phone')) {
            return
        }
        if (overTime != DEFAULT_OVERTIME) {
            return
        }
        this.setData({ overTime: overTime - 1 })
        t = setInterval(() => {
            let { overTime } = this.data
            if (overTime <= 0) {
                this.resetTiming()
                return
            }
            this.setData({ overTime: overTime - 1 })
        }, 999)

        request
            .post('/platform/auth/auth-code/send', {
                mobile: phone
            })
            .then((e) => {
                if (!e.success) {
                    this.getCodeFail()
                    return
                }
                wx.showToast({
                    icon: 'success',
                    title: e.data
                })
            })
            .catch(() => {
                this.getCodeFail()
            })
    },
    onUnload: function() {
        this.resetTiming()
    },
    getCoupon() {
        const params = {
            phone: app.globalData.userInfo.mobile,
            userInfo: JSON.stringify(app.globalData.userInfo),
            traceId: app.globalData.sid,
            activity_id: '1902220547571'
        }
        request
            .post(`${BASE_API}new_use_redpacket/index`, params)
            .then((res) => {
                this.setData({ modalHidden: false })
                statisticsEvent({
                    event: 'attend',
                    share_user: wx.getStorageSync('from_channel'),
                    activity_name: ACTIVITY_NAME
                })
            })
            .catch((e = {}) => {
                if (e.errorMsg && e.errorMsg.indexOf('已存在')) {
                    this.setData({ failModalHidden: false })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: e.errorMsg || e.errorDetail || '服务器繁忙'
                    })
                }
            })
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return shareDataFormat({
            title: '新人红包 100 元，首单立减', // 分享标题
            desc: '覆盖全球 65+ 城市，超 15000+ 套个性民宿', // 分享描述
            path: '/pages/activity/new-user-redpacket-20190626/index' // 分享路径
        })
    }
})
