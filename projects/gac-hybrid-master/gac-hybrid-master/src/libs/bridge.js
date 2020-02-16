export const init  = _ => {
    window.GAC = { search:{}};
    var search = location.search.slice(1);
    var p = search.split('&');
    window.GAC.w = window.screen.width;
    p.forEach(s=>{
        var seg = s.split('=');
        if(seg.length == 2 && seg[0] == 'w'){
            window.GAC.wForUrl = seg[1]
        }
        window.GAC.search[seg[0]] = seg[1]
    })
    window.GAC.baseFont = 100/750*(window.GAC.wForUrl || window.GAC.w);
    document.querySelector('html').style.fontSize = window.GAC.baseFont + 'px';
    console.log('GAC',window.GAC)

    function ready() {
        if(!window.GAC.wForUrl){
            var w = window.screen.width;
            var baseFont = 100/750*w;
            document.querySelector('html').style.fontSize = baseFont + 'px';
        } 
    }
    if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
        document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
        ready()
    }
    window.onunload = function () {
    console.log(window.__wxjs_environment === 'miniprogram') // true
       if(window.wx && window.wx.miniProgram) window.wx.miniProgram.navigateBack({})
    }
}