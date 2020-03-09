'use strict';

module.exports = function() {
  return (path, ...serviceParams) => {
    const paths = path.split('.');
    let services = this.service;
    let field = '';

    for (let index = 0; index < paths.length; index++) {
      field = paths[index];

      if (index + 1 === paths.length && services[field]) {
        break;
      }

      services = services[field];
      if (!services) {
        this.logger.warn('不存在该 service' + paths, index);
        return null;
      }
    }

    return services[field](...serviceParams);
  };
};
