import React, { Component } from 'react'
import {Menu,Icon,Dropdown} from 'antd'
import './index.less'

class PmsNav extends Component {
    constructor (props) {
        super(props)
        this.state = {
           current:this.props.current,
           storeTitle:this.props.storeTitle
        }
    }
    componentDidMount () {

    }

    componentWillUpdate (nextProps) {
        if(this.props.current !== nextProps.current){
            this.setState({
                current: nextProps.current,
                storeTitle: nextProps.storeTitle
            })
        }
    }

    handleClick = (e) => {
        this.props.routerPath(e.key)
    }

    render () {
        const menu = (
            <Menu
                selectedKeys={[this.state.current]}
                onClick={this.handleClick}
            >
                <Menu.Item key="pmsEditStore">
                    <Icon type="edit" />编辑门店
                </Menu.Item>
                <Menu.Item key="pmsRoomMaintain">
                    <Icon type="bank" />房间维护
                </Menu.Item>
                <Menu.Item key="pmsStoreFacility">
                    <Icon type="gold" />门店设施
                </Menu.Item>
                <Menu.Item key="pmsUnderHouse">
                    <Icon type="cluster" />下挂房源/房型
                </Menu.Item>
                <Menu.Item key="pmsStaff">
                    <Icon type="usergroup-add" />员工
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="mb" style={{
                width:'100%',position:'relative'
            }}
            >
                <div style={{paddingLeft:"15px",fontSize:"16px",fontWeight:600,lineHeight:"40px"}}>{this.state.storeTitle}</div>
                <Menu
                    selectedKeys={[this.state.current]}
                    onClick={this.handleClick}
                    mode="horizontal"
                >
                    {/*<Menu.Item key="pmsStoreHome">*/}
                        {/*<Icon type="home" />首页*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="pmsStoreState">
                        <Icon type="calendar" />门店房态
                    </Menu.Item>
                    {/*<Menu.Item key="pmsActivityList">*/}
                        {/*<Icon type="tags" />促销*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="pmsOrder">
                        <Icon type="gold" />订单
                    </Menu.Item>
                </Menu>
                <Dropdown overlay={menu} className={'fix-right'} placement="bottomCenter">
                    <div>
                        <div style={{ textAlign: 'center', height: '27px'}}>
                            <Icon style={{ fontSize: '32px'}} type="setting" />
                        </div>
                        <div style={{ fontSize: '12px',textAlign: 'center'}}>
                            设置
                        </div>
                    </div>
                </Dropdown>
            </div>
        )
    }
}
export default PmsNav
