const { validator, showLoading, catchLoading } = require('../../../utils/util')
const { postGuests, getGuest, delGuests, putGuests } = require('../../../server/mine')
const { guestTypeTextNameMap, guestTypeNoMap } = require('../../../utils/dictionary')
const moment = require('../../../utils/dayjs.min.js')
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const app = getApp()
const cardAlls = []

guestTypeTextNameMap.forEach((name, key) => {
  cardAlls.push({ index: key, name: name })
})

Page({
  isLoading: false,
  data: {
    isFullScreen: app.globalData.isFullScreen,
    sex:'',
    age:'',
    name:'',
    cardNo:'',
    from: null,
    phone:'',
    cardAlls,
    birthData:'',
    cardType: '01',
    cardTypeIndex: 0,
    cardText: '身份证',
    currentDate: moment().format('YYYY-MM-DD'),
  },
  onLoad(options) {
    this.setData({
      from: options.from || '',
      id: options.id || '',
      maxCount: options.maxCount || null
    })
  },
  async onShow() {
    this.selectComponent("#im-message").imLogin()
    // 有值代表是编辑的
    await this.setGuestData()
  },
  async setGuestData() {
    const { id } = this.data
    if (!id) {
      return 
    }
    showLoading()
    const { data } = await getGuest(id)
    wx.hideLoading()
    const { birthday, cardNo, cardType, age, phone, sexCode, name } = data
    const cardText = guestTypeTextNameMap.get(cardType)
    const cardTypeIndex = Array.from(guestTypeTextNameMap.keys()).indexOf(cardType)
    this.setData({
      age,
      name,
      phone,
      cardNo,
      cardText,
      cardType,
      sex: sexCode,
      cardTypeIndex,
      birthData: birthday
    })
  },
  changeInputValue(e) {
    let { key } = e.currentTarget.dataset
    this.setData({
      [key]: e.detail.value
    })
  },
  wayChange(e){
    let { value }  = e.detail
    let { cardAlls } = this.data
    const { index, name } = cardAlls[value]
    this.setData({
      cardType: index,
      cardText: name
    })
  },
  dateChange(e) {
    this.setData({
      birthData: e.detail.value
    })
  },
  upload() {
    let { name, phone = '', birthData, sex, cardNo, cardType } = this.data
    cardNo = String(cardNo).toUpperCase().trim();
    phone = String(phone).trim();
    name = String(name).trim();
    if (!validator(name, 'realname')) {
      return
    }
    const cardTypeNo = guestTypeNoMap.get(cardType)
    let params = {
      cardType
    }
    // 验证对应的格式
    const verifyFormat = {
      idCard: 'idCard',
      permit: 'traffic',
      mtps: 'compatriots',
      passport: 'passport',
    }
    if (!validator(cardNo, verifyFormat[cardTypeNo])) {
      return 
    }
    // 当是身份证时，说明用户是国内非港澳，则验证手机号，否则不验证手机号，只验证是否为空
    const isNeedVerifyPhone = ['idCard']
    if (isNeedVerifyPhone.includes(cardTypeNo) && !validator(phone, 'phone')) {
      return
    } else {
      // 香港手机号长度为8位，澳门手机号长度为8位
      const isValidPhone = !phone.trim() && phone.length >= 8
      if (isValidPhone) {
        wx.showToast({ title: '请输入正确的手机~', icon: 'none' })
        return
      }
    }
    const isNeedBirthInfoArray = ['passport', 'permit', 'mtps']
    if (isNeedBirthInfoArray.includes(cardTypeNo)) {
      if (!validator(birthData, 'normal', '请输入正确格式的出生日期')) {
        return
      }
      if(!validator(sex, 'normal', '请输入选择性别')) {
        return
      }
      const currentYear = (new Date()).getFullYear()
      const userBirthYear = (new Date(birthData)).getFullYear()
      const age = currentYear - userBirthYear
      if (age < 0) {
        wx.showToast({ icon: 'none', title: '请输入正确的年龄！' })
        return
      }
      params = {
        ...params,
        age,
        sexCode: sex,
        birthday: birthData,
      }
    }
    params = {
      ...params,
      name,
      phone,
      cardNo,
    }
    this.requestAdd(params)
  },
  async deleteGuest() {   
    if (this.isLoading) {
      return
    }
    const { id } = this.data
    if (id) {
      try {
        wx.showModal({
          title: '提示',
          content: '确定删除该入住人信息?',
          success: async e => {
            const { confirm } = e
            if (confirm) {
              // 删除时也把选择入住人中的入住人删掉
              const { selectGuest } = app.globalData
              const newSelectGuest = selectGuest.filter(item => item.guestId !== id)  
              app.globalData.selectGuest = newSelectGuest
              this.isLoading = true
              showLoading()
              const { data } = await delGuests(id)
              wx.hideLoading()
              if (data) {
                this.showToast('删除成功')
              } else {
                this.showToast('删除失败')
              }
            }
          }
        })
      } catch(e) {
        this.isLoading = false
        catchLoading(e)
      }
    }
  },
  async requestAdd(params) {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    try {
      showLoading()
      const { id } = this.data
      let success, title;
      if (id) {
        params.guestId = id
        const { data } = await putGuests(params)
        const { data: newGuestData } = await getGuest(id)
        const { selectGuest } = app.globalData
        // 将全局中已选择的入住人信息替换为更新的内容
        const newSelectGuest = selectGuest.map(item => item.guestId === id ? newGuestData : item)
        app.globalData.selectGuest = newSelectGuest
        title = '修改成功'
        success = data
      } else {
        const { data } = await postGuests(params)
        title = '添加成功'
        success = data
      }
      wx.hideLoading()
      if (success) {
        this.showToast(title)
      }
    } catch(e) {
      this.isLoading = false
      console.log(e)
      catchLoading(e)
    }
  },
  showToast(title) {
    const duration = 800
    const that = this
    wx.showToast({ 
      title, 
      duration,
      icon: 'none'
    })
    setTimeout(() => {
      that.skipToGuestList()
    }, duration)
  },
  skipToGuestList() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage) {
      prevPage.init()
    }
    this.isLoading = false
    wx.navigateBack()
  }
})