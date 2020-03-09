import React, {Component} from 'react'
import {Table,Modal,Button } from 'antd'

class ProviderLinkTable extends Component {
    // 详情
    onDetail = (record) => () => {
        this.props.onNext(record.id)
    }
    //上一步
    onLast = () => {
        this.props.onLast()
    }
    render () {
        let self = this
        const { visible, onCancel} = this.props
        const scroll = {
            x:true,
            y:false
        }
        const payLogColumns = [{
            title: '服务编号',
            dataIndex: 'servicecode',
            key: 'servicecode',
            width:'150px'
        },{
            title: '服务项',
            dataIndex: 'servicename',
            key: 'servicename',
            width:'200px'
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'80px',
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            name="lookDetail"
                            onClick={self.onDetail(record)}
                        >详情</Button>
                    </div>
                )
            }
        }]
        return (
            <Modal
                visible={visible}
                title="关联服务项"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[<span key="cancel" className="click-link mr-md" onClick={self.onLast}>返回详情</span>]}
                width="800px"
            >
                <Table
                    dataSource={this.props.data}
                    bordered
                    scroll={scroll}
                    columns={payLogColumns}
                    rowKey="servicecode"
                    pagination={false}
                />
            </Modal>
        )
    }
}


export default ProviderLinkTable