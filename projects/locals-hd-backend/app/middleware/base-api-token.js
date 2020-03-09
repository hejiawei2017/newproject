'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { app, response } = ctx;
    const tokenKey = app.config.AUTHORIZATION_TOKEN_KEY;
    if (!ctx.headers[tokenKey]) {
      response.fail(response.errno.PERMISSION);
      return;
    }
    response.set(tokenKey, ctx.headers[tokenKey].split(' ')[1]);
    await next();
  };
};
