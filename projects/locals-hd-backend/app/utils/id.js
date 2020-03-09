'use strict';
const generate = require('nanoid/generate');
const alphabet = '123456789';

module.exports = {
  get new() {
    return generate(alphabet, 16);
  },

  gen(size = 8) {
    return generate(alphabet, size);
  },
};
