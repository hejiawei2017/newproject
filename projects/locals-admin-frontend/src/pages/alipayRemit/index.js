import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { financePayService } from '../../services'
import { Table, Button, Radio, Icon, notification, Modal} from 'antd'
import { envConfig } from "../../utils/utils"
import downloadTemplateClick from '../../utils/downloadClick'
import {ExcelUpload} from '../../components'
import {paymentTypeListSuccess} from '../../actions/payBatch'

import './index.less'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const confirm = Modal.confirm

const mapStateToProps = (state, action) => {
    return {
        payTypeList: state.payBatch.payTypeList,
        payTypeNum: state.payBatch.payTypeNum
    }
}

class AlipayRemit extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            payTypeList: {},
            payTypeNum: {},
            step: 0,
            tempFileName: null,
            batchNum: null
        }
    }
    componentDidMount () {
        if(this.props.payTypeList && this.props.payTypeNum){
            this.setState({
                payTypeList: this.props.payTypeList,
                payTypeNum: this.props.payTypeNum
            })
        }else{
            this.getPayList()
        }
    }
    getPayList = () => {
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
                this.setState({
                    payTypeList,
                    payTypeNum
                })
            }
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    savePayImport = () => {
        const _this = this
        const {tableData, step, tempFileName} = _this.state
        if (!((tableData && tableData.length > 0) || tempFileName)){
            notification.error({
                message: '无法保存空数据'
            })
            return false
        }
        const params = {
            items: tempFileName ? null : tableData,
            step,
            tempFileName
        }
        financePayService.postPaymentsImport(params).then((data)=>{
            console.log('financePayService t',data)
            if(data){
                _this.setState({
                    batchNum: data
                })
                Modal.success({
                    title: '导入成功',
                    okText: '确认',
                    content: `当前批次号为：${data} ,\n请点击【发送交易申请】，向支付宝发送转账申请`
                })
            }
        }).catch (({data}) => {
            console.log('financePayService c',data)
            if(data && data.message){
                confirm({
                    title: '确认',
                    content: data.message,
                    okText: '继续',
                    cancelText: '取消',
                    onOk () {
                        _this.setState({
                            step: step + 1,
                            tempFileName: data.tempFileName
                        },_this.savePayImport)
                    },
                    onCancel () {
                    }
                });
            }
        })
    }
    deleteTableItem = (index) => {
        // 删除列表Item
        let tableData = [...this.state.tableData]
        tableData.splice(index,1)
        this.setState({
            tableData,
            tempFileName: ''
        },()=> console.log(this.state))
    }
    onRadioChange = (e) =>{
        const value = Number(e.target.value) || 0
        switch (value) {
        case 2:
            this.savePayImport()
            break
        case 3:
            this.props.history.push('/finance/payBatch')
            break
        case 4:
            this.props.history.push('/finance/payBatch')
            break
        default:
            break
        }
        console.log(value)
    }
    render () {
        const _this = this
        const _state = this.state
        const columns = [{
            title: 'UnionId',
            dataIndex: 'unionId'
        }, {
            title: '金额',
            dataIndex: 'trsamt'
        }, {
            title: '项目编号',
            dataIndex: 'houseNo'
        }, {
            title: '类型',
            dataIndex: 'payType',
            render: v => <span>{_state.payTypeList[v] && _state.payTypeList[v].name}</span>
        }, {
            title: '备注',
            dataIndex: 'remark'
        }, {
            title: '操作',
            render: (text, record, index) => (
                <span>
                    <Button size="small" type="danger" onClick={function (){
                        _this.deleteTableItem(index)}
                    }
                    >删除</Button>
                </span>
            )
        }]
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
        const exportKey = {
            'unionId': {
                key: 'UnionId',
                required: true
            },
            'trsamt': {
                key: '金额',
                required: true
            },
            'houseNo': {
                key: '项目编号',
                required: true
            },
            'payType': {
                key: '类型',
                pros: _state.payTypeNum
            },
            'remark': {
                key: '备注'
            }
        }

        const extraKey = {
            version: 1
        }
        return (
            <div className="alipayRemit-page">
                <div className="pt10">
                    <Button className="mr20" onClick={function (){
                        downloadTemplateClick(`${envConfig.fileUrl}/PaymentDetail/templates/template.xls`,"上传模板.xls")}
                    }
                    >下载模板</Button>
                    <RadioGroup value="0" onChange={this.onRadioChange}>
                        <RadioButton>
                            <ExcelUpload stateChange={_this.stateChange} changeKey="tableData" exportKey={exportKey} extraKey={extraKey}>
                                <Icon type="cloud-upload-o" />1、上传Execl文件
                            </ExcelUpload>
                        </RadioButton>
                        <RadioButton value="2">2、保存导入数据</RadioButton>
                        <RadioButton value="3">3、发送交易请求</RadioButton>
                        <RadioButton value="4">4、查询交易结果</RadioButton>
                    </RadioGroup>
                </div>
                <div className="pt20 mb10">
                    当前批次号
                </div>
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    rowKey={function (params,i) {
                        return params.houseNo + '-' + i
                    }}
                    pagination={pageObj}
                    onChange={this.sorterChange}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(withRouter(AlipayRemit))