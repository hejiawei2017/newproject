'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async signin() {
    const rule = {
      username: 'string',
      password: 'string',
    };
    const { ctx, service, app } = this;
    const body = ctx.filter(rule);
    if (!body) {
      return;
    }

    const result = await service.login.signin(body.username, body.password);

    if (result.data) {
      ctx.set(app.config.AUTHORIZATION_TOKEN_KEY, result.data);
    }

    ctx.response.auto(result);
  }

  async signout() {
    const { ctx, service, app } = this;
    const result = await service.login.signout(
      ctx.headers[app.config.AUTHORIZATION_TOKEN_KEY]
    );

    ctx.response.set(app.config.AUTHORIZATION_TOKEN_KEY, '');
    ctx.response.auto(result);
  }
};
