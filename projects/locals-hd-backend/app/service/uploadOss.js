'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  // 获取图片信息并上传
  async UrlpushOss(stream, suffix = '') {
    try {
      const timestamp = `${new Date().getTime()}`;
      const path = timestamp.substr(timestamp.length - 2);
      const result = await this.ctx.oss.putStream(
        `${path}/locals_${timestamp}${suffix}`,
        stream
      );
      return this.success(result.url);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  // base64上传图片
  async base64ToOss(base64) {
    const buff = new Buffer.from(base64, 'base64');
    const bufferStream = new require('stream').PassThrough();
    bufferStream.end(buff);
    return this.UrlpushOss(bufferStream, '.png');
  }
};
