'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async show() {
    // 参数 s 与 n, s 表示子空间， n 表示父空间
    // redis n/id/s
    const { ctx, app, errno } = this;
    const { query } = ctx;
    const id = encodeURIComponent(ctx.params.id);
    try {
      let data = null;
      if (query.s || query.n) {
        data = await app.sessionStore.getWithNamespace(`${id}/${query.s}`, query.n);
      } else {
        data = await app.sessionStore.get(id);
      }
      ctx.response.success(data);
    } catch (error) {
      ctx.response.fail(errno.SERVER);
    }
  }

  async desctroy() {
    const { ctx, app, errno } = this;
    const { query } = ctx;
    const id = encodeURIComponent(ctx.params.id);
    try {
      if (query.s || query.n) {
        await app.sessionStore.destroyWithNamespace(`${id}/${query.s}`, query.n);
      } else {
        await app.sessionStore.destroy(id);
      }
      ctx.response.success(null);
    } catch (error) {
      ctx.response.fail(errno.SERVER);
    }
  }
};
