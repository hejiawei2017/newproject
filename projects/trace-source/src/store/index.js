import Vue from 'vue'
import Vuex from 'vuex'
import dailog from './modules/dailog'
import user from './modules/user'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        dailog,
        user
    }
});
export default store;