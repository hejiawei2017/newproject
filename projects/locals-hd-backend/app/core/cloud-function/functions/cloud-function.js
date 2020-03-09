'use strict';

module.exports = function(options) {
  if (!options.path) {
    return (...params) => this.callCode(...params);
  }
  return this.callCode(options.path, options.data[0]);
};
