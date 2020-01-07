Component({
  properties: {
    showPermissonDialog: {
      type: Boolean,
      value: false
    },
    requestPermission: {
      type: String,
      value: ''
    },
    permissionDesc: {
      type: String,
      value: ''
    }
  },
  data: {
  },
  lifetimes: {
    attached: function () {
      console.log('ddidididi',this.properties.showPermissonDialog);
    },
    detached: function () {
      this.setData({
        showPermissonDialog: false
      })
    },
  },
  methods: {
    // 这里是一个自定义方法
    checkAuthor() {
      console.log('fuuuu');
      const self = this;
      wx.getSetting({
        success(res) {
          console.log(res);
          if (res.authSetting[self.properties.requestPermission] === false) {
            self.setData({
              showPermissonDialog: true
            })
          }
        },
        fail(e) {
          console.log(e);
        }
      })
    },
    cancelPick() {
      this.setData({
        showPermissonDialog: false
      })
    }
  }

});