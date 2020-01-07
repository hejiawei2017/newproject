// pages/activity/upgrade29-201812/index.js
const app = getApp();
const {
  miniPay,
  waitPay
} = require("../../../server/order");
const {
  showLoading,
  shareDataFormat,
  getDistanceTime,
  gioTrack
} = require("../../../utils/util");
const {
  joinShare,
  statisticsEvent
} = require('../../../server/hd');
const {
  addInviteRecord
} = require('../../../server/marketing');
import request from "../../../utils/request";

const nickNames = ["cgp", "高国华", "李云", "元媛Ula", "苏同民 路客精品民宿", "何海", "马儿???", "Jane_静", "董签签", "Tina-萬麗", "李阳", "黄瑰琼Amy", "Isabella", "locals", "TAKA", "王亮-路客", "周鸿志", "kelly", "Jakey", "VIC", "伸手摘星?", "Benny", "Leo Li", "木隶斤欠", "Timo", "S.K", "海涛", "隋安", "苑伟", "大蓉", "小米", "大昌", "柳君", "　 梅梅", "夏俊煊", "爱米妈妈", "佐大罗", "郎行千里", "F先生丶", "Jossy", "渔人码头", "Jeremy", "JAN", "小君.H*Alina", "Leon Cao", "蒋晓钢酒店业资深顾问", "钱掌柜的", "Jim", "灿若云霞", "Zheng", "Orva", "雲竹里", "晶晶????", "黄吉海", "武强", "大河向东流", "赵慧", "locals*路客*吴想想", "老杨", "青木秀一?", "张会彬", "mingyou", "清风", "张大赛", "亮", "Henry", "hgy", "1A无怨无悔", "卫青", "燕子", "李振娅", "Ammy.li", "美佳", "黄河之水", "卧龙", "贺翠珠(Cuizhu)", "董莫言", "华", "酒店投资管理咨询顾问林涛", "阿玉", "金燕", "王晶", "杨祖平", "顾军", "回头看看", "彭晓飞", "左右", "lzg", "任永军", "盛小丢丢", "小木墩 ..", "Ally", "Eva", "风之古", "Ely??", "夕阳", "李海坤", "文玉民", "风起的日子遗忘……", "坤华"]

const ACTIVITY_NAME = '会员升级套餐';

let tapCardType = '' // 点击购买卡的类型

/**
 * 获取随机数
 * @param {*} max 
 * @param {*} min 
 */
