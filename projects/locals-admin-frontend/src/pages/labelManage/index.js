import React, { Component } from 'react'
import {tagManageService} from '../../services'
import Search from '../../components/search'
import {Table, Button, message} from 'antd'
import { pageOption } from '../../utils/utils.js'
import EditLabelModal from './editModal'
import moment from 'moment'
const searchConfig = {
    expand: false,
    items: [
        {
            type: 'select',
            name: '标签类型',
            key: 'categoryId',
            defaultValue: "",
            selectData: [],
            renderSelectData: [],
            searchFilterType: 'select',
            placeholder: '请输入平台类型'
        },
        {
            type: 'select',
            name: '状态',
            key: 'status',
            defaultValue: "",
            selectData: [
            { value: 1, text: "有效" },
            { value: 0, text: "无效" }],
            renderSelectData: [],
            searchFilterType: 'select',
            placeholder: '请输入平台类型'
        },
        {
            type: 'select',
            name: '可否搜索',
            key: 'isSearch',
            defaultValue: "",
            selectData: [
            { value: 1, text: "可以" },
            { value: 0, text: "不可" }],
            renderSelectData: [],
            searchFilterType: 'select',
            placeholder: '请输入平台类型'
        },
        {
            type: 'radio',
            name: '有效期',
            key: 'termOfValidity',
            defaultValue: '',
            radioData: [{label: '', value: '1'}],
            renderRadioData: [{label: '长期', value: 1}, {label: '短期', value: 2}],
            searchFilterType: 'radio',
            placeholder: '请输入平台类型'
        },
        {
            type: 'text',
            name: '标签关键字',
            key: 'name',
            defaultValue: '',
            placeholder: '请输入关键字'
        }
    ]
}
const editKeys = [
    {
        key: 'labelType',
        label: '标签类型',
        selectData: [],
        element: "select",
        rules:{
            required: true,
            message: '请选择标签类型'
        },
        defaultValue: '',
        placeholder:'请选择'
    },
    {
        key: 'name',
        label: '标签名称',
        element: "input",
        rules:{
            required: true,
            message: '请输入标签名称'
        },
        defaultValue:'',
        placeholder:'请输入标签名称'
    },
    {
        key: 'describe',
        label: '说明',
        defaultValue:'',
        rules:{
            required: true,
            message: '请输入说明'
        },
        element:'textarea',
        placeholder:'请输入描述'
    },
    {
        key: 'termOfValidity',
        label: '标签有效期',
        element:'radio',
        radioData: [{value: 1, label: "长期"},{value: 2, label: "短期"}],
        rules:{
            required: true,
            message: '请选择标签有效期'
        },
        defaultValue: 1,
        placeholder:'请选择标签有效期'
    },
    {
        key: 'time',
        label: '选择时间',
        display: 'none',
        element: "rangepicker",
        defaultValue:'',
        placeholder:'请选择时间'
    },
    {
        key: 'isSearch',
        label: '可否搜索',
        rules:{
            required: true,
            message: '请选择可否搜索'
        },
        defaultValue: 1,
        element: 'radio',
        radioData: [{value: 1, label: "是"},{value: 0, label: '否'}]
    },
    {
        key: 'isDisplay',
        label: '是否显示',
        rules:{
            required: true,
            message: '请选择是否可以显示'
        },
        defaultValue: 1,
        element:'radio',
        radioData: [{value: 1, label: "是"},{value: 0, label: "否"}]
    },{
        key: 'status',
        label: '状态',
        defaultValue: 1,
        rules:{
            required: true,
            message: '请选择状态'
        },
        element:'radio',
        radioData: [{value: 1, label: "有效"},{value: 0, label: "无效"}]
    },
    {
        key: 'sortNumber',
        label: '排序',
        defaultValue:'',
        rules:{
            required: true,
            message: '请选择排序'
        },
        element:'number'
    }
];
class LabelManage extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            getTagCategoryDone: false,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            total: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            categoryId: '',
            status: '',
            isSearch: '',
            termOfValidity: '',
            name: '',
            editType: 'add',
            editModalVisible: false,
            editFrom: {},
            searchFields:{},
            orderBy: '',
            curDataSource: editKeys,
            rangeDis: false
        }
        this.tableThis = null
    }
    componentDidMount (){
        this.getCustomerTag()
        this.getTagCategory()
    }
    getCustomerTag = () => {
        const {pageNum, pageSize, categoryId, status, isSearch, termOfValidity, name} = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize
        }
        categoryId && (params.categoryId = categoryId)
        status !== undefined && status !== null && status !== "" && (params.status = status)
        isSearch !== undefined && isSearch !== null && isSearch !== "" && (params.isSearch = isSearch)
        termOfValidity && (params.termOfValidity = termOfValidity)
        name && (params.name = name)
        tagManageService.getCustomerTag(params).then((data) =>{
            data.list.forEach((item,index)=>{
                item.labelType = item.categoryName
            })
            this.setState({
                pageNum:data.pageNum,
                tableData:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    getTagCategory = () => {
        tagManageService.getTagCategory().then((data) =>{
            let arr = data.map((item) => {
                return {
                    value: item.id,
                    text: item.name
                }
            })
            searchConfig.items[0].selectData = arr;
            editKeys[0].selectData = arr;
            this.setState({
                getTagCategoryDone:true
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    addTagCategory = (data) => {
        tagManageService.addCustomerTag(data).then((response) =>{
            // console.log(response,"responseresponseresponse")
            message.success("操作成功")
            this.getCustomerTag()
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    editTagCategory = (data) => {
        tagManageService.updateCustomerTag(data).then((response) =>{
            // console.log(response,"responseresponseresponse")
            message.success("操作成功")
            this.getCustomerTag()
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    onSearch = (searchFields) => {
        console.log(searchFields,"searchFields")
        this.setState({
            pageNum: 1,
            categoryId: searchFields.categoryId.value,
            status: searchFields.status.value,
            isSearch: searchFields.isSearch.value,
            termOfValidity: searchFields.termOfValidity.value,
            name: searchFields.name.value

        },()=>{ this.getCustomerTag()})
    }
    handleCancel = (bol) => {
        this.setState({
            editModalVisible: bol
        })
    }
    modalEditSave = (values) => {
        let keys = Object.keys(values);
        let submitObj = {}
        keys.forEach((item,index)=>{
            submitObj[item] = values[item].value;
        })

        submitObj.id = this.state.curId;
        submitObj['categoryId'] = submitObj.labelType ? submitObj.labelType : '';
        if(submitObj.termOfValidity === 2) {
            submitObj.startTime = submitObj.time[0]
            submitObj.endTime = submitObj.time[1]
        }
        delete submitObj['time']
        delete submitObj['labelType']
        // console.log(submitObj,"submitObj")
        this.editTagCategory(submitObj)
    }
    modalAddSave = (values) => {
        let keys = Object.keys(values);
        let submitObj = {}
        keys.forEach((item,index)=>{
            submitObj[item] = values[item].value;
        })
        // console.log(submitObj,"submitObj")
        submitObj.categoryId = submitObj.labelType ? submitObj.labelType : '';
        if(submitObj.termOfValidity === 2) {
            submitObj.startTime = submitObj.time[0]
            submitObj.endTime = submitObj.time[1]
        }
        delete submitObj['time']
        delete submitObj['labelType']
        // console.log(submitObj,"submitObj")
        this.addTagCategory(submitObj)
    }
    renderModal = () =>{
        const curDataSource = this.state.curDataSource;
        curDataSource.forEach((val,index) => {
            if(val.element === "radio") {
                val.defaultValue = 1;
            } else if(val.element === "select") {
                val.defaultValue = "";
            } else {
                val.defaultValue = "";
            }
        })
        this.setState({
            rangeDis: false,
            editModalVisible:true,
            editType: 'add',
            curDataSource
        })
    }
    editOperate = (item) => {
        this.setState({
            curId: item.id
        })
        const curDataSource = this.state.curDataSource;
        let curStr = "";
        let start_time = item.startTime ? item.startTime : '';
        let end_time = item.endTime ? item.endTime : '';
        let time = "";
        if (item.termOfValidity === 1) {
            this.setState({
                rangeDis: false
            })
        }else if(item.termOfValidity === 2) {
            this.setState({
                rangeDis: true
            })
        }
        if(start_time !== '' && end_time !== '' ){
            time = [start_time,end_time]
        }else {
        }
        // console.log(time,"time")
        item.time = time;
        let keys = Object.keys(item);
        curDataSource.forEach((val,index) => {
            keys.forEach((val1, index1) => {
                if(val.key === val1) {
                    if(val.key === "labelType") {
                        val.selectData.forEach((val2, index2)=>{
                            if(item[val1]) {
                                if(item[val1].includes(val2.text)) {
                                    val.defaultValue = val2.value
                                    curStr = val2.text
                                }
                            }else {
                                val.defaultValue = item[val1]
                            }
                        })
                    } else {
                        val.defaultValue = item[val1]
                    }
                }
            })
        })
        curDataSource.forEach((val,index) => {
            if(val.key === "describe" || val.key === "aaiDescribe") {
                if(curStr === "房源活动") {
                    val.label = "AAI说明"
                    val.key = "aaiDescribe"
                    val.defaultValue = item["aaiDescribe"]
                }else {
                    val.label = "说明"
                    val.key = "describe"
                    val.defaultValue = item["describe"]
                }
            }
        })
        // console.log(curDataSource, item ,curStr, "curDataSource")
        this.setState({
            editModalVisible:true,
            curDataSource,
            editType: 'edit',
            editFormData: ""
        })
    }
    changeDis = (bol) => {
        this.setState({
            rangeDis: bol
        })
    }
    render () {
        const _this = this
        const _state = this.state
        const { pageSize, pageSizeOptions, pageNum ,total} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getCustomerTag()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getCustomerTag()})
            }
        }
        const columns = [{
            title: '标签类型',
            dataIndex: 'categoryName',
            width: 150
        }, {
            title: '标签名称',
            dataIndex: 'name',
            width: 150
        }, {
            title: '标签说明',
            dataIndex: 'describe',
            width: 200,
            render: function (text, record) {
                return <div style={{width: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{record.describe}</div>
            }
        }, {
            title: '有效期',
            dataIndex: 'termOfValidity',
            render: function (text, record) {
                return record.termOfValidity === 1 ? '长期' : record.termOfValidity === 2 ? `${moment(record.startTime).format("YYYY-MM-DD")}-${moment(record.endTime).format("YYYY-MM-DD")}` : ''
            },
            width: 150
        },{
            title: '可否搜索',
            dataIndex: 'isSearch',
            render: function (text, record) {
                return record.isSearch === 1 ? '可以' : '不可以'
            },
            width: 150
        },{
            title: '是否显示',
            dataIndex: 'isDisplay',
            render: function (text, record) {
                return record.isSearch === 1 ? '显示' : '不显示'
            },
            width: 150
        },{
            title: '状态',
            dataIndex: 'status',
            render: function (text, record) {
                return record.status === 1 ? '有效' : <div style={{color:'#ccc'}}>无效</div>
            },
            width: 150
        },{
            title: '添加日期',
            dataIndex: 'createTime',
            render: function (text, record) {
                return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            },
            width: 200
        },{
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render:  (text, record) => <Button size="small" type="primary" onClick={ function () { _this.editOperate(record) } }>{'编辑'}</Button>
        }]
        return (
            <div>
                {
                    this.state.getTagCategoryDone && <Search onSubmit={this.onSearch} config={searchConfig} />
                }
                <div className="mb10 text-right">
                    <Button type="primary" onClick={this.renderModal}>添加</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    pagination={pagination}
                    rowKey="id"
                />
                <EditLabelModal
                editModalVisible={_state.editModalVisible}
                handleCancel={this.handleCancel}
                items={this.state.curDataSource}
                editType={_state.editType}
                modalEditSave={_this.modalEditSave}
                modalAddSave={_this.modalAddSave}
                rangeDis = {this.state.rangeDis}
                changeDis = {this.changeDis}
                />
            </div>
        )
    }
}

export default LabelManage
