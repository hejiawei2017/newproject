'use strict';

const BaseController = require('../../core/base-controller');
const moment = require('moment');

class InviteUsersController extends BaseController {
  async show() {
    const { ctx, errno } = this;
    try {
      const response = await this.service.coupon.getParentLists('1903120243850', ctx.params.id);
      if (!response.success) {
        ctx.body = response;
      }

      const rows = response.data.map(item => {
        let guestInfo = { avatar: '' };
        try {
          guestInfo = JSON.parse(item.master_info);
        } catch (error) {
          // 忽略
        }
        const phoneReg = /^(\d{4}).*(\d{3})$/;
        return {
          guest_phone: item.master_uuid.replace(phoneReg, '$1****$2'),
          coupons_price: item.master_coupon_price,
          guest_avatar_url: guestInfo.avatar,
          create_time: moment(item.create_time).format('YYYY/MM/DD'),
        };
      });

      ctx.response.success({ rows, count: rows.length });
    } catch (error) {
      ctx.response.fail(errno.SERVER, error);
    }
  }
}

module.exports = InviteUsersController;
