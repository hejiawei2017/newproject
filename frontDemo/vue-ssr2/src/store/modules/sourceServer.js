import common from "@/api/common.js"
import _ from 'lodash'

const state = {
  newsTabsNavList: [], // 溯源资讯tabs
  newsTabsContentData: {}, // 溯源资讯内容
  articleData: {}, // 文章详情内容
  qaListTabsData: [], // 常见问题tabs
  qaListContentData: {}, // 常见问题content
  docContentTabs: [], // 帮助文档tabs
  docContent: {}, // 帮助文档Content
  institutionData: {}, // 入驻机构
  knowledgeData: [], // 知识产权
  searchDetailData: {}, // 帮助中心-跳转页面
  serviceProviderTabs: [], // 入驻服务商tabs
  serviceProviderContent: {}, // 入驻服务商content
  helpDetailData: {}, // 帮助文档下载文件数据
  plEvaluation: {}, // 服务商评价
  riskEarlyWarningData: {}, // 预警信息列表
  earlyWarningDetailData: {}, // 预警信息详情
}
const mutations = {
  setNewsTabsNavList(state, data) {
    state.newsTabsNavList = data
  },
  setNewsTabsData(state, data) {
    state.newsTabsContentData = data
  },
  setArticleData(state, data) {
    state.articleData = data
  },
  setQaListTabsData(state, data) {
    state.qaListTabsData = data
  },
  setQaListContentData(state, data) {
    state.qaListContentData = data
  },
  setDocContentTabs(state, data) {
    state.docContentTabs = data
  },
  setDocContent(state, data) {
    state.docContent = data
  },
  setInstitutionData(state, data) {
    state.institutionData = data
  },
  setKnowledgeData(state, data) {
    state.knowledgeData = data
  },
  searchDetailData(state, data) {
    state.searchDetailData = data
  },
  serviceProviderTabs(state, data) {
    state.serviceProviderTabs = data
  },
  serviceProviderContent(state, data) {
    state.serviceProviderContent = data
  },
  HelpDetailData(state, data) {
    state.helpDetailData = data
  },
  setPlEvaluation(state, data) {
    state.plEvaluation = data
  },
  setRiskEarlyWarningData(state, data) {
    state.riskEarlyWarningData = data
  },
  setEarlyWarningDetailData(state, data) {
    state.earlyWarningDetailData = data
  },
}
const actions = {
  getArticle({ commit }, options = {}) { // 获取文章详情
    return new Promise((resolve, reject) => {
      try {
        common.getArticle(options).then((res) => {
          if (res.data && res.data.status == "success") {
            //根据栏目id，请求文章接口
            commit("setArticleData", JSON.parse(_.get(res,'data.data','{}')))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setArticleData", {})
      }
    })
  },
  getTraceInformation({ commit }, option = {}) { // 溯源资讯
    return new Promise((resolve, reject) => {
      try {
        common.getTraceInformation(option.ord).then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            commit("setNewsTabsNavList", list)
            //根据栏目id，请求文章接口
            common.getArticle({ catalogid: option.catalogid || list[option.index].catalogid }).then((resData) => {
              commit("setNewsTabsData", JSON.parse(_.get(resData,'data.data','{}')))
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setNewsTabsData", {})
      }
    })
  },
  InformationPublicity({ commit }, option = {}) { // 信息公示
    return new Promise((resolve, reject) => {
      try {
        common.platformMsg(option.ord).then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            commit("setNewsTabsNavList", list)
            //根据栏目id，请求文章接口
            common.getArticle({ catalogid: option.catalogid || list[option.index].catalogid }).then((resData) => {
              commit("setNewsTabsData", JSON.parse(_.get(resData,'data.data','[]')))
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setNewsTabsData", {})
      }
    })
  },
  platformMsg({ commit }, option = {}) { // 平台公告
    return new Promise((resolve, reject) => {
      try {
        common.platformMsg(option.ord).then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            commit("setNewsTabsNavList", list)
            //根据栏目id，请求文章接口
            common.getArticle({ catalogid: option.catalogid || list[option.index].catalogid }).then((resData) => {
              commit("setNewsTabsData", JSON.parse(_.get(resData,'data.data','{}')))
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setNewsTabsNavList", [])
        commit("setNewsTabsData", [])
      }
    })
  },
  commonProblem({ commit }, option = {}) { // 常见问题
    return new Promise((resolve, reject) => {
      try {
        common.commonProblem().then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            commit('setQaListTabsData',list)
            //根据栏目id，请求文章接口
            common.getArticle({ catalogid: option.catalogid || list[1].catalogid, ...option }).then((resData) => {
              if (res.data && res.data.status == "success") {
                commit("setQaListContentData", JSON.parse(_.get(resData,'data.data','{}')))
              }
              resolve()
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit('setQaListTabsData',[])
        commit("setQaListContentData", {})
      }
    })
  },
  institutionList({ commit }, option = {}) { // 入驻机构
    return new Promise((resolve, reject) => {
      try {
        common.institutionList(option).then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','{}'))
            commit("setInstitutionData", list)
          }else {
            commit("setInstitutionData", [])
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setInstitutionData", [])
      }
    })
  },
  entryServiceProvider({ commit }, option = {}) { // 入驻服务商
    return new Promise((resolve, reject) => {
      try {
        common.entryServiceProvider().then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]')).slice(1)
            commit('serviceProviderTabs',list)
            common.getArticle({ catalogid: option.catalogid || list[0].catalogid }).then((resData) => { 
              if (res.data && res.data.status == "success") {
                //根据栏目id，请求文章接口
                commit("serviceProviderContent", JSON.parse(_.get(resData,'data.data','{}')))
              }
              resolve()
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit('serviceProviderTabs',[])
        commit("serviceProviderContent", {})
      }
    })
  },
  helpfile({ commit }, option = {}) { // 帮助文档
    return new Promise((resolve, reject) => {
      try {
        common.helpfile().then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            commit("setDocContentTabs", list)
            //根据栏目id，请求文章接口
            common.getArticle({ catalogid: option.catalogid || list[1].catalogid }).then((resData) => {
              if (res.data && res.data.status == "success") {
                const data = JSON.parse(_.get(resData,'data.data','{}'))
                commit("setDocContent", data)
                common.helpDetail({ articleid: data.datas[0].articleid} ).then((detail=>{
                  commit('HelpDetailData',JSON.parse(_.get(detail,'data.data','{}')))
                }))
              }
              resolve()
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setDocContentTabs", [])
        commit("setDocContent", {})
      }
    })
  },
  knowledgeProtect({ commit },option = {}) { // 知识产权保护（这个模块只有在知识产权保护公共服务平台下面有）
    return new Promise((resolve, reject) => {
      try {
        common.knowledgeProtect().then((res) => {
          if (res.data && res.data.status == "success") {
            const list = JSON.parse(_.get(res,'data.data','[]'))
            common.getArticle({ catalogid: option.catalogid || list[0].catalogid }).then((resData) => {
              if (res.data && res.data.status == "success") {
                commit("setKnowledgeData", JSON.parse(_.get(resData,'data.data','{}')))
              }
              resolve()
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setKnowledgeData", [])
      }
    })
  },
  helpcenter({ commit },option = {}) { // 帮助中心
    return new Promise((resolve, reject) => {
      try {
        common.helpcenter(option).then((res) => {
          if (res.data && res.data.status == "success") {
            commit("searchDetailData", JSON.parse(_.get(res,'data.data','{}')))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("searchDetailData", {})
      }
    })
  },
  plEvaluation({ commit },option = {}) { // 服务商评价分页信息接口
    return new Promise((resolve, reject) => {
      try {
        common.plEvaluation(option).then((res) => {
          if (res.data && res.data.status == "success") {
            commit("setPlEvaluation", JSON.parse(_.get(res,'data.data','{}')))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setPlEvaluation", {})
      }
    })
  },
  riskEarlyWarning({ commit },option = {}) { // 风险预警列表
    return new Promise((resolve, reject) => {
      try {
        common.riskEarlyWarning(option).then((res) => {
          if (res.data && res.data.status == "success") {
            commit("setRiskEarlyWarningData", JSON.parse(_.get(res,'data.data','{}')))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setRiskEarlyWarningData", {})
      }
    })
  },
  earlyWarningDetail({ commit },option = {}) { // 风险预警详情
    return new Promise((resolve, reject) => {
      try {
        common.earlyWarningDetail(option).then((res) => {
          console.log(JSON.parse(_.get(res,'data.data','{}')));
          if (res.data && res.data.status == "success") {
            commit("setEarlyWarningDetailData", JSON.parse(_.get(res,'data.data','{}')))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        commit("setEarlyWarningDetailData", {})
      }
    })
  },
}

export default {
  state,
  mutations,
  actions
}
