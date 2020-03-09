import React, {Component} from 'react'
import {Modal,Row,Col,Steps,Popover,Button,Card,Tooltip,Icon,Divider} from 'antd'
import {dataFormat} from "../../../utils/utils"
import {orderType} from "../../../utils/dictionary"
import OrderRefundList from './orderRefundList'
import OrderCancelForm from './orderCancel'
import {serviceOrderManage} from "../../../services"
import {connect} from "react-redux"
const Step = Steps.Step;

const mapStateToProps = (state, action) => {
    return {
        serviceRefundM: state.serviceRefundM
    }
}

class ServiceOrderDetail extends Component {
    constructor (props) {
        super(props)
        this.state = {
            current :'1',
            nowData : new Date().getTime(),
            refundVisible:false,
            cancelVisible:false,
            refundData:[],
            cancelData:null,
            refundType:this.props.data.paystatus === 1 ? '退单记录' : '取消记录'
        }
        this.handleRefund = this.handleRefund.bind(this)
        this.handOrder = this.handOrder.bind(this)
    }

    handOrder = () =>{
        this.setState({
            cancelVisible:true,
            cancelData:{
                servicecode:this.props.id,
                ordertotalprice:this.props.data.ordertotalprice,
                id:this.props.data.id,
                version:this.props.data.version
            }
        })
    }

    //关闭取消订单MOdal
    closeRefund = () =>{
        this.setState({
            refundVisible:false
        })
    }

