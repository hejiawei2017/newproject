'use strict';

module.exports = app => {
  return require('../../model-define/locals_hd/t_configs')(
    app.model_hd,
    app.Sequelize
  );
};
