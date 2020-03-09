import { connect } from "react-redux"
import { Table, Tooltip, Icon, Popconfirm } from 'antd'
import React, { Component } from 'react'
import OrderDetail from './orderDetail'
import moment from 'moment';
import {
    getOrderList,
    getOrderDetail,
    getOrderIdOrder
} from '../../actions/order'
import { pageOption, dataFormat, checkKey, formatSelectOption } from 'utils/utils'
import Search from 'components/search'
import {
    sourseType,
    orderStatusType,
    invoiceType,
    depositStatusType,
    commentType,
    paymentTermType,
    refundStatusMap
} from "utils/dictionary"
import {orderService} from '../../services'
import PayLogList from './payLogList'
import OrderOperation from './orderOperation'
import {message} from "antd/lib/index";
import SetModal from './setModal'
import CancleModal from './cancleModal'

let sourseOptions = formatSelectOption(sourseType)
let orderStatusOptions = formatSelectOption(orderStatusType)
let refundStatusOptions = formatSelectOption({
    '3': '退款中',
    '4': '已退款'
})
let invoiceOptions = formatSelectOption(invoiceType)
let depositStatusOptions = formatSelectOption(depositStatusType)
let commentOptions = formatSelectOption(commentType)
let paymentTermOptions = formatSelectOption(paymentTermType)

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '行程编号',
            key: 'randomId',
            searchFilterType: 'string',
            placeholder: '行程编号，如“A1B2C3”'
        },
        {
            type: 'text',
            name: '预订人手机',
            key: 'bookingMemberMobile',
            searchFilterType: 'string',
            placeholder: '请输入预订人手机'
        },
        {
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编号'
        },
        {
            type: 'multiple-select',
            name: '订单来源',
            key: 'source',
            selectData: sourseOptions,
            renderSelectData: sourseType,
            searchFilterType: 'multiple-select',
            placeholder: '请选择订单来源'
        },
        {
            type: 'multiple-select',
            name: '订单状态',
            key: 'orderStatus',
            selectData: orderStatusOptions,
            renderSelectData: sourseType,
            searchFilterType: 'multiple-select',
            placeholder: '请选择订单状态'
        },
        {
            type: 'multiple-select',
            name: '退款状态',
            key: 'refundStatus',
            selectData: refundStatusOptions,
            renderSelectData: sourseType,
            searchFilterType: 'multiple-select',
            placeholder: '请选择退款状态'
        },
        {
            type: 'datepicker',
            name: '预定日期',
            key: 'bookingDate',
            searchFilterType: 'datepicker',
            placeholder: '请选择预定日期'
        }, {
            type: 'datepicker',
            name: '入住日期',
            key: 'checkinDate',
            searchFilterType: 'datepicker',
            placeholder: '请选择入住日期'
        },
        {
            type: 'select',
            name: '发票订单',
            key: 'isNeedInvoice',
            selectData: invoiceOptions,
            renderSelectData: sourseType,
            searchFilterType: 'select',
            placeholder: '请选择发票订单'
        },
        {
            type: 'select',
            name: '保证金冻结',
            key: 'depositStatus',
            selectData: depositStatusOptions,
            renderSelectData: sourseType,
            searchFilterType: 'select',
            placeholder: '请选择保证金冻结状态'
        },
        {
            type: 'select',
            name: '是否已评价',
            key: 'canComment',
            selectData: commentOptions,
            renderSelectData: sourseType,
            searchFilterType: 'select',
            placeholder: '请选择评价状态'
        },
        {
            type: 'selectInput',
            name: '城市',
            key: 'cityName',
            placeholder: '请输入城市',
            searchFilterType: 'select',
            searchService: orderService.getCityList,
            optionfield: {
                resListName: 'list',
                optValue: 'name',
                optText: 'name'
            }
        },
        {
            type: 'select',
            name: '路客收款',
            key: 'paymentTerm',
            selectData: paymentTermOptions,
            renderSelectData: sourseType,
            searchFilterType: 'select',
            placeholder: '请选择路客收款状态'
        }
    ],
    export: null
}

@connect(state => ({
    orderList: state.order.orderList,
    currentOrder: state.order.currentOrder,
    total: state.order.total
}))

export default class Order extends Component {
    constructor () {
        super()
        this.state = {
            showTable: true,
            tableDate: [],
            detailsData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            sortedInfo: null,
            moreVisible: false,
            payLogData: [],
            id: '',
            statusNotEqual: 0,
            operationType: '',
            sorterA: '',
            loading: true,
            operateLoading: false,
            searchFields: {},
            currentOrderId: 0,
            isShowSetOrder: false,
            isShowCancleOrder: false,
            orderRecord: {},
            drawerVisible: false
        }
    }

    componentDidMount () {
        const { hotelId } = this.props
        if (hotelId) {
            this.setState({
                searchFields: {
                    ...this.state.searchFields,
                    hotelId
                }
            }, this.getOrder)
        }
        //this.getOrder()
        // this.openDetailDrawer()
    }

