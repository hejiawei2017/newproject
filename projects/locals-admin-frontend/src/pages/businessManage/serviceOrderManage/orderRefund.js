import React, {Component} from 'react'
import {Input, Form,Modal,Row,Col,InputNumber,Divider,Radio} from 'antd'
import {serviceOrderManage} from "../../../services"
import {connect} from "react-redux"
import {message} from "antd/lib/index"
import Global from "../../../utils/Global"
import {dataFormat} from "../../../utils/utils";
const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const mapStateToProps = (state, action) => {
    return {
        orderListM: state.orderListM
    }
}
class OrderRefundForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            error:'',
            errorP:'',
            ordertotalpriceError:'',
            ordertotalpriceErrorP:''
        }
    }

    handleOk = (e) => {
        e.preventDefault()
        this.setState({
            error:[],
            errorP:[]
        })
        this.props.form.validateFields((err, values) => {
            if(values.status === undefined) {
                this.setState({
                    error:'error',
                    errorP:'退单申请结果不能为空'
                })
                return
            }
            if (err) {
                return
            }else if(values.cancelprice > this.props.data.ordertotalprice){
                this.setState({
                    ordertotalpriceError:'error',
                    ordertotalpriceErrorP:"退款金额不能大于" + this.props.data.ordertotalprice
                })
                return
            }
            this.props.form.resetFields()
            this.orderOperation(values)
        })
    }


    orderOperation (obj){
        const params = {
            orderid :this.props.data.id,
            cancelstatus:0,
            orderstatus:obj.status,
            cancelprice:obj.cancelprice,
            refundstatus : 1,
            status:obj.status,
            remark:obj.remark,
            creator:Global.userInfo.nickName,
            oldBusinessOrder:{
                id:this.props.data.id,
                status:obj.status,
                version:this.props.data.version
            }
        }
        serviceOrderManage.cancelOrder(params).then((data) => {
            this.props.dispatch({
                type: 'CANCEL_SERVICE_ORDER_MANAG_SUCCESS'
            })
            message.success('操作成功！')
            this.props.onCancel()
        }).catch( e =>{
            this.props.dispatch({
                type: 'CANCEL_SERVICE_ORDER_MANAG_ING'
            })
            message.success('操作失败！')
            this.props.onCancel()
        })
    }

    render () {
        const { visible, onCancel,form} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span:8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:16 }
            }
        }
        return (
            <Modal
                visible={visible}
                title="退单处理"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.handleOk}
            >
                <Form>
                    <Row>
                        <Col xs={18}>
                            服务订单编号：{this.props.data.ordercode}
                        </Col>
                        <Col xs={6}>
                            金额：¥{this.props.data.ordertotalprice}
                        </Col>
                    </Row>
                    <Row className="pb10">
                        <Col xs={24}>
                            退单申请时间：{dataFormat(this.props.data.timeVersion, 'YYYY-MM-DD HH:mm')}
                        </Col>
                    </Row>
                    <Divider />
                    <FormItem label="退单申请结果" validateStatus={this.state.error} help={this.state.errorP} {...formItemLayout}>
                        {getFieldDecorator("status", {rules: [{ required:true, message:'退单申请结果不能为空'}]},
                        )(
                            <RadioGroup>
                                <Radio value="6">同意退单</Radio>
                                <Radio value="5">驳回订单</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="退款金额" validateStatus={this.state.ordertotalpriceError} help={this.state.ordertotalpriceErrorP} {...formItemLayout}>
                        {getFieldDecorator("cancelprice", {initialValue:this.props.data.ordertotalprice,rules: [{ required:true, message:'退款金额不能为空'}]},
                        )(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {getFieldDecorator("remark",
                            {rules: [{ required:true, message:'原因不能为空'}]},
                        )(
                            <TextArea maxLength={2000} placeholder="请输入取消原因" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

let OrderRefund = Form.create()(OrderRefundForm)

export default connect(mapStateToProps)(OrderRefund)