
import user from "@/service/user.js"
export default {
    namespaced: true,
    state: {
        username: ""
    },
    mutations: {
        setUserName(state, param) {
            state.username = param;
        }
    },
    actions: {
        getUserName({ commit }, param) {
            return new Promise(resolve => {
                user.getUserName().then((res) => {
                    //console.log("res.data.username", res.data.username)
                    commit("setUserName", res.data.username)
                    resolve()
                })
            })
        }
    }
}