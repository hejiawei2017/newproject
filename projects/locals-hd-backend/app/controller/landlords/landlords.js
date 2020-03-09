'use strict';

const BaseController = require('../../core/base-controller');
const utils = require('utility');

class LandlordsController extends BaseController {
  async create() {
    const body = this.filter({
      type_id: 'string',
      name: 'string',
      phone: 'string',
      state: { type: 'number', default: 1 },
      province: { type: 'string' },
      city: { type: 'string' },
      area: { type: 'string' },
      create_time: { type: 'number', default: Date.now() },
    });

    if (!body) {
      return;
    }

    const dataId = utils.md5(`${body.type_id}${body.name}${body.phone}${body.state}${body.province}${body.city}${body.area}`);
    body.id = this.app.util.id.new;
    const response = await this.service.record.create(dataId, JSON.stringify(body), 'LANDLORDS');
    if (!response.success) {
      this.ctx.response.success();
      return;
    }
    this.ctx.response.success(body.id);
  }
}

module.exports = LandlordsController;

