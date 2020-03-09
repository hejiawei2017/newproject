'use strict';

const reflect = {
  api: require('./api'),
  cf: require('./cloud-function'),
  cloudFunction: require('./cloud-function'),
  ctx: require('./ctx'),
  function: require('./function'),
  service: require('./service'),
  db: require('./db'),
};

module.exports = function(options) {
  if (typeof reflect[options.type] === 'function') {
    return reflect[options.type].call(this, options);
  }
};
