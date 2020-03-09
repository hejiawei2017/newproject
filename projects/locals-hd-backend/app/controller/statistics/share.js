'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async create() {
    const data = this.ctx.filter({
      ticket_id: 'string',
      user_id: 'string',
      type: 'string',
      app_id: 'string',
      page: { type: 'string', required: false },
      desc: { type: 'string', required: false },
    });
    if (!data) {
      return;
    }
    const response = await this.service.statistics.share(
      data.ticket_id,
      data.user_id,
      data.app_id,
      data.type,
      data.page,
      data.desc
    );
    this.ctx.response.auto(response);
  }

  async join() {
    const data = this.ctx.filter({
      ticket_id: 'string',
      share_user_id: 'string',
      join_user_id: 'string',
    });
    if (!data) {
      return;
    }
    if (data.share_user_id === data.join_user_id) {
      this.ctx.response.success();
      return;
    }
    const response = await this.service.statistics.joinShare(data.ticket_id, data.share_user_id, data.join_user_id);
    this.ctx.response.auto(response);
  }
};
