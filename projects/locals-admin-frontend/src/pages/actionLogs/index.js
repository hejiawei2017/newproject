import React, {Component} from 'react'
import {actionLogsService} from '../../services'
import {Table, Button, Modal} from 'antd'
import Search from '../../components/search'
import {pageOption} from '../../utils/utils.js'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '批次号',
            key: 'batchNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入批次号'
        }, {
            type: 'datepicker',
            name: '日期',
            key: 'date',
            searchFilterType: 'datepicker',
            defaultValue: '',
            placeholder: '请选择日期'
        }
    ]
}

class ActionLogs extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            searchFields: {},
            orderBy: 'create_time desc'
        }
        this.onSearch = this.onSearch.bind(this)
        this.sorterChange = this.sorterChange.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.showDetails = this.showDetails.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch (searchFields) {
        this.setState({
            pageNum: 1,
            searchFields: {
                batchNo: searchFields.batchNo.value
            }
        },this.renderTable)
    }
    sorterChange () {
    }
    showDetails (data) {
        if (!data) return
        let content = data.split('|').map(function (item, index) {
            if (!item) return ''
            let childs = item.split('^')
            return (
                <div style={{marginTop: '10px'}} key={index}>
                    <p>流水号：{childs[0]}</p>
                    <p>收款方账号：{childs[1]}</p>
                    <p>收款账号姓名：{childs[2]}</p>
                    <p>付款金额：{childs[3]}</p>
                    <p>状态：{childs[4]}</p>
                    <p style={{color: 'red'}}>原因：{childs[5]}</p>
                    <p>支付宝内部流水号：{childs[6]}</p>
                    <p>完成时间：{childs[7]}</p>
                </div>
            )
        })
        Modal.success({
            title: '详细信息',
            content: (content)
        })
    }
    renderTable () {
        const {orderBy} = this.state
        let params = {}
        orderBy && (params.orderBy = orderBy)
        actionLogsService.getTable(params).then((data) => {
            // console.log('renderTable', data)
            try {
                data.sort((a,b)=> {
                    return a.notifyTime < b.notifyTime ? 1 : -1
                })
            }
            catch (err){
                console.log(err)
            }
            this.setState({
                tableData: data,
                totalCount: data.length
            })
        })
    }
    render () {
        const state = this.state
        const _this = this
        const columns = [{
            title: '批号',
            dataIndex: 'batchNo',
            width: 150
        }, {
            title: '通知时间',
            dataIndex: 'notifyTime',
            width: 150
        }, {
            title: '转账成功明细',
            dataIndex: 'successDetails',
            render: (text, record) => (<span>{record.successDetails ? <Button size="small" onClick={function () {_this.showDetails(record.successDetails)}}>详情</Button> : null}</span>
            ),
            width: 110
        }, {
            title: '转账失败明细',
            dataIndex: 'failDetails',
            render: (text, record) => (<span>{record.failDetails ? <Button size="small" type="danger" onClick={function () {_this.showDetails(record.failDetails)}}>详情</Button> : null}</span>
            ),
            width: 110
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 150
        }, {
            title: '通知次数',
            dataIndex: 'notifyTimes',
            width: 100
        }, {
            title: '通知校验ID',
            dataIndex: 'notifyId',
            width: 300
        }, {
            title: '通知类型',
            dataIndex: 'notifyType',
            width: 150
        }, {
            title: '签名串',
            dataIndex: 'sign',
            width: 300
        }, {
            title: '签名类型',
            dataIndex: 'signType',
            width: 100
        }]
        const pageObj = {
            pageSize: 10,
            total: this.state.totalCount,
            showTotal: (total) => `共 ${total} 条`
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <Table
                    bordered
                    columns={columns}
                    dataSource={state.tableData}
                    rowKey="id"
                    pagination={pageObj}
                    onChange={this.sorterChange}
                    scroll={{ x: 1620 }}
                />
            </div>
        )
    }
}

export default ActionLogs