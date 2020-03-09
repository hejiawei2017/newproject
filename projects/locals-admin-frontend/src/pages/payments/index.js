import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, message, Button, Modal, Row, Col, Popover, Tag } from 'antd'
import { pageOption, dataFormat, checkKey } from '../../utils/utils'
import { dicModel, respStatusMap } from '../../utils/dictionary'
import { paymentsService, accountingService } from '../../services'
import { paymentTypeList } from '../../actions/acounting'
import Search from '../../components/search'

const { confirm } = Modal

let selectStatusMap = [{value: '', text: '全部'}]

for (let k in respStatusMap) {
    if (respStatusMap.hasOwnProperty(k)) {
        selectStatusMap.push({value: k, text: respStatusMap[k]})
    }
}

const mapStateToProps = state => {
    return {
        paymentTypeList: state.paymentTypeList
    }
}

class walletDetail extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            totalCount: 0,
            isLoading: true,
            isGetPaymentType: true,
            isShowDetail: false,
            isShowBooking: false,
            detail: null,
            bookingData: null,
            sorterA: ''
        }
    }
    componentDidMount () {
        this.renderTable()
        if (!this.props.paymentTypeList.length) {
            this.getPaymentTypeList()
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                confirmationCode: searchFields.confirmationCode.value,
                accountName: searchFields.accountName.value,
                phone: searchFields.phone.value,
                respStatus: searchFields.respStatus.value,
                payType: searchFields.payType.value,
                houseNo: searchFields.houseNo.value,
                respNo: searchFields.respNo.value,
                reqNo: searchFields.reqNo.value,
                accountingDate: searchFields.accountingDate.value,
                accountNumber: searchFields.accountNumber.value
            }
        }, this.renderTable)
    }
    handleSortChange = (pagination, filters, sorter) => {
        if(sorter.order){
            this.setState({
                sorterA : sorter.order === 'ascend' ? 'asc' : 'desc'
            }, () => {
                this.renderTable({orderBy:(sorter.field + ' ' + this.state.sorterA)})
            })
        }
    }
    renderTable = (sortData) => {
        this.setState({
            isLoading: true
        })
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...this.state.searchFields,
            ...sortData
        }
        paymentsService.getPaymentDetails(params).then(data => {
            this.setState({
                tableData: data.list,
                totalCount: data.total,
                isLoading: false
            })
        }).catch(e => {
            this.setState({
                isLoading: false
            })
        })
    }
    getPaymentTypeList = () => {
        accountingService.getPaymentTypeList().then(data => {
            this.props.dispatch(paymentTypeList(data))
            this.setState({
                isGetPaymentType: false
            })
        }).catch(e => {
            message.error('支付类型无法获取!')
        })
    }
    closeModal = () => {
        this.setState({
            isShowDetail: false,
            isShowBooking: false
        })
    }
    showDetailModal = (id) => {
        const state = this.state
        state.tableData.forEach(v => {
            if (v.id === id) {
                this.setState({
                    detail: v,
                    isShowDetail: true
                })
            }
        })
    }
    showBooking = (respNo) => {
        this.setState({isShowBooking: true})
        accountingService.getBooking(respNo).then(data => {
            if (!data) {
                message.error('原订单被删除')
            }
            this.setState({
                bookingData: data,
                isShowBooking: true
            })
        })
    }
    bookingModal = () => {
        const state = this.state
        const data = state.bookingData
        if (!data) {
            return null
        }
        let list = [{
            key: '订单号',
            value: data.randomid
        }, {
            key: '流水号',
            value: data.id
        }, {
            key: '状态',
            value: data.bookingstate
        }, {
            key: '房源ID',
            value: data.housesourceid
        }, {
            key: '入住时间',
            value: dataFormat(data.checkindate, 'YYYY-MM-DD HH:mm:ss')
        }, {
            key: '离店时间',
            value: dataFormat(data.checkoutdate, 'YYYY-MM-DD HH:mm:ss')
        }, {
            key: '清洁费',
            value: data.clearprice
        }, {
            key: '优惠价格',
            value: data.discountprice
        }, {
            key: '房费',
            value: data.roomprice
        }, {
            key: '总价格',
            value: data.totalprice
        }, {
            key: '到账信息',
            value: data.remitaccountid
        }, {
            key: '到账时间',
            value: dataFormat(data.remitaccountdate, 'YYYY-MM-DD HH:mm:ss')
        }, {
            key: '备注',
            value: data.remark
        }]
        return (
            this.renderModal('详情', state.isShowBooking, list)
        )
    }
    detailModal = () => {
        const state = this.state
        const detail = state.detail
        if (!detail) {
            return null
        }
        let list = [{
            key: 'ID',
            value: detail.id
        }, {
            key: '订单号',
            value: detail.confirmationCode
        }, {
            key: '备注',
            value: detail.remark
        }, {
            key: '手机',
            value: detail.phone
        }, {
            key: '内部流水号',
            value: detail.respNo
        }, {
            key: '原始订单状态变化',
            value: detail.respReason
        }]
        return (
            this.renderModal('详情', state.isShowDetail, list)
        )
    }
    renderModal = (title, visible, list) => {
        const leftCol = {
            align: 'right',
            span: 8
        }
        const rightCol = {
            span: 16
        }
        return (
            <Modal
                {...dicModel}
                title={title}
                className="hideModel-okBtn"
                visible={visible}
                onCancel={this.closeModal}
            >
                {list.map(v=>(
                    <Row key={v.key}>
                        <Col {...leftCol}>{v.key}：</Col>
                        <Col {...rightCol}>{v.value}</Col>
                    </Row>
                ))}
            </Modal>
        )
    }
    renderContent = (content) => {
        if (!content) return null
        const output = <div className="w200">{content}</div>
        return (
            <Popover content={output}>
                <div className="ellipsis">{content}</div>
            </Popover>
        )
    }
    confirmLocalsOrder = (id) => {
        let self = this
        confirm({
            title: '提示',
            content: '是否确认该收款订单？',
            onOk () {
                paymentsService.confirmAirbnbPay(id).then(res => {
                    // console.log(res)
                    message.success('操作成功')
                    self.renderTable()
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    manurlConfirmAccount = (id) => {
        let self = this
        confirm({
            title: '提示',
            content: '是否确认已到账？',
            onOk () {
                paymentsService.manualConfirm(id).then(res => {
                    // console.log(res)
                    message.success('操作成功')
                    self.renderTable()
                }).catch(err => console.log(err))
            },
            onCancel () {
            }
        })
    }
    render () {
        const paymentTypeList = this.props.paymentTypeList
        const self = this
        const state = this.state
        const scroll = {
            x: 2000,
            y: false
        }
        let dataList = state.tableData.map((v, i) => {
            v['respStatusName'] = respStatusMap[v.respStatus] || ''
            if (paymentTypeList.has(v.payType)) {
                let paymentItem = paymentTypeList.get(v.payType)
                let calculate = paymentItem.calculate
                let name = paymentItem.name
                if (calculate !== 0) {
                    v['finallyTrsamt'] = v.trsamt * calculate
                } else {
                    v['finallyTrsamt'] = v.trsamt
                }
                v['payTypeName'] = name || ''
            }
            return v
        })
        const columns = [{
            title: '订单号',
            dataIndex: 'confirmationCode',
            key: 'confirmationCode',
            exportType: 'text',
            align: 'center',
            width: 100
        }, {
            title: '支付类型',
            dataIndex: 'payTypeName',
            key: 'payTypeName',
            align: 'center',
            width: 100,
            exportType: 'text'
        }, {
            title: '金额(元)',
            dataIndex: 'finallyTrsamt',
            key: 'finallyTrsamt',
            exportType: 'text',
            align: 'center',
            width: 100
        }, {
            title: '内部流水号',
            dataIndex: 'respNo',
            key: 'respNo',
            exportType: 'text',
            align: 'center',
            width: 300,
            render: (respNo, record) => {
                let payType = record.payType
                if (payType === 1 || payType === 11 || payType === 4 || payType === 5) {
                    return <Button type="primary" size="small" onClick={function () {self.showBooking(respNo)}}>原始订单ID({respNo})</Button>
                } else {
                    return respNo
                }
            }
        }, {
            title: '交易状态',
            dataIndex: 'respStatusName',
            key: 'respStatusName',
            exportType: 'text',
            align: 'center',
            width: 100,
            render: (respStatusName, record) => {
                let color = record.respStatus === 1 ? 'green' : record.respStatus === -1 ? 'red' : 'blue'
                return <Tag color={color}>{respStatusName}</Tag>
            }
        }, {
            title: '到账时间',
            dataIndex: 'accountingTime',
            key: 'accountingTime',
            exportType: 'date',
            align: 'center',
            width: 200,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            exportType: 'text',
            align: 'center',
            width: 250,
            render: this.renderContent
        }, {
            title: '流水号',
            dataIndex: 'reqNo',
            key: 'reqNo',
            exportType: 'text',
            align: 'center',
            width: 300
        }, {
            title: '手机',
            dataIndex: 'phone',
            key: 'phone',
            exportType: 'text',
            align: 'center',
            width: 150
        }, {
            title: '项目编号',
            dataIndex: 'houseNo',
            key: 'houseNo',
            exportType: 'text',
            align: 'center',
            width: 100
        }, {
            title: '房东',
            dataIndex: 'accountName',
            key: 'accountName',
            exportType: 'text',
            align: 'center',
            width: 100
        }, {
            title: '支付宝',
            dataIndex: 'accountNumber',
            key: 'accountNumber',
            exportType: 'text',
            align: 'center',
            width: 150
        }, {
            title: '操作',
            fixed: 'right',
            align: 'center',
            width: 100,
            render: (val, record) => {
                // console.log(record)
                return (
                <div>
                    {record.payType === 41 || record.payType === 42 ?
                        <Button
                            type="primary"
                            className="mr-sm"
                            size="small"
                            onClick={function () {self.confirmLocalsOrder(record.id)}}
                        >改为爱彼迎房款</Button> : null}
                    {record.respStatus === 0 ?
                        <Button
                            type="primary"
                            className="mr-sm"
                            size="small"
                            onClick={function () {self.manurlConfirmAccount(record.id)}}
                        >人工确认到账</Button> : null}
                    <Button
                        size="small"
                        onClick={function () {self.showDetailModal(record.id)}}
                    >详情</Button>
                </div>
            )}
        }]
        let selectPayTypeMap = [{value: '', text: '全部'}]
        let renderPayTypeMap = []
        paymentTypeList.forEach((val, key) => {
            selectPayTypeMap.push({value: val.code, text: val.name})
            renderPayTypeMap[val.code] = val.name
        })
        const pageObj = {
            total: Number(state.totalCount || 0 ),
            pageSize: state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: state.pageSizeOptions,
            current: state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.renderTable)
            }
        }
        const searchConfig = {
            items: [{
                type: 'text',
                name: '订单号',
                key: 'confirmationCode',
                searchFilterType: 'string'
            }, {
                type: 'select',
                name: '支付类型',
                key: 'payType',
                selectData: selectPayTypeMap
            }, {
                type: 'text',
                name: '内部流水号',
                key: 'respNo',
                searchFilterType: 'string'
            }, {
                type: 'select',
                name: '交易状态',
                key: 'respStatus',
                selectData: selectStatusMap
            }, {
                type: 'monthpicker',
                name: '到账时间',
                key: 'accountingDate',
                placeholder: '月份'
            }, {
                type: 'text',
                name: '流水号',
                key: 'reqNo',
                searchFilterType: 'string'
            }, {
                type: 'text',
                name: '手机',
                key: 'phone',
                searchFilterType: 'string'
            }, {
                type: 'text',
                name: '项目编号',
                key: 'houseNo',
                searchFilterType: 'string'
            }, {
                type: 'searchuser',
                name: '房东',
                key: ['accountName']
            }, {
                type: 'text',
                name: '支付宝',
                key: 'accountNumber',
                searchFilterType: 'string'
            }],
            exportFBtn: {
                name: `流水查询`,
                url: `/opt/accounting/account-wallets-current-detail-export`,
                params: this.state.searchFields
            },
            columns: columns.slice(0, -1)
        }
        return (
            <div>
                {paymentTypeList.size ?
                    <Search
                        onSubmit={this.onSearch}
                        config={searchConfig}
                        dataSource={checkKey(dataList)}
                    /> : null}
                <Table
                    size="middle"
                    bordered
                    rowKey="id"
                    scroll={scroll}
                    columns={columns}
                    pagination={pageObj}
                    dataSource={checkKey(dataList)}
                    onChange={this.handleSortChange}
                    loading={state.isLoading || state.isGetPaymentType}
                />
                {this.detailModal()}
                {this.bookingModal()}
            </div>
        )
    }
}

walletDetail = connect(mapStateToProps)(walletDetail)

export default walletDetail