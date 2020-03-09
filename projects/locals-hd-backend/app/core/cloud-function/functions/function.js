'use strict';

module.exports = function(options) {
  const _functions = {
    getUserInfo: userId => {
      return this.app.model_platform.User.findOne({
        where: { id: userId },
        raw: true,
      });
    },
    fetch: (uri, options) => {
      return this.fetch(uri, options);
    },
    filter: (rule, data) => {
      return this.ctx.filter(rule, data);
    },
    errno: () => {
      return this.errno;
    },
    logger: (level, ...messages) => {
      return this.logger[level](...messages);
    },
  };

  if (!_functions[options.path]) {
    return;
  }

  return _functions[options.path].apply(this, options.data);
};
