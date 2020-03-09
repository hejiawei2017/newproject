import React, { Component } from 'react'
import SubTable from '../../components/subTable'
import { newLandlordWalletService } from '../../services'
import Search from '../../components/search'
import { checkKey,dataFormat } from '../../utils/utils'
import { tradStatus } from '../../utils/dictionary'

class arrearsDetails extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{},
            dataSource: null,
            search:false
        }
    }
    componentDidMount () { }
    onSearch = (searchFields) => {
        if(searchFields.payType.value){
            this.setState({
                search:true
            })
        }else{
            this.setState({
                search:false
            })
        }
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
    getTableData = () =>{
        let payTypeIn = ''
        payTypeIn += 'orderBy=accounting_time desc&'
        payTypeIn += 'unionId=' + this.props.currentViewData.unionId + '&'
        payTypeIn += 'accountId=' + this.props.currentViewData.accountId + '&'
        if(this.state.search){
            payTypeIn += 'oweSumLessThan=-1'
        }else{
            payTypeIn += 'oweSumLessThan=-1&'
            this.props.arrearData.forEach((item,index)=>{
                if(index === (this.props.arrearData.length - 1)){
                    payTypeIn += 'payTypeIn=' + item.payTypeIn
                }else{
                    payTypeIn += 'payTypeIn=' + item.payTypeIn + '&'
                }
            })
        }
        return payTypeIn
    }
    getTableService = (data) =>{
        return newLandlordWalletService.getArrearsDetail(this.getTableData(), data)
    }
    renderTypeData (typeData) {
        let data = []
        // console.log(typeData)
        for (let i = 0; i < typeData.length; i++) {
            if (typeData[i].value === 2 ||
                typeData[i].value === 3 ||
                typeData[i].value === 9 ||
                typeData[i].value === 20 ||
                typeData[i].value === 21 ||
                typeData[i].value === 25 ||
                typeData[i].value === 27 ||
                typeData[i].value === 29 ||
                typeData[i].value === 30 ||
                typeData[i].value === 31 ||
                typeData[i].value === 32 ||
                typeData[i].value === 39 ||
                typeData[i].value === 50
            ) {
                data.push(typeData[i])
            }
        }
        return data
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
            width: 200
        }, {
            title: '打款类型',
            dataIndex: 'payType',
            width: 150,
            exportType: 'render',
            key: 'payType',
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
            render: (v) => <span>{v || 0}</span>
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
            render: val =><span>{tradStatus[val]}</span>
        }, {
            title: '到账时间',
            dataIndex: 'accountingTime',
            exportType: 'date',
            key: 'accountingTime',
            width: 200,
            render: val =><span>{dataFormat(val,'YYYY-MM-DD HH:mm:ss')}</span>
        },{
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
                    selectData: this.renderTypeData(typeData),
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
                name: '欠款明细',
                url: `/opt/accounting/account-wallets-owe-detail-export?${this.getTableData()}`,
                params: {...this.state.searchFields}
            },
            columns: columns
        }
        const subTableItem = {
            getTableService: this.getTableService,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
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
export default arrearsDetails
