jQuery.MyCommon = {
    Loading: function (options) {
        var defaults = {
            opacity: 1,
            //loading页面透明度
            backgroundColor: "#fff",
            //loading页面背景色
            borderColor: "#bbb",
            //提示边框颜色
            borderWidth: 0,
            //提示边框宽度
            borderStyle: "",
            //提示边框样式
            loadingTips: "",
            //提示文本
            TipsColor: "#666",
            //提示颜色
            delayTime: 1000,
            //页面加载完成后，加载页面渐出速度
            zindex: 999,
            //loading页面层次
            sleep: 0
            //设置挂起,等于0时则无需挂起

        }
        var options = $.extend(defaults, options);

        //获取页面宽高
        var _PageHeight = document.documentElement.clientHeight,
            _PageWidth = document.documentElement.clientWidth;

        //在页面未加载完毕之前显示的loading Html自定义内容
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div id="loadingTips" style="position: absolute; cursor1: wait; width: auto;border-color:' + options.borderColor + ';border-style:' + options.borderStyle + ';border-width:' + options.borderWidth + 'px; height:80px; line-height:80px; padding-left:80px; padding-right: 5px;border-radius:10px;  background: ' + options.backgroundColor + ' url(images/1-01_06.png) no-repeat 0px center; color:' + options.TipsColor + ';font-size:20px;">' + options.loadingTips + '</div></div>';

        //呈现loading效果
        $("body").append(_LoadingHtml);

        //获取loading提示框宽高
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
            _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        //计算距离，让loading提示框保持在屏幕上下左右居中
        var _LoadingTop = _PageHeight > _LoadingTipsH ? (_PageHeight - _LoadingTipsH) / 2 : 0,
            _LoadingLeft = _PageWidth > _LoadingTipsW ? (_PageWidth - _LoadingTipsW) / 2 : 0;

        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });

        //监听页面加载状态
        // document.onreadystatechange = PageLoaded;

        if (document.readyState == "complete" || document.readyState == "interactive") {
            var loadingMask = $('#loadingPage');
            setTimeout(function () {
                    loadingMask.animate({
                            "opacity": 0
                        },
                        options.delayTime,
                        function () {
                            $(this).hide();

                        });
                },
                options.sleep);

        }

        // //当页面加载完成后执行
        // function PageLoaded() {
        //     console.log(document.readyState)
        //
        // }
    }
}

function showMsg(text, position) {
    var show = $('.show_msg').length;
    if (show > 0) {

    } else {
        var div = $('<div></div>');
        div.addClass('show_msg');
        var span = $('<span></span>');
        span.addClass('show_span');
        span.appendTo(div);
        span.text(text);
        $('body').append(div);
    }
    $(".show_span").text(text);
    if (position == 'bottom') {
        $(".show_msg").css('bottom', '95%');
    } else if (position == 'center') {
        $(".show_msg").css('top', '');
        $(".show_msg").css('bottom', '50%');
    } else {
        $(".show_msg").css('bottom', '95%');
    }
    $('.show_msg').hide();
    $('.show_msg').fadeIn(1000);
    $('.show_msg').fadeOut(1000);
}