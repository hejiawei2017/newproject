/*
 * @Author: hejiawei
 * @Date: 2021-04-13 21:57:25
 * @LastEditors: hejiawei
 * @LastEditTime: 2021-04-13 00:14:39
 * @Description: 用来创建vuex
 */

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
import common from "@/service/common.js";

import user from "./user.js"

// 每次调用都生成新的store实例
export default () => {
  const store = new Vuex.Store({
    state: {
      datastr: ""
    },
    mutations: {
      setDateStr(state, payload) {
        state.datastr = payload
      },
    },
    actions: {
      loadData({ commit }, payload) {
        return new Promise(resolve => {
          common.test(payload).then((res) => {
            commit("setDateStr", JSON.stringify(res.data.result[0]))
            resolve()
          }, (e) => {
            console.log("error", e)
          });
        })
      }
    },
    getters: {
      name: state => state.name
    },
    modules: {
      user
    }
  })
  // 前段运行时会执行此方法 用服务端的状态替换掉前端的状态
  if (typeof window !== "undefined" && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  return store
}
