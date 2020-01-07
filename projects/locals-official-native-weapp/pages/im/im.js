// pages/im/im.js
import { getImgPath } from '../../config/config';
import { dataFormat, isHasLogin } from '../../utils/util';
import localsIm from '../../utils/imMuster';
import ImServer from "../../server/im";
import {ImOrderStatus} from "../../utils/dictionary";
const { showLoading, catchLoading } = require('../../utils/util');
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    conversations: null,
    pageNum: 1,
    pageSize: 5,
    total: null,
    hasNextPage: false,
    isLoadingMore: false,
    defaultAvatar: App.globalData.defaultAvatar,
    isLogin:false,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad(){
    getApp().mtj.trackEvent('menu_message');
  },
  onShow: function () {
    this.checkIsLogin()
  },
  // 检查是否已登录
  checkIsLogin() {
    const isLogin = isHasLogin()
    this.setData({ isLogin })
    if(isLogin) {
      this.init()
      let { conversations } = this.data
      let { isReloadConversations } = App.globalData
      if(!conversations || isReloadConversations){
        showLoading()
        this.onloadData()
        // 为 true 时重置
        if (isReloadConversations) {
          App.globalData.isReloadConversations = false
        }
      }
    }
  },
  // 获取token后执行的回调
  _cancelEventFn() {
    this.checkIsLogin()
  },
  init() {
    // 初始化
    localsIm.init()
    .then( localsIm.login )
    .then(() => {
      localsIm.onMsgReceive((res)=>{
        this.imMsgReceive(res)
      })
    })
  },
  onPullDownRefresh() {
    this.onloadData(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    let { pageNum, hasNextPage } = this.data
    
    if (hasNextPage) {
      this.setData({
        isLoadingMore: true,
        pageNum: pageNum + 1
      }, this.getLatestMessage)
    }
  },
  onloadData(callFn){
    this.setData({
      pageNum: 1
    })
    this.getLatestMessage(callFn)
  },
  imMsgReceive(data) {
    // 消息监听处理方法
    let messages = data.messages || []
    let conversations = this.data.conversations
    conversations.forEach( (item, index) => {
      messages.forEach( item2 => {
        if (String(item.groupId) === String(item2.from_gid)) {
          try {
            // 消息位置转换
            item.lastMessage = item2.content.msg_body.text
            if (!item2.isSendMyself) {
              item.unReadCount = (item.unReadCount || 0) + 1
            }
            conversations.splice(index, 1)
            conversations.unshift(item)
          } catch (error) {
            console.log('messages', error)
          }
        }
      })
    })
    this.settMessageTotalUnread()
    this.setData({
      conversations
    })
  },
  updateImUnReadCount({ groupId, unReadCount = 0 }) {
    let { conversations } = this.data
    conversations.forEach(item => {
      if (String(item.groupId) === groupId) {
        item.unReadCount = unReadCount
      }
    })
    this.setData({
      conversations
    })
  },
  updateImOrderStatus({ groupId, orderStatus }) {
    let { conversations } = this.data
    conversations.forEach(item => {
      if (String(item.groupId) === groupId) {
        item.orderStatusTxt = ImOrderStatus[orderStatus]
      }
    })
    this.setData({
      conversations
    })
  },
  settMessageTotalUnread() {
    localsIm.getMessageTotalUnread()
        .then( res =>{
          if (res && res.data) {
            App.globalData.unreadNum = res.data
            wx.setTabBarBadge({
              index:1,
              text: App.globalData.unreadNum.toString()
            })
          } else {
            App.globalData.unreadNum = 0
          }
        })
  },
  getLatestMessage(callFn){
    // 获取locals 会话列表
    let { pageSize, pageNum } = this.data
    
    let params = {
      pageSize,
      pageNum
    }
    
    ImServer.getMessagesList(params)
      .then( res => {
        let { list, total, hasNextPage, defaultAvatar } = res.data
        let dateTime = new Date().getTime()
        let newList = []

        newList = list.map(item => {
          item.avatar = getImgPath(item.assistantHeadUrl || defaultAvatar)
          item.orderStatusTxt = ImOrderStatus[item.orderStatus]
          item.checkInDateTxt = `${dataFormat(item.checkInDate, 'yyyy/MM/dd')} - ${dataFormat(item.checkOutDate, 'yyyy/MM/dd')}`
          
          if(item.lastMessageTime > dateTime - (3600000 * 12)){
            item.lastMessageTimeTxt = `${dataFormat(item.lastMessageTime, 'hh:mm')}`
          }else{
            item.lastMessageTimeTxt = `${dataFormat(item.lastMessageTime, 'MM/dd')}`
          }
          return item
        })

        wx.hideLoading()
        this.setData({
          total,
          hasNextPage,
          isLoadingMore: false,
          conversations: pageNum === 1 ? newList : [ ...this.data.conversations, ...newList]
        })
        callFn && callFn()
      }).catch((e)=>{
        this.setData({
          isLoadingMore: false
        })
        catchLoading(e)
      })
  },
  orderButton(e){
    //  支付按钮
    let {checkindate:checkinDate, checkoutdate: checkoutDate, housesourceid:houseSourceId, bookingid:bookingId, orderstatus:orderStatus} = e.currentTarget.dataset
    if (orderStatus === "1102") {
      wx.navigateTo({
        url: '/pages/trip/detail-v2/index?bookingId=' + bookingId
      })
    }
    if(orderStatus === "1201"){
      wx.navigateTo({
        url: `/pages/order/order-v2/index?bookingId=${bookingId}&houseSourceId=${houseSourceId}&checkinStartDate=${checkinDate}&checkinEndDate=${checkoutDate}`
      })
    }
  },
  imLink (e){
    let {groupid, assistid, housesourceid, bookingid, sessionid, landlordheadurl} = e.currentTarget.dataset
    
    wx.navigateTo({
      url: `./content/content?groupId=${groupid}&assistId=${assistid}&houseSourceId=${housesourceid}&bookingId=${bookingid}&sessionId=${sessionid}&landlordHeadUrl=${landlordheadurl}`
    })
  },
  avatarError(e) {
    let { id } = e.currentTarget.dataset
    let avatar = App.globalData.defaultAvatar
    
    let { conversations } = this.data
    conversations.forEach(item => {
      if (item.id === id) {
        item.avatar = avatar
      }
    })
    this.setData({
      conversations
    })
  },
  goLogin() {
    this.selectComponent('#auth-drawer-box').checkRole()
  }
})