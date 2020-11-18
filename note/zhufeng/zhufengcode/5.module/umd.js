((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    //AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    //CommonJS
    var $ = require('jquery');
    module.exports = factory($);
  } else {
    root.testModule = factory(root.jQuery);
  }
})(this, ($) => {
  //todo
});