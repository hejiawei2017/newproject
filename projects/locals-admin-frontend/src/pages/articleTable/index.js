import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {articleService} from '../../services'
import { Table, Button, Popconfirm, notification } from 'antd'
import Search from '../../components/search'
import {pageOption, dataFormat} from '../../utils/utils'
import {categoryType, articleStatus, bannerPlatform} from '../../utils/dictionary'
import filterChange from '../../utils/filterChange'

let platformOptions = []
for (const key in bannerPlatform) {
    platformOptions.push({value: key, text: bannerPlatform[key]})
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '标题名称',
            key: 'titleLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入标题名称'
        }, {
            type: 'select',
            name: '平台类型',
            key: 'platformIn',
            defaultValue: platformOptions[0].value,
            selectData: platformOptions,
            renderSelectData: bannerPlatform,
            searchFilterType: 'select',
            placeholder: '请输入平台类型'
        }
    ]
}

class ArticleList extends Component {
    constructor (){
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            searchFields: {platformIn: 'APP,MINI,H5,PC'},
            articleStatusIn: "PUBLISHED,WAIT"
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    renderTable () {
        const {pageNum, pageSize, articleStatusIn, orderBy, searchFields} = this.state
        const params = {
            ...searchFields,
            pageNum: pageNum,
            pageSize: pageSize,
            articleStatusIn: articleStatusIn
        }
        orderBy && (params.orderBy = orderBy)
        articleService.getArticlesTable(params).then((data) => {
            this.setState({
                tableData: data.list,
                totalCount: data.total
            })
        }).catch((e) => { })
    }
    deleteArticles (id){
        articleService.deleteArticles(id).then((data)=>{
            notification.success({
                message: '删除成功！'
            })
            this.renderTable()
        })
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                titleLike: searchFields.titleLike.value,
                platformIn: searchFields.platformIn.value
            }
        }, this.renderTable)
    }
    sorterChange = (p, f, sorter) => {
        // 排序
        const keys = [{
            key: 'createTime',
            str: 'create_time'
        }]
        const filter = filterChange(this.state.orderBy,sorter, keys)
        if(filter !== false){
            this.setState({
                orderBy: filter,
                pageNum: 1
            },this.renderTable)
        }
    }
    render () {
        const _this = this
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '文章类别',
            dataIndex: 'category',
            key: 'category',
            render: _ => <span>{categoryType[_]}</span>
        }, {
            title: '发布状态',
            dataIndex: 'articleStatus',
            key: 'articleStatus',
            render: _ => <span>{articleStatus[_]}</span>
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" onClick={function () {
                        _this.props.history.push('/application/article/edit/' + record.id)
                    }}
                    >编辑</Button>
                    <Popconfirm title="确定删除?" onConfirm={function (){_this.deleteArticles(record.id)}} okText="确认" cancelText="取消">
                        <Button size="small" type="danger">删除</Button>
                    </Popconfirm>
                </span>
            )
        }]
        const _state = this.state
        const pageObj = {
            total: _state.totalCount,
            pageSize: _state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: _state.pageSizeOptions,
            current: _state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.renderTable)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right pt10 mb10">
                    <Link to="/application/article/add">
                        <Button type="primary">发布图文</Button>
                    </Link>
                </div>
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    rowKey="id"
                    pagination={pageObj}
                    onChange={this.sorterChange}
                />
            </div>
        )
    }
}
export default withRouter(ArticleList)