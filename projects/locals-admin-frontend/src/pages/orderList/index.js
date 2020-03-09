import React, { Component } from 'react'
import { orderListService } from '../../services'
import { Table, Button, Tooltip, message} from 'antd'
import { pageOption, dataFormat, checkKey } from '../../utils/utils'
import OrderOperation from './orderOperation'
import PayLogList from './payLogList'
import {connect} from "react-redux"
import Search from '../../components/search'
import {sourseType} from "../../utils/dictionary"
import SetModal from './setModal'
import DelModal from './delModal'

const mapStateToProps = (state, action) => {
    return {
        orderListM: state.orderListM
    }
}

let sourseOptions = []
for (const key in sourseType) {
    sourseOptions.push({value: key, text: sourseType[key]})
}

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '订单编号',
            key: 'randomId',
            searchFilterType: 'string',
            placeholder: '订单编号，如“A1B2C3”'
        },
        {
            type: 'text',
            name: '房源编号',
            key: 'houseSourceHouseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编号'
        },
        {
            type: 'text',
            name: '订单ID',
            key: 'id',
            searchFilterType: 'string',
            placeholder: '请输入订单ID'
        },
        {
            type: 'select',
            name: '订单来源',
            key: 'source',
            selectData: sourseOptions,
            renderSelectData: sourseType,
            searchFilterType: 'select',
            placeholder: '请输入订单来源'
        }, {
            type: 'text',
            name: '房源标题',
            key: 'houseSourceTitleLike',
            searchFilterType: 'string',
            placeholder: '请输入房源标题'
        }, {
            type: 'selectInput',
            name: '城市',
            key: 'houseSourceCityName',
            placeholder: '请输入城市',
            searchFilterType: 'select',
            searchService: orderListService.getCitylist,
            optionfield: {
                resListName: 'list',
                optValue: 'name',
                optText: 'name'
            }
        },{
            type: 'datepicker',
            name: '入住时间',
            key: 'checkinDate',
            searchFilterType: 'datepicker',
            placeholder: '请选择入住时间'
        }, {
            type: 'datepicker',
            name: '退房时间',
            key: 'checkoutDate',
            searchFilterType: 'datepicker',
            placeholder: '请选择退房时间'
        }, {
            type: 'text',
            name: '客户手机号',
            key: 'phone',
            searchFilterType: 'string',
            placeholder: '请输入客户手机号'
        },
        {
            type: 'selectInput',
            name: '城市',
            key: 'cityName',
            placeholder: '请输入城市',
            searchFilterType: 'select',
            searchService: orderListService.getCitylist,
            optionfield: {
                resListName: 'list',
                optValue: 'name',
                optText: 'name'
            }
        }, {
            type: 'select',
            name: '预定状态',
            key: 'bookingState',
            selectData: [
                {value: '1101', text: '咨询'},
                {value: '1102', text: '待付款'},
                {value: '1103', text: '预订已付'},
                {value: '1104', text: '已完成'},
                {value: '1105', text: '已取消'},
                {value: '1106', text: '已关闭'},
                {value: '1107', text: '已接受'},
                {value: '1108', text: '停租'},
                {value: '1110', text: '暂存订单'}
            ],
            searchFilterType: 'select',
            placeholder: '请选择预定状态'
        }
    ],
    export: {
        name: '订单列表数据'
    }
}


class OrderList extends Component {
    constructor () {
        super()
        this.state = {
            tableDate: [],
            detailsData:[],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            sortedInfo: null,
            moreVisible:false,
            payLogData:[],
            id:'',
            statusNotEqual: 0,
            operationType:'',
            sorterA:'',
            loading:true,
            searchFields: {},
            isShowSetOrder: false,
            isShowDelOrder: false,
            orderRecord: {}
        }
    }

