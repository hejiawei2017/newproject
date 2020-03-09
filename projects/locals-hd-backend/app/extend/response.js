'use strict';

module.exports = {
  get errno() {
    return {
      // 错误码可参考 00-00-00 => (系统，模块，描述)
      SUCCESS: { errorCode: 0, errorMsg: 'ok', success: true },
      SERVER: { errorCode: 100001, errorMsg: '服务器异常', success: false },
      PARAMS: { errorCode: 100002, errorMsg: '缺少参数', success: false },
      NOTFOUND: { errorCode: 100003, errorMsg: '数据未找到', success: false },
      EXISTS: { errorCode: 100004, errorMsg: '数据已存在', success: false },
      PERMISSION: { errorCode: 100005, errorMsg: '权限异常', success: false },
      MAXIMUM: { errorCode: 100006, errorMsg: '超出最大限制', success: false },
    };
  },

  auto(response, property = 'data') {
    if (response.errorCode !== 0) {
      this.fail(response);
      return;
    }
    this.success(response[property]);
  },

  success(data) {
    this.body = {
      data,
      errorCode: 0,
      errorMsg: 'ok',
      success: true,
    };
  },

  fail(errno, errorDetail) {
    const { logger, config } = this.app;
    if (errorDetail) {
      logger.error(errorDetail);
    }

    this.body = {
      ...errno,
      errorDetail: config.env === 'prod' ? null : errorDetail,
    };
  },
};
