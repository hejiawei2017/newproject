import { Upload, Icon, Modal, Message, Button } from 'antd'
import React, { Component } from 'react'
import { createUUID, envConfig } from '../../utils/utils'
import { uploadImportService } from '../../services'
import './index.less'

class PicturesWall extends React.Component {
    state = {
        disabled: false,
        previewVisible: false,
        previewImage: '',
        fileList: []
    };

    componentDidMount () {
        this.initFileList();

        this.setState({ disabled: this.props.disabled });
    }
    initFileList () {
        let { imgs } = this.props;
        if(!imgs) return;
        let dataset = imgs.split(',').filter(i => Boolean(i));
        if(!dataset.length) {
            return;
        }
        let fileList = dataset.map(i => {
            return {
                uid: createUUID('xxxxxxxxxxxxxxxx', 10),
                name: 'default_name',
                status: 'done',
                url: i
            }
        })
        this.setState({ fileList });
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        // if (this.state.disabled) return;

        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }
    handleChange = ({ fileList }) => {
        if (this.state.disabled) return;

        this.setState({ fileList });
        let urls = fileList.map(i => i.url).join(',');
        this.props.uploadCallBack(urls);
    }

    handleUpload = data => {
        if (this.state.disabled) return;

        const oldFileList = this.state.fileList;
        const { uid, type, name } = data.file;

        uploadImportService.upload(data.file, uid).then(res => {
            let url = envConfig.newImagePrefix + res.filePath;
            let file = {
                uid,
                name,
                status: 'done',
                url
            }
            let newFileList = oldFileList.concat(file);
            this.setState({ fileList: [...newFileList]});

            let urls = newFileList.map(i => i.url).join(',');
            this.props.uploadCallBack(urls);
            Message.success('上传成功');
        }).catch(() => {
            Message.error('上传失败')
        })
    }
    handleBeforeUpload = (file, fileList) => {
        return new Promise((resolve, reject) => {
            let { type } = file;
            if (!type.includes('png')) {
                reject();
                Message.error('图片格式只能是png');
            }else {
                resolve();
            }
        })
    }
    render () {
        const { previewVisible, previewImage, fileList } = this.state;
        let { disabled } = this.state;
        let uploadConfig = {
            listType: "picture-card",
            fileList: fileList,
            disabled: disabled,
            className: 'upload-list-inline',
            beforeUpload: this.handleBeforeUpload,
            customRequest: this.handleUpload,
            onPreview: this.handlePreview,
            onChange: this.handleChange
        }
        const uploadButton = (
            <div disabled={uploadConfig.disabled}>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload {...uploadConfig}>
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall