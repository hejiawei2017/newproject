import React, { Component } from 'react'
import { Modal } from 'antd'
import MyUpload from '../../components/upload'
import { uploadImportService } from '../../services'

const uploadConfig = {
    upload : {
        action: uploadImportService.action,
        uploadType: 'file'
    }
}

class EditModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editModalVisible: true
        }
    }
    handleUpload = (data, fun) => {
        this.props.upload(data, fun)
    }
    handleCancel = () => {
        this.setState({
            editModalVisible: false
        }, () => {
            this.props.stateChange({editModalVisible: false})
        })
    }
    render () {
        const { editModalVisible } = this.state
        return (
            <Modal
                visible={editModalVisible}
                onCancel={this.handleCancel}
                title="提交"
                width={700}
                footer={null}
            >
                <MyUpload onUpload={this.handleUpload} config={uploadConfig} />
            </Modal>
        )
    }
}

export default EditModal