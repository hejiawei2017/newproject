'use strict';

module.exports = {
  async up(q, s) {
    await q.createTable(
      't_coupon_activity',
      {
        id: { type: s.STRING(32), primaryKey: true },
        master_uuid: { type: s.STRING(32) },
        parent_uuid: { type: s.STRING(32) },
        activity_id: { type: s.STRING(32) },
        master_info: { type: s.STRING(255) },
        parent_info: { type: s.STRING(255) },
        master_coupons_id: { type: s.STRING(32) },
        master_coupons_price: { type: s.STRING(32) },
        parent_coupons_id: { type: s.STRING(32) },
        parent_coupons_price: { type: s.STRING(32) },
        desc: { type: s.STRING(255) },
        create_time: {
          type: s.DATE(0),
          defaultValue: s.fn('current_timestamp'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
      }
    );
    await q.addIndex('t_coupon_activity', ['master_uuid']);
    await q.addIndex('t_coupon_activity', ['parent_uuid']);
    await q.addIndex('t_coupon_activity', ['activity_id']);
    await q.addIndex('t_coupon_activity', ['master_coupons_id']);
    await q.addIndex('t_coupon_activity', ['parent_coupons_id']);
  },
};
