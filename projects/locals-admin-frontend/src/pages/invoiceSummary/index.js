import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { invoiceSummaryService } from '../../services'
import Search from '../../components/search'
import { pageOption, dataFormat } from '../../utils/utils.js'
import EditModal from './editModal'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '订单编号',
            key: 'tripCode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入订单编号'
        }, {
            type: 'select',
            name: '资金汇入渠道',
            key: 'capitalInflowChannel',
            selectData: [
                {value: '', text: '全部'},
                {value: '北京路客', text: '北京路客'},
                {value: '江苏宿迁', text: '江苏宿迁'}
            ],
            searchFilterType: 'select',
            defaultValue: '',
            placeholder: '资金汇入渠道'
        },{
            type: 'datepicker',
            name: '开始时间',
            key: 'createTimeGreaterThanEqual',
            searchFilterType: 'string'
        },{
            type: 'datepicker',
            name: '结束时间',
            key: 'createTimeLessThanEqual',
            searchFilterType: 'string'
        }, {
            type: 'select',
            name: '发票类型',
            key: 'invoiceType',
            selectData: [
                {value: '', text: '全部'},
                {value: '1', text: '电子普通发票'},
                {value: '3', text: '专用票'}
            ],
            renderSelectData: {
                '': '全部',
                '1': '电子普通发票',
                '3': '专用票'
            },
            searchFilterType: 'select'
        }, {
            type: 'select',
            name: '开票状态',
            key: 'invoiceStatus',
            selectData: [
                {value: '', text: '全部'},
                {value: '0', text: '待开票'},
                {value: '1', text: '已开票'},
                {value: '2', text: '待寄送'},
                {value: '3', text: '已寄送'},
                {value: '4', text: '已失效'},
                {value: '5', text: '待支付'}
            ],
            renderSelectData: {
                '': '全部',
                '0': '待开票',
                '1': '已开票',
                '2': '待寄送',
                '3': '已寄送',
                '4': '已失效'
            },
            searchFilterType: 'select'
        }
    ]
}

const fmt = 'YYYY-MM-DD HH:mm:ss'

