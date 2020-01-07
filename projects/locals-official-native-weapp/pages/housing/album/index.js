const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const { showLoading, catchLoading } = require('../../../utils/util')
const { getHouseDetail } = require('../../../server/housing')

Page({
  houseId: null,
  data: {
    album: [],
    activeIndex: 0
  },
  onLoad(options) {
    const { houseId, key } = options
    this.houseId = houseId
    this.key = key
  },
  onReady() {
    this.getHouseDetail()
  },
  async getHouseDetail() {
    showLoading()
    let { houseId } = this
    const { data: houseInfo } = await getHouseDetail(houseId)
    let album = []
    let activeIndex = 0
		if (houseInfo && houseInfo.houseImagesMap) {
      const { houseImagesMap } = houseInfo
      // 固定输出内容
      const showImageType = ['客厅', '卧室', '书房', '厨房', '卫生间', '阳台', '其他']
      album = Object.keys(houseImagesMap)
      .filter(key => showImageType.includes(key))
      .map(key => {
        const images = houseImagesMap[key]
        const imageMap = Object.keys(images).map(key => ({ key, images: images[key] }))
        // 合并集合下的所有图片
        return {key, albumImages: imageMap}
      })
      let allImages = []
      album.forEach(item => {
        const { albumImages } = item
        Object.keys(albumImages).forEach(key => {
          allImages.push(albumImages[key])
        })
      })
      album.unshift({
        key: '全部',
        albumImages: allImages
      })
      album.some((item, index) => {
        if (item.key === this.key) {
          activeIndex = index
        }
      })
    }
    wx.hideLoading()
    this.setData({
      album,
      activeIndex
    }, this.setSwiperHeight)
  },
  bindClickIndex (e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    });
  },
  bindchange(e) {
    const { source, current } = e.detail
    const { activeIndex } = this.data
    const types = ['touch']
    if (types.includes(source) && activeIndex !== current) {
      this.setData({
        activeIndex: current
      }, this.setSwiperHeight)
    }
  },
  setSwiperHeight() {
    const { activeIndex } = this.data
    const that = this
    const query = wx.createSelectorQuery()
    query.select(`#swiper-item-${activeIndex}`).boundingClientRect()
    query.exec(function (res) {
      if (res[0] && res[0]['height']) {
        const { height } = res[0]
        that.setData({
          swiperHeight: height
        })
      }
    })
  },
  previewImage(e) {
    const { url } = e.currentTarget.dataset
    const { activeIndex, album } = this.data
    const { albumImages } = album[activeIndex]
    const urls = []
    albumImages.forEach(albumItem => {
      albumItem.images.forEach(imageItem => {
        const { imagePath = '' } = imageItem
        urls.push(imagePath)
      })
    })
    wx.previewImage({
      urls,
      current: url
    })
  }
})