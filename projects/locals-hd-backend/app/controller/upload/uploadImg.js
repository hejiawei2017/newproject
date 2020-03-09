
'use strict';
const BaseController = require('../../core/base-controller');
// const oss = require('ali-oss');

module.exports = class extends BaseController {
  async urlToOss() {
    const ctx = this.ctx;
    const data = ctx.filter({
      url: 'string',
    });
    if (!data) {
      return;
    }
    const result = await ctx.curl(data.url, {
      streaming: true,
    });
    const stream = result.res;
    ctx.response.auto(await this.service.uploadOss.UrlpushOss(stream));
  }

  async index() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    if (!ctx) {
      return;
    }
    try {
      const timestamp = new Date().getTime();
      const result = await this.ctx.oss.putStream(
        `locals_${timestamp}${stream.filename}`,
        stream
      );
      this.ctx.response.auto(result);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async base64ToOss() {
    const parts = this.ctx.multipart({ autoFields: true });
    let part;

    while ((part = await parts()) != null) {
      // console.info('data', part);
    }
    if (!parts.field) {
      return;
    }
    // 合并成base64
    const base64 = Object.values(parts.field).reduce((prev, curr) => prev + curr, '');
    if (!part) {
      this.ctx.response.auto(await this.service.uploadOss.base64ToOss(base64));
    }
  }
};
