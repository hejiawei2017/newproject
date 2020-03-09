'use strict';

module.exports = app => {
  const StatisticsShare = require('../../model-define/locals_hd/t_statistics_share_relation')(
    app.model_hd,
    app.Sequelize
  );

  return StatisticsShare;
};
