// pages/im/im.js
import { getImgPath } from '../../../config/config';
import { dataFormat, shareMenu, gioTrack } from '../../../utils/util';
import { cancelOrder, orderCalculate, newConsulting } from '../../../server/order'
import localsIm from '../../../utils/imMuster'
import ImServer from '../../../server/im'
import { ImOrderStatus, orderStatusDictionary } from "../../../utils/dictionary";
import moment from '../../../utils/dayjs.min.js'
const { showLoading, catchLoading } = require('../../../utils/util');
const { getHouseDetail, getHouseCalendarDetail } = require('../../../server/housing')
const { reportFormid } = require('../../../server/message')
const app = getApp()
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
// TODO: 下拉加载消息传递最后一条消息的id来获取之后20条的消息
// 不分页，基于实际情况，获取所有消息
const defaultPageSize = 999
const changeOrderMomentKey = '__CHANGE_CHAT_ORDER_MOMENT__'

Page({
  doingAnimationId: null,
  // 记录已有的消息id
  listIds: {},
  // 上一页的类
  prevPage: null,
  data: {
    isShowPlan: false,
    pageNum: 1,
    pageSize: defaultPageSize,
    isGettingSessions: false,
    hasNextPage: false,
    scrollWithAnimation: true,
    isScrollY: true,
    isFullScreen: app.globalData.isFullScreen,
    fromWeixinTemplate: app.globalData.fromWeixinTemplate,
    bookingId: '',
    bookingInfo: {},
    imInfo: {
      username: '',
      password: '',
      nickname: '',
      avatar: ''
    },
    conversationList: [],
    txt: '', // 发送文案
    optionTxt: '', // 联系管家跳转发送消息
    sessionId: null,
    groupId: null,
    loginLoad: true, // 是否登录标识
    loadBol: true, // 是否登录标识
    toView: '',
    landlordHeadUrl: '',
    // 是否发送中
    isSending: false,
    extras: {
      conversationType: 'group', // 对话类型
      messageSource: 'booking_Mini_Program', // 信息来源
      platformType: "2", //  保存信息暂无用到改成fromType
      fromType: "2",
      conversationId: '',
      fromUserName: '',
      sendUserAvatar: '',
      houseSourceId: '',
      bookingId: '',
      houseSourceTitle: '',
      messageTypeId: '0',
      groupId: ''
    },
    // 行程计划动画
    planAnimation: null
  },
  onLoad(options) {
    shareMenu('hide')
    // groupId不会在传入需要再动态获取
    let {
      bookingId,
      houseSourceId,
      assistId,
      sessionId,
      groupId = '-1',
      message,
      landlordHeadUrl = ''
    } = options
    showLoading()
    try {
      // 在联系管家时才需要拿bookingId来换，session列表不需要用bookingId来换，减少一次请求
      // 当存在sessionId时，直接获取会话列表
      // groupId 为空 抑或 为-1 时动态获取groupId
      if (sessionId) {
        this.setData({
          bookingId,
          sessionId,
          groupId,
          extras: {
            ...this.data.extras,
            groupId
          }
        })
      } else {
        this.setData({
          bookingId,
          houseSourceId: houseSourceId || '',
          landlordHeadUrl: landlordHeadUrl || '',
          assistId: assistId || '',
          optionTxt: message || '',
          extras: {
            ...this.data.extras,
            bookingId,
            houseSourceId
          }
        })
      }
    } catch (e) {
      catchLoading(e)
    }
  },
  onUnload() {
    localsIm.getMessageTotalUnread()
      .then(res => {
        if (res && res.data) {
          app.globalData.unreadNum = res.data
          wx.setTabBarBadge({
            index: 1,
            text: app.globalData.unreadNum.toString()
          })
        } else {
          app.globalData.unreadNum = 0
        }
      })
  },
  onShow() {
    let pages = getCurrentPages()
    this.prevPage = pages[pages.length - 2]
    this.selectComponent("#auth-drawer-box").checkRole()
  },

  // checkRole 登录组件的回调
  async signUpCallback() {
    try {
      showLoading()
      // 如果是修改时间，判断入住日期和离店日期是否预订单中的日期一致
      // 不一致则需要重新创建订单
      const { bookingInfo } = this.data;
      // 存在订单信息
      if (bookingInfo.bookingId) {
        // 去选了时间
        const beenSelectDate = wx.getStorageSync(changeOrderMomentKey);
        const { beginDate, endDate } = app.globalData.__im_order_date || {};

        // 选中的世界与订单时间不一致
        const beginDateUnlike = beginDate && beginDate !== bookingInfo.checkinDate;
        const endDateUnlike = endDate && endDate !== bookingInfo.checkinDate;

        // 如果选了时间后，并且选择的时间和订单时间不一致, 并且刚刚从选择日期页面回来
        if ((beginDateUnlike || endDateUnlike) && beenSelectDate) {
          // 重新创建订单，并且设置 this.data.bookingId 为新的订单 ID
          try {
            await this.reCreateBooking(beginDate, endDate);
          } catch (e) {
            console.log(e)
            wx.showToast({ title: '修改入住时间失败' });
          }
        }

        app.globalData.__im_order_date = null;
        wx.removeStorage({ key: changeOrderMomentKey })
      }

      await this.imLogin()
      this.willGetConversation()
      this.getBookingData(this.data.bookingId)
      this.setReaded()

      if (localsIm.isLogin()) {
        if (this.data.conversationList.length > 0) {
          wx.hideLoading()
        }
        localsIm.onMsgReceive(res => {
          this.imMsgReceive(res)
        })
      }
    } catch (e) {
      catchLoading(e)
    }
  },

  async reCreateBooking(beginDate, endDate) {
    const { bookingInfo } = this.data;
    const { userInfo } = app.globalData;
    // 房源日历价格
    const { data: houseCalendarDetail } = await getHouseCalendarDetail(
      bookingInfo.houseSourceId,
      {
        checkinDate: moment(beginDate).format('YYYY-MM-DD'),
        checkoutDate: moment(endDate).format('YYYY-MM-DD'),
      });

    // 获取房源价格详情 （总价、服务费）
    const { data: orderCalculateDetail } = await orderCalculate({
      "nightPrices": houseCalendarDetail.nightPrices,
      "clearPrice": houseCalendarDetail.clearPrice || 0,
      "deposit": houseCalendarDetail.deposit || 0,
      "houseSourceId": houseCalendarDetail.houseId,
      "checkinDate": beginDate,
      "checkoutDate": endDate,
      "currency": "CNY"
    });

    console.info(houseCalendarDetail, orderCalculateDetail)
    // 创建新的咨询订单
    let bookingInfoPlus = {
      ...houseCalendarDetail,
      ...orderCalculateDetail,
      houseSourceId: houseCalendarDetail.houseId,
      bookingMemberId: userInfo.id,
      bookingMemberName: userInfo.nickName,
      bookingMemberMobile: userInfo.mobile,
      bookingMemberEmail: userInfo.email,
      checkinDate: beginDate,
      checkoutDate: endDate,
      source: 'MINI_PROGRAM',
      houseTenantNumber: houseCalendarDetail.tenantNumber,
      consultingMessage: this.data.textareaValue || '您好，希望入住您的房源',
      tenantNumber: bookingInfo.tenantNumber,
    }

    const { data: bookingId } = await newConsulting(bookingInfoPlus);
    this.setData({ bookingId });

    const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000))
    let len = 0;
    while(true) {
      await sleep();
      try {
        await this.getImSessionInfo();
        return
      } catch (e) {}
      len++;
      if (len > 7) return;
    }
  },

  setReaded() {
    if (this.prevPage && this.prevPage.route === "pages/im/im") {
      let {
        groupId
      } = this.data
      this.prevPage.updateImUnReadCount({
        groupId
      })
    }
  },

  willGetConversation() {
    let {
      conversationList,
      sessionId,
      groupId
    } = this.data
    // 没有信息时获取
    if (Array.isArray(conversationList) && conversationList.length === 0) {
      if (sessionId && groupId) {
        // 如果groupId等于-1就动态获取groupId
        if (groupId === '-1') {
          ImServer.getDynamicGroupId(sessionId)
            .then(res => {
              let {
                data: groupId
              } = res
              this.setData({
                groupId,
                extras: {
                  ...this.data.extras,
                  groupId
                }
              }, this.getConversation)
            })
            .catch(e => {
              catchLoading(e)
            })
        } else {
          this.getConversation()
        }
      } else {
        this.getImSessionInfo()
          .then(this.getConversation)
          .catch(e => {
            catchLoading(e.errorDetail)
            setTimeout(() => {
              wx.navigateBack()
            }, 800)
          })
      }
    }
  },

  /**
   * 修改入住与退房时间
   */
  onChangeMoment() {
    const { bookingInfo } = this.data; 
    if (Number(bookingInfo.orderStatus) !== 1201 && Number(bookingInfo.orderStatus) !== 1101) {
      // 待预定，待支付状态才可以修改日期
      return;
    }

    wx.setStorage({
      key: changeOrderMomentKey,
      data: '1111',
      success() {
        wx.navigateTo({
          url: '/pages/housing/date-select/date-select?houseId=' + bookingInfo.houseSourceId
        })
      }
    })
    gioTrack('advisory_date')
  },

  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.avatar,
      urls: [e.currentTarget.dataset.avatar],
    })
  },

  imLogin() {
    let that = this
    return new Promise((resolve, reject) => {
      // 初始化
      localsIm.init()
        .then(localsIm.login)
        .then(res => {
          that.setData({
            imInfo: res.data,
            loginLoad: false
          })
          resolve(true)
        })
        .catch(e => {
          reject('登录失败')
          catchLoading(e)
          setTimeout(() => {
            wx.navigateBack()
          }, 800)
        })
    })
  },
  async getBookingData(id, callback = () => {}) {
    // 获取订单详情
    const {
      data
    } = await ImServer.getOrderDetail(id);
    await this.getHouseDetail(data.houseSourceId);
    wx.hideLoading()
    const {
      orderStatus
    } = data;
    const {
      isForeignCity
    } = this.data;
    data['planCheckinDate'] = moment(data['checkinDate']).format('YYYY/MM/DD')
    data['planCheckoutDate'] = moment(data['checkoutDate']).format('YYYY/MM/DD')
    data['planCheckinDateS'] = moment(data['checkinDate']).format('MM-DD')
    data['planCheckoutDateS'] = moment(data['checkoutDate']).format('MM-DD')
    data['nightPrice'] = parseInt(data.roomPrice / (Math.round((data.checkoutDate - data.checkinDate) / 86400000)));
    // 待付款 同意预订 拒绝预订
    const showPlanStatus = ['1102', '1201', '1210']
    // 能够立即支付，咨询、待支付、同意预订
    const canflashPayStatus = ['1101', '1102', '1201'];
    let canflashPay = canflashPayStatus.includes(orderStatus);
    let orderStatusTxt = orderStatusDictionary[orderStatus];
    // 如果是国外房源则必须是房东同意预订时才能下单
    if (isForeignCity) {
      // 当海外房源时，同意预订和待支付时可点击
      canflashPay = orderStatus === '1201' || orderStatus === '1102';
    } else {
      orderStatusTxt = orderStatus === '1101' ? '立即预订' : orderStatusTxt;
    }
    // 待入住 入住中 已完成 已取消
    const showBookingNumberArray = ['1207', '1208', '1104', '1106']

    this.setData({
      canflashPay,
      isShowPlan: showPlanStatus.includes(orderStatus),
      isShowBookingNumber: showBookingNumberArray.includes(orderStatus),
      loadBol: false,
      bookingInfo: {
        ...data,
        orderStatusTxt,
        imgPath: getImgPath(data.imgPath)
      },
      extras: {
        ...this.data.extras,
        houseSourceTitle: data.title
      }
    }, callback)
  },
  async getHouseDetail(houseSourceId) {
    const {
      data = {}
    } = await getHouseDetail(houseSourceId);
    const {
      customTag = [], bizTag = [], houseImages = []
    } = data;
    const allTags = [...customTag, ...bizTag];
    const isForeignCity = allTags.some(item => item.tagName === '海外民宿');
    const houseImage = houseImages[0].imagePath ? houseImages[0].imagePath + '?x-oss-process=image/resize,w_300/quality,Q_100' : '';
    this.setData({
      houseImage,
      isForeignCity,
    })
  },
  /**
   * 根据订单id获取会话信息
   */
  getImSessionInfo() {
    return ImServer.getImOrderInfo(this.data.bookingId)
      .then((res) => {
        let {
          groupId,
          sessionId
        } = res.data
        this.setData({
          groupId,
          sessionId
        })
      })
  },
  /**
   * 在发送或接受消息时触发
   * 当前聊天数量超过分页页数的倍数时改变pageNum
   */
  processPage() {
    let {
      conversationList,
      pageNum
    } = this.data
    let {
      length
    } = conversationList
    // 已有消息数量 - 即将获取的pageNum * 默认分页数量 = 初始化之后的聊天数量
    let difference = length - pageNum * defaultPageSize
    if (difference >= 0) {
      let addend = 0
      if (difference === 0) {
        addend = 1
      } else {
        addend = Math.ceil(difference / defaultPageSize)
      }
      this.setData({
        pageNum: pageNum + addend
      })
    }
  },
  // 在发送信息与接收信息时，记录messageId
  addListIds(id) {
    this.listIds[id] = true
  },
  getConversation() {
    // 获取消息列表
    const {
      landlordHeadUrl,
      sessionId,
      pageNum,
      pageSize
    } = this.data
    let params = {
      pageNum,
      pageSize,
      sessionId
    }
    ImServer.getMeMessagesList(params)
      .then(res => {
        let {
          messages
        } = res.data
        let {
          bookingInfo,
          imInfo,
          conversationList
        } = this.data
        let list = messages.list
        let username = imInfo.username
        let memberId = bookingInfo.memberId
        let newlist = []

        console.info('list', list)
        list.reverse()
        list.forEach((item, index) => {
          // 过滤重复
          // if (conversationList.length > 0) {
          //   if (this.listIds[item.id]) {
          //     return true
          //   }
          // }
          if (index > 0) {
            if (item.createTime - list[index - 1].createTime > (600 * 1000)) {
              item.time = dataFormat(item.createTime, 'hh:mm')
            }
          } else {
            item.time = dataFormat(item.createTime, 'yyyy-MM-dd hh:mm:ss')
          }
          let headUrl = (username && username == item.fromUserId) || memberId == item.fromUserId ? item.headUrl : (landlordHeadUrl || item.headUrl)
          item.avatarUrl = getImgPath(headUrl)
          newlist.push(item)
        })

        // 记录已有的消息id
        // newlist.forEach(v => {
        //   this.listIds[v.id] = true
        // })

        this.setData({
          // 下拉加载禁止滚动
          isScrollY: pageNum === 1,
          hasNextPage: messages.hasNextPage,
          pageNum: pageNum + 1,
          conversationList: [...newlist, ...conversationList]
        }, () => {
          // 滚动最新一条消息
          let lastSession = newlist[newlist.length - 1]
          this.setData({
            scrollWithAnimation: pageNum === 1,
            toView: lastSession ? `session-${lastSession.id}` : '',
            isGettingSessions: false,
            isScrollY: true
          })
        })
        wx.hideLoading()
      })
      .catch(e => {
        console.log(e)
        catchLoading(e.errorDetail || e.errorMsg)
        wx.navigateBack()
      })
  },
  imMsgReceive(data) {
    // 消息监听
    let {
      conversationList,
      bookingId,
      groupId,
      landlordHeadUrl
    } = this.data
    // 临时方案：ctime_ms创建时间当作id
    let {
      messages: messageList
    } = data
    let messageId
    messageList.forEach(item => {
      let from_gid = item.from_gid + ''
      if (from_gid === groupId) {
        let {
          msg_body,
          from_id,
          from_name,
          create_time
        } = item.content
        let {
          extras
        } = msg_body
        let {
          messageTypeId,
          firstMessage
        } = extras
        messageId = item.ctime_ms
        // 当messageTypeId存在，代表是信息，0和1是消息，大于1是某种订单提示
        // firstMessage不为string：1
        if (messageTypeId && firstMessage !== '1') {
          conversationList.push({
            id: messageId,
            sessionId: extras.sessionId,
            fromUserId: from_id,
            fromUserName: from_name,
            fromType: null,
            headUrl: extras.landlordHeadUrl,
            content: msg_body.text,
            messageTypeId: messageTypeId,
            createTime: create_time,
            time: create_time - conversationList[conversationList.length - 1].createTime > (600 * 1000) ? dataFormat(create_time, 'hh:mm') : '',
            avatarUrl: getImgPath(landlordHeadUrl || extras.landlordHeadUrl)
          })
          if (messageTypeId > 1) {
            this.getBookingData(bookingId)
          }
        }
      } else {
        console.log("其他群组聊天")
      }
    })

    // this.addListIds(messageId)
    this.setData({
      conversationList
    }, () => {
      this.setData({
        toView: `session-${messageId}` || 0
      })
    })
  },
  sendLocalsProd(groupId, messages) {
    if (!localsIm.isLogin()) {
      this.setData({
        isSending: false
      })
      catchLoading('用户已在其他地方登录\n请返回再进入聊天界面!')
      return false
    }
    let {
      sessionId
    } = this.data
    let params = {
      ...this.data.extras,
      orderId: this.data.extras.bookingId,
      sessionId: sessionId,
      // groupId,
      content: messages
    }
    // 保存消息。自有平台专用。（前端调用极光发送消息成功后，调用本保存消息接口） 消息的发送者是登录用户
    ImServer.postSendMessage(params)
      .then(res => {
        let {
          id: messageId
        } = res.data.message
        let {
          bookingUserId,
          bookingUserName,
          bookingHeadUrl,
          checkInDate,
          checkOutDate,
          firstReplyTime,
          landlordHeadUrl,
          landlordName,
          landlordId,
          orderId,
          // orderStatus,
          assistantId,
          assistantMobile,
          assistantName,
          title,
          createTime
        } = res.data.session

        let extras = {
          ...this.data.extras,
          bookingUserId,
          bookingUserName,
          bookingHeadUrl,
          checkInDate,
          checkOutDate,
          firstReplyTime: firstReplyTime || 'null',
          landlordHeadUrl,
          landlordName,
          landlordId,
          orderId,
          orderStatus: this.data.bookingInfo && this.data.bookingInfo.orderStatus,
          assistantId,
          assistantMobile,
          assistantName,
          messageTypeId: 0,
          title,
          createTime,
          sendUserId: this.data.imInfo.username,
          sendUserAvatar: this.data.imInfo.avatar,
          sessionId
        }
        if (!sessionId) {
          this.setData({
            sessionId: res.data.id
          })
        }
        this.imSendGroupMsg(groupId, messages, extras, messageId)
      })
      .catch(e => {
        catchLoading(e)
      })
  },
  imSendGroupMsg(groupId, messages, extrasTemp, messageId) {
    // 发送群聊消息
    let date = new Date()
    let startTime = date.getTime()
    let extras = {}
    // 将所有value转成string类型，兼容安卓
    for (let i in extrasTemp) {
      extras[i] = String(extrasTemp[i])
    }
    localsIm.sendGroupMsg(
        groupId,
        messages,
        extras,
        this.data.bookingInfo.title,
        this.data.imInfo.nickName
      )
      .onSuccess(res => {
        let {
          conversationList,
          sessionId,
          imInfo
        } = this.data;
        let newSession = [{
          id: messageId,
          sessionId: sessionId,
          fromUserId: imInfo.username,
          fromUserName: imInfo.nickName,
          fromType: null,
          headUrl: imInfo.avatar,
          content: messages,
          messageTypeId: 0,
          createTime: startTime,
          time: conversationList.length > 0 && (startTime - conversationList[conversationList.length - 1].createTime > (600 * 1000)) ? dataFormat(startTime, 'hh:mm') : '',
          avatarUrl: getImgPath(imInfo.avatar)
        }]

        // 自己发送信息后，动态更新上一级列表的排序和最新信息
        if (this.prevPage && this.prevPage.route === "pages/im/im") {
          this.prevPage.imMsgReceive({
            messages: [{
              isSendMyself: true,
              from_gid: groupId,
              content: {
                msg_body: {
                  text: messages
                }
              }
            }]
          })
        }

        this.setData({
          scrollWithAnimation: true,
          isSending: false,
          txt: '',
          conversationList: [...conversationList, ...newSession]
        }, () => {
          // this.addListIds(messageId)
          this.setData({
            toView: `session-${messageId}` || 0,
          })
        })
      }).onFail((data) => {
        //同发送单聊文本
        console.log('发送信息失败', data)
        catchLoading(data.message)
      });
  },
  imLink(e) {
    wx.navigateTo({
      url: `./content/content?gid=${e.currentTarget.dataset.gid}`
    })
  },
  txtChange(e) {
    this.setData({
      txt: e.detail.value
    })
  },
  sendMessages(e) {
    let {
      txt,
      groupId
    } = this.data
    if (txt.trim() !== '') {
      if (!this.data.isSending) {
        this.setData({
          isSending: true
        }, () => {
          this.sendLocalsProd(groupId, txt)
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '无法发送空消息！'
      })
    }
  },
  orderButton(e) {
    //  支付按钮
    let {
      bookingId,
      houseSourceId,
      orderStatus,
      checkinDate,
      checkoutDate
    } = this.data.bookingInfo
    const {
      isForeignCity
    } = this.data;
    gioTrack('advisory_order')
    if (orderStatus === "1102") {
      wx.navigateTo({
        url: '/pages/trip/detail-v2/index?bookingId=' + bookingId
      })
    }

    // 如果是国外房源则必须是房东同意预订时才能下单
    if (isForeignCity) {
      this.landlordArgeeToOrder();
      return;
    }

    this.landlordArgeeToOrder();

    if (orderStatus === "1101") {
      wx.navigateTo({
        url: `/pages/order/order-v2/index?houseSourceId=${houseSourceId}&checkinStartDate=${checkinDate}&checkinEndDate=${checkoutDate}&from=consulting`
      })
      return;
    }
  },
  landlordArgeeToOrder() {
    //  支付按钮
    const {
      bookingInfo = {}
    } = this.data;
    let {
      bookingId,
      houseSourceId,
      orderStatus,
      checkinDate,
      checkoutDate
    } = bookingInfo;
    if (orderStatus === "1201") {
      getApp().mtj.trackEvent('detail_contact_order');
      wx.navigateTo({
        url: `/pages/order/order-v2/index?bookingId=${bookingId}&houseSourceId=${houseSourceId}&checkinStartDate=${checkinDate}&checkinEndDate=${checkoutDate}&from=consulting`
      })
      return;
    }
  },
  goToHouseDetail() {
    wx.navigateTo({
      url: '/pages/housing/detail/index?houseId=' + this.data.bookingInfo.houseSourceId
    })
  },
  // 暂时不做
  bindscroll(e) {
    clearTimeout(this.doingAnimationId)
    this.doingAnimationId = setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('#scroll-view').boundingClientRect()
      query.exec(res => {
        let {
          height
        } = res[0]
        let {
          scrollTop,
          deltaY,
          scrollHeight
        } = e.detail
        let planAnimation = wx.createAnimation({
          timingFunction: 'ease'
        })
        // 到底了
        if (scrollTop === 0 && deltaY === -1 || deltaY > 1) {
          console.log('show')
          planAnimation.translateY(0).opacity(1).height('112rpx').step()
        } else if (height + scrollTop === scrollHeight) {
          console.log('到底了')
          planAnimation.translateY(-50).opacity(0).height(0).step()
        } else {
          console.log('hide')
          planAnimation.translateY(-50).opacity(0).height(0).step()
        }
        this.setData({
          planAnimation: planAnimation.export()
        })
      })
    }, 300)
  },
  bindscrolltoupper() {
    let {
      isGettingSessions,
      hasNextPage
    } = this.data

    if (!isGettingSessions && hasNextPage) {
      this.processPage()
      this.setData({
        isGettingSessions: true
      }, this.getConversation)
    }
  },
  tapSendInput() {
    // 点击滑动最新消息
    let {
      conversationList
    } = this.data
    let {
      length
    } = conversationList

    this.setData({
      scrollWithAnimation: true
    }, () => {
      this.setData({
        toView: `session-${conversationList[length - 1]['id']}` || 0
      })
    })
  },
  returnImList() {
    wx.switchTab({
      url: '/pages/im/im'
    })
  },
  cancelPlan() {
    let {
      bookingId
    } = this.data
    let params = {
      orderNo: bookingId
    }
    wx.showModal({
      title: '提示',
      content: '是否取消订单?',
      success: res => {
        if (res.confirm) {
          showLoading()
          cancelOrder(params)
            .then(_ => {
              wx.hideLoading()
              wx.showToast({
                icon: 'success',
                title: '取消成功!',
                success: () => {
                  // 更新订单数据
                  this.getBookingData(this.data.bookingId, () => {
                    // 取消订单后修改上一级列表的状态
                    let {
                      groupId,
                      bookingInfo
                    } = this.data
                    if (this.prevPage && this.prevPage.route === "pages/im/im") {
                      this.prevPage.updateImOrderStatus({
                        groupId,
                        orderStatus: bookingInfo.orderStatus
                      })
                    }
                  })
                }
              })
            })
            .catch(e => {
              catchLoading(e)
            })
        }
      }
    })
  },
  jumpToDetail() {
    let {
      bookingId
    } = this.data.bookingInfo
    wx.navigateTo({
      url: '/pages/trip/detail-v2/index?bookingId=' + bookingId
    })
  },
  formSubmit(e){
    const formId = e.detail.formId
    reportFormid({
      formId,
      type:1,
    })
  }
})