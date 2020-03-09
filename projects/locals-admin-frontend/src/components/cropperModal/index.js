import React, { Component } from 'react'
import { Modal, Button,Row,Col, Upload } from 'antd'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'


class CropperModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            updateSrc: this.props.updateSrc,
            cropResult: ""
        }
    }
    componentWillReceiveProps (newProps){
        this.setState({
            updateSrc:newProps.updateSrc
        })
    }
    onOK = () =>{
        const {updateSrc, cropResult} = this.state
        const {stateChange, changeKey} = this.props
        stateChange({cropperVisible:false,[changeKey || 'banner']: cropResult || updateSrc})
    }
    _crop = () =>{
        if (typeof this.cropper.getCroppedCanvas() === 'undefined' || this.cropper.getCroppedCanvas() === 'null' || (!(this.state.updateSrc && this.state.updateSrc.length > 0))) {
            return false
        }
        this.setState({
            cropResult: this.cropper.getCroppedCanvas().toDataURL()
        })
    }
    render () {
        const _this = this
        const {visible} = _this.props
        const {updateSrc, cropResult} = _this.state
        const UploadProps = {
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file)
                    const newFileList = fileList.slice()
                    newFileList.splice(index, 1)
                    return {
                        fileList: newFileList
                    }
                })
            },
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
            fileList: false
        }
        return (
            <div>
                <Modal
                    title="选择图片"
                    className="cropper-wrap"
                    visible={visible}
                    width="860px"
                    okText="确认"
                    cancelText="取消"
                    onOk={this.onOK}
                    onCancel={this.onOK}
                >
                    <Row>
                        <Col span="10">
                            <Cropper
                                ref={function (cropper){
                                    _this.cropper = cropper
                                }}
                                className="cropper-bg"
                                src={updateSrc}
                            />
                        </Col>
                        <Col span="4" className="text-center">
                            <Upload {...UploadProps} className="display-inline_block">
                                <Button className="w100 " type="primary" size="large">上传</Button>
                            </Upload>
                            <Button className="w100 mt20" type="primary" size="large" onClick={this._crop}>裁剪</Button>
                        </Col>
                        <Col span="10">
                            <div className="cropImg">
                                {cropResult ? <img src={cropResult} alt="加载失败..." /> : null}
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

export default CropperModal
