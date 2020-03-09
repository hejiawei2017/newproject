import React, { Component } from 'react'
import { Table,Button,message} from 'antd'
import {serviceItemManage} from '../../../services'
import {pageOption, dataFormat, checkKey} from '../../../utils/utils'
import {connect} from "react-redux"
import Search from '../../../components/search'
import ServiceDetailForm from './serviceDetail'
import ServiceItemAddForm from './serviceItemAdd'
import Global from "../../../utils/Global"
import {statusList} from "../../../utils/dictionary"

let statusListOptions = []
for (const key in statusList) {
    statusListOptions.push({value: key, text: statusList[key]})
}

const mapStateToProps = (state, action) => {
    return {
        serviceItemManageM: state.serviceItemManageM,
        serviceItemM: state.serviceItemM,
        areaM:state.areaM
    }
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '服务项编号',
            key: 'servicecode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务项编号'
        },
        {
            type: 'text',
            name: '服务项名称',
            key: 'servicename',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务项名称'
        },
        {
            type: 'select',
            name: '订单状态',
            key: 'status',
            selectData: statusListOptions,
            renderSelectData: statusList,
            searchFilterType: 'select',
            placeholder: '请输入订单状态'
        }
    ]
}
class ServiceItemManage extends Component {
    constructor () {
        super()
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            visible:false,
            id:'',
            addVisible:false,
            dataType:true,
            data:[],
            areaList:null,
            loading:true
        }
        this.onAdd = this.onAdd.bind(this)
    }
    componentDidMount () {
        this.getServiceItemManage()
    }

    // 获取table数据
    getServiceItemManage () {
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.setState({loading:true})
        serviceItemManage.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_ITEM_MANAGE_SUCCESS',
                payload:data
            })
            this.setState({loading:false})
        }).catch( e =>{
            this.setState({loading:false})
        })
    }
    // 搜索数据
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                servicecode: searchFields.servicecode.value,
                servicename: searchFields.servicename.value,
                status: searchFields.status.value
            }
        }, this.getServiceItemManage)
    }

    // 停用
    onStatus = (record) => () => {
        const param = {
            id:record.id,
            status:record.status === 1 ? 0 : 1,
            updator:Global.userInfo.nickName,
            timeVersion:new Date().getTime(),
            version:record.version
        }
        this.props.dispatch({
            type: 'STATUS_SERVICE_ITEM_MANAGE_ING'
        })
        serviceItemManage.statusServiceItem(param).then((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_ITEM_MANAGE_SUCCESS'
            })
            message.success('操作成功',0.5)
            this.getServiceItemManage()
        })
    }

    // 详情
    onDetail = (record) => () => {
        this.setState({
            visible:true,
            id:record.id,
            dataType:true
        })
    }

    //新增
    onAdd = () =>{
        this.setState({
            addVisible:true,
            dataType:false
        })
    }

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            addVisible: false
        })
        this.getServiceItemManage()
    }
    // 主体
    render () {
        let self = this
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '服务项编号',
            dataIndex: 'servicecode',
            key: 'servicecode'
        }, {
            title: '服务商项名称',
            dataIndex: 'servicename',
            key: 'servicename'
        }, {
            title: '操作人',
            dataIndex: 'updator',
            key: 'updator'
        }, {
            title: '更新时间',
            dataIndex: 'timeVersion',
            key: 'timeVersion',
            className:'ant-table-nowrap',
            width:150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function (text, record, index) {
                return (
                    <span>
                        { record.status === 1 ? "已激活" : "已停用" }
                    </span>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'130px',
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            className="mr-sm"
                            type={record.status === 1 ? "danger" : "green" }
                            size="small"
                            name="stop"
                            onClick={self.onStatus(record)}
                        >
                            {record.status === 1 ? "停用" : "激活" }
                        </Button>
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
        searchConfig.columns = columns

        const pageObj = {
            total: Number(this.props.serviceItemManageM.total || 0 ),
            pageSize: this.props.serviceItemManageM.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getServiceItemManage)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getServiceItemManage)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.serviceItemManageM.list)} />
                <div className="text-right padder-v-sm">
                    <Button
                        type="primary"
                        onClick={self.onAdd}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.serviceItemManageM.list)}
                    rowKey="servicecode"
                    pagination={pageObj}
                    loading={this.state.loading}
                />
                {
                    this.state.visible ?
                        <ServiceDetailForm
                            visible={this.state.visible}
                            id={this.state.id}
                            orgType="service"
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.addVisible ?
                        <ServiceItemAddForm
                            dataType={this.state.dataType}
                            visible={this.state.addVisible}
                            data={this.state.data}
                            onCancel={this.handleCancel}
                        /> : null
                }
            </div>
        )
    }
}
export default connect(mapStateToProps)(ServiceItemManage)
