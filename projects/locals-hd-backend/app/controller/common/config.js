'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async create() {
    const body = this.filter({
      key: 'string',
      value: 'string',
      type: 'string',
      describe: { type: 'string' },
    });

    if (!body) {
      return;
    }
    this.ctx.response.auto(await this.service.config.create(body));
  }

  async update() {
    const body = this.filter({
      key: 'string',
      value: 'string',
      type: 'string',
    });

    if (!body) {
      return;
    }
    this.ctx.response.auto(await this.service.config.update(body.key, body.value, body.type));
  }

  async show() {
    const key = this.ctx.params.id;
    const response = await this.service.config.getDetail(key, this.ctx.query.category);
    if (!response.success) {
      this.ctx.body = response;
      return;
    }

    response.value = response.data.value;
    this.ctx.body = response;
  }

  async index() {
    this.ctx.response.auto(
      await this.service.config.getList(this.ctx.query.type)
    );
  }
};
