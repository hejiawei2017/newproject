// pages/housing/poster/index.js
const request = require("../../../utils/request");
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const { shareDataFormat, gioTrack } = require("../../../utils/util")
const POSTER_STORAGE_KEY = "__POSTER_STORAGE_KEY__";
const app = getApp();

let posterData = {}

const {
  BASE_API,
  playNotice,
  stopNoticeTimer
} = require('../shared')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    houseImgPath:"",
    posterWidth: 375,
    posterHeight: 450,
    drawed: false,
    progress: 0,
    // 海报背景原图大小
    posterOriginalWidth: 750,
    posterOriginalHeight: 943,
    // 房源图片原始大小
    houseImageOriginWidth:640,
    houseImageOriginHeight:427,
    // 水印原始大小
    watermarkOriginalWidth: 430,
    watermarkOriginalHeight: 430,
    // 水印在海报中显示的大小
    watermarkWidth: 60,
    watermarkHeight: 60,
    // 水印所在位置
    watermarkPosition: "rb", // t r b l c (组合)
    watermarkHorizontalPadding: 130,
    watermarkVerticalPadding: 5,
    quality: 1,
    houseId: "",
    price:'0',
    title:"",
    canvasImg:'',
    notice:{}, // 分享的notice
    myBonus: 0, // 我的奖励,
    bonusShareDetail: [], // 分享的明细
    bonusSharePage: { // 分享的页数查询条件
      page: 1,
      pageSize: 10
    },
    hasMoreShareDetail: true // 是否有更多分享明细
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {price,title,houseId,houseImgPath,canvasImg}=options;
    // 格式化处理图片
    houseImgPath += "?x-oss-process=image/resize,w_640,limit_0/quality,Q_100";
    this.setData({price,title,houseId,houseImgPath,canvasImg})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const { userInfo } = app.globalData;
    const selfInviteCode = wx.getStorageSync('selfInviteCode')
    const qs = `scene=${encodeURIComponent(
      `houseFromUserId=${userInfo.id}`
    )}&path=${encodeURIComponent(
      `pages/index/index?navigateToHouseDetailId=${this.data.houseId}&inviteCode=${selfInviteCode}&parentId=${userInfo.id}`
    )}`;
    request.get(`${BASE_API}/common/qrcode?${qs}`).then(res => {
      if (res && res.data){
        this.draw(
          "https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/share/share%202.png",
          `https://uat.localhome.cn${res.data}`
        );
      }else {
        this.errorFn()
      }
    }).catch(e => {
      this.errorFn()
    });
  },
  /**
   * 获取二维码失败请求处理函数
   */
  errorFn: function() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '网络异常，生成海报失败',
      cancelText: '返回页面',
      confirmText: '重新获取',
      success(res) {
        if (res.confirm) {
          const url = `/pages/housing/poster/index?houseId=${that.data.houseId}&price=${that.data.price}&title=${that.data.title}&houseImgPath=${that.data.houseImgPath}`;
          wx.redirectTo({ url })
        } else if (res.cancel) {
          wx.navigateBack()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.startNotice() // 开始notice轮播  暂时不启用
    this.getMyBonus() // 获取当前获得的奖金
    this.showMoreDetail() // 获取分享的记录
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    stopNoticeTimer.call(this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    stopNoticeTimer.call(this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 跳转余额界面
   */
  toBalance () {
    wx.navigateTo({
      url: '/pages/mine/balance/balance'
    })
  },

  /**
   * 分页获取分享的记录（被分享者获取100元）
   */
  async showMoreDetail () {
    const {page, pageSize} = this.data.bonusSharePage
    const userId = wx.getStorageSync('userInfo').id
    const res = await request.get(`${BASE_API}/house_share/getShareReport`, {userId, page, pageSize})
    if (res.success) {
      const cached = Array.isArray(res.data) ? res.data : []
      const concatArr = []
      if (cached.length < this.data.bonusSharePage.pageSize) { // 如果返回的数据没有足够多条，则没有更多
        this.setData({
          hasMoreShareDetail: false
        })
      }
      cached.forEach(item => { // 如果原先已经包含这条记录，则这条记录不要增加重复展示出来
        const has = this.data.bonusShareDetail.filter(detail => {detail.id === item.id})
        if (has.length > 0) return
        concatArr.push(item)
      })
      this.setData({
        bonusShareDetail: this.data.bonusShareDetail.concat(concatArr),
        bonusSharePage: {
          page: this.data.bonusSharePage.page + 1,
          pageSize: 10
        } 
      })
    } else {
      wx.showToast({
        title: res.errorDetail || res.errorMsg,
        icon: 'none',
        duration: 1500, //持续的时间
      });
      return
    }
  },

  async startNotice() {
    const notices = await this.getNoticesList()
    playNotice.call(this, notices, true)
  },
  // 获取随机数
  randomCount(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

/**
 * 获取notice列表
 */
  async getNoticesList() {
    const res = await request.get(`${BASE_API}/house_share/getSharers`, {
      size: 500
    })
    let sharers = []
    sharers = res.success ? res.data : []
    const notices = sharers.map(sharer => {
      const {
        nick_name,
        avatar
      } = sharer
      const money = this.randomCount(500, 3)
      return {
        avatar,
        content: `${nick_name}通过分享累计赚的${money}元`
      }
    })
    return notices
  },
  /**
   * 获取奖励金额
   */
  async getMyBonus () {
    const res = await request.get(`${BASE_API}/house_share/getAllBonus`, {
      userId: wx.getStorageSync('userInfo').id
    })
    if (res.success) {
      this.setData({
        myBonus: res.data
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const { title } = this.data;
    const { userInfo } = app.globalData || {};
    gioTrack('tap_house_share');
    return shareDataFormat({
      title,
      path: `/pages/index/index?navigateToHouseDetailId=${this.data.houseId}&parentId=${userInfo.id || ''}`,
      imageUrl: this.data.canvasImg
    });
  },
  onDrawError(e) {
    this.triggerEvent("onDrawError", e);
  },

  // 1: 设置海报宽度
  // 2: 获取本地资源
  // 3: 下载资源到本地
  // 4: 绘制
  draw(poster, watermark) {
    const { posterOriginalWidth, posterOriginalHeight,houseImageOriginWidth,houseImageOriginHeight,title,price,houseId,houseImgPath } = this.data;
    const { posterWidth, posterHeight } = getPosterScreenSzie(
      posterOriginalWidth,
      posterOriginalHeight
    );
    const houseImageHeight = getPosterScreenSzie(
      houseImageOriginWidth,
      houseImageOriginHeight
    ).posterHeight
    const houseImageWidth=getPosterScreenSzie(
      houseImageOriginWidth,
      houseImageOriginHeight
    ).posterWidth
    
    this.setData({ posterWidth, posterHeight });

    // 本地资源不存在则下载到本地
    // let task = getLocalPaths();
    // task = task
    //   ? task
    //   : downloadPaths([poster, watermark, houseImgPath], progress =>
    //       this.setData({ progress })
    //     );
    // 每次都生成
    let task=downloadPaths([poster, watermark, houseImgPath], progress =>
      this.setData({ progress })
    );
    task
      .then(([posterLocalPath, watermarkLocalPath, houseLocalImgPath]) => {
        const context = wx.createCanvasContext("poster", this);
        // 画背景
        context.drawImage(
          posterLocalPath,
          0,
          -20,
          posterOriginalWidth,
          posterOriginalHeight,
          0,
          0,
          posterWidth,
          posterHeight
        );
        // 画房源图片
        const houseImageSize = this.calculate(houseImageWidth,houseImageHeight) 
        context.drawImage(houseLocalImgPath,houseImageSize.sx,houseImageSize.sy,houseImageOriginWidth,houseImageOriginHeight,0,0,houseImageWidth,houseImageHeight)
        // 画二维码
        context.drawImage(
          watermarkLocalPath,
          ...getWatermarkDrawMeta(posterWidth, posterHeight, this.data)
        );
        // 画价格标题文字
        context.fillStyle="#000000";
        context.font="27px 'Helvetica-Bold'";
        context.textAlign="left"
        context.fillText(price, getRightHeight(35), getRightHeight(300))
        context.font="15px 'Helvetica-Bold'";
        context.fillText("￥", getRightHeight(20), getRightHeight(300))
        context.fillText(title.substr(0, 18), getRightHeight(100), getRightHeight(280))
        context.fillText(title.substr(18, 18) + "...", getRightHeight(100), getRightHeight(300))  
        context.fillStyle="black";
        context.textAlign="center"
        context.fillText("这套民宿美哭了，扫码还能领 新人100元红包", houseImageWidth / 2, houseImageHeight + getRightHeight(100))
        let texWidth=context.measureText("这套民宿美哭了，扫码还能领 新人100元红包").width
        let titleWidthEx=context.measureText("这套民宿美哭了，扫码还能领 ").width
        context.textAlign="left"
        context.fillText("首单立减更实惠", (posterWidth - texWidth) / 2, houseImageHeight + getRightHeight(120))
        context.fillStyle="#e73c50";
        let titleWidth=context.measureText("新人100元红包").width;
        context.fillRect((posterWidth - texWidth) / 2 + titleWidthEx - 2, houseImageHeight + getRightHeight(85), titleWidth + 4, getRightHeight(20))
        context.fillStyle = "#ffffff";
        context.fillText("新人100元红包", (posterWidth - texWidth) / 2 + titleWidthEx, houseImageHeight + getRightHeight(100))

        
          // 清空内容
        context.draw(false, () => {
          setTimeout(() => this.triggerEvent("onDrawed"));
          wx.setStorageSync(POSTER_STORAGE_KEY, [
            posterLocalPath,
            watermarkLocalPath,
            houseLocalImgPath
          ]);
          this.setData({ drawed: true });
        });
      })
      .catch(err => {
        this.triggerEvent("onDrawError", err);
      });
  },

  // 计算房源图片显示尺寸
  calculate(houseImageWidth,houseImageHeight){
    let houseImageSize = {
      sx:0,
      sy:0,
    }
    if (JSON.stringify(posterData) == "{}") return houseImageSize
    const imageH = posterData.imageH
    const imageW = posterData.imageW
    if(imageH > imageW){
      const dHeight = parseInt((houseImageWidth / imageW) * imageH)
      houseImageSize = {
        sx:0,
        sy: dHeight - houseImageHeight,
      }
    }else if (imageW > imageH){
      const dWidth = parseInt((houseImageHeight / imageH) * imageW)
      houseImageSize = {
        sx: dWidth - houseImageWidth > 0 ? dWidth - houseImageWidth : 0,
        sy:0,
      }
    }
    return houseImageSize
  },

  getPosterPath() {
    const {
      posterOriginalWidth,
      posterOriginalHeight,
      quality,
      drawed
    } = this.data;
    return new Promise((resolve, reject) => {
      if (!drawed) {
        reject(new Error("not finished"));
        return;
      }

      wx.canvasToTempFilePath(
        {
          x: 0,
          y: 0,
          width: posterOriginalWidth,
          height: posterOriginalHeight,
          canvasId: "poster",
          quality,
          success: resolve,
          fail: reject
        },
        this
      );
    });
  },
  saveToAlbum() {
    this.getPosterPath()
      .then(({ tempFilePath: filePath }) => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success(res) {
            wx.showToast({
              title: "保存成功",
              icon: "none"
            });
            gioTrack('save_house_qr', {tag_name: '保存成功'});
          },
          fail() {
            wx.showModal({
              title: "提示",
              content: "保存失败",
              showCancel: false
            });
          }
        });
      });
  }
});

// private method

/**
 * 获取动态高度以适配多种机型
 *
 * @param {*} height
 * @returns
 */
function getRightHeight(height) {
  const posterWidth = wx.getSystemInfoSync().screenWidth;
  return (height / 375) * posterWidth
}

/**
 * 获取海报在屏幕上显示的宽高
 *
 * @param {*} originalWidth
 * @param {*} originalHeight
 * @returns
 */
function getPosterScreenSzie(originalWidth, originalHeight) {
  const systemInfo = wx.getSystemInfoSync();
  const posterWidth = systemInfo.screenWidth;
  const posterHeight = (originalHeight / originalWidth) * posterWidth;
  return { posterWidth, posterHeight };
}

/**
 * 本地文件是否存在
 *
 * @returns
 */
function getLocalPaths() {
  const localFilePaths = wx.getStorageSync(POSTER_STORAGE_KEY);
  if (!localFilePaths) {
    return false;
  }

  const fileManager = wx.getFileSystemManager();
  for (let index = 0; index < localFilePaths.length; index++) {
    const path = localFilePaths[index];
    try {
      fileManager.accessSync(path);
    } catch (error) {
      return false;
    }
  }
  return Promise.resolve(localFilePaths);
}

/**
 * 下载方法 promise 化
 *
 * @param {*} url
 * @param {*} onProgress
 * @returns
 */
function downloadPromise(url, onProgress, index) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.downloadFile({
        url: url,
        header: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Connection: "keep-alive"
        },
        success(res) {
          if(index === 2){
            wx.getImageInfo({
              src: res.tempFilePath,
              success(data) {
                posterData = {
                  imageH:data.height,
                  imageW:data.width,
                }
                resolve(res)
              }
            })
          }else{
            resolve(res)
          }
        },
        fail: reject
      }).onProgressUpdate(onProgress);
    }, 680);
  });
}

