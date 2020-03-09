'use strict';

module.exports = {
  async up(q, s) {
    await q.changeColumn('t_coupon_activity', 'master_info', { type: s.TEXT });
    await q.changeColumn('t_coupon_activity', 'parent_info', { type: s.TEXT });
  },
};
