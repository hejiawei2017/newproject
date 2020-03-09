import Config from '@js/config.js'
import {
    nameRegExp,
    telRegExp,
    cardRegExp
} from '@js/util.js'

require('@js/jquery.min.js')
require('@js/flexible.min.js')
require('./mui.picker.min.js')
require('./fakeLoader.js')
require('../css/mui.css')
require('../css/mui.picker.css')
require('../css/index.css')
require('../css/fakeLoader.css')
require('../css/a.less')
const img = require('../images/lock.png')

;
(function ($mui) {
    $mui.init();
    //时间事件
    document.getElementById('picStartData').addEventListener('click', function () {
        openSelectDateTile(this, '#pickEndData', 'start');
    }, false);
    document.getElementById('pickEndData').addEventListener('click', function () {
        openSelectDateTile(this);
    }, false);
    //回退房源搜索页面
    $('#back-house').click(function () {
        $('#house-info').css('display', 'block');
        $('#house-record').css('display', 'none');
        $('#record-list').html('<li><div class="content-empty"><p>暂无发送记录</p></div></li>>');

    })
    //发送记录
    $('#sendRecordBtn').click(function () {
        $('#house-info').css('display', 'none');
        $('#house-record').css('display', 'block');
        doorLockFun.getHouseRecordData(doorLockFun.houseInfo.doorIp);
    });
    //搜索房源
    $('#searchHouseBtn').click(function () {
        let houseCodeKeyWord = $("input[name='houseCodeKeyWord']").val();
        if (houseCodeKeyWord !== '') {
            doorLockFun.searchHouseInfo(houseCodeKeyWord);
        } else {
            doorLockFun.pageDomHandle('toInput');
        }
    });
    //设置门锁IP
    $('#settingIp').click(function () {
        let doorLockIp = $('#doorLockIp').val();
        let params = {
            lockNo: $.trim(doorLockIp),
            houseSourceId: doorLockFun.houseInfo.houseSourceId
        }
        if ($.trim(doorLockIp) === '') {
            $mui.alert('请输入门锁IP');
            return;
        }
        const btnArray = ['否', '是'];
        $mui.confirm('是否确定设置门锁IP？', '设置门锁IP', btnArray, function (e) {
            if (e.index === 1) {
                doorLockFun.setDoorLockIp(params)
            }
        })
    })
    //发送门锁密码
    $('#sendDoorLock').click(function () {
        let beginDateTime = $("#picStartData").val();
        let endDateTime = $("#pickEndData").val();
        let mobile = $.trim($("input[name='mobile']").val());
        let name = $.trim($("input[name='name']").val());
        if (name === '') {
            $mui.alert('请输入姓名');
            return;
        }
        if (mobile === '') {
            $mui.alert('请输入预定房源时预留的手机号');
            return;
        } else if (!doorLockFun.isPoneAvailable(mobile)) {
            $mui.alert('手机号格式有误');
            return;
        }
        if (beginDateTime === '' || endDateTime === '') {
            $mui.alert('请选择时间');
            return;
        }

        let params = {
            houseNo: doorLockFun.houseInfo.houseNo,
            lockNo: doorLockFun.houseInfo.doorIp,
            beginDateTime: getDateTime(beginDateTime),
            endDateTime: getDateTime(endDateTime),
            mobile: mobile,
            name: name
        }
        doorLockFun.sendDoorLockPassword(params);
    })


    let doorLockFun = {
        houseInfo: {}, //房源对象
        isRepeat: false,
        url: Config.api,
        api: {
            fetchSearchHouseApi: '/prod-plus/h5/house/door-lock/info', //搜索房源
            fetchSetGoLock: '/prod-plus/house/set-door-lock', //设置门锁IP
            fetchSendDoorLockPassword: '/3rd-plus/third/go-lock/send-pwd-to-h5', //发送门锁密码
        },
        isPoneAvailable: function (str) {
            let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(str)) {
                return false;
            } else {
                return true;
            }
        },
        //操作页面显示隐藏
        pageDomHandle: function (type) {
            switch (type) {
                case 'toInput':
                    $('#content-empty').removeClass('content-empty');
                    $('#content-empty').addClass('hide');
                    $('#content-search-tips').addClass('content-empty');
                    $('#content-search-tips').removeClass('hide');
                    $('#content-wrapper').addClass('hide');
                    break;
                case 'toData':
                    $('#content-empty').addClass('hide');
                    $('#content-empty').removeClass('content-empty');
                    $('#content-wrapper').removeClass('hide');
                    $('#content-search-tips').addClass('hide');
                    $('#content-search-tips').removeClass('content-empty');
                    break;
                case 'toEmpty':
                    $('#content-empty').addClass('content-empty');
                    $('#content-search-tips').addClass('hide');
                    $('#content-search-tips').removeClass('content-empty');
                    break;
            }
        },
        //查询房源
        searchHouseInfo: function (value) {
            if (this.isRepeat) {
                return;
            }
            let fakeLoading = $(".fakeloader").fakeLoader({
                bgColor: 'RGBA(209, 78, 90, 1)',
                spinner: "spinner7"
            });
            this.isRepeat = true;
            $.ajax({
                type: "GET",
                url: this.url + this.api.fetchSearchHouseApi + '?houseNo=' + value + '&houseWorkflowStatusNotIn=2&houseWorkflowStatusNotIn=3',
                data: {},
                dataType: 'json',
                success: (res) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    if (res.success) {
                        this.houseInfo = res.data;
                        if (this.houseInfo.houseSourceId !== null) {
                            if (this.houseInfo.image !== null) {
                                $('.info-image img').attr('src', processImage(this.houseInfo.image));
                            }
                            $('.info-name').html(this.houseInfo.title);
                            $('#doorLockIp').val(this.houseInfo.doorIp);
                            $('.info-detail-battery').html(this.houseInfo.battery);

                            if (this.houseInfo.communicationStatus === '00') {
                                $('.info-detail-status').html('通讯正常');
                            } else if (this.houseInfo.communicationStatus === '01') {
                                $('.info-detail-status').html('通讯异常');
                            }

                            if (this.houseInfo.doorIp !== null) {
                                $('.setting-input span').html('已设置');
                                $('.setting-btn button').html('重设');
                                $('#info-detail').removeClass('hide');
                                $('#info-detail').addClass('info-detail');
                            } else {
                                $('.setting-input span').html('未设置');
                                $('.setting-btn button').html('设置');
                                $('#info-detail').addClass('hide');
                                $('#info-detail').removeClass('info-detail');
                            }
                            this.pageDomHandle('toData');
                        } else {
                            this.pageDomHandle('toEmpty');
                        }
                        //设置发送密码是否可点击
                        if (this.houseInfo.doorIp === null) {
                            $('#sendDoorLock').css('background', '#ccc').css('border', '1px solid #ccc').attr('disabled', true);
                        } else {
                            $('#sendDoorLock').css('background', '#007aff').attr('disabled', false);
                        }

                    } else {
                        $mui.alert(res.errorMsg);
                    }
                },
                error: (err) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    $mui.alert('网络异常，稍后再试');
                }
            })
        },
        //设置房源门锁ip
        setDoorLockIp: function (params) {
            if (this.isRepeat) {
                return;
            }
            let fakeLoading = $(".fakeloader").fakeLoader({
                bgColor: 'RGBA(209, 78, 90, 1)',
                spinner: "spinner7"
            });
            $.ajax({
                type: "POST",
                url: this.url + this.api.fetchSetGoLock,
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json',
                success: (res) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    if (res.success) {
                        $mui.toast('设置成功', {
                            duration: 'short',
                            type: 'div'
                        });
                        this.searchHouseInfo(this.houseInfo.houseNo);
                    } else {
                        $mui.alert(res.errorDetail);
                    }
                },
                error: (err) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    $mui.alert('网络异常，稍后再试');
                }
            });
        },
        //发送门锁密码
        sendDoorLockPassword: function (params) {
            if (this.isRepeat) {
                return;
            }
            let fakeLoading = $(".fakeloader").fakeLoader({
                bgColor: 'RGBA(209, 78, 90, 1)',
                spinner: "spinner7"
            });
            $.ajax({
                type: "GET",
                url: this.url + this.api.fetchSendDoorLockPassword,
                data: params,
                dataType: 'json',
                success: (res) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    if (res.success) {
                        $mui.toast('门锁密码已发送', {
                            duration: 'short',
                            type: 'div'
                        });
                        $("input[name='password']").val(res.data.pwd_text);
                    } else {
                        $mui.alert(res.errorDetail);
                    }
                },
                error: (err) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    $mui.alert('网络异常，稍后再试');
                }
            });
        },
        //获取密码记录列表
        getHouseRecordData: function (lockNo) {
            if (this.isRepeat) {
                return;
            }
            let fakeLoading = $(".fakeloader").fakeLoader({
                bgColor: 'RGBA(209, 78, 90, 1)',
                spinner: "spinner7"
            });
            $.ajax({
                type: "GET",
                url: this.url + '/3rd-plus/third/go-lock/' + lockNo + '/pwd-send-record',
                data: {},
                dataType: 'json',
                success: (res) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    if (res.success) {
                        if (res.data !== null) {
                            let _html = '';
                            res.data.forEach((item) => {
                                _html += '<li class="mui-table-view-cell mui-media">' +
                                    '<a href="javascript:;">' +
                                    '<img class="mui-media-object mui-pull-left" src="' + img + '">' +
                                    '<div class="mui-media-body" style="font-size: 16px;">' +
                                    '<div class="body-wrapper">' +
                                    '<span>' + item.pwd_user_mobile + '</span>' +
                                    '<span>' + statusToString(item.status) + '</span>' +
                                    '</div>' +
                                    '<p class="mui-ellipsis">' + formatDate(item.valid_time_start) + ' 至 ' + formatDate(item.valid_time_end) + '</p>' +
                                    '</div>' +
                                    '</a>' +
                                    '</li>';
                            });
                            $('#record-list').html(_html);
                        } else {
                            $('#record-list').html('<li><div class="content-empty"><p>暂无发送记录</p></div></li>>');
                        }
                    } else {
                        $mui.alert(res.errorMsg);
                    }
                },
                error: (err) => {
                    fakeLoading.closeFake();
                    this.isRepeat = false;
                    $mui.alert('网络异常，稍后再试');
                }
            });
        }
    }

    function statusToString(statusNumber) {
        var str = '';
        switch (statusNumber) {
            case '01':
                str = '启用中';
                break;
            case '03':
                str = '删除';
                break;
            case '11':
                str = '已启用';
                break;
            case '13':
                str = '已删除';
                break;
            case '21':
                str = '启用失败';
                break;
            case '23':
                str = '删除失败';
                break;
        }
        return str;
    }

    //附加图片地址
    function processImage(imgPath) {
        if (imgPath) {
            // 修正window的路径的正斜杠
            imgPath = imgPath.replace("/\\/g", "\/")

            // http图片路径直接返回不用处理
            if (imgPath.indexOf('http') != -1) {
                return encodeURI(imgPath)
            }
            // 处理cdn路径
            if (imgPath.indexOf('/UploadFiles/') != -1) {
                return encodeURI("http://app.localhome.cn" + imgPath)
            }
            // 处理cdn路径
            if (imgPath.indexOf('/upload/') != -1) {
                return encodeURI("http://app.localhome.cn" + imgPath)
            }
            // 如果file开头,本地文件,跳过处理
            if (imgPath.indexOf('file') != -1) {
                return imgPath
            }
            // 签名图
            if (imgPath.indexOf('/temp/') != -1) {
                var newPath = encodeURI("http://qy.localhome.com.cn/locals" + imgPath)
                return newPath
            }
            // 新服务图片URL
            return encodeURI("http://120.76.204.105" + imgPath)
        }
        return ''
    }

    //时间格式化
    function formatDate(time) {
        var _time = new Date(time);
        var year = _time.getFullYear();
        var month = (_time.getMonth() + 1) >= 10 ? (_time.getMonth() + 1) : '0' + (_time.getMonth() + 1);
        var day = _time.getDate() >= 10 ? _time.getDate() : '0' + _time.getDate();
        var hours = _time.getHours() >= 10 ? _time.getHours() : '0' + _time.getHours();
        var minutes = _time.getMinutes() >= 10 ? _time.getMinutes() : '0' + _time.getMinutes();

        var _dateStr = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
        return _dateStr;
    }

    //JS IOS/iPhone的Safari不兼容Javascript中的Date()问题
    function getDateTime(str) {
        var arr = str.split(/[- : \/]/);
        var time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]).getTime();
        return time;
    }

    //打开选择时间空间
    function openSelectDateTile(_self, endDateDom, type) {
        if (_self.picker) {
            _self.picker.show(function (rs) {
                //赋值给input
                _self.value = rs.text;
                if (type === 'start') {
                    var _endTime = getDateTime(rs.text) + 1000 * 60 * 60 * 2;
                    $(endDateDom).val(formatDate(_endTime));
                }
                _self.picker.dispose();
                _self.picker = null;

            });
        } else {
            var _date = new Date();
            var _month = (_date.getMonth() + 1) > 9 ? (_date.getMonth() + 1) : '0' + (_date.getMonth() + 1);
            var _day = _date.getDate() > 9 ? _date.getDate() : '0' + _date.getDate();
            var _hours = _date.getHours() > 9 ? _date.getHours() : '0' + _date.getHours();
            var _minutes = _date.getMinutes() > 9 ? _date.getMinutes() : '0' + _date.getMinutes();
            var dateTimeStr = _date.getFullYear() + '-' + _month + '-' + _day + ' ' + _hours + ':' + _minutes;
            var options = {
                value: dateTimeStr,
                beginDate: new Date(),
                endYear: 2020
            };
            /*
             * 首次显示时实例化组件
             * 示例为了简洁，将 options 放在了按钮的 dom 上
             * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
             */
            _self.picker = new mui.DtPicker(options);
            _self.picker.show(function (rs) {
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                //赋值给input
                _self.value = rs.text;
                if (type === 'start') {
                    var _endTime = getDateTime(rs.text) + 1000 * 60 * 60 * 2;
                    $(endDateDom).val(formatDate(_endTime));
                }
                /*
                 * 返回 false 可以阻止选择框的关闭
                 * return false;
                 */
                /*
                 * 释放组件资源，释放后将将不能再操作组件
                 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                 */
                _self.picker.dispose();
                _self.picker = null;
            });
        }
    }
})(window.mui);