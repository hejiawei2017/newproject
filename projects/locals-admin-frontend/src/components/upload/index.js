import React, { Component } from 'react'
import { Upload, Icon, Form, Button, Input, message} from 'antd';


const FormItem = Form.Item
const Dragger = Upload.Dragger


/*
插件说明：
version：1.0

实例： <MyUpload onDownload={this.handleDownload} onUpload={this.handleUpload} config={uploadConfig} />

onDownload: 下载回调方法
onUpload: 上传回调方法
config: 配置列表。

配置说明：const uploadConfig = {
    upload : {
        action: houseResourceImport.uploadUrl //上传url配置
        limitType: 'application/pdf'   // upload 组件返回的 file.type
        format: 'pdf'     // 文件格式提示
    }
}
*/

class UploadForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            fileList: [],
            uploading: false
        }
    }
    componentDidMount () {
        let setData = {}
        for(let i in this.props.config.items){
            setData[i.key] = i.defaultValue
        }
        this.props.form.setFieldsValue(setData)
    }
    handleSearch = (e) => {
        e.preventDefault()
        let self = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {}
                for(var i in values){
                    data[i] = {
                        value : values[i],
                        type : this.getType(i)
                    }
                }
                self.props.onSubmit(data)
            }
        })
    }
    getType = (item) => {
        for (let n = 0 ; n < this.props.config.items.length ; n++) {
            if(this.props.config.items[n].key === item){
                return this.props.config.items[n].searchFilterType
            }
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        let self = this

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {}
                for(var i in values){
                    data[i] = {
                        value : values[i],
                        type : this.getType(i)
                    }
                }
                if(self.state.fileList.length === 0){
                    message.error('上传文件不能为空')
                }else{
                    self.setState({uploading: true })
                    let param = {}
                    if(this.props.config.upload.uploadType && this.props.config.upload.uploadType === "file"){
                        param = {
                            ...data,
                            file:self.state.fileList[0]
                        }
                    }else{
                        param = {
                            ...data,
                            fileBase64:self.state.fileList[0].fileBase64
                        }
                    }
                    self.props.onUpload (param , function (){
                        self.setState({ uploading: false })
                    })
                }
            }
        })
    }
    getChildren () {
        if(this.props.config.items && this.props.config.items.length > 0){
            const { getFieldDecorator } = this.props.form
            const children = []
            for (let i = 0; i < this.props.config.items.length; i++) {
                children.push(
                    <FormItem label={this.props.config.items[i].name} key={this.props.config.items[i].key}>
                        {getFieldDecorator(this.props.config.items[i].key, {
                            rules : this.props.config.items[i].rules ? this.props.config.items[i].rules : ''
                        })(
                            this.getInputType(this.props.config.items[i])
                        )}
                    </FormItem>
                )
            }
            return children
        }else{
            return []
        }
    }
    getInputType (item){
        let _attr = {
            ...item.extendAttr,
            type : item.searchFilterType,
            placeholder : item.placeholder,
            onChange : item.fun
        }

        return <Input {..._attr} />
    }
    renderDownload (){
        if(this.props.onDownload){
            return (<Button className = "upload-demo-start mr10" onClick = {this.props.onDownload} >
            下载模板
            </Button>)
        }else{
            return ''
        }
    }
    render () {
        let config = {
            name: 'file',
            action: this.props.config.upload.action.toString(),
            beforeUpload: (file) => {
                if (this.props.config.upload.limitType) {
                    if (file.type !== this.props.config.upload.limitType) {
                        message.error(`请选择${this.props.config.upload.format}格式文件！`)
                        return
                    }
                }
                if (file) {
                    if(this.props.config.upload.uploadType && this.props.config.upload.uploadType === "file"){
                        this.setState({fileList:[file]})
                    }else{
                        let reader = new FileReader()
                        let oldFileUrl = this.state.fileList.length > 0 ? this.state.fileList[0] : []//上一次上传图片的base64
                        reader.onloadstart = () => {
                            this.setState({fileList:[]})
                        }
                        reader.onload = () => {
                            file.fileBase64 = reader.result;
                            this.setState({fileList:[file]})
                        }
                        reader.onerror = () => {
                            this.setState({fileList:oldFileUrl})
                        }
                        reader.readAsDataURL(file)
                    }
                }
                return false;
            },
            onRemove: (file) => {
                this.setState({fileList:[]})
            }
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <div className="maxW1000px m0Auto">
                    {this.getChildren()}
                    <Dragger {...config} className="mb10" fileList = {this.state.fileList}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或者拖动{this.props.config.upload.limitType && this.props.config.upload.limitType.split('/')[1]}文件到该区域</p>
                    </Dragger>
                    <div className="mt10">
                        { this.renderDownload() }
                        <Button
                            className="upload-demo-start"
                            type="primary"
                            htmlType="submit"
                            // disabled={this.state.fileList.length === 0}
                            loading={this.state.uploading}
                        >
                            {this.state.uploading ? '正在上传' : '提交上传' }
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }
}
export default Form.create()(UploadForm)