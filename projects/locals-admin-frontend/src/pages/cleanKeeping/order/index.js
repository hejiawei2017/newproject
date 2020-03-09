import React, {Component} from 'react'
import SubTable from '../../../components/subTable/index'
import Search from '../../../components/search/index'
import {cleanKeeping} from '../../../utils/dictionary'
import {cleanKeepingService} from '../../../services'
import {dataFormat, searchObjectSwitchArray} from "../../../utils/utils";
import { Modal, Row, Col, Table, Tag, Icon } from 'antd';
import {message} from "antd/lib/index"


let searchConfig = {
    items: [

        {
            type: 'text',
            name: '保洁单号',
            key: 'cleanOrderCode',
            searchFilterType: 'string',
            placeholder: '请输入保洁单号'
        },{
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编码'
        },{
            type: 'text',
            name: '保洁员姓名',
            key: 'cleanerName',
            searchFilterType: 'string',
            placeholder: '请输入保洁员姓名'
        },{
            type: 'text',
            name: '保洁员电话',
            key: 'cleanerPhone',
            searchFilterType: 'string',
            placeholder: '请输入保洁员电话'
        },{
            type: 'text',
            name: '管家姓名',
            key: 'assistName',
            searchFilterType: 'string',
            placeholder: '请输入管家姓名'
        },{
            type: 'text',
            name: '管家手机',
            key: 'phone',
            searchFilterType: 'string',
            placeholder: '请输入手机号码'
        },{
            type: 'select',
            name: '订单状态',
            key: 'orderStatus',
            selectData: searchObjectSwitchArray(cleanKeeping.orderStatus),
            searchFilterType: 'select',
            placeholder: '请选择订单状态'
        }
    ]
}
class CleanKeepingOrderList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isRepeat: false,
            orderId: '',
            searchFields: {},
            showModalDetail: false,
            showModalImage: false,
            orderInfoDetail: {
                orderRuleDetails: []
            },
            showImageUrl: null
        }
    }

    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                cleanOrderCode: searchFields.cleanOrderCode.value,
                cleanerName: searchFields.cleanerName.value,
                cleanerPhone: searchFields.cleanerPhone.value,
                houseNo: searchFields.houseNo.value,
                assistName: searchFields.assistName.value,
                phone: searchFields.phone.value,
                orderStatus: searchFields.orderStatus.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleCancel = () => {
        this.setState({
            showModalDetail: false
        })
    }

    render () {
        let that = this
        const {orderInfoDetail} = this.state
        const columns = [
            {title: '保洁单号', dataIndex: 'orderCode', width: 100},
            {title: '房源编码', dataIndex: 'houseSourceNo', width: 150, render: (val,record) => {
                    return (
                        <span>{!!record.houseSourceInfo && record.houseSourceInfo.houseSourceNo}</span>
                    )
                }},
            {title: '房源地址', dataIndex: 'address', width: 250, render: (val,record) => {
                return (
                    <span>{!!record.houseSourceInfo && record.houseSourceInfo.address}</span>
                )
            }},
            {title: '保洁员姓名', dataIndex: 'cleanerName', width: 150},
            {title: '保洁员电话', dataIndex: 'cleanerPhone', width: 150},
            {title: '房源管家姓名', dataIndex: 'assistName', width: 150, render: (val, record) => {
                return (
                    <span>{!!record.houseSourceInfo && record.houseSourceInfo.assistName}</span>
                )
            }},
            {title: '管家手机号', dataIndex: 'assistPhone', width: 150, render: (val, record) => {
                return <span>{!!record.houseSourceInfo && record.houseSourceInfo.assistPhone}</span>
            }},
            {title: '保洁类型', dataIndex: 'orderType', width: 150, render: val => {
                    return (
                        <span>{cleanKeeping.orderType[val]}</span>
                    )
                }},
            {title: '原清洁费', dataIndex: 'cleanFee', width: 150},
            {title: '应付清洁费', dataIndex: 'totalFee', width: 150},
            {title: '保洁评价', dataIndex: 'cleanResult', width: 150},
            {title: '保洁发起时间', dataIndex: 'waitAcceptTime', width: 150, render: val => {
                return (
                    <span>{dataFormat(val, 'YYYY-MM-DD HH:MM:SS')}</span>
                )
                }},
            {title: '订单状态', dataIndex: 'orderStatus', width: 150, render: val => {
                return (
                    <span>{cleanKeeping.orderStatus[val]}</span>
                )
            }}
        ];
        const subTableItem = {
            getTableService: cleanKeepingService.getOrderTable,
            searchFields: this.state.searchFields,
            columns: columns,
            refsTab: function (ref) {
                that.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "orderId",
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    cleanKeepingService.getOrderDetail(record.orderId).then(res => {
                        that.setState({
                            showModalDetail: true,
                            orderInfoDetail: res
                        })
                    })
                },
                text: '保洁记录'
            }],
            operatBtnFixed: 'right',
            operatBtnWidth: 150
        }

        const detailColumns = [{
            title: '步骤',
            dataIndex: 'ruleDetailName',
            key: 'ruleDetailName'
        },{
            title: '图片凭证',
            dataIndex: 'orderImages',
            key: 'orderImages',
            render: (val, record) => {
                return (
                    <div>
                        {
                            record.orderImages && record.orderImages.map(item => {
                                return (
                                    <img
                                    key={item.id}
                                    alt=""
                                    style={{width: 80, height: 80, margin: 5, cursor: 'pointer'}}
                                    src={item.image}
                                    onClick={function () {
                                        that.setState({
                                            showImageUrl: item.image,
                                            showModalImage: true
                                        })
                                    }}
                                    />
                                    )
                            })
                        }
                    </div>
                )
            }
        },{
            title: '存在问题',
            dataIndex: 'remark',
            key: 'remark'
        }]

        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    this.state.showModalDetail ?
                        <Modal
                            visible
                            width={700}
                            title="保洁订单详情"
                            className="hideModel-okBtn"
                            onCancel={this.handleCancel}
                        >
                            <Row>
                                <Col span={12}>保洁类型: {cleanKeeping.ruleType[orderInfoDetail.ruleType]}</Col>
                                <Col span={12}>派单方式：{cleanKeeping.orderType[orderInfoDetail.orderType]}</Col>
                                <Col span={12}>归属公司：{orderInfoDetail.companyName}</Col>
                                <Col span={12}>城市区域：{orderInfoDetail.cityName}</Col>
                                <Col span={12}>保洁人姓名：{orderInfoDetail.cleanerName}</Col>
                                <Col span={12}>保洁人手机：{orderInfoDetail.cleanerPhone}</Col>
                                <Col span={12}>保洁实际开始时间：{dataFormat(orderInfoDetail.cleaningTimeStart, 'YYYY-MM-DD HH:MM:SS')}</Col>
                                <Col span={12}>保洁实际结束时间：{dataFormat(orderInfoDetail.cleaningTimeEnd, 'YYYY-MM-DD HH:MM:SS')}</Col>
                            </Row>
                            <h1 style={{fontSize: 14, fontWeight: 500}}>保洁反馈记录</h1>
                            <div style={{margin: 10}}>
                                {
                                    orderInfoDetail.orderRuleDetails && orderInfoDetail.orderRuleDetails.map(item => {
                                        return !!item.remark ? <Tag color="gold" style={{fontSize: 14}} key={'tag_remark_' + item.steps}><Icon type="warning" style={{ fontSize: '18px'}}/>{item.remark}</Tag> : null
                                    })
                                }
                            </div>
                            <Table bordered dataSource={orderInfoDetail.orderRuleDetails} rowKey="steps" columns={detailColumns} pagination={false} />
                        </Modal> : null
                }
                {
                    this.state.showModalImage ?
                        <Modal
                            width={550}
                            visible
                            className="hideModel-okBtn"
                            onCancel={function () {
                                that.setState({showModalImage: false})
                            }}
                        >
                        <img alt="" style={{width: 500, margin: 15}} src={this.state.showImageUrl} />
                    </Modal> : null
                }
            </div>
        )
    }
}

export default CleanKeepingOrderList
