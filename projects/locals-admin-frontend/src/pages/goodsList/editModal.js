import React, { Component } from 'react'
import { Input, Modal, Form, Radio } from 'antd'
import PropTypes from 'prop-types';
import SearchSelectSeller from '../goodsSellerList/searchSelectSeller'
import {message} from "antd/lib/index"
import Global from '../../utils/Global.js'
import UploadImage from '../../components/uploadImage'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class EditModal extends Component {
    static propTypes = {
        labelModalSave: PropTypes.func,
        handleSubmit: PropTypes.func,
        stateChange: PropTypes.func,
        formParams: PropTypes.object,
        editModalVisible: PropTypes.bool,
        editType: PropTypes.string
    }
    constructor (props) {
        super(props)
        this.state = {
            formParams : props.formParams,
            userInfo: Global.userInfo || {
                username: ''
            },
            goodsImageList: props.formParams.goodsImageList
        }
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        this.setState({formParams: nextProps.formParams})
    }
    handleCancel () {
        this.props.stateChange({editModalVisible: false})
    }
    //获取供应商信息
    receiveSellerInfo = (obj) => {
        console.log(JSON.stringify(obj));
        let params = this.state.formParams;
        params.supplierId = obj === null ? '' : obj.id;
        this.props.form.setFieldsValue({
            supplierId: params.supplierId
        })
        this.setState({
            formParams: params
        })
    }
    onChangeStickType = (e) => {
        let params = this.state.formParams;
        params.stickType = e.target.value;
        this.setState({
            formParams: params
        })
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
        return (
            <Modal
                visible={this.props.editModalVisible}
                title={this.props.editType === 'add' ? '新增商品信息' : '修改商品信息'}
                width={600}
                onOk={function () {
                    that.props.form.validateFields((err, values) => {
                        if (!err) {
                            let data = values
                            if(Number(data.supplierPrice) > Number(data.retailPrice)){
                                message.warning('实际售价不可小于供应价！')
                                return
                            }

                            if (that.props.editType === 'edit') {
                                data['id'] = that.state.formParams.id
                                data['inventory'] = that.state.formParams.inventory
                                data['goodsStatus'] = that.state.formParams.goodsStatus
                                data['updator'] = that.state.userInfo.username
                            }
                            that.props.handleSubmit(data)
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
                        label="商品名称"
                    >
                        {getFieldDecorator('title', {
                            initialValue: this.state.formParams.title,
                            rules: [{ required: true, message: '商品名称不能为空' },{ max: 30, message: '最多可输入30个字符' }]
                        })(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="供应价"
                    >
                        {getFieldDecorator('supplierPrice', {
                            initialValue: this.state.formParams.supplierPrice,
                            rules:
                                [
                                    { required: true, message: '价格不能为空' },
                                    { validator (rule, value, callback) {
                                        if(value == null){
                                            callback()
                                            return
                                        }else if(value.length > 8) {
                                            callback('价格不可大于8位数');
                                        }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                            callback('价格输入有误');
                                        }else{
                                            callback()
                                        }
                                    }}
                                ]
                        })(
                            <Input type="number" addonAfter="元" placeholder="请输入供应价" />

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="实际售价"
                    >
                        {getFieldDecorator('retailPrice', {
                            initialValue: this.state.formParams.retailPrice,
                            rules:
                                [
                                    { required: true, message: '价格不能为空' },
                                    { validator (rule, value, callback) {
                                        if(value == null){
                                            callback()
                                            return
                                        }else if(value.length > 8) {
                                            callback('价格不可大于8位数');
                                        }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                            callback('价格输入有误');
                                        }else{
                                            callback()
                                        }
                                    }}
                                ]
                        })(
                            <Input addonAfter="元" placeholder="请输入实际售价" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="原价"
                    >
                        {getFieldDecorator('orginalPrice', {
                            initialValue: this.state.formParams.orginalPrice,
                            rules:
                                [
                                    { required: true, message: '价格不能为空' },
                                    { validator (rule, value, callback) {
                                        if(value == null){
                                            callback()
                                            return
                                        }else if(value.length > 8) {
                                            callback('价格不可大于8位数');
                                        }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                            callback('价格输入有误');
                                        }else{
                                            callback()
                                        }
                                    }}
                                ]
                        })(
                            <Input addonAfter="元" placeholder="请输入原价" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="供应商"
                    >
                        {getFieldDecorator('supplierId', {
                            initialValue: this.state.formParams.supplierId,
                            rules: [{ required: true, message: '供应商不能为空' }]
                        })(
                            <SearchSelectSeller
                                supplierId={this.state.formParams.supplierId ? this.state.formParams.supplierId : ''}
                                getSellerInfo={this.receiveSellerInfo}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="标识"
                    >
                        {getFieldDecorator('stickType', {
                            initialValue: this.state.formParams.stickType,
                            rules: [{ required: true, message: '标识必选' }]
                        })(
                            <RadioGroup onChange={this.onChangeStickType}>
                                <Radio value={0}>无</Radio>
                                <Radio value={11}>new</Radio>
                                <Radio value={22}>hot</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="商品图片"
                    >
                        {getFieldDecorator('pictureUrl', {
                            initialValue: this.state.formParams.pictureUrl,
                            rules: [{ required: true, message: '图片链接不能为空' }]
                        })(
                            <UploadImage
                                key="pictureUrl"
                                imageUrlList={this.state.goodsImageList}
                                pathFile="goods/"
                                imageLength={1}
                                getImageInfo={function (fileList, operateType) {
                                    if(operateType === 'delete') {
                                        that.setState({
                                            goodsImageList: []
                                        })
                                    }else if(operateType === 'add') {
                                        that.setState({
                                            goodsImageList: fileList
                                        })
                                    }
                                    that.props.form.setFieldsValue({
                                        pictureUrl: fileList.length > 0 ? fileList[0].url : ''
                                    })
                                }}
                            />
                        )}
                    </FormItem>
                    {/*<FormItem
                        {...formItemLayout}
                        label="商品详情图片"
                    >
                        {getFieldDecorator('detailUrlList', {
                            initialValue: this.state.formParams.detailUrlList,
                            rules: [{ required: true, type: 'array', message: '图片链接不能为空' },
                                {
                                validator (rule, value, callback) {
                                    if(value === '' || value == null){
                                        callback()
                                        return
                                    }else if(value.length === 0) {
                                        callback('请上传图片');
                                    }else{
                                        callback()
                                    }
                                }
                            }]
                        })(
                            <UploadImage
                                pathFile="goods/"
                                imageUrlList={that.state.formParams.detailUrlList}
                                imageLength={10}
                                getImageInfo={function (fileList,operateType, operateIndex) {
                                let formParams = that.state.formParams;
                                let detailUrlList = [];
                                if(that.props.editType === 'add') {
                                    detailUrlList = fileList;
                                }else {//修改
                                    detailUrlList = that.state.formParams;
                                    if(operateType === 'add') {
                                        detailUrlList = formParams.detailUrlList;
                                        detailUrlList.push(fileList[operateIndex]);
                                        formParams.detailUrlList = detailUrlList;

                                    }else if(operateType === 'delete') {
                                        detailUrlList = formParams.detailUrlList;
                                        detailUrlList.splice(operateIndex, 1);
                                        formParams.detailUrlList = detailUrlList;
                                    }
                                }
                                that.setState({
                                    formParams
                                });
                                that.props.form.setFieldsValue({
                                    detailUrlList: detailUrlList
                                });
                            }}
                            />
                        )}
                    </FormItem>*/}
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal
