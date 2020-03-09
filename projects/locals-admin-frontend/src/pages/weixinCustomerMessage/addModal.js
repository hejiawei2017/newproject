import React, { Component } from 'react'
import { Modal, Form, Input, Radio } from 'antd'
import { dicModel } from '../../utils/dictionary'

class addModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isSelectedText: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount () {
        this.props.form.setFieldsValue({type: 'text'})
    }
    handleChange ({ target }) {
        var isSelectedText = target.value.toLowerCase() === 'text'
        this.setState({
            isSelectedText: isSelectedText ? true : false
        })
    }
    handleSubmit (e) {
        e.preventDefault()
        const form = this.props.form
        const { getFieldValue } = form
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = {
                    type: getFieldValue('type').toUpperCase(),
                    content: getFieldValue('content')
                }
                if (!this.state.isSelectedText) {
                    params = {
                        ...params,
                        title: getFieldValue('title'),
                        description: getFieldValue('description'),
                        picUrl: getFieldValue('picUrl'),
                        linkUrl: getFieldValue('linkUrl')
                    }
                }
                this.props.addReplys(params)
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        const FormItem = Form.Item
        const RadioGroup = Radio.Group
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
        }
        const props = this.props
        const hidden = {
            display: this.state.isSelectedText ? 'none' : 'block'
        }
        return (
            <Modal
                {...dicModel}
                title={props.title}
                visible={props.visible}
                onCancel={props.closeModal}
                onOk={this.handleSubmit}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: '请输入名称!'
                            }, {
                                whitespace: true,
                                message: '不能为空!'
                            }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                    >
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true,
                                message: '请选择类型!'
                            }]
                        })(
                            <RadioGroup
                                onChange={this.handleChange}
                            >
                                <Radio value="text">文本</Radio>
                                <Radio value="article">图文</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容"
                    >
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true,
                                message: '请输入内容!'
                            }, {
                                whitespace: true,
                                message: '不能为空!'
                            }]
                        })(
                            <Input.TextArea rows={3} cols={10} />
                        )}
                    </FormItem>
                    <section style={hidden}>
                        <FormItem
                            {...formItemLayout}
                            label="图片链接"
                        >
                            {getFieldDecorator('picUrl')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="跳转链接"
                        >
                            {getFieldDecorator('linkUrl')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                        >
                            {getFieldDecorator('title')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('description')(
                                <Input />
                            )}
                        </FormItem>
                    </section>
                </Form>
            </Modal>
        )
    }
}

addModal = Form.create()(addModal)

export default addModal