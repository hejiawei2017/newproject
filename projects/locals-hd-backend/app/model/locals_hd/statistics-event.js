'use strict';

module.exports = app => {
  const StatisticsShare = require('../../model-define/locals_hd/t_statistics_event')(
    app.model_hd,
    app.Sequelize
  );

  return StatisticsShare;
};
