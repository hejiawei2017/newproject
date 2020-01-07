Page({
    data: {
        token: null
    },
    onLoad() {
        let token = wx.getStorageSync('token')
        this.setData({
            token
        })
    }
})