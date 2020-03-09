import React, { Component } from 'react'
import { Input, Modal, Form } from 'antd'
import {message,Select} from 'antd/lib/index'
import {facilityDictionaryService} from "../../services"
import { facilityCategory } from "../../utils/dictionary"
import {formatSelectOption, createUUID, envConfig} from "../../utils/utils"
import UploadImage from '../../components/uploadImage'
const FormItem = Form.Item
const Option = Select.Option

class EditModal extends Component {

    constructor (props) {
        super(props)
        let arr = []
        if(props.formParams.otherValue !== null && props.formParams.otherValue !== ''){
            let image = {
                uid: createUUID('xxxxxxxxxxxxxxxx',10),
                url: props.formParams.otherValue
            }
            arr.push(image)
        }
        this.state = {
            formParams : props.formParams,
            imageUrlList: arr
        }
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.formParams.otherValue !== null && nextProps.formParams.otherValue !== ''){
            let arr = []
            let image = {
                uid: createUUID('xxxxxxxxxxxxxxxx',10),
                url: nextProps.formParams.otherValue
            }
            arr.push(image)
            this.setState({
                formParams: nextProps.formParams,
                imageUrlList: arr
            });
        }
    }
    handleCancel () {
        this.props.stateChange({editModalVisible: false})
    }
    render () {
        let that = this
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }
        let opsData = formatSelectOption(facilityCategory)
        const ops = opsData.map((item,index) => {
            return(
                <Option key={index} value={item.value}>{item.text}</Option>
            )
        })
        return (
            <Modal
                visible={this.props.editModalVisible}
                title={this.props.editType === 'add' ? '新增设施' : '修改设施'}
                onOk={function () {
                    that.props.form.validateFields((err, values) => {
                        if (!err) {
                            let data = values
                            data['categoryName'] = that.state.formParams.categoryName
                            if (that.props.editType === 'add') {
                                facilityDictionaryService.add(data).then((e) => {
                                    message.success('添加成功！')
                                    that.props.handleSubmit()
                                })
                            } else {
                                data['id'] = that.state.formParams.id
                                data['code'] = that.state.formParams.code
                                facilityDictionaryService.update(data).then((e) => {
                                    message.success('修改成功！')
                                    that.props.handleSubmit()
                                })
                            }
                        }
                    })
                }}
                onCancel={this.handleCancel}
                cancelText="关闭"
                okText="保存"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="设施分类"
                    >
                        {getFieldDecorator('categoryCode', {
                            initialValue: this.state.formParams.categoryCode,
                            rules: [{ required: true, message: '请选择设施分类' }]
                        })(
                            <Select placeholder="请选择设施分类" onChange={function (e,k) {
                                let formParams = that.state.formParams
                                formParams.categoryName = k.props.children
                                that.setState({
                                    formParams
                                })
                            }}
                            >
                                {ops}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设施名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: this.state.formParams.name,
                            rules: [{ required: true, message: '设施名称不能为空' }]
                        })(
                            <Input placeholder="请输入设施名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator('description', {
                            initialValue: this.state.formParams.description
                        })(
                            <Input placeholder="请输入描述" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            initialValue: this.state.formParams.remark
                        })(
                            <Input placeholder="请输入备注" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="图标"
                    >
                        {getFieldDecorator('otherValue', {
                            initialValue: this.state.formParams.otherValue,
                            rules: [{ required: true, message: '图标不能为空' }]
                        })(
                            <UploadImage imageUrlList={this.state.imageUrlList} imageLength={1} getImageInfo={function (fileList) {
                                console.log(fileList)
                                let url = ''
                                if(fileList.length > 0) {
                                    url = fileList[0].url
                                    that.props.form.setFieldsValue({
                                        otherValue: url
                                    })
                                }else{
                                    that.state.formParams.otherValue = ""
                                    that.setState({
                                        imageUrlList: [],
                                        formParams: that.state.formParams
                                    })
                                }
                            }}
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)

export default EditModal