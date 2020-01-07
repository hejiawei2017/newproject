const { getHouseComments, getLandlordComment, getLotelComment } = require('../../../server/housing');
const { showLoading, catchLoading, maskPhone } = require('../../../utils/util')
const app = getApp()
Page({
  data: {
    defaultAvatar: app.globalData.defaultAvatar,
    houseSourceId: '',//房东ID
    memberId: '',
    commentInfoList: [],
    pageNum: 1,
    total: 0,
    isLoading: false,
    isHasNextPage: false,
  },
  onLoad: function (options) {
    getApp().mtj.trackEvent('detail_more_comment');

    this.setData({
      houseSourceId: options.houseSourceId || '',
      stars: options.stars || '',
      memberId: options.memberId || '',
      lotelId: options.lotelId || ''
    })
    
    this.getCommentInfoList();
  },
  onShow: function () {
    this.selectComponent("#im-message").imLogin()
  },
  onReachBottom: function () {
    if (this.data.isHasNextPage) {
      this.setData({
        isLoading: true
      })
      this.getCommentInfoList()
    } else {
      wx.showToast({
        title: '到底了~',
        icon: 'none'
      })
    }
  },
  //获取评论列表
  getCommentInfoList: function() {
    showLoading()
    let params = {
      pageNum: this.data.pageNum
    }
    let { houseSourceId, memberId, lotelId } = this.data

    // 有房源id则是房源评论，否则是房东评论
    if (houseSourceId) {
      params.houseSourceId = houseSourceId
      params.memberIdNot = memberId
      this.getHouseComments(params)
    } else if (memberId) {
      params.toMemberId = memberId
      this.getLandlordComment(params)
    } else if (lotelId) {
      let params = {
        hotelId: lotelId,
        pageNo: this.data.pageNum
      }
      this.getLotelComment(params)
    }
  },
  getLotelComment(params) {
    getLotelComment(params)
      .then(res => {
        let { total, list, avgPoint, hasNextPage } = res.data
        if (this.data.pageNum === 1) {
          this.setData({
            total,
            stars: Math.round(avgPoint * 10) / 10,
            commentInfoList: list
          })
        } else {
          this.setData({
            commentInfoList: this.data.commentInfoList.concat(list)
          })
        }
        this.setData({
          pageNum: this.data.pageNum + 1,
          isHasNextPage: hasNextPage,
          isLoading: false
        })
        wx.hideLoading()
      }).catch((e) => {
        catchLoading(e)
      })  
  },
  getHouseComments(params) {
    getHouseComments(params)
      .then(res => {
        let { total, list, hasNextPage } = res.data
        let newList = list.map(item => {
          if(this.checkIsPhone(item['comment']['memberName'])){
            item['comment']['memberName'] = maskPhone(item['comment']['memberName'])
          }
          return {
            comment: item['comment']['comment'],
            commentDate: item['comment']['createTime'],
            guestName: item['comment']['memberName'],
            guestImgPath: item['comment']['memberImgPath'],
            stars: item['comment']['stars'],
            reply: item['reply']
          }
        })
        this.setData({
          total,
          isLoading: false,
          isHasNextPage: hasNextPage,
          pageNum: this.data.pageNum + 1,
          commentInfoList: this.data.pageNum === 1 ? newList : this.data.commentInfoList.concat(newList)
        })
        wx.hideLoading()
      }).catch((e) => {
        catchLoading(e)
      })
  },
  checkIsPhone(number) {
    const phoneExp = new RegExp(/^1[3-9]\d{9}$/)
    return phoneExp.test(number)
  },
  getLandlordComment(params) {
    getLandlordComment(params)
      .then(res => {
        let { total, list, avgPoint, hasNextPage } = res.data
        if (this.data.pageNum === 1) {
          this.setData({
            total,
            stars: Math.round(avgPoint * 10) / 10,
            commentInfoList: list
          })
        } else {
          this.setData({
            commentInfoList: this.data.commentInfoList.concat(list)
          })
        }
        this.setData({
          pageNum: this.data.pageNum + 1,
          isHasNextPage: hasNextPage,
          isLoading: false
        })
        wx.hideLoading()
      }).catch((e) => {
        catchLoading(e)
      })  
  },
  avatarError(e) {
    let { id } = e.currentTarget.dataset
    let { commentInfoList } = this.data

    for (let i = 0; i < commentInfoList.length; i++) {
      if (commentInfoList[i]['comment']['id'] === id) {
        commentInfoList[i]['comment']['memberImgPath'] = this.data.defaultAvatar
      }
    }

    this.setData({
      commentInfoList
    })
  }
})