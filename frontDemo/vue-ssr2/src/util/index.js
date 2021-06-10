import config from "@/p.config.js"
export default {
  install(Vue, options = {}) {
    //跳转到中心系统页面
    Vue.prototype.goTroucePage = function (pageUrl, options = { isclose: false }) {
      if (pageUrl.indexOf("loginpass") != -1) {
        pageUrl = "/"
        options.isclose = true
      }
      let localurl = window.location.protocol + '//' + window.location.host
      let authurl = "authurl=" + encodeURIComponent(localurl)
      if (options.isclose) {
        authurl = authurl + "&isclose=true"
      }
      let jumpUrl = config.trouceUrl + "#" + pageUrl;

      if (jumpUrl.indexOf("?") != -1) {
        jumpUrl = jumpUrl + "&" + authurl
      } else {
        jumpUrl = jumpUrl + "?" + authurl
      }
      window.open(jumpUrl);
    };
  }
};
