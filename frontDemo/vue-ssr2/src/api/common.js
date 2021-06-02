import axios from "./axios";

//获取栏目
function getColumn(option) {
  return axios.post(
    "/access/ui/FRONT-COMM/FRONTCOMMCMS020",
    Object.assign(
      {
        siteid: "webportals",
        queryMode: 1, //1代表搜索子级，2.代码只搜索父级，3表示搜索父级以及子级
      },
      option || {}
    )
  );
}

//获取文章
function getArticle(option) {
  return axios.post(
    "/access/ui/GTCPSP-FRONT/GTCPSPCMSARTICLESERVICE004",
    Object.assign(
      {
        siteid: "webportals",
        pageParam: {
          firstRow: 0,
          pageNo: 1,
          rowsPerPage: 10,
        },
      },
      option || {}
    )
  );
}

export default {
  // 操作记录埋点
  loadData(params) {
    return axios.get("/loadData", params);
  },
  //获取栏目
  getColumn(params) {
    return getColumn(params);
  },
  //根据栏目获取文章
  //params：articleid 文章id，catalogid：栏目id
  getArticle(params) {
    return getArticle(params);
  },

  /******对应摸个模块获取栏目的接口********/

  //应用案例(负责人：陈均桥)
  getApplicationCases() {
    return getColumn({ queryMode: 1, ord: "207010" });
  },

  //溯源资讯(负责人：陈均桥)
  //全球溯源中心公共服务平台 ord:2030,消费者权益保护公共服务平台：ord:1030，检验检测公共服务平台（ord:3020），知识产权保护公共服务平台：(ord:4020),溯源产业公共服务平台(ord:5020)
  getTraceInformation(ord) {
    return getColumn({ queryMode: 1, ord: ord });
  },

  //信息公示(负责人：陈均桥)
  //消费者权益保护公共服务平台 ord:1020,全球溯源中心公共服务平台 ord:2040,检验检测公共服务平台:ord:3010,知识产权保护公共服务平台:ord:4010,溯源产业公共服务平台:ord:5020
  InformationPublicity(ord) {
    return getColumn({ queryMode: 1, ord: ord });
  },

  //平台公告(负责人：陈均桥)
  //消费者权益保护公共服务平台 ord:1040,全球溯源中心公共服务平台 ord:2050,检验检测公共服务平台:ord:3030,知识产权保护公共服务平台:ord:4030,溯源产业公共服务平台:ord:5040
  platformMsg(ord) {
    return getColumn({ queryMode: 1, ord: ord });
  },

  //标准与规范(负责人：徐嘉琪)
  //五个平台共用  ord:2060,
  standardsSpecifications(ord) {
    return getColumn({ queryMode: 1, ord: ord });
  },

  //共建单位(负责人：徐嘉琪)
  //全球溯源中心公共服务平台  ord:2080
  constructionUnit(ord) {
    console.log(ord, '==============')
    return getColumn({ queryMode: 1, ord: ord });
  },


  //溯源查询(负责人：徐嘉琪)：带上查询的参数跳转到中心系统
  getQueryconditiontype(option) {
    return axios.post(
      "/access/ui/FRONT-COMM/FRONTCOMMDICT010",
      Object.assign(
        {
          dictDefId:'GTC-MGRTPO.queryconditiontype'
        },
        option || {}
      )
    );
  },

  //商品榜单(负责人：徐嘉琪)
  //1.商品查询榜单
  commodityQueryList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPOGQUERYSTAT040",
      Object.assign(
        {
          "orderParam": { "orders": [{ "column": "querycount", "direction": "desc" }] },
          "pageParam": { "rowsPerPage": 10, "pageNo": 1 },
          querytype: 60
        },
        option || {}
      )
    );
  },
  //2商品咨询榜单
  commodityConsultingList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPCUMERCOMPSTAT080",
      Object.assign(
        {
          "orderParam": { "orders": [{ "column": "compconsultcount", "direction": "desc" }] },
          "pageParam": { "rowsPerPage": 10, "pageNo": 1 },
          querytype: 60
        },
        option || {}
      )
    );
  },
  //3.商品投诉榜单
  productComplaintList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPCUMERCOMPSTAT070",
      Object.assign(
        {
          "orderParam": { "orders": [{ "column": "compconsultcount", "direction": "desc" }] },
          "pageParam": { "rowsPerPage": 10, "pageNo": 1 },
          querytype: 60
        },
        option || {}
      )
    );
  },


  //4.企业红榜：(接口说明：http://10.10.104.3/fbacs/doc.html#/gtcpsp/%E4%BC%81%E4%B8%9A%E7%BA%A2%E9%BB%91%E5%90%8D%E5%8D%95/queryListByNOPermissionUsingPOST_1)
  getRedList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPWBLIST013",
      Object.assign(
        {
          "pageParam": {
            "firstRow": 0,
            "pageNo": 1,
            "rowsPerPage": 10
          },
          "orderParam": {
            "orders": [
              {
                "column": "predate",
                "direction": "desc"
              }
            ]
          },
          listtype: "10"
        },
        option || {}
      )
    );
  },
  //5.企业黑榜单：：(接口说明：http://10.10.104.3/fbacs/doc.html#/gtcpsp/%E4%BC%81%E4%B8%9A%E7%BA%A2%E9%BB%91%E5%90%8D%E5%8D%95/queryListByNOPermissionUsingPOST_1)
  getBlackList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPWBLIST013",
      Object.assign(
        {
          "pageParam": {
            "firstRow": 0,
            "pageNo": 1,
            "rowsPerPage": 10
          },
          "orderParam": {
            "orders": [
              {
                "column": "predate",
                "direction": "desc"
              }
            ]
          },
          listtype: "20"
        },
        option || {}
      )
    );
  },
  //常见问题 (负责人：陈均桥)
  //五个平台共用 ，数据一样
  commonProblem() {
    return getColumn({ queryMode: 1, ord: '2010' });
  },

  //帮助文档(负责人：陈均桥)
  //五个平台共用 ，数据一样
  helpfile() {
    return getColumn({ queryMode: 1, ord: '2020' });
  },

  //帮助详情() (下载文档的接口)
  helpDetail(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPCMSARTICLESERVICE005",
      Object.assign(
        { articleid: option.articleid },
        option || {}
      )
    );
  },

  //知识产权保护（这个模块只有在知识产权保护公共服务平台下面有） (负责人：陈均桥)
  knowledgeProtect() {
    return getColumn({ queryMode: 1, ord: '409010' });
  },

  //需求一览 (负责人：徐嘉琪)：(接口地址：http://10.10.104.3/fbacs/doc.html#/gtcpsp/%E9%9C%80%E6%B1%82%E5%8F%91%E5%B8%83/queryListByNOPermissionUsingPOST)
  demandList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPDESIREDREG024",
      Object.assign(
        {
          "pageParam": {
            "firstRow": 0,
            "pageNo": 1,
            "rowsPerPage": 10
          },
          "orderParam": {
            "orders": [
              {
                "column": "predate",
                "direction": "desc"
              }
            ]
          },
          listtype: "20"
        },
        option || {}
      )
    );

  },
  // 服务一览
  serviceList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPSERVRELEASE021",
      Object.assign(
        {
          "pageParam": {
            "firstRow": 0,
            "pageNo": 1,
            "rowsPerPage": 10
          },
          "orderParam": {
            "orders": [
              {
                "column": "predate",
                "direction": "desc"
              }
            ]
          }
        },
        option || {}
      )
    );

  },
  //省市区
  placecode(params) {
    return axios.post('/access/ui/FRONT-COMM/FRONTCOMMCODENOLOGIN010', params);
  },

  //检验检测场景(负责人：徐嘉琪)
  testingScene() {
    return getColumn({ queryMode: 1, ord: '309010' });
  },


  //入驻机构(负责人：陈均桥):todo勇文提供
  institutionList(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPSERVRELEASE021",
      Object.assign(
        {
          "pageParam": {
            "firstRow": 0,
            "pageNo": 1,
            "rowsPerPage": 10
          },
          "orderParam": { "orders": [{ "column": "modifydate", "direction": "desc" }] },
          cbmsubtype: option.cbmsubtype //服务分类，用服务分类码表接口去

        },
        option || {}
      )
    );
  },
  //服务分类码表接:todo勇文提供


  //入驻服务商(负责人：陈均桥)
  //溯源产业公共服务平台
  entryServiceProvider() {
    return getColumn({ queryMode: 1, ord: '5050' });
  },

  //帮助中心(负责人：陈均桥),点击出现一个新的页面，设计还没有提供页面
  helpcenter(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPCMSARTICLESERVICE004",
      Object.assign(
        {
          "pageParam": { "pageNo": 1, "rowsPerPage": 5 },
          "orderParam": { "orders": [{ "column": "predate", "direction": "desc" }] },
          "siteid": "webportals", "catalogid": "bzzxcjwt", "status": "70",
          title: option.title
        },
        option || {}
      )
    );
  },

  //服务案例(负责人：徐嘉琪)
  serviceCase() {
    return getColumn({ queryMode: 1, ord: '501010' });
  },
  //维权案例(负责人：徐嘉琪)
  casesOfRightsProtection(ord) {
    console.log(ord, 'comemmm')
    return getColumn({ queryMode: 1, ord: ord });
  },

  // 服务商评价分页信息接口
  plEvaluation(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPEVALUATENOLOGIN010",
      Object.assign(
        {
          "pageParam": { "pageNo": 1, "rowsPerPage": 5 },
          "orderParam": { "orders": [{ "column": "predate", "direction": "desc" }] }
        },
        option || {}
      )
    );
  },

  // 风险预警列表
  riskEarlyWarning(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPRISKWARNINGINFOSERVICE001",
      Object.assign(
        {
          "pageParam": { "pageNo": 1, "rowsPerPage": 5 },
          "orderParam": { "orders": [{ "column": "predate", "direction": "desc" }] }
        },
        option || {}
      )
    );
  },

  // 风险预警详情查询
  earlyWarningDetail(option) {
    return axios.post(
      "/access/ui/GTCPSP-FRONT/GTCPSPRISKWARNINGINFOSERVICE002",
      Object.assign(
        {
          warningicode: option.warningicode || ''
        },
        option || {}
      )
    );
  },

};
