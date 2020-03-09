import React, { Component } from 'react'
import { costControlService, uploadImportService } from '../../services'
import Search from '../../components/search'
import SubTable from '../../components/subTable'
import { message, Button } from 'antd'
import UploadDownloadBtns from '../../components/uploadDownloadBtns'
import EditModal from './editModal'
import { envConfig, formatMoney } from '../../utils/utils'

const columns = [{
    title: '房源编码',
    dataIndex: 'houseNo',
    key: 'houseNo',
    exportType: 'text',
    width: 100
}, {
    title: 'Lotel编码',
    dataIndex: 'lotelNo',
    key: 'lotelNo',
    exportType: 'text',
    width: 150
}, {
    title: '费用类型',
    dataIndex: 'typeName',
    key: 'typeName',
    exportType: 'text',
    width: 100
}, {
    title: '费用科目',
    dataIndex: 'subjectName',
    key: 'subjectName',
    exportType: 'text',
    width: 150
}, {
    title: '费用提交信息',
    dataIndex: 'submitInfo',
    key: 'submitInfo',
    exportType: 'text',
    width: 400
}, {
    title: '费用审批信息',
    dataIndex: 'approveInfo',
    key: 'approveInfo',
    exportType: 'text',
    width: 400
}, {
    title: '费用金额',
    dataIndex: 'costSum',
    key: 'costSum',
    render: (t, r) => (<span>{formatMoney(r.costSum)}</span>),
    exportType: 'text',
    width: 100
}, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    exportType: 'text',
    width: 350
}, {
    title: '附件',
    dataIndex: 'attachPath',
    key: 'attachPath',
    exportType: 'text',
    width: 400
}]

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '关键字',
            key: 'keywords',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入房源编码/房源地址'
        },
        {
            type: 'cascader',
            name: '类型/科目',
            key: 'cost',
            cascaderOpts: [],
            placeholder: '请选择费用类型/费用科目'
        }
    ],
    exportFBtn: {
        name: '导出'
    },
    columns: columns
}

const uploadDownloadBtnsConfig = {
    download: {
        url: `http://oss.localhome.cn/upload/181225/%E8%B4%B9%E7%94%A8%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx`
    }
}

class costControl extends Component {
    constructor (props) {
        super(props)
        this.state = {
            searchFields: {},
            seletType: false,
            editModalVisible: false,
            delType: false,
            editType: null,
            needLess: [],
            dataSource: []
        }
        this.tableThis = null
    }
    componentDidMount () {
        this.renderSelect()
    }
    renderSelect = () => {
        let list = []
        costControlService.getSelectList().then((res) => {
            for (var i = 0; i < res.length; i++) {
                list.push({ value: res[i].id, label: res[i].name, children: [] })
                for (var j = 0; j < res[i].children.length; j++) {
                    list[i].children.push({ value: res[i].children[j].id, label: res[i].children[j].name })
                }
            }
            searchConfig.items[1].cascaderOpts = list
            this.setState({
                seletType: true
            })
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        console.log('--->', searchFields)
        this.setState({
            pageName: 1,
            searchFields: {
                planNameOrCode: searchFields.keywords.value,
                costType: searchFields.cost.value && searchFields.cost.value[0],
                costSubject: searchFields.cost.value && searchFields.cost.value[1]
            }
        }, this.renderTable)
    }
    handleUpload = (data, fun) => {
        const { editType } = this.state
        if (editType === 'file') {
            this.sendFile(data, fun)
        } else {
            this.getUrl(data, fun)
        }
    }
    getUrl = (data, fun) => {
        const formData = new FormData()
        // console.log(data)
        formData.append('file', data.file, data.name)
        uploadImportService.uploadFile(formData).then((data) => {
            this.sendUrl(data.fileName, envConfig.newImagePrefix + data.filePath, fun)
        }).catch(() => {
            fun && fun()
            this.setState({editModalVisible: false})
        })
    }
    sendUrl = (name, path, fun) => {
        let data = [{
            // fileName: '20180709145632.xlsx',
            fileName: name,
            filePath: path
        }]
        costControlService.importAccessory(data).then(res => {
            // console.log('附件上传-->url', res)
            fun && fun()
            message.success('上传成功')
            this.setState({editModalVisible: false})
        }).catch(err => {
            fun && fun()
            message.error('上传失败')
            this.setState({editModalVisible: false})
        })
    }
    sendFile = (data, fun) => {
        const formData = new FormData()
        formData.append('file', data.file)
        costControlService.importFile(formData).then(res => {
            fun && fun()
            message.success('上传成功')
            this.setState({editModalVisible: false})
        }).catch(err => {
            fun && fun()
            message.error('上传失败')
            this.setState({editModalVisible: false})
        })
    }
    deletList = () => {
        let ids = []
        const { needLess } = this.state
        for (let i = 0; i < needLess.length; i++) {
            ids.push(needLess[i].id)
        }
        costControlService.delItem(ids).then(res => {
            // console.log(res)
            this.tableThis.renderTable()
        }).catch(err => console.log(err))
    }
    getSubTableDataSource = (dataSource) => {
        this.setState({dataSource})
    }
    refsTab = (ref) => {
        this.tableThis = ref
    }
    rowKey = (o,i) => {
        return `${o.houseNo}-${i}`
    }
    render () {
        let _this = this
        const {
            searchFields,
            seletType,
            delType,
            editModalVisible,
            needLess
        } = this.state
        const subTableItem = {
            getTableService: costControlService.getTable,
            columns: columns,
            refsTab: this.refsTab,
            rowKey: this.rowKey,
            searchFields: searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: function (record) {
                    if (record.attachPath) {
                        window.location.href = record.attachPath
                    } else {
                        message.info('暂未导入！')
                    }
                },
                text: '附件'
            }],
            operatBtnWidth: 100,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            },
            setDataSource: this.getSubTableDataSource,
            rowSelection: {
                onChange: (selectedRowKeys, selectedRows) => {
                    let delType = (selectedRows.length > 0) ? true : false
                    _this.setState({delType, needLess: selectedRows})
                }
            }
        }
        return (
            <div>
                {seletType ? <Search onSubmit={this.onSearch} config={searchConfig} dataSource={needLess} /> : null}
                <div className="mb10 text-right">
                    <UploadDownloadBtns config={uploadDownloadBtnsConfig} />
                    <Button className="ml10" type="primary" onClick={function () {_this.setState({editModalVisible: true, editType: 'file'})}}>费用文件上传</Button>
                    <Button className="ml10" type="primary" onClick={function () {_this.setState({editModalVisible: true, editType: 'accessory'})}}>费用附件上传</Button>
                    {delType ? <Button className="ml10" type="danger" onClick={_this.deletList}>删除</Button> : null}
                </div>
                <SubTable {...subTableItem} />
                {editModalVisible ? <EditModal data={{ editModalVisible }} upload={this.handleUpload} stateChange={this.stateChange} /> : null}
            </div>
        )
    }
}

export default costControl
