import orderServer from '../../../server/order'
import { getImgPath } from '../../../config/config';
const { showLoading,catchLoading } = require('../../../utils/util');
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    from: true,
    pageNum: 1,
    pageSize: 20,
    listData: [],
    bookingId: '',
    bookingInfo:{},
    comment: '',
    StarNumArr: [1,2,3,4,5],
    descriptionStar: 5,
    communicationStar: 5,
    cleanIndexStar: 5,
    locationIndexStar: 5,
    checkInStar: 5,
    costPerformanceStar: 5,
    
  },
  onLoad(options) {
    this.setData({
      bookingId: options.bookingId
    })
  },
  onShow() {
    this.selectComponent("#auth-drawer-box").checkRole()
    this.selectComponent("#im-message").imLogin()
  },
  signInCallback() {
    showLoading()
    this.getOrderInfo()
  },
  changeStar(e){
    let {val, name} = e.currentTarget.dataset
    this.setData({
      [name]: val
    })
  },
  changeInput(e){
    let {index} = e.currentTarget.dataset
    let value = e.detail.value
    this.setData({
      [index]: value
    })
  },
  getOrderInfo(){
    orderServer.getOrderDetail(this.data.bookingId).then((e)=>{
      this.setData({
        bookingInfo: {
          ...e.data,
          imgPath: getImgPath(e.data.imgPath)
        }
      })
      wx.hideLoading()
    }).catch((e)=>{
      catchLoading(e)
    })
  },
  commitData(){
    let {
      bookingInfo,
      bookingId,
      comment,
      descriptionStar,
      communicationStar,
      cleanIndexStar,
      locationIndexStar,
      checkInStar,
      costPerformanceStar,
    } = this.data
    comment = comment.trim()
    if (!comment) {
      wx.showToast({
        icon: 'none',
        title: '请输入评论'
      })
      return false
    }
    let params = {
      houseSourceId: bookingInfo.houseSourceId,  //	房源ID	N	
      bookingId,  //	订单id	N	
      memberId: bookingInfo.memberId,  //	房东id	N	
      memberName: app.globalData.userInfo.nickName,  //	评论人姓名	N	
      comment: comment,  //	评论内容	Y	
      descriptionMatch: descriptionStar,  //	描述相符星级	Y	
      communication: communicationStar,  //	沟通交流星级	Y	
      clean: cleanIndexStar,  //	干净指数星级	Y	
      locationConvenient: locationIndexStar,  //	位置便利星级	Y	
      checkin: checkInStar,  //	办理入住星级	Y	
      priceRatio: costPerformanceStar,  //	性价比星级	Y	
    }
    showLoading('评论中...')
    orderServer.comment(params)
      .then((e)=>{
        orderServer.putCommentStatus(bookingId)
          .then(() => {
            wx.showToast({
              icon: 'success',
              title: '评论成功!'
            })
            // 修改行程列表的评论状态
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            if (prevPage) {
              let { completedList } = prevPage.data
              completedList.some(item => {
                if (item.bookingId === bookingId) {
                  item.canComment = false
                }
              })
              prevPage.setData({
                completedList
              })
            }
            // 跳转评论成功页面
            setTimeout(() => {
              wx.redirectTo({ url: './success' })
            }, 400)
          })
          .catch((e)=>{
            catchLoading(e)
          })
      }).catch((e)=>{
        catchLoading(e)
      })
  }
})
