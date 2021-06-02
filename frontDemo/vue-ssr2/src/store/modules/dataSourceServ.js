import common from "@/api/common.js";
import enumerate from '../../util/staticMapData'
import moment from 'moment'
import _ from 'lodash'

const state = {
  standardsData: [],
  unitData: {},
  casesData: [],
  testingSceneData: {},
  announcementData: [],
  demandListData: {},
  serviceListData: {},
};
const mutations = {
  getStandardsData(state, standardsData) {
    state.standardsData = standardsData;
  },
  getUnitData(state, unitData) {
    state.unitData = unitData;
  },
  getCasesOfRightData(state, casesOfRightData) {
    state.casesData = casesOfRightData;
  },
  getTestingScene(state, TestingSceneData) {
    state.testingSceneData = TestingSceneData;
  },
  getAnnouncementTable(state, announcementData) {
    state.announcementData = announcementData;
  },
  getDemandList(state, demandListData) {
    state.demandListData = demandListData;
  },
  getServiceList(state, serviceListData) {
    state.serviceListData = serviceListData;
  },
};
const actions = {
  // 标准与规范
  fetchStandardsSpecifications({ commit }, data) {
    return new Promise((resolve, reject) => {
      common
        .standardsSpecifications(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            // console.log(JSON.parse(res.data.data),'standardsSpecifications')
            try {
              common
                .getArticle({
                  catalogid: JSON.parse(res.data.data)[0].catalogid,
                })
                .then((res) => {
                  console.log(JSON.parse(res.data.data),'===========================')
                  commit("getStandardsData", JSON.parse(res.data.data));
                });
            } catch (err) {
              console.log(err);
            }
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 共建单位-
  fetchConstructionUnit({ commit }, ord) {
    return new Promise((resolve, reject) => {
      common
        .constructionUnit(ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "constructionUnit");
            let data = {};
            data.tabs = JSON.parse(res.data.data);
            // 为啥返回第一个是不需要的数据？？？只好手动删除了==。
            // data.tabs.shift()
            //根据栏目id，请求文章接口
            try {
              common
                .getArticle({
                  catalogid: JSON.parse(res.data.data)[0].catalogid,
                  pageParam:{rowsPerPage:15}
                })
                .then((res) => {
                  if (res.data && res.data.status == "success") {
                    data.content = JSON.parse(res.data.data).datas;
                    // console.log(data)
                    commit("getUnitData", data);
                  }
                });
            } catch (err) {
              console.log(err);
            }
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchConstructTabContent({ commit, state }, catalogid) {
    common.getArticle({ catalogid: catalogid, pageParam:{rowsPerPage:15} }).then((res) => {
      let data = Object.assign({},state.unitData);;
      if (res.data && res.data.status == "success") {
        data.content = JSON.parse(res.data.data).datas;
        console.log(data, "fetchConstructTabContent");
        commit("getUnitData", data);
      }
    });
  },
  // 维权案例
  fetchCasesOfRightsProtection({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      console.log(data, "asdfasdfasd");
      common
        .casesOfRightsProtection(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            let pageParam = {
              firstRow: 0,
              pageNo: data.pageNo,
              rowsPerPage: 6,
            };
            try {
              common
                .getArticle({
                  catalogid: JSON.parse(res.data.data)[0].catalogid,
                  pageParam,
                })
                .then((res) => {
                  if (res.data && res.data.status == "success") {
                    console.log(
                      JSON.parse(res.data.data),
                      "casesOfRightsProtection"
                    );
                    commit("getCasesOfRightData", JSON.parse(res.data.data));
                  }
                });
            } catch (err) {
              console.log(err);
            }
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 检测检验
  fetchTestingScene({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .testingScene(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            let pageParam = {
              firstRow: 0,
              pageNo: 1,
              rowsPerPage: 6,
            };
            // let data = {}
            // data.tabs = JSON.parse(res.data.data)
            try {
              common
                .getArticle({
                  catalogid: JSON.parse(res.data.data)[0].catalogid,
                  pageParam,
                })
                .then((res) => {
                  if (res.data && res.data.status == "success") {
                    // data.content = JSON.parse(res.data.data)
                    console.log(JSON.parse(res.data.data), "getTestingScene");
                    commit("getTestingScene", JSON.parse(res.data.data));
                  }
                });
            } catch (err) {
              console.log(err);
            }
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 榜单
  //1.商品查询榜单
  fetchCommodityQueryList({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .commodityQueryList(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============商品查询榜单");
            commit("getAnnouncementTable", JSON.parse(res.data.data));
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2商品咨询榜单
  fetchCommodityConsultingList({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .commodityConsultingList(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============商品咨询榜单");
            commit("getAnnouncementTable", JSON.parse(res.data.data));
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //3.商品投诉榜单
  fetchProductComplaintList({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .productComplaintList(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============商品投诉榜单");
            commit("getAnnouncementTable", JSON.parse(res.data.data));
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //4.企业红黑榜：
  fetchRedList({ commit }, data) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .getRedList(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============红");
            commit("getAnnouncementTable", JSON.parse(res.data.data).datas);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchBlackList({ commit }, data = { pageNo: 1 }) {
    if (!data) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      common
        .getBlackList(data.ord)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============黑");
            commit("getAnnouncementTable", JSON.parse(res.data.data).datas);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 需求一览
  fetchDemandList({ commit }, data = { pageNo: 1 }) {
    if (!data) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      let pageParam = {
        firstRow: 0,
        pageNo: data.pageNo,
        rowsPerPage: 10,
      };
      let filterParam = data.filterData? data.filterData : {}
      console.log(filterParam)
      common
        .demandList({ pageParam: pageParam,...filterParam})
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============demandList");
            let tableData = {};
            tableData.title = "需求一览";
            tableData.perPage = pageParam.rowsPerPage;
            tableData.total = JSON.parse(res.data.data).totalRows;
            tableData.columns = [
              // 表格头部数据
              {key:"statusname",label:"需求状态",isDrop:true, dropArr:enumerate.demandStatus},
              {key:"desiredtypename",label:"需求类型",isDrop:true, dropArr:enumerate.demandtype},
              {key:"detectionterrname",label:"服务分类/领域",isDrop:true,dropArr:enumerate.detectdomain},
              { editccodename: "发布企业" },
              { releasedate: "发布时间" },
            ];

            tableData.dataSource = JSON.parse(res.data.data).datas;
            tableData.dataSource = tableData.dataSource.map(p=>{
              return {...p, releasedate: moment(p.releasedate).format('YYYY.MM.DD')}
            })
            commit("getDemandList", tableData);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 服务一览
  fetchServiceList({ commit }, data = { pageNo: 1 }) {
    return new Promise((resolve, reject) => {
      let pageParam = {
        firstRow: 0,
        pageNo: data.pageNo,
        rowsPerPage: 10,
      };
      common
        .serviceList({ pageParam: pageParam })
        .then((res) => {
          if (res.data && res.data.status == "success") {
            console.log(JSON.parse(res.data.data), "============serviceList");
            let tableData = {};
            tableData.title = "服务一览";
            tableData.perPage = pageParam.rowsPerPage;
            tableData.total = JSON.parse(res.data.data).totalRows;
            tableData.columns = [
              // 表格头部数据
              {key:"servicerangename",label:"服务范围",isDrop:true,dropArr:enumerate.servicerange},
              {key:"serviceareaname",label:"服务地域",isCascader:true},
              { price: "服务价格" },
              { serviceprescription: "服务时效" },
              { editccodename: "发布人" },
            ];
            tableData.dataSource = JSON.parse(res.data.data).datas;
            console.log(tableData, "=====asdftabke");
            commit("getServiceList", tableData);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
