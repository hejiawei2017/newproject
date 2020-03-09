import React, { Component } from 'react'
import { financePayService } from '../../services'
import { Table, Button, notification, Modal, message } from 'antd'
import Search from '../../components/search'
import { pageOption, dataFormat, envConfig } from '../../utils/utils'
import { accountsVerifyType, accountsType } from "../../utils/dictionary"
import filterChange from '../../utils/filterChange'

const { confirm } = Modal

let accountsVerifyTypeOptions = []
for (const key in accountsVerifyType) {
    if(key === ''){
        accountsVerifyTypeOptions.unshift({value: key, text: accountsVerifyType[key]})
    }else{
        accountsVerifyTypeOptions.push({value: key, text: accountsVerifyType[key]})
    }
}
let accountsTypeOptions = []
for (const key in accountsType) {
    if(key === ''){
        accountsTypeOptions.unshift({value: key, text: accountsType[key]})
    }else{
        accountsTypeOptions.push({value: key, text: accountsType[key]})
    }
}

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '手机',
            key: 'phone',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        }, {
            type: 'text',
            name: '户名',
            key: 'accountName',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        }, {
            type: 'text',
            name: '账号',
            key: 'account_Id',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        }, {
            type: 'text',
            name: '钱包地址(UnionId)',
            key: 'unionId',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        }, {
            type: 'select',
            name: '验证状态',
            key: 'validStatus',
            searchFilterType: 'select',
            selectData: accountsVerifyTypeOptions,
            renderSelectData: accountsVerifyType,
            defaultValue: '',
            placeholder: '请选择'
        }, {
            type: 'select',
            name: '账户类型',
            key: 'accountType',
            selectData: accountsTypeOptions,
            renderSelectData: accountsType,
            searchFilterType: 'select',
            defaultValue: '',
            placeholder: '请输入'
        }
    ],
    exportFBtn: {
        name: '收款账户数据'
    }
}

const fmt = 'YYYY-MM-DD HH:mm:ss'

