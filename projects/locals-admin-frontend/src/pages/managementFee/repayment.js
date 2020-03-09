import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { managementFeeService, financePayService } from '../../services'
import Search from '../../components/search'
import { respToStatusMap } from '../../utils/dictionary.js'
import { SubTable } from '../../components'
import {paymentTypeListSuccess} from '../../actions/payBatch'
import { Spin } from 'antd'

let respToStatusList = []

for (let k in respToStatusMap) {
    if (respToStatusMap.hasOwnProperty(k) && k !== '') {
        respToStatusList.push({value: k, text: respToStatusMap[k]})
    }
}
const mapStateToProps = (state, action) => {
    return {
        payTypeList: state.payBatch.payTypeList,
        payTypeNum: state.payBatch.payTypeNum
    }
}

class Repayment extends Component {
    constructor () {
        super()
        this.state = {
            searchFields: {
                searchNum: 0,
                respStatus: 4
            },
            orderBy: '',
            step: 0,
            tempFileName: null,
            tableData: null
        }
        this.tableThis = null
        this.stateChange = this.stateChange.bind(this)
    }
    componentDidMount () {
        if(!this.props.payTypeList && !this.props.payTypeNum){
            this.getPayList()
        }
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            tableData: null,
            searchFields:{
                searchNum: (this.state.searchFields.searchNum || 0) + 1,
                houseNo: searchFields.houseNo.value,
                confirmationCode: searchFields.confirmationCode.value,
                respStatus: searchFields.respStatus.value,
                payTypeIn: searchFields.payTypeIn.value
            }
        })
    }
    getPayList = () => {
        // 获取支付类型
        financePayService.getPayTypeList().then((data)=>{
            if(data && data.length > 0){
                let payTypeNum = {}
                let payTypeList = {}
                data.map(e=>{
                    payTypeNum[e.name] = e.code
                    payTypeList[e.code] = e
                    return e
                })
                this.props.dispatch(paymentTypeListSuccess({
                    payTypeList,
                    payTypeNum
                }))
            }
        })
    }
    getSelectData = (payTypeList) => {
        if (!payTypeList) { return {} }
        let selectData = []
        for (const key in payTypeList) {
            if (payTypeList.hasOwnProperty(key)) {
                const item = payTypeList[key]
                selectData.push({value: item.code, text: item.name})
            }
        }
        return selectData
    }
    renderPayType = type => {
        const { payTypeList } = this.props
        let text = ''
        for (let key in payTypeList) {
            if (type === payTypeList[key]['code']) {
                text = payTypeList[key]['name']
            }
        }
        return <span>{text}</span>
    }
    render () {
        const { payTypeList } = this.props
        const _this = this
        const _state = this.state
        const searchConfig = {
            items: [
                {
                    type: 'text',
                    name: '房源编码',
                    key: 'houseNo',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入房源编码'
                }, {
                    type: 'monthpicker',
                    name: '月份',
                    key: 'confirmationCode',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入月份'
                }, {
                    type: 'select',
                    name: '返现状态',
                    key: 'respStatus',
                    selectData: respToStatusList,
                    searchFilterType: 'select',
                    defaultValue: '4'
                }, {
                    type: 'multiple-select',
                    name: '款项',
                    key: 'payTypeIn',
                    searchFilterType: 'select',
                    selectData: this.getSelectData(payTypeList)
                }
            ]
        }
        let columns = [{
            title: '房源编号',
            dataIndex: 'houseNo',
            width: 150
        },{
            title: '类型',
            dataIndex: 'payType',
            render: this.renderPayType,
            width: 150
        }, {
            title: '管理费返现/奖励月份',
            dataIndex: 'confirmationCode',
            width: 150
        }, {
            title: '返现金额',
            dataIndex: 'trsamt',
            width: 150
        }, {
            title: '入账房东',
            dataIndex: 'accountName',
            width: 150
        }, {
            title: '入账支付宝',
            dataIndex: 'accountNumber',
            width: 150
        }, {
            title: '计算时间',
            dataIndex: 'createTime',
            dataType: 'time',
            width: 102,
            fmt: 'YYYY-MM-DD HH:mm:ss'
        }, {
            title: '返现状态',
            dataIndex: 'respStatus',
            dataType: 'select',
            selectData: respToStatusMap,
            width: 150
        }, {
            title: '返现时间',
            dataIndex: 'accountingTime',
            dataType: 'time',
            width: 102,
            fmt: 'YYYY-MM-DD HH:mm:ss'
        }]
        const subTableItem = {
            getTableService: managementFeeService.getAccountingList,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: _state.searchFields,
            antdTableProps: {
                bordered: true
            }
        }
        return (
            <div className="repayment-page">
                { payTypeList ? (
                    <Search
                        onSubmit={this.onSearch}
                        config={searchConfig}
                    />
                ) : <Spin className="m0Auto" /> }
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(withRouter(Repayment))