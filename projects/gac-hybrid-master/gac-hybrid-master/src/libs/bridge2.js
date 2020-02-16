window.GacJSBridge = {};

var u = window.navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
//注册事件监听，初始化
window.setupWebViewJavascriptBridge = function(callback) {
  if (!isiOS) {
    if (window.WebViewJavascriptBridge) {
      callback(window.WebViewJavascriptBridge);
    } else {
      document.addEventListener(
        "WebViewJavascriptBridgeReady",
        function() {
          callback(window.WebViewJavascriptBridge);
        },
        false
      );
    }
  } else {
    if (window.WKWebViewJavascriptBridge) {
      return callback(window.WKWebViewJavascriptBridge);
    }
    if (window.WKWVJBCallbacks) {
      return window.WKWVJBCallbacks.push(callback);
    }
    window.WKWVJBCallbacks = [callback];
    window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.iOS_Native_InjectJavascript &&
      window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage &&
      window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(
        null
      );
  }
};

//回调函数，接收java发送来的数据
window.setupWebViewJavascriptBridge(function(bridge) {
  //默认接收
  //默认接收
  if (!isiOS) {
    bridge.init(function(message, responseCallback) {
      var responseData = "js默认接收完毕，并回传数据给java";
      responseCallback(responseData); //回传数据给java
    });
  }

  window.GacJSBridge = bridge;
});
let brdgeObj = {
  init() {
    var u = window.navigator.userAgent;
    this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    this.isSequence = this.isMiniProgram();
    //this.setUp();

    return this;
  },

  jsCallApp(data, fn) {
    if (this.isiOS) {
      window.GacJSBridge &&
        window.GacJSBridge.callHandler &&
        window.GacJSBridge.callHandler("GacJSBridge", data, function(res) {
          fn && fn(res);
        });
    }
    if (this.isAndroid) {
      window.WebViewJavascriptBridge &&
        window.WebViewJavascriptBridge.callHandler(
          "GacJSBridge",
          data,
          function(res) {
            fn && fn(res);
          }
        );
    }
  },
  registerHandler(eventName, fn) {
    //指定接收，参数functionInJs 与java保持一致

    window.GacJSBridge.registerHandler(eventName, function(
      data,
      responseCallback
    ) {
      var responseData = "get";
      responseCallback(responseData); //回传数据给java
      fn && fn(data);
    });
  },

  isMiniProgram() {
    return new Promise(resolve => {
      if (-1 == navigator.userAgent.toLowerCase().indexOf("micromessenger")) {
        resolve(false);
        return;
      } else {
        window.wx.miniProgram.getEnv(res => {
          if (!res.miniprogram) {
            resolve(false);
            return;
          } else {
            resolve(true);
          }
        });
      }
    });
  }
};
brdgeObj.init();

export default brdgeObj;
