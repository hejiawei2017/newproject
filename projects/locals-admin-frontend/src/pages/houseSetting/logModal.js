import React, { Component } from 'react'
import { Modal } from 'antd'
import SubTable from '../../components/subTable'
import {houseSettingService} from "../../services";
import {dataFormat} from "../../utils/utils";

class LogModal extends Component {

    constructor (props) {
        super(props)
        this.state = {
            searchFields: {
                houseSourceId: props.houseSourceId
            }
        }
        this.handleCancel = this.handleCancel.bind(this)
    }
    handleCancel () {
        this.props.stateChange({logModalVisible: false})
    }

    render () {
        let that = this
        const columns = [
            {title: '操作人', dataIndex: 'creator'},
            {title: '操作时间', dataIndex: 'createTime', render: val => {
                return (
                    <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
                )
                }},
            {title: '操作内容', dataIndex: 'changeLog'}
        ]
        const subTableItem = {
            getTableService: houseSettingService.fetchHouseRoleLogs,
            columns: columns,
            searchFields: this.state.searchFields,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "id"
        };
        return (
            <Modal
                width={800}
                visible={this.props.logModalVisible}
                title="日志"
                onCancel={this.handleCancel}
                cancelText="关闭"
                className="hideModel-okBtn"
            >
                <SubTable
                    {...subTableItem}
                />
            </Modal>
        )
    }
}

export default LogModal