import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {facilityDictionaryService} from '../../services'

import {Button} from 'antd'
import EditModal from './editModal'
import Search from '../../components/search'

let searchConfig = {
    items: [
        {
            type: 'text',
            name: '设施名称',
            key: 'nameLike',
            searchFilterType: 'string',
            placeholder: '请输入设施名称'
        }
    ]
}
class FacilityDictionary extends Component {
    constructor () {
        super ()
        this.state = {
            formParams: {},
            searchFields: {},
            editModalVisible: false,
            editType: 'add' // value = 'add' or 'edit'
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                nameLike: searchFields.nameLike.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        }, this.renderTable)
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }

    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleSubmit = () => {
        this.setState({
            editModalVisible: false
        },this.renderTable)
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                nameLike: searchFields.nameLike.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        }, this.renderTable)
    }
    handleAdd = () => {
        this.stateChange({
            editModalVisible: true,
            editType: 'add',
            formParams: {
                categoryCode: undefined,
                categoryName: '',
                name: '',
                otherValue: '',
                description: '',
                remark: ''
            }
        })
    }

    render () {
        let that = this
        const columns = [
            {
                title: '序号', key: 'length', render: function (text, record, index) {
                    return (
                        <span>{((that.tableThis.state.pageNum - 1) * 10) + index + 1}</span>
                    )
                }
            }, {
                title: '分类编码',
                dataIndex: 'categoryCode',
                width: 150
            }, {
                title: '分类名称',
                dataIndex: 'categoryName',
                width: 150
            }, {
                title: '设施编码',
                dataIndex: 'code',
                width: 150
            }, {
                title: '设施名称',
                dataIndex: 'name',
                width: 150
            }, {
                title: '图标',
                dataIndex: 'otherValue',
                width: 150,
                render: val => {
                    return (
                        <img alt="图标失效" style={{width: 30, height: 30}} src={val} />
                    )
                }
            }, {
                title: '描述',
                dataIndex: 'description',
                width: 150
            }, {
                title: '备注',
                dataIndex: 'remark',
                width: 200
            }
        ]
        const subTableItem = {
            getTableService: facilityDictionaryService.getTable,
            searchFields: this.state.searchFields,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "id",
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mr10',
                type: "primary",
                onClick: record => {
                    that.setState({
                        editModalVisible: true,
                        editType: 'edit',
                        formParams: {
                            id: record.id,
                            categoryName: record.categoryName,
                            categoryCode: record.categoryCode,
                            name: record.name,
                            code: record.code,
                            otherValue: record.otherValue,
                            description: record.description,
                            remark: record.remark
                        }
                    })
                },
                text: '修改'
            }, {
                label: 'delete',
                size: "small",
                type: "primary",
                onClick: record => {
                    return facilityDictionaryService.del(record.id)
                },
                text: '删除'
            }],
            operatBtnWidth: 64
        };
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right padder-v-sm">
                    <Button type="primary"
                        onClick={this.handleAdd}
                    >新增房源设施</Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {this.state.editModalVisible ?
                    <EditModal
                        handleSubmit={this.handleSubmit}
                        stateChange={this.stateChange}
                        formParams={this.state.formParams}
                        editType={this.state.editType}
                        editModalVisible={this.state.editModalVisible}

                    /> : null
                }
            </div>
        )
    }
}

export default FacilityDictionary