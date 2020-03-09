import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { exportReportService } from '../../services'
import Search from '../../components/search'
import { SubTable } from '../../components';
import downloadTemplateClick from '../../utils/downloadClick'
import { envConfig } from "../../utils/utils";
import './index.less'
// const { MonthPicker } = DatePicker;
// const monthFormat = 'YYYY-MM';

class ExportReport extends Component {
    constructor () {
        super()
        this.state = {
            searchFields:{
                searchNum: 0,
                id: ''
            },
            currentView:{},
            currentViewData:{},
            sumView:{},
            houseSourceSumList:[],
            modalView: false,
            orderBy: '',
            rangeDate: '',
            dataSource: null
        }
        this.tableThis = null
        this.searchThis = null
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        let searchObject = {
            exportStatus: searchFields.exportStatus.value,
            exportType: searchFields.exportType.value,
            id: searchFields.id.value
        }
        this.setState({
            pageNum:1,
            searchFields: {
                searchNum: (this.state.searchFields.searchNum || 0) + 1,
                ...searchObject
            }
        })
    }
    exportReportButton = () => {
        const {
            // rangeDate,
            modalExportType
        } = this.state
        // if(rangeDate){
        this.setState({modalView: false})
        exportReportService.postExportReport({
            exportType: modalExportType
            // searchValue: {
            //     month: rangeDate
            // }
        }).then((data)=>{
            if(data.id){
                this.searchThis.props.form.setFieldsValue({id: data.id})
                this.searchThis.setState({
                    searchData: {
                        ...this.searchThis.state.searchData || {},
                        id:{
                            type: 'text',
                            value: data.id
                        }
                    }
                },this.searchThis.handleSearch)
            }
        })
        // }
    }
    selectMonthData = (type) => {
        this.setState({
            modalExportType: type,
            modalView: true
        })
    }
    onModalCancel = () => {
        this.setState({modalView: false})
    }
    changeDate = (month, str) => {
        this.setState({
            rangeDate: str
        })
    }
    downExport = (data) => {
        console.log('downExport', data)
        downloadTemplateClick(`${envConfig.newImagePrefix}${data.filePath}`, "报表.xls")
    }
    render () {
        const exportStatus = {
            '-1': '失败',
            0: '待处理',
            1: '成功'
        }
        const exportSearchStatus = [
            { value: '', text: '全部状态'},
            { value: '-1', text: '失败'},
            { value: '0', text: '待处理'},
            { value: '1', text: '成功'}
        ]
        const exportTypeStatus = [
            { value: '', text: '全部类型'},
            { value: '经营报表', text: '经营报表'},
            { value: '消息报表', text: '消息报表'}
        ]
        const _this = this
        const _state = this.state
        const columns = [{
        //     title: '文件名',
        //     dataIndex: 'report_key'
        // }, {
            title: 'key',
            dataIndex: 'reportKey',
            width: 300
        }, {
            title: '报表类型',
            dataIndex: 'exportType',
            width: 200
        }, {
            title: '导出状态',
            dataIndex: 'exportStatus',
            dataType: 'select',
            selectData: exportStatus,
            width: 200
        }, {
            title: '导出时间',
            dataIndex: 'createTime',
            dataType: 'time',
            width: 200
        }, {
            title: '导出人',
            dataIndex: 'creator',
            width: 200
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 300
        }, {
            title: '操作',
            dataIndex: '',
            render: (v, o)=>{
                if(o.exportStatus === 1){
                    return <Button type="primary" size="small" onClick={function (){_this.downExport(o)}}>下载</Button>
                }
            },
            width: 200
        }]
        const subTableItem = {
            getTableService: exportReportService.getReportExportLogs,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            headerDom:{
                otherDom: <div>
                    <Button className="mr10" onClick={function () {_this.selectMonthData("消息报表")}}>导出消息报表</Button>
                    <Button onClick={function () {_this.selectMonthData("经营报表")}}>导出经营报表</Button>
                </div>
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id",
            orderBy: 'create_time desc',
            searchFields: _state.searchFields
        }
        if(_state.dataSourceProd && _state.dataSourceProd.length > 0)subTableItem.dataSource = _state.dataSourceProd
        const searchConfig = {
            items: [
                {
                    type: 'select',
                    name: '导出状态',
                    key: 'exportStatus',
                    searchFilterType: 'string',
                    selectData: exportSearchStatus
                }, {
                    type: 'select',
                    name: '报表类型',
                    key: 'exportType',
                    searchFilterType: 'string',
                    defaultValue: '',
                    selectData: exportTypeStatus
                }, {
                    type: 'text',
                    name: 'ID',
                    key: 'id',
                    searchFilterType: 'string',
                    defaultValue: _state.searchFields.id,
                    placeholder: ''
                }
            ]
        }
        return (
            <div className="landlordWallet-page">
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    onRef={function (ref, obj){
                        console.log('ref', ref, obj)
                        _this.searchThis = ref
                    }}
                />
                <SubTable {...subTableItem} />
                {_state.modalView &&
                    <Modal
                        title="确认导出？"
                        visible={_state.modalView}
                        width="360px"
                        onCancel={this.onModalCancel}
                        onOk={this.exportReportButton}
                    >
                        <p>是否确认导出？</p>
                        {/* <MonthPicker format={monthFormat} onChange={this.changeDate} /> */}
                    </Modal>}
            </div>
        )
    }
}

export default ExportReport