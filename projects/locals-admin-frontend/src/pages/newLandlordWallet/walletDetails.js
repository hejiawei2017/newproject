import React, { Component } from 'react'
import SubTable from '../../components/subTable'
import { newLandlordWalletService } from '../../services'
import Search from '../../components/search'
import { checkKey,getStandardDateBeforeWeek,dataFormat } from '../../utils/utils'
import { tradStatus } from '../../utils/dictionary'

class walletDetails extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{},
            dataSource:null
        }
    }
    componentDidMount () {}
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                confirmationCode: searchFields.confirmationCode.value,
                houseNo: searchFields.houseNo.value,
                accountingMonth: searchFields.accountingMonth.value,
                payType: searchFields.payType.value,
                respStatus: searchFields.respStatus.value
            }
        }, this.renderTable)
    }
    renderTable = ()=> {
        this.tableThis.renderTable()
    }
    getTableService = (data) =>{
        let payTypeIn = ''
        payTypeIn += 'orderBy=accounting_time desc&'
        payTypeIn += 'unionId=' + this.props.currentViewData.unionId + '&'
        payTypeIn += 'accountId=' + this.props.currentViewData.accountId + '&'
        return newLandlordWalletService.getWalletDetail(payTypeIn, data)
    }
    getSubTableDataSource = (dataSource) => {
        this.setState({dataSource : dataSource})
    }
    render () {
        let _this = this
        let { typeData } = this.props
        const columns = [{
            title: '订单编号',
            dataIndex: 'confirmationCode',
            exportType: 'text',
            key: 'confirmationCode',
            width: 200
        }, {
            title: '房源编码',
            dataIndex: 'houseNo',
            exportType: 'text',
            key: 'houseNo',
            width: 150
        }, {
            title: '打款类型',
            dataIndex: 'payType',
            exportType: 'render',
            key: 'payType',
            width: 150,
            render: val => <div>{ typeData ? typeData.map(function (item,index){
                if(parseInt(item.value,10) === parseInt(val,10)){
                    return <span key={index}>{item.text}</span>
                }else{
                    return ''
                }
                }) : ''
            }</div>
        }, {
            title: '金额（元）',
            dataIndex: 'trsamt',
            exportType: 'render',
            key: 'trsamt',
            width: 150,
            render: (v, obj) => {
                if (obj.payType === 2 ||
                    obj.payType === 3 ||
                    obj.payType === 9 ||
                    obj.payType === 20 ||
                    obj.payType === 21 ||
                    obj.payType === 25 ||
                    obj.payType === 27 ||
                    obj.payType === 29 ||
                    obj.payType === 30 ||
                    obj.payType === 31 ||
                    obj.payType === 32 ||
                    obj.payType === 39 ||
                    obj.payType === 50
                ) {
                    return (<span>-{parseInt(obj.oweSum, 10) === 0 ? (v || 0) : (v || 0)}</span>)
                } else if(obj.payType === 22){
                    return (<span>{ '-' + v}</span>)
                }else {
                    return (<span>{obj.oweSum === null || parseInt(obj.oweSum, 10) === 0 ? (v || 0) : (v || 0)}</span>)
                }
            }
        }, {
            title: '内部流水号',
            dataIndex: 'reqNo',
            exportType: 'text',
            key: 'reqNo',
            width: 250
        }, {
            title: '交易状态',
            dataIndex: 'respStatus',
            exportType: 'render',
            key: 'respStatus',
            width: 150,
            render: (v) => {
                return tradStatus[v]
            }
        }, {
            title: '到账时间',
            dataIndex: 'accountingTime',
            exportType: 'date',
            key: 'accountingTime',
            width: 150,
            render: val =><span>{dataFormat(val,'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '备注',
            dataIndex: 'remark',
            exportType: 'text',
            key: 'remark',
            width: 300
        }]
        const searchConfig = {
            items: [
                {
                    type: 'text',
                    name: '订单编号',
                    key: 'confirmationCode',
                    searchFilterType: 'string',
                    placeholder: '请输入订单编号'
                }, {
                    type: 'text',
                    name: '房源编码',
                    key: 'houseNo',
                    searchFilterType: 'string',
                    placeholder: '请输入房源编码'
                }, {
                    type: 'monthpicker',
                    name: '到账月份',
                    key: 'accountingMonth',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入选择到账月份'
                }, {
                    type: 'select',
                    name: '打款类型',
                    key: 'payType',
                    defaultValue: '',
                    selectData: typeData,
                    searchFilterType: 'select',
                    placeholder: '请输入选择打款类型'
                }, {
                    type: 'select',
                    name: '交易状态',
                    key: 'respStatus',
                    defaultValue: '',
                    selectData: [
                        {value: '', text: '全部'},
                        {value: '1', text: '成功'},
                        {value: '-1', text: '失败'},
                        {value: '0', text: '未确认'}
                    ],
                    searchFilterType: 'select',
                    placeholder: '请输入选择状态'
                }
            ],
            exportFBtn: {
                name: '钱包明细',
                url: `/opt/accounting/account-wallets-walletdetails-detail-export`,
                params: {...this.state.searchFields,
                    ...{
                        unionId:this.props.currentViewData.unionId,
                        accountId:this.props.currentViewData.accountId
                    }
                }
            },
            columns: columns
        }
        const subTableItem = {
            getTableService: this.getTableService,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            searchFields: _this.state.searchFields,
            rowKey: "id",
            //searchFields: this.state.searchFields,
            setDataSource: this.getSubTableDataSource,
            antdTableProps: {
                bordered: true
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(_this.state.dataSource)} />
                <SubTable {...subTableItem} />
            </div>
        )
    }
}
export default walletDetails
