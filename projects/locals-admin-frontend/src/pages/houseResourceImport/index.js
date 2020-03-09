import React, { Component } from 'react'
import {message} from 'antd';
import MyUpload from '../../components/upload'
import { houseResourceImport } from '../../services'

const uploadConfig = {
    upload : {
        action: houseResourceImport.uploadUrl
    }
}

class HouseResourceImport extends Component {
    handleUpload = (data,fun) => {
        let param = {
            fileBase64: data.fileBase64
        }
        houseResourceImport.upload(param).then((data) => {
            fun && fun()
            message.success('上传成功')
        }).catch(() => {
            fun && fun()
            message.error('上传失败')
        })
    }
    handleDownload = () => {
        window.location.href = houseResourceImport.download()
    }
    render () {
        return (
            <MyUpload onDownload={this.handleDownload} onUpload={this.handleUpload} config={uploadConfig} />
        )
    }
}

export default HouseResourceImport
