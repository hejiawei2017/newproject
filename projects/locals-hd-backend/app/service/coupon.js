'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  async getParentLists(activityId, parent_uuid) {
    try {
      const rows = await this.model.Coupon.findAll({
        where: { activity_id: activityId, parent_uuid },
        raw: true,
      });

      return this.success(rows);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async getMasterInfo(activityId, master_uuid) {
    try {
      const rows = await this.model.Coupon.findOne({
        where: { activity_id: activityId, master_uuid },
        raw: true,
      });
      return this.success(rows);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async create(
    activityId,
    master_uuid,
    master_info,
    master_coupons_id,
    master_coupons_price,
    parent_uuid = '',
    parent_info = '',
    parent_coupons_id = '',
    parent_coupons_price = ''
  ) {
    const row = await this.model.Coupon.findOne({
      where: { activity_id: activityId, master_uuid, parent_uuid },
    });

    if (row) {
      return this.errno.EXISTS;
    }

    try {
      if (master_coupons_id) {
        const response = await this.api.coupon.receive({
          code: master_coupons_id,
          mobile: master_uuid,
          fromOrderCode: 1,
          platform: 'MINI_PROGRAM',
        });

        if (!response.success) {
          this.logger.error(
            '发送优惠券失败:',
            master_uuid,
            master_coupons_id,
            response
          );
          return response;
        }
      }

      if (parent_coupons_id) {
        const response = await this.api.coupon.receive({
          code: parent_coupons_id,
          mobile: parent_uuid,
          fromOrderCode: 1,
          platform: 'MINI_PROGRAM',
        });

        if (!response.success) {
          this.logger.error(
            '发送优惠券失败:',
            parent_uuid,
            parent_coupons_id,
            response
          );
          return response;
        }
      }

      await this.model.Coupon.create({
        id: this.app.util.id.new,
        activity_id: activityId,
        master_uuid,
        master_info,
        master_coupons_id,
        master_coupons_price,
        parent_uuid,
        parent_info,
        parent_coupons_id,
        parent_coupons_price,
      });

      return this.errno.SUCCESS;
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async giftPack(code, userId, payTime, itemId) {
    const tid = this.app.util.id.new;
    const oid = this.app.util.id.new;
    this.logger.info('get packet', tid, oid, ...arguments);
    const response = await this.ctx.api.coupon.giftPack({
      giftPackCode: code,
      userId,
      tid,
      oid,
      payTime,
      itemId,
    });
    this.logger.info('get packet response', tid, response);
    return response;
  }
};
