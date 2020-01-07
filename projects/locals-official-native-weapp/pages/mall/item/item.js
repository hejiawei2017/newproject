const {
  shareDataFormat,
  formatParams,
  isHasLogin
} = require("../../../utils/util");
const { tempConfig } = require("../../../server/mall");

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFullScreen: app.globalData.isFullScreen
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let { id = "2" } = options;
    let sceneInviteCode = null;
    if (options.scene) {
      const params = formatParams(options.scene);
      if (params.id) id = params.id;
      if (params.inviteCode) sceneInviteCode = params.inviteCode;
    }
    const inviteCode = wx.getStorageSync("inviteCode");
    // 当缓存无inviteCode，进入页面路径带有inviteCode时，将路径inviteCode存缓存
    if (!inviteCode && options.inviteCode)
      wx.setStorageSync("inviteCode", options.inviteCode);
    else if (!inviteCode && sceneInviteCode)
      wx.setStorageSync("inviteCode", sceneInviteCode);
    console.log(options);

    tempConfig(id)
    .then(res => {
      const item = res;
      if (!res) { throw new Error('no found') }
      this.setData({
        item
      });
    })
    .catch(() => {
      
    })
  },

  _cancelEventFn() {},

  tapPop() {
    this.setData({
      showPop: !this.data.showPop
    });
  },

  navToOrder() {
    if (isHasLogin()) {
      wx.navigateTo({
        url: "../my-order/my-order"
      });
    } else {
      this.selectComponent("#auth-drawer-box").checkRole();
    }
  },

  clickBuy() {
    if (this.data.item.soldout) return;

    if (isHasLogin()) {
      const { type, itemId, items } = this.data.item;
      if (type === "single") {
        this.navOrder(itemId);
        return;
      }

      if (type === "package") {
        this.toggleFilter();
        return;
      }
    } else {
      this.selectComponent("#auth-drawer-box").checkRole();
    }
  },

  toggleFilter() {
    this.setData({
      filterStatus: !this.data.filterStatus
    });
  },

  itemClick({
    currentTarget: {
      dataset: { itemid, index }
    }
  }) {
    this.setData({
      selectItemId: itemid,
      select: index
    });
  },

  next() {
    // if (this.data.selectItemId) {
    //   this.navOrder(this.data.selectItemId);
    // }
    const {selectProduct} = this.data;
    if (selectProduct) {
      wx.navigateTo({
        url: `/pages/mall/order/order?sourcefrom=buy&itemId=${selectProduct.itemId}&plusdesc=${selectProduct.plusdes}`
      });
    }else {
      wx.showToast({
        title: '请选择完整规格',
        icon: 'none',
        duration: 2000, //持续的时间
      });
    }
  },

  navOrder(itemId) {
    wx.navigateTo({
      url: `/pages/mall/order/order?sourcefrom=buy&itemId=${itemId}`
    });
  },

  selectorClick({
    currentTarget: {
      dataset: { selectorindex, itemindex  }
    }
  }) {
    console.log(selectorindex, itemindex);
    const {item} = this.data;
    item.selector[selectorindex].item.forEach((element,index) => {
      if (index === itemindex) {
        element.active = true
      }else {
        element.active = false
      }
    });
    this.handleselectProduct();
    this.setData({
      item
    })
    console.log(item);
  },

  handleselectProduct() {
    const {selector,product} = this.data.item
    let selectorArray = [];
    let priceKey = []; //最终转为product里的key
    let plusdes = [];
    selector.forEach(element => {
      const index = element.item.findIndex(e => e.active);
      if (index != -1) {
        if (element.pricestats) {
          priceKey.push(index); //影响价格的index加入
        }else {
          plusdes.push(element.item[index].content); //把不影响价格的规格加入
        }
        selectorArray.push(index);
      }
    });
    if (selectorArray.length != selector.length) {
      return;
    }
    console.log('KEYYY',priceKey.join(":"));
    const selectProduct = product.find(e => e.key === priceKey.join(":"));
    selectProduct.plusdes = plusdes.join(";")
    this.setData({
      selectProduct
    })
    // selector.filter(e => e.pricestats)
  },
  onShareAppMessage: function() {
    return shareDataFormat({
      title: `${this.data.item.sharetitle}`,
      path: `/pages/mall/item/item?id=${this.data.item.id}`
    });
  }
});
