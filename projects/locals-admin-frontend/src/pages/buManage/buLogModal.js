import React, { Component } from 'react'
import { dataFormat } from '../../utils/utils'
import { Table, Modal } from 'antd'
import { dicModel } from '../../utils/dictionary'

class BuLogModal extends Component {
    render () {
        const columns = [{
            title: '操作人员',
            dataIndex: 'changeMember'
        }, {
            title: '日志',
            dataIndex: 'descLog'
        }, {
            title: '修改前成员',
            dataIndex: 'oldMemberId'
        }, {
            title: '修改前BuId',
            dataIndex: 'oldBuId'
        }, {
            title: '修改后成员',
            dataIndex: 'newMemberId'
        }, {
            title: '修改后BuId',
            dataIndex: 'newBuId'
        }, {
            title: '操作时间',
            dataIndex: 'createTime',
            render: val => <span>{dataFormat(+val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const pageObj = {
            total: this.props.totalCount || 0,
            pageSize: this.props.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.props.pageSizeOptions,
            current: this.props.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.props.onShowSizeChange({ pageNum: 1, pageSize: pageSize }, this.props.renderTable)
            },
            onChange: (value,pageSize) => {
                this.props.onChange({ pageNum: value, pageSize: pageSize }, this.props.renderTable)
            }
        }
        const {title,visible} = this.props;
        return (
            <Modal
                {...dicModel}
                title={title}
                className="hideModel-okBtn"
                visible={visible}
                onCancel={this.props.closeModal}
                width={800}
            >
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.props.modalData}
                    pagination={pageObj}
                    rowKey="key"
                    loading={this.props.loading}
                />
            </Modal>
        )
    }
}

export default BuLogModal