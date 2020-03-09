import React, { Component } from 'react'
import {Button, Form,Modal,message,Upload,Icon } from 'antd'
import Ajax from '../../utils/axios.js'
import XLSX from 'xlsx'

const Dragger = Upload.Dragger

/*
插件说明：
version：1.0

实例：<UploadDownloadBtns config={uploadDownloadBtnsConfig} onUpload={this.onUpload} />

config: 配置列表。

配置说明：const uploadDownloadBtnsConfig = {
                download: {
                    url : 'http://f.localhome.cn/static/bu_template_import.xlsx'
                },
                upload: {
                    url : '/old/bu/batch-import',
                    type: 'obj',  // arr: 单页，obj: 多页
                    postData : [{
                        name: 'sheet1s',
                        '项目编码' : 'houseNo',
                        '更新后的BU' : 'buName',
                        'bu code': 'buCode'
                    }, {
                        name: 'sheet2s',
                        'BU名称' : 'buName',
                        'bu code' : 'buCode',
                        'opsid': 'opsid'
                    }]
                }
            }
*/

class UploadDownloadBtns extends Component {
    constructor (props){
        super(props)
        this.state = {
            uploadModal : false
        }
        this.beforeUpload = this.beforeUpload.bind(this)
        this.uploadModalCancel = this.uploadModalCancel.bind(this)
    }
    componentDidMount () {
        let setData = {}
        for(let i in this.props.config.items){
            setData[i.key] = i.defaultValue
        }
        this.props.form.setFieldsValue(setData)
    }
    getDownloadBtn () {
        let self = this
        if(this.props.config.download){
            return <Button className="ml10" type="primary" onClick={function () {window.location.href = self.props.config.download.url }} >模版下载</Button>
        }else{
            return ''
        }
    }
    uploadConfig2value (key, i) {
        if (this.props.config.upload.type === 'arr') {
            return this.props.config.upload.postData[key]
        } else {
            return this.props.config.upload.postData[i][key]
        }
    }
    beforeUpload (file) {
        let self = this
        if(file === null){
            message.error('请选择上传文件')
        }else {
            let reader = new FileReader()
            reader.onload = async function (e) {
                let data = e.target.result
                let wb = XLSX.read(data, { type: 'binary' })
                let res, info
                let upload = self.props.config.upload
                if (upload.type === 'arr') {
                    info = []
                    res = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                    res.map(item => {
                        let obj = {}
                        for (var key in item) {
                            if (self.uploadConfig2value(key)) {
                                let value = item[key].replace(/[\r\n]/g, "")
                                obj[self.uploadConfig2value(key)] = value
                            }
                        }
                        info.push(obj)
                        return false
                    })
                } else {
                    info = {}
                    for (let i = 0; i < wb.SheetNames.length; i++) {
                        res = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]])
                        info[upload.postData[i].name] = []
                        res.map(item => {
                            let obj = {}
                            for (var key in item) {
                                if (self.uploadConfig2value(key, i)) {
                                    let value = item[key].replace(/[\r\n]/g, "")
                                    obj[self.uploadConfig2value(key, i)] = value
                                }
                            }
                            info[upload.postData[i].name].push(obj)
                            return false
                        })
                    }
                }
                self.postData(info)
            }
            reader.readAsBinaryString(file)
        }
        return false
    }
    postData (info) {
        let self = this
        Ajax.post(this.props.config.upload.url, info).then((data)=>{
            message.success('上传文件成功')
            self.setState({ uploadModal : false })
            if(self.props.config.upload.needMsg){
                Modal.success({
                    title: '操作信息',
                    content: data
                })
                self.props.onUpload && self.props.onUpload()
            }
        }).catch((data) => {
            message.error('上传文件失败')
        })
    }
    getUploadBtn () {
        let self = this
        if(this.props.config.upload){
            return (
                <Button className="ml10" type="primary" onClick={function () { self.setState({ uploadModal : true }) }} >批量上传</Button>
            )
        }else{
            return ''
        }
    }
    uploadModalCancel () {
        this.setState({ uploadModal : false })
    }
    getUploadModal () {
        if(this.props.config.upload){
            return (
                <Modal
                    title="上传"
                    visible={this.state.uploadModal}
                    footer={null}
                    onCancel={this.uploadModalCancel}
                    destroyOnClose
                >
                    <Dragger
                        name = "file"
                        action = "//jsonplaceholder.typicode.com/posts/"
                        beforeUpload = {this.beforeUpload}
                    >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或者拖放excel文件到框里上传</p>
                    </Dragger>
                </Modal>
            )
        }else{
            return ''
        }
    }
    render () {
        return (
            <span>
                {this.getDownloadBtn()}
                {this.getUploadBtn()}
                {this.getUploadModal()}
            </span>
        )
    }
}
export default Form.create()(UploadDownloadBtns)