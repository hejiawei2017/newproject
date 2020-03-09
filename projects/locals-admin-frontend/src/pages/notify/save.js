import 'braft-editor/dist/index.css'
import React, { Component } from 'react'
import { Input, Form, Button, Select, message } from 'antd'
import BraftEditor from 'braft-editor'
import { notifyService } from '../../services'
import qs from 'qs'

const FormItem = Form.Item
const notifyTypes = [
    {
        label: '房东端重要通知',
        value: 2
    },
    {
        label: '房东端系统通知',
        value: 3
    },
    {
        label: '房东端活动通知',
        value: 4
    }
]

class Save extends Component {
    constructor () {
        super()
        this.state = {
            fields: [{
                label: '通知类型',
                fieldName: 'noticeType',
                type: 'select',
                options: notifyTypes,
                required: true
            },
            // {
            //     label: '目标用户id',
            //     fieldName: 'toUserId',
            //     type: 'text',
            //     required: true,
            //     help: '如果是群发传-1'
            // },
            {
                label: '通知标题',
                fieldName: 'title',
                type: 'text',
                required: true
            },{
                label: '通知简短内容',
                fieldName: 'briefContent',
                type: 'text'
            },{
                label: 'url跳转',
                fieldName: 'url',
                type: 'text'
            },{
                label: '通知附加参数',
                fieldName: 'extra',
                type: 'text',
                help: 'DEMO: a=1&b=2&c=3...'
            }, {
                label: '通知内容',
                fieldName: 'content',
                type: 'richtext',
                required: true
            }]
        }
    }
    handleSubmit = (event) => {
        event.preventDefault()

        this.props.form.validateFields((error, values) => {
        if (!error) {
            let submitData = Object.entries(values).reduce((prev, curr) => {
                const [key, value] = curr
                if (value) {
                    if (key === 'content') {
                        prev[key] = values.content.toHTML ? values.content.toHTML() : values.content // 如果没有toHTML方法就是没有录入
                    } else if(key === 'extra') {
                        prev[key] = qs.parse(value)
                    } else {
                        prev[key] = value

                    }
                }
                return prev
            }, {})
            // TODO: 这里可能之后要改成目标用户ID，但是现在只有群发 -1 by weizheng pan time 2019.5.24
            submitData.toUserId = -1
            notifyService
                .setNotice(submitData)
                .then(() => {
                    message.success('消息创建成功')
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
        })
    }
    renderFormItem = ({label, fieldName, type, options, required, help = ''}) => {
        const controls = ['font-size', 'bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ]
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 3, offset: 2 }
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 17 }
            }
        }

        const renderFormItemByText = () => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={label}
                    key={fieldName}
                    help={help}
                >
                    {getFieldDecorator(fieldName, {
                        initialValue: '',
                        rules: [{ required, message: `${label}必须填写` }]
                    })(
                        <Input placeholder={`请输入${label}`} />
                    )}
                </FormItem>
            )
        }

        const renderFormItemByRichText = () => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={label}
                    key={fieldName}
                >
                    {getFieldDecorator(fieldName, {
                        initialValue: '',
                        rules: [{
                            required,
                            message: `${label}必须填写`,
                            validator: (_, value, callback) => {
                                if (!value || value.isEmpty()) {
                                    callback(`请输入${label}`)
                                } else {
                                    callback()
                                }
                            }
                        }]
                    })(
                        <BraftEditor
                            contentStyle={{height: 'auto', minHeight: 370}}
                            style={{border: '1px solid #d9d9d9', borderRadius: '2px'}}
                            controls={controls}
                            placeholder={`请输入${label}`}
                        />
                    )}
                </FormItem>
            )
        }

        const renderFormItemBySelect = () => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={label}
                    key={fieldName}
                >
                    {getFieldDecorator(fieldName, {
                        initialValue: options[0].value,
                        rules: [{ required, message: `${label}必须填写` }]
                    })(
                        <Select placeholder={`请选择${label}`} >
                            {
                                options.map(({value, label}) => <Select.Option key={value} value={value}>{label}</Select.Option>)
                            }
                        </Select>
                    )}
                </FormItem>
            )
        }

        if (type === 'text') {
            return renderFormItemByText()
        } else if( type === 'richtext') {
            return renderFormItemByRichText()
        } else if ( type === 'select') {
            return renderFormItemBySelect()
        }
        return null
    }
    render () {
        const { fields } = this.state

        return (
            <Form style={{paddingTop: 30}} onSubmit={this.handleSubmit}>
                {fields.map((field) => this.renderFormItem(field))}
                <FormItem
                    wrapperCol={{ offset: 5 }}
                >
                    <Button htmlType={'submit'}>发送</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(Save)