'use strict';

const BaseController = require('../../core/base-controller');

class ReceiveCouponsController extends BaseController {
  async create() {
    const { ctx, service, app } = this;
    const { COUPON_CODE } = app.const.index;
    const body = this.filter({
      master_phone: 'string',
      guest_phone: 'string',
      guest_avatar_url: 'string',
    });

    if (!body) {
      return;
    }

    const result = await service.coupon.create(
      '1903120243850',
      body.guest_phone,
      JSON.stringify({ avatar: body.guest_avatar_url }),
      COUPON_CODE.price_300_0.code,
      '300',
      body.master_phone,
      '',
      COUPON_CODE.price_100_0.code,
      '100'
    );
    ctx.response.auto(result);
  }
}

module.exports = ReceiveCouponsController;
