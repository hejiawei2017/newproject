import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { financePayService } from '../../services'
import { Table, Button, notification, Tabs, Modal} from 'antd'
import { dataFormat, pageOption } from '../../utils/utils'
import { alipayBatchReqStatus, alipayBatchRespStatus } from '../../utils/dictionary'
import {SearchParent} from '../../components'
import {paymentTypeListSuccess} from '../../actions/payBatch'
import './index.less'
const TabPane = Tabs.TabPane

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '批号',
            key: 'batchNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入批号'
        }
    ],
    exportFBtn: {
        name: '导出批次数据'
    }
}
const searchBatchDetailConfig = {
    items: [
        {
            type: 'text',
            name: '关键字',
            key: 'keyword',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入关键字'
        }, {
            type: 'select',
            name: '支付类型',
            key: 'payType',
            searchFilterType: 'select',
            defaultValue: '',
            placeholder: '请输入打款类型'
        }
    ],
    exportFBtn: '导出明细数据'
}
const mapStateToProps = (state, action) => {
    return {
        payTypeList: state.payBatch.payTypeList,
        payTypeNum: state.payBatch.payTypeNum
    }
}
const fmt = 'YYYY-MM-DD HH:mm:ss'

class AlipayBatch extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            payTypeList: {},
            payTypeNum: {},
            batchesList: [],
            step: 0,
            tempFileName: null,
            batchNum: null,
            tabsActiveKey: '1',
            batchNo: null,
            batchId: null,
            searchFields: {},
            searchbatchDetailsFields: {},
            batchDetailsList: [],
            batchDetailsVisibel: false,
            pageSizeOptions: pageOption.pageSizeOpts,
            pageSize: pageOption.pageSize,
            pageNo: 0,
            detailListPageSize: pageOption.pageSize,
            detailListPageNo: 0,
            orderBy: 'create_time desc'
        }
        this.fromDataWrap = null
    }
    componentDidMount () {
        if(this.props.payTypeList && this.props.payTypeNum){
            this.setState({
                payTypeList: this.props.payTypeList,
                payTypeNum: this.props.payTypeNum
            })
            this.setSearchBatchDetailConfig(this.props.payTypeList, this.props.payTypeNum)
        }else{
            this.getPayList()
        }
        this.getPayBatchesList()
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
                this.setSearchBatchDetailConfig(payTypeList, payTypeNum)
                this.props.dispatch(paymentTypeListSuccess({
                    payTypeList,
                    payTypeNum
                }))
                this.setState({
                    payTypeList,
                    payTypeNum
                })
            }
        })
    }
    setSearchBatchDetailConfig = (payTypeList, payTypeNum) => {
        let selectData = []
        let renderSelectData = {}
        for (const key in payTypeNum) {
            if (payTypeNum.hasOwnProperty(key)) {
                const item = payTypeNum[key]
                selectData.push({value: item, text: key})
                renderSelectData[item] = key
            }
        }
        selectData.unshift({value: '', text: '全部'})
        renderSelectData[''] = '全部'
        searchBatchDetailConfig.items[1].selectData = selectData
        searchBatchDetailConfig.items[1].renderSelectData = renderSelectData
    }
    getPayBatchesList = () => {
        // 获取批次列表
        const {searchFields, orderBy} = this.state
        const params = {
            ...searchFields
        }
        orderBy && (params.orderBy = orderBy)
        financePayService.getPayBatchesList(params).then((data)=>{
            if(data && data.length > 0){
                data.map(i => {
                    if(i.createTime){
                        i.createTimes = i.createTime
                        i.createTime = dataFormat(i.createTime, fmt)
                    }
                    if(i.reqTime){
                        i.reqTimes = i.reqTime
                        i.reqTime = dataFormat(i.reqTime, fmt)
                    }
                    return i
                })
                this.setState({
                    batchesList: data
                })
            }
        })
    }
    getPayDetailsList = () => {
        // 获取批次明细列表
        const {batchNo, batchId,searchbatchDetailsFields,orderBy} = this.state
        const params = {
            ...searchbatchDetailsFields,
            batchNo,
            batchId
        }
        orderBy && (params.orderBy = orderBy)
        financePayService.paymentDetailsList(params).then((data)=>{
            if(data){
                data.map(i => {
                    if(i.createdTime){
                        i.createdTimes = i.createdTime
                        i.createdTime = dataFormat(i.createdTime, fmt)
                    }
                    return i
                })
                this.setState({
                    batchDetailsList: data
                })
            }
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    changeTabs = (e) => {
        if(e === '2' && (!this.state.batchNo)){
            notification.warning({
                message: '请选择一个批次'
            })
        }
    }
    onSearch = (searchFields)=>{
        this.setState({
            pageNo: 0,
            searchFields:{
                batchNo: searchFields.batchNo.value
            }
        }, this.getPayBatchesList)
    }
    onbatchDetailSearch = (searchFields)=>{
        this.setState({
            detailListPageNo: 0,
            searchbatchDetailsFields:{
                keyword: searchFields.keyword.value,
                payType: searchFields.payType.value
            }
        }, this.getPayDetailsList)
    }
    onPayClick (batchNo) {
        const _this = this
        financePayService.accountingGenBtn({batchNo: batchNo}).then((data)=>{
            if(data){
                const divFrom = <div ref={function (ref){_this.fromDataWrap = ref}} dangerouslySetInnerHTML={{__html: data}}></div>
                Modal.confirm({
                    title: '付款确认',
                    okText: '确认',
                    cancelText: '取消',
                    content: <div>{`如点击确认，代表您已确认该批次付款(${batchNo})，系统将向支付宝发送付款申请`}{divFrom}</div>,
                    onOk () {
                        _this.fromDataWrap.children[0].submit()
                    },
                    onCancel () {
                    }
                })
            }
        })
    }
    onModalCancel = () => {
        this.setState({
            batchDetailsVisibel: false,
            batchDetailsList: []
        })
    }
    render () {
        const _this = this
        const _state = _this.state
        const {batchesList, batchDetailsVisibel, batchDetailsList, pageSizeOptions, pageSize, detailListPageSize, detailListPageNo} = _state
        const columns = [{
            title: '批号',
            dataIndex: 'batchNo',
            key: 'batchNo'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        }, {
            title: '支付请求',
            dataIndex: 'reqStatus',
            key: 'reqStatus',
            render: v => <span>{alipayBatchReqStatus[v] && alipayBatchReqStatus[v]}</span>
        }, {
            title: '支付结果',
            dataIndex: 'respStatus',
            key: 'respStatus',
            render: v => <span>{alipayBatchRespStatus[v] && alipayBatchRespStatus[v]}</span>
        }, {
            title: '实例号',
            dataIndex: 'respNo',
            key: 'respNo'
        }, {
            title: '支付请求时间',
            dataIndex: 'reqTime',
            key: 'reqTime'
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark'
        }, {
            title: '操作',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => (
                <span>
                    <Button size="small" type="primary" className="" onClick={function () {
                        _this.stateChange({batchDetailsVisibel: true,batchNo: record.batchNo,batchId: record.id}, _this.getPayDetailsList)
                    }}
                    >查看明细</Button>
                    {
                        record.reqStatus !== 0 ? null :
                            <Button size="small" type="danger" className="mt10" onClick={function () {
                                _this.onPayClick(record.batchNo)
                            }}
                            >付款</Button>
                    }
                </span>
            )
        }]
        const columnsDetail = [{
            title: '#',
            dataIndex: '',
            key: '',
            render: (v,o,i) => <span>{i + 1 + (detailListPageNo * detailListPageSize)}</span>
        }, {
            title: '流水号',
            dataIndex: 'reqNo',
            key: 'reqNo'
        }, {
            title: '手机',
            dataIndex: 'phone',
            key: 'phone'
        }, {
            title: '金额(元)',
            dataIndex: 'trsamt',
            key: 'trsamt',
            "sortable": true
        }, {
            title: '项目编号',
            dataIndex: 'houseNo',
            key: 'houseNo'
        }, {
            title: '支付类型',
            dataIndex: 'payType',
            key: 'payType',
            render: v => <span>{_state.payTypeList[v] && _state.payTypeList[v].name}</span>
        }, {
            title: '支付说明',
            dataIndex: 'remark',
            key: 'remark'
        },{
            title: '支付请求',
            dataIndex: 'reqStatus',
            key: 'reqStatus'
        }, {
            title: '支付结果',
            dataIndex: 'respStatus',
            key: 'respStatus'
        }, {
            title: '支付结果原因',
            dataIndex: 'respReason',
            key: 'respReason'
        }, {
            title: '录入时间',
            dataIndex: 'createdTime',
            key: 'createdTime'
        }]
        const pageObj = {
            total: _state.batchesList.length || 0,
            pageSize: pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageSize })
            },
            onChange: (value, pageSize) => {
                this.setState({ pageNo: value - 1, pageSize })
            }
        }
        const pageObjDetail = {
            total: _state.totalCount,
            pageSize: detailListPageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ detailListPageSize: pageSize })
            },
            onChange: (value, pageSize) => {
                this.setState({ detailListPageNo: value - 1, detailListPageSize: pageSize })
            }
        }
        searchConfig.columns = columns
        searchBatchDetailConfig.columns = columnsDetail
        return (
            <div className="alipayBatch-page">
                <Tabs activeKey={_state.tabsActiveKey} onChange={this.changeTabs}>
                    <TabPane tab="批次表" key="1">
                        <SearchParent onSubmit={this.onSearch} config={searchConfig} dataSource={_state.batchesList} />
                        <Table
                            columns={columns}
                            dataSource={batchesList}
                            rowKey="batchNo"
                            pagination={pageObj}
                            scroll={{ x: 1000 }}
                        />
                        <Modal
                            visible={batchDetailsVisibel}
                            title="批次明细表"
                            width="90%"
                            footer={[<Button onClick={this.onModalCancel} key="batch-detail-modal">关闭</Button>]}
                            onCancel={this.onModalCancel}
                        >
                            <SearchParent onSubmit={this.onbatchDetailSearch} config={searchBatchDetailConfig} dataSource={batchDetailsList} />
                            <Table
                                columns={columnsDetail}
                                dataSource={batchDetailsList}
                                rowKey="id"
                                pagination={pageObjDetail}
                            />
                        </Modal>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default connect(mapStateToProps)(withRouter(AlipayBatch))