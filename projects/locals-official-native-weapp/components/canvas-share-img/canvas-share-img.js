const { catchLoading } = require('../../utils/util');
Component({
  properties: {
    imageUrl: {
      type: String,
      value: false,
      observer: function(value) {
        if (value) {
          this.doCanvas(value);
        }
      },
    },
    width: { type: Number, value: 250 },
    height: { type: Number, value: 200 },
  },

  data: {},

  methods: {
    // 绘制图片
    doCanvas(path) {
      const that = this;
      const ctx = wx.createCanvasContext('customCanvas',this);
      const originW = this.data.width
      const originH = this.data.height
      try {
        wx.getImageInfo({
          src: path,
          success(res) {
            const imageW = res.width;
            const imageH = res.height;
            const path = res.path
            let dWidth = originW;
            let dHeight = (originW / imageW) * imageH;
            let dx = 0;
            let dy = -(dHeight - originH) / 2;
            if(imageW > imageH){
              dWidth = (originH / imageH) * imageW;
              dHeight = originH;
              dx = - (dWidth-originW) / 2;
              dy = 0
            }
            ctx.drawImage(
              path, 
              dx,
              dy, 
              dWidth, 
              dHeight
            );
            ctx.draw(false, () => {
              wx.canvasToTempFilePath(
                {
                  canvasId: 'customCanvas',
                  success(res) {
                    const canvasImg = res.tempFilePath;
                    that.triggerEvent('canvasOver', { canvasImg }, {});
                  },
                  fail(e) {
                    console.log(e);
                  },
                },
                that
              );
            });
          },
        });
      } catch (e) {
        catchLoading(e);
      }
    },
  },
});
