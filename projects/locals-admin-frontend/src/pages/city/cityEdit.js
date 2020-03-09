import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {cityService} from '../../services'
import { Icon, Button, Input,InputNumber, Form, Card, Upload, Row, Col, message } from 'antd'
import {getNewImagePrefix,createUUID} from '../../utils/utils'
import dataURItoBlob from '../../utils/dataURItoBlob';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './index.less'
const FormItem = Form.Item

class cityEdit extends Component {
    constructor (){
        super()
        this.state = {
            name: "",
            code: "",
            parentCode: "",
            fullPinYin: "",
            fullWordFirstLetterPinYin: "",
            firstWordFirstLetterPinYin: "",
            heat: "",
            chosen: "",
            description: "",
            imageBase64: "",
            updateSrc: "",
            submitLoading: false
        }
    }
    componentWillMount () {
        const id = this.props.match.params.id
        if(id > 0)this.setState({id},() => this.getChinaAreasInfo(id))
    }
    stateChange (obj){
        this.setState(obj)
    }
    getChinaAreasInfo (id){
        cityService.getChinaAreasInfo(id).then((data) => {
            const {name, code, parentCode, fullPinYin, fullWordFirstLetterPinYin, firstWordFirstLetterPinYin, heat, chosen, description, image} = data
            this.setState({
                name,
                code,
                parentCode,
                fullPinYin,
                fullWordFirstLetterPinYin,
                firstWordFirstLetterPinYin,
                heat,
                chosen,
                description,
                imageBase64: image,
                updateSrc: image
            })
        })
    }
    uploadImg (file,id) {
        // 提交图片
        return cityService.imgUpload(dataURItoBlob(file), id).then(data=>{
            return {
                imagePath: data.filePath
            }
        })
    }
    async bannerSave (){
        // 保存
        const _this = this
        const {id, name, code, parentCode, fullPinYin, fullWordFirstLetterPinYin, firstWordFirstLetterPinYin, heat, chosen, description, updateSrc, imageBase64} = this.state
        const uuid = createUUID('xxxxxxxxxxxxxxxx',10)
        const params = {
            name,
            code,
            parentCode,
            fullPinYin,
            fullWordFirstLetterPinYin,
            firstWordFirstLetterPinYin,
            heat,
            chosen,
            description
        }
        if(imageBase64 && imageBase64.length > 0){
            if(imageBase64.includes("data:image/")){
                await this.uploadImg(imageBase64,(id || uuid)).then(e =>{
                    params.image = e.imagePath
                })
            }else{
                params.image = imageBase64
            }
        }else if(updateSrc && updateSrc.length > 0){
            if(updateSrc.includes("data:image/")){
                await this.uploadImg(updateSrc,(id || uuid)).then(e =>{
                    params.image = e.imagePath
                })
            }else{
                params.image = updateSrc
            }
        }
        if(id > 0){
            cityService.putChinaAreasInfo({...params,id}).then((e)=>{
                message.success("保存成功")
                _this.props.history.push("/application/cityList")
            }).catch(()=>{
                this.setState({
                    submitLoading:false
                })
            })
        }else{
            cityService.addChinaAreas(params).then((e)=>{
                message.success("保存成功")
                _this.props.history.push("/application/cityList")
            }).catch(()=>{
                this.setState({
                    submitLoading:false
                })
            })
        }
    }
    goList = () => {
        this.props.history.push("/application/cityList")
    }
    _crop = () =>{
        if (typeof this.cropper.getCroppedCanvas() === 'undefined' || this.cropper.getCroppedCanvas() === null || (!(this.state.updateSrc && this.state.updateSrc.length > 0))) {
            return false
        }
        this.setState({
            imageBase64: this.cropper.getCroppedCanvas().toDataURL()
        })
    }
    handleSubmit = (e) =>{
        // 表单提交
        e.preventDefault()
        const _this = this
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                _this.setState({
                    submitLoading: true,
                    name: values.name,
                    code: values.code,
                    parentCode: values.parentCode,
                    fullPinYin: values.fullPinYin,
                    fullWordFirstLetterPinYin: values.fullWordFirstLetterPinYin,
                    firstWordFirstLetterPinYin: values.firstWordFirstLetterPinYin,
                    heat: values.heat,
                    chosen: values.chosen,
                    description: values.description
                }, ()=>{
                    _this.bannerSave()
                })
            }
        })
    }
    render () {
        const _this = this
        const { getFieldDecorator } = _this.props.form
        const {name, code, parentCode, fullPinYin, fullWordFirstLetterPinYin, firstWordFirstLetterPinYin, heat, chosen, description, updateSrc, imageBase64, submitLoading} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            }
        }
        const UploadProps = {
            beforeUpload: (file) => {
                this.setState(() => ({
                    fileList: [file]
                }))
                const reader = new FileReader()
                reader.onload = () => {
                    this.setState({ updateSrc: reader.result })
                }
                reader.readAsDataURL(file)
                return false
            },
            showUploadList: false
        }
        return (
            <div className="banner-edit">
                <Form onSubmit={_this.handleSubmit} >
                    <FormItem
                        {...formItemLayout}
                        label="区域名称"
                    >
                        {getFieldDecorator("name", {
                            rules: [{ required: true, message: '请输入区域名称!' }],
                            initialValue: name
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="区域代码"
                    >
                        {getFieldDecorator("code", {
                            rules: [{ required: true, message: '请输入区域代码!' }],
                            initialValue: code
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上级区域代码"
                    >
                        {getFieldDecorator("parentCode", {
                            rules: [{ required: false, message: '请输入上级区域代码!' }],
                            initialValue: parentCode
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="全拼音"
                    >
                        {getFieldDecorator("fullPinYin", {
                            rules: [{ required: true, message: '请输入全拼音!' }],
                            initialValue: fullPinYin
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="拼音首字母"
                    >
                        {getFieldDecorator("fullWordFirstLetterPinYin", {
                            rules: [{ required: true, message: '请输入拼音首字母!' }],
                            initialValue: fullWordFirstLetterPinYin
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="首字母"
                    >
                        {getFieldDecorator("firstWordFirstLetterPinYin", {
                            rules: [{ required: true, message: '请输入首字母!' }],
                            initialValue: firstWordFirstLetterPinYin
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="热门值"
                    >
                        {getFieldDecorator("heat", {
                            rules: [{ required: false, message: '请输入热门值!' }],
                            initialValue: heat
                        })(
                            <InputNumber suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="精选值"
                    >
                        {getFieldDecorator("chosen", {
                            rules: [{ required: false, message: '请输入精选值!' }],
                            initialValue: chosen
                        })(
                            <InputNumber suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator("description", {
                            rules: [{ required: false, message: '请输入描述!' }],
                            initialValue: description
                        })(
                            <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        )}
                    </FormItem>
                    <Card title="广告图片" className="cropper-wrap">
                        <Row>
                            <Col span={10}>
                                <Cropper
                                    ref={function (cropper){
                                        _this.cropper = cropper
                                    }}
                                    className="cropper-bg"
                                    src={getNewImagePrefix(updateSrc)}
                                />
                            </Col>
                            <Col span={4} className="text-center">
                                <Upload {...UploadProps}>
                                    <Button type="primary" size="large">选择图片</Button>
                                </Upload>
                                <p className="mt20"><Button type="primary" size="large" onClick={this._crop}>裁剪</Button></p>
                                {/*<p className="mt20">点击裁剪，新图片才会生效</p>*/}
                            </Col>
                            <Col span={10}>
                                <div className="cropImg">
                                    {imageBase64 ? <img src={getNewImagePrefix(imageBase64)} alt="加载失败..." />
                                        : null}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <FormItem className="mt20 text-right">
                        <Button onClick={this.goList} className="mr20">取消</Button>
                        <Button type="primary" htmlType="submit" loading={submitLoading}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

cityEdit = Form.create()(cityEdit)
export default withRouter(cityEdit)