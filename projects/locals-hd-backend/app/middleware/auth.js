'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { app, response } = ctx;
    const tokenKey = app.config.AUTHORIZATION_TOKEN_KEY;
    if (!ctx.headers[tokenKey]) {

      this.logger.errno('token 不存在' + ctx.url);
      response.fail(response.errno.PERMISSION);
      return;
    }

    let token = ctx.headers[tokenKey];
    const userInfo = await app.sessionStore.get(token);

    // 必须经过登录接口登录后保存用户的登录数据
    if (!userInfo) {
      response.fail(response.errno.PERMISSION);
      return;
    }

    // 超过三十分钟, 刷新一下 token, 老 token 在一分钟后失效
    if (Date.now() - userInfo.create_time > 1000 * 60 * 30) {
      await app.sessionStore.set(token, userInfo, 60000);
      const authResponse = await ctx.api.base.auth(
        userInfo.username,
        userInfo.password
      );

      if (!authResponse.success) {
        response.fail(authResponse);
        return;
      }

      userInfo.create_time = Date.now();
      token = authResponse.data;
      app.sessionStore.set(token, userInfo);
    }

    ctx.set(tokenKey, token);
    await next();
  };
};
