import React, { Component } from 'react'
import { Drawer,Button,message } from 'antd'
import SubTable from '../../components/subTable'
import {accountingService, newLandlordWalletService} from '../../services'
import Search from '../../components/search'
import { checkKey } from '../../utils/utils'
import Details from './details'

class newLandlordWalletForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            visible: false,
            searchFields:{},
            dataSource: null,
            currentView:{},
            currentViewData:{},
            sumView: '',
            houseSourceSumList: '',
            dataList:''
        }
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    renderTable = ()=> {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        let sumOweData
        let sumFreezeData
        let canWithdrawData
        if(searchFields.sumOwe.value === '0'){
            sumOweData = {
                sumOweGreaterThan:0
            }
        }else if(searchFields.sumOwe.value === '1'){
            sumOweData = {
                sumOwe:0
            }
        }
        if(searchFields.sumFreeze.value === '0'){
            sumFreezeData = {
                sumFreezeGreaterThan:0
            }
        }else if(searchFields.sumFreeze.value === '1'){
            sumFreezeData = {
                sumFreeze:0
            }
        }
        if(searchFields.canWithdraw.value === '0'){
            canWithdrawData = {
                canWithdrawGreaterThan:0
            }
        }else if(searchFields.canWithdraw.value === '1'){
            canWithdrawData = {
                canWithdraw:0
            }
        }
        this.setState({
            searchFields:{
                like: searchFields.like.value,
                phone: searchFields.phone.value,
                ...sumOweData,
                ...sumFreezeData,
                ...canWithdrawData
            }
        }, this.renderTable)
    }
    stateChange (obj, fn) {
        this.setState(obj, () => fn && fn())
    }
    getWalletInfo = (accountId,unionId) =>{
        newLandlordWalletService.getWalletInfo({reqSource: 'admin', accountId, unionId}).then((res)=>{
            this.setState({
                dataList:res,
                currentView: res.currentView,
                sumView: res.sumView,
                houseSourceSumList: res.houseSourceSumList
            }, () => {
                if(!!res.houseSourceSumList) {
                    res.houseSourceSumList.forEach(item => {
                        //respNo 长度为32时，是退款单号，不许查询
                        if(item.confirmationCode === null && item.respNo !== null && item.respNo.length < 25) {
                            this.getD3OrderNo(item,res.houseSourceSumList)
                        }
                    })
                }
            })
        })
    }
    //获取第三方订单编号
    getD3OrderNo = (record,list) => {
        newLandlordWalletService.getOrderNo(record.respNo).then(res => {
            //32
            list.forEach(item => {
                if(item.respNo === record.respNo) {
                    if(!!res) {
                        item.confirmationCode = res.randomId
                    }
                }
            })
            this.setState({
                houseSourceSumList: list
            })
        })
    }
    getSubTableDataSource = (dataSource) => {
        this.setState({dataSource : dataSource})
    }
    onClose = () =>{
        this.setState({
            visible: false,
            dataList:'',
            currentView:'',
            sumView:'',
            houseSourceSumList:''
        });
    }
    getWalletSynInfo = () => {
        newLandlordWalletService.getWalletSynInfo({pageNum: 1, pageSize: 20}).then((res)=>{
            message.success({
                message: "同步成功"
            })
        })
    }
    render () {
        let _this = this
        const columns = [{
            title: '钱包编码',
            exportType: 'text',
            key: 'unionId',
            dataIndex: 'unionId',
            width: 250
            // key: 'accountNumber',
            // dataIndex: 'accountNumber'
        }, {
            title: '房东姓名',
            exportType: 'text',
            key: 'accountName',
            dataIndex: 'accountName',
            width: 150
        }, {
            title: '所属BU',
            exportType: 'text',
            key: 'uri',
            dataIndex: 'uri',
            width: 150
        }, {
            title: '房源数',
            exportType: 'render',
            key: 'houseSourceCount',
            dataIndex: 'houseSourceCount',
            width: 100,
            render: (v) => {
                return v ? v : 0
            }
        }, {
            title: '账号余额（￥）',
            exportType: 'render',
            key: 'sumEarnings',
            dataIndex: 'sumEarnings',
            width: 150,
            render: (v, r) => {
                return (r.canWithdraw * 100 + r.sumFreeze * 100) / 100;
            }
        }, {
            title: '可提现金额（￥）',
            exportType: 'text',
            key: 'canWithdraw',
            dataIndex: 'canWithdraw',
            width: 150
        }, {
            title: '冻结金额（￥）',
            exportType: 'text',
            key: 'sumFreeze',
            dataIndex: 'sumFreeze',
            width: 150
        }, {
            title: '欠款（￥）',
            exportType: 'text',
            key: 'sumOwe',
            dataIndex: 'sumOwe',
            width: 150
        }, {
            title: '房东手机',
            exportType: 'text',
            key: 'phone',
            dataIndex: 'phone',
            width: 150
        }]
        const subTableItem = {
            getTableService: newLandlordWalletService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "unionId",
            searchFields: _this.state.searchFields,
            onRow: (record) => {
                return {
                    onClick: () => {
                        _this.getWalletInfo(record.accountId, record.unionId)
                        _this.setState({
                            currentViewData: record,
                            visible: true
                        })
                    }
                };
            },
            setDataSource: _this.getSubTableDataSource,
            antdTableProps: {
                bordered: true
            }
        }
        const searchConfig = {
            items: [
                {
                    type: 'text',
                    name: '手机号',
                    key: 'phone',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入手机号'
                }, {
                    type: 'text',
                    name: '编码/房东',
                    key: 'like',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入钱包编码/房东'
                }, {
                    type: 'select',
                    name: '欠款',
                    key: 'sumOwe',
                    defaultValue: '',
                    selectData: [
                        {value: '', text: '所有（欠款）'},
                        {value: '0', text: '欠款大于0'},
                        {value: '1', text: '欠款等于0'}
                    ],
                    searchFilterType: 'select',
                    placeholder: '请选择欠款类型'
                }, {
                    type: 'select',
                    name: '冻结',
                    key: 'sumFreeze',
                    defaultValue: '',
                    selectData: [
                        {value: '', text: '所有（冻结）'},
                        {value: '0', text: '冻结大于0'},
                        {value: '1', text: '冻结等于0'}
                    ],
                    searchFilterType: 'select',
                    placeholder: '请选择冻结类型'
                }, {
                    type: 'select',
                    name: '可提现',
                    key: 'canWithdraw',
                    defaultValue: '',
                    selectData: [
                        {value: '', text: '所有（可提现）'},
                        {value: '0', text: '可提现大于0'},
                        {value: '1', text: '可提现等于0'}
                    ],
                    searchFilterType: 'select',
                    placeholder: '请选择可提现类型'
                }
            ],
            exportFBtn: {
                name: '房东钱包管理',
                url: `/opt/accounting/account-wallets-export`,
                params: {...this.state.searchFields}
            },
            columns: columns
        }
        return (
            <div>
                <Search onSubmit={_this.onSearch} config={searchConfig} dataSource={checkKey(_this.state.dataSource)} />
                <SubTable {...subTableItem} />
                {(_this.state.dataList) ?
                    <Drawer
                        title=""
                        placement="right"
                        width="100%"
                        onClose={_this.onClose}
                        visible={_this.state.visible}
                        className="landlordWallet"
                    >
                        <Details currentViewData={_this.state.currentViewData} currentView={_this.state.currentView} sumView={_this.state.sumView} houseSourceSumList={_this.state.houseSourceSumList}/>
                    </Drawer>
                    : null
                }
            </div>
        )
    }
}
export default newLandlordWalletForm
