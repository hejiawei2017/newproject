import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Select, message, Alert } from 'antd'
import { searchingWeixinTemplateList, searchWeixinTemplateListSuccess } from '../../actions/weixinTemplateList'
import { weixinTemplateMessageService } from '../../services'
import DetailList from './detailList'

const mapStateToProps = (state, action) => {
    return {
        weixinTemplateList: state.weixinTemplateList
    }
}

const Option = Select.Option
class addModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataList: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getWeixinTemplates = this.getWeixinTemplates.bind(this)
        this.selectTemplateId = this.selectTemplateId.bind(this)
    }
    componentDidMount () {
        if (!this.props.weixinTemplateList.length) {
            this.props.dispatch(searchingWeixinTemplateList(this.props.weixinTemplateList))
            weixinTemplateMessageService.getWeixinTemplates().then((data) => {
                this.props.dispatch(searchWeixinTemplateListSuccess(data))
            }).catch((e) => {
                this.props.dispatch(searchingWeixinTemplateList(this.props.weixinTemplateList))
            })
        }
    }
    selectTemplateId (value) {
        const form = this.props.form
        const weixinTemplateList = this.props.weixinTemplateList
        let title = value
        let selectedTemplate = null
        for ( let i in weixinTemplateList) {
            if (weixinTemplateList[i].title === title) {
                selectedTemplate = weixinTemplateList[i]
                break
            }
        }
        if (selectedTemplate) {
            form.setFieldsValue({
                templateId: selectedTemplate.templateId,
                primaryIndustry: selectedTemplate.primaryIndustry,
                deputyIndustry: selectedTemplate.deputyIndustry,
                content: selectedTemplate.content,
                example: selectedTemplate.example
            })
        }
    }
    handleSubmit (e) {
        e.preventDefault()
        const form = this.props.form
        const { getFieldValue } = form
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = {
                    templateId: getFieldValue('templateId'),
                    content: getFieldValue('content'),
                    deputyIndustry: getFieldValue('deputyIndustry'),
                    primaryIndustry: getFieldValue('primaryIndustry'),
                    example: getFieldValue('example'),
                    title: getFieldValue('title'),
                    url: getFieldValue('url')
                }
                let keys = getFieldValue('keys')
                let templateDataList = []
                templateDataList = keys.map( v => {
                    let name = getFieldValue(`template-title-${v}`)
                    let content = getFieldValue(`template-content-${v}`)
                    let color = getFieldValue(`template-color-${v}`)
                    return {name, content, color}
                })
                params.templateDataList = templateDataList
                this.props.addTemplateMessage(params)
            }
        })
    }
    getWeixinTemplates () {
        weixinTemplateMessageService.getWeixinTemplates().then(data => {
            this.setState({
                weixinTemplates: data
            })
        }).catch(e => {
            message.error('无法获取微信模板')
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        const FormItem = Form.Item
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
        }
        const dataListLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }
        const props = this.props
        let weixinTemplateList = []
        for (let k in props.weixinTemplateList) {
            weixinTemplateList[k] = props.weixinTemplateList[k]
        }
        return (
            <Modal
                title={props.title}
                visible={props.visible}
                onCancel={props.toggleModal}
                onOk={this.handleSubmit}
                okText="提交"
                cancelText="关闭"
                destroyOnClose="true"
            >
                <Form>
                    <Alert message="模板消息不允许出现红包、优惠券等违反微信规定等内容，如若违反，后果自负！" type="error" />
                    <FormItem
                        {...formItemLayout}
                        label="模板标题"
                    >
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: '请选择模板!'
                            }]
                        })(
                            <Select onChange={this.selectTemplateId}>
                                {weixinTemplateList.map( v => (
                                    <Option key={v.templateId} value={v.title}>{v.title}</Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="跳转链接"
                    >
                        {getFieldDecorator('url')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模板ID"
                    >
                        {getFieldDecorator('templateId')(
                            <Input disabled />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="一级行业"
                    >
                        {getFieldDecorator('primaryIndustry')(
                            <Input disabled />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="二级行业"
                    >
                        {getFieldDecorator('deputyIndustry')(
                            <Input disabled />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模板内容"
                    >
                        {getFieldDecorator('content')(
                            <Input.TextArea rows={3} cols={10} disabled />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模板示例"
                    >
                        {getFieldDecorator('example')(
                            <Input.TextArea rows={3} cols={10} disabled />
                        )}
                    </FormItem>
                    <FormItem
                        {...dataListLayout}
                        label="详情内容"
                    >
                        {getFieldDecorator('list')(
                            <DetailList form={this.props.form} emitDetailList={this.emitDetailList} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

addModal = Form.create()(addModal)
addModal = connect(mapStateToProps)(addModal)
export default addModal