import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {goodsOrderService} from '../../services'
import {dataFormat, searchObjectSwitchArray} from "../../utils/utils"
import {cleanKeeping, goodsOrderStatus} from "../../utils/dictionary"
import { Modal,Table } from 'antd';
import moment from 'moment'

import Search from '../../components/search'

let searchConfig = {
    items: [
        {
            type: 'text',
            name: '订单号',
            key: 'id',
            searchFilterType: 'number',
            placeholder: '请输入订单号'
        },
        {
            type: 'select',
            name: '订单状态',
            key: 'orderStatus',
            selectData: searchObjectSwitchArray(goodsOrderStatus),
            searchFilterType: 'select',
            defaultValue: '2',
            placeholder: '请选择'
        },
        {
            type: 'rangepicker',
            name: '选择日期范围',
            key: 'dateList',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        },
        {
            type: 'text',
            name: '预订人手机号码',
            key: 'phone',
            searchFilterType: 'string',
            placeholder: '请输入预订人手机号码'
        },
        {
            type: 'text',
            name: '房源编号',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编号'
        }
    ],
    export: {
        name: '商品订单列表数据'
    }
}
class GoodsOrderList extends Component {
    constructor () {
        super ()
        this.state = {
            searchFields: {
                orderStatus: 2
            },
            showModalVisible: false,
            goodList: [],
            dataSource: null
        }
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        let range = {}
        if (searchFields.dateList.value) {
            range = {
                createTimeGreaterThanEqual: moment(searchFields.dateList.value[0]).format('x'),
                createTimeLessThanEqual: moment(searchFields.dateList.value[1]).format('x')
            }
            this.setState({
                rangeDate: {
                    createTimeGreaterThanEqual: moment(searchFields.dateList.value[0]).format('x'),
                    createTimeLessThanEqual: moment(searchFields.dateList.value[1]).format('x')
                }
            })
        }
        this.setState({
            searchFields:{
                id: searchFields.id.value,
                houseNo: searchFields.houseNo.value,
                phone: searchFields.phone.value,
                orderStatus: searchFields.orderStatus.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1,
                ...range
            }
        }, this.renderTable)
    }
    render () {
        let that = this

        const columns = [
            {title: '订单号', dataIndex: 'orderFlashId', key: 'orderFlashId', width: 200, render: (text, record, index) => {
                    return (
                        <span>{record.orderFlash.id}</span>
                    )
                }},
            {title: '房源编号', dataIndex: 'houseNo', key: 'houseNo', width: 200, render: (text, record, index) => {
                    return (
                        <span>{record.orderFlash.houseNo}</span>
                    )
                }},
            {title: '支付时间', dataIndex: 'payTime', key: 'payTime',exportType: 'date', width: 200, render: (val, record) => <span>{dataFormat(record.orderFlash.payTime, 'YYYY-MM-DD HH:mm:ss')}</span>},
            {title: '支付总金额', dataIndex: 'amount', key: 'amount', width: 150, render: (text, record, index) => {
                    return (
                        <span>{record.orderFlash.amount}</span>
                    )
                }},
            {title: '预订人手机号码', dataIndex: 'phone', key: 'phone', width: 150, render: (text, record, index) => {
                    return (
                        <span>{record.orderFlash.phone}</span>
                    )
                }},
            {title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus', exportType: 'render', width: 150, render: (val, record) => {
                    switch (record.orderFlash.orderStatus) {
                        case 1 :
                            return <span>未支付</span>
                        case 2 :
                            return <span>支付成功</span>
                        case 3:
                            return <span>支付失败</span>
                        case 4:
                            return <span>退款成功</span>
                        case 5:
                            return <span>退款失败</span>
                        default:
                            return null
                    }}
            }

        ]
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: goodsOrderService.getTable,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            setDataSource: (dataSource) => {
                dataSource = JSON.parse(JSON.stringify(dataSource))
                dataSource.forEach((item, index)=>{
                    item.length = index + 1
                })
                this.setState({dataSource})
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            operatBtn: [
                {
                    label: 'button',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: record => {
                        this.setState({
                            showModalVisible: true,
                            goodList: record.goodList || []
                        })
                    },
                    text: '查看商品详情'
                }],
            operatBtnWidth: 150
        };
        const detailColumns = [{
            title: '商品ID',
            dataIndex: 'id',
            key: 'id'
        },{
            title: '商品名称',
            dataIndex: 'title',
            key: 'title'
        },{
            title: '商品实际售价',
            dataIndex: 'retailPrice',
            key: 'retailPrice'
        },{
            title: '购买数量',
            dataIndex: 'buyNum',
            key: 'buyNum'
        }]
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={this.state.dataSource}/>
                <SubTable
                    {...subTableItem}
                />
                {
                    this.state.showModalVisible ? (
                        <Modal
                            visible
                            width={700}
                            title="扫码购订单详情"
                            className="hideModel-okBtn"
                            onCancel={function () {
                                that.setState({
                                    showModalVisible: false
                                })
                            }}
                        >
                            <Table bordered dataSource={this.state.goodList} rowKey="id" columns={detailColumns} pagination={false} />
                        </Modal>
                    ) : null
                }
            </div>
        )
    }
}

export default GoodsOrderList
