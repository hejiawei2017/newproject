import React, {Component} from 'react'
import { Modal, Table } from 'antd'
import { checkKey, dataFormat } from '../../utils/utils'

const columns = [{
    title: '日志id',
    dataIndex: 'id',
    width: 100
}, {
    title: '创建人',
    dataIndex: 'createdby',
    width: 150
}, {
    title: '创建时间',
    dataIndex: 'createdtime',
    width: 150,
    render: (t, r) => (<span>{dataFormat(r.createdtime)}</span>)
}, {
    title: '修改人',
    dataIndex: 'modifyby',
    width: 150
}, {
    title: '修改时间',
    dataIndex: 'modifytime',
    width: 150,
    render: (t, r) => (<span>{dataFormat(r.modifytime)}</span>)
}, {
    title: '版本号',
    dataIndex: 'version',
    width: 150
}, {
    title: '类别id',
    dataIndex: 'modelId',
    width: 150
}, {
    title: '日志类别名称',
    dataIndex: 'modelName',
    width: 200
}, {
    title: '日志操作记录',
    dataIndex: 'remark',
    width: 200
}, {
    title: '从状态',
    dataIndex: 'fromStatus',
    width: 150
}, {
    title: '方法名',
    dataIndex: 'methodName',
    width: 250
}, {
    title: '至状态',
    dataIndex: 'toStatus',
    width: 150
}]

class LogModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataSource: []
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.visible) {
            this.setState({
                visible: nextProps.visible
            })
        }
        if (nextProps.data) {
            this.setState({
                dataSource: checkKey(nextProps.data)
            })
        }
        // console.log('批量--->', nextProps.visible)
    }
    handleCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.props.stateChange({logType: false})
        })
    }
    render () {
        const {
            dataSource
        } = this.state
        const {
            visible
        } = this.props
        return (
            <Modal
                title="日志"
                width={900}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Table
                    columns={columns}
                    rowKey="key"
                    dataSource={dataSource}
                    bordered
                    scroll={{x: 1850}}
                />
            </Modal>
        )
    }
}

export default LogModal