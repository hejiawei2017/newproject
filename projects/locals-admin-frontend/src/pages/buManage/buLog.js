import React, { Component } from 'react'
import Search from '../../components/search'
import { buManageService } from '../../services'
import { pageOption, dataFormat, checkKey } from '../../utils/utils'
import { Table, message } from 'antd'
import moment from 'moment'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '操作人员',
            key: 'operateUser',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入操作人员'
        },
        {
            type: 'rangepicker',
            name: '操作时间',
            key: 'rangeDate',
            defaultValue: '',
            placeholder: ['开始', '结束']
        }
    ]
}

class BuLog extends Component {
    constructor (props) {
        super (props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOpts,
            tableDate: null,
            totalCount: undefined,
            loading: false,
            searchFields: {}
        }
    }
    componentDidMount () {
        this.renderTable()
    }
    getTime = (time) => {
        return `${moment(time).format("YYYY-MM-DD")}`
    }
    parseStartTime = (time) => {
        let date = this.getTime(time)
        let startDate = date + ' 00:00:00'
        return +moment(startDate)
    }
    parseEndTime = (time) => {
        let date = this.getTime(time)
        let EndDate = date + ' 23:59:59'
        return +moment(EndDate)
    }
    onSearch = (searchFields) => {
        let beginDate, endDate
        if (searchFields.rangeDate.value && searchFields.rangeDate.value.length > 0) {
            beginDate = this.parseStartTime(searchFields.rangeDate.value[0])
            endDate = this.parseEndTime(searchFields.rangeDate.value[1])
        }
        this.setState({
            pageNum:1,
            searchFields:{
                operateUser: searchFields.operateUser.value,
                beginDate,
                endDate
            }
        }, this.renderTable)
    }
    renderTable = () => {
        this.setState({loading: true})
        const params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            orderBy: 'operation_date_time desc',
            ...this.state.searchFields
        }
        buManageService.records(params).then((data) => {
            this.setState({
                tableDate: checkKey(data.list),
                totalCount: Number(data.total),
                loading: false
            })
        }).catch(e => {
            this.setState({loading: false})
            message.error('请求失败')
        })
    }
    render () {
        const columns = [{
            title: '操作人员',
            dataIndex: 'operationMember'
        }, {
            title: '日志',
            dataIndex: 'operationContents',
            render: items => {
                return items.map((v, i) => (<p key={i}>{v}</p>))
            }
        }, {
            title: '操作时间',
            dataIndex: 'operationDateTime',
            render: val => <span>{dataFormat(+val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const pageObj = {
            total: this.state.totalCount || 0,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ pageNum: value, pageSize: pageSize }, this.renderTable)
            }
        }
        return (
            <div>
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    dataSource={this.state.tableData}
                />
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.state.tableDate}
                    pagination={pageObj}
                    rowKey="key"
                    loading={this.state.loading}
                />
            </div>
        )
    }
}

export default BuLog