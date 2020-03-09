import React, { Component } from 'react'
import SubTable from '../../components/subTable'
import { newLandlordWalletService } from '../../services'
import Search from '../../components/search'
import { checkKey, getStandardDateBeforeWeek, dataFormat } from '../../utils/utils'
class freezeDetails extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{
                freezeAccountingDateGreaterThan: getStandardDateBeforeWeek(new Date())
            },
            dataSource: null,
            search:false
        }
    }
    componentDidMount () {}
    onSearch = (searchFields) => {
        let str1,str2
        let params
        if(searchFields.accountingTime.value){
            str1 = dataFormat(searchFields.accountingTime.value[0],'YYYY-MM-DD'); //时间对象
            // console.log(str1)
            //str1 = date1.getTime(); //转换成时间戳
            str2 = dataFormat(searchFields.accountingTime.value[1],'YYYY-MM-DD'); //时间对象
            //str2 = date2.getTime(); //转换成时间戳
        }
        if(searchFields.frozenType.value === '0'){
            params = {
                freezeAccountingDateGreaterThan:getStandardDateBeforeWeek(new Date())
            }
        }else if(searchFields.frozenType.value === '1'){
            params = {
                accountingDateGreaterThanEq:getStandardDateBeforeWeek(new Date()),
                oweSumGreaterThanEq:0
            }
        }else if(searchFields.frozenType.value === '2'){
            params = {
                oweSumLessThan: 0
            }
        }
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
            searchFields: {
                confirmationCode: searchFields.confirmationCode.value,
                houseNo: searchFields.houseNo.value,
                expectAccountingTimeGreaterThanEq: str1,
                expectAccountingTimeLessThanEq: str2,
                payType: searchFields.payType.value,
                ...params
            }
        }, this.renderTable)
    }
    getTableData = () =>{
        let payTypeIn = ''
        payTypeIn += 'detailType=freeze&'
        payTypeIn += 'orderBy=accounting_time desc&'
        payTypeIn += 'unionId=' + this.props.currentViewData.unionId + '&'
        if(this.state.search){
            payTypeIn += 'accountId=' + this.props.currentViewData.accountId
        }else{
            payTypeIn += 'accountId=' + this.props.currentViewData.accountId + '&'
            this.props.freezeData.forEach((item,index)=>{
                if(index === (this.props.freezeData.length - 1)){
                    payTypeIn += 'payTypeIn=' + item.payTypeIn
                }else{
                    payTypeIn += 'payTypeIn=' + item.payTypeIn + '&'
                }
            })
        }
        return payTypeIn
    }
    getTableService = (data) =>{
        return newLandlordWalletService.getFreezeDetail(this.getTableData(), data)
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
            exportType: 'render',
            key: 'payType',
            width: 200,
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
            title: '冻结日期',
            dataIndex: 'accountingTime',
            exportType: 'date',
            key: 'accountingTime',
            width: 150,
            render: val => <span>{dataFormat(val,'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '冻结类型',
            dataIndex: 'oweSum',
            exportType: 'render',
            key: 'oweSum',
            width: 150,
            render: val =>(
                <div>{val < 0 ? <span>欠款冻结</span> : <span>7天冻结</span>}</div>
            )
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
                    type: 'rangepicker',
                    name: '冻结日期范围',
                    key: 'accountingTime',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: ''
                }, {
                    type: 'select',
                    name: '冻结类型',
                    key: 'frozenType',
                    defaultValue: '0',
                    selectData: [
                        {value: '0', text: '所有'},
                        {value: '1', text: '7天冻结'},
                        {value: '2', text: '欠款冻结'}
                    ],
                    searchFilterType: 'select',
                    placeholder: '请输入状态'
                }, {
                    type: 'select',
                    name: '打款类型',
                    key: 'payType',
                    defaultValue: '',
                    selectData: typeData,
                    searchFilterType: 'select',
                    placeholder: '请输入选择打款类型'
                }
            ],
            exportFBtn: {
                name: '冻结明细',
                url: `/opt/accounting/account-wallets-freeze-detail-export?${this.getTableData()}`,
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
export default freezeDetails
