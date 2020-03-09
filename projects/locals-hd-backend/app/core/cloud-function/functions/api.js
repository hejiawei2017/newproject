'use strict';

module.exports = function(options) {
  const paths = options.path.split('.');
  let apiFun = this.ctx.api;

  for (let index = 0; index < paths.length; index++) {
    const field = paths[index];
    apiFun = apiFun[field];
    if (!apiFun) {
      this.logger.warn('不存在该 API' + paths, index);
      return null;
    }
  }

  return apiFun.apply(this, options.data);
};
