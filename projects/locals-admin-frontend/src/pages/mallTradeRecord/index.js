import React, { Component } from 'react'
import {maketService} from '../../services'
import Search from '../../components/search'
import {Table, Button, message} from 'antd'
import { pageOption } from '../../utils/utils.js'
import EditLabelModal from './editModal'
import moment from 'moment'
const searchConfig = {
    expand: false,
    items: [
        {
            type: 'rangepicker',
            name: '日期',
            key: 'dateList',
            defaultValue: "",
            selectData: [],
            renderSelectData: [],
            searchFilterType: 'string'
        },
        {
            type: 'text',
            name: '买家姓名',
            key: 'name',
            defaultValue: '',
            placeholder: '请输入买家姓名'
        },
        {
            type: 'text',
            name: '买家手机号',
            key: 'mobile',
            defaultValue: '',
            placeholder: '请输入买家手机号'
        },
        {
            type: 'text',
            name: '支付流水号',
            key: 'tradeNo',
            defaultValue: '',
            placeholder: '请输入支付流水号'
        }
    ]
}
class MallTradeRecord extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            total: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            name: '',
            mobile: '',
            start_time: '',
            end_time: '',
            tradeNo: ''
        }
    }
    componentDidMount (){
        this.getTradeRecord()
    }
    getTradeRecord = () => {
        const {pageNum, pageSize, mobile, start_time, end_time, name, tradeNo} = this.state;
        let params = {
            page: pageNum,
            pageNum: pageSize,
            user_real_name: name,
            user_mobile: mobile,
            trade_no: tradeNo,
            start_time: start_time,
            end_time: end_time,
            pay_type: 'PAY'
        }
        this.setState({
            loading: true
        })
        maketService.getMallTrade(params).then((data) =>{
            this.setState({
                pageNum:data.pageNum,
                tableData:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }

    onSearch = (searchFields) => {
        console.log(searchFields,"searchFields")
        this.setState({
            pageNum: 1,
            mobile: searchFields.mobile.value,
            name: searchFields.name.value,
            tradeNo: searchFields.tradeNo.value,
            start_time: searchFields.dateList.value && searchFields.dateList.value[0],
            end_time: searchFields.dateList.value && searchFields.dateList.value[1]
        }, () => { this.getTradeRecord()})
    }

    render () {
        const _this = this
        const { pageSize, pageSizeOptions, pageNum ,total, tableData, loading} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getTradeRecord()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getTradeRecord()})
            }
        }
        const columns = [{
            title: '用户',
            dataIndex: 'user_real_name',
            width: 150
        }, {
            title: '手机号',
            dataIndex: 'user_mobile',
            width: 150
        }, {
            title: '支付流水号',
            dataIndex: 'trade_no',
            width: 150
        }, {
            title: '最终支付价格',
            dataIndex: 'payment',
            width: 150,
            render: function (text, record) {
                return `${(text / 100).toFixed(2)}`
            }
        }, {
            title: '支付回调价格',
            dataIndex: 'pay_amount',
            width: 150
        }, {
            title: '优惠前商品总价',
            dataIndex: 'total_fee',
            width: 150
        }, {
            title: '订单状态',
            dataIndex: 'trade_status',
            width: 150
        },{
            title: '订单来源',
            dataIndex: 'source_platform',
            width: 150
        },{
            title: '支付状态',
            dataIndex: 'pay_type',
            width: 150
        },{
            title: '状态',
            dataIndex: 'status',
            render: function (text, record) {
                return record.status === 1 ? '使用' : record.status === 0 ? <div style={{color:'#ccc'}}>停用</div> : '预制'
            },
            width: 150
        },{
            title: '创建日期',
            dataIndex: 'create_time',
            render: function (text, record) {
                return moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')
            },
            width: 200
        },{
            title: '支付日期',
            dataIndex: 'pay_time',
            render: function (text, record) {
                if(record.pay_time){
                    return moment(record.pay_time).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            width: 200
        }]
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={tableData}
                    pagination={pagination}
                    rowKey="id"
                />
            </div>
        )
    }
}

export default MallTradeRecord
