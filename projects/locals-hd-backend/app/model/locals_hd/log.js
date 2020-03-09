'use strict';

module.exports = app => {
  const Log = require('../../model-define/locals_hd/t_log')(
    app.model_hd,
    app.Sequelize
  );

  Log.error = function(error) {
  	return Log.create({ message: error, id: app.util.id.gen(6) })
  }

  return Log;
};
