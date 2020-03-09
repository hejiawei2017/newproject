'use strict';
const CloudFunction = require('../../core/cloud-function/index');
const merge = require('lodash/merge');
module.exports = class extends CloudFunction {
  async _callCode(type) {
    const body = merge(this.ctx.query, this.ctx.request.body, this.ctx.params);
    const requestBody = this.filter(
      { activity_id: 'string', payload: 'string', id: { type: 'string' } },
      body
    );
    if (!requestBody) {
      return this.errno.PARAMS;
    }
    const response = await super.callCode(type, requestBody);
    this.ctx.status = 200;
    this.ctx.body = response;
  }

  index() {
    return this._callCode('index');
  }
  new() {
    return this._callCode('new');
  }
  show() {
    return this._callCode('show');
  }
  edit() {
    return this._callCode('edit');
  }
  create() {
    return this._callCode('create');
  }
  update() {
    return this._callCode('update');
  }
  destroy() {
    return this._callCode('destroy');
  }

  async uploadHandleCode() {
    const body = this.filter({
      code: 'string',
      activity_id: 'string',
      type: 'string',
    });
    if (!body) {
      return;
    }
    const row = await this.app.model_hd.ReportHandleCode.findOne({
      where: { activity_id: body.activity_id, type: body.type },
    });

    if (row) {
      row.code = body.code;
      await row.save();
      this.logger.info('代码已存在, 更新代码成功');
      this.ctx.response.success();
      return;
    }

    body.id = 0;
    await this.app.model_hd.ReportHandleCode.create(body);
    this.ctx.response.success();
  }
};
