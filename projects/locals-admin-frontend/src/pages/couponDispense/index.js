import React, { Component } from 'react'
import { conponHandService } from '../../services'
import { Button,Form,Input,message,InputNumber} from 'antd'

const FormItem = Form.Item;
class CouponDispenseFrom extends Component {
    onSubmit = () =>{
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            if(!error){
                const params = {
                    ...values,
                    fromOrderCode:'ADMIN'
                }
                conponHandService.postReceiveCoupon(params).then((data)=>{
                    if(data === 1){
                        message.success('充值成功')
                    }
                }).catch(e=>{
                    message.error(e.errorDetail)
                })
            }
        })
    }
    render () {
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <FormItem
                    label="优惠码（仅限优惠券的优惠码）"
                >
                    {getFieldDecorator('couponCode', {
                        rules: [{
                            required:true, message: '填写优惠码'
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="手机号码"
                >
                    {getFieldDecorator('mobile', {
                        rules: [{
                            required:true,
                            message:'请输入正确的手机号',
                            pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            len:11
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="充值数量"
                >
                    {getFieldDecorator('quantity', {
                        rules: [{
                            required:true,
                            message:'请输入数量'
                        }],
                        initialValue:1
                    })(
                        <InputNumber min={1} max={999999}/>
                    )}
                </FormItem>
                <FormItem >
                    <Button type="primary" htmlType="submit" onClick={this.onSubmit}>充劵</Button>
                </FormItem>
            </Form>
        )
    }
}
const CouponDispense = Form.create()(CouponDispenseFrom)
export default CouponDispense
