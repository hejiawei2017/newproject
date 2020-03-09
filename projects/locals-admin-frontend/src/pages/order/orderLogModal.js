import React, { Component } from 'react'
import { Table, Modal, message } from 'antd'
import { dataFormat } from 'utils/utils'
import { getOperationLogs } from '../../actions/order'
import { connect } from "react-redux"
const columns = [{
    title: '操作时间',
    key: 'operationTime',
    dataIndex: 'operationTime',
    render: text => <span>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</span>
}, {
    title: '执行动作',
    key: 'businessType',
    dataIndex: 'businessType'
}, {
    title: '操作者',
    key: 'operatorName',
    dataIndex: 'operatorName'
}]

@connect(state => ({
    operationLogs: state.order.operationLogs,
    currentOrder: state.order.currentOrder
}))
export default class orderLog extends Component {

    handleOk = () => {
        this.props.toggleLogModal()
    }

    handleCancel = () => {
        this.props.toggleLogModal()
    }

    onPaginationChange = (page, pageSize) => {
        const {currentOrder} = this.props
        let params = {
            pageNum: page,
            pageSize: pageSize,
            randomId: currentOrder.randomId
        }
        this.props.dispatch(getOperationLogs(params))
            .then(() => {})
            .catch(e => message.error(e))
    }

    render = () => {
        const {visible, operationLogs} = this.props
        const data = operationLogs.list
        return (
            <Modal
                width={800}
                className="order-log-modal"
                title={'操作日志'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    null
                ]}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    rowKey={'key'}
                    pagination={{
                        onChange: this.onPaginationChange,
                        total: operationLogs.total
                    }}
                />
            </Modal>
        )
    }
}