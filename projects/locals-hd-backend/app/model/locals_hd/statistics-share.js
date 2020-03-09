'use strict';

module.exports = app => {
  const StatisticsShare = require('../../model-define/locals_hd/t_statistics_share')(
    app.model_hd,
    app.Sequelize
  );

  return StatisticsShare;
};
