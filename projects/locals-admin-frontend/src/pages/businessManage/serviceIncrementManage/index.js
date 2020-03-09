import React, { Component } from 'react'
import { Table,Button,Popconfirm} from 'antd'
import {serviceIncrementManage} from '../../../services'
import {pageOption, dataFormat, checkKey} from '../../../utils/utils'
import {connect} from "react-redux"
import Search from '../../../components/search'
import {actionType,validTypeIdType} from "../../../utils/dictionary"
import {message} from "antd/lib/index"
import Global from "../../../utils/Global"
import IncrementDetailForm from './incrementDetail'

const mapStateToProps = (state, action) => {
    return {
        serviceIncrementManageM: state.serviceIncrementManageM,
        serviceIncrementDetailM: state.serviceIncrementDetailM
    }
}
let actionOptions = []
for (const key in actionType) {
    actionOptions.push({value: key, text: actionType[key]})
}

let validTypeIdOptions = []
for (const key in validTypeIdType) {
    validTypeIdOptions.push({value: key, text: validTypeIdType[key]})
}

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '服务商编号',
            key: 'providercode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务商编号'
        },
        {
            type: 'text',
            name: '服务商名称',
            key: 'providername',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务商名称'
        }, {
            type: 'select',
            name: '增值服务状态',
            key: 'status',
            selectData: actionOptions,
            renderSelectData: actionType,
            searchFilterType: 'select',
            placeholder: '请输入增值服务状态'
        }, {
            type: 'select',
            name: '服务有效期',
            key: 'validtypeid',
            selectData: validTypeIdOptions,
            renderSelectData: validTypeIdType,
            searchFilterType: 'select',
            placeholder: '请选择服务有效期',
            fun: function ($this){
                if($this.state.searchData.validtypeid.value === "0" ) {
                    document.getElementById("startAndEndTimeButton").style.display = 'none'
                }else{
                    document.getElementById("startAndEndTimeButton").style.display = 'inline-block'
                }
            }
        }, {
            type: 'rangepicker',
            name: '开始-结束时间',
            key: 'startAndEndTime',
            searchFilterType: 'rangepicker',
            placeholder: '请选择时间'
        }
    ]
}