class InvoiceSummary extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            editModalVisible: false,
            searchFields:{},
            tableLoading:false,
            editForm: ''
        }
        this.stateChange = this.stateChange.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.sorterChange = this.sorterChange.bind(this)
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch = (val) => {
        this.setState({
            pageNum:1,
            searchFields:{
                tripCode: val.tripCode.value,
                createTimeGreaterThanEqual: val.createTimeGreaterThanEqual.value,
                createTimeLessThanEqual: val.createTimeLessThanEqual.value,
                invoiceType: val.invoiceType.value,
                invoiceStatus: val.invoiceStatus.value,
                capitalInflowChannel: val.capitalInflowChannel.value
            }
        }, this.renderTable)
    }
    stateChange (obj, fn) {
        let self = this
        try {
            if (obj.editForm.type === "detail") {
                invoiceSummaryService.getDetail(obj.editForm.id).then((res) => {
                    this.setState({
                        editForm: Object.assign(obj.editForm, {detail : res}),
                        editModalVisible: true
                    })
                }).catch((e) => {})
            } else {
                this.setState(obj, () => fn && fn())
            }
        } catch (error) {
            self.setState({editModalVisible : false})
        }
    }
    sorterChange (pagination, filters, sorter) {

    }

    genExportFBTNConfig=()=>{
        const params = {
            orderBy: 'create_time desc'
            // pageNum: this.state.pageNum,
            // pageSize: this.state.pageSize
        }
        const searchFields = this.state.searchFields
        searchFields.tripCode && (params.tripCode = searchFields.tripCode)
        // searchFields.createTimeIn && (params.createTimeIn = searchFields.createTimeIn)
        searchFields.invoiceType && (params.invoiceType = searchFields.invoiceType)
        searchFields.invoiceStatus && (params.invoiceStatus = searchFields.invoiceStatus)

        searchFields.createTimeGreaterThanEqual && (params.createTimeGreaterThanEqual = searchFields.createTimeGreaterThanEqual);
        searchFields.createTimeLessThanEqual && (params.createTimeLessThanEqual = searchFields.createTimeLessThanEqual);
        searchFields.capitalInflowChannel && (params.capitalInflowChannel = searchFields.capitalInflowChannel);
        return {
            name: '发票订单汇总',
            extend:'xls',
            url: `/report/invoice/excel`,
            params
        }
    }
    renderTable () {
        const params = {
            orderBy: 'create_time desc',
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        const searchFields = this.state.searchFields
        searchFields.tripCode && (params.tripCode = searchFields.tripCode)
        // searchFields.createTimeIn && (params.createTimeIn = searchFields.createTimeIn)
        searchFields.invoiceType && (params.invoiceType = searchFields.invoiceType)
        searchFields.invoiceStatus && (params.invoiceStatus = searchFields.invoiceStatus)

        searchFields.createTimeGreaterThanEqual && (params.createTimeGreaterThanEqual = searchFields.createTimeGreaterThanEqual);
        searchFields.createTimeLessThanEqual && (params.createTimeLessThanEqual = searchFields.createTimeLessThanEqual);
        searchFields.capitalInflowChannel && (params.capitalInflowChannel = searchFields.capitalInflowChannel);
        this.setState({tableLoading : true})
        invoiceSummaryService.getTable(params).then((res) => {
            // console.log('-->', res.list)
            let list = []
            let data = res.list
            for (let i = 0; i < data.length; i++) {
                list.push({
                    id: data[i].id,
                    tripCode: data[i].tripCode,
                    invoicePrice: data[i].invoicePrice,
                    orderPrice: data[i].orderPrice,
                    // servicePrice: data[i].invoicePrice - data[i].orderPrice,
                    servicePrice: data[i].servicePrice,
                    surplusInvoicePrice: data[i].surplusInvoicePrice,
                    invoiceType: data[i].invoiceType,
                    titleType: data[i].titleType,
                    createTime: dataFormat(data[i].createTime, fmt),
                    invoiceStatus: data[i].invoiceStatus,
                    invoiceTitleId: data[i].invoiceTitleId,
                    capitalInflowChannel:data[i].capitalInflowChannel
                })
            }
            // console.log('list-->', list)
            this.setState({
                tableData: list,
                totalCount: Number(res.total) || 0,
                tableLoading : false
            })
        }).catch((e) => {})
    }
    render () {
        const that = this
        const _state = this.state
        const columns = [{
            title: '订单编号',
            dataIndex: 'tripCode',
            width: 200
        }, {
            title: '资金汇入渠道',
            dataIndex: 'capitalInflowChannel',
            width: 100
        },{
            title: '剩余开票金额',
            dataIndex: 'surplusInvoicePrice',
            width: 100
        }, {
            title: '开票金额',
            dataIndex: 'orderPrice',
            width: 100
        }, {
            title: '发票服务费金额',
            dataIndex: 'servicePrice',
            width: 130
        }, {
            title: '发票类型',
            dataIndex: 'invoiceType',
            width: 150,
            render: (text, record) => {
                switch (text) {
                case 1: return (<span>电子普通发票</span>)
                case 3: return (<span>专用票</span>)
                default: return ''
                }
            }
        }, {
            title: '抬头类型',
            dataIndex: 'titleType',
            width: 100,
            render: (text, record) => {
                if (text === 1) {
                    return (<span>个人</span>)
                } else {
                    return (<span>企业</span>)
                }
            }
        }, {
            title: '提交时间',
            dataIndex: 'createTime',
            width: 150
        }, {
            title: '开票状态',
            dataIndex: 'invoiceStatus',
            width: 100,
            render: (text, record) => {
                switch (text) {
                case 0: return (<span>待开票</span>)
                case 1: return (<span>已开票</span>)
                case 2: return (<span>待寄送</span>)
                case 3: return (<span>已寄送</span>)
                case 4: return (<span>已失效</span>)
                case 5: return (<span>待支付</span>)
                default: return ''
                }
            }
        }, {
            title: '操作',
            width: 100,
            fixed: 'right',
            render: (val, record) => (
                <Button
                    type="primary"
                    className="mr-sm"
                    size="small"
                    onClick={function () {that.stateChange({
                        editForm: {
                            id: record.id,
                            type: 'detail'
                        }})}}
                >查看</Button>
            )
        }]
        const pageObj = {
            total: _state.totalCount,
            pageSize: _state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: _state.pageSizeOptions,
            current: _state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.renderTable)
            }
        }
        searchConfig.exportBlob = this.genExportFBTNConfig();
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <Table
                    bordered
                    rowKey="id"
                    columns={columns}
                    pagination={pageObj}
                    dataSource={_state.tableData}
                    scroll={{ x: 1100 }}
                    loading={this.state.tableLoading}
                />
                {
                    _state.editModalVisible ? <EditModal _data={_state.editForm} stateChange={that.stateChange} /> : null
                }
            </div>
        )
    }
}

export default InvoiceSummary
