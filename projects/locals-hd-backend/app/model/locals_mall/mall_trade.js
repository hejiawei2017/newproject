'use strict';

module.exports = app => {
  const MallTrade = require('../../model-define/locals_mall/mall_trade.js')(
    app.model_mall,
    app.Sequelize
  );

  return MallTrade;
};
