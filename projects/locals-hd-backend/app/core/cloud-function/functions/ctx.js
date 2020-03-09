'use strict';

module.exports = function(options) {
  const allowMethods = 'getFileStream multipart query params header cookies filter oss fetch';
  if (!allowMethods.includes(options.path)) {
    this.logger.error('不允许的方法/属性', options.path);
    return;
  }

  if (options.path === 'header') {
    return {
      get(key) {
        if (key === this.app.config.AUTHORIZATION_TOKEN_KEY) {
          return '';
        }
        this.ctx.get(key);
      },
    };
  }
  const func = this.ctx[options.path];
  if (typeof func === 'function') {
    return (...params) => func.apply(this.ctx, params);
  }
  return func;
};
