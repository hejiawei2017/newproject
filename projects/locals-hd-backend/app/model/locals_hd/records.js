'use strict';

module.exports = app => {
  const Records = require('../../model-define/locals_hd/t_record_text')(
    app.model_hd,
    app.Sequelize
  );

  return Records;
};
