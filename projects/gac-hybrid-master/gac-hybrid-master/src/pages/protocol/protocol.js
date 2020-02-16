import Vue from 'vue'
import Protocol from './protocol.vue'
import {init} from '../../libs/bridge'
init()
new Vue({
    render: h => h(Protocol)
}).$mount('#app')

