'use strict';

module.exports = app => {
  const InviteStatisics = require('../../model-define/locals_hd/t_invite_statisics')(
    app.model_hd,
    app.Sequelize
  );

  return InviteStatisics;
};
