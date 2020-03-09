'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  return app.model_hd.define('t_new_user_redpacket', {
    id: { type: INTEGER, primaryKey: true },
    phone: STRING,
  });
};
