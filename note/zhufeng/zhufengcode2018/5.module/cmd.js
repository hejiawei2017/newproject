let factories = {}
let modules = {};
function require(name) {
  if (modules[name]) {
    return modules[name];
  }
  let factory = factories[name];
  let exports = {};
  factory(require, exports);
  modules[name] = exports;
  return exports;
}
function define(name, factory) {
  factories[name] = factory;
}
function use(name) {
  require(name);
}
define('addModule', function (require, exports) {
  exports.add = function (a, b) {
    return a + b;
  }
})
define('minusModule', function (require, exports) {
  exports.minus = function (a, b) {
    return a - b;
  }
})
define('index', function (require, exports) {
  var addModule = require('addModule')
  let result1 = addModule.add(1, 2);
  console.log(result1);
  var minusModule = require('minusModule')
  let result2 = minusModule.minus(1, 2);
  console.log(result2);
})
use('index');