import React, { Component } from 'react'
import { notification, Radio, Button, Icon, Modal } from 'antd';
import { managementFeeService } from '../../services'
import Search from '../../components/search'
import { SubTable, ExcelUpload } from '../../components'
import downloadTemplateClick from '../../utils/downloadClick'
import { envConfig, dataFormat } from "../../utils/utils"

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const confirm = Modal.confirm

const searchConfig = {
    items: [
        {
            type: 'modalSelect',
            name: '批号',
            key: 'batchNo',
            placeholder: '请输入批号'
        }, {
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入房源编码'
        }
    ]
}
class ImportFee extends Component {
    constructor () {
        super()
        this.state = {
            searchFields: {searchNum: 0},
            orderBy: '',
            fileUrl: '',
            step: 0,
            tempFileName: null,
            tableData: null,
            loading: false,
            uploading: false
        }
        this.tableThis = null
        this.stateChange = this.stateChange.bind(this)
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            tableData: null,
            searchFields:{
                searchNum: (this.state.searchFields.searchNum || 0) + 1,
                batchNo: searchFields.batchNo.value,
                houseNo: searchFields.houseNo.value
            }
        })
    }
    saveFeeImport = () => {
        const _this = this
        const {tableData, step, tempFileName, fileUrl, uploading} = _this.state
        if (!((tableData && tableData.length > 0) || tempFileName)){
            notification.error({
                message: '无法保存空数据'
            })
            return false
        }
        if (!(fileUrl && fileUrl.length > 0)){
            notification.error({
                message: '正在上传，请稍等'
            })
            return false
        }
        if(uploading){
            notification.error({
                message: '正在上传，请稍等'
            })
            return false
        }else{
            this.setState({
                uploading: true
            })
        }
        const params = {
            fileUrl
            // items: tempFileName ? null : tableData,
            // step,
            // tempFileName
        }
        managementFeeService.houseSourceRateImport(params).then((data)=>{
            // console.log('financePayService t',data)
            if(data){
                _this.setState({
                    tableData: null,
                    uploading: false
                },this.tableThis.renderTable)
                Modal.success({
                    title: '导入成功',
                    okText: '确认',
                    content: `当前批次号为：${data} `
                })
            }
        }).catch (({data}) => {
            // console.log('financePayService c',data)
            _this.setState({
                uploading: false
            })
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
                        },_this.saveFeeImport)
                    },
                    onCancel () {
                    }
                });
            }
        })
    }
    onRadioChange = (e) =>{
        const value = Number(e.target.value) || 0
        switch (value) {
        case 2:
            this.saveFeeImport()
            break
        default:
            break
        }
    }
    render () {
        const _this = this
        const _state = this.state
        const columns = [{
            title: '批次号',
            dataIndex: 'batchId',
            width: 150
        },{
            title: '房源编号',
            dataIndex: 'houseNo',
            width: 120
        }, {
            title: '房东类型',
            dataIndex: 'memberType',
            width: 100
        }, {
            title: '房东1',
            dataIndex: 'member1',
            width: 100
        }, {
            title: '房东1钱包编码',
            dataIndex: 'unionId1',
            width: 150
        }, {
            title: '房东2',
            dataIndex: 'member2',
            width: 100
        }, {
            title: '房东2钱包编码',
            dataIndex: 'unionId2',
            width: 150
        }, {
            title: '房东3',
            dataIndex: 'member3',
            width: 100
        }, {
            title: '房东3钱包编码',
            dataIndex: 'unionId3',
            width: 150
        }, {
            title: '原始费率',
            dataIndex: 'baseRate',
            width: 100,
            render: (val) => <span>{Number((val || 0) * 100).toFixed(2)}%</span>
        }, {
            title: '房东1费率',
            dataIndex: 'rate1',
            width: 100,
            render: (val) => <span>{Number((val || 0) * 100).toFixed(2)}%</span>
        }, {
            title: '房东2费率',
            dataIndex: 'rate2',
            width: 100,
            render: (val) => <span>{Number((val || 0) * 100).toFixed(2)}%</span>
        }, {
            title: '房东3费率',
            dataIndex: 'rate3',
            width: 100,
            render: (val) => <span>{Number((val || 0) * 100).toFixed(2)}%</span>
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            width: 100,
            sorter: (a,b)=> a.createTime - b.createTime,
            dataType: 'time',
            fmt: 'YYYY-MM-DD'
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            width: 100,
            sorter: (a,b)=> a.createTime - b.createTime,
            dataType: 'time',
            fmt: 'YYYY-MM-DD'
        }]
        const exportKey = {
            'houseNo': {
                key: '房源编号',
                required: true
            },
            'memberType': {
                key: '房东类型',
                required: true
            },
            'member1': {
                key: '房东1',
                required: true
            },
            'unionId1': {
                key: '房东1钱包编码',
                required: true
            },
            'member2': {
                key: '房东2'
            },
            'unionId2': {
                key: '房东2钱包编码'
            },
            'member3': {
                key: '房东3'
            },
            'unionId3': {
                key: '房东3钱包编码'
            },
            'baseRate': {
                key: '原始费率',
                required: true,
                toFixed: 4
            },
            'rate1': {
                key: '房东1费率',
                required: true,
                toFixed: 4
            },
            'rate2': {
                key: '房东2费率',
                toFixed: 4
            },
            'rate3': {
                key: '房东3费率',
                toFixed: 4
            },
            'startTime': {
                key: '开始时间',
                required: true
            },
            'endTime': {
                key: '结束时间',
                required: true
            }
        }
        const subTableItem = {
            getTableService: managementFeeService.getHouseSourceRateList,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: _state.searchFields,
            antdTableProps: {
                bordered: true
            },
            headerDom:{
                otherDom: (<div className="display-inline_block">
                    <Button className="mr20" onClick={function (){downloadTemplateClick(`${envConfig.fileUrl}/PaymentDetail/templates/Locals-rate.xlsx`,"上传模板.xls")}}>下载模板</Button>
                    <RadioGroup value="0" onChange={this.onRadioChange}>
                        <RadioButton>
                            <ExcelUpload stateChange={_this.stateChange} changeKey="tableData" changeFileName="fileUrl" exportKey={exportKey} type="objToUrl">
                                <Icon type="cloud-upload-o" />1、上传Execl文件
                            </ExcelUpload>
                        </RadioButton>
                        <RadioButton value="2">2、保存导入数据</RadioButton>
                    </RadioGroup>
                </div>)
            }
        }
        _state.tableData && (subTableItem.dataSource = _state.tableData)
        searchConfig.modalSelectConfig = {
            title : "选择批号",
            services : managementFeeService.getCommonBatchList,
            equalId : "batchNo",
            isHideTotal: true,
            columns : [{
                title: '批号',
                dataIndex: 'batchNo',
                key: 'batchNo'
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: (a,b)=> a.createTime - b.createTime,
                render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark'
            }],
            attr : {
                width : 800
            },
            searchKeys:[{
                type: 'input',
                key: 'batchNo',
                placeholder: '请输入批号'
            }]
        }
        return (
            <div className="managementFee-page">
                <Search onSubmit={this.onSearch} config={searchConfig} />
                {_state.tableData ?
                    <SubTable
                        {...subTableItem}
                    /> :
                    <SubTable
                        {...subTableItem}
                    />
                }
            </div>
        )
    }
}

export default ImportFee