require('../css/animate.css')
require('../css/loading.css')
require('../css/index.css')

require('../js/loading.js')
import 'babel-polyfill'
import { createUUID, upload, getUrlArg } from "../../../js/util.js";
import { api } from "../../../js/config.js";
const app = new Framework7({
    root: '#app',
    theme: 'ios'
});

const CleanKeeping = CleanKeeping || {
    isRepeat: false,
    isRegister: false,
    countdown: 60,
    imageList: [],
    selectedTimeList: [],
    init: async function () {
        app.views.create('.view-main');
        const cleanKeepDate = app.calendar.create({
            inputEl: '#clean-keep-date',
            monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            closeOnSelect: true
        });
        const today = new Date();
        const pickerInline = app.picker.create({
            inputEl: '#clean-keep-picker-time',
            toolbarCloseText: '完成',
            value: [
                12,
                30,
                13,
                30
            ],
            formatValue: function (values, displayValues) {
                return values[0] + ':' + values[1] + ' ~ ' + values[2] + ':' + values[3] + '';
            },
            cols: [
                // Hours
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) { arr.push(i); }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                        return arr;
                    })(),
                },
                {
                    divider: true,
                    content: '至'
                },
                // Hours
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) { arr.push(i); }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function () {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                        return arr;
                    })(),
                },
            ],
            on: {
                open: function (picker) {
                    picker.$el.find('.toolbar-randomize-link').on('click', function () {
                        var col0Values = picker.cols[0].values;
                        var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

                        var col1Values = picker.cols[2].values;
                        var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

                        var col2Values = picker.cols[4].values;
                        var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];

                        var col3Values = picker.cols[6].values;
                        var col3Random = col3Values[Math.floor(Math.random() * col3Values.length)];

                        picker.setValue([col0Random, col1Random, col2Random, col3Random]);
                    });
                },
                change: function (picker, values, displayValues) {
                    CleanKeeping.selectedTimeList = values;
                },
            }
        });
        //初始化监听预览图片
        CleanKeeping.monitorClickEvent();
        CleanKeeping.getStepRemarkList();

    },
    //监听事件
    monitorClickEvent: function() {
        //上传图片
        $(".file-upload").change(function(){
            let ids = createUUID('xxxxxxxxxxxxxxxx',10);
            CleanKeeping.loading('图片上传中');
            upload('cleaner', ids + ".png", this.files[0], function (result) {
                if(!result.errorMsg) {
                    CleanKeeping.imageList.push(result);
                    CleanKeeping.innerHtmlImageItem(result);
                }
                CleanKeeping.hideLoading();
            });

        });
        //删除图片
        $('.upload-wrapper').on('click','.delete-image',function (e) {
            const _this = this;
            const imageUrl = $(_this).data('url');
            CleanKeeping.imageList.forEach((item,index) => {
                if(imageUrl === item) {
                    CleanKeeping.imageList.splice(index, 1)
                }
            });
            $(_this).parent('.show-image-layer').remove();

        });
        //提交
        $('.submit-button').click(function () {
            CleanKeeping.submitForm();
        });
        $('.textarea').on('blur',function () {
            window.scrollTo(0, 0);
        });
        // 订单编号
        const urlParams = getUrlArg();
        $('#orderCode').val(urlParams.orderCode);
    },
    submitForm: function() {
        const urlParams = getUrlArg();
        const formData = app.form.convertToData('#form-submit');
        if(!!formData.remark) {
            formData.stepRemarkList.push(formData.remark);
        }

        if(!formData.cleanerName) {
            app.toast.create({
                text: '请输入姓名',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            return;
        }
        if(!formData.cleanerPhone) {
            app.toast.create({
                text: '请输入保洁员手机号',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            return;
        }else{
            if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(formData.cleanerPhone))){
                app.toast.create({
                    text: '手机号输入有误',
                    position: 'center',
                    closeTimeout: 3000,
                }).open();
                return;
            }
        }
        if(!formData.cleanerTime) {
            app.toast.create({
                text: '请选择保洁日期',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            return;
        }
        if(!formData.cleanerTimeRange) {
            app.toast.create({
                text: '请选择保洁时间',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            return;
        }
        if(CleanKeeping.imageList.length === 0) {
            app.toast.create({
                text: '请上传保洁后效果图',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            return;
        }

        const startDateStr = formData.cleanerTime + ' ' + CleanKeeping.selectedTimeList[0] + ':' + CleanKeeping.selectedTimeList[1] + ':00';
        const endDateStr = formData.cleanerTime + ' ' + CleanKeeping.selectedTimeList[2] + ':' + CleanKeeping.selectedTimeList[3];
        let objImageList = []
        CleanKeeping.imageList.forEach(item => {
            objImageList.push({
                image: item
            })
        });
        const params = {
            order: {
                id: urlParams.cleanOrderId,
                orderCode: urlParams.orderCode,
                cleanerPhone: formData.cleanerPhone,
                cleanerTime: moment(formData.cleanerTime),
                orderType: '3',// 1.系统派单2.抢单3.线下单
                ruleId: urlParams.ruleId,
                cleanerName: formData.cleanerName,
                assistantId: urlParams.assistantId,
                houseSourceId: urlParams.houseSourceId,
                cleaningTimeStart: moment(startDateStr),
                cleaningTimeEnd: moment(endDateStr)
            },
            orderImageList: objImageList,
            stepRemarkList: formData.stepRemarkList,
        }
        if(CleanKeeping.isRepeat) {
            return ;
        }
        CleanKeeping.isRepeat = true;
        CleanKeeping.loading('提交中');
        try {
            if(urlParams.handleType && urlParams.handleType === 'cleaner') {
                app.request({
                    url: `${api}/cleaning/offline/link/order`,
                    method: 'POST',
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8;',
                    success: function (res) {
                        res = JSON.parse(res);
                        if(res.success){
                            app.dialog.alert('提交成功', '温馨提示', function () {
                                location.reload();

                            });
                        }else {
                            app.toast.create({
                                text: res.errorDetail,
                                position: 'center',
                                closeTimeout: 3000,
                            }).open();

                        }
                        CleanKeeping.isRepeat = false;
                        CleanKeeping.hideLoading();
                    },
                    error: function (err) {
                        app.toast.create({
                            text: '提交出错，请与管家联系',
                            position: 'center',
                            closeTimeout: 3000,
                        }).open();
                        CleanKeeping.isRepeat = false;
                        CleanKeeping.hideLoading();
                    }
                });
            } else if(urlParams.handleType && urlParams.handleType === 'assistant') {
                app.request({
                    url: `${api}/cleaning/offline/direct/order`,
                    method: 'POST',
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8;',
                    success: function (res) {
                        res = JSON.parse(res);
                        if(res.success){
                            app.dialog.alert('提交成功', '温馨提示', function () {
                                location.reload();
                            });

                        }else {
                            app.toast.create({
                                text: res.errorDetail,
                                position: 'center',
                                closeTimeout: 3000,
                            }).open();
                        }
                        CleanKeeping.isRepeat = false;
                        CleanKeeping.hideLoading();
                    },
                    error: function (err) {
                        app.toast.create({
                            text: '提交出错，请与管家联系',
                            position: 'center',
                            closeTimeout: 3000,
                        }).open();
                        CleanKeeping.isRepeat = false;
                        CleanKeeping.hideLoading();

                    }
                });
            }else {
                app.toast.create({
                    text: '链接页面有问题，请与管家联系',
                    position: 'center',
                    closeTimeout: 3000,
                }).open();
                CleanKeeping.isRepeat = false;
                CleanKeeping.hideLoading();
            }
        } catch (e) {
            app.toast.create({
                text: '页面出错，请与管家联系',
                position: 'center',
                closeTimeout: 3000,
            }).open();
            CleanKeeping.isRepeat = false;
            CleanKeeping.hideLoading();
        }
    },
    innerHtmlImageItem: function(url) {
        $('.upload-wrapper').prepend(
            '<div class="show-image show-image-layer">' +
                '<img src="'+ url +'" />' +
                '<span class="delete-image" data-url="'+ url +'">x</span>' +
            '</div>'
        );
    },
    showPhotoLayer: function () {
        app.photoBrowser.create({
            navbar: false,
            photos : CleanKeeping.imageList,
            theme: 'dark',
            type: 'popup'
        }).open();

    },
    getStepRemarkList: function() {
        app.request.get(`${api}/cleaning/offline/rule/detail`, {}, function (res) {
            const data = JSON.parse(res);
            if(data.success) {
                let htmlStr = '';
                data.data.forEach(item => {
                    htmlStr +=
                        `<li><label class="item-checkbox item-content"><div class="item-inner">` +
                        `<div class="item-title" style="font-size: 15px;">${item}</div>` +
                        `<input type="checkbox" name="stepRemarkList" value="${item}"/>` +
                        `<i class="icon icon-checkbox"></i></div></label></li>`;
                });
                $('.step-remark-list').append(htmlStr)
            }

        });
    },
    msg: function (text) {
        app.toast.create({
            text: text,
            position: 'center',
            closeTimeout: 3000,
        }).open();
    },
    loading: function (dis = '') {
        $('body').loading({
            loadingWidth:120,
            title:'',
            name:'loading',
            discription: dis,
            direction:'column',
            type:'origin',
            originDivWidth:40,
            originDivHeight:40,
            originWidth:6,
            originHeight:6,
            smallLoading:false,
            loadingMaskBg:'rgba(0,0,0,0.2)'
        });
    },
    hideLoading: function () {
        $(".cpt-loading-mask[data-name='loading']").remove();
    }
}
CleanKeeping.init();



