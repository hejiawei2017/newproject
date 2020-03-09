'use strict';
const BaseController = require('../core/base-controller');

module.exports = class extends BaseController {
  /**
   * 通过手机号注册
   *
   * @param {*} data 注册信息
   * @return { parmise } 返回 response
   */
  signupWithMobile(data) {
    return this.fetch('/platform/auth/sign-up', { method: 'POST', data });
  }

  /**
   * 认证用户
   *
   * @param {*} username 用户名
   * @param {*} password 密码
   * @return { parmise } 返回 response
   */
  auth(username, password) {
    return this.fetch('/platform/auth', {
      method: 'POST',
      data: { username, password, platform: this.app.config.PLATFORM },
    });
  }

  /**
   * 获取用户信息
   *
   * @return { parmise } 返回 response
   */
  getUserInfo() {
    return this.fetch('/platform/user/user-info');
  }
};

