import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { operateReportService } from '../../services'
import Search from '../../components/search'
import { Table, Button } from 'antd'
import { checkKey, formatMoney, getTableWidth } from '../../utils/utils'
import EditModal from './editModal'
import './index.less'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '关键字',
            key: 'keywords',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入地址/房源编码/计划编码'
        }, {
            type: 'rangepicker',
            name: '日期范围',
            key: 'date',
            searchFilterType: 'rangepicker'
        }, {
            type: 'select',
            name: '城市',
            key: 'city',
            selectData: []
        }, {
            type: 'select',
            name: '费用科目',
            key: 'costSubject',
            selectData: []
        }
    ]
}

class ReceiptPayment extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: true,
            current: 0,
            total: 0,
            show: false,
            searchFields: {},
            modalData: {},
            life: false,
            manageType: 1,
            typeList: []
        }
    }
    componentDidMount () {
        const { manageType } = this.state
        let searchFields = this.pageInit()
        searchFields.costType = manageType
        this.setState({
            searchFields
        }, () => this.dataInit())
    }
    pageInit = () => {
        const { name, id } = this.props.match.params
        let searchFields = {
            pageNum: 1,
            pageSize: 10
        }
        switch (name) {
        case 'manage':
            searchFields.planIds = [id]
            break
        case 'house':
            searchFields.houseIds = [id]
            break
        default: return ''
        }
        return searchFields
    }
    handleChange = (pag, filters, sorter) => {
        // console.log('change--->', pag)
        const { current, pageSize } = pag
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
    onSubmit = (v) => {
        console.log(v)
        const { manageType } = this.state
        const { date, costSubject, city, keywords } = v
        let searchFields = this.pageInit()
        searchFields.costType = manageType
        if (date.value) {
            searchFields.startTime = date.value[0].split(' ')[0]
            searchFields.endTime = date.value[1].split(' ')[0]
        }
        if (costSubject.value) {
            searchFields.costSubject = costSubject.value
        }
        city.value && (searchFields.city = city.value)
        keywords.value && (searchFields.keywords = keywords.value)
        this.setState({
            searchFields,
            loading: true,
            current: 0
        }, () => this.dataInit())
    }
    dataInit = () => {
        const { searchFields, current } = this.state
        // console.log('params--->', searchFields)
        operateReportService.getPayment(searchFields).then(res => {
            // console.log('收支明细--->', res)
            if (res) {
                const { list } = res
                for (let i = 0; i < list.length; i++) {
                    const { type } = list[i]
                    if (type === 1 || type === 4 || type === 7) {
                        list[i].totalPrice = `+${list[i].totalPrice}`
                    } else if (type === 2 || type === 3 || type === 5) {
                        list[i].totalPrice = `-${list[i].totalPrice}`
                    }
                }
                this.selectInit(res)
                this.setState({
                    dataSource: checkKey(list),
                    loading: false,
                    total: res.total,
                    current,
                    typeList: res.typeList
                })
            } else {
                this.setState({
                    dataSource: [],
                    loading: false,
                    current: 0
                })
            }
        }).catch(err => console.log(err))
    }
    selectInit = (r) => {
        const { manageType } = this.state
        searchConfig.items[2].selectData = this.selectOpts(r.cityList, 'id', 'name')
        // searchConfig.items[3].cascaderOpts = this.cascaderOpts(r.typeList)
        for (let i = 0; i < r.typeList.length; i++) {
            if (parseInt(r.typeList[i].id, 10) === manageType) {
                searchConfig.items[3].selectData = this.selectOpts(r.typeList[i].children, 'id', 'name')
            }
        }
        this.setState({
            show: true
        })
    }
    showModal = (record) => () => {
        this.setState({
            modalData: {}
        }, () => this.receiptInit(record.synEventId))
    }
    hideModal = () => {
        this.setState({
            life: false
        })
    }
    receiptInit = (id) => {
        operateReportService.getReceipt(id).then(res => {
            // console.log('票据--->', res)
            this.setState({
                modalData: res,
                life: true
            })
        }).catch(err => console.log(err))
    }
    goBack = () => {
        this.props.history.go(-1)
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
    changeManageType = (id) => () => {
        let searchFields = this.pageInit(this.props.type)
        searchFields.costType = id
        this.setState({
            searchFields,
            manageType: id,
            dataSource: [],
            loading: true,
            show: false
        }, () => this.dataInit())
    }
    render () {
        const columns = [{
            title: 'lotel编码',
            dataIndex: 'lotelNo',
            width: 150
        }, {
            title: '房源编码',
            dataIndex: 'houseNo',
            width: 150
        }, {
            title: '房源地址',
            dataIndex: 'houseAddress',
            width: 400
        }, {
            title: '费用类型',
            dataIndex: 'costType',
            width: 100
        }, {
            title: '费用科目',
            dataIndex: 'costSubject',
            width: 100
        }, {
            title: '金额（元）',
            dataIndex: 'totalPrice',
            width: 100,
            render: (text, record) => {
                const { type, totalPrice } = record
                if (type === 1 || type === 4 || type === 7) {
                    return (<span className="income">{formatMoney(totalPrice)}</span>)
                } else if (type === 2 || type === 3 || type === 5) {
                    return (<span className="deduct">{formatMoney(totalPrice)}</span>)
                }
            }
        }, {
            title: '时间',
            dataIndex: 'costTime',
            width: 180
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 400
        }, {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => {
                if (record.hasFlow) {
                    return (<Button type="primary" onClick={this.showModal(record)}>查看流程及票据</Button>)
                } else {
                    // return (<Button type="primary" onClick={this.showModal(record)}>查看流程及票据</Button>)
                    return ''
                }
            }
        }]
        const {
            dataSource,
            loading,
            show,
            life,
            modalData,
            current,
            total,
            manageType
        } = this.state
        let pageObj = {
            current,
            total,
            showSizeChanger: true
        }
        return (
            <div className="receiptPayment">
                <div className="receiptPayment__tab mb20">
                    <Button className="mr20" type="primary" shape="circle" icon="arrow-left" onClick={this.goBack}></Button>
                    <p className={manageType === 1 ? 'cup active' : 'cup'} onClick={this.changeManageType(1)}>经营收入</p>
                    <p className={manageType === 2 ? 'cup active' : 'cup'} onClick={this.changeManageType(2)}>经营支出</p>
                </div>
                {show ? <Search config={searchConfig} onSubmit={this.onSubmit} /> : null}
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    onChange={this.handleChange}
                    loading={loading}
                    pagination={pageObj}
                    rowKey="key"
                    scroll={{x: getTableWidth(columns)}}
                    bordered
                />
                <EditModal modalData={modalData} life={life} hideModal={this.hideModal} />
            </div>
        )
    }
}

export default withRouter(ReceiptPayment)