    closeCancel = () =>{
        this.setState({
            cancelVisible:false
        })
        this.props.onCancel()
    }
    handleRefund (){
        let params = {
            orderid: this.props.data.id
        }
        serviceOrderManage.getRefundOrder(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_REFUND_ORDER_SUCCESS',
                payload:data
            })
            this.setState({
                refundVisible:true,
                refundData:data
            })
        })
    }

    render () {
        let self = this
        const { visible, onCancel} = this.props
        let formData = this.props.data
        let serviceList = this.props.data.oldBusinessOrderServiceViewList
        return (
            <Modal
                visible={visible}
                title="服务订单详情"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                wrapClassName="scroll-center-modal"
                style={{top:0}}
                footer={[
                    <Row key="row">
                        <Col xs={12} key="col1" className="text-left">
                            <Button key="submit" type="primary" onClick={self.handleRefund}>
                                {formData.paystatus === 1 ? '退单记录' : '取消记录' }
                            </Button>
                        </Col>
                        <Col xs={12} key="col2">
                            <span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>
                        </Col>
                    </Row>
                ]}
                width="840px"
                bodyStyle={{fontSize:12}}
            >
                <Row type="flex" className="wrapper-md fz12">
                    <Col xs={18}>
                        <Row className="pb10">
                            <Col xs={12}>
                                服务订单编号：{this.props.id}
                            </Col>
                            <Col xs={12}>
                                服务订单编号：{dataFormat(formData.createTime, 'YYYY-MM-DD HH:mm')}
                            </Col>
                        </Row>
                        <Row className="pb20">
                            <Col xs={12}>
                                行程单号：{formData.bookingrandomid}
                            </Col>
                            <Col xs={12}>
                                客服：{formData.customservicename} ({formData.customservicephone})
                            </Col>
                        </Row>
                        {
                            formData.status === 8 || formData.status === 2 ?
                                <div className="padder-xl padder-vt-lg bt fz12">
                                    <Steps current={1} progressDot >
                                        <Step title="提交订单" description={dataFormat(formData.createTime, 'YYYY-MM-DD HH:mm')} />
                                        <Step title="已取消订单" description="订单已取消" />
                                    </Steps>
                                </div>
                                : this.state.nowData > formData.checkouttime && formData.paystatus === 0 && formData.status !== 2 && formData.status !== 8 ?
                                    <div className="padder-xl padder-vt-lg bt fz12">
                                        <Steps current={1} progressDot >
                                            <Step title="提交订单" description={dataFormat(formData.createTime, 'YYYY-MM-DD HH:mm')} />
                                            <Step title="订单已失效" description="订单已失效" />
                                        </Steps>
                                    </div>
                                    : formData.status === 7 && formData.paystatus === 1 ?
                                        <div className="padder-xl padder-vt-lg bt fz12">
                                            <Steps current={2} progressDot >
                                                <Step title="提交订单" description={dataFormat(formData.createTime, 'YYYY-MM-DD HH:mm')} />
                                                <Step title="已支付" description={dataFormat(formData.payTime, 'YYYY-MM-DD HH:mm')} />
                                                <Step title="已退款" description="订单已取消，并退款完成" />
                                            </Steps>
                                        </div>
                                        : <div className="padder-vt-lg bt fz12">
                                            <Steps
                                                current={
                                                    formData.paystatus === 1 && this.state.nowData > formData.checkouttime ?
                                                        3 : formData.paystatus === 1 && this.state.nowData > formData.checkintime ?
                                                            2 : formData.paystatus === 1 && this.state.nowData > formData.payTime ?
                                                                1 : formData.paystatus === 0 && this.state.nowData > formData.payTime ?
                                                                    0 : 0
                                                }
                                                progressDot
                                            >
                                                <Step title="提交订单" description={dataFormat(formData.createTime, 'YYYY-MM-DD HH:mm')} />
                                                <Step title="已支付" description={dataFormat(formData.payTime, 'YYYY-MM-DD HH:mm')} />
                                                <Step title="服务中" description={dataFormat(formData.checkintime, 'YYYY-MM-DD')} />
                                                <Step title="已完成" description={dataFormat(formData.checkouttime, 'YYYY-MM-DD')} />
                                            </Steps>
                                        </div>

                        }
                    </Col>
                    <Col xs={6} className="text-center" style={{border:'1px dashed rgb(0, 0, 0)'}}>
                        <div className="padder-vt-lg">
                            订单状态：
                            {
                                this.state.nowData > formData.checkouttime && formData.paystatus === 0 && formData.status !== 8 && formData.status !== 2 ?
                                    '订单已失效' :
                                    this.state.nowData > formData.checkouttime && formData.status === 3 ? "订单已完成" :
                                        orderType[formData.status]
                            }
                        </div>
                        {formData.status === 2 || formData.status === 6 ? <div>
                            <p className="padder-v-sm">取消时间：{dataFormat(formData.logtimeVersion, 'YYYY-MM-DD HH:mm')}</p>
                            <div>
                                <Popover content={formData.logremark} title="取消订单备注">
                                    <Button type="primary" size="small">查看备注</Button>
                                </Popover>
                            </div>
                        </div> : null }
                        {
                            formData.status === 3 && formData.paystatus === 1 && this.state.nowData < formData.checkouttime ?
                                <Button
                                    className="mt-md"
                                    key="submit"
                                    type="primary"
                                    disabled={formData.status === 3 && formData.paystatus === 1 ? false : true}
                                    onClick={self.handOrder}
                                >
                                    取消订单
                                </Button> : null
                        }
                    </Col>
                </Row>
                <div className="wrapper-md bt">
                    <div className="pb10">服务订单详情</div>
                    <Row className="pb10" style={{paddingLeft:50}}>
                        <Col xs={12}>
                            服务客户：{formData.customname}
                        </Col>
                        <Col xs={12}>
                            客户手机：{formData.phone}
                        </Col>
                    </Row>
                    <Row className="pb10" style={{paddingLeft:50}}>
                        <Col xs={12}>
                            服务地址：{formData.checkinaddress}
                        </Col>
                        <Col xs={12}>
                            服务时间：{dataFormat(formData.checkintime, 'YYYY-MM-DD')} ~ {dataFormat(formData.checkouttime, 'YYYY-MM-DD')}
                        </Col>
                    </Row>
                    <Row className="pb10" style={{paddingLeft:50}}>
                        <Col xs={12}>
                            房源编码：{formData.houseno}
                        </Col>
                        <Col xs={12}>
                            助理姓名：{formData.assistnickname}
                        </Col>
                    </Row>
                    <Row className="pb10" style={{paddingLeft:50}}>
                        <Col xs={12}>
                            助理电话：{formData.assistphone}
                        </Col>
                        <Col xs={12}>
                            Bu姓名：{formData.bunickname}
                        </Col>
                    </Row>
                    <Row style={{paddingLeft:50}}>
                        <Col xs={12}>
                            Bu电话：{formData.buphone}
                        </Col>
                        <Col xs={12}></Col>
                    </Row>
                </div>
                <div className="wrapper-md bt">
                    <Row>
                        <Col xs={8}>{formData.activityname}({formData.activitycode})</Col>
                        <Col xs={16}>服务收费模式：{formData.chargetypeid === 1 ? '按套餐收费' : '按服务收费'}</Col>
                    </Row>
                    {
                        serviceList.length > 0 ? serviceList.map(function (item,index) {
                            return (
                                <Card className="mb-md"
                                    key={index}
                                    title={<div className="fz12 pt5">
                                        {item.servicename}
                                        {
                                            item.templatetypeid === "1" && item.templatecol4 !== "" ? "" :
                                                <span className="ml-sm ml-sm fz12" >
                                                    ({item.containcount === 0 ? '不限' : item.containcount + '次' })
                                                </span>
                                        }
                                        <Tooltip overlayStyle={{fontSize:12}} title={item.serviceremark} >
                                            <Icon className="ml-sm" type="info-circle" />
                                        </Tooltip>
                                    </div>
                                    }
                                    extra={<span className="fz12">服务商：{item.providername}</span>}
                                    bodyStyle={{padding:"12px 20px",fontSize:12}}
                                >
                                    {item.templatetypeid === "1" && item.templatecol4 !== "" ? <div>
                                        <Row>
                                            <Col xs={6} className="text-right">
                                                服务客户：
                                            </Col>
                                            <Col xs={18}>
                                                {item.linkmanname} {item.phone}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                身份证：
                                            </Col>
                                            <Col xs={18}>
                                                {item.cercode}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                出发地：
                                            </Col>
                                            <Col xs={18}>
                                                {item.startaddress}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                目的地：
                                            </Col>
                                            <Col xs={18}>
                                                {item.endaddress}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                上门时间：
                                            </Col>
                                            <Col xs={18}>
                                                {item.visitTime}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                取件时间：
                                            </Col>
                                            <Col xs={18}>
                                                {item.takepartTime}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                行李数量：
                                            </Col>
                                            <Col xs={18}>
                                                {item.luggagecount}
                                            </Col>
                                        </Row>
                                        <Row className="pt5">
                                            <Col xs={6} className="text-right">
                                                保价费用（元）：
                                            </Col>
                                            <Col xs={18}>
                                                {item.supportvalueprice * (item.templatecol4 / 100)}（保价{item.supportvalueprice}）
                                                <Tooltip overlayStyle={{fontSize:12}} title={item.supportremark} ><Icon type="info-circle" /></Tooltip>
                                            </Col>
                                        </Row>
                                        <Divider style={{margin:"10px 0"}} />
                                        <Row>
                                            <Col xs={24} className="text-right">
                                                小计：￥{item.subtotal}
                                            </Col>
                                        </Row>
                                    </div> : <div>实际数量 ：{item.containcount === 0 ? '不限' : item.containcount + '次' }</div >}
                                </Card>
                            )
                        }) : null
                    }
                </div>
                <div className="wrapper-md text-right">
                    <p>共计{serviceList.length}项服务 共计金额：  ￥{formData.ordertotalprice}</p>
                    <p>实付金额：   ￥{formData.ordertotalprice}</p>
                </div>
                {
                    this.state.refundVisible ?
                        <OrderRefundList
                            refundVisible={this.state.refundVisible}
                            data={this.state.refundData}
                            onCancel={this.closeRefund}
                            refundType={this.state.refundType}
                        /> : null
                }
                {
                    this.state.cancelVisible ?
                        <OrderCancelForm
                            cancelVisible={this.state.cancelVisible}
                            data={this.state.cancelData}
                            onCancel={this.closeCancel}
                        /> : null
                }
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(ServiceOrderDetail)