class ServiceIncrementManage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            nowData : new Date().getTime(),
            loading:true,
            visible:false,
            data:'',
            id:'',
            dataType:1 // 1新增 2编辑 3详情
        }
        this.onAdd = this.onAdd.bind(this)
    }
    componentDidMount () {
        this.getServiceItemManage()
    }

    // 获取table数据
    getServiceItemManage () {
        let params = {
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        serviceIncrementManage.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_INCREMENT_MANAE_SUCCESS',
                payload:data
            })
            this.setState({
                loading:false
            })
        })
    }
    // 搜索数据
    onSearch = (searchFields) => {
        console.log('startAndEndTime',searchFields.startAndEndTime.value)
        let startAndEndTime = searchFields.startAndEndTime.value ? searchFields.startAndEndTime.value : ''
        this.setState({
            pageNum:1,
            searchFields:{
                providercode: searchFields.providercode.value,
                providername: searchFields.providername.value,
                status: searchFields.status.value,
                validtypeid: startAndEndTime && searchFields.validtypeid.value !== "0" ? 1 : searchFields.validtypeid.value,
                validstarttime: startAndEndTime && searchFields.validtypeid.value !== "0" ? startAndEndTime[0] : undefined,
                validendtime: startAndEndTime && searchFields.validtypeid.value !== "0" ? startAndEndTime[1] : undefined
            }
        }, this.getServiceItemManage)
    }

    //新增
    onAdd = () =>{
        this.setState({
            visible:true,
            dataType:1
        })
    }
    //编辑
    onEdit = (record,values) => () =>{
        this.setState({
            visible:true,
            dataType:values,
            id:record.id
        })
    }

    //更改状态
    onChangeStatusClick = (obj,value) =>{
        const params = {
            activitystatus : value,
            activityid:obj.id,
            remark:'',
            oldBusinessActivity:{
                id:obj.id,
                status:value,
                timeVersion : new Date().getTime(),
                version : obj.version,
                creator:Global.userInfo.nickName
            }
        }
        this.props.dispatch({
            type: 'STATUS_SERVICE_INCREMENT_MANAGE_ING'
        })
        serviceIncrementManage.statusServiceItem(params).then((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_INCREMENT_MANAGE_SUCCESS',
                payload:data
            })
            message.success('操作成功',0.5)
            this.getServiceItemManage()
        }).catch((data) => {
            message.success('操作失败',0.5)
        })
    }

    //z状态操作
    onStatus = (record,value) => () => {
        this.onChangeStatusClick(record,value)
    }

    //取消Modal
    handleCancel = () =>{
        this.setState({
            visible:false
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
            title: '增值服务编号',
            dataIndex: 'activitycode',
            key: 'activitycode'
        }, {
            title: '增值服务名称',
            dataIndex: 'activityname',
            key: 'activityname'
        }, {
            title: '服务商',
            dataIndex: 'providerList',
            key: 'providerList'
        }, {
            title: '服务有效期',
            dataIndex: 'validtypeid',
            key: 'validtypeid',
            align:'left',
            className:'ant-table-nowrap',
            width:150,
            render: function (text, record, index) {
                return (
                    text === 0 ? <div>永久</div> : <div>{dataFormat(record.validstarttime, 'YYYY-MM-DD HH:mm:ss')} <div> ~ </div>{dataFormat(record.validendtime, 'YYYY-MM-DD HH:mm:ss')}</div>
                )
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            className:'ant-table-nowrap',
            width:150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function (text,record,index) {
                return (
                    <div>
                        {
                            text === 4 ?
                                <span>
                                    {
                                        record.validtypeid === 0 ? "执行中" :
                                            record.validtypeid === 1 && record.validstarttime > self.state.nowData ? "待执行"
                                                : record.validtypeid === 1 && record.validstarttime <= self.state.nowData && record.validendtime > self.state.nowData ? "执行中"
                                                    : record.validtypeid === 1 && record.validendtime > self.state.nowData ? "已下架" : "执行中"
                                    }
                                </span>
                                : actionType[text]
                        }
                    </div>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'240px',
            fixed:'right',
            render: function (text, record, index) {
                return (
                    <div>
                        {
                            record.status === 1 || record.status === 6 ?
                                <Button
                                    type="primary"
                                    size="small"
                                    name="lookDetail"
                                    className="mr-sm"
                                    onClick={self.onEdit(record,2)}
                                >编辑</Button> : null
                        }
                        {
                            record.status === 4 && (( record.validtypeid === 1 && self.state.nowData < record.validendtime) || (record.validtypeid === 0)) ?
                                <Popconfirm
                                    placement="top"
                                    title={<div>确定暂停<span style={{color:"red"}}> {record.remark} ?</span></div>}
                                    onConfirm={self.onStatus(record,5)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button
                                        type="danger"
                                        size="small"
                                        name="lookDetail"
                                        className="mr-sm"
                                    >暂停</Button>
                                </Popconfirm> : null
                        }
                        {
                            record.status === 5 ? <span>
                                <Button
                                    type="green"
                                    size="small"
                                    name="status"
                                    className="mr-sm"
                                    onClick={self.onStatus(record,4)}
                                >重启</Button>
                                <Popconfirm
                                    placement="top"
                                    title={<div>确定暂停<span style={{color:"red"}}> {record.remark} ?</span></div>}
                                    onConfirm={self.onStatus(record,7)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button
                                        type="danger"
                                        size="small"
                                        name="status"
                                        className="mr-sm"
                                    >下架</Button>
                                </Popconfirm>
                            </span> : null
                        }

                        <Button
                            type="primary"
                            size="small"
                            name="lookDetail"
                            className="mr-sm"
                            onClick={self.onEdit(record,3)}
                        >详情</Button>
                        <Button
                            type="primary"
                            size="small"
                            name="lookDetail"
                            onClick={self.onEdit(record,4)}
                        >复制</Button>
                    </div>
                )
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: Number(this.props.serviceIncrementManageM.total || 0 ),
            pageSize: this.props.serviceIncrementManageM.pageSize,
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
                <Search onSubmit={self.onSearch} config={searchConfig} dataSource={checkKey(self.props.serviceIncrementManageM.list)} />
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
                    dataSource={checkKey(this.props.serviceIncrementManageM.list)}
                    rowKey="activitycode"
                    pagination={pageObj}
                    loading={this.state.loading}
                />
                { this.state.visible ?
                    <IncrementDetailForm
                        visible={this.state.visible}
                        dataType={this.state.dataType}
                        id={this.state.id}
                        onCancel={this.handleCancel}
                    /> : null
                }
            </div>
        )
    }
}
export default connect(mapStateToProps)(ServiceIncrementManage)