    // 获取table数据
    getOrder = sortData => {
        const { dispatch, hotelId } = this.props
        let params = {
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            statusNotEqual: this.state.statusNotEqual,
            ...sortData
        }
        if (hotelId) {
            params.hotelId = hotelId
        }
        if (params.orderStatus && !params.orderStatus.length) {
            delete params['orderStatus']
        }

        this.setState({ loading: true })
        dispatch(getOrderList(params))
            .then((data) => {
                this.setState({
                    showTable : false,
                    loading: false
                })
            })
            .catch(() => {
                this.setState({ loading: false })
        })
    }
    // 搜索数据
    onSearch = (searchFields) => {
        let payload = {}
        for (let [key, obj] of Object.entries(searchFields)) {
            payload[key] = obj.value
        }

        this.setState({
            pageNum: 1,
            searchFields: payload
        }, this.getOrder)
    }

    //更多
    onMore = (record) => () => {
        this.setState({
            moreVisible: true,
            payLogData: record.payLogs
        })
    }

    //异议
    onDissent = (record) => () => {
        this.setState({
            visible: true,
            id: record.bookingId,
            operationType: "orderDissent"
        })
    }
    onOrderCancel = (record) => {
        this.setState({
            visible: true,
            id: record.bookingId,
            operationTpye: "orderCancel"
        })
    }
    showSetOrder = () => {
        this.setState({
            isShowSetOrder: true
        })
    }
    showCancleOrder = () => {
        this.setState({
            isShowCancleOrder: true
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            moreVisible: false
        })
    }
    showEverCancleOrder = (record) => {
        const { dispatch } = this.props
        dispatch(getOrderDetail(record.id)).then(() => {
            this.setState({
                isShowSetOrder: true,
                orderRecord: record
            })
        }).catch(() => {

        })
    }
    //修改订单
    onSetOrderSubmit = (val) => {
        const { bookingId } = this.props.currentOrder
        let params = {
            orderId: bookingId,
            amount: val.amount,
            checkInDate: val.checkinDate ? moment(val.checkinDate).format('YYYY-MM-DD') : undefined,
            checkOutDate: val.checkoutDate ? moment(val.checkoutDate).format('YYYY-MM-DD') : undefined,
            houseSourceId: val.houseSourceId
        }
        if(this.state.operateLoading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            operateLoading: true
        })
        orderService.orderEditUpdate(params).then(res => {
            this.setState({
                isShowSetOrder: false,
                operateLoading: false
            }, () => {
                this.getOrder()
                this.openDetailDrawer(this.orderItem)
                message.success('修改成功')
            })
        }).catch(err => {
            this.setState({
                operateLoading: false
            })
        })
    }
    //取消路客收款手工订单
    onCancleOrderSubmit = (val) => {
        const { bookingId } = this.props.currentOrder
        let params = {
            bookingId: bookingId,
            depositPriceBack: val.totalPrice
        }
        if(this.state.operateLoading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            operateLoading: true
        })
        orderService.handOrderCancel(bookingId).then(res => {
            this.setState({
                isShowCancleOrder: false,
                operateLoading: false
            }, () => {
                this.getOrder()
                this.openDetailDrawer(this.orderItem)
                message.success('取消成功')
            })
        }).catch(err => {
            this.setState({
                operateLoading: false
            })
        })
    }
    //原来的取消订单
    cancleOrderConfirm = (record) => {
        if(this.state.loading) {
            message.warning('提交中，请稍后!')
            return;
        }
        this.setState({
            loading: true
        })
        orderService.orderCloseTuJia({
            bookingId: record.id
        }).then((res) =>{
            this.setState({
                loading: false
            })
            this.getOrder()
            message.success('关闭成功')
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    // 点击排序
    handleChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            if (sorter.order === 'descend') {
                this.setState({
                    sorterA: 'desc'
                })
            } else if (sorter.order === 'ascend') {
                this.setState({
                    sorterA: 'asc'
                })
            }
            this.getOrder({ orderBy: (sorter.field + ' ' + this.state.sorterA) })
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

    openDetailDrawer = record => {
        const { dispatch } = this.props
        this.orderItem = record
        dispatch(getOrderIdOrder(record))
        dispatch(getOrderDetail(record.id)).then(() => {
            this.setState({
                extendData:{apiOrderId:record.apiOrderId},
                drawerVisible: true
            })
        }).catch(() => {

        })
    }

    closeDetailDrawer = () => {
        this.setState({
            drawerVisible: false
        })
    }
    // 主体
    render () {
        const self = this
        const { orderList } = this.props
        const { isShowSetOrder,isShowCancleOrder, orderRecord } = this.state
        const scroll = {
            x: 2300,
            y: false
        }

        const columns = [{
            title: '行程编号（订单号）',
            dataIndex: 'randomId',
            key: 'randomId',
            width: 150,
            render: function (text, record, index) {
                return record.apiOrderId ? record.apiOrderId : record.randomId
            }
        }, {
            title: '订单来源',
            dataIndex: 'source',
            key: 'source',
            width: 150,
            render: function (text, record, index) {
                if(text === 'OTHER') {
                    return <span>其他-{record.sourceRemark}</span>
                }else if(text === 'LONG_TERM'){
                    return <span>长租-{record.sourceRemark}</span>
                }else{
                    return <span>{sourseType[text] || text}</span>
                }

            }
        }, {
            title: '预定人姓名',
            dataIndex: 'bookingMemberName',
            key: 'bookingMemberName',
            width: 150
        }, {
            title: '预订人手机',
            dataIndex: 'bookingMemberMobile',
            key: 'bookingMemberMobile',
            width: 150
        }, {
            title: '房源城市',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 150
        }, {
            title: '房源编码',
            dataIndex: 'houseNo',
            key: 'houseNo',
            width: 150
        }, {
            title: '预订日期',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        }, {
            title: '入住日期',
            dataIndex: 'checkinDate',
            key: 'checkinDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        }, {
            title: '退房日期',
            dataIndex: 'checkoutDate',
            key: 'checkoutDate',
            width: 150,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        }, {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: 150,
            render: val => <span>{orderStatusType[val]}</span>
        }, {
            title: '退款进度',
            dataIndex: 'refundStatus',
            key: 'refundStatus',
            width: 150,
            render: val => {
                // 只显示已退款和退款中的退款进度
                if (val !== '3' || val !== '4') return '/'
                return <span>{refundStatusMap[val]}</span>
            }
        }, {
            title: '是否已评价',
            dataIndex: 'canComment',
            key: 'canComment',
            width: 150,
            render: val => <span>{commentType[val]}</span>
        }, {
            title: '是否冻结保证金',
            dataIndex: 'depositStatus',
            key: 'depositStatus',
            width: 150,
            render: val => <span>{depositStatusType[val]}</span>
        }, {
            title: '发票订单',
            dataIndex: 'isNeedInvoice',
            key: 'isNeedInvoice',
            width: 150,
            render: val => String(val) === '1' ? <Icon type="check" /> : <Icon type="close" />
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={function () {
                            self.openDetailDrawer(record)}
                        }
                           style={{color: '#1890ff'}}
                        >
                            详情
                        </a>
                        {/*{*/}
                            {/*record.source === "MINI_PROGRAM" || record.source === "APP" || record.source === "MP" || record.source === "H5" || record.source === "WEB" ? null :*/}
                                {/*<a style={{color: '#1890ff', marginLeft: 10}}*/}
                                   {/*onClick={function () {*/}
                                       {/*self.showEverCancleOrder(record)*/}
                                   {/*}}*/}
                                {/*>修改订单</a>*/}
                        {/*}*/}
                        {/*{*/}
                            {/*record.source === "MINI_PROGRAM" || record.source === "APP" || record.source === "MP" || record.source === "H5" || record.source === "WEB" ? null :*/}
                                {/*<Popconfirm placement="topLeft" title="确定取消订单吗？" onConfirm={function () {*/}
                                    {/*self.cancleOrderConfirm(record)*/}
                                {/*}} okText="Yes" cancelText="No"*/}
                                {/*>*/}
                                    {/*<a style={{color: '#1890ff', marginLeft: 10}}>取消订单</a>*/}
                                {/*</Popconfirm>*/}
                        {/*}*/}
                    </div>

                )
            }
        }]
        searchConfig.columns = columns
        const pageObj = {
            total: Number(this.props.total || 0),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.getOrder)
            },
            onChange: (value, pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.getOrder)
            }
        }
        return (
            <div>
                <OrderDetail
                    extendData={this.state.extendData}
                    currentOrderId={this.state.currentOrderId}
                    visible={this.state.drawerVisible} onClose={this.closeDetailDrawer}
                    showSetOrder={this.showSetOrder}
                    showCancleOrder={this.showCancleOrder}
                />
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(orderList)} />
                {
                    this.state.showTable ? '请输入搜索条件，点击搜索。' :
                    <Table
                        bordered
                        scroll={scroll}
                        columns={columns}
                        dataSource={checkKey(orderList)}
                        rowKey="randomId"
                        loading={this.state.loading}
                        onChange={this.handleChange}
                        pagination={pageObj}
                    />
                }
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
                {
                    isShowSetOrder ?
                        <SetModal
                            visible
                            data={orderRecord}
                            stateChange={this.stateChange}
                            onSubmit={this.onSetOrderSubmit}
                        /> : null
                }
                {
                    isShowCancleOrder ?
                        <CancleModal
                            visible
                            data={orderRecord}
                            stateChange={this.stateChange}
                            onSubmit={this.onCancleOrderSubmit}
                        /> : null
                }
            </div>
        )
    }
}
