'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async create() {
    const data = this.ctx.filter({
      user_id: 'string',
      event: 'string',
      share_user: { type: 'string', required: false },
      activity_name: { type: 'string', required: false },
      desc: { type: 'string', required: false },
    });

    if (!data) {
      return;
    }

    const response = await this.service.statistics.event(
      data.user_id,
      data.event,
      data.share_user,
      data.activity_name,
      data.desc
    );
    this.ctx.response.auto(response);
  }
};
