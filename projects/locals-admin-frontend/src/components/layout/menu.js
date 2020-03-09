import React from 'react'
import { Menu, Icon } from 'antd'
import { Link,withRouter } from 'react-router-dom'
import routers from '../../configRoutes'
const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class LayoutMenu extends React.Component {
    constructor (){
        super()
        this.state = {
            navList: [],
            defaultPath: [],
            routerLoading: true,
            lastRouter: []
        }
        // this.clickMenu = this.clickMenu.bind(this)
    }
    componentWillMount (){
        this.menuList()
    }
    componentWillReceiveProps (){
        if(this.state.routerLoading){
            this.menuList()
        }
    }
    menuList (){
        const navList = []
        // let pathName = this.props.location.pathname
        const configRoutes = routers.RoutesItem
        if(configRoutes.length > 0 && configRoutes[0] && configRoutes[0].childRoutes && configRoutes[0].loading){
            let path = configRoutes[0].activePath.split('=>')
            if( path.length > 0 ){
                path[0] = '/' + path[0]
                if( path.length > 1 ){
                    path[1] = path[0] + '/' + path[1]
                }
                if( path.length > 2 ){
                    path[2] = path[1] + '/' + path[2]
                }
            }
            configRoutes[0].childRoutes.map( item => {
                if((!item.noNav ) && (!item.noRoute)){
                    const url = '/' + (item.path || '')
                    if(item.childRoutes){//二级菜单
                        navList.push(this.renderSubMenu(url,item))
                    }else{
                        navList.push(this.renderMenuItem(url,item.iconType,item.pathName))
                    }
                }
                return item
            })
            this.setState({
                navList,
                defaultPath: path,
                routerLoading: false
            })
        }
    }
    renderSubMenu (url,item) {
        return (
            <SubMenu key={url} title={<span><Icon type={item.iconType || ''} /><span>{item.pathName}</span></span>}>
                {item.childRoutes.map( c => {
                    if((!c.noNav ) && (!c.noRoute)){
                        if(c.childRoutes && (!c.noChildLink)){
                            return this.renderTriMenu(url,c)
                        }else{
                            return this.renderMenuItem(url + '/' + c.path,c.iconType,c.pathName)
                        }
                    }
                    return false
                })}
            </SubMenu>)
    }
    renderTriMenu (url,item) {
        return (<SubMenu key={item.path} title={item.pathName}>
            {item.childRoutes.map( c => {
                return this.renderMenuItem(url + '/' + item.path + '/' + c.path,c.iconType,c.pathName)
            })}
        </SubMenu>)
    }
    renderMenuItem (path,iconType = '',pathName){
        return (<MenuItem key={path} >
            <Link to={path}>
                {/* {iconType && <Icon type={iconType} />} */}
                <i className="menu-prech"></i>
                <span>{pathName}</span>
            </Link>
        </MenuItem>)
    }
    render () {
        const { navList, defaultPath, routerLoading } = this.state
        const {theme} = this.props
        return (
            routerLoading ? null :
                (<Menu theme={theme} mode="inline" defaultSelectedKeys={defaultPath}>{navList}</Menu>)
        )
    }
}

export default withRouter(LayoutMenu)
