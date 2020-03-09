'use strict';

const Service = require('egg').Service;

module.exports = class BaseServiceService extends Service {
  get model() {
    return this.app.model_hd;
  }

  get util() {
    return this.app.util;
  }

  get errno() {
    return this.ctx.response.errno;
  }

  get api() {
    return this.ctx.api;
  }

  success(data) {
    return { ...this.errno.SUCCESS, data };
  }
};
