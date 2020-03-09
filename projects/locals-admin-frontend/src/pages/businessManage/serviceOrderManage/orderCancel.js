import React, {Component} from 'react'
import {Input, Form,Modal,Row,Col,InputNumber,Divider} from 'antd'
import {serviceOrderManage} from "../../../services"
import {connect} from "react-redux"
import {message} from "antd/lib/index"
import Global from "../../../utils/Global"
const FormItem = Form.Item
const { TextArea } = Input

const mapStateToProps = (state, action) => {
    return {
        orderListM: state.orderListM
    }
}
class OrderCancelForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            error:'',
            errorP:''
        }
    }

    handleOk = (e) => {
        e.preventDefault()
        this.setState({
            error:'',
            errorP:''
        })
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }else if(values.cancelprice > this.props.data.ordertotalprice){
                this.setState({
                    error:'error',
                    errorP:"退款金额不能大于" + this.props.data.ordertotalprice
                })
                return
            }
            this.props.form.resetFields()
            this.orderOperation(values)
        })
    }


    orderOperation (obj){
        const params = {
            orderid:this.props.data.id,
            cancelprice:obj.cancelprice,
            remark: obj.remark,
            cancelstatus: 1,
            orderstatus: 6,
            refundstatus: 1,
            status: 6,
            creator:Global.userInfo.nickName,
            oldBusinessOrder: {
                id: this.props.data.id,
                status: 6,
                version: this.props.data.version
            }
        }
        serviceOrderManage.cancelOrder(params).then((data) => {
            this.props.dispatch({
                type: 'CANCEL_SERVICE_ORDER_MANAG_SUCCESS'
            })
            message.success('取消成功！')
            this.props.onCancel()
        }).catch( e =>{
            this.props.dispatch({
                type: 'CANCEL_SERVICE_ORDER_MANAG_ING'
            })
            message.success('取消失败！')
            this.props.onCancel()
        })
    }

    render () {
        const { cancelVisible, onCancel,form} = this.props
        const { getFieldDecorator } = form
        console.log(this.props.data)
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span:4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:20 }
            }
        }
        return (
            <Modal
                visible={cancelVisible}
                title="取消订单"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.handleOk}
            >
                <Form>
                    <Row>
                        <Col xs={18}>
                            服务订单编号：{this.props.data.servicecode}
                        </Col>
                        <Col xs={6}>
                            金额：¥ {this.props.data.ordertotalprice}
                        </Col>
                    </Row>
                    <Divider />
                    <FormItem label="退款金额" validateStatus={this.state.error} help={this.state.errorP} {...formItemLayout}>
                        {getFieldDecorator("cancelprice", {initialValue:this.props.data.ordertotalprice,rules: [{ required:true, message:'退款金额不能为空'}]},
                        )(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {getFieldDecorator("remark", {rules: [{ required:true, message:'原因不能为空'}]},
                        )(
                            <TextArea maxLength={2000} placeholder="请输入取消原因" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

let OrderCancel = Form.create()(OrderCancelForm)

export default connect(mapStateToProps)(OrderCancel)