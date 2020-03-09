import React, { Component } from 'react'
import { notification, Radio, Button, Icon, Modal } from 'antd';
import { managementFeeService } from '../../services'
import Search from '../../components/search'
import { performStatusMap,tenancyTypeMap } from '../../utils/dictionary.js'
import { SubTable, ExcelUpload } from '../../components'
import downloadTemplateClick from '../../utils/downloadClick'
import { envConfig,dataFormat } from "../../utils/utils"
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const confirm = Modal.confirm
let performStatusList = [{value: '', text: '全部'}]

for (let k in performStatusMap) {
    if (performStatusMap.hasOwnProperty(k) && k !== '') {
        performStatusList.push({value: k, text: performStatusMap[k]})
    }
}
const tenancyTypeMaps = {
    '长租': 1,
    1: 1,
    '短租': 2,
    2: 2
}

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
        }, {
            type: 'text',
            name: '城市',
            key: 'city',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入城市'
        }, {
            type: 'monthpicker',
            name: '月份',
            key: 'dateStr',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入月份'
        }, {
            type: 'select',
            name: '执行状态',
            key: 'performStatus',
            selectData: performStatusList,
            renderSelectData: performStatusMap,
            searchFilterType: 'select',
            placeholder: '请输入执行状态'
        }
    ]
}
class RoomRate extends Component {
    constructor () {
        super()
        this.state = {
            searchFields: {searchNum: 0},
            orderBy: '',
            step: 0,
            tempFileName: null,
            tableData: null
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
                houseNo: searchFields.houseNo.value,
                city: searchFields.city.value,
                dateStr: searchFields.dateStr.value,
                performStatus: searchFields.performStatus.value
            }
        })
    }
    saveFeeImport = () => {
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
        managementFeeService.saveFeeImport(params).then((data)=>{
            if(data){
                _this.setState({
                    tableData: null
                },this.tableThis.renderTable)
                Modal.success({
                    title: '导入成功',
                    okText: '确认',
                    content: `当前批次号为：${data} `
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
            title: '城市',
            dataIndex: 'city',
            width: 120
        }, {
            title: '管理费月份',
            dataIndex: 'dateStr',
            width: 100
        }, {
            title: '助理工资',
            dataIndex: 'assistantSalaryFee',
            width: 100
        }, {
            title: 'BU',
            dataIndex: 'bu',
            width: 100
        }, {
            title: '核算收入',
            dataIndex: 'incomeAccounting',
            width: 100
        }, {
            title: '核算房晚',
            dataIndex: 'incomeCount',
            width: 100
        }, {
            title: '发票费',
            dataIndex: 'invoiceFee',
            width: 100
        }, {
            title: '维修费',
            dataIndex: 'fixFee',
            width: 100
        }, {
            title: '管理费',
            dataIndex: 'manageFee',
            width: 100
        }, {
            title: '租期类型',
            dataIndex: 'tenancyType',
            width: 110,
            sorter: (a,b)=> tenancyTypeMaps[b.tenancyType] - tenancyTypeMaps[a.tenancyType],
            dataType: 'select',
            selectData: tenancyTypeMap
        }, {
            title: '执行时间',
            dataIndex: 'performTime',
            sorter: (a,b)=> a.performTime - b.performTime,
            width: 180,
            dataType: 'time',
            fmt: 'YYYY-MM-DD HH:mm:ss'
        }, {
            title: '执行状态',
            dataIndex: 'performStatus',
            width: 110,
            sorter: (a,b)=> a.performStatus - b.performStatus,
            dataType: 'select',
            selectData: performStatusMap
        }, {
            title: '导入人',
            dataIndex: 'creator',
            width: 110
        }, {
            title: '导入时间',
            dataIndex: 'createTime',
            width: 180,
            sorter: (a,b)=> a.createTime - b.createTime,
            dataType: 'time',
            fmt: 'YYYY-MM-DD HH:mm:ss'
        }]
        const exportKey = {
            'houseNo': {
                key: '房源编号',
                required: true
            },
            'city': {
                key: '城市',
                required: true
            },
            'dateStr': {
                key: '管理费月份',
                required: true
            },
            'bu': {
                key: 'BU',
                required: true
            },
            'assistantSalaryFee': {
                key: '助理工资',
                required: true
            },
            'incomeAccounting': {
                key: '核算收入',
                required: true
            },
            'incomeCount': {
                key: '核算房晚',
                required: true
            },
            'fixFee': {
                key: '维修费',
                required: true
            },
            'invoiceFee': {
                key: '发票费',
                required: true
            },
            'tenancyType': {
                key: '租期类型',
                required: true,
                pros: tenancyTypeMap
            }
        }
        const subTableItem = {
            getTableService: managementFeeService.getTable,
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
                    <Button className="mr20" onClick={function (){
                        downloadTemplateClick(`${envConfig.fileUrl}/PaymentDetail/templates/Locals-opt.xlsx`,"上传模板.xls")}
                    }
                    >下载模板</Button>
                    <RadioGroup value="0" onChange={this.onRadioChange}>
                        <RadioButton>
                            <ExcelUpload
                                stateChange={_this.stateChange}
                                changeKey="tableData"
                                exportKey={exportKey}
                            >
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

export default RoomRate