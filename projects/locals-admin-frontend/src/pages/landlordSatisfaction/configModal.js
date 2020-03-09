import React, {PureComponent, Fragment} from 'react'
import {Modal, Form, Row, Col, Input, Button, Radio, InputNumber, Popconfirm, message, Checkbox } from 'antd'
import moment from 'moment'
import {landlordService} from '../../services'

const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 10}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 10}
    }
}

class ConfigModal extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            examId: '',
            openTime: '',
            closeTime: ''
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount () {
        landlordService.getExamConfig({
            examId: '1118763773129330690'
        }).then((data) =>{
            this.setState({
                examId: data.examId,
                openTime: data.openTime,
                closeTime: data.closeTime
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    onSubmit = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            values.examId = this.state.examId
            this.props.onSubmit(values)
        })
    }
    render () {
        const self = this
        const { handleCancel, month, configVisible} = this.props
        const {openTime, closeTime} = this.state
        const {getFieldDecorator} = this.props.form
        return (
            <Modal
                title="配置开闭评分日期"
                visible={configVisible}
                width="500px"
                onCancel={handleCancel}
                onOk={self.onSubmit}
                destroyOnClose
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="当月开放评分日期"
                    >
                        {getFieldDecorator('openTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入日期'
                                },
                                {
                                    validator (rule, value, callback) {
                                        let totalDay = moment(month).daysInMonth()
                                        if(value < 0 || value > totalDay){
                                            callback(`日期范围为0-${totalDay}`)
                                        }
                                        callback()
                                    }
                                }
                            ],
                            initialValue: openTime
                        })(
                            <InputNumber/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="次月开放评分日期"
                    >
                        {getFieldDecorator('closeTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入日期'
                                },
                                {
                                    validator (rule, value, callback) {
                                        let totalDay = moment(month).add(1, 'M').daysInMonth()
                                        if(value < 0 || value > totalDay){
                                            callback(`日期范围为0-${totalDay}`)
                                        }
                                        callback()
                                    }
                                }
                            ],
                            initialValue: closeTime
                        })(
                            <InputNumber/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ConfigModal = Form.create()(ConfigModal)

export default ConfigModal
