'use strict';
const BaseController = require('../core/base-controller');

module.exports = class extends BaseController {
  /**
   * 修改订单价格
   * https://gitee.com/locals-home/dashboard/wikis/locals-home%2Flocals-api-document?doc_id=109742&sort_id=1341519
   *
   * @param {*} data 订单 ID & 订单价格 { id, payment }
   * @return { parmise } 返回 response
   */
  modifyPrice(data) {
    return this.fetch('/mall/trade/price', { method: 'PUT', data, token: false });
  }
};

