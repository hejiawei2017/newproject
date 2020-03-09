import React, { Component } from 'react'
import {maketService} from '../../services'
import {dataFormat} from "../../utils/utils";
import { Form, Button, Input, message, Select } from 'antd'
import './index.less'

class marketRule extends Component {
    state = {
        pageNum:1,
        pageSize:10,
        ruleData:[],
        dayOfMonth:9
    }
    async componentDidMount () {
        await this.getBonusDetail();
    }
    async getBonusDetail () {
        const {pageNum,pageSize} = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            stateIn: 1
        };
        maketService.getMaketList(params).then((data) =>{
            let _data = data.list
            for (let i = 0; i < _data.length; i++) {
                if(_data[i].type === 1){
                    _data[i]._typeName = '拉粉'
                    _data[i]._explain = '单个粉丝奖励'
                    this.setState({dayOfMonth:_data[i].dayOfMonth})
                }else if(_data[i].type === 2){
                    _data[i]._typeName = '注册'
                    _data[i]._explain = '单个新会员奖励'
                }else if(_data[i].type === 3){
                    _data[i]._typeName = '礼包'
                    _data[i]._explain = `单个${_data[i].scopeDesc}奖励`
                }else if(_data[i].type === 4){
                    _data[i]._typeName = '订单'
                    _data[i]._explain = `单个订单奖励`
                }else if(_data[i].type === 5){
                    _data[i]._typeName = '房晚'
                    _data[i]._explain = `单个房晚奖励`
                }
            }
            this.setState({
                ruleData:_data
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }

    render () {
        const { ruleData,dayOfMonth } = this.state
        const nowdate = new Date().getTime()
        return (
            <div>
                <div className="ruleBlock">
                    <p className="title">当期有效奖金:</p>
                    {ruleData.map((item) =>
                        <div key={item.id}>
                            <div className="item">
                                <p className="tips">【{item._typeName}】{item._explain}￥{item.bonus}</p>
                                <p className="time">有效期: {dataFormat(item.startTime,"YYYY-MM-DD HH:mm:ss")}~{dataFormat(item.endTime,"YYYY-MM-DD HH:mm:ss")}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="ruleBlock">
                    <p className="title">奖金计算规则:</p>
                    <div className="item">
                        <p className="tips">每月{dayOfMonth}号统计上月拉粉业绩</p>
                        <p className="time">拉粉业绩的计算周期，每月统计1次，次月的{dayOfMonth}号到账</p>
                    </div>
                    <div className="item">
                        <p className="tips">订单业绩跟踪周期：180天</p>
                        <p className="time">用户通过员工分享的小程序注册，该用户入住时间在注册后180天内的订单，该奖励依旧会算作该员工的业绩</p>
                    </div>
                    <div className="item">
                        <p className="tips">离职员工的待生效奖金依旧有效</p>
                        <p className="time">员工离职后，对于待生效的订单、礼包、拉粉、新会员等，在生效之后，对应的奖金依旧会计算到员工账户上；离职后的员工依旧可进行提现操作</p>
                    </div>
                    <div className="item">
                        <p className="tips">老会员奖金计算规则</p>
                        <p className="time">老会员只统计购买礼包的奖金；其他的房晚、订单、关注公众号的奖金不再计算</p>
                    </div>
                </div>
                <div className="ruleBlock">
                    <p className="title">业绩追踪规则:</p>
                    <div className="item">
                        <p className="tips">业绩2级、奖励1级</p>
                        <p className="time">比如，管家A给外部用户B分享了小程序，B再将这个带有管家A的userid的小程序分享给了外部用户C，C再分享到外部用户D；则B和C通过小程序注册和下单的奖励也归到管家A，但D的奖励不归A</p>
                    </div>
                    <div className="item">
                        <p className="tips">员工专属ID说明</p>
                        <p className="time">1个员工1个专属ID，ID终身制</p>
                    </div>
                    <div className="item">
                        <p className="tips">关于公司手机号的说明</p>
                        <p className="time">若员工配有公司手机号，则公司手机号和私人手机号的销售业绩都统计到对应员工身上</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default marketRule