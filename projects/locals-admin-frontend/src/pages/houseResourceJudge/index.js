import React, { Component } from 'react'
import {message} from 'antd';
import MyUpload from '../../components/upload'
import { houseResourceJudge } from '../../services'

const uploadConfig = {
    upload : {
        action: houseResourceJudge.uploadUrl
    },
    items: [
        {
            type: 'text',
            name: '邮箱名称',
            key: 'email',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入邮箱',
            rules: [{ required: true, message: '请输入邮箱' }]
        }
    ]
}

class HouseResourceJudge extends Component {
    handleUpload = (data,fun) => {
        let param = {
            email: data.email.value,
            fileBase64: data.fileBase64
        }
        houseResourceJudge.upload(param).then((data) => {
            fun && fun()
            message.success('上传成功')
        }).catch(() => {
            fun && fun()
            message.error('上传失败')
        })
    }
    handleDownload = () => {
        window.location.href = houseResourceJudge.download()
    }
    render () {
        return (
            <div>
                <MyUpload onDownload={this.handleDownload} onUpload={this.handleUpload} config={uploadConfig} />
            </div>
        )
    }
}

export default HouseResourceJudge
