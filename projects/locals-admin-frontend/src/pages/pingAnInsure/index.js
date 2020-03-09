import React, { Component } from 'react'
import { pingAn } from '../../services'

import { Upload, Icon, Message, Button } from 'antd';

const Dragger = Upload.Dragger;


class PingAnInsure extends Component {
    state = {
        fileList: [],
        file: null,
        uid: null,
        canInsure: false
    };
    downloadSampleExcel = () => {
        window.open('https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/excel/%E6%89%B9%E9%87%8F%E6%8A%95%E4%BF%9D%E3%80%81%E9%80%80%E4%BF%9D%E6%A8%A1%E7%89%88.xlsx');
    }
    handleUpload = data => {
        let { file } = data;
        let { uid } = file;

        this.setState({ file, uid });
        this.setState({ fileList: [file]});
    }
    confirmUpload = () => {
        let { file, uid } = this.state;
        pingAn.upload(file, uid).then(data => {
            let { paWriteOffFailedInfoShow, paWriteOffResultList } = data;
            if(data !== null){
                if (paWriteOffFailedInfoShow) {
                    Message.warning(JSON.stringify(paWriteOffResultList), 10);
                }else {
                    Message.success('上传成功')
                }
                this.setState({ canInsure: true });
            }
        }).catch(err => {
            console.log('err:', err);
            Message.error('上传失败')
        })
    }
    handleInsure = () => {
        pingAn.insure().then(res => {
            console.log('res:',res);
            Message.success('投保成功');
        }).catch(err => {
            console.log('err:',err);
            Message.success('投保失败');
        })
    }

    render () {
        const { fileList, canInsure } = this.state;
        const canConfirmUpload = fileList.length === 1 ? true : false;

        const props = {
            fileList: fileList,
            customRequest: this.handleUpload
        };
        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖动文件到该区域</p>
                    {/* <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
                </Dragger>
                <Button className="mt20 mr20" onClick={this.downloadSampleExcel}>下载模板</Button>
                <Button className="mt20 mr20" type="primary" disabled={!canConfirmUpload} onClick={this.confirmUpload}>上传文件</Button>
                <Button className="mt20" type="primary" disabled={!canInsure} onClick={this.handleInsure}>确定投保</Button>
            </div>
        )
    }
}

export default PingAnInsure