/**
 * 下载文件
 *
 * @param {*} path
 */
function downloadPaths(paths, onProgress) {
  const tasks = paths.map((path,index) =>
    downloadPromise(path, ({ progress }) => onProgress(progress),index)
  );

  return Promise.all(tasks).then(res =>
    res.map(({ tempFilePath }) => tempFilePath)
  );
}

/**
 * 获取水印的绘制数据
 *
 * @param {*} params
 */
function getWatermarkDrawMeta(posterWidth, posterHeight, posterMeta) {
  const {
    watermarkPosition,
    watermarkHorizontalPadding,
    watermarkVerticalPadding,
    watermarkWidth,
    watermarkHeight,
    watermarkOriginalWidth,
    watermarkOriginalHeight
  } = posterMeta;
  const [horizontal, vertical] = watermarkPosition.split("");
  let left = 0;
  let top = 0;

  switch (horizontal) {
    case "r":
      left = posterWidth - watermarkWidth - watermarkHorizontalPadding;
      break;
    case "c":
      left = (posterWidth - watermarkWidth) * 0.5 + watermarkHorizontalPadding;
      break;
    case "l":
      left = watermarkHorizontalPadding;
      break;
    default:
      throw new Error(
        `horizontal is not define, you can set watermarkPosition: 'l,r,c'`
      );
      break;
  }

  switch (vertical) {
    case "b":
      top = posterHeight - watermarkHeight - watermarkVerticalPadding;
      break;
    case "c":
      top = (posterHeight - watermarkHeight) * 0.5 + watermarkVerticalPadding;
      break;
    case "t":
      top = watermarkVerticalPadding;
      break;
    default:
      throw new Error(
        `horizontal is not define, you can set watermarkPosition: 't,b,c'`
      );
      break;
  }

  return [
    0,
    0,
    watermarkOriginalWidth,
    watermarkOriginalHeight,
    left,
    top,
    watermarkWidth,
    watermarkHeight
  ];
}
