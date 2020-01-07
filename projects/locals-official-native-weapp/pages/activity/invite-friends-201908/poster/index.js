const request = require('../../../../utils/request');
const {
  BASE_API,
  PASTER_IMAGE,
  QRCODE_PREFIX,
  ICONPADDING
} = require('../config');
const {
  shareDataFormat,
  gioTrack
} = require('../../../../utils/util')
const app = getApp();


Page({
  data: {
    parentId: null,
    drawed: false,
    progress: 0,
    // 海报背景原图大小
    posterOriginalWidth: 1244,
    posterOriginalHeight: 1723,
    // 水印原始大小
    watermarkOriginalWidth: 430,
    watermarkOriginalHeight: 430,
    // 水印在海报中显示的大小
    watermarkWidth: 60,
    watermarkHeight: 60,
    // 水印所在位置
    watermarkPosition: "rb", // t r b l c (组合)
    watermarkHorizontalPadding: ICONPADDING,
    watermarkVerticalPadding: 10,
    quality: 1
  },
  onLoad: function (options) {
    gioTrack('invite_friends_poster')
    // if (options.id) {
    //   this.setData({
    //     parentId: options.id
    //   });
    // }
  },

  onShow() {
    wx.pageScrollTo({
      scrollTop: 200
    });
  },

  onReady: function () {
    const {
      userInfo
    } = app.globalData;
    const qs = `id=${userInfo.id}&to=inviteFriends`;
    // `${QRCODE_PREFIX}${res.data}`  `${BASE_API}/house_share/getShareReport`
    request.get(`${BASE_API}/house_share/getQrCode?${qs}`).then(res => {
      if (res && res.data) {
        this.draw(
          PASTER_IMAGE,
          `${QRCODE_PREFIX}${res.data}`
        );
      } else {
        this.errorFn()
      }
    }).catch(e => {
      this.errorFn()
    })
  },

  draw(poster, watermark) {
    const {
      posterOriginalWidth,
      posterOriginalHeight
    } = this.data;
    const {
      nickName
    } = app.globalData.userInfo
    const {
      posterWidth,
      posterHeight
    } = getPosterScreenSzie(
      posterOriginalWidth,
      posterOriginalHeight
    );
    this.setData({
      posterWidth,
      posterHeight
    });
    let task = downloadPaths([poster, watermark], progress =>
      this.setData({
        progress
      })
    );
    task.then(([posterLocalPath, watermarkLocalPath]) => {
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


      const {titleTop, titleLeft, titleWidth} = getTitleTextDrawMeta(posterWidth, posterHeight, this.data)
      context.font="16px 'Helvetica-Bold'";
      context.fillStyle = "black";
      context.textAlign = "left"
      context.fillText(`${nickName}邀请您注册路客会员`, titleLeft,  titleTop, titleWidth)

      context.font="13px 'Helvetica-Bold'";
      context.fillStyle = "#6A6A6A";
      context.textAlign = "left"
      context.fillText(`注册即送100元红包`, titleLeft,titleTop + 20, titleWidth)


      // 画二维码
      context.drawImage(
        watermarkLocalPath,
        ...getWatermarkDrawMeta(posterWidth, posterHeight, this.data)
      );

      // 清空内容
      context.draw(false, () => {
        setTimeout(() => this.triggerEvent("onDrawed"));
        // wx.setStorageSync(POSTER_STORAGE_KEY, [
        //   posterLocalPath,
        //   watermarkLocalPath
        // ]);
        this.setData({
          drawed: true
        });
      });
    })
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
        console.log(filePath)
        wx.saveImageToPhotosAlbum({
          filePath,
          success(res) {
            wx.showToast({
              title: "保存成功，快去邀请好友吧",
              icon: "none"
            });
            gioTrack('invite_friends_poster_save', {tag_name: '保存成功'});
          },
          fail() {
            wx.showModal({
              title: "提示",
              content: "保存失败，请重试",
              showCancel: false
            });
          }
        });
      });
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    const {
      id
    } = app.globalData.userInfo || {};
    gioTrack('invite_friends_share');
    return shareDataFormat({
      title: '送你100元路客精品民宿红包福利，点击领取~',
      path: `/pages/activity/invite-friends-201908/home/index?parentId=${id}`,
      imageUrl: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/invite_friends/banner.png',
    });
  },

  /**
   * 获取二维码失败请求处理函数
   */
  errorFn: function () {
    const that = this
    wx.showModal({
      title: '提示',
      content: '网络异常，生成海报失败',
      cancelText: '返回页面',
      confirmText: '重新获取',
      success(res) {
        if (res.confirm) {
          const url = `/pages/housing/poster/index?houseId=${that.data.houseId}&price=${that.data.price}&title=${that.data.title}&houseImgPath=${that.data.houseImgPath}`;
          wx.redirectTo({
            url
          })
        } else if (res.cancel) {
          wx.navigateBack()
        }
      }
    })
  },
});

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
  return {
    posterWidth,
    posterHeight
  };
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
          if (index === 2) {
            wx.getImageInfo({
              src: res.tempFilePath,
              success(data) {
                posterData = {
                  imageH: data.height,
                  imageW: data.width,
                }
                resolve(res)
              }
            })
          } else {
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
  const tasks = paths.map((path, index) =>
    downloadPromise(path, ({
      progress
    }) => onProgress(progress), index)
  );

  return Promise.all(tasks).then(res =>
    res.map(({
      tempFilePath
    }) => tempFilePath)
  );
}

function getTitleTextDrawMeta (posterWidth, posterHeight, posterMeta) {
  let top = 0;
  let left = 0;
  let width = 0;

  const {
    watermarkHorizontalPadding,
    watermarkVerticalPadding,
    watermarkWidth,
    watermarkHeight,
  } = posterMeta;

  const iconWidth = 70  // 设计图中图标大小

  left =  iconWidth + ICONPADDING + ICONPADDING * 0.5

  top =  posterHeight - iconWidth + ICONPADDING;

  // 减去图标和小程序码的宽度和padding
  width = posterWidth - (iconWidth + ICONPADDING * 2) - (watermarkWidth + watermarkHorizontalPadding * 2);

  return {
    titleTop: top,
    titleLeft: left,
    titleWidth: width
  }
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