import user from "@/api/user.js"

const state = {
  name: ""
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
}

const actions = {
  getUserName({ commit }) {
    return new Promise((resolve, reject) => {
      user.getUserName().then((res) => {
        console.log('res------------', res)
        commit("SET_NAME", res.data.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {

  state,
  mutations,
  actions
}
