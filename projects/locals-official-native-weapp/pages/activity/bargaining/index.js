const players = require('../../../utils/players')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // TODO 数据需要从接口查询
        endTime: new Date('2019-07-01 13:47:59').getTime(),
        startTime: new Date('2019-07-01 14:00:00').getTime(),
        validDuration: 1,
        progress: {
            precent: 60,
            borderRadius: '18rpx',
            barText: {
                min: '0元',
                max: '1000元',
                curr: '500元'
            }
        },
        players: players
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},
    onUnload() {},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    // 分享给好友的文案配置
    onShareAppMessage() {
        // 分享之前跳回首页
        // wx.reLaunch({
        //   url: '/pages/index/index'
        // })
        const { userInfo } = app.globalData
        // 用户点击右上角分享
        return shareDataFormat({
            title: '59元体验路客精品民宿，上万家房源随你选，赶紧来抢',
            path: `/pages/activity/bargaining/index`,
            imageUrl:
                'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/coupon59/WX20190524-092403%402x.png'
        })
    }
})
