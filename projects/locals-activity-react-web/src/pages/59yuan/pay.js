/* eslint-disable no-unused-expressions */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios')) :
    // eslint-disable-next-line no-undef
    typeof define === 'function' && define.amd ? define(['axios'], factory) :
    // eslint-disable-next-line no-restricted-globals
    (global = global || self, global.LocalsPay = factory(global.axios));
}(this, function (axios) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var _this = undefined;
    var API_PREFIX = {
        prod: "https://ms.localhome.cn/api/",
        dev: "https://dev.localhome.cn/api/"
    };
    var Fetch = function (env, userToken) { return function (uri, requestInit) {
        if (requestInit === void 0) { requestInit = {}; }
        return __awaiter(_this, void 0, void 0, function () {
            var headers, response, isSuccess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = __assign({}, requestInit.headers, { "LOCALS-ACCESS-TOKEN": ["Bearer", userToken].join(" "), "Content-Type": "application/json; charset=UTF-8" });
                        return [4, axios(API_PREFIX[env] + uri, __assign({}, requestInit, { headers: headers }))];
                    case 1:
                        response = _a.sent();
                        isSuccess = (response.status === 200) || response.status === 304;
                        if (!isSuccess) {
                            return [2, { errorMsg: "网络异常" }];
                        }
                        if (!response.data) {
                            return [2, { errorMsg: "数据异常" }];
                        }
                        if (!response.data.success) {
                            return [2, { errorMsg: response.data.errorMsg }];
                        }
                        return [2, response.data.data];
                }
            });
        });
    }; };

    var LocalsPay = (function () {
        function LocalsPay(option) {
            if (option === void 0) { option = {}; }
            this.goodsId = "";
            this.buyNum = 1;
            this.userToken = "";
            this.returnUrl = "";
            this.openId = '';
            this.paymentChannel = ['alipay'];
            this.selectedPaymentMode = 'alipay';
            this.env = "prod";
            this.callbacks = [];
            this.fetch = null;
            this.orderAmount = 0;
            this.setOption(option);
            this.checkPayOrder();
        }
        LocalsPay.prototype.setOption = function (option) {
            if (option.goodsId) {
                this.goodsId = option.goodsId;
            }
            if (option.userToken) {
                this.userToken = option.userToken;
            }
            if (option.openId) {
                this.openId = option.openId;
            }
            if (option.env) {
                this.env = option.env;
            }
            if (option.buyNum) {
                this.buyNum = option.buyNum;
            }
            if (option.returnUrl) {
                this.returnUrl = option.returnUrl;
            }
            if (option.paymentChannel && option.paymentChannel instanceof Array && option.paymentChannel.length > 0) {
                if (!option.paymentChannel.includes('alipay')) {
                    this.selectedPaymentMode = 'wechat';
                }
                this.paymentChannel = option.paymentChannel;
            }
            this.fetch = Fetch(this.env, this.userToken);
            if (option.callback) {
                this.callbacks.push(option.callback);
            }
        };
        LocalsPay.prototype.verifyFetch = function () {
            if (!this.fetch) {
                throw new Error("无法读取 fetch");
            }
        };
        LocalsPay.prototype.checkPayOrder = function () {
            return __awaiter(this, void 0, void 0, function () {
                var outTradeNo, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outTradeNo = this.getParam('_outTradeNo');
                            if (!outTradeNo) {
                                return [2];
                            }
                            return [4, this.fetch('pay-center/order/query', {
                                    method: "POST",
                                    data: { outTradeNo: outTradeNo }
                                })];
                        case 1:
                            result = _a.sent();
                            if (this.returnUrl) {
                                window.history.replaceState({}, '', this.returnUrl);
                            }
                            if (result.orderStatus === 'TRADE_SUCCESS' || result.orderStatus === 'SUCCESS') {
                                this.performCallback({
                                    code: 1,
                                    success: true,
                                    errorMsg: ''
                                });
                            }
                            else {
                                this.performCallback({
                                    code: 0,
                                    success: false,
                                    errorMsg: result.errorMsg
                                });
                            }
                            return [2];
                    }
                });
            });
        };
        LocalsPay.prototype.getParam = function (key) {
            var url = window.location.search;
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
            var result = url.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : "";
        };
        LocalsPay.prototype.buyPermissions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, itemPurchaseRights, isAuthenticated, permissionTable, errorMsgTable, i, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.verifyFetch();
                            return [4, this.fetch("mall/purchase-right/grant", {
                                    method: "POST",
                                    data: { itemId: this.goodsId, buyNum: this.buyNum }
                                })];
                        case 1:
                            response = _a.sent();
                            if (response.errorMsg) {
                                alert(response.errorMsg);
                                return [2, false];
                            }
                            itemPurchaseRights = response.itemPurchaseRights;
                            isAuthenticated = response.isAuthenticated;
                            if (!itemPurchaseRights) {
                                return [2, isAuthenticated];
                            }
                            permissionTable = itemPurchaseRights.sort(function (a, b) {
                                return Number(a.rightWeight) < Number(b.rightWeight);
                            });
                            errorMsgTable = [
                                "",
                                "没有购买权限，请联系管理员",
                                "没有购买权限，请联系管理员",
                                "仅限新用户购买",
                                "已经超出购买数量",
                                "仅限新用户购买",
                                "没有购买权限，请联系管理员"
                            ];
                            for (i = 0; i < permissionTable.length; i++) {
                                item = itemPurchaseRights[i];
                                if (permissionTable[i].isAuthenticated) {
                                    if (permissionTable[i].rightType === 1) {
                                        return [2, true];
                                    }
                                    alert(item.rightType)
                                    alert(errorMsgTable[item.rightType]);
                                    return [2, false];
                                }
                            }
                            if (!isAuthenticated) {
                                alert("没有购买权限，请联系管理员");
                                return [2, false];
                            }
                            return [2, true];
                    }
                });
            });
        };
        LocalsPay.prototype.hasWaitPayOrder = function () {
            return __awaiter(this, void 0, void 0, function () {
                var waitPayResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.verifyFetch();
                            return [4, this.fetch("mall/trade/wait-buyer-pay/item", {
                                    method: "GET",
                                    params: { itemId: this.goodsId }
                                })];
                        case 1:
                            waitPayResponse = _a.sent();
                            if (!waitPayResponse) {
                                return [2, null];
                            }
                            return [2, waitPayResponse.orderInfo || null];
                    }
                });
            });
        };
        LocalsPay.prototype.placeOrder = function () {
            return __awaiter(this, void 0, void 0, function () {
                var verifyFlag, totalFee, result, orderInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.verifyFetch();
                            return [4, this.buyPermissions()];
                        case 1:
                            verifyFlag = _a.sent();
                            if (!verifyFlag) {
                                return [2];
                            }
                            totalFee = Number(this.orderAmount) * this.buyNum;
                            return [4, this.fetch("mall/trade/item", {
                                    method: "POST",
                                    data: {
                                        sourcePlatform: "H5",
                                        trades: [
                                            {
                                                itemId: this.goodsId,
                                                totalFee: totalFee,
                                                buyNum: this.buyNum
                                            }
                                        ]
                                    }
                                })];
                        case 2:
                            result = _a.sent();
                            if (result) {
                                orderInfo = result.orderInfo;
                                if (this.selectedPaymentMode === 'alipay') {
                                    this.useAlipay(orderInfo);
                                }
                                else {
                                    this.useWechatPay(orderInfo);
                                }
                            }
                            else {
                                alert("网络异常，请稍后再试！");
                            }
                            return [2];
                    }
                });
            });
        };
        LocalsPay.prototype.useWechatPay = function (orderInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var totalFee, data, result, toLink, _href, pkg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.verifyFetch();
                            if (!orderInfo) {
                                alert("获取订单信息失败，请稍后再试！");
                                return [2];
                            }
                            totalFee = orderInfo.totalFee && (orderInfo.totalFee / 100).toFixed(2);
                            data = {
                                accountId: 4,
                                isInvoice: false,
                                amount: totalFee,
                                outTradeNo: orderInfo.id,
                                subject: orderInfo.title,
                                body: '路客精品民宿',
                                currency: "CNY",
                                tradeType: '',
                                source: "MALL",
                                wapName: '路客精品民宿',
                                wapUrl: 'i.localhome.cn',
                                returnUrl: this.getReturnUrl(orderInfo.id, this.returnUrl),
                                openId: ''
                            };
                            if (this.paymentChannel.includes('wechatH5')) {
                                data.tradeType = 'MWEB';
                                data.accountId = 4;
                                delete data.openId;
                            }
                            else {
                                data.tradeType = 'JSAPI';
                                data.openId = this.openId;
                                data.accountId = 13;
                            }
                            return [4, this.fetch("pay-center/pay", {
                                    method: "POST",
                                    data: data
                                })];
                        case 1:
                            result = _a.sent();
                            toLink = this.getReturnUrl(orderInfo.id, this.returnUrl);
                            toLink = encodeURIComponent(toLink);
                            if (data.tradeType === 'MWEB') {
                                _href = this.getReturnUrl(orderInfo.id, window.location.href);
                                window.history.pushState(null, '', _href);
                                window.location.href = result.mwebUrl;
                            }
                            else if (data.tradeType === 'JSAPI') {
                                pkg = encodeURIComponent(result.pkg);
                                window.location.href = "https://f.localhome.cn/pay/index.html?appId=" + result.appId + "&timeStamp=" + result.timeStamp + "&nonceStr=" + result.nonceStr + "&pkg=" + pkg + "&signType=" + result.signType + "&sign=" + result.sign + "&returnUrl=" + toLink;
                            }
                            return [2];
                    }
                });
            });
        };
        LocalsPay.prototype.useAlipay = function (orderInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var totalFee, data, result, div;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.verifyFetch();
                            if (!orderInfo) {
                                alert("获取订单信息失败，请稍后再试！");
                                return [2];
                            }
                            totalFee = orderInfo.totalFee && (orderInfo.totalFee / 100).toFixed(2);
                            data = {
                                accountId: 1,
                                isInvoice: false,
                                amount: totalFee,
                                outTradeNo: orderInfo.id,
                                tradeType: "WAP_PAY",
                                subject: orderInfo.title,
                                body: orderInfo.type,
                                currency: "CNY",
                                source: "MALL",
                                returnUrl: this.getReturnUrl(orderInfo.id, this.returnUrl)
                            };
                            return [4, this.fetch("pay-center/pay", {
                                    method: "POST",
                                    data: data
                                })];
                        case 1:
                            result = _a.sent();
                            if (!result.errorMsg) {
                                div = document.createElement("div");
                                div.innerHTML = result.body;
                                document.body.appendChild(div);
                                document.forms[0].submit();
                            }
                            else {
                                this.performCallback({
                                    code: 0,
                                    success: false,
                                    errorMsg: result.errorMsg
                                });
                            }
                            return [2];
                    }
                });
            });
        };
        LocalsPay.prototype.getReturnUrl = function (outTradeNo, returnUrl) {
            if (!returnUrl) {
                return returnUrl;
            }
            var url = '';
            if (returnUrl.indexOf('?') === -1) {
                url = returnUrl + ("?_outTradeNo=" + outTradeNo);
            }
            else {
                url = returnUrl + ("&_outTradeNo=" + outTradeNo);
            }
            return url;
        };
        LocalsPay.prototype.performCallback = function (response) {
            this.callbacks.forEach(function (callback) {
                callback(response);
            });
        };
        LocalsPay.prototype.pay = function (option) {
            return __awaiter(this, void 0, void 0, function () {
                var isOrder, orderInfo, productDetail, wrap, payBtn, closeBtn, paymentModeBtns, amountText;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setOption(option);
                            if (this.paymentChannel.includes('wechat') && !this.openId) {
                                alert('参数有误，请联系客服');
                                return [2, false];
                            }
                            if (this.paymentChannel.includes('wechat') && this.paymentChannel.includes('wechatH5')) {
                                alert('参数有误，请联系客服');
                                return [2, false];
                            }
                            isOrder = false;
                            return [4, this.hasWaitPayOrder()];
                        case 1:
                            orderInfo = _a.sent();
                            if (!(!orderInfo || orderInfo.tradeStatus !== 0)) return [3, 3];
                            return [4, this.fetch("mall/item/" + option.goodsId, {
                                    method: "GET"
                                })];
                        case 2:
                            productDetail = _a.sent();
                            if (productDetail && productDetail.price) {
                                this.orderAmount = ((Number(productDetail.price) * this.buyNum) /
                                    100).toFixed(2);
                            }
                            isOrder = false;
                            return [3, 4];
                        case 3:
                            isOrder = true;
                            this.orderAmount = orderInfo.totalFee && ((orderInfo.totalFee) / 100).toFixed(2);
                            _a.label = 4;
                        case 4:
                            wrap = document.getElementById("__locals_pay_wrapper__");
                            if (!wrap) {
                                this.getHtmlDom(this.orderAmount);
                                payBtn = document.getElementById("__locals_pay_sdk_h5_btn__");
                                closeBtn = document.getElementById("__locals_pay_close__");
                                paymentModeBtns = document.getElementById("__locals_pay_mode_btn_wrapper__");
                                if (payBtn) {
                                    payBtn.addEventListener("click", function () {
                                        if (isOrder) {
                                            if (_this.selectedPaymentMode === 'alipay') {
                                                _this.useAlipay(orderInfo);
                                            }
                                            else {
                                                _this.useWechatPay(orderInfo);
                                            }
                                        }
                                        else {
                                            _this.placeOrder();
                                        }
                                    });
                                }
                                if (paymentModeBtns) {
                                    paymentModeBtns.addEventListener("click", function (ev) {
                                        var e = ev || window.event;
                                        var _target = e.target;
                                        var type = null;
                                        while (type === null) {
                                            type = _target.getAttribute("data-type");
                                            _target = _target.parentNode;
                                        }
                                        var alipayActive = document.getElementById("__locals_pay_h5_selected_alipay_active__");
                                        var wechatActive = document.getElementById("__locals_pay_h5_selected_wechat_active__");
                                        _this.selectedPaymentMode = type || _this.selectedPaymentMode;
                                        if (alipayActive && wechatActive) {
                                            if (_this.selectedPaymentMode === 'alipay') {
                                                alipayActive.style.display = 'block';
                                                wechatActive.style.display = 'none';
                                            }
                                            else {
                                                alipayActive.style.display = 'none';
                                                wechatActive.style.display = 'block';
                                            }
                                        }
                                    });
                                }
                                if (closeBtn) {
                                    closeBtn.addEventListener("click", function () {
                                        _this.close();
                                    });
                                }
                            }
                            else {
                                amountText = document.getElementById("__locals_pay_amount__");
                                if (!amountText) {
                                    return [2];
                                }
                                amountText.innerHTML = this.orderAmount.toString();
                                this.show();
                            }
                            return [2];
                    }
                });
            });
        };
        LocalsPay.prototype.close = function () {
            var wrap = document.getElementById("__locals_pay_wrapper__");
            if (!wrap) {
                return;
            }
            wrap.style.display = "none";
            this.performCallback({
                code: 0,
                success: false,
                errorMsg: ''
            });
        };
        LocalsPay.prototype.show = function () {
            var wrap = document.getElementById("__locals_pay_wrapper__");
            if (!wrap) {
                return;
            }
            wrap.style.display = "flex";
        };
        LocalsPay.prototype.getHtmlDom = function (orderAmount) {
            var identifyDOM = document.createElement("div");
            var payHtml = this.getPaymentModeDom();
            var _html = '<div id="__locals_pay_wrapper__" onclick="event.stopPropagation();" style="display: flex;position: fixed; left: 0;right: 0;top: 0;bottom: 0;z-index: 9998;justify-content: center;align-items: center;background-color: rgba(0,0,0,.11);">' +
                '<div style="width: 280px;position:relative;margin-top: -150px;padding: 30px 20px;border-radius: 7px;background-color: #ffffff;">' +
                '<img id="__locals_pay_close__" style="width: 15px;height: 15px;padding: 10px;position: absolute;top: 10px;left: 10px;" src="https://oss.localhome.cn//localhomeqy/h5_pay/close.png" />' +
                '<div style="font-size: 16px;text-align: center;margin-top: 20px;">订单金额</div>' +
                '<div style="font-size: 28px;font-weight: bold;text-align: center;padding: 5px 0 0 0;">' +
                ("<span style=\"font-size: 18px;\">\u00A5</span><span id=\"__locals_pay_amount__\">" + orderAmount + "</span>") +
                "</div>" +
                ("<div id=\"__locals_pay_mode_btn_wrapper__\" style=\"display: flex;flex-direction: column;justify-content: space-between;padding: 10px 0;color: #919191;font-size: 16px;font-weight: 400;\">" + payHtml + "</div>") +
                '<div style="text-align: center;margin-top: 20px;">' +
                '<button id="__locals_pay_sdk_h5_btn__" style="width: 180px;height: 38px;font-size: 16px;background-color: #e73d52;color: #ffffff;font-weight: 400;border: 0;border-radius: 5px;" type="button">确认交易</button>' +
                "</div></div></div>";
            identifyDOM.innerHTML = _html;
            document.body.appendChild(identifyDOM);
        };
        LocalsPay.prototype.getPaymentModeDom = function () {
            var _html = '';
            for (var i = 0; i < this.paymentChannel.length; i++) {
                var item = this.paymentChannel[i];
                var labelName = '微信';
                var iconUrl = 'wechat.png';
                var paymentModeId = 'locals_pay_h5_selected_wechat';
                var isShowActive = 'display: none;';
                var paymentType = 'wechat';
                if (item === 'alipay') {
                    paymentType = 'alipay';
                    labelName = '支付宝';
                    iconUrl = 'alipay-circle-fill.png';
                    paymentModeId = 'locals_pay_h5_selected_alipay';
                    if (this.selectedPaymentMode === 'alipay') {
                        isShowActive = 'display: block;';
                    }
                }
                if (item !== 'alipay' && this.selectedPaymentMode === 'wechat') {
                    isShowActive = 'display: block;';
                }
                _html += "<div id=\"__" + paymentModeId + "_wrap__\" data-type=\"" + paymentType + "\" style=\"display:flex;margin-top: 10px;justify-content: space-between;align-items:center;border-bottom: 1px solid #ebebeb;padding-bottom: 10px;\">" +
                    '<div style="display: flex;align-items: center;">' +
                    ("<img style=\"width: 25px;height: 25px;margin-right: 10px;\" src=\"https://oss.localhome.cn//localhomeqy/h5_pay/" + iconUrl + "\" />") +
                    ("<span>" + labelName + "</span>") +
                    '</div>' +
                    ("<img id=\"__" + paymentModeId + "_active__\" style=\"width: 18px;height: 18px;" + isShowActive + "\" src=\"https://oss.localhome.cn//localhomeqy/h5_pay/selected.png\" />") +
                    '</div>';
            }
            return _html;
        };
        return LocalsPay;
    }());

    return LocalsPay;

}));
