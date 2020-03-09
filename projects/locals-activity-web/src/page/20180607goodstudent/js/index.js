import lrz from 'lrz'
import Config from '@js/config.js'
import { nameRegExp, telRegExp, cardRegExp} from '@js/util.js'
require('@js/flexible.min.js')
require('../css/mui.css')
require('../css/index.css')
require('../css/a.less')

;(function () {
    var api = Config.api;
    var inter,
        delay = 1000;

    var studentPicPath = null,
        actValidity = true,
        activiting = 1;

    init();
    
    $('#take-picture').on('change', upload);

    function upload () {
        lrz(this.files[0], {width: '600', quality: 0.7})
            .then(function (result) {
                var dataURL = result.base64;
                var fd = new FormData();
                var blob = dataURItoBlob(dataURL);
                fd.append('file', blob, blob.type.replace('/', '.'));
                var id = createUUID('xxxxxxxxxxxxxxxx',10);
                var url = api + '/atta/attachment-byte/model/' + id + '/name/goodstudent';
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.success) {
                            studentPicPath = res.data.filePath;
                            $('#upload-text').html('学生证已上传 √ ')
                            alert('收到你的学生证啦!!');
                        } else {
                            alert(res.errorDetail || '请求失败,请重新提交!');
                        }
                    }
                })
            }).catch(function (err) {
                console.log('图片处理失败!')
            })
    };

    $('.mui-content').on('click', '#submit', function (e) {
        var inputs = $('#inputs-area input');
        var status = true;
        
        if (!actValidity) {
            showActivityEndModal();
            return false;
        }

        inputs.each(function (index, item) {
            if (!$.trim(item.value) && item.name) {
                alert(item.placeholder + '不能为空');
                status = false;
                return false;
            }

            if (
                $(item).attr('name') === 'realName' && !nameRegExp.test(item.value)
            ) {
                alert('请输入正确的名字!');
                status = false;
                return false;
            }
            if ($(item).attr('name') === 'mobile' && !telRegExp.test(item.value)) {
                alert('请提交正确的手机号码');
                status = false;
                return false;
            }
            if ($(item).attr('name') === 'idCard' && !cardRegExp.test(item.value)) {
                alert('请提交正确的身份证号');
                status = false;
                return false;
            }
        })
        
        if (!status) {
            return false;
        }

        if (!studentPicPath) {
            alert('请上传您的学生证~');
            status = false;
            return false;
        }

        if (status) {
            var param = {
                'realName': $('input[name=realName]').get(0).value,
                'mobile': $('input[name=mobile]').get(0).value,
                'idCard': $('input[name=idCard]').get(0).value,
                'studentCardPicUrl': studentPicPath
            }
            var url = api + '/platform/exempt/deposit';
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(param),
                processData: false,
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                success: function (res) {
                    if (res.success) {
                        clearAllInput()
                        $('#activity-success').css('display', 'block');
                        alert('提交成功！');
                    } else {
                        alert(res.errorDetail || '请求失败,请重新提交!');
                    }
                },
                error: function () {
                    alert('请求失败!');
                }
            })
        }
    })

    $('#take-picture-button').on('click', function () {
        $('#take-picture').click();
    })

    $('input[class=phone]').on('keypress', function (e) {
        if (this.value.length >= 11) {    
            e.preventDefault();
        }
        if (!/\d/.test(e.key)) {
            e.preventDefault();
        }
    })

    $('input[class=card]').on('keypress', function (e) {
        if (this.value.length >= 18) {    
            e.preventDefault();
        }
        if (!/[0-9xX]+/g.test(e.key)) {
            e.preventDefault();
        }
    })

    $(document).on('ajaxBeforeSend', function (e) {
        inter = setInterval(loadingEffect($('#dot')), delay);
        $('#loading').css('display', 'block');
        if (!actValidity) {
            e.preventDefault();
            showActivityEndModal();
        }
    })

    $(document).on('ajaxComplete', function () {
        clearInterval(inter);
        $('#loading').css('display', 'none');
    })

    toggleModal($('#activity-end'));
    toggleModal($('#activity-success'));

    document.querySelector('#count').innerHTML = parseInt((+(+new Date())- +(+new Date(2018, 5, 20, 13)))/10000);

    function init () {
        actValidityControl()
    }
    function showActivityEndModal() {
        $('#activity-end').css('display', 'block');
    }
    function toggleModal (element) {
        $(element).find('#close, #mask, #ikonw').on('click', function () {
            element.css('display', 'none');
        })
    }
    function createUUID (t, ary){
        var d = +new Date();
        var uuid = t.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * ary) % ary | 0;
            d = Math.floor(d / ary);
            return (c === 'x' ? r : ((r && 0x7) || 0x8)).toString(ary);
        })
        return uuid;
    }
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }
    function loadingEffect (element) {
        var dot = '.'
        return function () {
            if (dot.length >= 6) {
                dot = dot.substr(0, 1)
            } else {
                dot = dot + '.'
            }
            element.html(dot)
        }
    }
    function actValidityControl () {
        var actType = 'd6a7b0dd96a34000b962c616fb0c8911';
        var url = api + '/act/validity-control/act-type?actType=' + actType;
        $.ajax({
            url: url,
            header: {
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    if (parseInt(res.data.validated) !== activiting) {
                        actValidity = false;
                        showActivityEndModal();
                    }
                }
            }
        })
    } 
})()