import React, { Component } from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'

class OperateModal extends Component {
    onCancel = () => {
        this.props.onCancel()
    }
    onSubmit = () =>{
        this.props.onSubmit()
    }
    render () {
        const { visible, title } = this.props
        return (
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    onCancel={this.onCancel}
                    onOk={this.onSubmit}
                    okText="保存"
                    destroyOnClose
                >
                    { this.props.children }
                </Modal>
            </div>
        )
    }
}

OperateModal.defaultProps = {
    title: '默认标题',
    visible: false
}

OperateModal.propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func,
    visible: PropTypes.bool
}

export default OperateModal