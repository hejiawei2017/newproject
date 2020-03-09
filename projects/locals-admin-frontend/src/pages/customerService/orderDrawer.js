import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Avatar, Row, Col, Button, Input, Icon, Popconfirm, message } from 'antd'
import {getFixNewImagePrefix,getNewImagePrefix,dataFormat} from '../../utils/utils'
import { platformType, imOrderType } from '../../utils/dictionary'
import {giftPacksService, imManagement} from '../../services'
import Bus from './eventBus'
import DiscountsModal from './discountsModal'
import './index.less'
import global from "../../utils/Global";

class OrderDrawer extends Component {
    constructor (props) {
        super(props)
        this.state = {
            disPlayAll: false,
            closeBtnDisabled: false,
            visible: false,
            thirdBoard: false,
            checkedOrder: null,
            houseList: {},
            curDisplayList: [],
            curList: [],
            curAllList: []
        }
    }
    componentDidMount () {
        if(this.props.chatContent && this.props.chatContent.id){
            //第三方平台：5:途家;6:airbnb;7:小猪;8:booking
            let thirdBoard = [5, 6, 7, 8].includes(this.props.chatContent.platformType)
            this.setState({
                disPlayAll: false,
                thirdBoard: thirdBoard
            })
            !thirdBoard && this.getOrderList()
            this.getHouseDeatil(this.props.chatContent.houseSourceId)
        }
    }
    getHouseDeatil = (id) =>{
        imManagement.getHouseDetail(id).then((res)=>{
            this.setState({
                houseList:res
            })
        })
    }
    getOrderList = () =>{
        const { bookingUserId, houseSourceId } = this.props.chatContent || {}
        const disPlayAll = this.state.disPlayAll
        let params = {
            houseSourceId: houseSourceId,
            bookingMemberId: bookingUserId,
            pageNum: 1,
            pageSize: 10
        }
        let curStatus = ['1207', '1208', '1101', '1201', '1210']
        imManagement.getOrderList(params).then((res)=>{
            let curList = res.list.filter((item) => curStatus.includes(item.orderStatus))
            this.setState({
                curDisplayList: disPlayAll ? res.list : curList,
                curList: curList,
                curAllList: res.list
            })
        })
    }
    expending = () => {
        let {disPlayAll, curAllList, curList} = this.state
        this.setState({
            curDisplayList: !disPlayAll ? curAllList : curList,
            disPlayAll: !disPlayAll
        })
    }
    showHistory = () => {
        this.expending()
    }
    overChat = () => {
        const { id } = this.props.chatContent || {}
        imManagement.sessionClose(id).then(() =>{
            this.setState({
                closeBtnDisabled: true
            })
            message.success('成功结束会话')
            Bus.emit('overChat')
            this.props.textareaDisabled()
        })
    }
    openDiscountModal = (item) => {
        this.setState({
            checkedOrder: item,
            visible: true
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    onSubmit = (err,value) =>{
        if(!err){
            const params = {
                bookingId:this.state.checkedOrder.id,
                noCleanFee:value.noCleanFee,
                noDeposit:value.noDeposit,
                specialDiscount:value.roomPrice
            }
            imManagement.sendSpecialDiscount(params).then((data)=>{
                this.setState({
                    visible: false,
                    disPlayAll: true
                },()=>{
                    message.success('发送特别优惠成功')
                })
                this.getOrderList()
                this.props.parent.sendImMessage(`房东已为您发送特别优惠，请点击详情完成预订`, 2)
                this.props.parent.sendApiMessage(`房东已为您发送特别优惠，请点击详情完成预订`, 2)
            }).catch(e=>{
                message.error('发送特别优惠失败')
            })
        }
    }
    agreeBooking = (item) => {
        imManagement.agreeBooking(item.id).then(() => {
            this.setState({
                disPlayAll: true
            })
            this.getOrderList()
            this.props.parent.sendImMessage('房东已同意您的预订，请点击详情完成预订', 3)
            this.props.parent.sendApiMessage('房东已同意您的预订，请点击详情完成预订', 3)
        })
    }
    rejectBooking = (item) => {
        imManagement.rejectBooking(item.id).then(() => {
            this.setState({
                disPlayAll: true
            })
            this.getOrderList()
            this.props.parent.sendImMessage('房东已拒绝您的预订', 4)
            this.props.parent.sendApiMessage('房东已拒绝您的预订', 4)
        })
    }
    getplatformTypeImg = (platformType) => {
        let img
        switch (platformType) {
            case 1: img = require("../../images/IM/5.png");break
            case 2: img = require("../../images/IM/5.png");break
            case 3: img = require("../../images/IM/5.png");break
            case 4: img = require("../../images/IM/5.png");break
            case 5: img = require("../../images/IM/2.png");break
            case 6: img = require("../../images/IM/3.png");break
            case 7: img = require("../../images/IM/4.png");break
            case 8: img = require("../../images/IM/1.png");break
            case 11: img = require("../../images/IM/5.png");break
            case 99: img = require("../../images/IM/6.png");break
            default: img = require("../../images/IM/5.png")
        }
        return img
    }
    render () {
        const self = this;
        const { bookingUserName, platformType, customerServiceSolved, tenantNumber, checkInDate, checkOutDate, totalPrice, bookingHeadUrl, orderStatus, randomId, id, sessionOrderView, sessionUserView} = self.props.chatContent || {}
        const { bookingMemberMobile } = sessionOrderView || {}
        const { memberCardName, isVip } = sessionUserView || {}
        const { houseNo, address, title, buName, buPhone, assistName, assistPhone } = this.state.houseList || {}
        const { curDisplayList, thirdBoard, curAllList, curList } = this.state;
        return (
            <div className="chat-header-box">
                { curDisplayList instanceof Array && curDisplayList.length > 0 ? //如果用户没有进行中订单
                    <div className={`chat-header`}>
                        <div className={`chat-box`}>
                            {
                                !thirdBoard &&
                                curDisplayList.map((item, index) => {
                                    return (
                                        <React.Fragment key={item.id + index}>
                                            <Row className="order_details" key={item.id}>
                                                <Col span={3}>
                                                    <div className="header-left">
                                                        <Avatar icon="user" size={44} src={self.getplatformTypeImg(platformType)} />
                                                    </div>
                                                </Col>
                                                <Col span={21}>
                                                    <div className="chat-order">
                                                        <p>订单状态：<span className="red">{imOrderType[item.orderStatus]} | {item.randomId}</span> {dataFormat(item.checkinDate,'YY/MM/DD')}-{dataFormat(item.checkoutDate,'YY/MM/DD')}</p>
                                                        <p>入住信息：{item.tenantNumber}人 | ¥{item.amount} | {item.bookingMemberName} {item.bookingMemberMobile}</p>
                                                        {
                                                            imOrderType[item.orderStatus] === '咨询' && ((!this.props.readOnly && customerServiceSolved === 1) || (this.props.readOnly && this.props.assistantAuth)) &&
                                                            <div className="consult-operate">
                                                                <Button className="ml10" ghost size="small" type="primary" onClick={function () {return self.agreeBooking(item)}}>接受</Button>
                                                                {/*<Popconfirm title="确定拒绝预定?" onConfirm={function () {return self.rejectBooking(item)}} okText="确认" cancelText="取消">*/}
                                                                    {/*<Button className="ml10" ghost size="small" type="primary">拒绝</Button>*/}
                                                                {/*</Popconfirm>*/}
                                                                <Button className="ml10" ghost size="small" type="primary" onClick={function (){ return self.openDiscountModal(item) }}>特别优惠</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                            {
                                                index === 0 &&
                                                <Row className="house_details">
                                                    <Col span={3}>
                                                    </Col>
                                                    <Col span={21}>
                                                        <div className="chat-house">
                                                            <p>会员等级： {memberCardName || '无'}{isVip && ` | ${isVip}`}</p>
                                                            <p>房源：<span className="red">{houseNo}</span> | {title} | 地址：{address}</p>
                                                            <p>BU：{buName} {buPhone}   管家：{assistName} {assistPhone}</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            }
                                        </React.Fragment>
                                    )
                                })
                            }
                            {
                                curAllList.length !== curList.length &&
                                <div className="circleArrow" onClick={this.expending}>
                                    { this.state.disPlayAll === true ?
                                        <div className="arrowIcon"><Icon className="icon" type="caret-up" /></div> :
                                        <div className="arrowIcon"><Icon className="icon" type="caret-down" /></div>
                                    }
                                </div>
                            }
                        </div>
                        { customerServiceSolved === 1 ?
                        <div className="viewButton">
                            <Popconfirm title="确定结束会话?" onConfirm={this.overChat} okText="确认" cancelText="取消">
                                <Button className="ml10" type="primary" disabled={this.state.closeBtnDisabled}>结束会话</Button>
                            </Popconfirm>
                        </div> : null
                        }
                    </div> : thirdBoard ?
                    <div className={`chat-header`}>
                        <div className={`chat-box`}>
                            <Row className="order_details">
                                <Col span={3}>
                                    <div className="header-left">
                                        <Avatar icon="user" size={44} src={self.getplatformTypeImg(platformType)} />
                                    </div>
                                </Col>
                                <Col span={21}>
                                    <div className="chat-order">
                                        <p>订单状态：<span className="red">{imOrderType[orderStatus]} | {randomId}</span> {dataFormat(checkInDate,'YY/MM/DD')}-{dataFormat(checkOutDate,'YY/MM/DD')}</p>
                                        <p>入住信息：{tenantNumber}人 | ¥{totalPrice} | {bookingUserName} {bookingMemberMobile}</p>
                                        {
                                            imOrderType[orderStatus] === '咨询' && !this.props.readOnly && customerServiceSolved === 1 &&
                                            <div className="consult-operate">
                                                {
                                                    !thirdBoard &&
                                                    <Button className="ml10" ghost size="small" type="primary" onClick={function () {return self.agreeBooking({id})}}>接受</Button>
                                                }
                                                {/*<Popconfirm title="确定拒绝预定?" onConfirm={function () {return self.rejectBooking(item)}} okText="确认" cancelText="取消">*/}
                                                {/*<Button className="ml10" ghost size="small" type="primary">拒绝</Button>*/}
                                                {/*</Popconfirm>*/}
                                                <Button className="ml10" ghost size="small" type="primary" onClick={function (){ return self.openDiscountModal({id}) }}>特别优惠</Button>
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row className="house_details">
                                <Col span={3}>
                                </Col>
                                <Col span={21}>
                                    <div className="chat-house">
                                        <p>会员等级： {memberCardName || '无'}{isVip && ` | ${isVip}`}</p>
                                        <p>房源：<span className="red">{houseNo}</span> | {title} | 地址：{address}</p>
                                        <p>BU：{buName} {buPhone}   管家：{assistName} {assistPhone}</p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        { customerServiceSolved === 1 ?
                            <div className="viewButton">
                                <Popconfirm title="确定结束会话?" onConfirm={this.overChat} okText="确认" cancelText="取消">
                                    <Button className="ml10" type="primary" disabled={this.state.closeBtnDisabled}>结束会话</Button>
                                </Popconfirm>
                            </div> : null
                        }
                    </div>
                    :
                    <div className="chat-none-header">
                        <div className="chat-none-box">
                            <div className="viewButtonHeader">
                                <Button className="viewLeftButton" onClick={this.showHistory} size="small" type="primary">查看历史订单</Button>
                                { customerServiceSolved === 1 ?
                                    <Popconfirm title="确定结束会话?" onConfirm={this.overChat} okText="确认" cancelText="取消">
                                        <Button type="primary" disabled={this.state.closeBtnDisabled}>结束会话</Button>
                                    </Popconfirm>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.checkedOrder &&
                    <DiscountsModal
                        visible={this.state.visible}
                        onCancel={this.onCancel}
                        checkedOrder={this.state.checkedOrder}
                        onSubmit={this.onSubmit}
                    />
                }
            </div>
        )
    }
}

export default OrderDrawer
