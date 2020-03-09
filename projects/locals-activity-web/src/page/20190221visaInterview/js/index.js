import _ from 'lodash'
import Vue from 'vue'
import config from '@js/config.js'
import axios from 'axios'
import VModal from 'vue-js-modal'
import { ModelListSelect } from 'vue-search-select'
import 'babel-polyfill'

import desQuestion from './DesQuestion.js'
import camQuestion from './CamQuestion.js'
import pmQuestion from './PmQuestion.js'
import cityList from './city.js'

import "babel-polyfill"
import "../css/index.less"
import { showBody, upload ,createUUID,myToast,getCode,wxScrollSolve} from "../../../js/util"

import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'


let USERINFO = ""
axios.defaults.baseURL = config.api
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.use(VModal)
Vue.component("des-question",desQuestion)
Vue.component("cam-question",camQuestion)
Vue.component("pm-question",pmQuestion)

$(function() {
  showBody();// 禁止模态框滚动
  wxScrollSolve(document.querySelector('.body'));

    async function getUserInfo() {
        // 等待获取token
        await getCode();

        if (sessionStorage.getItem("token")) {
            $.ajax({
                type: "GET",
                headers: {
                    "LOCALS-ACCESS-TOKEN": "Bearer " + sessionStorage.getItem("token")
                },
                url: config.api + "/platform/user/user-info",
                success: function (res) {
                sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                USERINFO = res.data;
                }
            });
        }
    }
  // 如果是直接微信打开获取授权和token
  getUserInfo();

  var vm = new Vue({
    el: "#app",
    components: {
        "vue-form-generator": VueFormGenerator.component,
        VModal,
        ModelListSelect
    },
    data() {
        return {
                answerObj: cityList.optionObj,
                options: cityList.list,
                item: {
                    value: ''
                },
                signatureArr: [],
                companyLicenseArr: [],
                fileSignature: "",
                showModal: 0,
                submitDisable:false,
                model: {
                    openId: "",
                    memberId: USERINFO.id,//用户ID
                    contractType: "",
                    refereePhone: USERINFO.mobile || "",
                    phone: USERINFO.mobile || "",
                    name: "",
                    payeeName:"",
                    companyName:"",
                    idCard: "",
                    wechat: "",
                    email: "",
                    address: "",
                    accountName: "",
                    accountNumber: "",
                    openBank: "",
                    alipayNumber: "",
                    referee: "",
                    signCity: "",
                    signType: "",
                    teanName: "",
                    workStatus: "",
                    workAge: "",
                    introduce: "",
                    signature: "",//签名图片
                    score: 0,
                    orderStatus: "",
                    resume: "",//简历
                    remark: "",
                    signDistrict: "",//接单区域
                    companyLicense: "",//营业执照
                    companyPhone: "",//公司联系电话
                },
                selectArr:{
                    contractType:[],
                    signCity:[],
                    signType:[],
                    workStatus:[],
                    workAge:[],
                    orderStatus:[],
                },
                /**
                 * 默认 -- 签约类型，区域城市
                 * 设计师 -- 签约类型，签约方式，接单城市
                 * 项目经理/摄影师 -- 签约类型，区域城市
                 */

                /**
                 * 个人信息
                 * 默认 -- 姓名，工作状态，工作年限
                 * 设计师 -- 姓名，【所属公司/工作室/自由】，身份证，联系电话，邮箱，微信，常住地址，工作状态，工作年限
                 * 项目经理/摄影师 -- 姓名，身份证，联系电话，邮箱，微信，常住地址，工作状态，工作年限
                 * 保洁 cleaner --
                 *      个人/团队: 姓名，【所属公司/工作室/自由】，身份证，联系电话，邮箱，微信，常住地址
                 *      公司: 公司名，对接人姓名，对接人身份证，营业执照，联系电话，公司邮箱，业务对接人联系电话，业务对接人微信
                 * 助理房东 aid -- 姓名，【所属公司/工作室/自由】，身份证，联系电话，邮箱，微信，常住地址，工作状态，工作年限
                 */
                personSchema: {},
                //保洁-个人 | 团队
                cleanerPersonSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "姓名（乙方）",
                        model: "name",
                        required: true,
                        hint: "与收款人姓名对应",
                        placeholder: "姓名（乙方）",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "所属公司/工作室/自由",
                        model: "companyName",
                        required: true,
                        placeholder: "所属公司/工作室/自由",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }

                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "身份证",
                        model: "idCard",
                        required: true,
                        placeholder: "身份证",
                        validator: function (val) {
                            let reg = new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/)
                            return reg.test(val) ? true : "请输入正确身份证"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "联系电话",
                        model: "phone",
                        min: 11,
                        required: true,
                        placeholder: "联系电话",
                        validator: function (val) {
                            let reg = new RegExp(/^1[3-9]\d{9}$/)
                            return reg.test(val) ? true : "请输入联系电话"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "邮箱",
                        model: "email",
                        required: false,
                        placeholder: "邮箱",
                        validator: function (val) {
                            let reg = new RegExp(/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i)
                            return reg.test(val) ? true : "请输入邮箱"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "微信",
                        model: "wechat",
                        min: 6,
                        required: true,
                        placeholder: "微信",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "常住地址",
                        model: "address",
                        min: 6,
                        max: 200,
                        required: true,
                        placeholder: "常住地址",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 200) {
                                return "大于200字符"
                            } else {
                                return true
                            }
                        }
                    }]
                },
                //保洁-公司
                cleanerCompanySchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "公司名（乙方）",
                        model: "companyName",
                        required: true,
                        hint: "与收款人姓名对应",
                        placeholder: "公司名（乙方）",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "公司联系电话",
                        model: "companyPhone",
                        required: true,
                        placeholder: "公司联系电话",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "公司邮箱",
                        model: "email",
                        required: true,
                        placeholder: "公司邮箱",
                        validator: function (val) {
                            let reg = new RegExp(/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i)
                            return reg.test(val) ? true : "请输入邮箱"
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "业务对接人",
                        model: "name",
                        required: true,
                        placeholder: "业务对接人",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "身份证",
                        model: "idCard",
                        required: true,
                        placeholder: "身份证",
                        validator: function (val) {
                            let reg = new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/)
                            return reg.test(val) ? true : "请输入正确身份证"
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "业务对接人联系电话",
                        model: "phone",
                        required: true,
                        placeholder: "业务对接人联系电话",
                        validator: function (val) {
                            let reg = new RegExp(/^1[3-9]\d{9}$/)
                            return reg.test(val) ? true : "请输入联系电话"
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "业务对接人微信",
                        model: "wechat",
                        required: true,
                        placeholder: "业务对接人微信",
                        validator: function (val) {
                            if (val == "") {
                                return "不能为空"
                            } else if (val && val.length >= 50) {
                                return "大于50字符"
                            } else {
                                return true
                            }
                        }
                    }],
                },
                /**
                 * 收款账号信息
                 * 默认 -- 收款人真实姓名 支付宝账户
                 * 设计师/摄影师 -- 收款人真实姓名，支付宝账户，开户行，收款方，收款账号
                 * 项目经理 -- 收款人真实姓名 支付宝账户
                 */
                shroffSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "开户行",
                        model: "openBank",
                        min: 10,
                        max: 30,
                        required: true,
                        placeholder: "请优先选择招商银行",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "收款方",
                        model: "accountName",
                        required: true,
                        max: 30,
                        placeholder: "收款方",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "收款账号",
                        model: "accountNumber",
                        min: 10,
                        max: 30,
                        required: true,
                        placeholder: "收款账号",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    }]
                },
                aidShroffSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "支付宝收款人真实姓名",
                        model: "payeeName",
                        min: 10,
                        max: 30,
                        required: true,
                        placeholder: "支付宝收款人真实姓名",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "支付宝账号",
                        model: "alipayNumber",
                        required: true,
                        max: 30,
                        placeholder: "支付宝账号",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "开户行",
                        model: "openBank",
                        min: 10,
                        max: 30,
                        required: false,
                        placeholder: "请优先选择招商银行",
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "收款方",
                        model: "accountName",
                        required: false,
                        max: 30,
                        placeholder: "收款方",
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "收款账号",
                        model: "accountNumber",
                        min: 10,
                        max: 30,
                        required: false,
                        placeholder: "收款账号",
                    }]
                },
                aidOtherSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "人员类型",
                        model: "staffType",
                        required: true,
                        placeholder: "如社会人士",
                        validator: function (val) {
                            return (val == "") ? "不能为空" : true;
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "来源渠道",
                        model: "fromChannel",
                        required: true,
                        placeholder: "如员工介绍",
                        validator: function (val) {
                            return (val == "") ? "不能为空" : true;
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "其它来源渠道",
                        model: "otherChannel",
                        required: false,
                        placeholder: "其它来源渠道",
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "紧急联系人",
                        model: "urgentContact",
                        required: true,
                        placeholder: "紧急联系人",
                        validator: function (val) {
                            return (val == "") ? "不能为空" : true;
                        }
                    },{
                        type: 'input',
                        inputType: 'text',
                        label: "紧急联系人电话",
                        model: "urgentContactPhone",
                        required: true,
                        placeholder: "紧急联系人电话",
                        validator: function (val) {
                            return (val == "") ? "不能为空" : true;
                        }
                    }],
                },
                /**
                 * 简历上传
                 * 默认 -- 简历上传
                 * 设计师 -- 设计师介绍 设计师签名 推荐人信息 考核分数
                 * 摄影师/项目经理 --  简历上传
                 * 保洁 & 公司 -- 营业执照
                 */
                teamNameSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "团队名称",
                        model: "teanName",
                        required: true,
                        max: 30,
                        placeholder: "团队名称",
                        validator: function(val){
                            return (val=="") ? "不能为空" : true;
                        }
                    }]
                },
                 /**
                 * 推荐人信息
                 * 默认 -- 收款人真实姓名 支付宝账户
                 * 设计师/摄影师 -- 收款人真实姓名，支付宝账户，开户行，收款方，收款账号
                 * 项目经理 -- 收款人真实姓名 支付宝账户
                 */
                referrerSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "推荐人姓名",
                        model: "referee",
                        required: false,
                        placeholder: "推荐人姓名",
                        validator: function(val){
                            if(val && val.length >= 50){
                                return "大于50字符"
                            }else{
                                return true
                            }
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "联系方式",
                        model: "refereePhone",
                        min: 11,
                        max: 11,
                        required: false,
                        validator: function(val){
                            if(val && val.length >= 1){
                                let reg = new RegExp(/^1[3-9]\d{9}$/)
                                return reg.test(val) ? true : "请输入联系方式"
                            }
                        },
                        placeholder: "联系方式"
                    }]
                },
                 /**
                 * 考核分数
                 * 默认 -- 收款人真实姓名 支付宝账户
                 * 设计师/摄影师 -- 收款人真实姓名，支付宝账户，开户行，收款方，收款账号
                 * 项目经理 -- 收款人真实姓名 支付宝账户
                 */
                assessSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "考核分数",
                        model: "score",
                        required: true,
                        max:"100",
                        readonly: true,
                        disabled: true,
                        max: 3,
                        validator: function(val){
                           if(val){
                            return true
                           }
                           return "请点击【做题】"
                        },
                        placeholder: "0"
                    }]
                },
                switchChema: {
                    fields: [{
                        type: 'checkbox',
                        label: '我同意',
                        model: 'agree'
                      }]
                },
                signDistrictSchema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        model: "signDistrict",
                        required: false,
                        max: 30,
                        placeholder: "接单城市所属行政区域",
                        validator: function (val) {}
                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        methods: {
            getValidate:function(){
                switch (this.model.contractType){
                    case "签约设计师":
                        if(this.model.signType === "") return {type:false, toast:"签约方式,不能为空"};
                        if(this.model.name === "") return {type:false, toast:"姓名（乙方）不能为空"};
                        if(this.model.companyName === "" && this.model.signType == 0) return {type:false, toast:"所属公司/工作室/自由 不能为空"};
                        if(this.model.teanName === "" && this.model.signType == 1) return {type:false, toast:"团队名称 不能为空"};
                        if(this.model.idCard === "" && this.model.signType == 0) return {type:false, toast:"身份证 不能为空"};
                        if(this.model.phone === "" && this.model.signType == 0) return {type:false, toast:"联系电话 不能为空"};
                        if(this.model.email === "" && this.model.signType == 0) return {type:false, toast:"邮箱 不能为空"};
                        if(this.model.wechat === "" && this.model.signType == 0) return {type:false, toast:"微信 不能为空"};
                        if(this.model.address === "" && this.model.signType == 0) return {type:false, toast:"常住地址 不能为空"};
                        if(this.model.workStatus === "") return {type:false, toast:"工作状态 不能为空"};
                        if(this.model.workAge === "") return {type:false, toast:"工作年限 不能为空"};
                        if(this.model.openBank === "") return {type:false, toast:"开户行 不能为空"};
                        if(this.model.accountName === "") return {type:false, toast:"收款方 不能为空"};
                        if(this.model.accountNumber === "") return {type:false, toast:"收款账号 不能为空"};
                        if(this.model.introduce === "" && this.model.signType == 0) return {type:false, toast:"设计师介绍 不能为空"};
                        if(this.model.introduce === "" && this.model.signType == 1) return {type:false, toast:"团队介绍 不能为空"};
                        if(this.model.signature === "" && this.model.signType == 0) return {type:false, toast:"设计师签名 不能为空"};

                        if(this.model.score < 90) return {type:false, toast:"你还没做题哦。请点击【开始做题】"};
                        break
                    case "签约摄影师":
                    case "签约项目经理":
                        if(this.model.name === "") return {type:false, toast:"姓名（乙方）不能为空"};
                        if(this.model.idCard === "") return {type:false, toast:"身份证 不能为空"};
                        if(this.model.phone === "") return {type:false, toast:"联系电话 不能为空"};
                        if(this.model.email === "") return {type:false, toast:"邮箱 不能为空"};
                        if(this.model.wechat === "") return {type:false, toast:"微信 不能为空"};
                        if(this.model.address === "") return {type:false, toast:"常住地址 不能为空"};
                        if(this.model.workStatus === "") return {type:false, toast:"工作状态 不能为空"};
                        if(this.model.workAge === "") return {type:false, toast:"工作年限 不能为空"};
                        if(this.model.openBank === "") return {type:false, toast:"开户行 不能为空"};
                        if(this.model.accountName === "") return {type:false, toast:"收款方 不能为空"};
                        if(this.model.accountNumber === "") return {type:false, toast:"收款账号 不能为空"};

                        if(this.model.score < 100 && this.model.contractType =="签约摄影师") return {type:false, toast:"你还没做题哦。请点击【开始做题】"};
                        if(this.model.score < 90 && this.model.contractType =="签约项目经理") return {type:false, toast:"你还没做题哦。请点击【开始做题】"};
                        break
                    case "全职保洁":
                    case "兼职保洁":
                        //字段命名坑！contractType签约类型, signType签约方式
                        if (this.model.contractType === "") return { type: false, toast: "签约类型 不能为空" };
                        if (this.model.signType === "") return { type: false, toast: "签约方式 不能为空" };
                        if (this.model.signCity === "") return { type: false, toast: "接单城市 不能为空" };
                        if (this.model.signType == 2) {
                            if (this.model.companyName === "") return { type: false, toast: "公司名（乙方）不能为空" };
                            if (this.model.companyPhone === "") return { type: false, toast: "公司联系电话 不能为空" };
                            if (this.model.email === "") return { type: false, toast: "邮箱 不能为空" };
                            if (this.model.name === "") return { type: false, toast: "业务对接人" };
                            if (this.model.idCard === "") return { type: false, toast: "身份证 不能为空" };
                            if (this.model.phone === "") return { type: false, toast: "业务对接人联系电话 不能为空" };
                            if (this.model.wechat === "" ) return { type: false, toast: "业务对接人微信 不能为空" };
                            if (this.model.companyLicense === "" ) return { type: false, toast: "营业执照 不能为空" };
                        }else {
                            if (this.model.name === "") return { type: false, toast: "姓名（乙方）不能为空" };
                            if (this.model.companyName === "") return { type: false, toast: "所属公司/工作室/自由" };
                            if (this.model.idCard === "") return { type: false, toast: "身份证 不能为空" };
                            if (this.model.phone === "") return { type: false, toast: "联系电话 不能为空" };
                            if (this.model.email === "") return { type: false, toast: "邮箱 不能为空" };
                            if (this.model.wechat === "") return { type: false, toast: "微信 不能为空" };
                            if (this.model.address === "") return { type: false, toast: "常住地址" };
                        }

                        if (this.model.openBank === "") return { type: false, toast: "开户行 不能为空" };
                        if (this.model.accountName === "") return { type: false, toast: "收款方 不能为空" };
                        if (this.model.accountNumber === "") return { type: false, toast: "收款账号 不能为空" };
                        break
                    case "签约助理房东":
                        if (this.model.contractType === "") return { type: false, toast: "签约类型 不能为空" };
                        if (this.model.name === "") return { type: false, toast: "姓名（乙方）不能为空" };
                        if (this.model.companyName === "") return { type: false, toast: "所属公司/工作室/自由 不能为空" };
                        if (this.model.idCard === "") return { type: false, toast: "身份证 不能为空" };
                        if (this.model.phone === "") return { type: false, toast: "联系电话 不能为空" };
                        if (this.model.email === "") return { type: false, toast: "邮箱 不能为空" };
                        if (this.model.wechat === "") return { type: false, toast: "微信 不能为空" };
                        if (this.model.address === "") return { type: false, toast: "常住地址 不能为空" };
                        if (this.model.workStatus === "") return { type: false, toast: "工作状态 不能为空" };
                        if (this.model.workAge === "") return { type: false, toast: "工作年限 不能为空" };
                        if (this.model.payeeName === "") return { type: false, toast: "收款人真实姓名 不能为空" };
                        if (this.model.alipayNumber === "") return { type: false, toast: "支付宝账号 不能为空" };
                        if (this.model.staffType === "") return { type: false, toast: "人员类型  不能为空" };
                        if (this.model.fromChannel === "") return { type: false, toast: "来源渠道 不能为空" };
                        if (this.model.urgentContact === "") return { type: false, toast: "紧急联系人 不能为空" };
                        if (this.model.urgentContactPhone === "") return { type: false, toast: "紧急联系人电话 不能为空" };
                        break
                    default :
                        break
                }

                if(this.model.signCity === "") return {type:false,toast:"接单城市,不能为空"};
                if(this.model.signType != 1 && !this.model.agree) return {type:false,toast:"请阅读文档,并且点击同意"};

                return {type:true,toast:""};
            },
            personSchemaBaseObj:function(){
                return {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: "姓名（乙方）",
                        model: "name",
                        required: true,
                        hint: "与收款人姓名对应",
                        placeholder: "姓名（乙方）",
                        validator: function(val){
                            if(val == ""){
                                return "不能为空"
                            }else if(val && val.length >= 50){
                                return "大于50字符"
                            }else{
                                return true
                            }
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "身份证",
                        model: "idCard",
                        required: true,
                        placeholder: "身份证",
                        validator: function(val){
                            let reg = new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/)
                            return reg.test(val) ? true : "请输入正确身份证"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "联系电话",
                        model: "phone",
                        min: 11,
                        required: true,
                        placeholder: "联系电话",
                        validator: function(val){
                            let reg = new RegExp(/^1[3-9]\d{9}$/)
                            return reg.test(val) ? true : "请输入联系电话"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "邮箱",
                        model: "email",
                        required: true,
                        placeholder: "邮箱",
                        validator: function(val){
                            let reg = new RegExp(/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i)
                            return reg.test(val) ? true : "请输入邮箱"
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "微信",
                        model: "wechat",
                        min: 6,
                        required: true,
                        placeholder: "微信",
                        validator: function(val){
                            if(val == ""){
                                return "不能为空"
                            }else if(val && val.length >= 50){
                                return "大于50字符"
                            }else{
                                return true
                            }
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: "常住地址",
                        model: "address",
                        min: 6,
                        max: 200,
                        required: true,
                        placeholder: "常住地址",
                        validator: function(val){
                            if(val == ""){
                                return "不能为空"
                            }else if(val && val.length >= 200){
                                return "大于200字符"
                            }else{
                                return true
                            }
                        }

                    }]
                }
            },
            personSchemaComponyObj:function(){
                return {
                    type: 'input',
                    inputType: 'text',
                    label: "所属公司/工作室/自由",
                    model: "companyName",
                    required: true,
                    placeholder: "所属公司/工作室/自由",
                    validator: function(val){
                        if(val == ""){
                            return "不能为空"
                        }else if(val && val.length >= 50){
                            return "大于50字符"
                        }else{
                            return true
                        }
                    }

                }
            },
            getFormatSelect: function(setText,setValue,arr,setValueType = "str"){
                let list = []
                arr.map((item,index)=>{
                    if(setValueType == "index"){
                        list.push({value:index,text:item[setText]})
                    }else{
                        list.push({value:item[setValue],text:item[setText]})
                    }
                })
                return list
            },
            getDic: function ({setValueType,type,key,fun}) {//获取字典
                    let self = this
                    axios.get(`/base/system-parameters?categoryCode=${type}`)
                    .then(function (response) {
                        let _data = response.data
                        if(_data.success){
                            let _obj = {[key]:self.getFormatSelect('name','name',_data.data.list,setValueType)}
                            vm.selectArr = Object.assign({},vm.selectArr,_obj)
                            fun && fun(_obj)
                        }else{
                            myToast(_data.errorDetail)
                        }
                    })
            },
            listenPersonSchema:function(){
                let _obj = this.personSchemaBaseObj()

                if (this.model.contractType == "签约设计师" || this.model.contractType == '签约助理房东'){
                    _obj.fields.splice(1,0,this.personSchemaComponyObj())
                }
                vm.personSchema = Object.assign({},vm.personSchema,_obj)
                vm.model.score = 0
                //vm.model.agree = false

                Object.keys(vm.model).forEach(function(key){
                    if(!(key == "score" || key =="signCity" ||  key == "memberId" || key == "contractType" || key == "refereePhone" || key == "phone" )){
                        vm.model[key] = "";
                    }
               });
            },
            listenSignTypePerson:function(){
                let _obj = this.personSchemaBaseObj()

                if(this.model.contractType == "签约设计师"){
                    if(this.model.signType == 1){
                        _obj.fields.splice(1,_obj.fields.length)
                        this.model.teanName = ""
                    }else{
                        _obj.fields.splice(1,0,this.personSchemaComponyObj())
                        this.model.companyName = ""
                    }
                }
                if(this.model.contracttype == '签约助理房东'){
                    _obj.fields.splice(1, 0, this.personSchemaComponyObj())
                    this.model.companyName = ""
                }
                vm.personSchema = Object.assign({},vm.personSchema,_obj)
            },
            checkRole:function(roleStr,key){//根据角色来显示模块
                //let roleArr = ['des','cam','pm','land'] 设计师,摄影师,项目经理,助理房东
                //用法 roleStr 角色，key 模块名。角色+模块名结合才显示
                let desArr = ['desMsgQuestion','desMsgLink','signType','signCity','personSchema','shroffSchema','desIntrodSchema','desIntrodUpload','switchChema','refereeSign','referrerSchema','assessSchema']
                let camArr = ['camMsgQuestion','camMsgLink','signCity','personSchema','resumeUpload','shroffSchema','switchChema','assessSchema']
                let pmArr = ['pmMsgQuestion','pmMsgLink','signCity','personSchema','resumeUpload','shroffSchema','switchChema','assessSchema']
                let cleanerArr = ['cleanerMsgLink', 'signDistrict', 'signType', 'cleanerPersonSchema', 'cleanerCompanySchema','cleanerCompanyLicense', 'signCity', 'shroffSchema', 'switchChema']
                let aidArr = ['aidMsgLink', 'signCity', 'personSchema','switchChema', 'aidShroffSchema','aidOtherSchema','refereeSign', 'referrerSchema']

                if(this.model.contractType == "签约设计师" && roleStr.indexOf('des') >= 0 && desArr.includes(key)){//设计师
                    return true
                }
                else if(this.model.contractType == "签约摄影师" && roleStr.includes('cam') >= 0 && camArr.includes(key)){//摄影师
                    return true
                }
                else if(this.model.contractType == "签约项目经理" && roleStr.includes('pm') >= 0 && pmArr.includes(key)){//项目经理
                    return true
                }
                else if (this.model.contractType == "签约助理房东" && roleStr.includes('aid') >= 0 && aidArr.includes(key)) {//房东助理
                    return true
                }
                else if (this.model.contractType.includes("保洁") && roleStr.includes('cleaner') >= 0 && cleanerArr.includes(key)) {//全职保洁 | 兼职保洁
                    return true
                }
                else{
                    return false
                }
            },
            modalShow () {
                this.$modal.show('bar');
                this.showModal = 1;
            },
            modalScoreShow () {
                this.$modal.show('score');
                this.showModal = 2;
            },
            modalScorehide (type) {
                this.$modal.hide(type);
                this.showModal = 0;
            },
            modalScoreClick (score){
                vm.model.score = score;
                this.$modal.hide('score');
                this.showModal = 0;
            },
            onBaseFileUpload: function(e,fun){//上传方法
                try {
                    let file = e.target.files[0]
                    let ids = createUUID('xxxxxxxxxxxxxxxx',10)
                    let oldFileName = file.name.split(".")
                    let newFileName = `${ids}.${oldFileName[1]}`

                    upload('preson_contract',newFileName,file,function(url){
                        fun && fun(newFileName,url)
                    })
                    document.getElementById('fileUpload').value = null;
                } catch (error) {
                    console.log(error)
                }
            },
            onBaseClose: function(data,e){//删除关闭方法
                let isBol = confirm("删除后附件将无法恢复");
                if(isBol){
                    data.forEach(function(o,i){
                        if(o.name === e.target.id){
                            data.splice(i,1)
                        }
                    })
                }
            },
            onDesSignUpload: function(e){
                if(vm.signatureArr && vm.signatureArr.length>=3){
                    myToast(`上传文件不能超过3个`)
                    return false
                }
                this.onBaseFileUpload(e,function(name,url){
                    vm.signatureArr.push({name:name,url:url})
                })
            },
            onCompanyLicenseUpload: function(e){
                if (vm.companyLicenseArr && vm.companyLicenseArr.length >= 3) {
                    myToast(`上传文件不能超过3个`)
                    return false
                }
                this.onBaseFileUpload(e, function (name, url) {
                    vm.companyLicenseArr.push({ name: name, url: url })
                })
            },
            onDesSignClose: function(e){
                this.onBaseClose(vm.signatureArr,e)
            },
            onCompanyLicenseClose: function (e) {
                this.onBaseClose(vm.companyLicenseArr, e)
            },
            getSubmitData: function(){
                let reData = this.model
                reData.signature = ''
                if(this.signatureArr){//设计师签名图片
                    this.signatureArr.forEach((o,i)=>{
                        reData.signature = `${reData.signature}${o.url},`
                    })
                }
                reData.companyLicense = ''
                if (this.companyLicenseArr) {//营业执照
                    this.companyLicenseArr.forEach((o, i) => {
                        reData.companyLicense = `${reData.companyLicense}${o.url},`
                    })
                }
                return reData
            },
            onSubmit: function () {
                let self = this
                this.submitDisable = true
                //FIXME: 坑：该系统运行在微信内置浏览器，openId作为用户标识，必须传给后端
                //但在交互过程，已无故丢失，故采取此方式再赋值
                let _data = { ...this.getSubmitData(), openId: USERINFO.appOpenId}

                if(!this.getValidate().type){
                    myToast(this.getValidate().toast)
                    this.submitDisable = false
                    return false
                }
                if(this.submitDisable){
                    axios.post(`/contract/talents/insertTalent`,_data)
                    .then(function (response) {
                        let _data = response.data
                        if(_data.success){
                            window.location.href = './success.html'
                        }else{
                            myToast(_data.errorDetail)
                            self.submitDisable = false
                        }
                    })
                    .catch(function (error) {
                        myToast(`请求错误${error}`)
                        self.submitDisable = false
                    })
                }

            }
        },
        watch: {
            "model.contractType": {
                handler: function() {
                    let { contractType } = this.model;
                    if (contractType == '签约设计师') {
                        this.selectArr.signType = [
                            { value: "0", text: '个人' },
                            { value: "1", text: '团队' }
                        ]
                    } else if (contractType.includes('保洁')) {
                        this.selectArr.signType = [
                            { value: "0", text: '个人' },
                            { value: "1", text: '团队' },
                            { value: "2", text: '公司' }
                        ]
                    }
                    vm && this.listenPersonSchema();
                },
                immediate: true
            },
            "model.signType": function() {
                this.listenSignTypePerson()
            }
        },
        mounted: function () {
            //this.getDic('02','signCity')//城市编号
            this.getDic({
                type:'24',
                key:'contractType',
                fun:function(obj){
                    // vm.selectArr = Object.assign({},vm.selectArr,obj.contractType.splice(3,5))
                    vm.selectArr = Object.assign({}, vm.selectArr, obj.contractType)
                },

            })//签约类型
            // this.getDic({setValueType:"index",type:'25',key:'signType'})//签约方式
            this.getDic({type:'26',key:'workStatus'})//工作状态
            this.getDic({type:'27',key:'workAge'})//工作年限
            this.getDic({type:'28',key:'orderStatus'})//接单状态
            this.model.contractType =  "签约设计师"
        }
    });
});
