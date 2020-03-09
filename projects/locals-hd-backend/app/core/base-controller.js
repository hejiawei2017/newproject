'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(...args) {
    super(...args);
    const errno = this.ctx.response.errno;

    this.service.errno = errno;
    this.ctx.errno = errno;
  }

  filter(rules, type) {
    return this.ctx.filter(rules, type);
  }

  handlerServiceError(data, property = 'data') {
    if (data.errorCode !== this.errno.SUCCESS.errorCode) {
      this.ctx.response.fail(data);
      return;
    }
    this.ctx.response.success(data[property]);
  }

  get errno() {
    return this.ctx.response.errno;
  }

  async fetch(originalURI, requestInfo = {}, originalResponse = false) {
    const { ctx, app } = this;
    const TOKEN_KEY = app.config.AUTHORIZATION_TOKEN_KEY;
    const token = ctx.response.get(TOKEN_KEY);

    const headers = {
      [TOKEN_KEY]: 'Bearer ' + token,
      'content-type': 'application/json',
    };

    if (requestInfo.token === false) {
      delete headers[TOKEN_KEY];
    }

    requestInfo.headers = { ...headers, ...requestInfo.headers };

    // 校验 URL
    const URI = /^http(s?)\:\/\//.test(originalURI)
      ? originalURI
      : `${this.config.BASE_API}${originalURI}`;
    const response = await ctx.curl(URI, requestInfo);
    if (originalResponse) {
      return response;
    }

    if (response.status !== 200) {
      throw new Error(
        `${URI} ${response.status} ${response.res.statusMessage}`
      );
    }
    try {
      const responseJSON = JSON.parse(response.data.toString());
      if (!responseJSON.success) {
        this.logger.error(response);
      }
      return responseJSON;
    } catch (error) {
      this.logger.error(error, response.data.toString());
      throw new Error(`${error} ${response.data.toString()}`);
    }
  }
}

module.exports = BaseController;