function randomCount(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgCount: {}, // 图片加载次数map
    pageImgs: {
      headerImg: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/up_grade_header.png',
      blackCard: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/black_card.png',
      goldCard: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gold_card.png',
      silverCard: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/silver_card.png',
      guarantees: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/8guarantees.png',
      dialogTitle: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/dialog_title.png',
      blackCardSuccess: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/black_success.png',
      goldCardSuccess: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/up_grade_gold_susscess.png',
      silverCardSuccess: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/silver_success.png'
    },
    cardTypes: ['black', 'gold', 'silver'],
    isBlackList: false, // 是否是黑名单用户
    isShowModle: false, //显示弹框
    cardTypeToPay: null, //购买卡的类型
    itemId: null, //购买卡的id
    paySuccess: false, //支付成功
    totalFee: 0, //支付金额
    isBtnPresed: false, //支付按钮是否按
    channel: null, //渠道信息
    showInvite: false,
    showText: '',
    currentCardTipsType: null, // 支付框是否展示当前卡类型tips的标志位
    userCardType: null, // 用户当前卡类型
    noticeTimer: null, // notice的定时器
    notice: { // 顶部购买notice
      buyer: '',
      time: '',
      cardType: ''
    },
    cardBuyersCount: { // 每一种类卡购买的累计人数
      black: randomCount(400000, 300000),
      gold: randomCount(400000, 300000),
      silver: randomCount(400000, 300000)
    },
    cardBuyerCountTimer: { // 每一种类卡购买累计人数的定时器
      black: '',
      gold: '',
      silver: ''
    },
    timeCount: '',
    timCountTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 重定向到最新的
    wx.redirectTo({
      url: '/pages/activity/upgrade29-201907/index',
    })
    return
    // 记录渠道号
    options.channel && this.setData({
      channel: options.channel
    })
    if (options.sid) {
      app.globalData.sid = sid;
    }
    if (options.openfn) {
      console.log(options.openfn)
      if (options.openfn !== 'black' && options.openfn !== 'gold' && options.openfn !== 'silver') {
        return
      }
      this.handleClick(options.openfn)
    }
    if (options.inviteCode) {
      console.log(options.inviteCode)
      wx.setStorageSync('inviteCode', options.inviteCode);
    }
    this.getRadomNoticeParams(2000) // 开始顶部notice播放 ，2秒一换
    this.startCardBuyersCountTimers() // 开始各种类卡购买人数累加
    this.startDistanceTimer() // 开始活动倒计时
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.noticeTimer) // 清楚随机姓名循环

    // 清楚个种类卡人数累计计时器
    Object.keys(this.data.cardBuyerCountTimer).forEach(key => {
      clearTimeout(this.data.cardBuyerCountTimer[key])
    })

    clearInterval(this.timCountTimer) // 清除倒计时计时器
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return shareDataFormat({
      title: '【限时抢购】路客会员升级套餐，一键直升VIP！',
      path: '/pages/activity/upgrade29-201907/index',
      imageUrl: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/up_grade_201907/up_grade_header.png'
    })
  },

    // 上报邀请码访问记录
    addInviteRecord() {
      const inviteCode = wx.getStorageSync('inviteCode')
      if(!inviteCode) return
      const userInfo = app.globalData.userInfo
      const data = {
        userId:userInfo.id,
        fromInvitationCode:inviteCode
      }
      addInviteRecord(data).then(res => {
        console.log(res)
      })
    },

  /**
   * 获取随机数
   * @param {*} max 
   * @param {*} min 
   */
  randomCount(max, min) {
    return randomCount.call(this, max, min)
  },
  /**
   * 定时更新notice的展示内容
   * @param {*} timeout 默认2秒一换
   */
  getRadomNoticeParams(timeout = 2000) {
    const cardTypes = ['黑卡', '金卡', '银卡']
    const timer = setInterval(() => {
      const buyer = nickNames[this.randomCount(nickNames.length - 1, 0)]
      const time = this.randomCount(20, 1)
      const cardType = cardTypes[this.randomCount(cardTypes.length - 1, 0)]
      this.setData({
        notice: {
          buyer,
          time,
          cardType
        }
      })
    }, timeout)
    this.setData({
      noticeTimer: timer
    })

    return timer
  },

  /**
   * 计算购买卡的人数累计
   * @param {*} key 卡类别 
   * @param {*} timeout 定时器时间
   */
  setCardBuyersCount(key, timeout) {
    if (!timeout || isNaN(timeout)) timeout = this.randomCount(5, 1) * 1000
    let count = this.data.cardBuyersCount[key] || this.randomCount(400000, 300000)
    const timer = setTimeout(() => {
      this.setData({
        cardBuyersCount: Object.assign({}, this.data.cardBuyersCount, {
          [key]: ++count
        })
      })
      const nextTimeout = this.randomCount(5, 1) * 1000
      const timer = this.setCardBuyersCount(key, nextTimeout)
      this.setData({
        cardBuyerCountTimer: Object.assign({}, this.cardBuyerCountTimer || {}, {
          [key]: timer
        })
      })
    }, timeout)

    this.setData({
      cardBuyerCountTimer: Object.assign({}, this.cardBuyerCountTimer || {}, {
        [key]: timer
      })
    })
  },

  /**
   * 开始购买人数计数
   */
  startCardBuyersCountTimers() {
    this.setCardBuyersCount('black') // 定时器计算黑卡累计人数
    this.setCardBuyersCount('gold') // 定时器计算金卡累计人数
    this.setCardBuyersCount('silver') // 定时器计算银卡累计人数
  },

  /**
   * 获取活动倒计时
   */
  getDistanceTime() {
    let endTime = wx.getStorageSync('upgrade_end_time') || '2019.08.15 00:00:00' // 获取活动结束时间节点时间戳
    endTime = new Date(isNaN(parseInt(endTime) ? endTime : parseInt(endTime))).getTime()
    const currentTime = new Date().getTime() // 当前时间
    const diff = currentTime - endTime // 时间差
    if (diff < -3 * 60 * 60 * 24 * 1000) {
      this.setData({
        timeCount: '活动还未开始'
      })
    } else if (diff >= 0) {
      // 每三天一循环，当前循环内的开始时间
      const startTime = endTime + parseInt(diff / (3 * 60 * 60 * 24 * 1000)) * (60 * 60 * 24 * 1000) * 3
      // 当前循环内的活动结束时间
      endTime = startTime + 3 * 60 * 60 * 24 * 1000
      wx.setStorageSync('upgrade_end_time', endTime)
    }

    const disObj = getDistanceTime(currentTime, endTime)
    return `${disObj.day} 天 ${disObj.hour} 时 ${disObj.minute} 分 ${disObj.second} 秒`
  },

  /**
   * 开始活动倒计时计数
   */
  startDistanceTimer() {
    const timer = setInterval(() => {
      const timeCount = this.getDistanceTime()
      this.setData({
        timeCount
      })
    }, 1000)
    this.setData({
      timCountTimer: timer
    })
    return timer
  },
  // 登录成功后的回调函数
  signInCallback() {

    // 确认当前用户会员卡类型是否存在，否则获取后再进行支付框弹出
    if (this.data.userCardType) {
      this.initDialogToPay()
      return
    }
    this.getUserCardType().then(() => {
      this.initDialogToPay()
    })
    // 登陆成功，如果有邀请码，上报邀请码访问记录
    this.addInviteRecord()
  },
  /**
   * 支付框的配置以及弹出
   */
  initDialogToPay () {
    const cardType = this.getRecommendedCardType(tapCardType) // 获取推荐的卡类型
    const currentCardTipsType = this.getCurrentCardTipsType(tapCardType) // 获取当前需要提示已经购买的卡类型
    const id = this.getCardId(cardType) // 根据推荐的卡类型获取商品卡id

    // 设置点击cardTypeToPay
    this.setData({
      currentCardTipsType,
      cardTypeToPay: cardType,
      itemId: id,
      isShowModle: true //弹窗引导下一步
    });
  },
  /**
   * 支付款列表选项选择
   * @param {*} e 
   */
  radioChange(e) {
    const cardTypes = this.data.cardTypes
    const tapCardType = e.detail.value
    const myCardType = this.data.userCardType
    // 如果选择的卡类型比当前用户卡类型低级或者相等，则不能选
    if (myCardType && cardTypes.indexOf(tapCardType) >= cardTypes.indexOf(myCardType)) return
    const itemId = this.getCardId(tapCardType) // 获取选择的卡的商品id
    this.setData({
      cardTypeToPay: tapCardType,
      itemId
    })
  },
  /**
   * 图片加载失败处理机制
   * @param {*} e 
   */
  bindeImageError(e) {
    const key = e.target.dataset.img
    const count = this.data.imgCount && this.data.imgCount[key] || 0
    const dataKey = `pageImgs.${key}`,
      countKey = `imgCount.${key}`

    // 重试机制
    if (count < 2) {
      this.setData({
        [dataKey]: this.data.pageImgs[key] + `?v=${Math.random()}`,
        [countKey]: count + 1
      })
    } else {
      // 重试两次失败即提示获取图片失败
      wx.showToast({
        icon: 'none',
        title: '获取图片失败',
        duration: 1500
      })
    }
  },
  jumpToHomePage() {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
  getUserCardType() {
    return request
      .get('platform/membership/mobile', {
        mobile: wx.getStorageSync('userInfo').mobile
      }).then(res => {
        if (res.success) {
          let type = res.data.memberCardCode || ''
          if (type && Object.prototype.toString.call(type) === "[object String]") {
            const typeCached = type.toLowerCase()
            type = typeCached === 'normal' ? null : typeCached
          } else {
            type = null
          }
          this.setData({
            userCardType: type
          })
        }
      })
  },
  handleClickToPay() {
    const channel = wx.getStorageSync('from_channel');
    if (channel) {
      joinShare({
        ticket_id: ACTIVITY_NAME,
        share_user_id: channel,
      });
    }
    let token = wx.getStorageSync("token");
    let openId = wx.getStorageSync("openId");
    waitPay({
        itemId: this.data.itemId
      })
      .then(({
        data
      }) => {
        console.log(data)
        wx.hideLoading()
        const orderInfo = data && data.orderInfo;
        if (!data || !orderInfo || orderInfo.tradeStatus !== 0) {
          this.checkStatues(token, openId);
          return
        }

        this.doPay(orderInfo);
      })
  },
  checkStatues() {
    showLoading();
    request
      .post("mall/purchase-right/grant", {
        itemId: this.data.itemId,
        buyNum: "1"
      })
      .then(res => {
        wx.hideLoading();
        if (res.success) {
          // isAuthenticated为真有购买资格
          console.log(res);
          if (res.data.isAuthenticated) {
            this.handlePay()
          } else {
            wx.showToast({
              title: res.data.rightTip || "您没有购买权限",
              icon: "none",
              duration: 2000 //持续的时间
            });
          }
        } else {
          // 请求不成功的情况
          wx.showToast({
            title: "网络出错啦,请稍后再试,错误码003",
            icon: "none",
            duration: 2000 //持续的时间
          });
        }
      });
  },
  hidePop() {
    this.setData({
      isShowModle: false
    });
  },
  hidePaySuccess () {
    this.setData({
      paySuccess: false
    });
  },
  /**
   * 获取当前推荐的卡类型
   * @param {*} type 
   */
  getRecommendedCardType(type) {
    const cardTypes = this.data.cardTypes
    const myCardType = this.data.userCardType
    // 当前还没有购买任何卡，或者选择的卡类型比当前的卡类型高级，则保持选择的卡类型
    if (!myCardType || (cardTypes.indexOf(type) < cardTypes.indexOf(myCardType))) return type

    // 当选择的卡类型刚好等于当前用户卡类型，则判断当前用户是否是黑卡，黑卡则推荐置为null， 否则推荐黑卡
    if (cardTypes.indexOf(type) >= cardTypes.indexOf(myCardType)) {
      return myCardType === cardTypes[0] ? null : cardTypes[0]
    }
  },
  /**
   * 获取支付框当前要提示哪种卡已经拥有
   * @param {*} type 
   */
  getCurrentCardTipsType(type) {
    const cardTypes = this.data.cardTypes
    const myCardType = this.data.userCardType
    // 如果还没有选择卡，或者选择的卡比当前用户卡高级，则不提示当前的卡类型
    if (!myCardType || (cardTypes.indexOf(type) < cardTypes.indexOf(myCardType))) return null
    return myCardType
  },
  /**
   * 通过卡类型获取卡的商品id
   * @param {*} cardType 
   */
  getCardId(cardType) {
    let id = null
    switch (cardType) {
      case 'black':
        id = "931070414685876250";
        break;
      case 'gold':
        id = "931070414685876249";
        break;
      case 'silver':
        id = "931070414685876248";
        break;
    }
    return id
  },
  gioTrack2CardTypeProxy () {
    let name = null
    const cardType = this.data.userCardType
    switch (cardType) {
      case 'black':
        name = "buy_black_member_card";
        break;
      case 'gold':
        name = "buy_gold_member_card";
        break;
      case 'silver':
        name = "buy_silver_member_card";
        break;
    }
    name && gioTrack(name);
  },
  /**
   * 点击领券，判断当前登录状态，后续支付在回调中实现
   * @param {*} e 
   */
  handleClick(e) {
    if (typeof (e) === 'string') { // 缓存点击项的卡类型，在确认登录后回调使用
      tapCardType = e
    } else {
      tapCardType = e.target.dataset.type
    }
    // 调用登录组件
    this.selectComponent("#auth-drawer-box").signInSuccessCallback()
  },
  // 未完成订单再次支付
  doPay(orderInfo) {
    let openId = wx.getStorageSync('openId');
    // 订单创建后，调起微信支付
    let params = {
      accountId: 7,
      isInvoice: false,
      tradeType: 'JSAPI',
      outTradeNo: orderInfo.id,
      amount: orderInfo.payment / 100,
      currency: 'CNY',
      source: 'MALL', // 不能修改
      body: '小程序支付',
      openId: openId,
    };
    miniPay(params)
      .then(res => {
        console.log(res)
        let payParams = {
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.pkg,
          signType: res.data.signType,
          paySign: res.data.sign,
          success: () => {
            // getApp().mtj.trackEvent('active_order', {
            //   channel: this.data.channel || "natrue_origin",
            //   order_item: '会员升级',
            // });
            this.setData({
              paySuccess: true,
              isShowModle: false,
              userCardType: this.data.cardTypeToPay
            })
            // // 全员营销上报登陆信息
            // const receiptorId = wx.getStorageSync('receiptorId')
            // let _data = {
            //   ruleType: 3,
            //   orderNo: params.outTradeNo,
            //   orderId: this.data.itemId,
            // }
            // if (receiptorId !== "") _data.receiptorId = receiptorId
            
            // marketingReport(_data)
            // 升级会员成功会，重新获取userInfo
            this.gioTrack2CardTypeProxy()
            app.getUserInfoDetail()
            this.getUserCardType() // 支付成功之后及时更新页面当前用户卡类型
          },
          fail: () => {
            // this.showError()
          }
        }
        // 调起微信支付
        wx.requestPayment(payParams)
      })
      .catch(e => {
        this.showError()
      })
  },
  // 支付
  handlePay() {
    if (this.data.isBtnPresed) {
      return
    }
    this.setData({
      isBtnPresed: true
    })
    showLoading()
    const inviteCode = wx.getStorageSync('inviteCode')
    request.post('mall/trade/item', {
      "sourcePlatform": "MP",
      "trades": [{
        "itemId": this.data.itemId,
        "totalFee": "1",
        "buyNum": 1
      }],
      "sid": app.globalData.sid,
      "inviteCode": inviteCode,
    }).then((e) => {
      wx.hideLoading()
      if (e.success) {
        // isAuthenticated为真有购买资格
        console.log(e.data)

        let openId = wx.getStorageSync('openId')
        // 订单创建后，调起微信支付
        let params = {
          accountId: 7,
          isInvoice: false,
          tradeType: 'JSAPI',
          outTradeNo: e.data.orderInfo.id,
          amount: e.data.orderInfo.payment / 100,
          currency: 'CNY',
          source: 'MALL', // 不能修改
          body: '小程序支付',
          openId: openId
        }
        miniPay(params)
          .then(res => {
            console.log(res)
            let payParams = {
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.pkg,
              signType: res.data.signType,
              paySign: res.data.sign,
              success: () => {
                getApp().mtj.trackEvent('active_order', {
                  channel: this.data.channel || "natrue_origin",
                  order_item: '会员升级',
                });
                this.setData({
                  paySuccess: true,
                  isShowModle: false,
                  userCardType: this.data.cardTypeToPay
                })
                // // 全员营销上报登陆信息
                // const receiptorId = wx.getStorageSync('receiptorId')
                // let _data = {
                //   ruleType: 3,
                //   orderNo: params.outTradeNo,
                //   orderId: this.data.itemId,
                // }
                // if (receiptorId !== "") _data.receiptorId = receiptorId
                // marketingReport(_data)
                this.gioTrack2CardTypeProxy()
                app.getUserInfoDetail()
                this.getUserCardType() // 支付成功之后及时更新页面当前用户卡类型
              },
              fail: () => {
                // this.showError()
              }
            }
            // 调起微信支付
            wx.requestPayment(payParams)
          })
          .catch(e => {
            this.showError()
          })

      } else {
        // 请求不成功的情况
        wx.showToast({
          title: '抢光了，明天再来吧！',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      }
    }).catch((e) => {
      wx.hideLoading()
      wx.showToast({
        title: '抢光了，明天再来吧！',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    })
  },
  showError () {
    wx.showModal({
      title: '升级失败',
      content: '出现一点小问题，请您尝试重新操作',
      showCancel:false
    })
  },
  /**
   * 跳转 “我的”
   */
  goMine() {
    wx.reLaunch({
      url: '/pages/mine/mine'
    })
  },
  longpressShow(){
    const inviteCode = wx.getStorageSync('inviteCode')
    const selfInviteCode = wx.getStorageSync('selfInviteCode');
    let showText = inviteCode
    if(inviteCode){
      showText = parseInt(selfInviteCode) === parseInt(inviteCode) ? `邀请编号:${inviteCode}(本人)` : `邀请编号:${inviteCode}`
    }else{
      showText = '欢迎购买'
    }
    this.setData({
      showInvite:true,
      showText
    })
    setTimeout(()=>{
      this.setData({
        showInvite:false,
      })
    },3000)
  }
});