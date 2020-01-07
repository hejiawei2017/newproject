// 绘制流程

const POSTER_STORAGE_KEY = '__POSTER_STORAGE_KEY__';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 海报原图大小
    posterOriginalWidth: { type: Number, value: 750 },
    posterOriginalHeight: { type: Number, value: 1040 },
    // 水印原始大小
    watermarkOriginalWidth: { type: Number, value: 430 },
    watermarkOriginalHeight: { type: Number, value: 430 },
    // 水印在海报中显示的大小
    watermarkWidth: { type: Number, value: 60 },
    watermarkHeight: { type: Number, value: 60 },
    // 水印所在位置
    watermarkPosition: { type: String, value: 'rb' }, // t r b l c (组合)
    watermarkHorizontalPadding: { type: Number, value: 10 },
    watermarkVerticalPadding: { type: Number, value: 10 },
    quality: { type: Number, value: 1 },
  },

  data: {
    posterWidth: 375,
    posterHeight: 667,
    drawed: false,
    progress: 0,
  },

  /**
   * public method
   */
  methods: {
    onDrawError(e) {
      this.triggerEvent("onDrawError", e)
    },

    // 1: 设置海报宽度
    // 2: 获取本地资源
    // 3: 下载资源到本地
    // 4: 绘制
    draw(poster, watermark) {
      const { posterOriginalWidth, posterOriginalHeight } = this.data;
      const { posterWidth, posterHeight } = getPosterScreenSzie(
        posterOriginalWidth,
        posterOriginalHeight
      );
      this.setData({ posterWidth, posterHeight });

      // 本地资源不存在则下载到本地
      // let task = getLocalPaths();
      // task = task
      //   ? task
      //   : downloadPaths([poster, watermark], progress =>
      //       this.setData({ progress })
      //     );
      // TODO: 暂时修复问题，每次都download图片
      let task = downloadPaths([poster, watermark], progress =>
            this.setData({ progress })
          );

      task
        .then(([posterLocalPath, watermarkLocalPath]) => {
          const context = wx.createCanvasContext('poster', this);
          context.drawImage(posterLocalPath, 0, 0, posterOriginalWidth, posterOriginalHeight, 0, 0, posterWidth, posterHeight);
          context.drawImage(
            watermarkLocalPath,
            ...getWatermarkDrawMeta(posterWidth, posterHeight, this.data)
            );
            
          context.draw(false, () => {
            setTimeout(() => this.triggerEvent("onDrawed"))
            wx.setStorageSync(POSTER_STORAGE_KEY, [posterLocalPath, watermarkLocalPath]);
            this.setData({ drawed: true });
          });
        })
        .catch(err => {
          this.triggerEvent("onDrawError", err)
        });
    },

    getPosterPath() {
      const { posterOriginalWidth, posterOriginalHeight, quality, drawed } = this.data;
      return new Promise((resolve, reject) => {
        if (!drawed) {
          reject(new Error('not finished'))
          return
        }

        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: posterOriginalWidth,
          height: posterOriginalHeight,
          canvasId: 'poster',
          quality,
          success: resolve,
          fail: reject,
        }, this);
      })
    },
  },
});

// private method

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
function downloadPromise(url, onProgress) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        wx.downloadFile({
          url: url,
          header: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Connection: 'keep-alive',
          },
          success: resolve,
          fail: reject,
        }).onProgressUpdate(onProgress);
      },
      680
    )
  });
}

/**
 * 下载文件
 *
 * @param {*} path
 */
function downloadPaths(paths, onProgress) {
  const tasks = paths.map(path =>
    downloadPromise(path, ({ progress }) => onProgress(progress))
  );

  return Promise.all(tasks).then(res => res.map(({ tempFilePath }) => tempFilePath));
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
    watermarkOriginalHeight,
  } = posterMeta;
  const [horizontal, vertical] = watermarkPosition.split('');
  let left = 0;
  let top = 0;

  switch (horizontal) {
    case 'r':
      left = posterWidth - watermarkWidth - watermarkHorizontalPadding;
      break;
    case 'c':
      left = (posterWidth - watermarkWidth) * 0.5 + watermarkHorizontalPadding;
      break;
    case 'l':
      left = watermarkHorizontalPadding;
      break;
    default:
      throw new Error(
        `horizontal is not define, you can set watermarkPosition: 'l,r,c'`
      );
      break;
  }

  switch (vertical) {
    case 'b':
      top = posterHeight - watermarkHeight - watermarkVerticalPadding;
      break;
    case 'c':
      top = (posterHeight - watermarkHeight) * 0.5 + watermarkVerticalPadding;
      break;
    case 't':
      top = watermarkVerticalPadding;
      break;
    default:
      throw new Error(
        `horizontal is not define, you can set watermarkPosition: 't,b,c'`
      );
      break;
  }

  return [0, 0, watermarkOriginalWidth, watermarkOriginalHeight, left, top, watermarkWidth, watermarkHeight];
}
