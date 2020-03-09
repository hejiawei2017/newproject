'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async price() {
    const body = this.filter({
      id: 'string',
      payment: 'string',
    });

    if (!body) {
      return;
    }

    try {
      this.ctx.response.auto(await this.ctx.api.order.modifyPrice(body));
    } catch (error) {
      this.logger.error(error);
      this.ctx.response.fail(this.errno.SERVER);
    }
  }
};