class Accounts extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            searchFields:{},
            orderBy: 'create_time desc'
        }
        this.renderTable = this.renderTable.bind(this)
        this.sorterChange = this.sorterChange.bind(this)
        this.stateChange = this.stateChange.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    fixTableFixedCol = () => {
        // 当图片加载完成后撑开列表，触发resize让Table的固定元素重新对齐
        setTimeout( function () {
            window.dispatchEvent(new Event('resize'))
        }, 500)
    }
    renderTable () {
        const {pageNum, pageSize, orderBy, searchFields} = this.state
        const params = {
            pageNum: pageNum,
            pageSize: pageSize
        }
        const {phone, accountName, account_Id, unionId, validStatus, accountType} = searchFields
        phone && (params.phone = phone)
        accountName && (params.accountName = accountName)
        account_Id && (params.account_Id = account_Id)
        unionId && (params.unionId = unionId)
        validStatus && (params.validStatus = validStatus)
        accountType && (params.accountType = accountType)
        orderBy && (params.orderBy = orderBy)
        financePayService.getAccountingAccounts(params).then((data) => {
            const tableData = data.list.map(item => {
                item.createTimes = item.createTime
                item.createTime = dataFormat(item.createTime, fmt)
                item.validStatusList = item.validStatus
                item.validStatus = accountsVerifyType[item.validStatus]
                return item
            })
            this.setState({
                tableData,
                totalCount: Number(data.total) || 0
            }, this.fixTableFixedCol)
        }).catch((e) => { })
    }
    deleteArticlesLabel = (id) => {
        financePayService.deleteArticlesLabel(id).then((data)=>{
            notification.success({
                message: '删除成功！'
            })
            this.renderTable()
        })
    }
    sorterChange = (p, f, sorter) => {
        // 排序
        const keys = [{
            key: 'createTime',
            str: 'create_time'
        }, {
            key: 'orderNumber',
            str: 'order_number'
        }]
        const filter = filterChange(this.state.orderBy,sorter, keys)
        if(filter !== false){
            this.setState({
                orderBy: filter,
                pageNum: 1
            },this.renderTable)
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                phone: searchFields.phone.value,
                accountName: searchFields.accountName.value,
                account_Id: searchFields.account_Id.value,
                unionId: searchFields.unionId.value,
                validStatus: searchFields.validStatus.value,
                accountType: searchFields.accountType.value
            }
        }, this.renderTable)
    }
    showInfo = (inSum, outSum) => {
        Modal.info({
            title: '钱包信息（七天前汇总）',
            okText: '确认',
            content: (
                <div>
                    <p>总收入：￥{inSum}</p>
                    <p>总支出：￥{outSum}</p>
                </div>
            )
        })
    }
    freezeWallet = (unionId) => {
        confirm({
            title: '提示',
            content: '是否冻结该账号？',
            onOk () {
                financePayService.setFreeze(unionId).then(res => {
                    // console.log(res)
                    if (res) {
                        message.success('操作成功')
                    }
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    unfreezeWallet = (unionId) => {
        confirm({
            title: '提示',
            content: '是否解冻该账号？',
            onOk () {
                financePayService.setUnfreeze(unionId).then(res => {
                    // console.log(res)
                    if (res) {
                        message.success('操作成功')
                    }
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    shield = (unionId,_this) => {
        confirm({
            title: '提示',
            content: '是否屏蔽账号？',
            onOk () {
                financePayService.setShield(unionId).then(res => {
                    // console.log(res)
                    if (res) {
                        message.success('操作成功')
                        _this.renderTable()
                    }
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    unShield = (id,_this) => {
        confirm({
            title: '提示',
            content: '是否解屏蔽账号？',
            onOk () {
                financePayService.setUnShield(id).then(res => {
                    // console.log(res)
                    if (res) {
                        message.success('操作成功')
                        _this.renderTable()
                    }
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    walletLink = (unionId) => {
        let wlink = window.open(null,'_target')
        financePayService.getAccountGen(unionId).then(data=>{
            if(data){
                const date = new Date().getTime()
                let src = envConfig.walletUrl(data)
                wlink.location.href = src
                wlink = undefined
            }
        })
    }
    resetAccount = (account) => {
        // let _this = this
        Modal.confirm({
            title: '重置账户确认',
            content: (<div>将要重置账户：
                <p>实名：{account.accountName}</p>
                <p>支付宝：{account.accountNumber}</p>
            </div>),
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                financePayService.postAccountReset(account.id).then(data => {
                    if (data){
                        notification.success({
                            message: '重置成功'
                        })
                    }
                })
            }
        })
    }
    renderButton (record){
        let _this = this
        let _retArr = []
        _retArr.push(<Button size="small" className="mr10" onClick={function (){_this.freezeWallet(record.unionId)}}>冻结</Button>)
        _retArr.push(<Button size="small" className="mr10" onClick={function (){_this.unfreezeWallet(record.unionId)}}>解冻</Button>)
        if(record.unionId.includes("###")){
            _retArr.push(<Button size="small" className="mr10" onClick={function (){_this.unShield(record.id,_this)}}>解除屏蔽</Button>)
        }else{
            _retArr.push(<Button size="small" className="mr10" onClick={function (){_this.shield(record.unionId,_this)}}>屏蔽</Button>)
        }
        _retArr.push(<Button size="small" className="mr10" onClick={function (){_this.walletLink(record.unionId)}}>钱包</Button>)
        _retArr.push(<Button size="small" className="" onClick={function (){_this.resetAccount(record)}}>重置</Button>)
        return _retArr
    }
    render () {
        const _this = this
        accountsType['房东'] = '房东'
        // Table onRow属性：监听table每一行的事件
        const { onRow,selectList } = _this.props
        let onRowEvent = onRow ? {onRow: onRow} : {}
        const columns = [{
            title: '户名',
            key: 'accountName',
            dataIndex: 'accountName',
            width: 138
        }, {
            title: '钱包地址(UnionId)',
            key: 'unionId',
            dataIndex: 'unionId',
            width: 138
        }, {
            title: '账号',
            key: 'accountNumber',
            dataIndex: 'accountNumber'
        }, {
            title: '手机',
            key: 'phone',
            dataIndex: 'phone'
        }, {
            title: '验证状态',
            key: 'validStatus',
            dataIndex: 'validStatus'
        }, {
            title: '账户类型',
            key: 'accountType',
            dataIndex: 'accountType'
        }, {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            width: 102,
            sorter: true
        }, {
            title: '备注',
            key: 'remark',
            width: 70,
            dataIndex: 'remark'
        }, {
            title: '操作',
            fixed: 'right',
            width: 310,
            render: (text, record) => {
                return selectList === 'true' ?
                    (<span>
                        <Button size="small" type="primary" >选中</Button>
                    </span>) :
                    (<span>
                        {this.renderButton(record)}
                    </span>)
            }
        }]
        const _state = this.state
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
        searchConfig.columns = columns
        return (
            <div className="accounts-page">
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={_state.tableData} />
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    rowKey="id"
                    pagination={pageObj}
                    onChange={this.sorterChange}
                    scroll={{ x: 1000 }}
                    {...onRowEvent}
                />
            </div>
        )
    }
}

Accounts.defaultProps = {
    onRow: false
}

export default Accounts