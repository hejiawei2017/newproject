import '../css/index.less'
import '../css/reset.less'
// require("@js/flexible.min.js");
import Config from "@js/config.js";
import regConfig from "@js/regConfig.js"
(function() {
    let getCodeButton = document.getElementById('getCode');
    let aform = document.getElementById('aform')
    let api = Config.api
    let countTime
    let initTime = countTime = 60
    let timeId
    getCodeButton.addEventListener('click',function (e){
        e.preventDefault()
        let mobile = document.getElementsByName('mobile')[0].value
        if(regConfig.Mobile(mobile) && initTime === countTime){
            CountdownTime()
            pajax({
                method: 'post',
                url: api + '/platform/auth/auth-code/send',
                data: {mobile}
            }).then((e)=>{
                if(e.success){
                    showModal("验证码已发送，请等待")
                }else{
                    showModal(e.errorDetail)
                }
            })
        }else if(initTime === countTime){
            showModal("请输入正确手机号")
        }
    })
    aform.addEventListener('submit',function (e){
        // var formData = new FormData(aform);
        // console.log('aform submit', formData, countTime, timeId)
        e.preventDefault()
        let realName = document.getElementsByName('realName')[0].value
        let sex = document.getElementsByName('sex')[0].checked === true ? 1 : 0
        let idCard = document.getElementsByName('idCard')[0].value
        let privateEmail = document.getElementsByName('privateEmail')[0].value
        let mobile = document.getElementsByName('mobile')[0].value
        let education = document.getElementsByName('education')[0].value
        let code = document.getElementsByName('code')[0].value
        if(!(realName && realName.length > 1)){
            showModal('请输入名字')
            return false;
        }
        if(!regConfig.IdCard(idCard)){
            showModal('请输入正确身份证号码')
            return false;
        }
        if(!regConfig.email(privateEmail)){
            showModal('请输入邮箱！')
            return false;
        }
        if(!regConfig.Mobile(mobile)){
            showModal('请输入手机号码！')
            return false;
        }
        if(!(code && code.length > 3)){
            showModal('请输入验证码！')
            return false;
        }
        let params = {
            realName,
            sex,
            idCard,
            privateEmail,
            mobile,
            // code,
            education,
        }
        // console.log('params', params)
        pajax({
            method: 'post',
            url: api + '/platform/employee-biz/register?code=' + code,
            dataType: 'json',
            data: params
        }).then((e)=>{
            // console.log(e);
            if(e.success){
                showModal("注册成功，请等待审核")
                realName = ''
                idCard = ''
                privateEmail = ''
                mobile = ''
            }else{
                showModal(e.errorDetail)
            }
        })
    })
    function CountdownTime (){
        let getCode = $("#getCode")
        countTime--;
        getCode.addClass('no-active')
        getCode.text(countTime)
        timeId = setInterval(function(){
            countTime--;
            if(countTime < 1){
                getCode.text('获取')
                getCode.removeClass('no-active')
                countTime = initTime
                clearInterval(timeId)
            }else{
                getCode.text(countTime)
            }
            // console.log('countTime=>', countTime)
        },1000)
    }
})();
function showModal(text){
    let tipsModal = document.getElementsByClassName('tipsModal')[0];
    tipsModal.innerText = text
    tipsModal.style.display = 'block';
    setTimeout(()=>{
        tipsModal.style.display = 'none';
    },3000)
}
function pajax({
    url= null,
    method = 'get',
    dataType = 'json',
    data = {},
    async = true}){
    return new Promise((resolve, reject) => {
        let xhr
        if(XMLHttpRequest){
            xhr = new XMLHttpRequest();
         }else{
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open(method, url, async)
        xhr.onreadystatechange = () => {
            if(!/^[23]\d{2}$/.test(xhr.status)) return
            if(xhr.readyState === 4) {
                var result = xhr.responseText
                // console.log('dataType', dataType, typeof result)
                switch(dataType.toUpperCase()){
                    case 'TEXT':
                    case 'HTML':
                        break;
                    case 'JSON':
                        result = JSON.parse(result)
                        break;
                    case 'XML':
                        result = xhr.responseXML
                }
                resolve(result)
            }
        }
        xhr.onerror = (err) => {
            reject(err)
        }
        if(method == 'get'){
            xhr.send()
        }else{
            xhr.setRequestHeader('content-type','application/json');
            let postData = JSON.stringify(data)
            xhr.send(postData)
        }
    })
}