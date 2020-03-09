import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { operateReportService } from '../../services'
import Search from '../../components/search'
import { Table } from 'antd'
import { checkKey, formatMoney, getTableWidth } from '../../utils/utils'
import './index.less'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '编号',
            key: 'lotelNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入Lotal/计划编号'
        }, {
            type: 'rangepickerMonth',
            name: '月份范围',
            key: 'date'
        }, {
            type: 'select',
            name: '城市',
            key: 'city',
            selectData: []
        }
    ]
}

class OperateReport extends Component {
    constructor (props) {
        super(props)
        this.state = {
            columns: [],
            dataSource: [],
            loading: true,
            total: 0,
            current: 0,
            show: false,
            searchFields: {
                pageNum: 1,
                pageSize: 10
            }
        }
    }
    componentDidMount () {
        this.dataInit()
    }
    onSearch = (val) => {
        // console.log(val)
        const { lotelNo, city, date } = val
        let searchFields = {
            pageNum: 1,
            pageSize: 10
        }
        lotelNo.value && (searchFields.lotelNo = lotelNo.value)
        city.value && (searchFields.city = city.value)
        if (date.value) {
            searchFields.startYearMonth = date.value[0]
            searchFields.endYearMonth = date.value[1]
        }
        // console.log('searchFields--->', searchFields)
        this.setState({
            searchFields,
            loading: true,
            current: 0
        }, () => this.dataInit())
    }
    handleChange = (pagination, filters, sorter) => {
        // console.log('change--->', pagination, filters, sorter)
        const { current, pageSize } = pagination
        const { searchFields } = this.state
        searchFields.pageNum = current
        searchFields.pageSize = pageSize
        this.setState({
            searchFields,
            loading: true,
            current
        }, () => {
            this.dataInit()
        })
    }
    dataInit = () => {
        let { searchFields, show, current } = this.state
        const columns = [{
            title: 'lotel编码',
            dataIndex: 'lotelNo',
            width: 200,
            render: (text, record) => {
                let url = `#/staffOfficer/operateReport/operateHouse/${record.planId}`
                return (<a href={url}>{record.lotelNo}</a>)
            }
        }, {
            title: '房源数',
            dataIndex: 'houseCount',
            width: 200
        }, {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => {
                let url = `#/staffOfficer/operateReport/receiptPayment/manage/${record.planId}`
                return (<a href={url}>查看收支明细</a>)}
        }]
        operateReportService.getPlan(searchFields).then(res => {
            let monthSlot = [],
                data = []
            const { city, planList, total, lotelCount, houseCount } = res
            if (planList.length === 0) {
                current = 0
            }
            if (!show) {
                searchConfig.items[2].selectData = this.selectOpts(city, 'id', 'name')
            }
            for (let i = 0; i < planList.length; i++) {
                let obj = {}
                for (let j = 0; j < planList[i].monthList.length; j++) {
                    const { yearMonth, livingRate, nightDays, orderCount, inCome, outCome } = planList[i].monthList[j]
                    if (i === 0) {
                        monthSlot.push({
                            title: yearMonth,
                            children: [{
                                title: '月度入住率',
                                dataIndex: `livingRate${j}`,
                                align: 'center',
                                width: 150
                            }, {
                                title: '月度房晚数',
                                dataIndex: `nightDays${j}`,
                                align: 'center',
                                width: 150
                            }, {
                                title: `月度订单量`,
                                dataIndex: `orderCount${j}`,
                                align: 'center',
                                width: 150
                            }, {
                                title: '月度收入',
                                dataIndex: `inCome${j}`,
                                align: 'center',
                                width: 150,
                                render: (text, record) => {
                                    return (<span>{formatMoney(record[`inCome${j}`])}</span>)
                                }
                            }, {
                                title: '月度支出',
                                dataIndex: `outCome${j}`,
                                align: 'center',
                                width: 150,
                                render: (text, record) => {
                                    return (<span>{formatMoney(record[`outCome${j}`])}</span>)
                                }
                            }]
                        })
                    }
                    obj[`livingRate${j}`] = livingRate
                    obj[`nightDays${j}`] = nightDays
                    obj[`orderCount${j}`] = orderCount
                    obj[`inCome${j}`] = inCome
                    obj[`outCome${j}`] = outCome
                }
                data.push({
                    ...planList[i],
                    ...obj
                })
            }
            columns.splice(2, 0, ...monthSlot)
            this.setState({
                columns,
                dataSource: checkKey(data),
                show: true,
                loading: false,
                total,
                current,
                lotelCount,
                houseCount
            })
        }).catch(err => console.log(err))
    }
    selectOpts = (opts, value, text) => {
        let arr = []
        for (let i = 0; i < opts.length; i++) {
            arr.push({
                value: opts[i][value].toString(),
                text: opts[i][text]
            })
        }
        return arr
    }
    render () {
        const {
            columns,
            dataSource,
            show,
            loading,
            current,
            total
        } = this.state
        const pageObj = {
            current,
            total,
            showSizeChanger: true
        }
        return (
            <div className="operateReport">
                {show ?
                    <Search
                        onSubmit={this.onSearch}
                        config={searchConfig}
                    />
                    : null}
                {show ?
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        onChange={this.handleChange}
                        pagination={pageObj}
                        rowKey="key"
                        loading={loading}
                        scroll={{x: getTableWidth(columns)}}
                        bordered
                    />
                    : null}
            </div>
        )
    }
}

export default withRouter(OperateReport)