'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async index() {
    const { ctx } = this;
    const query = this.filter(
      {
        url: 'string',
        type: { type: 'string' },
        body: { type: 'string' },
        method: { type: 'string', default: 'GET' },
      },
      ctx.query
    );

    if (!query) {
      return;
    }

    const response = await ctx.curl(decodeURIComponent(query.url), {
      method: query.method,
      body: decodeURIComponent(query.body),
    });

    Object.keys(response.headers).forEach(key => {
      ctx.response.set(key, response.headers[key]);
    });

    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Credentials', true);
    ctx.body = response.data;
  }
};
