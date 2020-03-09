'use strict';

module.exports = app => {
  const RecordsFormid = require('../../model-define/locals_hd/t_records_formid')(
    app.model_hd,
    app.Sequelize
  );

  return RecordsFormid;
};
