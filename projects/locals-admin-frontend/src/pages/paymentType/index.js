import React, {Component} from 'react'
import { paymentTypeService } from '../../services'
import { Table, Button, message } from 'antd'
import Search from '../../components/search'
import { pageOption } from '../../utils/utils'
import { calculateMap } from '../../utils/dictionary'
import EditModal from './editModal'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '请输入关键字',
            key: 'name',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入关键字'
        }
    ]
}

class PaymentType extends Component {
    constructor () {
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            editType: 'add',
            editModalVisible: false,
            editForm: {},
            searchFields: {},
            statusNotEqual: 0,
            orderBy: 'create_time desc'
        }
        this.onSearch = this.onSearch.bind(this)
        this.sorterChange = this.sorterChange.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.stateChange = this.stateChange.bind(this)
        this.labelModalSave = this.labelModalSave.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch (searchFields) {
        this.setState({
            pageNum: 1,
            searchFields: {
                name: searchFields.name.value
            }
        }, this.renderTable)
    }
    sorterChange (pagination, filters, sorter) {

    }
    renderTable () {
        const {pageNum, pageSize, searchFields, statusNotEqual, orderBy} = this.state
        const params = {
            pageNum: pageNum,
            pageSize: pageSize,
            statusNotEqual: statusNotEqual
        }
        searchFields.name && (params.name = searchFields.name)
        orderBy && (params.orderBy = orderBy)
        paymentTypeService.getTable(params).then((data) => {
            let response = data.list
            // console.log('表格数据-->', response)
            response.forEach(d =>{
                if (d.manualType !== undefined) {
                    if (d.manualType === 0) {
                        d.manualTypeStr = '非提现充值';
                    } else if (d.manualType === 1) {
                        d.manualTypeStr = '提现充值';
                    }
                }
            })
            this.setState({
                tableData: response,
                totalCount: Number(data.total)
            })
        }).catch((e) => {})
    }
    stateChange (obj, fn) {
        this.setState(obj, fn && fn())
    }
    labelModalSave (data) {
        // console.log('label--->', data)
        const {editType} = this.state
        let editForm = JSON.parse(JSON.stringify(this.state.editForm))
        let manualType = (data.manualTypeStr === '非提现充值') ? 0 : 1
        editForm.name = data.name
        editForm.calculate = data.calculate
        editForm.manualType = manualType
        editForm.code = data.code
        editForm.remark = data.remark
        if (editType === 'edit') {
            paymentTypeService.editItem(editForm).then((e) => {
                e && (message.success('编辑成功'))
                this.setState({
                    editModalVisible: false
                }, this.renderTable())
            }).catch((e) => {})
        }
    }
    render () {
        const _this = this
        const _state = this.state
        const columns = [
            {
                title: '名称',
                dataIndex: 'name'
            },
            {
                title: '收支计算符号',
                dataIndex: 'calculate',
                render: (v) => <span>{calculateMap[v]}</span>
            },
            {
                title: '人工干预类型',
                dataIndex: 'manualTypeStr'
            },
            {
                title: '钱包款项编码',
                dataIndex: 'code'
            },
            {
                title: '备注',
                dataIndex: 'remark'
            },
            {
                title: '操作',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="primary" onClick={ function () { _this.stateChange({editType: 'edit', editModalVisible: true, editForm: record})}}>编辑</Button>
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
            showTotal: (total) => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({'pageNum': 1, pageSize}, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({
                    'pageNum': value,
                    pageSize
                }, this.renderTable)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                {/* <div className="pt10 mb10 text-right">
                    <Button type="primary" onClick={function () {_this.stateChange({editType: 'add', editModalVisible: true, editForm: {id: '', name: '', calculate: null, manualTypeStr: '', code: null, remark: ''}})}}>添加</Button>
                </div> */}
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    pagination={pageObj}
                    onChange={this.sorterChange}
                    rowKey="id"
                />
                {_state.editModalVisible ? <EditModal _data={_state.editForm} editType={_state.editType} stateChange={_this.stateChange} labelModalSave={_this.labelModalSave} /> : null}
            </div>
        )
    }
}

export default PaymentType