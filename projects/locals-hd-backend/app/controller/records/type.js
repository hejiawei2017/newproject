'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {

  async create() {
    const rule = {
      desc: 'string',
      type_id: 'number',
    };

    const { ctx, errno, service } = this;
    const { body } = ctx.request;

    try {
      ctx.validate(rule, body);
    } catch (error) {
      ctx.response.fail(errno.PARAMS, error);
      this.logger.error(body, error);
      return;
    }

    try {
      const response = await service.records.type.create(body);
      ctx.response.auto(response);
    } catch (error) {
      ctx.response.fail(errno.SERVER, error);
    }
  }
};
