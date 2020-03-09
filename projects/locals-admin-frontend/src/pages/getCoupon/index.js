import React, { Component } from 'react'
import getCouponSerivce from '../../services/get-coupon-service'
import { Form, Button, Input, message, Select } from 'antd'

const { Item } = Form
const { Option } = Select

class GetCouponForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values.mobile)
                let params = {
                    orderId: values.orderId,
                    couponCode: values.couponCode,
                    mobile: values.mobile,
                    platform: 'WEB'
                }
                if (values.couponCode === 'YUJGTGRT' && !values.orderId) {
                    message.error('请输入订单ID！')
                    return
                }
                getCouponSerivce.pickUP(params).then(res => {
                    // console.log(res)
                    if (res.errorMsg) {
                        message.error(res.errorMsg)
                    } else {
                        message.success('领取成功！')
                    }
                    this.props.form.resetFields()
                })
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
          };
        return (
            <div className="pt20 m0Auto w600">
                <Form onSubmit={this.handleSubmit}>
                    <Item label="订单ID" {...formItemLayout}>
                        {getFieldDecorator('orderId', {
                            rules: [{ required: false}]
                        })(
                            <Input placeholder="请输入订单ID" />
                        )}
                    </Item>
                    <Item label="手机号" {...formItemLayout}>
                        {getFieldDecorator('mobile', {
                            rules: [{ required: true, message: '请输入手机号！'}]
                        })(
                            <Input placeholder="请输入手机号码" />
                        )}
                    </Item>
                    <Item label="金额" {...formItemLayout}>
                        {getFieldDecorator('couponCode', {
                            rules: [{ required: true, message: '请选择金额！' }]
                        })(
                            <Select placeholder="请选择金额">
                                <Option value="JHUTRFGF">50元</Option>
                                <Option value="YUJGTGRT">400元</Option>
                            </Select>
                        )}
                    </Item>
                    <Item wrapperCol={{ span: 12, offset: 4 }}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Item>
                </Form>
            </div>
        )
    }
}

const GetCoupon = Form.create()(GetCouponForm)
export default GetCoupon