'use strict';
// TODO: 解析调用参数
const merge = require('lodash/merge');

module.exports = async function(options) {
  let params = {};

  if (typeof options === 'function') {
    return options();
  }

  if (Array.isArray(options)) {
    return options;
  }

  params = merge(params, options);
  params.type = params.type || 'function';

  if (!Array.isArray(options.data)) {
    params.data = [options.data];
  }

  return [params];
};
