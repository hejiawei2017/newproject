import { shareMenuArray } from '../../config/config'
import localsIm from "../../utils/imMuster";
import { getImgPath } from '../../config/config';
import { dataFormat } from '../../utils/util';
let App = getApp()
let messageTime
let messageTimeNum = 5
Component({
  properties: {
    noAttached:{
      type: Boolean,
      value: true
    },
    landlordName:{
      type: String,
      value: ''
    },
    lastMessageTimeTxt:{
      type: String,
      value: ''
    },
    avatarUrl:{
      type: String,
      value: ''
    },
    lastMessage:{
      type: String,
      value: ''
    },
    groupId:{
      type: String,
      value: ''
    },
    assistId:{
      type: String,
      value: ''
    },
    houseSourceId:{
      type: String,
      value: ''
    },
    bookingId:{
      type: String,
      value: ''
    },
    sessionId:{
      type: String,
      value: ''
    },
    landlordHeadUrl:{
      type: String,
      value: ''
    },
    animationData:{
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    imLink (e){
      let {groupid, assistid, housesourceid, bookingid, sessionid, landlordheadurl} = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/im/content/content?groupId=${groupid}&assistId=${assistid}&houseSourceId=${housesourceid}&bookingId=${bookingid}&sessionId=${sessionid}&landlordHeadUrl=${landlordheadurl}`
      })
    },
    // 此函数可作为全部页面的入口
    imLogin (){
      var pages = getCurrentPages()
      var currentPage = pages[pages.length-1]
      var url = currentPage.route
      // 不在此数组则不隐藏转发按钮
      if (shareMenuArray.indexOf(url) === -1) {
        // 禁止转发
        wx.hideShareMenu()
      }

      if(App.globalData.userInfo.id){
        localsIm.init()
        .then(localsIm.login)
        .then(()=>{
          localsIm.onMsgReceive((res)=>{
            try {            
              // 使im列表页面进入时刷新
              App.globalData.isReloadConversations = true 
              let messages = res.messages[res.messages.length - 1]
              // let message = messages.custom_notification.alert
              let {msg_body, create_time} = messages.content
              let {assistantId, groupId, houseSourceId, bookingId, sessionId, landlordHeadUrl, landlordName} = msg_body.extras
              this.setData({
                lastMessage: msg_body.text,
                groupId,
                assistId: assistantId,
                houseSourceId,
                bookingId,
                sessionId,
                landlordName,
                landlordHeadUrl,
                avatarUrl: getImgPath(landlordHeadUrl),
                lastMessageTimeTxt: `${dataFormat(create_time, 'hh:mm')}`
              })
              this.showBox()
              this.setUnreadCount()
            } catch (error) {
              console.log('err', error)
            }
          })
        })
        if(App.globalData.unreadNum === null){
          this.setUnreadCount()
        }
      }
    },
    setUnreadCount() {
      localsIm.getMessageTotalUnread()
        .then( res =>{
          if (res && res.data) {
            App.globalData.unreadNum = res.data
            wx.setTabBarBadge({index:1,text: App.globalData.unreadNum.toString()})
          } else {
            App.globalData.unreadNum = 0
          }
        })
    },
    showBox (){
      let that = this;
      that.setData({
        value: true
      })
      let animation = wx.createAnimation({
        duration: 400,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
        that.fadeIn();//调用显示动画
        messageTimeNum = 5
        messageTime && clearInterval(messageTime)
        messageTime = setInterval(()=>{
          if(messageTimeNum == 0){
            that.hideBox()
            messageTime && clearInterval(messageTime)
          }else{
            messageTimeNum--;
          }
        },1000)
      }, 100)
    },
    hideBox (){
      var that = this;
      var animation = wx.createAnimation({
        duration: 400,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown();//调用隐藏动画
    },
    fadeIn (){
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },
    fadeDown (){
      this.animation.translateY(-100).step()
      this.setData({
        animationData: this.animation.export()
      })
    },
    move(){

    },
    bindscrolltolower(e){
      messageTime && clearInterval(messageTime)
      this.hideBox()
    }
  },
  attached(){
    if(this.data.noAttached){
      this.imLogin()
    }
  }
})
