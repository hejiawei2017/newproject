import React, { Component } from 'react'
import {withRouter, Link} from 'react-router-dom'
import {cityService} from '../../services'
import { Table, Button, Popconfirm, notification } from 'antd'
import Search from '../../components/search'
import {pageOption, getNewImagePrefix, checkKey} from '../../utils/utils'
import filterChange from '../../utils/filterChange'
import './index.less'
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '区域名称',
            key: 'nameLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入区域名称'
        }, {
            type: 'text',
            name: '拼音首字母',
            key: 'fullWordFirstLetterPinYinLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入拼音首字母'
        }
    ],
    export: {
        name: '城市列表'
    }
}

class cityList extends Component {
    constructor (){
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            searchFields: {},
            orderBy: ''
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    renderTable () {
        const {pageNum, pageSize, orderBy, searchFields} = this.state
        const params = {
            pageNum: pageNum,
            pageSize: pageSize
        }
        const {nameLike,fullWordFirstLetterPinYinLike} = searchFields
        nameLike && (params.nameLike = nameLike)
        fullWordFirstLetterPinYinLike && (params.fullWordFirstLetterPinYinLike = fullWordFirstLetterPinYinLike)
        orderBy && (params.orderBy = orderBy)
        cityService.getChinaAreas(params).then((data) => {
            this.setState({
                tableData: data.list,
                totalCount: data.total
            })
        }).catch((e) => { })
    }
    deleteActAds (id){
        cityService.deleteChinaAreas(id).then((data)=>{
            notification.success({message:'删除成功！'})
            this.renderTable()
        })
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                nameLike: searchFields.nameLike.value,
                fullWordFirstLetterPinYinLike: searchFields.fullWordFirstLetterPinYinLike.value
            }
        }, this.renderTable)
    }
    sorterChange = (p, f, sorter) => {
        // 排序
        const keys = [{
            key: 'heat',
            str: 'heat'
        }, {
            key: 'chosen',
            str: 'chosen'
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
            title: '区域名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '城市图片',
            dataIndex: 'image',
            key: 'image',
            render: val => val ? <img className="adsImg" src={getNewImagePrefix(val)} alt="加载失败..." /> : null
        }, {
            title: '区域代码',
            dataIndex: 'code',
            key: 'code'
        }, {
            title: '全拼音',
            dataIndex: 'fullPinYin',
            key: 'fullPinYin'
        }, {
            title: '拼音首字母',
            dataIndex: 'fullWordFirstLetterPinYin',
            key: 'fullWordFirstLetterPinYin'
        }, {
            title: '首字母',
            dataIndex: 'firstWordFirstLetterPinYin',
            key: 'firstWordFirstLetterPinYin'
        }, {
            title: '热门值',
            dataIndex: 'heat',
            key: 'heat',
            sorter: true
        }, {
            title: '精选值',
            dataIndex: 'chosen',
            key: 'chosen',
            sorter: true
        }, {
            title: '操作',
            width: 150,
            exportType: 'none',
            render: (text, record) => (
                <span>
                    <Link to={`/application/cityList/edit/${record.id}`}>
                        <Button size="small" className="mr10" type="primary">编辑</Button>
                    </Link>
                    <Popconfirm title="确定删除?" onConfirm={function (){_this.deleteActAds(record.id)}} okText="确认" cancelText="取消">
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
        searchConfig.columns = columns
        return (
            <div className="banner-list">
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(_state.tableData)} />
                <div className="text-right pt10 mb10">
                    <Link to="/application/cityList/add">
                        <Button type="primary">新增</Button>
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
export default withRouter(cityList)