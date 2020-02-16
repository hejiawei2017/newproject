/* eslint-disable no-undef */

/**
 * 向小程序通讯，后退、销毁和分享才能获取
 * @param {Object} data
 */
function postMessage(data) {
  window.wx.miniProgram.postMessage({ data });
}
/**
 * 整合导航函数
 * @param {Object} param
 */
function navigate({
  method = "navigateTo",
  url,
  delta = 1,
  success = f => f,
  fail = f => f,
  complete = f => f
}) {
  let methods = [
    "navigateTo",
    "switchTab",
    "reLaunch",
    "redirectTo",
    "navigateBack"
  ];
  if (methods.indexOf(method) >= 0) {
    let params = {
      success,
      fail,
      complete
    };
    if (method === "navigateBack") {
      params["delta"] = delta;
    } else {
      params["url"] = url;
    }

    window.wx.miniProgram[method](params);
    console.log("wx", wx);
  } else {
    throw new Error(`[${methods}],There is no such method(${method})`);
  }
}

export default {
  postMessage,
  navigate
};
