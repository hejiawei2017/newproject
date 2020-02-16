import Vue from 'vue'
import About from './about.vue'
import {init} from '../../libs/bridge'
init()
new Vue({
    render: h => h(About)
}).$mount('#app')

