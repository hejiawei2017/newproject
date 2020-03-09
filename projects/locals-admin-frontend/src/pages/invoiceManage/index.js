import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { invoiceManageService } from '../../services'
import Search from '../../components/search'
import { pageOption, dataFormat } from '../../utils/utils.js'
import EditModal from './editModal'

const fmt = 'YYYY-MM-DD HH:mm:ss'
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '行程单号',
            key: 'tripCode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入行程单号'
        },{
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
                '2': '纸质普通发票',
                '3': '专用票'
            },
            searchFilterType: 'select'
        }, {
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
            name: '开票状态',
            key: 'invoiceStatusIn',
            selectData: [
                {value: '0,2', text: '待开票和待寄送'},
                {value: '0', text: '待开票'},
                {value: '1', text: '已开票'},
                {value: '2', text: '待寄送'}
            ],
            defaultValue: '0,2',
            renderSelectData: {
                '0,2': '待开票和待寄送',
                '0': '待开票',
                '1': '已开票',
                '2': '待寄送'
            },
            searchFilterType: 'select'
        }, {
            type: 'select',
            name: '订单状态',
            key: 'bookingStatus',
            selectData: [
                {value: '0', text: '未完成'},
                {value: '1', text: '已完成'}
            ],
            renderSelectData: {
                '0': '未完成',
                '1': '已完成'
            },
            searchFilterType: 'select'
        }
    ]
}

