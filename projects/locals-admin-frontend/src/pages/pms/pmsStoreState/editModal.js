import React, { Component } from 'react'
import {Modal, Form, InputNumber, DatePicker, message, Button} from 'antd'
import moment from 'moment';
import './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker

class SetFormModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    handleCancel = () => {
        this.props.handleCancel()
    }
    onModalOk = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }else{
                const {type} = this.props
                if(type === 'stock'){
                    this.props.onSubmit(values)
                }else if(type === 'price'){
                    this.props.onSubmitPrice(values)
                }

            }
        })
    }
    datePickerStartOnChang = (date, dateString) => {
        this.setState({dateStartValue: dateString})
    }

    datePickerEndOnChang = (date, dateString) => {
        this.setState({dateEndValue: dateString})
    }

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        }
        const { getFieldDecorator } = this.props.form
        const { currentItem, type, visible, dateStartDefault, dateEndDefault, confirmLoading } = this.props
        const { calendars } = currentItem
        return (
            <Modal
                title={type === 'stock' ? '更变可售房数' : '更变房价'}
                visible={visible}
                width={500}
                confirmLoading={confirmLoading}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
            >
                <p className="hotel-title">{currentItem.houseNo + ' ' + currentItem.title}</p>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="日期"
                    >
                        {getFieldDecorator('dateRange', {
                            rules:
                                [
                                    { required: true, message: '日期不能为空' }
                                ],
                            initialValue: [moment(dateStartDefault, 'YYYY-MM-DD'), moment(dateEndDefault, 'YYYY-MM-DD')]
                        })(
                            <RangePicker
                                format={'YYYY-MM-DD'}
                            />
                        )}
                    </FormItem>
                    {
                        type === 'stock' &&
                        <FormItem
                            {...formItemLayout}
                            label="可售房数"
                        >
                            {getFieldDecorator('primitiveStock', {
                                rules:
                                    [
                                        { required: true, message: '房数不能为空' },
                                        { validator (rule, value, callback) {
                                                if(parseInt(value, 0) < 0){
                                                    callback('房数不能小于0')
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ],
                                initialValue: calendars[0].primitiveStock
                            })(
                                <InputNumber/>
                            )}
                        </FormItem>
                    }
                    {
                        type === 'price' &&
                        <FormItem
                            {...formItemLayout}
                            label="房价"
                        >
                            {getFieldDecorator('price', {
                                rules:
                                    [
                                        { required: true, message: '房价不能为空' },
                                        { validator (rule, value, callback) {
                                                if(parseInt(value, 0) < 0){
                                                    callback('房价不能小于0')
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ],
                                initialValue: calendars[0].price
                            })(
                                <InputNumber precision = {2}/>
                            )}
                        </FormItem>
                    }
                </Form>
            </Modal>
        )
    }
}

const EditModal = Form.create()(SetFormModal)
export default EditModal
