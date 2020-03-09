'use strict';
const BaseController = require('../core/base-controller');

module.exports = class extends BaseController {
  /**
   * 领取优惠券、大礼包
   * https://gitee.com/locals-home/dashboard/wikis/locals-home%2Flocals-api-document?doc_id=109742&sort_id=470314
   * @param {*} data 注册信息
   * @return { parmise } 返回 response
   */
  receive(data) {
    return this.fetch('/coupon/record/receive-coupon', { method: 'POST', data });
  }
  /**
   * 领取优惠券、大礼包
   * https://gitee.com/locals-home/dashboard/wikis/locals-home%2Flocals-api-document?doc_id=109742&sort_id=470314
   * @param {*} data 注册信息
   * @return { parmise } 返回 response
   */
  giftPack(data) {
    return this.fetch('/act/gift-pack/mall', { method: 'POST', data });
  }
};

