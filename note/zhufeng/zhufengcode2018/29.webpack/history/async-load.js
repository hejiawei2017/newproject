(function (modules) { // webpackBootstrap
    //通过JSONP加载额外的模块
    //代码块jsonp加载回调函数
    function webpackJsonpCallback(data) {
        var chunkIds = data[0];//代码块的IDS
        var moreModules = data[1];//额外的模块
        //把moreModules添加到modules对象中，然后把所有的chunkIds设置为已加载并触发callback函数
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentJsonpFunction) parentJsonpFunction(data);

        while (resolves.length) {
            resolves.shift()();
        }

    };
    //模块缓存
    var installedModules = {};
    // 存储加载中和加载过的chunks对象
    // chunk undefined(未加载)  null (预加载/预获取) Promise (加载中)  0 加载完成
    var installedChunks = {
        "main": 0//刚开始只加载main
    };
    //script路径函数，返回要加载的代码块的路径
    function jsonpScriptSrc(chunkId) {
        return __webpack_require__.p + "" + ({ "title": "title" }[chunkId] || chunkId) + ".js"
    }

    //webpack自已实现的 require方法
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
    }
    //此主文件中只包含入口代码块，此函数用来加载额外的代码块
    //异步模块加载函数，如果没有在缓存模块中 则用jsonscriptsrc 加载
    __webpack_require__.e = function requireEnsure(chunkId) {
        var promises = [];
        //JSONP代码块加载
        var installedChunkData = installedChunks[chunkId];
        if (installedChunkData !== 0) { // 0 说明已经缓存.
            //如果是一个Promise表示正在安装或加载,添加到promises数组中
            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {
                //否则就是未加载
                //在chunk缓存中设置Promise
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = installedChunks[chunkId] = [resolve, reject];
                });
                promises.push(installedChunkData[2] = promise);
                //开始加载代码块
                var script = document.createElement('script');
                var onScriptComplete;
                script.charset = 'utf-8';
                script.timeout = 120;
                //表明脚本需要安全加载 CSP 策略
                if (__webpack_require__.nc) {
                    script.setAttribute("nonce", __webpack_require__.nc);
                }
                script.src = jsonpScriptSrc(chunkId);

                // create error before stack unwound to get useful stacktrace later
                var error = new Error();
                onScriptComplete = function (event) {
                    // 避免IE中的内存泄漏
                    script.onerror = script.onload = null;
                    clearTimeout(timeout);
                    var chunk = installedChunks[chunkId];
                    if (chunk !== 0) {
                        if (chunk) {
                            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                            var realSrc = event && event.target && event.target.src;
                            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                            error.name = 'ChunkLoadError';
                            error.type = errorType;
                            error.request = realSrc;
                            chunk[1](error);
                        }
                        installedChunks[chunkId] = undefined;
                    }
                };
                var timeout = setTimeout(function () {
                    onScriptComplete({ type: 'timeout', target: script });
                }, 120000);
                script.onerror = script.onload = onScriptComplete;
                document.head.appendChild(script);
            }
        }
        return Promise.all(promises);
    };

    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = modules;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // define getter function for harmony exports
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    // define __esModule on exports
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // create a fake namespace object
    // mode & 1: value is a module id, require it
    // mode & 2: merge all properties of value into the ns
    // mode & 4: return value when already ns object
    // mode & 8|1: behave like require
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

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // __webpack_public_path__
    __webpack_require__.p = "";

    // 异步加载失败处理函数 辅助函数
    __webpack_require__.oe = function (err) { console.error(err); throw err; };
    //获取全局的webpackJsonp函数,第一次执行此函数就是一个空的数组
    //异步请求返回的脚本包含window["webpackJsonp"] = window["webpackJsonp"] || []).push()
    var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
    //在替换其push函数之前会将原有的push方法保存为oldJsonpFunction,同时
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    //把jsonpArray的push等于当前的webpackJsonpCallback
    jsonpArray.push = webpackJsonpCallback;
    //把数组克隆一份
    jsonpArray = jsonpArray.slice();
    //循环这个数组，把数组中的所有的元素传给webpackJsonpCallback
    //如果把以前懒加载过的模块在自己身上安装一下，就不用再异步加载了
    for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
    //把上一个oldJsonpFunction赋给parentJsonpFunction,第一次的时候就是push方法
    var parentJsonpFunction = oldJsonpFunction;


    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
    /************************************************************************/
    ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function (module, exports, __webpack_require__) {

                eval("let button = document.createElement(\"button\");\r\nbutton.innerHTML = \"点我\";\r\nbutton.onclick = function() {\r\n    __webpack_require__.e(/*! import() | title */ \"title\").then(__webpack_require__.t.bind(null, /*! ./title.js */ \"./src/title.js\", 7)).then(function(result){\r\n        console.log(result.default);\r\n    });\r\n};\r\ndocument.body.appendChild(button);\n\n//# sourceURL=webpack:///./src/index.js?");

                /***/
})

    });