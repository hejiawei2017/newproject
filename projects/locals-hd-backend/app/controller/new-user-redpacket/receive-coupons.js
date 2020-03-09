'use strict';

const BaseController = require('../../core/base-controller');

class ReceiveCouponsController extends BaseController {
  async create() {
    const body = this.filter({
      phone: 'string',
      userInfo: 'string',
      activity_id: 'string',
    });
    if (!body) {
      return;
    }
    const response = await this.service.coupon.create(
      body.activity_id,
      body.phone,
      body.userInfo,
      this.app.const.index.COUPON_CODE.price_100_0.code,
      '100'
    );
    this.ctx.response.auto(response);
  }
}

module.exports = ReceiveCouponsController;
