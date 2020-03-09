import "../css/reset.less";
import "../css/enterpriseApprove.less";
require("@js/flexible.min.js");
import Config from "@js/config.js";
// require("../../../js/jquery.city.select.min.js");
import city_selector from "../../../js/city-select";
import {
  nameRegExp,
  emailRegExp,
  telRegExp,
  SocialCreditCodeRegExp,
  companyRegExp,
  showBody
} from "../../../js/util";
let api = Config.api;

$(function() {
  // 获取城市
  city_selector();
  let api = Config.api;

  showBody();
  // 点击提交
  $("#submit").click(function() {
    let statu = true;
    let name = $("#name").val();
    let mobile = $("#phone").val();
    let companyEmail = $("#email").val();
    let companyName = $("#company").val();
    let companyTaxpayerId = $("#tax-code").val() || '';
    let province = $("#province").val() || '';
    let city = $("#city").val() || '';
    let area = $("#area").val() || '';
    let address = $("#address").val() || '';
    let companyNature = $("#companyNature").val() || '';
    let companySize = $("#companySize").val() || '';



    if (!nameRegExp.test(name)) {
      statu = false;
      alert("请输入正确的姓名");
      return;
    }
    if (!telRegExp.test(mobile)) {
      statu = false;
      alert("请输入正确的手机号");
      return;
    }
    if (!testCompanyEmail(companyEmail)) {
      statu = false;
      alert("请输入正确的企业邮箱");
      return;
    }
    if (!companyRegExp.test(companyName)) {
      statu = false;
      alert("请输入正确的公司名称");
      return;
    }
    // if (companyTaxpayerId && !SocialCreditCodeRegExp.test(companyTaxpayerId)) {
    //   statu = false;
    //   alert("请输入正确的税号");
    //   return;
    // }
    // if (!province || !city || !area || !address) {
    //   statu = false;
    //   alert("请输入详细的地址");
    //   return;
    // }
    // if (!companyNature || !companySize) {
    //   statu = false;
    //   alert("请输入完整的公司相关信息");
    //   return;
    // }

    if (statu) {
      let params={
        "subject":"企业认证",
        "messageTo":["qin.su@localhome.com.cn","xin.guo@localhome.com.cn","jie.pan@localhome.com.cn","ula.yuan@localhome.com.cn","jiawei.chen@localhome.com.cn"],
        "content":`姓名:${name}
                          手机:${mobile}
                          企业邮箱:${companyEmail}
                          公司名称:${companyName}
                          公司税号:${companyTaxpayerId}
                          公司地址:${province + city + area + address}
                          公司性质:${companyNature}
                          公司规模:${companySize}`,
        "messageSource":"test",
        "attachments":[
        {
        "id":123,
        "path":""
        }
        ],
        "emailType":2
        }

      let agrument = {
        name:name,
        phoneNumber:mobile,
        companyName:companyName,
        email:companyEmail
      }
      $.when(
        $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          url: "https://ms.localhome.cn/api/message/mail",
          data: JSON.stringify(params),
        })
        // $.ajax({
        //   type:'POST',
        //   header:{
        //     "Content-Type": "application/json; charset=UTF-8"
        //   },
        //   url:"http://39.108.138.206:9100/api/ppAuthCompanyBusiness",
        //   data:agrument,
        // })
      ).done(function(res1){
        location.href = "./enterpriseApproveSuc.html";
        // if(res1[0].success&&res2[0].success){
        //   location.href = "./enterpriseApproveSuc.html";
        // }else if(!res2[0].success&&res2[0].errorMsg=='已认证过'){
        //     alert('您已认证过')
        //     return;
        // }
      })

    }
  });
  // 验证企业邮箱
  function testCompanyEmail(email) {
    if (!emailRegExp.test(email)) {
      // console.log(111);
      return false;
    }
    let emailArr = [
      "@126.com",
      "@163.net",
      "@188.com",
      "@yeah.net",
      "@gmail.com",
      "@googlemail.com",
      "@hotmail.com",
      "@yahoo.com",
      "@yahoo.com.cn",
      "@sina.com",
      "@sohu.com",
      "@tom.com",
      "@21cn.com",
      "@qq.com",
      "@263.net",
      "@189.cn",
      "@139.com",
      "@eyou.com",
      "@sogou.com"
    ];
    // 不容许出现上面的邮箱因为需要的事企业邮箱
    for (let i = 0; i < emailArr.length; i++) {
      if (email.indexOf(emailArr[i]) !== -1) {
        return false;
      }
    }
    return true;
  }
});
