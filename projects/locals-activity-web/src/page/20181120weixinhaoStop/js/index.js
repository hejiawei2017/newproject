import { isAndroid, isIOS } from '@js/util.js'
import { renderImage } from "./lib/util.js"
import { config } from "./lib/config.js"
import "normalize.css"
import '@js/flexible.min.js'
import Clipboard from "@js/clipboard.min.js"
import "../css/index.less"
import image_01 from '../images/image_01.png'

const IS_ANDROID = isAndroid()
const IS_IOS = isIOS()

if (typeof WeixinJSBridge === "object" && typeof WeixinJSBridge.invoke === "function") {
    if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", ready, false);
    } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", ready);
        document.attachEvent("onWeixinJSBridgeReady", ready);
    }
} else {
    ready()
}

function ready() {
    renderAllImage()
    // 判断是否小程序打开
    if (window.__wxjs_environment === 'miniprogram') {
        setInputValue()
        let clipboard = new Clipboard('#download-app-btn');
        clipboard.on('success', function(e) {
            if (e.action === 'copy') {
                alert('复制成功,请粘贴浏览器打开链接~')
            }
            e.clearSelection();
        });
        
        clipboard.on('error', function(e) {
            let url = $('#select-input').attr('value')
            alert('复制失败,请粘贴浏览器输入此链接:' + url)
        });
    } else {
        $("#download-app-btn").click(downloadApp)
    }
}

function setInputValue() {
    let href = ''
    if (IS_ANDROID) {
        // 安卓包下载地址
        href = config.androidDownloadUrl
    } else if (IS_IOS) {
        // 苹果商店链接地址
        href = config.iosAppstoreUrl
    }
    $('#select-input').attr('value',href)
}

function renderAllImage() {
    renderImage('#image_01', image_01)
}

// 点击下载按钮 
function downloadApp () {
    if (IS_ANDROID) {
        // 安卓包下载地址
        window.location.href = config.androidDownloadUrl
    } else if (IS_IOS) {
        // 苹果商店链接地址
        window.location.href = config.iosAppstoreUrl
    } else {
        alert('暂不支持，敬请期待~')
    }
}