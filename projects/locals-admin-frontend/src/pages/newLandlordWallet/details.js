import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'
import { checkType } from '../../utils/utils'
import { newLandlordWalletService } from '../../services'
import HouseSituation from './houseSituation'
import WalletDetails from './walletDetails'
import ArrearsDetails from './arrearsDetails'
import FreezeDetails from './freezeDetails'

import './index.less'
import SearchList from '../promotionReport/search';

const TabPane = Tabs.TabPane;
class Detail extends Component {
    constructor (props) {
        super (props)
        this.state = {
            typeData:'',
            arrearData:'',
            freezeData:''
        }
    }
    componentDidMount () {
        this.getType()
    }
    getType = () =>{
        newLandlordWalletService.getPayType().then((data)=>{
            let plt = []
            let arrear = []
            let freeze = []
            if(data && checkType.isArray(data)){
                data.map(item => {
                    let params = {
                        value: item.code,
                        text: item.name
                    }
                    plt.push(params)
                    if(parseInt(item.calculate,10) === -1 && parseInt(item.manualType,10) === 0){
                        let pm = {
                            payTypeIn: item.code
                        }
                        arrear.push(pm)
                    }
                    if(parseInt(item.calculate,10) === 1 && parseInt(item.manualType,10) === 0){
                        let pm = {
                            payTypeIn: item.code
                        }
                        freeze.push(pm)
                    }
                    return item
                })
                this.setState({
                    typeData: [{value:'',text:'全部'},...plt],
                    arrearData: [...arrear],
                    freezeData: [...freeze]
                })
            }
        })
    }
    callback = (key) => {
        //console.log(key);
    }
    render () {
        let self = this
        let { sumView,currentViewData,currentView } = self.props
        return (
            <div className="newWallet-detail">
                <div className="border">
                    <div className="code">
                        <p>钱包编号：{currentViewData.unionId}<span>（房东：{currentViewData.accountName}  手机：{currentViewData.phone}）</span></p>
                    </div>
                    <div className="amount">
                        <Row gutter={24}>
                            <Col span={14} >
                                <p className="status">钱包现状</p>
                                <Row gutter={24}>
                                    <Col span={6}>
                                        <p className="status-text">账号余额（￥）</p>
                                        <p className="status-num">{currentView.balance}</p>
                                    </Col>
                                    <Col span={6}>
                                        <p className="status-text">可提现金额（￥）</p>
                                        <p className="status-num">{currentView.canWithdraw || 0}</p>
                                    </Col>
                                    <Col span={6}>
                                        <p className="status-text">冻结金额（￥）</p>
                                        <p className="status-num">{currentView.sumFreeze || 0}</p>
                                    </Col>
                                    <Col span={6}>
                                        <p className="status-text">欠款金额（￥）</p>
                                        <p className="status-num">{currentView.sumOwe || 0}</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={10} className="cum">
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <p className="cum-text">累计收益（￥）</p>
                                        <p className="cum-num">{currentView.sumEarnings || 0}</p>
                                    </Col>
                                    <Col span={12}>
                                        <p className="cum-text">累计提现（￥）</p>
                                        <p className="cum-num">{currentView.sumWithdraw || 0}</p>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <p className="cum-text">累计管理费返现/奖励（￥）</p>
                                        <p className="cum-num">{currentView.sumReturn}</p>
                                    </Col>
                                    <Col span={12}>
                                        <p className="cum-text">当月管理费返现/奖励（￥）</p>
                                        <p className="cum-num">{currentView.sumCurrentMonthReturn}</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <Tabs onChange={self.callback} type="card" defaultActiveKey={self.state.defaultActiveKey}>
                        <TabPane tab="房源收支概况" key="1">
                            <HouseSituation houseSourceSumList={self.props.houseSourceSumList}/>
                        </TabPane>
                        <TabPane tab="钱包明细" key="2">
                            <WalletDetails currentViewData={self.props.currentViewData} typeData={self.state.typeData}/>
                        </TabPane>
                        <TabPane tab="欠款明细" key="3">
                            <ArrearsDetails currentViewData={self.props.currentViewData} typeData={self.state.typeData} arrearData={self.state.arrearData}/>
                        </TabPane>
                        <TabPane tab="冻结明细" key="4">
                            <FreezeDetails currentViewData={self.props.currentViewData} typeData={self.state.typeData} freezeData={self.state.freezeData}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default Detail
