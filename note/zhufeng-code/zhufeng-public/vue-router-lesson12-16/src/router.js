import Vue from 'vue'
import Router from '@/vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
Vue.use(Router); // Vue.use => 当前对象的install方法


export default new Router({
  mode:'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      children: [
        {
          path: 'a', component: {
            render(h) {
              return <h1>about a</h1>
            }
          }
        },
        {
          path: 'b',
          component: {
            render(h) {
              return <h1>about b</h1>
            }
          }
        }
      ]
    }
  ]
})
