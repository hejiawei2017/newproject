import React, { Component } from 'react'
import {message,Modal} from 'antd';
import MyUpload from '../../components/upload'
import { uploadImportService } from '../../services'
import {createUUID,envConfig} from '../../utils/utils'



const uploadConfig = {
    upload : {
        action: uploadImportService.action,
        uploadType: 'file'
    }
}

class UploadImport extends Component {
    handleUpload = (data,fun) => {
        uploadImportService.upload(data.file,createUUID('xxxxxxxxxxxxxxxx',10)).then((data) => {
            fun && fun()
            message.success('上传成功')
            Modal.success({
                title: '请复制记录好URL',
                content: envConfig.newImagePrefix + data.filePath
            });
        }).catch(() => {
            fun && fun()
            message.error('上传失败')
        })
    }
    render () {
        return (
            <MyUpload onUpload={this.handleUpload} config={uploadConfig} />
        )
    }
}

export default UploadImport