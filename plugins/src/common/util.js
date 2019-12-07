var jsUrlHelper = {
  getUrlParam: function(url, ref) {
    var str = "";

    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return "";

    str = url.substr(url.indexOf("?") + 1);

    var arr = str.split("&");
    for (var i in arr) {
      var paired = arr[i].split("=");

      if (paired[0] === ref) {
        let val = decodeURIComponent(paired[1]); // 解码
        return val;
      }
    }

    return "";
  },
  putUrlParam: function(url, ref, value) {
    // 如果没有参数
    if (url.indexOf("?") === -1) return url + "?" + ref + "=" + value;

    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return url + "&" + ref + "=" + value;

    var arr_url = url.split("?");

    var base = arr_url[0];

    var arr_param = arr_url[1].split("&");

    for (var i = 0; i < arr_param.length; i++) {
      var paired = arr_param[i].split("=");

      if (paired[0] === ref) {
        paired[1] = value;
        arr_param[i] = paired.join("=");
        break;
      }
    }

    return base + "?" + arr_param.join("&");
  },
  delUrlParam: function(url, ref) {
    // 如果不包括此参数
    if (url.indexOf(ref) === -1) return url;
    var arr_url = url.split("?");
    var base = arr_url[0];
    var arr_param = arr_url[1].split("&");
    var index = -1;
    for (var i = 0; i < arr_param.length; i++) {
      var paired = arr_param[i].split("=");
      if (paired[0] === ref) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return url;
    } else {
      arr_param.splice(index, 1);
      return base + "?" + arr_param.join("&");
    }
  }
};

/**
 * 复制文字工具方法
 * 兼容性补充：
 * 移动端：
 * 安卓手机：微信（chrome）和几个手机浏览器都可以用。
 * 苹果手机：微信里面和sarafi浏览器里也都可以，
 * PC:sarafi版本必须在10.2以上，其他浏览器可以.
 * 兼容性测试网站：https://www.caniuse.com/
 * 必须手动触发 点击事件或者其他事件，不能直接使用js调用！！！
 * 例如：copyText('h5实现一键复制到粘贴板 兼容ios')
 */
export const copyText = (text, callback) => {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString();
  let input = document.querySelector("#copy-input");
  if (!input) {
    input = document.createElement("input");
    input.id = "copy-input";
    input.readOnly = true; // 防止ios聚焦触发键盘事件
    input.style.position = "absolute";
    input.style.left = "3000px";
    input.style.top = "3000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input);
  }

  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    callback && callback();
  }
  input.blur();

  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) {
      //ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart("character", startIndex); //起始光标
      range.moveEnd("character", stopIndex - startIndex); //结束光标
      range.select(); //不兼容苹果
    } else {
      //firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }
};

export default { jsUrlHelper, copyText };
