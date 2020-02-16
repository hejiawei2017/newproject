// document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%' + '<div>')
var u = window.navigator.userAgent;
var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var height = 100
getHeight();
// document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%2' + '<div>')
window.GAC = window.GAC || {};
// 先判断平台
if (isiOS) {
  GAC.platform = "ios";
} else if (isAndroid) {
  GAC.platform = "android";
} else {
  GAC.platform = "pc";
}
function setupWebViewJavascriptBridge(callback) {
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
  //  document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%5.5' + '<div>')
}
// document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%3' + '<div>')
if (isiOS) {
  
  // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%4' + '<div>')
  setupWebViewJavascriptBridge(function(bridge) {
    // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%6' + '<div>')
    window.GAC.bridge = bridge;
    // var callbackButton = document.getElementById('buttons').appendChild(document.createElement('button'))
    // callbackButton.innerHTML = 'Fire testObjcCallback'
    // callbackButton.onclick = function(e) {
    //  bridge.callHandler('testObjcCallback', {'foo': 'bar'}, function(response) {

    //  })
    // }
  });
  var imgs = document.getElementsByTagName("img");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.maxWidth = "100%";
    imgs[i].style.height = "auto";
  }
  // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%7' + '<div>')
  document.documentElement.style.webkitUserSelect = "none";
  document.documentElement.style.webkitTouchCallout = "none";
  var tags = document.getElementsByTagName("a");
  for (var i = 0; i < tags.length; i++) {
    tags[i].style.webkitTextFillColor = "#2CCCD3";
    tags[i].style.textDecorationLine = "none";
  }
  // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%8' + '<div>')
  document.getElementsByTagName("body")[0].style.webkitTextSizeAdjust = "100%";
  document.getElementsByTagName("body")[0].style.lineHeight = "30px";
  // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + '%%%%%%%%%%%%%%%%%%%9' + '<div>')
  var script = document.createElement("meta");
  script.name = "viewport";
  script.content = "width=device-width, user-scalable=no";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test platform:' + GAC.platform + '<div>')


window.GACSDK = {
  getTotalHeight: function() {
    console.log(22222,height)
    if (GAC.platform == "ios") {
      
      GAC.bridge.callHandler( "getTotalHeight", { method: "getTotalHeight", data: { height: height } }, function(res) {
        console.log(3333,height)
      });
    } else if (GAC.platform == "android") {
      console.log('android')
    } else {
    }
  },
  openImage: function(i) {
    // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test platform:' + 'click1' + '<div>')
    if (GAC.platform == "ios") {
      GAC.bridge.callHandler( "openImage", { method: "openImage", data: { index: i } }, function(res) {
          //  document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test platform:' + 'click2' + '<div>')
        }
      );
    } else if (GAC.platform == "android") {
      window.GacJSBridge.openImage(i);
    } else {
    }
  },
  addImages: function(array) {
    if (GAC.platform == "ios") {
      GAC.bridge.callHandler("addImage", array, function(res) {
        console.log("#######");
      });
    } else if (GAC.platform == "android") {
      window.GacJSBridge.addImages(array);
    } else {
      console.log("########addImage");
    }
  }
};

function formatImg() {
  var objs = document.getElementsByTagName("img");
  for (var i = 0; i < objs.length; i++) {
    var img = objs[i];
    img.style.maxWidth = "100%";
    img.style.height = "auto";
  }
}

function formatLink() {
  var objs_a = document.getElementsByTagName("a");
  for (var i = 0; i < objs_a.length; i++) {
    objs_a[i].style.cssText =
      "color: #2CCCD3;word-break:break-all; overflow:auto;text-decoration: none;";
  }
}

function bindImg() {
  var objs = document.getElementsByTagName("img");
  var array = new Array();
  for (var i = 0; i < objs.length; i++) {
    var parent = objs[i].parentNode;
    if (parent != null && parent.tagName == "A") {
      continue;
    }
    array[i] = objs[i].src;
    objs[i].onclick = (function(i) {
      return function() {
        GACSDK.openImage(i);
      };
    })(i);
  }
  GACSDK.addImages(array);
}

function cssReset() {
  var p = document.querySelectorAll("p");
  // TODO: 安卓 ios 样式
  for (var i = 0; i < p.length; i++) {
    p[i].style.fontFamily = "Verdana,Arial,Helvetica,MicrosoftYaHei";
    p[i].style.lineHeight = "28px";
    p[i].style.fontSize = "16px";
    p[i].style.color = "#051C2C";
  }
}
function testAppend() {
  // document.body.insertAdjacentHTML('afterbegin','<div style="color:#75B7D9;">SDK test 2 UA:' + navigator.userAgent + '<div>')
}

// window.GAC.getContentHeight = function(){
//     return document.body.offsetHeight
// }

//window.webkit.messageHandlers.<message.name>.postMessage(<message.body>);
function getHeight() {
  height = document.body.scrollHeight;
  console.log(111, height);
  // TODO:
}

testAppend();
cssReset();
formatImg();
formatLink();
bindImg();
