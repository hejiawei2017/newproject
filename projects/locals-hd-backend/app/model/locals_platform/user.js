'use strict';
module.exports = app => {

  const User = require('../../model-define/locals_platform/pf_user')(
    app.model_platform,
    app.Sequelize
  );
  return User;
};
