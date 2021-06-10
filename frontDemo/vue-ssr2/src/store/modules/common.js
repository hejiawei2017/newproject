import common from "@/api/common.js";
import _ from 'lodash'

const systemType = process.env.SYSTEM_TYPE;
const state = {
  systemType: systemType,
  datastr: "444",
  columnStr: "",
  applyData: {}, // 应用案例
  showVideo: false
}

const mutations = {
  SET_DATE_STR: (state, payload) => {
    state.datastr = payload;
  },
  setColumnStr(state, payload) {
    state.columnStr = payload;
  },
  setAticleData(state, payload) {
    state.applyData = payload;
  },
  setShowVideo(state, payload) {
    state.showVideo = payload;
  },
}

const actions = {
  loadData({ commit }, payload) {
    return new Promise((resolve, reject) => {
      common
        .loadData(payload)
        .then((res) => {
          console.log("loadDatares", res);
          const { data } = res;
          commit("SET_DATE_STR", JSON.stringify(data.result[0]));
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getColumn({ commit }, payload) {
    return new Promise((resolve, reject) => {
      common
        .getColumn(payload)
        .then((res) => {
          if (res.data && res.data.status == "success") {
            commit("setColumnStr", JSON.stringify(res.data.data));
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getApplicationCases({ commit }, option = {}) {
    // 应用案例
    return new Promise((resolve, reject) => {
      common
        .getApplicationCases()
        .then((res) => {
          if (res.data && res.data.status == "success") {
            //根据栏目id，请求文章接口
            try {
              common
                .getArticle({
                  catalogid: JSON.parse(_.get(res,'data.data','[{}]'))[0].catalogid,
                  ...option,
                })
                .then((res) => {
                  commit("setAticleData", JSON.parse(_.get(res,'data.data','{}')));
                });
            } catch (err) {
              console.log(err);
              commit("setAticleData", {});
            }
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
}

export default {
  state,
  mutations,
  actions,
};
