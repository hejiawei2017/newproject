import React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { LayoutProps } from "./components/index"
import checkToken from './utils/getUserRole'
import routers from './configRoutes'
import {getCookie} from './utils/utils'
import {BreadcrumbCon} from './components/index'
// import {TagsView} from './components/index'
import {
    Login,
    Login404
} from "./pages/index"

// 判断当前 component 的类型
function isReactComponent (obj) {
    return Boolean(obj && obj.prototype && Boolean(obj.prototype.isReactComponent));
}
/**
 * 根据 component 的加载类型，判断用哪种方式去加载 router
 */
const loadComponent = function (component) {
    return isReactComponent(component) ?
        {component: component} :
        {getComponent: function (nextState, cb) {
            return component(function (com) {
                return cb(null, com);
            });
        }
        }
}

class Routes extends React.Component{
    constructor (props){
        super(props)
        this.state = {
            routes: routers.RoutesItem,
            pathName: ''
        }
        this.pathName = ''
    }
    componentWillMount (){
        if(window.location.hash !== '#/login'){
            checkToken().then(()=>{
                this.setState({
                    routes: routers.RoutesItem
                })
            })
        }
    }
    // componentWillReceiveProps (){
    //     if(window.location.hash === '#/login'){
    //     }else if(!Global.userInfo.id){
    //         this.checkToken()
    //     }
    // }
    /*
        渲染路由器,传入如configRoutes配置模式。
    */
    buildRoutes = (config) => {
        let html = []
        for(let i in config){
            if(config[i].childRoutes){
                html = html.concat(<LayoutProps key="LayoutProps" pathName={this.state.pathName}>{this.checkRouteChild(config[i].childRoutes)}</LayoutProps>)
            }else{
                html.push(this.renderRouteComonent(config[i]))
            }
        }
        return html
    }
    checkRouteChild = (itemArray) => {
        let html = []
        itemArray.map((i,index)=>{
            if(i.noRoute){
            }else if(i.childRoutes){
                i.childRoutes.map (n =>{
                    if(n.noRoute){
                    }else if(n.childRoutes){
                        if(n.componentDom){
                            html.push(this.renderRouteChild(`/${i.path}/${n.path}`,`${i.pathName}-${n.pathName}`,n.componentDom))
                        }
                        for(let m in n.childRoutes){
                            html.push(this.renderRouteChild(`/${i.path}/${n.path}/${n.childRoutes[m].path}`,`${i.pathName}-${n.pathName}-${n.childRoutes[m].pathName}`,n.childRoutes[m].componentDom))
                        }
                    }else{
                        html.push(this.renderRouteChild(`/${i.path}/${n.path}`,`${i.pathName}-${n.pathName}`,n.componentDom))
                    }
                    return n
                })
            }else{
                html.push(this.renderRouteChild(`${i.path ? '' : '/'}${i.path}`,i.pathName,i.componentDom))
            }
            return true
        })
        return <Switch>{html}</Switch>
    }
    renderRouteChild = (path,pathName,ComponentDom) => {

        // return (
        //     <Route exact strict path={path} key={path} pathName={pathName} render={function (props) {
        //         return (
        //             <TagsView key={path}>
        //                 <ComponentDom pathName={pathName} />
        //             </TagsView>
        //         )
        //     }}
        //     />
        // )
        return (
            <Route exact strict path={path} key={path} pathName={pathName} render={function (props) {
                return (<BreadcrumbCon pathName={pathName}><ComponentDom pathName={pathName} /></BreadcrumbCon>)
            }}
            />
        )
    }
    renderRouteComonent = (item) => {
        return (<Route exact path={item.path} key={item.path} {...loadComponent(item.component)} />)
    }
    render (){
        const {routes} = this.state
        return (
            <Switch>
                <Redirect from="/" exact to="/login" />
                <Route exact path="/login" {...loadComponent(Login)} />
                {
                    getCookie('token') ?
                        this.buildRoutes(routes) : null
                }
                <Route path="*" {...loadComponent(Login404)} />
            </Switch>
        )
    }
}

export default withRouter(Routes)
