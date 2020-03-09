'use strict';

module.exports = app => {
  const Records = require('../../model-define/locals_hd/t_report_handler_code')(
    app.model_hd,
    app.Sequelize
  );

  return Records;
};
