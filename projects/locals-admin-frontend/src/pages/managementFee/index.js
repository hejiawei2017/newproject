import React, { Component } from 'react'
import { Tabs } from 'antd'
import RoomRate from './roomRate'
import ImportFee from './importFee'
import Repayment from './repayment'
import './index.less'
const TabPane = Tabs.TabPane
class ManagementFee extends Component {
    constructor () {
        super()
        this.state = {
        }
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    render () {
        return (
            <div className="managementFee-page">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="房费运营管理" key="1">
                        <RoomRate />
                    </TabPane>
                    <TabPane tab="房源管理费率" key="2">
                        <ImportFee />
                    </TabPane>
                    <TabPane tab="待返款管理" key="3">
                        <Repayment />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default ManagementFee