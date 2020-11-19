(function (modules) { // webpackBootstrap
    // 模块的缓存
    var installedModules = {};

     // 声明了一个 require方法
    function __webpack_require__(moduleId) {
        // 检查模块是否已经缓存，如果缓存里已经有了，表示模块加载过了
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // 创建一个新模块 (把模块放到缓存里)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // 执行模块函数
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // 标记模块已经缓存
        module.l = true;

        // 返回模块导出项
        return module.exports;
    }


    // 暴露模块对象（modules传入的没模块对象）
    __webpack_require__.m = modules;

    // 暴露缓存的模块对象
    __webpack_require__.c = installedModules;

    // 通过getter的方式增加属性
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    //在导出对象上定义__esModule属性,表示此对象是一个ES6模块对象
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

   /**把任意模块包装成ES6模块
   * 创建一个模拟的命名空间对象
   * mode & 1 表示传的是模块ID
   * mode & 2 需要合并属性,把所有的属性合并到命名空间ns上
   * mode & 4 如果是ES6模块直接返回
   * mode & 8|1 等同于require方法
   */
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };
    //为了兼容那些非non-harmony模块,获取module对象的默认导出
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    //判断对象身上是否拥有此属性
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // __webpack_public_path__  公共路径
    __webpack_require__.p = "";


    //加载入口模块并返回exports
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
    "./src/index.js":(function (module, exports) {
        eval("console.log('hello word')\n\n//# sourceURL=webpack:///./src/index.js?");
    })
});