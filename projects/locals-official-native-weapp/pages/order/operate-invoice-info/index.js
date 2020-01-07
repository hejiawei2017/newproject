var sliderWidth = 125; // 需要设置slider的宽度，用于计算中间位置
const { addInvoiceTitle, updateInvoiceTitle, getInvoiceTitle,delInvoiceTitle } = require('../../../server/invoice')
const { showLoading, catchLoading, validator } = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs: ["电子普通发票(推荐)", "纸质普通发票", "专用发票"],
    isFullScreen: app.globalData.isFullScreen,
    wxmlTitle:'填写发票',
    id:'',
    invoiceId:'',
    tabs: ["电子普通发票(推荐)", "专用发票"],
    // tabs: ["电子普通发票"],
    activeIndex: 0,
    // sliderOffset: 0,
    // sliderLeft: 0,
    invoiceInfoType: 'company',
    isSpecialInvoice: false,
    defaultTitle:0,//默认发票抬头 0-不是默认 1-默认
    invoiceType:'',//1- 增值税电子普通发票 2- 增值税纸质普通发票 3- 增值税专用发票
    titleType:'',//发票抬头类型 1-个人 2-企业
    titleName:'',//发票抬头
    taxCode:'',//纳税人识别号
    registeredAddress:'',//公司注册地址
    registeredPhoneNum:'',//公司注册电话
    depositBank:'',//开户银行
    bankAccount:'',//银行账号
    email:'',//电子邮箱
    username:'',//收件人姓名
    phoneNumber:'',//联系电话
    address:'',//详细地址,
    from: ''
  },
  onLoad: function (options) {
    this.setData({
      from: options.from || '',
      isFromOrder: options.from === 'order'
    })
    if(options.id){
      this.setData({//注册房东达人跳转选择城市页面，自带form=landlord参数
        invoiceId:options.id || '',
        wxmlTitle:'修改发票',
      })
    }
    if(options.invoiceData){
      const invoiceData = options.invoiceData || ''
      this.assignmentData(JSON.parse(invoiceData))
    }
    wx.setNavigationBarTitle({
      title: this.data.wxmlTitle
    })
    // wx.getSystemInfo({
    //   success: res => {
    //     this.setData({
    //         sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
    //         sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
    //     });
    //   }
    // });
  },
  onShow: function(){
    this.selectComponent("#im-message").imLogin()
  },
  onReady: function(){
    this.init()
  },
  init: function(){
    let that = this
    if(that.data.invoiceId){
      showLoading()
      getInvoiceTitle(that.data.invoiceId).then((res) =>{
        if(res.data.invoiceType === 1){
          that.setData({
            activeIndex:0,
            tabs: ["电子普通发票(推荐)"],
            isSpecialInvoice:true
          })
        }else if(res.data.invoiceType === 3){
          that.setData({
            activeIndex:1,
            tabs: ["专用发票"],
            isSpecialInvoice:true
          })
        }
        if(res.data.titleType === 1){
          that.setData({
            invoiceInfoType: 'personal'
          })
        }else{
          that.setData({
            invoiceInfoType: 'company'
          })
        }
        that.setData({
          id:res.data.id,
          invoiceType:res.data.invoiceType,
          defaultTitle:res.data.defaultTitle,
          titleType:res.data.titleType,
          titleName:res.data.titleName,
          taxCode:res.data.taxCode,
          registeredAddress:res.data.registeredAddress,
          registeredPhoneNum:res.data.registeredPhoneNum,
          bankAccount:res.data.bankAccount,
          depositBank:res.data.depositBank,
          email:res.data.email,
          username:res.data.username,
          phoneNumber:res.data.phoneNumber,
          address:res.data.address
        })
        wx.hideLoading()
      }).catch((e) => {
        catchLoading(e.errorDetail ? e.errorDetail : e.errorMsg)
      })
    }
  },
  changeData(e) {
    let { type } = e.currentTarget.dataset
    let { value } = e.detail
    if (type) {
      this.setData({
        [type]: String(value).trim()
      })
    }
  },
  tabClick: function(e) {
    this.setData({
        // sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: parseInt(e.currentTarget.id)
    });
  },
  invoiceInfoTypeChange: function (e) {
    this.setData({
      invoiceInfoType: e.currentTarget.dataset.type
    })
  },
  delete: function(e){
    let that = this
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定删除此发票抬头信息？',
      confirmColor: '#E84254',
      success: function (res) {
        if (res.confirm) {
          delInvoiceTitle(id).then((res) =>{
            if(res.success === true){
              wx.showToast({
                title: '删除成功~',
                icon: 'none'
              })
              wx.navigateBack()
            }
          })
        }
      }
    })
  },
  saving: function(){
    if(this.data.invoiceId){
      this.updataInvoice()
    }else{
      if(this.data.activeIndex === 0){
        this.setData({
          invoiceType: 1
        })
        if(this.data.invoiceInfoType === 'company'){
          this.setData({
            titleType: 2
          })
        }else{
          this.setData({
            titleType: 1,
            taxCode:''
          })
        }
        this.ordinary()
      }else{
        this.setData({
          invoiceType: 3,
          titleType: 2
        })
        this.special()
      }
    }
  },
  redirectTo() {
    // wx.redirectTo({
    //   url: '/pages/order/operate-invoice/operate-invoice'
    // })
    wx.navigateBack()
  },
  ordinary: function(){//普通发票
    let { defaultTitle,invoiceType, titleType, titleName, taxCode, email, phoneNumber } = this.data
    if (!validator(phoneNumber, 'phone')) {
      return false
    }
    if (!validator(email, 'email')) {
      return false
    }
    let params = {
      'defaultTitle': defaultTitle,
      'invoiceType': invoiceType,
      'titleType': titleType,
      'titleName': titleName,
      'taxCode': taxCode,
      'email': email,
      'phoneNumber': phoneNumber
    }
    if(this.data.invoiceInfoType === 'company'){
      if(titleName && taxCode && email && phoneNumber){
        showLoading()
        addInvoiceTitle(params)
          .then((res) =>{
            wx.hideLoading()
            if(res.success === true){
              wx.showToast({
                title: '添加成功~',
                icon: 'none'
              })
              setTimeout(() => {
                this.redirectTo()
              }, 800)
            }
          })
          .catch(e => {
            catchLoading(e)
          })
      }else{
        wx.showToast({
          title: '信息不完整,请填写完整信息',
          icon: 'none'
        })
      }
    }else{
      if(titleName && email && phoneNumber){
        showLoading()
        addInvoiceTitle(params)
          .then((res) =>{
            wx.hideLoading()
            if(res.success === true){
              wx.showToast({
                title: '添加成功~',
                icon: 'none'
              })
              setTimeout(() => {
                this.redirectTo()
              }, 800)
            }
          })
          .catch(e => {
            catchLoading(e)
          })
      }else{
        wx.showToast({
          title: '信息不完整,请填写完整信息',
          icon: 'none'
        })
      }
    }
  },
  special: function(){//专用发票
    let { defaultTitle,invoiceType, titleType, titleName, taxCode, registeredAddress, registeredPhoneNum, depositBank, bankAccount, username, phoneNumber, address } = this.data
    if(titleName && taxCode && registeredAddress && registeredPhoneNum && depositBank && bankAccount && username && phoneNumber && address){
      if (!validator(phoneNumber, 'phone')) {
        return false
      }
      let params = {
        'defaultTitle': defaultTitle,
        'invoiceType': invoiceType,
        'titleType': titleType,
        'titleName': titleName,
        'taxCode': taxCode,
        'registeredAddress': registeredAddress,
        'registeredPhoneNum': registeredPhoneNum,
        'depositBank': depositBank,
        'bankAccount': bankAccount,
        'username': username,
        'phoneNumber': phoneNumber,
        'address': address
      }
      showLoading()
      addInvoiceTitle(params)
        .then((res) =>{
          wx.hideLoading()
          if(res.success === true){
            wx.showToast({
              title: '添加成功~',
              icon: 'none'
            })
            setTimeout(() => {
              this.redirectTo()
            }, 800)
          }
        })
        .catch(e => {
          catchLoading(e)
        })
    }else{
      wx.showToast({
        title: '信息不完整,请填写完整信息',
        icon: 'none'
      })
    }
  },
  updataInvoice: function(){
    let { id, defaultTitle,invoiceType, titleName, taxCode, registeredAddress, registeredPhoneNum, depositBank, bankAccount, email, username, phoneNumber, address } = this.data
    let params
    if (!validator(phoneNumber, 'phone')) {
      return false
    }
    if (!validator(email, 'email')) {
      return false
    }
    if(invoiceType === 1){
      params = {
        'id':id,
        'defaultTitle':defaultTitle,
        'invoiceType':invoiceType,
        'titleName':titleName,
        'taxCode':taxCode,
        'email':email,
        'phoneNumber':phoneNumber
      }
      if(this.data.invoiceInfoType === 'company'){
        if(titleName && taxCode && email && phoneNumber){
          showLoading()
          updateInvoiceTitle(params)
            .then((data) =>{
              wx.hideLoading()
              if(data.success === true){
                wx.showToast({
                  title: '修改成功~',
                  icon: 'none'
                })
                setTimeout(() => {
                  this.redirectTo()
                }, 800)
              }
            })
            .catch(e => {
              catchLoading(e)
            })
        }else{
          wx.showToast({
            title: '信息不完整,请填写完整信息',
            icon: 'none'
          })
        }
      }else{
        if(titleName && email && phoneNumber){
          showLoading()
          updateInvoiceTitle(params)
            .then((data) =>{
              wx.hideLoading()
              if(data.success === true){
                wx.showToast({
                  title: '修改成功~',
                  icon: 'none'
                })
                setTimeout(() => {
                  this.redirectTo()
                }, 800)
              }
            })
            .catch(e => {
              catchLoading(e)
            })
        }else{
          wx.showToast({
            title: '信息不完整,请填写完整信息',
            icon: 'none'
          })
        }
      }
    }else if(invoiceType === 3){
      if(titleName && taxCode && registeredAddress && registeredPhoneNum && depositBank && bankAccount && username && phoneNumber && address){
        if (!validator(phoneNumber, 'phone')) {
          return false
        }
        params = {
          'id':id,
          'defaultTitle':defaultTitle,
          'invoiceType':invoiceType,
          'titleName':titleName,
          'taxCode':taxCode,
          'registeredAddress':registeredAddress,
          'registeredPhoneNum':registeredPhoneNum,
          'bankAccount':bankAccount,
          'depositBank':depositBank,
          'username':username,
          'phoneNumber':phoneNumber,
          'address':address
        }
        showLoading()
        updateInvoiceTitle(params)
          .then((data) =>{
            wx.hideLoading()
            if(data.success === true){
              wx.showToast({
                title: '修改成功~',
                icon: 'none'
              })
              setTimeout(() => {
                this.redirectTo()
              }, 800)
            }
          })
          .catch(e => {
            catchLoading(e)
          })
      }else{
        wx.showToast({
          title: '信息不完整,请填写完整信息',
          icon: 'none'
        })
      }
    }
  },
  // 调用微信发票服务
  getWechatInvoice() {
    const that = this
    wx.chooseInvoiceTitle({
      success(res) { 
        delete res.errMsg
        that.assignmentData(res)
      }
    })
  },
  // 将微信发票进行赋值处理
  assignmentData: function(invoiceData){
    this.setData({
      titleName: invoiceData.title,
      bankAccount: invoiceData.bankAccount,
      depositBank: invoiceData.bankName,
      registeredAddress: invoiceData.companyAddress,
      taxCode: invoiceData.taxNumber,
      phoneNumber: invoiceData.telephone,
      invoiceInfoType: invoiceData.type == '0' ? 'company' : 'personal'
    })
  }
})