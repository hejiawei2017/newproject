'use strict';
const BaseSerivce = require('../core/base-service');
const defaults = require('lodash/defaults');

module.exports = class extends BaseSerivce {
  getUserInfo(where) {
    return this.app.model_platform.User.findOne({
      where,
      raw: true,
    });
  }

  updateUserInfo(where, userInfo) {
    const row = this.app.model_platform.User.findOne({
      where,
    });

    if (!row) {
      return null;
    }

    defaults(row, userInfo);
    return row.save();
  }
};
