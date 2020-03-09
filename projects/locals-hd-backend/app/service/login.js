/*
 * @Author:  欧阳鑫
 * @Date: 2019-01-24 14:03:15
 * @Last Modified by: wolong
 * @Last Modified time: 2019-01-25 14:22:55
 */
'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
  async signin(username, password) {
    const { app, service, ctx } = this;
    try {
      if (app.config.env === 'local') {
        const response = { success: true, data: 'mock_token_from_local' };
        await ctx.response.set(
          app.config.AUTHORIZATION_TOKEN_KEY,
          response.data
        );
        await app.sessionStore.set(response.data, {
          username,
          password,
          user_id: 'mock',
        });
        return response;
      }

      const response = await ctx.api.base.auth(username, password);
      if (!response.success) {
        this.logger.info('user login fail: ', username);
        return response;
      }

      await ctx.response.set(app.config.AUTHORIZATION_TOKEN_KEY, response.data);
      const userInfoResponse = await ctx.api.base.getUserInfo();
      if (!userInfoResponse.success) {
        this.logger.info('user login fail: ', username);
        return userInfoResponse;
      }

      await app.sessionStore.set(response.data, {
        username,
        password,
        user_id: userInfoResponse.data.id,
      });
      this.logger.info('user login success', userInfoResponse.data.id);
      return response;
    } catch (error) {
      this.logger.error(error);
      return service.errno.SERVER;
    }
  }

  async signout(token) {
    const { app, service } = this;
    try {
      await app.sessionStore.destroy(token);
      return service.errno.SUCCESS;
    } catch (error) {
      return service.errno.SERVER;
    }
  }
}

module.exports = LoginService;
