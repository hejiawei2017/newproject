// 安装插件, 这个插件应该依赖于vue
import RouterView from './components/view'
export let _Vue;
export default function install(Vue) { // Vue 就是vue的构造函数
    _Vue = Vue; 
    // Vue.mixin 主要干了一件事 在所有组件上都增加了_routerRoot属性
    // 把用户注入的router属性
    Vue.mixin({
        beforeCreate() { // 深度优先 
            if(this.$options.router){ // 根实例
                this._routerRoot  = this;
                this._router = this.$options.router

                // init()
                this._router.init(this);// 初始化方法
                /// 响应式数据变化 只要_route 变化 就会更新视图 MVVM原理
                Vue.util.defineReactive(this,'_route',this._router.history.current);
            }else{
                this._routerRoot = this.$parent && this.$parent._routerRoot;
                // this._routerRoot._router
            }
        }
    });
    Object.defineProperty(Vue.prototype,'$route',{ // 都是属性 current  path matched
        get(){
            return this._routerRoot._route
        }
    });
    Object.defineProperty(Vue.prototype,'$router',{
        get(){
            return this._routerRoot._router;  // 拿到router属性
        }
    })
    // 1.注册全局属性 $route $router
    // 2.注册全局指令 v-scroll ...
    // 3.注册全局的组件 router-view router-link
    Vue.component('RouterView', RouterView)
}