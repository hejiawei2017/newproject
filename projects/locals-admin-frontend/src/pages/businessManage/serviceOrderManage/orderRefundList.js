import React, {Component} from 'react'
import {Table,Modal} from 'antd'
import {dataFormat} from "../../../utils/utils"
import {statusType} from "../../../utils/dictionary"
class OrderRefundList extends Component {
    render () {
        const { refundVisible, onCancel} = this.props
        const scroll = {
            x:true,
            y:false
        }
        const payLogColumns = [{
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm')}</span>
        },{
            title: '操作人',
            dataIndex: 'creator',
            key: 'creator'
        },{
            title: '操作',
            dataIndex: 'orderstatus',
            key: 'orderstatus',
            render: function (text, record, index) {
                return (
                    <span>{statusType[text]}</span>
                )
            }
        },{
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:'150px'
        }]
        return (
            <Modal
                visible={refundVisible}
                title={this.props.refundType}
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[<span key="cancel" className="click-link" onClick={onCancel}>关闭</span>]}
            >
                <Table
                    dataSource={this.props.data}
                    bordered
                    scroll={scroll}
                    columns={payLogColumns}
                    rowKey="createTime"
                    pagination={false}
                />
            </Modal>
        )
    }
}


export default OrderRefundList