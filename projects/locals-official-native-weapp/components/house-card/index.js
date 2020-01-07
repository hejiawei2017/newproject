const app = getApp()
const { processFloat, isHasLogin } = require('../../utils/util')
const { postCollct } = require('../../server/housing')
const { getMemberCard } = require('../../server/mine')
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')

Component({
  userInfo: null,
  properties: {
    // 房源数据
    item: {
      type: Object,
      value: {},
    },
    // 解决埋点不同来源
    source: {
      type: String,
      value: 'house'
    },
    // 是否显示收藏按钮
    isShowCollection: {
      type: Boolean,
      value: false
    },
    isFav: {
      type: Boolean,
      value: false
    },
    /**
     * 1: 'NORMAL', // 普通房源 
     * 2: 'LOTEL' // lotel房源
     */
    houseSourceType: {
      type: String,
      value: 'NORMAL',
    },
    // 是否显示会员内容
    isShowCardInfo: {
      type: Boolean,
      value: false
    },
    // 是否已登录
    isHasLogin: {
      type: Boolean,
      value: false,
      async observer(newValue, oldValue) {
        const { isShowCardInfo } = this.data
        if (newValue !== oldValue && isShowCardInfo) {
          await this.init()
        }
      }
    },
    isForeignCity: {
      type: Boolean,
      value: false,
    },
    haveCity: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    defaultAvatar: app.globalData.defaultAvatar,
    cardText: '',
    isNormal: false,
    memberCardInfo: {},
    memberCardCode: 'GOLD',
    designImage: {
      width: 0,
      height: 0
    },
    originPrice: null,
    standardPrice: '***',
    hideDesignImage: false,
    designByImage: 'https://oss.localhome.cn/localhomeqy/design-by.png',
    isForeignCity: false,
    haveCity: true
  },
  async ready() {
    await this.init()
  },
  isNormal: false,
  methods: {
    async init() {
      this.userInfo = wx.getStorageSync('userInfo')
      const { isShowCardInfo, item } = this.data
      let cardText = ''
      await this.setMemberCard()

      if (isShowCardInfo) {
        cardText = this.getCardText()
      }

      let data = {
        cardText
      }

      if (isHasLogin()) {
        let { originPrice, standardPrice } = this.getOriginPrice()
        data = {
          ...data,
          originPrice,
          standardPrice,
        }
      } else {
        data.standardPrice = item.standardPrice
      }

      // 是否有国庆特惠标签
      // will delete
      const isSummerSpecial = item.tags.some(i => i.tagName === '国庆特惠');
      data.isSummerSpecial = isSummerSpecial;
      if (isSummerSpecial) {
        const summerSpecialDiscount = 0.2; // will delete
        const summerSpecialMoney = processFloat(item.standardPrice * 0.2, 0);
        data.summerSpecialText = `国庆特惠立减${summerSpecialMoney}元`;
        if (!data.originPrice) {
          data.originPrice = data.standardPrice;
        }
        // 原价扣除夏季优惠价
        const summerSpecialPrice = processFloat(data.originPrice - summerSpecialMoney, 0);
        // 夏季优惠比折扣优惠还优惠时，显示夏季优惠
        if (summerSpecialPrice < data.standardPrice) {
          data.standardPrice = summerSpecialPrice;
        }
      }
      
      
      this.setData(data)
    },
    async setMemberCard() {
      const userInfo = this.userInfo
      const isNormal = this.getIsNormal()
      const params = {
        code: 'GOLD'
      }
      if (userInfo && userInfo.memberCardCode && !isNormal) {
        params.code = userInfo.memberCardCode
      }
      const { data } = await getMemberCard(params)
      if (isNormal) {
        data.image = "https://oss.localhome.cn/localhomeqy/ordinary-card.png"
      }
      this.isNormal = isNormal
      this.setData({
        memberCardInfo: data
      })
    },
    getIsNormal() {
      const userInfo = this.userInfo
      return userInfo && userInfo.memberCardCode === 'NORMAL'
    },
    getCardText() {
      const { isShowCardInfo, isHasLogin, memberCardInfo } = this.data
      const isNormal = this.getIsNormal()
      if (isShowCardInfo && memberCardInfo) {
        const reducePrice = this.getReducePrice()
        const defaultText = `${memberCardInfo.memberCardName}立减${reducePrice}`
        if (isHasLogin && !isNormal) {
          return defaultText
        } else {
          return `升级${defaultText}`
        }
      } else {
        return ''
      }
    },
    getOriginPrice() {
      const { isShowCardInfo, isHasLogin, item } = this.data
      const isNormal = this.getIsNormal()

      if (isHasLogin && isShowCardInfo && !item.originPrice && !isNormal) {
        const reducePrice = this.getReducePrice()
        return {
          originPrice: item.standardPrice,
          standardPrice: processFloat(item.standardPrice - reducePrice, 0)
        }
      } else {
        return {
          originPrice: null,
          standardPrice: item.originPrice ? item.originPrice : item.standardPrice
        }
      }
    },
    getReducePrice() {
      this.setReducePrice()
      if (this.reducePrice) {
        return this.reducePrice
      } else {
        return 0
      }
    },
    setReducePrice() {
      let { item, memberCardInfo } = this.data
      if (memberCardInfo && memberCardInfo.discount) {
        // 当原始值存在则使用原始值计算
        if (item.originPrice) {
          this.reducePrice = processFloat(item.originPrice - item.originPrice * memberCardInfo.discount, 0)
        } else {
          this.reducePrice = processFloat(item.standardPrice - item.standardPrice * memberCardInfo.discount, 0)
        }
      }
    },
    setOriginPrice() {
      let extendsItem = this.getOriginPrice()
      const that = this
      if (extendsItem.originPrice) {
        setTimeout(() => {
          that.setData({
            item: {
              ...that.data.item,
              ...extendsItem
            }
          })
        }, 0)
      }
    },
    setCardText() {
      const that = this
      let { memberCardInfo } = this.data
      let cardText = this.getCardText()
      const isNormal = this.getIsNormal()
      let memberCardCode = memberCardInfo 
                           ? isNormal
                             ? 'GOLD' 
                             : memberCardInfo.memberCardCode
                           : ''
      
      setTimeout(() => {
        that.setData({
          cardText,
          memberCardCode,
          memberCardImage: memberCardInfo ? memberCardInfo.image : ''
        }) 
      }, 0)
    },
    async collection(e) {
      const { id: houseSourceId } = e.currentTarget.dataset
      const params = {
        houseSourceId
      }
      if (!isHasLogin()) {
        this.triggerEvent('login')
        return
      }
      const { data } = await postCollct(params)
      const success = data === 'create'
      // 管理收藏列表
      this.triggerEvent('collection', { houseSourceId, success })
      this.setData({
        isFav: success ? true : false
      })
      wx.showToast({
        title: success ? '收藏成功~' : '已取消收藏~',
        icon: 'none'
      })
    },
    goToDetail() {
      let { houseSourceType } = this.data

      switch(houseSourceType) {
        case 'NORMAL':
          this.goToNormalDetail()
          break;
        case 'LOTEL':
          this.goToLotelDetail()
          break;
      }
    },
    goToNormalDetail() {
      let { item, source } = this.data
      let { id, isFav, houseNo } = item
      switch (source) {
        case 'index':
          getApp().mtj.trackEvent('index_recommend_house', {
            house_no: houseNo
          });
          break;
        default:
          getApp().mtj.trackEvent('housing_detail', {
            house_no: houseNo
          });
          break;
      }
      let url = `/pages/housing/detail/index?`
      if (id) {
        url += `houseId=${id}`
      }
      if (isFav) {
        url += `&isFavorate=${isFav}`
      }
      wx.navigateTo({
        url
      })
    },
    goToLotelDetail() {
      let { hotelId, id } = this.data.item
      let url = `/pages/housing/lotel/index?lotelId=${hotelId}&houseId=${id}`;
      wx.navigateTo({
        url
      })
    },
    goToLandlord(e) {
      let { landlord } = e.currentTarget.dataset.item
      if (landlord && landlord.userId) {
        wx.navigateTo({
          url: '/pages/housing/owner/index?memberId=' + landlord.userId
        })
      }
    },
    avatarError(e) {
      const that = this
      let newItem = this.data.item
      if (!newItem.assist){ newItem.assist = {} }
      newItem.assist.avatar = this.data.defaultAvatar
      setTimeout(() => {
        that.setData({
          item: newItem
        })
      }, 0)
    },
    bindLoadImage(e) {
      const that = this
      const { detail } = e
      const { width, height } = detail
      const proportion = Math.abs(width / height)
      setTimeout(() => {
        that.setData({
          designImage: {
            height: 45,
            width: 45 * proportion
          }
        })
      }, 0)
    },
    bindErrorDesignImage() {
      const that = this
      setTimeout(() => {
        that.setData({
          hideDesignImage: true
        })
      })
    }
  }
})
