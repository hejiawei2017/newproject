import React, { Component } from 'react'
import { wxUserLabelServer } from '../../../services'
import Search from '../../../components/search'
import { Table, Button, message } from 'antd'
import { pageOption } from '../../../utils/utils.js'
import EditLabelModal from './editModal'
import moment from 'moment'
const searchConfig = {
    expand: false,
    items: [
        {
            type: 'text',
            name: '标签名称',
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
        rules: {
            required: true,
            message: '请选择标签类型'
        },
        defaultValue: '',
        placeholder: '请选择'
    },
    {
        key: 'name',
        label: '标签名称',
        element: "input",
        rules: {
            required: true,
            message: '请输入标签名称'
        },
        defaultValue: '',
        placeholder: '请输入标签名称'
    },
    {
        key: 'describe',
        label: '说明',
        defaultValue: '',
        rules: {
            required: true,
            message: '请输入说明'
        },
        element: 'textarea',
        placeholder: '请输入描述'
    },
    {
        key: 'termOfValidity',
        label: '标签有效期',
        element: 'radio',
        radioData: [{ value: 1, label: "长期" }, { value: 2, label: "短期" }],
        rules: {
            required: true,
            message: '请选择标签有效期'
        },
        defaultValue: 1,
        placeholder: '请选择标签有效期'
    },
    {
        key: 'time',
        label: '选择时间',
        display: 'none',
        element: "rangepicker",
        defaultValue: '',
        placeholder: '请选择时间'
    },
    {
        key: 'isSearch',
        label: '可否搜索',
        rules: {
            required: true,
            message: '请选择可否搜索'
        },
        defaultValue: 1,
        element: 'radio',
        radioData: [{ value: 1, label: "是" }, { value: 0, label: '否' }]
    },
    {
        key: 'isDisplay',
        label: '是否显示',
        rules: {
            required: true,
            message: '请选择是否可以显示'
        },
        defaultValue: 1,
        element: 'radio',
        radioData: [{ value: 1, label: "是" }, { value: 0, label: "否" }]
    }, {
        key: 'status',
        label: '状态',
        defaultValue: 1,
        rules: {
            required: true,
            message: '请选择状态'
        },
        element: 'radio',
        radioData: [{ value: 1, label: "有效" }, { value: 0, label: "无效" }]
    },
    {
        key: 'sortNumber',
        label: '排序',
        defaultValue: '',
        rules: {
            required: true,
            message: '请选择排序'
        },
        element: 'number'
    }
];
class articleManage extends Component {
    constructor() {
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
            searchFields: {},
            orderBy: '',
            curDataSource: editKeys,
            rangeDis: false
        }
        this.tableThis = null
    }
    componentDidMount() {
        //获取标签列表
        this.getUserlabelList()
        //this.getTagCategory()
    }
    getUserlabelList = () => {
        const { pageNum, pageSize,  name } = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize
        }
        name && (params.name = name)
        wxUserLabelServer.getUserlabelList(params).then((data) => {
            data.list.forEach((item, index) => {
                item.labelType = item.categoryName
            })
            this.setState({
                pageNum: data.pageNum,
                tableData: data.list,
                total: data.total,
                loading: false
            })
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    getTagCategory = () => {
        wxUserLabelServer.getTagCategory().then((data) => {
            let arr = data.map((item) => {
                return {
                    value: item.id,
                    text: item.name
                }
            })
            // searchConfig.items[1].selectData = arr;
            // editKeys[1].selectData = arr;

        
            this.setState({
                getTagCategoryDone: true
            })
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    addTagCategory = (data) => {
        wxUserLabelServer.addCustomerTag(data).then((response) => {
            // console.log(response,"responseresponseresponse")
            message.success("操作成功")
            this.getUserlabelList()
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    editTagCategory = (data) => {
        wxUserLabelServer.updateCustomerTag(data).then((response) => {
            // console.log(response,"responseresponseresponse")
            message.success("操作成功")
            this.getUserlabelList()
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    onSearch = (searchFields) => {
        console.log(searchFields, "searchFields")
        this.setState({
            pageNum: 1,
            // categoryId: searchFields.categoryId.value,
            // status: searchFields.status.value,
            // isSearch: searchFields.isSearch.value,
            // termOfValidity: searchFields.termOfValidity.value,
            name: searchFields.name.value

        }, () => { this.getUserlabelList() })
    }
    handleCancel = (bol) => {
        this.setState({
            editModalVisible: bol
        })
    }
    modalEditSave = (values) => {
        let keys = Object.keys(values);
        let submitObj = {}
        keys.forEach((item, index) => {
            submitObj[item] = values[item].value;
        })

        submitObj.id = this.state.curId;
        submitObj['categoryId'] = submitObj.labelType ? submitObj.labelType : '';
        if (submitObj.termOfValidity === 2) {
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
        keys.forEach((item, index) => {
            submitObj[item] = values[item].value;
        })
        // console.log(submitObj,"submitObj")
        submitObj.categoryId = submitObj.labelType ? submitObj.labelType : '';
        if (submitObj.termOfValidity === 2) {
            submitObj.startTime = submitObj.time[0]
            submitObj.endTime = submitObj.time[1]
        }
        delete submitObj['time']
        delete submitObj['labelType']
        // console.log(submitObj,"submitObj")
        this.addTagCategory(submitObj)
    }
    renderModal = () => {
        const curDataSource = this.state.curDataSource;
        curDataSource.forEach((val, index) => {
            if (val.element === "radio") {
                val.defaultValue = 1;
            } else if (val.element === "select") {
                val.defaultValue = "";
            } else {
                val.defaultValue = "";
            }
        })
        this.setState({
            rangeDis: false,
            editModalVisible: true,
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
        } else if (item.termOfValidity === 2) {
            this.setState({
                rangeDis: true
            })
        }
        if (start_time !== '' && end_time !== '') {
            time = [start_time, end_time]
        } else {
        }
        // console.log(time,"time")
        item.time = time;
        let keys = Object.keys(item);
        curDataSource.forEach((val, index) => {
            keys.forEach((val1, index1) => {
                if (val.key === val1) {
                    if (val.key === "labelType") {
                        val.selectData.forEach((val2, index2) => {
                            if (item[val1]) {
                                if (item[val1].includes(val2.text)) {
                                    val.defaultValue = val2.value
                                    curStr = val2.text
                                }
                            } else {
                                val.defaultValue = item[val1]
                            }
                        })
                    } else {
                        val.defaultValue = item[val1]
                    }
                }
            })
        })
        curDataSource.forEach((val, index) => {
            if (val.key === "describe" || val.key === "aaiDescribe") {
                if (curStr === "房源活动") {
                    val.label = "AAI说明"
                    val.key = "aaiDescribe"
                    val.defaultValue = item["aaiDescribe"]
                } else {
                    val.label = "说明"
                    val.key = "describe"
                    val.defaultValue = item["describe"]
                }
            }
        })
        // console.log(curDataSource, item ,curStr, "curDataSource")
        this.setState({
            editModalVisible: true,
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
    render() {
        const _this = this
        const _state = this.state
        const { pageSize, pageSizeOptions, pageNum, total } = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, () => { this.getUserlabelList() })
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize: pageSize
                }, () => { this.getUserlabelList() })
            }
        }
        const columns = [
            {
                title: '标签名称',
                dataIndex: 'name',
                width: 150
            },
            {
                title: '用户数量',
                dataIndex: 'count',
                width: 150,
                render(){
                    return "1000"
                }
            },
            {
                title: '微信标签id',
                dataIndex: 'havedSend',
                render: function (text, record) {
                    return "text"
                },
                width: 150
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render: function (text, record) {
                    return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                },
                width: 200
            }, {
                title: '操作',
                dataIndex: 'operate',
                width: 100,
                render: (text, record) => <Button size="small" type="primary" onClick={function () { _this.editOperate(record) }}>{'编辑'}</Button>
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
                    rangeDis={this.state.rangeDis}
                    changeDis={this.changeDis}
                />
            </div>
        )
    }
}

export default articleManage
