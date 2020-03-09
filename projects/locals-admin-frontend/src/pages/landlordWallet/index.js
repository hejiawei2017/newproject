import React, { Component } from 'react'
import { Modal, Row, Col, Button,notification } from 'antd';
import { landlordWalletService } from '../../services'
import Search from '../../components/search'
import { dataFormat } from '../../utils/utils';
import { SubTable } from '../../components';
import { checkKey } from '../../utils/utils'
import './index.less'

class LandlordWallet extends Component {
    constructor () {
        super()
        this.state = {
            searchFields:{
                searchNum: 0
            },
            currentView:{},
            currentViewData:{},
            sumView:{},
            houseSourceSumList:[],
            modalView: false,
            orderBy: '',
            rangeDate: null,
            dataSource: null
        }
        this.tableThis = null
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        let range = {}
        if (searchFields.dateList.value) {
            range = {
                accountingDateAfter: searchFields.dateList.value[0],
                accountingDateBeforeAndEq: searchFields.dateList.value[1]
            }
            this.setState({
                rangeDate: {
                    accountingDateAfter: searchFields.dateList.value[0],
                    accountingDateBeforeAndEq: searchFields.dateList.value[1]
                }
            })
        }
        let searchObject = {
            phone: searchFields.phone.value,
            accountName: searchFields.accountName.value,
            accountNumber: searchFields.accountNumber.value,
            unionId: searchFields.unionId.value,
            houseSourceCount: searchFields.houseSourceCount.value,
            sumOwe: searchFields.sumOwe.value,
            canWithdraw: searchFields.canWithdraw.value
        }
        this.setState({
            pageNum:1,
            searchFields: {
                searchNum: (this.state.searchFields.searchNum || 0) + 1,
                ...searchObject,
                ...range
            }
        })
    }
    getWalletInfo = (accountId,unionId) => {
        landlordWalletService.getWalletInfo({reqSource: 'admin', accountId, unionId}).then((res)=>{
            // console.log(res)
            this.setState({
                currentView: res.currentView,
                sumView: res.sumView,
                houseSourceSumList: res.houseSourceSumList
            })
        })
    }
    getWalletSynInfo = (accountId,unionId) => {
        landlordWalletService.getWalletSynInfo({pageNum: 1, pageSize: 20}).then((res)=>{
            notification.success({
                message: "同步成功"
            })
        })
    }
    getSubTableDataSource = (dataSource) => {
        this.setState({dataSource})
    }
    render () {
        const _this = this
        const _state = this.state
        const { currentView, sumView, modalView, houseSourceSumList, currentViewData, rangeDate, dataSource } = _state
        const columns = [{
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: 200,
            exportType: 'render',
            render: (h, row) => {
                if (row.accountingDateAfter === null) return '截至当前日期'
                return dataFormat(row.accountingDateAfter) + '至' + dataFormat(row.accountingDateBeforeAndEq)
            }
        }, {
            title: '钱包地址',
            exportType: 'text',
            key: 'unionId',
            width: 200,
            dataIndex: 'unionId'
        }, {
            title: '房东姓名',
            exportType: 'text',
            key: 'accountName',
            width: 200,
            dataIndex: 'accountName'
        }, {
            title: '房东手机',
            exportType: 'text',
            key: 'phone',
            width: 200,
            dataIndex: 'phone'
        }, {
            title: '房源数',
            exportType: 'text',
            key: 'houseSourceCount',
            width: 200,
            dataIndex: 'houseSourceCount',
            render: (v) => <span>{v || 0}</span>
        }, {
            title: '可提现金额(￥)',
            exportType: 'text',
            key: 'canWithdraw',
            width: 200,
            dataIndex: 'canWithdraw'
        }, {
            title: '冻结金额(￥)',
            exportType: 'text',
            key: 'sumFreeze',
            width: 200,
            dataIndex: 'sumFreeze'
        }, {
            title: '欠款(￥)',
            exportType: 'text',
            key: 'sumOwe',
            width: 200,
            dataIndex: 'sumOwe'
        }]
        const subTableItem = {
            getTableService: landlordWalletService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "unionId",
            searchFields: _state.searchFields,
            headerDom: {
                otherDom: <Button type="primary" onClick={_this.getWalletSynInfo}>同步数据</Button>
            },
            onRow: (record) => {
                return {
                    onClick: () => {
                        _this.getWalletInfo(record.accountId, record.unionId)
                        _this.setState({
                            currentViewData: record,
                            modalView: true
                        })
                    }
                };
            },
            setDataSource: this.getSubTableDataSource,
            antdTableProps: {
                bordered: true
            }
        }
        const searchConfig = {
            items: [
                {
                    type: 'rangepicker',
                    name: '选择日期范围',
                    key: 'dateList',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: ''
                }, {
                    type: 'text',
                    name: '手机',
                    key: 'phone',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入手机'
                }, {
                    type: 'text',
                    name: '姓名',
                    key: 'accountName',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入姓名'
                }, {
                    type: 'text',
                    name: '账户',
                    key: 'accountNumber',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入账户'
                }, {
                    type: 'text',
                    name: '钱包地址(UnionId)',
                    key: 'unionId',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入钱包地址'
                }, {
                    type: 'text',
                    name: '房源数',
                    key: 'houseSourceCount',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入房源数'
                }, {
                    type: 'text',
                    name: '欠款',
                    key: 'sumOwe',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入欠款'
                }, {
                    type: 'text',
                    name: '可提现',
                    key: 'canWithdraw',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入可提现'
                }
            ],
            exportFBtn: {
                name: `房东钱包管理`
            },
            columns: columns
        }
        const modalItem = {
            className: "landlordWallet-modal",
            title:'钱包管理',
            visible: modalView,
            onCancel: ()=>_this.setState({modalView: false}),
            footer: null,
            width: 800
        }
        return (
            <div className="landlordWallet-page">
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    dataSource={checkKey(dataSource)}
                />
                <SubTable
                    {...subTableItem}
                />
                <Modal {...modalItem}>
                    <div>
                        <div className="borderBottom">钱包地址：{currentViewData.unionId}（姓名：{currentViewData.accountName} 手机：{currentViewData.phone}）</div>
                        <div className="borderBottom">
                            <div>钱包现状</div>
                            <Row className="mt10">
                                <Col span="5" className="text-center">
                                   可提现金额（￥）<br />{currentView.canWithdraw || 0}
                                </Col>
                                <Col span="5" className="text-center">
                                   冻结金额（￥）<br />{currentView.sumFreeze || 0}
                                </Col>
                                <Col span="5" className="text-center">
                                   欠款金额（￥）<br />{currentView.sumOwe || 0}
                                </Col>
                                <Col span="5" className="text-center">
                                   累计收益（￥）<br />{currentView.sumEarnings || 0}
                                </Col>
                                <Col span="4" className="text-center">
                                   累计提现（￥）<br />{currentView.sumWithdraw || 0}
                                </Col>
                            </Row>
                        </div>
                        <div className="borderBottom">
                            <div>
                                日期：{ rangeDate ? (
                                    <span>
                                        {rangeDate.accountingDateAfter} 至 {rangeDate.accountingDateBeforeAndEq}
                                    </span>
                                ) : (
                                    <span>截至当前日期</span>
                                ) }
                            </div>
                            <Row className="mt10">
                                <Col span="6">当前收入：¥{sumView.sumIn || 0}</Col>
                                <Col span="6">当前支出：¥{sumView.sumOut || 0}</Col>
                                <Col span="6">当前盈亏：¥{sumView.sumEarnings || 0}</Col>
                                <Col span="6">当前提现：¥{sumView.sumWithdraw || 0}</Col>
                            </Row>
                            <Row className="mt10">
                                <Col span="6">当前可提现：¥{sumView.canWithdraw || 0}</Col>
                                <Col span="6">当前冻结：¥{sumView.sumFreeze || 0}</Col>
                                <Col span="6">当前欠款：¥{sumView.sumOwe || 0}</Col>
                                <Col span="6">欠费清理：¥{sumView.sumRecharge || 0}</Col>
                            </Row>
                        </div>
                        <div>
                            <div>房源收支</div>
                            <div className="details__content--income mt10 mb10">
                                {(houseSourceSumList && houseSourceSumList.length > 0) && (houseSourceSumList.map((item,index) => {
                                    if(item.houseNo === '')return null
                                    return (
                                        <div key={"houseSourceSumList-list-" + index}>
                                            <div>
                                                <span className="mr5">房源编码：{item.houseNo}</span>
                                                <span className="mt5">{item.address === null ? '(历史房源)' : `房源地址：${item.address}`}</span>
                                            </div>
                                            <div className="mt5">
                                                <span className="mr5">收入：&yen; {item.sumIn}</span>
                                                <span className="mr5">支出：&yen; {item.sumOut}</span>
                                                <span>盈亏：&yen; {item.sumEarn}</span>
                                            </div>
                                        </div>
                                    )
                                }))}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default LandlordWallet