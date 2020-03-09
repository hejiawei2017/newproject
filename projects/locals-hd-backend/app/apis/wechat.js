'use strict';
const BaseController = require('../core/base-controller');

module.exports = class extends BaseController {
  /**
   * 获取小程序二维码
   *
   * @param {*} data 二维码信息
   * @return { parmise } 返回 response
   */
  qrcode(data) {
    return this.fetch('https://uat.localhome.cn/api/getWXACode/mini-program', {
      method: 'POST',
      data,
    });
  }

  getToken(code) {
    return this.fetch(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx337df082cab07c04&secret=73d623ef5f4e776c64d4c364d83d9331&code=${code}&grant_type=authorization_code`,
      {
        method: 'GET',
      }
    );
  }

  async getMiniProgramAccessToken(appid, secret) {
    const token = `access_token _${appid}`;
    const tokenResponse = await this.app.sessionStore.get(token);
    if (tokenResponse) {
      return tokenResponse;
    }

    const response = await this.fetch(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    );
    if (response.access_token) {
      await this.app.sessionStore.set(token, response, 60 * 60 * 1000);
    }
    return response;
  }

  sendTemplateMessage(data) {
    return this.fetch(
      `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${
        data.access_token
      }`,
      {
        method: 'POST',
        data,
      }
    );
  }
};
