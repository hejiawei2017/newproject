import React, { Component } from 'react'
import { articleService } from '../../services'
import Search from '../../components/search'
import { pageOption } from '../../utils/utils.js'
import { SubTable } from '../../components';

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '标题名称',
            key: 'nameLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入标题名称'
        }
    ]
}
class ArticleLabel extends Component {
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
            editFrom: {},
            searchFields:{},
            orderBy: ''
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
            searchFields:{
                nameLike: searchFields.nameLike.value
            }
        })
    }
    render () {
        const _this = this
        const _state = this.state
        const columns = [{
            title: '标签名称',
            dataIndex: 'name',
            width: 150
        }, {
            title: '描述',
            dataIndex: 'description',
            width: 500
        }, {
            title: '排序',
            dataIndex: 'orderNumber',
            sorter: true,
            width: 150
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
            sortOrder: 'descend',
            dataType: 'time',
            fmt: 'YYYY-MM-DD HH:mm:ss',
            width: 150
        }]
        const editKeys = {
            name: {
                key: 'name',
                label: '标签名称',
                rules:{
                    required: true
                },
                defaultValue:'',
                placeholder:'请输入'
            },
            orderNumber: {
                key: 'orderNumber',
                label: '排序',
                rules:{
                    required: true
                },
                defaultValue:'',
                element:'number',
                placeholder:'请输入'
            },
            description: {
                key: 'description',
                label: '描述',
                defaultValue:'',
                element:'textarea',
                placeholder:'[可选]请输入描述'
            }
        }
        const subTableItem = {
            getTableService: articleService.getArticlesLabelTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: _state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                visible: (record) => record.name,
                editKeys: {...editKeys,
                    id:{
                        key: 'id',
                        noVisible: true,
                        defaultValue:''
                    }},
                text: '编辑'
            }, {
                label: 'delete',
                size: "small",
                className: 'mr10',
                onClick: (record) => articleService.deleteArticlesLabel(record.id),
                text: '删除'
            }],
            operatBtnWidth: 210,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            },
            sorterKeys: [{
                key: 'createTime',
                str: 'create_time'
            }, {
                key: 'orderNumber',
                str: 'order_number'
            }],
            editFNService: articleService.modifyArticlesLabel,
            editExtraKeys: {
                // key: 123
            },
            orderBy: 'create_time desc',
            headerDom: {
                otherDom: null,
                addButton:{
                    name: '新增标签',
                    addKeys: editKeys,
                    extraKeys:{
                        // key: 123
                    },
                    addFN: articleService.addArticlesLabel
                }
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}

export default ArticleLabel