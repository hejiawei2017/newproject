import React, { Component } from 'react'
import { Table,Button} from 'antd'
import {serviceOrderManage} from '../../../services'
import {pageOption, dataFormat, checkKey} from '../../../utils/utils'
import {connect} from "react-redux"
import Search from '../../../components/search'
import {orderType} from "../../../utils/dictionary"
import ServiceOrderDetail from './serviceOrderDetail'
import OrderRefundForm from './orderRefund'

const mapStateToProps = (state, action) => {
    return {
        serviceOrderManageM: state.serviceOrderManageM,
        serviceOrderM: state.serviceOrderM
    }
}
let orderOptions = []
for (const key in orderType) {
    orderOptions.push({value: key, text: orderType[key]})
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '服务订单编号',
            key: 'ordercode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务订单编号'
        },
        {
            type: 'text',
            name: '行程单号',
            key: 'bookingrandomid',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入行程单号'
        },{
            type: 'text',
            name: '增值服务编号',
            key: 'activitycode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入增值服务编号'
        },
        {
            type: 'text',
            name: '增值服务名称',
            key: 'activityname',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入增值服务名称'
        },
        {
            type: 'text',
            name: ' 客服人员',
            key: 'customservicename',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入客服人员'
        },
        {
            type: 'select',
            name: '服务订单状态',
            key: 'status',
            selectData: orderOptions,
            searchFilterType: 'select',
            placeholder: '请输入服务订单状态'
        },
        {
            type: 'rangepicker',
            name: '服务订单创建时间',
            key: 'startAndEndTime',
            searchFilterType: 'rangepicker',
            placeholder: '请选择时间'
        }
    ]
}
class ServiceOrderManage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            loading:true,
            visible:false,
            id:'',
            reVisible:false,
            refundDAta:'',
            startdate:"",
            enddate:""
        }
    }
    componentDidMount () {
        this.getServiceOrderManage()
    }

    // 获取table数据
    getServiceOrderManage (sortData) {
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...sortData
        }
        this.setState({loading:true})
        serviceOrderManage.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_ORDER_MANAE_SUCCESS',
                payload:{
                    list:data.list,
                    total:data.total
                }
            })
            this.setState({loading:false})
        }).catch( e =>{
            this.setState({loading:false})
        })
    }

    // 搜索数据
    onSearch = (searchFields) => {
        let startAndEndTime = searchFields.startAndEndTime.value ? searchFields.startAndEndTime.value : ''
        this.setState({
            pageNum:1,
            searchFields:{
                ordercode: searchFields.ordercode.value,
                bookingrandomid: searchFields.bookingrandomid.value,
                activitycode: searchFields.activitycode.value,
                activityname: searchFields.activityname.value,
                customservicename: searchFields.customservicename.value,
                status: searchFields.status.value,
                startdate:startAndEndTime[0],
                enddate:startAndEndTime[1]
            }
        }, this.getServiceOrderManage)
    }


    // 详情
    onDetail = (record) => () => {
        serviceOrderManage.getServiceOrder(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_ORDER_SUCCESS',
                payload:data
            })
            this.setState({
                visible:true,
                id:record.ordercode
            })
        })

    }

    // 退单处理
    onRefund = (record) => () => {
        this.setState({
            reVisible:true,
            refundDAta:record
        })
    }

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            reVisible: false
        })
        this.getServiceOrderManage()
    }
    // 主体
    render () {
        let self = this
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '服务订单编号',
            dataIndex: 'ordercode',
            key: 'ordercode'
        }, {
            title: '行程单号',
            dataIndex: 'bookingrandomid',
            key: 'bookingrandomid'
        }, {
            title: '增值服务编号',
            dataIndex: 'activitycode',
            key: 'activitycode'
        }, {
            title: '增值服务名称',
            dataIndex: 'activityname',
            key: 'activityname'
        }, {
            title: '服务订单总金额',
            dataIndex: 'ordertotalprice',
            key: 'ordertotalprice',
            align:'center'
        }, {
            title: '服务订单创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            className:'ant-table-nowrap',
            width:150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '服务订单状态',
            dataIndex: 'status',
            key: 'status',
            render: function (text,record,index) {
                return <span>{orderType[text]}</span>
            }
        }, {
            title: '客服人员',
            dataIndex: 'customservicename',
            key: 'customservicename'
        }, {
            title: '客户申请退单',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: function (text,record,index) {
                return (
                    <div>
                        {record.status === 4 ?
                            <Button
                                type="primary"
                                size="small"
                                name="lookDetail"
                                onClick = {self.onRefund(record)}
                            > 退单处理 </Button> : null
                        }
                    </div>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'80px',
            render: function (text, record, index) {
                return (
                    <Button
                        type="primary"
                        size="small"
                        name="lookDetail"
                        onClick={self.onDetail(record)}
                    >
                        详情
                    </Button>
                )
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: Number(this.props.serviceOrderManageM.total || 0 ),
            pageSize: this.props.serviceOrderManageM.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getServiceOrderManage)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getServiceOrderManage)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.serviceOrderManageM.list)} />
                <Table bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.serviceOrderManageM.list)}
                    rowKey="ordercode"
                    loading={this.state.loading}
                    pagination={pageObj}
                />
                {
                    this.state.visible ?
                        <ServiceOrderDetail
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            data={this.props.serviceOrderM}
                            id={this.state.id}
                        /> : null
                }
                {
                    this.state.reVisible ?
                        <OrderRefundForm
                            visible={this.state.reVisible}
                            data={this.state.refundDAta}
                            onCancel={this.handleCancel}
                        /> : null
                }
            </div>
        )
    }
}
export default connect(mapStateToProps)(ServiceOrderManage)
