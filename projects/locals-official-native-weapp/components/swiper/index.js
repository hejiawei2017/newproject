const { postCollct } = require('../../server/housing');
const { isHasLogin, switchNavigate, gioTrack } = require('../../utils/util')

Component({
  properties: {
    // 图片mode
    mode: {
      type: null,
      value: ''
    },
    firstImageSetAspectFill: {
      type: Boolean,
      value: false
    },
    // 是否自动填充高度
    isAutoHeight: {
      type: Boolean,
      value: false
    },
    // swiper 的高度
    height: {
      type: String,
      value: '150rpx'
    },
    backgroundColor: {
      type: String,
      value: '#655959'
    },
    paginationStyle: {
      type: String
    },
    // 指示点横向定位
    indicatorDotsRowStyle: {
      type: String,
      value: 'left: 50%; transform: translateX(-50%);'
    },
    indicatorDotsColumnStyle: {
      type: String,
      value: 'left: 50%; transform: translateX(-50%); bottom: 22rpx;'
    },
    imgUrls: { //图片地址数组
      type: Array,
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 打开的webview，对于图片索引
    webViewUrls: {
      type: Array,
      value: []
    },
    // 打开的图片对应的标题，对于图片索引
    titles: {
      type: Array,
      value: []
    },
    autoplay: { //是否自动切换
      type: Boolean,
      value: false,
    },
    indicatorDots: {//是否显示面板指示点
      type: Boolean,
      value: false,
    },
    isShowOperateBtn: { //是否显示操作按钮
      type: Boolean,
      value: false
    },
    isShowPagination: { //是否显示页码
      type: Boolean,
      value: false
    },
    isShowShare: {
      type: Boolean,
      value: true
    },
    houseId: {
      type: String,
      value: ''
    },
    isFavorate: {
      type: Boolean,
      value: false
    },
    // 是否启动预览图片功能
    isPreviewImage: {
      type: Boolean,
      value: false
    },
    // 收藏后的回调
    collectioned: {
      type: Function
    },
    isOpenWebView: { //打开webview页面
      type: Boolean,
      value: false
    },
    imageBackgroundColor: {
      type: String,
      value: '#675959'
    },
    houseInfo:{
      type: Object,
      value: {}
    },
    // 房源列表封面横向主图
    horizontalMainPic: {
      type: String,
      value:''
    },
    // 点的样式
    dotItemStyle: {
      type: String,
      value: ''
    },
    // 是否立即分享，不跳转poster页
    shareNow: {
      type: Boolean,
      value: false
    },
    // 详情页绘制的分享图片
    canvasImg: {
      type: String,
      value: ''
    },
    // 使用类型标识
    userType: {
      type: String,
      value: ''
    },
    shareIcon: {
      type: String,
      value: 'https://oss.localhome.cn/new_icon/share.png'
    },
    shareIconAnimate: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imagesInfo: {},
    // 索引从0开始
    currentIndex: 0, //当前swiper-item 滑动到的index
    heart: 'https://oss.localhome.cn/new_icon/heart.png',
    heartHot: 'https://oss.localhome.cn/new_icon/heart-hot.png',
    openWebView: false,
    webViewUrl: '',
    currentHeigth: 250,
    imagesMode: null,
    loadingStatus: null,
    errorReloadCount: 3,
    // 每张image,它的索引对应它的key值
    loadedCount: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    collection(e) {
      let params = {
        houseSourceId:e.currentTarget.dataset.id
      }
      if (!isHasLogin()) {
        this.triggerEvent('collectioned', {success: false})
      } else {
        postCollct(params)
            .then((res)=>{
              if(res.data === 'create'){
                this.setData({
                  isFavorate: true
                })
                wx.showToast({
                  title: '收藏成功~',
                  icon: 'none'
                })
                this.triggerEvent('collectioned', {
                  success: true,
                  houseSourceId: params.houseSourceId,
                  data: res.data
                })
                gioTrack('detail_like', {tag_name:'收藏'});
              }else if(res.data === 'delete'){
                this.setData({
                  isFavorate: false
                })
                wx.showToast({
                  title: '已取消收藏~',
                  icon: 'none'
                })
                this.triggerEvent('collectioned', {
                  success: true,
                  houseSourceId: params.houseSourceId,
                  data: res.data
                })
                gioTrack('detail_like', {tag_name:'取消'});
              }
            })
            .catch(() => {
              this.triggerEvent('collectioned', {success: false})
            })
      }
    },
    setSwiperHeight() {
      if (this.data.isAutoHeight) {
        let index = this.data.currentIndex
        // 获取'image-{{index}}'格式的图片
        const query = wx.createSelectorQuery().in(this)
        query.select('.image-' + index).boundingClientRect()
        query.exec(res => {
          let imageInfo = res[0]
          if (imageInfo) {
            this.setData({
              currentHeigth: imageInfo.height
            })
          }
        })
      }
    },
    loadedImage(e) {
      let { mode } = this.data
      let { currentTarget, detail } = e
      let { dataset } = currentTarget
      let { index } = dataset
      let { width, height } = detail
      let modeTemp = ''
      // index 为 0 的首图采用铺满居中
      // 如果没传默认mode，则自动根据宽高变化
      if (!mode && index !== 0) {
        // 竖图使用 aspectFill， 横图使用 widthFix
        if (width >= height) {
          modeTemp = 'widthFix'
        } else {
          modeTemp = 'aspectFill'
        }
      } else {
        modeTemp = mode
      }

      this.setData({
        imagesMode: {
          ...this.data.imagesMode,
          [index]: modeTemp
        },
        loadingStatus: {
          ...this.data.loadingStatus,
          [index]: true
        }
      })
    },
    _onChangeSwiperCurrent(e) {
      const { source, current } = e.detail
      const { currentIndex } = this.data
      const types = ['autoplay', 'touch']
      if (types.includes(source) && currentIndex !== current) {
        this.setData({
          currentIndex: parseInt(current, 10)
        })
        this.setSwiperHeight()
      }
    },
    //点击swiper时的处理方式
    hanleSwiperItemClickEvent(e) {
      let index = e.currentTarget.dataset.index
      const title = e.currentTarget.dataset.title
      if (this.data.isPreviewImage) {//图片全屏
        wx.previewImage({
          current: this.data.imgUrls[index],
          urls: this.data.imgUrls
        })
      } else if (this.data.isOpenWebView) { //打开webview页面
        let url = this.data.webViewUrls[index]
        let title = this.data.titles[index]
        switchNavigate(url, 'index_ads', title)
      }
      if(this.data.userType === 'index_banner') gioTrack('index_banners', {tag_name: title});
    },
    // 在图片卡顿时自动跳到图片位置
    bindanimationfinish(e) {
      console.log('bindanimationfinish', e, this.data.currentIndex)
    },
    binderror(e) {
      let { index } = e.currentTarget.dataset
      let { imgUrls, loadedCount, errorReloadCount } = this.data

      let currentCount = loadedCount[index] ? loadedCount[index] : 0
      // 每张图片获取 errorReloadCount 次
      if (currentCount < errorReloadCount) {
        imgUrls[index] = imgUrls[index] + ' '

        this.setData({
          imgUrls: [].concat(imgUrls),
          loadedCount: {
            ...loadedCount,
            [index]: currentCount + 1
          }
        })
      }
    },
    goPoster(){
      let {standardPrice,title,id}=this.data.houseInfo;
      const houseImgPath = this.data.imgUrls[0]
      const canvasImg = this.data.canvasImg
      gioTrack('detail_share');
      if(houseImgPath === '' || houseImgPath === '') return
      wx.navigateTo({url:`/pages/housing/poster/index?price=${standardPrice}&title=${title}&houseId=${id}&canvasImg=${canvasImg}&houseImgPath=${houseImgPath}`})
    }
  }
})
