import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { financePayService } from '../../services'
import { Table, Button, Radio, Icon, notification, Modal, message} from 'antd'
import { envConfig, createUUID } from "../../utils/utils"
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

class WalletPayImport extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            payTypeList: {},
            payTypeNum: {},
            step: 0,
            tempFileName: null,
            batchNum: null,
            totalTrsamt: 0,
            pageSize:999
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
        if(this.isSameFileName){
            return
        }
        let totalTrsamt = 0
        if(obj.tableData){
            totalTrsamt = this.totalTrsamt(obj.tableData)
        }
        this.setState({...obj,totalTrsamt}, ()=> fn && fn())
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
        const randomId = createUUID('xxxxxxxxxxxxxxxx',6)
        const params = {
            items: tempFileName ? null : tableData,
            step,
            tempFileName,
            randomId: randomId
        }
        financePayService.postDirectImport(params).then((data)=>{
            if(data){
                _this.setState({
                    batchNum: data
                })
                Modal.success({
                    title: '导入成功',
                    okText: '确认',
                    content: `当前批次号为：${data}`
                })
            }
        }).catch (({data}) => {
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
    totalTrsamt = (tableData) => {
        let totalTrsamt = 0
        const payTypeList = this.state.payTypeList
        tableData.map(e =>{
            totalTrsamt += e.trsamt * (payTypeList[e.payType] || {calculate: 0}).calculate
            return e
        })
        return Number(totalTrsamt).toFixed(2)
    }
    deleteTableItem = (index) => {
        // 删除列表Item
        let tableData = [...this.state.tableData]
        tableData.splice(index,1)
        let totalTrsamt = this.totalTrsamt(tableData)
        this.setState({
            tableData,
            tempFileName: '',
            totalTrsamt
        })
    }
    onRadioChange = (e) =>{
        const value = Number(e.target.value) || 0
        switch (value) {
        case 2:
            this.savePayImport()
            break
        default:
            break
        }
    }
    getFileName = (fileName) => {
        const localFileName = localStorage.getItem('walletPayImportFileName')
        if(localFileName === fileName){
            this.isSameFileName = true
            notification.warning({
                message: '您上传的是重复文件'
            })
        }else{
            this.isSameFileName = false
            localStorage.setItem('walletPayImportFileName', fileName)
        }
    }
    render () {
        const _this = this
        const _state = this.state
        const {batchNum, totalTrsamt} = _state
        const columns = [{
            title: '项目编号',
            dataIndex: 'houseNo'
        }, {
            title: '金额',
            dataIndex: 'trsamt'
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
            total: _state.tableData.length || 0,
            pageSize: _state.pageSize,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
        }
        const exportKey = {
            'houseNo': {
                key: '项目编号',
                required: true
            },
            'trsamt': {
                key: '金额',
                required: true
            },
            'payType': {
                key: '类型',
                required: true,
                pros: _state.payTypeNum
            },
            'remark': {
                key: '备注'
            }
        }
        return (
            <div className="walletPayImport-page">
                <div className="pt10">
                    <Button className="mr20" onClick={function (){
                        downloadTemplateClick(`${envConfig.fileUrl}/PaymentDetail/templates/airbnb-template.xls`,"钱包款项导入模板.xls")}
                    }
                    >下载钱包款项导入模板</Button>
                    <RadioGroup value="0" onChange={this.onRadioChange}>
                        <RadioButton>
                            <ExcelUpload stateChange={_this.stateChange} changeKey="tableData" exportKey={exportKey} getFileName={_this.getFileName}>
                                <Icon type="cloud-upload-o" />1、上传Execl文件
                            </ExcelUpload>
                        </RadioButton>
                        <RadioButton value="2">2、保存导入数据</RadioButton>
                    </RadioGroup>
                </div>
                <div className="pt20 mb10">
                    当前批次号{batchNum}，合计{totalTrsamt}元
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

export default connect(mapStateToProps)(withRouter(WalletPayImport))
