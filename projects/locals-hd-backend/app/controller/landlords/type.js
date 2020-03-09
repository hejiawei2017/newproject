'use strict';

const BaseController = require('../../core/base-controller');

class TypeController extends BaseController {
  async index() {
    const { ctx, service } = this;
    const response = await service.record.find(
      'LANDLORDS_TYPE',
      'landlords_type'
    );
    if (response.success) {
      const originData = JSON.parse(response.data);
      response.data = Object.keys(originData).map(v => ({ ...originData[v], id: v }));
    }
    ctx.body = response;
  }

  async create() {
    const { ctx, service } = this;
    const body = this.filter({
      name: 'string',
      need_address: { type: 'boolean', default: true },
    });

    if (!body) {
      return;
    }

    body.id = this.app.util.id.new;
    const response = await service.record.createOrUpdate(
      'landlords_type',
      { data: JSON.stringify({ [body.id]: body }) },
      'LANDLORDS_TYPE'
    );
    if (!response.success) {
      ctx.body = response;
    }
    ctx.response.success(body.id);
  }
}

module.exports = TypeController;
