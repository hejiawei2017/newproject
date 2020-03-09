// https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code

'use strict';
const BaseController = require('../../core/base-controller');

module.exports = class extends BaseController {
  async getOpenId() {
    const data = this.ctx.filter(
      {
        code: 'string',
      },
      this.ctx.query
    );
    if (!data) {
      return;
    }

    const response = await this.ctx.api.wechat.getToken(data.code);
    if (response.errcode) {
      this.app.errorLog(JSON.stringify({ ...response, code: data.code }));
      this.ctx.response.fail(this.errno.SERVER);
      return;
    }
    this.ctx.response.success(response);
  }

  async sendTemplateMessageWithMiniprogram() {
    const { app } = this;
    const data = this.ctx.filter({
      access_token: { type: 'string' },
      touser: 'string',
      template_id: 'string',
      page: 'string',
      form_id: 'string',
      data: 'string',
      emphasis_keyword: { type: 'string' },
    });
    if (!data) {
      return;
    }

    try {
      const templateData = JSON.parse(data.data);
      if (!data.access_token) {
        const response = await this.ctx.api.wechat.getMiniProgramAccessToken(
          app.config.WECHAT.official.appid,
          app.config.WECHAT.official.secret
        );
        if (!response.access_token) {
          return this.errno.SERVER;
        }
        data.access_token = response.access_token;
      }
      const response = await this.ctx.api.wechat.sendTemplateMessage({
        ...data,
        data: templateData,
      });
      if (response.errcode) {
        this.logger.error(response);
        this.ctx.response.fail(this.errno.SERVER);
        return;
      }
      this.ctx.response.success(response);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async inviteStatisics() {
    const data = this.ctx.filter({
      robot_name: 'string',
      robot_id: 'string',
      room_name: 'string',
      room_id: 'string',
      inviter_name: 'string',
      inviter_id: 'string',
      inviteeArr: 'string',
    });
    if (!data) {
      return;
    }
    try {
      const response = await this.service.wechat.inviteStatisics(
        data.robot_name,
        data.robot_id,
        data.room_name,
        data.room_id,
        data.inviter_name,
        data.inviter_id,
        data.inviteeArr
      );
      this.ctx.response.auto(response);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async qrcodeInfo() {
    const data = this.ctx.filter(
      {
        used: 'string',
        qrcode_url: 'string',
        id: 'string',
      },
      this.ctx.query
    );
    if (!data) {
      return;
    }
    try {
      const { app } = this;
      const _data = {
        used: data.used,
        qrcode_url: data.qrcode_url,
      };
      await app.redis.set(data.id, JSON.stringify(_data));
      this.ctx.response.success('200');
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async recordsFormid() {
    const data = this.ctx.filter({
      openid: 'string',
      formid: 'string',
    });
    if (!data) {
      return;
    }
    try {
      const response = await this.service.wechat.recordsFormid(
        data.openid,
        data.formid
      );
      this.ctx.response.auto(response);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }

  async oldSendTemplateMessageWithMiniprogram() {
    const { app } = this;
    const data = this.ctx.filter({
      access_token: { type: 'string' },
      touser: 'string',
      template_id: 'string',
      page: 'string',
      data: 'string',
      emphasis_keyword: { type: 'string' },
    });
    if (!data) {
      return;
    }
    const formidData = await this.service.wechat.getFormid(data.touser);
    // 如果没有获取到formid数据则 return
    if (formidData === false) return this.ctx.response.fail(this.errno.SERVER);
    data.form_id = formidData.formid;
    try {
      const templateData = JSON.parse(data.data);
      if (!data.access_token) {
        const response = await this.ctx.api.wechat.getMiniProgramAccessToken(
          app.config.WECHAT.official.appid,
          app.config.WECHAT.official.secret
        );
        if (!response.access_token) {
          return this.errno.SERVER;
        }
        data.access_token = response.access_token;
      }
      const response = await this.ctx.api.wechat.sendTemplateMessage({
        ...data,
        data: templateData,
      });
      if (response.errcode) {
        this.logger.error(response);
        this.ctx.response.fail(this.errno.SERVER);
        return;
      }
      await this.service.wechat.updateFormid(formidData.id);
      this.ctx.response.success(response);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
};
