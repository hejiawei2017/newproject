import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { operateReportService } from '../../services'
import Search from '../../components/search'
import { Table, Button } from 'antd'
import { checkKey, formatMoney, getTableWidth } from '../../utils/utils'
import './index.less'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '关键字',
            key: 'houseNoAndAddress',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入房源编码/房源地址'
        }, {
            type: 'rangepickerMonth',
            name: '月份范围',
            key: 'date'
        },{
            type: 'select',
            name: '城市',
            key: 'city',
            selectData: []
        }, {
            type: 'select',
            name: '房源状态',
            key: 'houseStatus',
            selectData: []
        }
    ]
}

class OperateHouse extends Component {
    constructor (props) {
        super(props)
        this.state = {
            columns: [],
            dataSource: [],
            loading: true,
            show: false,
            searchFields: {
                planId: this.props.match.params.id,
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            current: 0
        }
    }
    componentDidMount () {
        this.dataInit()
    }
    onSubmit = (v) => {
        const { houseNoAndAddress, city, houseStatus, date } = v
        let searchFields = {
            planId: this.props.match.params.id,
            pageNum: 1,
            pageSize: 10
        }
        houseNoAndAddress.value && (searchFields.houseNoAndAddress = houseNoAndAddress.value)
        city.value && (searchFields.city = city.value)
        houseStatus.value && (searchFields.houseStatus = houseStatus.value)
        if (date.value) {
            searchFields.startYearMonth = date.value[0]
            searchFields.endYearMonth = date.value[1]
        }
        // console.log(searchFields)
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
        let { searchFields, show, current} = this.state
        const columns = [{
            title: '房源信息',
            dataIndex: 'houseInfo',
            width: 300,
            render: (t, r) => (
                <span>{r.address}，房源编码：{r.houseNo}，户型：{r.roomNumber}房{r.livingNumber}厅，面积：{r.houseArea}平方米，房东：{r.hostName}，助理：{r.assistName}，BU：{r.buName}</span>
            )
        }, {
            title: '房源状态',
            dataIndex: 'houseStatus',
            align: 'center',
            width: 150
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                let url = `#/staffOfficer/operateReport/receiptPayment/house/${record.houseId}`
                return (<a href={url}>查看收支明细</a>)
            }
        }]
        operateReportService.getReport(searchFields).then(res => {
            // console.log('请求结果--->', res)
            let data = [],
                monthSlot = []
            const { city, resultList, status, total, houseCount } = res
            const bank = this.getStatus(status)
            if (resultList.length === 0) {
                current = 0
            }
            if (!show) {
                searchConfig.items[2].selectData = this.selectOpts(city, 'id', 'name')
                searchConfig.items[3].selectData = this.selectOpts(status, 'houseStatusCode', 'houseStatus')
            }
            for (let i = 0; i < resultList.length; i++) {
                let obj = {}
                for (let j = 0; j < resultList[i].monthList.length; j++) {
                    const { yearMonth, livingRate, nightDays, orderCount, inCome, outCome } = resultList[i].monthList[j]
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
                                title: '月度订单量',
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
                    ...resultList[i],
                    houseStatus: bank[resultList[i].houseStatus],
                    ...obj
                })
            }
            columns.splice(2, 0, ...monthSlot)
            this.setState({
                columns: columns,
                dataSource: checkKey(data),
                show: true,
                loading: false,
                total: total,
                current,
                houseCount: houseCount
            })
        }).catch(err => console.log(err))
    }
    getStatus = (status) => {
        let obj = {}
        for (let i = 0; i < status.length; i++) {
            obj[status[i].houseStatusCode] = status[i].houseStatus
        }
        return obj
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
    goBack = () => {
        this.props.history.go(-1)
    }
    render () {
        const {
            columns,
            dataSource,
            loading,
            show,
            current,
            total
        } = this.state
        const pageObj = {
            current,
            total,
            showSizeChanger: true
        }
        return (
            <div className="operateHouse">
                <Button className="mb20" type="primary" shape="circle" icon="arrow-left" onClick={this.goBack}></Button>
                {show ?
                    <Search
                        config={searchConfig}
                        onSubmit={this.onSubmit}
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

export default withRouter(OperateHouse)