class InvoiceManage extends Component {
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
            editForm: {},
            visible: false,
            tableLoading: false,
            plans: null
        }
        this.stateChange = this.stateChange.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.uploadExpress = this.uploadExpress.bind(this)
        this.uploadInvoice = this.uploadInvoice.bind(this)
        this.labelModalSave = this.labelModalSave.bind(this)
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
                invoiceStatusIn: val.invoiceStatusIn.value,
                bookingStatus: val.bookingStatus.value,
                capitalInflowChannel: val.capitalInflowChannel.value
            }
        }, this.renderTable)
    }
    genExportFBTNConfig=()=>{
        const params = {
            orderBy: 'create_time desc',
            invoiceStatusIn: '0,2'
            // pageNum: this.state.pageNum,
            // pageSize: this.state.pageSize
        }
        const searchFields = this.state.searchFields
        searchFields.tripCode && (params.tripCode = searchFields.tripCode)
        searchFields.invoiceStatusIn && (params.invoiceStatusIn = searchFields.invoiceStatusIn)
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
    stateChange (obj, fn) {
        let self = this
        try {
            switch(obj.editForm.type){
            case "detail" :
                invoiceManageService.getDetail(obj.editForm.id).then((res) => {
                    this.setState({
                        editForm: Object.assign(obj.editForm, {detail : res}),
                        editModalVisible: true
                    }, message.loading('获取数据中...', 0))
                }).catch((e) => {
                    message.warning('无法获取！')
                })
                break
            default :
                this.setState(obj, () => fn && fn())
            }
        } catch (error) {
            self.setState({editModalVisible : false})
        }
    }
    renderTable () {
        const params = {
            orderBy: 'create_time desc',
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            invoiceStatusIn: '0,2'
        }
        const searchFields = this.state.searchFields
        searchFields.tripCode && (params.tripCode = searchFields.tripCode)
        // searchFields.createTimeIn && (params.createTimeIn = searchFields.createTimeIn)
        searchFields.invoiceType && (params.invoiceType = searchFields.invoiceType)
        searchFields.invoiceStatusIn && (params.invoiceStatusIn = searchFields.invoiceStatusIn)
        searchFields.bookingStatus && (params.bookingStatus = searchFields.bookingStatus)

        searchFields.createTimeGreaterThanEqual && (params.createTimeGreaterThanEqual = searchFields.createTimeGreaterThanEqual);
        searchFields.createTimeLessThanEqual && (params.createTimeLessThanEqual = searchFields.createTimeLessThanEqual);
        searchFields.capitalInflowChannel && (params.capitalInflowChannel = searchFields.capitalInflowChannel);

        this.setState({tableLoading : true})
        invoiceManageService.getTable(params).then((res) => {
            // console.log('res-->>', res.list)
            let list = []
            let data = res.list
            for (let i = 0; i < data.length; i++) {
                list.push({
                    id: data[i].id,
                    tripCode: data[i].tripCode,
                    platform: data[i].platform,
                    invoicePrice: data[i].invoicePrice,
                    bookingStatus: data[i].bookingStatus,
                    orderPrice: data[i].orderPrice,
                    updator:data[i].updator,
                    // servicePrice: data[i].invoicePrice - data[i].orderPrice,
                    surplusInvoicePrice: data[i].surplusInvoicePrice,
                    servicePrice: data[i].servicePrice,
                    invoiceType: data[i].invoiceType,
                    titleType: data[i].titleType,
                    createTime: dataFormat(data[i].createTime, fmt),
                    invoiceStatus: data[i].invoiceStatus,
                    updateTime: data[i].updateTime,
                    invoiceTitleId: data[i].invoiceTitleId,
                    capitalInflowChannel:data[i].capitalInflowChannel
                })
            }
            // console.log('-->', list)
            this.setState({
                tableData: list,
                totalCount: Number(res.total) || 0,
                tableLoading : false
            })
        }).catch((e) => {})
    }
    onCancel () {
        this.setState({ visible: false });
    }
    uploadExpress () {
        this.setState({
            visible: true,
            plans: 1
        });
    }
    uploadInvoice () {
        this.setState({
            visible: true,
            plans: 0
        });
    }
    labelModalSave () {
        this.renderTable()
    }
    getFottonButton (record) {
        let that = this
        let list = []
        const btnStyle = {
            className: 'mr-sm mt10',
            size: 'small',
            type: 'primary'
        }
        if (record.bookingStatus === 1 && record.invoiceType === 1 && record.invoiceStatus === 0){
            list.push(<Button {...btnStyle} key="upload" onClick={function () {that.stateChange({editForm: {type: 'pdf',id: record.id}, editModalVisible: true})}} >发票上传</Button>)
        }else if(record.bookingStatus === 1 && record.invoiceType !== 1){
            list.push(<Button {...btnStyle} key="record" onClick={function () {that.stateChange({editForm: {type: 'edit',id: record.id }, editModalVisible: true})}}>快递单号录入</Button>)
        }
        return (<div>
            {list}
            <Button
                {...btnStyle}
                onClick={function () {that.stateChange({
                    editForm: {
                        type: 'detail',
                        id: record.id
                    }})}}
            >发票详情</Button>
        </div>)
    }
    render () {
        const that = this
        const _state = this.state
        const columns = [{
            title: '行程单号',
            dataIndex: 'tripCode',
            width: 200
        }, {
            title: '资金汇入渠道',
            dataIndex: 'capitalInflowChannel',
            width: 100
        }, {
            title: '订单来源',
            dataIndex: 'platform',
            width: 150
        },
        // {
        //     title: '发票金额',
        //     dataIndex: 'invoicePrice',
        //     width: 100
        // },
        {
            title: '剩余开票金额',
            dataIndex: 'surplusInvoicePrice',
            width: 150
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
                case 1:
                    return (<span>电子普通发票</span>)
                case 2:
                    return (<span>纸质普通发票</span>)
                case 3:
                    return (<span>专用票</span>)
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
                default: return ''
                }
            }
        }, {
            title: '订单状态',
            dataIndex: 'bookingStatus',
            width: 100,
            render: (text, record) => {
                if (text === 0) {
                    return (<span>未完成</span>)
                } else {
                    return (<span>已完成</span>)
                }
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 150
        },
        {
            title: '修改者',
            dataIndex: 'updator',
            width: 100
        }, {
            title: '操作',
            width: 200,
            fixed: 'right',
            render: (val, record) => (
                that.getFottonButton(record)
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
                <div className="pt10 mb10 text-right">
                    {/* <Button className="ml10" onClick={this.uploadExpress}>批量导入快递号</Button>
                    <Button className="ml10" onClick={this.uploadInvoice}>批量导入电子发票</Button> */}
                    {/* <Button className="ml10" onClick={this.onDownload}>批量导出</Button> */}
                </div>
                <Table
                    bordered
                    rowKey="id"
                    columns={columns}
                    pagination={pageObj}
                    dataSource={_state.tableData}
                    scroll={{ x: 1750 }}
                    loading={this.state.tableLoading}
                />
                {
                    _state.editModalVisible ? <EditModal _data={_state.editForm} stateChange={that.stateChange} labelModalSave={this.labelModalSave} uploadFun={this.renderTable} /> : null
                }
            </div>
        )
    }
}

export default InvoiceManage
