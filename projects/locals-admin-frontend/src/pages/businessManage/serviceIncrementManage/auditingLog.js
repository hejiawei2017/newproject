import React, {Component} from 'react'
import {Table,Modal} from 'antd'
import {checkKey, dataFormat, pageOption} from "../../../utils/utils"
import {activitystatus} from "../../../utils/dictionary"
import {serviceIncrementManage} from "../../../services"
import {Form} from "antd/lib/index"
import {connect} from "react-redux"

const mapStateToProps = (state, action) => {
    return {
        serviceIncrementAuditingLogM: state.serviceIncrementAuditingLogM
    }
}
class AuditingLogTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            loading:true
        }
    }
    componentDidMount (){
        this.getAuditingLog()
    }

    //获取审核记录接口
    getAuditingLog () {
        let params = {
            activityid:this.props.id
        }
        serviceIncrementManage.getLogList(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_INCREMENT_AUDITING_LOG_SUCCESS',
                payload:data
            })
            this.setState({
                loading:false
            })
        })
    }


    render () {
        const { visible, onCancel,serviceIncrementAuditingLogM} = this.props
        const columns = [{
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'date',
            render: val => <span>{dataFormat(val - 0, 'YYYY-MM-DD HH:mm:ss')}</span>
        },{
            title: '操作人',
            dataIndex: 'creator',
            key: 'creator',
            exportType: 'text'
        },{
            title: '操作',
            dataIndex: 'status',
            key: 'status',
            exportType: 'text',
            render: val => <span>{activitystatus[val]}</span>
        }, {
            title: '原因',
            dataIndex: 'remark',
            key: 'remark',
            exportType: 'text'
        }]

        // const pageObj = {
        //     total: serviceIncrementAuditingLogM.total,
        //     pageSize: this.state.pageSize,
        //     showSizeChanger: true,
        //     pageSizeOptions: this.state.pageSizeOptions,
        //     current: this.state.pageNum,
        //     showQuickJumper: true,
        //     showTotal: (total) => `共 ${total} 条`,
        //     onShowSizeChange: (current, pageSize) => {
        //         this.setState({ pageNum: 1, pageSize: pageSize }, this.getAuditingLog)
        //     },
        //     onChange: (value,pageSize) => {
        //         this.setState({ pageNum: value, pageSize: pageSize }, this.getAuditingLog)
        //     }
        // }
        return (
            <Modal
                visible={visible}
                title="审核记录"
                cancelText="取消"
                onCancel={onCancel}
                footer={[
                    <span key="cancel" className="click-link" onClick={onCancel}>
                        取消
                    </span>
                ]}
            >
                <p className="text-center padder-vb-md">{this.props.activityname} ({this.props.activitycode}）</p>
                <Table
                    dataSource={checkKey(serviceIncrementAuditingLogM)}
                    bordered
                    columns={columns}
                    rowKey="id"
                    loading={this.state.loading}
                    pagination={false}
                />
            </Modal>
        )
    }
}


let AuditingLog = Form.create()(AuditingLogTable)
export default connect(mapStateToProps)(AuditingLog)