    componentDidMount () {
        this.getOrder()
    }

    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }

    // 获取table数据
    getOrder (sortData) {
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            statusNotEqual:this.state.statusNotEqual,
            ...sortData
        }
        if(params.phone){
            params.phone = `${params.phone}%`
        }
        this.setState({loading:true})
        console.log(params)
        orderListService.getTable(params).then((data) => {
            console.log(data)
            this.props.dispatch({
                type: 'GET_ORDER_LIST_SUCCESS',
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
        // console.log('--->', searchFields)
        this.setState({
            pageNum:1,
            searchFields:{
                id: searchFields.id.value,
                randomId: searchFields.randomId.value,
                source: searchFields.source.value,
                houseSourceTitleLike: searchFields.houseSourceTitleLike.value,
                checkinDate:searchFields.checkinDate.value,
                checkoutDate:searchFields.checkoutDate.value,
                phone: searchFields.phone.value,
                houseSourceHouseNo: searchFields.houseSourceHouseNo.value,
                houseSourceCityName: searchFields.houseSourceCityName.value,
                bookingState: searchFields.bookingState.value
            }
        }, this.getOrder)
    }

    //更多
    onMore = (record) => () => {
        this.setState({
            moreVisible:true,
            payLogData:record.payLogs
        })
    }

    //异议
    onDissent = (record) => () => {
        this.setState({
            visible:true,
            id:record.bookingId,
            operationType: "orderDissent"
        })
    }

    // 取消
    onOrderCancel = (record) => () =>{
        this.setState({
            visible:true,
            id:record.bookingId,
            operationType: "orderCancel"
        })
    }

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            moreVisible: false
        })
    }

    // 点击排序
    handleChange = (pagination, filters, sorter) => {
        if(sorter.order){
            if(sorter.order === 'descend'){
                this.setState({
                    sorterA : 'desc'
                })
            }else if(sorter.order === 'ascend'){
                this.setState({
                    sorterA : 'asc'
                })
            }
            this.getOrder({orderBy:(sorter.field + ' ' + this.state.sorterA)})
        }
    }
    renderContent = (content) => {
        if (!content) return null
        const output = <div className="w200">{content}</div>
        return (
            <Tooltip title={output}>
                <div className="ellipsis w100">{content}</div>
            </Tooltip>
        )
    }
    onSetTuJiaApiOrder = (record) => () => {
        this.setState({
            isShowSetOrder: true,
            orderRecord: record
        })
    }
    onSetOrderSubmit = (val) => {
        orderListService.setTuJiaApiOrder(val).then(res => {
            // console.log('设置--->', res)
            this.setState({
                isShowSetOrder: false
            })
            message.success('修改成功')
        })
    }
    onDelTuJiaApiOrder = (record) => () => {
        this.setState({
            isShowDelOrder: true,
            orderRecord: record
        })
    }
    onDelOrderSubmit = (val) => {
        orderListService.delTuJiaApiOrder(val).then(res => {
            // console.log('取消--->', res)
            message.success('取消成功')
            this.setState({
                isShowDelOrder: false
            })
        })
    }
    // 主体
    render () {
        let self = this
        // let { sortedInfo } = this.state
        // sortedInfo = sortedInfo || {}
        const scroll = {
            x: 5500,
            y: false
        }
        const {
            isShowSetOrder,
            orderRecord,
            isShowDelOrder
        } = this.state
        const columns = [{
            title: '订单编号',
            dataIndex: 'randomId',
            key: 'randomId',
            width: 150
        },{
            title: '订单ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width: 250
        },{
            title: '支付单号',
            dataIndex: 'payLogs',
            key: 'payLogs',
            width: 200,
            render: function (text, record, index) {
                let payLogs = record.payLogs

                // 有支付单号
                let maxCreateTime = 0
                let maxPayLog = null
                let outNo = null
                for (let i = payLogs.length - 1; i >= 0; i--) {
                    let payLog = payLogs[i]
                    if (payLog.createTime > maxCreateTime) {
                        maxCreateTime = payLog.createTime
                        maxPayLog = payLog
                        outNo = maxPayLog.outNo
                    }
                }

                return (
                    <div>
                        <div>
                            {outNo}
                        </div>
                        <Button
                            type="primary"
                            size="small"
                            name="lookPick"
                            onClick={self.onMore(record)}
                        >
                            更多
                        </Button >
                    </div>
                )

            }
        },{
            title: '订单来源',
            dataIndex: 'source',
            key: 'source',
            width: 200,
            render: function (text,record,index) {
                return <span>{sourseType[text]}</span>
            }
        },{
            title: '会员名称',
            dataIndex: 'memberName',
            key: 'memberName',
            width: 150
        },{
            title: '客户电话',
            dataIndex: 'customerContact',
            key: 'customerContact',
            width: 150
        },{
            title: '房源城市',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 150
        },{
            title: '房源编码',
            dataIndex: 'houseNo',
            key: 'houseNo',
            width: 150
        },{
            title: '房源标题',
            dataIndex: 'houseSourceTitle',
            key: 'houseSourceTitle',
            width: 150,
            render: this.renderContent
        },{
            title: '助理房东姓名',
            dataIndex: 'assistName',
            key: 'assistName',
            width: 150
        },{
            title: '助理房东电话',
            dataIndex: 'assistPhone',
            key: 'assistPhone',
            width: 150
        },{
            title: 'BU姓名',
            dataIndex: 'buName',
            key: 'buName',
            width: 150
        },{
            title: 'BU电话',
            dataIndex: 'buPhone',
            key: 'buPhone',
            width: 150
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        },{
            title: '预订日期',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        },{
            title: '入住日期',
            dataIndex: 'checkinDate',
            key: 'checkinDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        },{
            title: '离店日期',
            dataIndex: 'checkoutDate',
            key: 'checkoutDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        },{
            title: '房费',
            dataIndex: 'roomPrice',
            key: 'roomPrice',
            width: 100
        },{
            title: '清洁费',
            dataIndex: 'clearPrice',
            key: 'clearPrice',
            width: 100
        },{
            title: '超过房客费用',
            dataIndex: 'otherTenantPrice',
            key: 'otherTenantPrice',
            width: 170
        },{
            title: '超过房客数',
            dataIndex: 'otherTenantNumber',
            key: 'otherTenantNumber',
            width: 160
        },{
            title: '入住房客数',
            dataIndex: 'tenantNumber',
            key: 'tenantNumber',
            width: 160
        },{
            title: '保证金',
            dataIndex: 'deposit',
            key: 'deposit',
            width: 100
        },{
            title: '折扣方式',
            dataIndex: 'discountType',
            key: 'discountType',
            width: 150
        },{
            title: '折扣金额',
            dataIndex: 'discountPrice',
            key: 'discountPrice',
            width: 150
        }, {
            title: '会员折扣',
            dataIndex: 'memberDiscount',
            key: 'memberDiscount',
            width: 150
        }, {
            title: '会员折扣金额',
            dataIndex: 'memberDiscountPrice',
            key: 'memberDiscountPrice',
            width: 150
        },{
            title: '合计',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100
        },{
            title: '付款状态',
            dataIndex: 'payState',
            key: 'payState',
            width: 150,
            render: function (text, record, index) {
                return (
                    <span>
                        { record.payState === "0" ? "未付款" : record.payState === "2" ? "已付款" : null }
                    </span>
                )
            }
        },{
            title: '付款方式',
            dataIndex: 'payType',
            key: 'payType',
            width: 150,
            render: function (text, record, index) {
                return (
                    <span>{record.payType === "AliPay" ? "支付宝" : record.payType === "WechatPay" ? "微信" : record.payType === "Cash" ? "现金" : null}</span>
                )
            }
        },{
            title: '预定状态',
            dataIndex: 'bookingStateStr',
            key: 'bookingStateStr',
            width: 150
        },{
            title: '房东确认时间',
            dataIndex: 'confirmTime',
            key: 'confirmTime',
            width: 170,
            render: val => {
                if (val > 0) {
                    return <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
                } else {
                    return ''
                }
            }
        },{
            title: '是否划账',
            dataIndex: 'isRemitAccount',
            key: 'isRemitAccount',
            width: 150,
            render: function (text, record, index) {
                return (
                    <span>{record.isRemitAccount ? "是" : "否" }</span>
                )
            }
        },{
            title: '划账日期',
            dataIndex: 'remitAccountDate',
            key: 'remitAccountDate',
            width: 150,
            render: val => {
                if (val > 0) {
                    return <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
                } else {
                    return ''
                }
            }
        },{
            title: '划账交易号',
            dataIndex: 'remitAccountId',
            key: 'remitAccountId',
            width: 170
        },{
            title: '退保证金交易号',
            dataIndex: 'refundId',
            key: 'refundId',
            width: 180
        },{
            title: '退保证金交易发起时间',
            dataIndex: 'refundTimeStr',
            key: 'refundTimeStr',
            width: 260,
            render: val => {
                if (val > 0) {
                    return <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
                } else {
                    return ''
                }
            }
        }, {
            title: '开票金额',
            dataIndex: 'invoicePrice',
            key: 'invoicePrice',
            width: 150
        }, {
            title: '开票服务费',
            dataIndex: 'invoiceServicePrice',
            key: 'invoiceServicePrice',
            width: 150
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed:'right',
            width: 230,
            render: function (text, record, index) {
                // console.log('订单来源--->', record.source)
                if (record.source === "APP" || record.source === "H5" || record.source === "WEB") {
                    return (<div>
                        <Button
                            type="primary"
                            name="lookPick"
                            className="mr-sm"
                            size="small"
                            onClick={self.onDissent(record)}
                        >退押金异议处理
                        </Button>
                        {record.bookingState !== 1105 &&
                        <Button
                            type="primary"
                            name="canel"
                            size="small"
                            onClick={self.onOrderCancel(record)}
                        >取消订单
                        </Button>}
                    </div>)
                } else if (record.source === "TUJIAAPI") {
                    return (
                        <div>
                            <Button
                                className="mr10"
                                size="small"
                                onClick={self.onSetTuJiaApiOrder(record)}
                            >修改订单</Button>
                            <Button
                                type="danger"
                                size="small"
                                onClick={self.onDelTuJiaApiOrder(record)}
                            >取消订单</Button>
                        </div>
                    )
                } else {
                    return ''
                }
            }
        }]
        searchConfig.columns = columns
        let _total = this.props.orderListM ? Number(this.props.orderListM.total) : 0

        const pageObj = {
            total: _total,
            pageSize: this.props.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getOrder)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getOrder)
            }
        }
        let _list = this.props.orderListM ? checkKey(this.props.orderListM.list) : []
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={_list} />
                <div className="ant-span-red pb10">注意：订单合计金额  = 房费 + 清洁费 + 保证金 + 开票服务费 - 折扣金额(优惠券折扣金额) - 会员折扣金额</div>
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={_list}
                    rowKey="bookingId"
                    loading={this.state.loading}
                    onChange={this.handleChange}
                    pagination={pageObj}
                />
                {
                    this.state.moreVisible ?
                        <PayLogList
                            moreVisible={this.state.moreVisible}
                            payLogData={this.state.payLogData}
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.id ?
                        <OrderOperation
                            visible={this.state.visible}
                            id={this.state.id}
                            operationType={this.state.operationType}
                            onCancel={this.handleCancel}
                        /> : null}
                <SetModal
                    visible={isShowSetOrder}
                    data={orderRecord}
                    stateChange={this.stateChange}
                    onSubmit={this.onSetOrderSubmit}
                />
                <DelModal
                    visible={isShowDelOrder}
                    data={orderRecord}
                    stateChange={this.stateChange}
                    onSubmit={this.onDelOrderSubmit}
                />
            </div>
        )
    }
}
export default connect(mapStateToProps)(OrderList)