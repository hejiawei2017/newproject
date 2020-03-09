'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const HandInHand = app.model_hd.define('t_hand_in_hand', {
    id: { type: INTEGER, primaryKey: true },
    master_phone: STRING,
    guest_phone: STRING,
    guest_avatar_url: STRING,
    coupons_id: STRING,
    coupons_price: INTEGER,
    create_time: DATE,
  });

  return HandInHand;
};
