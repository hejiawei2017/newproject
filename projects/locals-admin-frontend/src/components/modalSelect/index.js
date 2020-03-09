import React, { Component } from 'react'
import { Table, Modal, Button, Input } from 'antd'
import {checkKey} from '../../utils/utils.js'
import {dicModel} from '../../utils/dictionary'

/*
插件说明：
version：1.0

实例：<ModalSelect setSelect={this.setSelect} initData={this.state.selectData} config={modalSelectConfig} />

父級配置：
setSelect = (id) => {
            this.setState({
                dataSource:id,
                isModalSelectVisible:false
            })
}

如何獲取參數：輸出this.state.dataSource。

setSelect: 保存值
initData: 初始化值。
config: 配置列表。

const modalSelectConfig = {
    title : "文章列表",
    services : articleService.getArticlesTable,     //请求数据
    equalId : "id",
    isHideTotal : true,    //默认位为false
    columns : [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    }, {
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
        render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
    }],
    attr : {
        width : 800,                    //modal宽度
        visible : this.state.isModalSelectVisible     //modal是否显示
    },
    extraData:{                                       //额外搜索传值
        platformIn: this.state.platform,
        articleStatusIn: 'PUBLISHED'
    },
    filterFun (data){                               //额外过滤值方法
        let arr = data.list.filter((i) => {
            return i.category === _this.state.isModalSelectType
        })
        data.list = arr
        return data
    },
    searchKeys:[{  // 搜索
        type: 'input', // 【必填】暂时只有input
        key: 'id', // 【必填】修改的key
        placeholder: '请输入id'
    }]
}
*/

class ModalSelect extends Component {
    constructor (props) {
        super (props)
        this.state = {
            loading : true,
            dataSource : {
                list : []
            },
            searchForm:{}
        }
        this.handleChecked = this.handleChecked.bind(this)
        this.handleUncheck = this.handleUncheck.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    componentDidMount (){
        this.setState({
            pageNum:1,
            pageSize:10,
            loading : false
        }, this.queryTable)
    }
    changeSearchFormState = (e) => {
        const {name,value} = e.target
        let searchForm = {...this.state.searchForm}
        searchForm[name] = value
        this.setState({
            searchForm
        })
    }
    handleChecked (e) {
        let id = e.target.id
        this.setSelectData(id)
    }
    handleUncheck (e){
        let id = e.target.id
        this.delSelectData(id)
    }
    setPageNum (pageNum, pageSize) {
        this.setState({
            pageNum:pageNum,
            pageSize:pageSize,
            loading : false
        }, this.queryTable)
    }
    queryTable = () => {
        let params = {
            ...this.props.config.extraData,
            ...this.state.searchForm,
            pageNum : this.state.pageNum,
            pageSize : this.state.pageSize
        }
        this.props.config.services(params).then((data) => {
            this.setState({
                dataSource : this.props.config.filterFun ? this.props.config.filterFun(data) : data,
                loading : false
            })
        }).catch((e) => {})
    }
    setSelectData (id){
        this.setSelect(id)
    }
    setSelect (id) {
        this.props.setSelect(id)
    }
    handleCancel () {
        this.props.setSelect(this.props.initData)
    }
    renderSearchForm = () => {
        if(!this.props.config.searchKeys) return null
        const _this = this
        let searchKeys = [...this.props.config.searchKeys]
        let oList = searchKeys.map((item,index)=>{
            switch (item.type) {
            case 'input':
                return <span className="w200 display-inline_block mr10" key={'renderSearchForm' + item.key + '_' + index}><Input name={item.key} placeholder={item.placeholder} onChange={this.changeSearchFormState} /></span>
                break;
            default:
                break;
            }
            return null
        })
        return (
            <div className="mb20" key="renderSearchForm">
                {oList}
                <Button type="primary" onClick={_this.queryTable} key="renderSearchForm-Button">查询</Button>
            </div>
        )
    }
    renderChildren (){
        let pageObj = {
            total: this.state.dataSource ? Number(this.state.dataSource.total) : 0,
            pageSize: this.state.dataSource ? this.state.dataSource.pageSize : 0,
            pageSizeOptions: this.state.dataSource ? this.state.dataSource.pageSizeOptions : 0,
            current: this.state.dataSource ? this.state.dataSource.pageNum : 0,
            showTotal: (total) => this.props.config.isHideTotal ? `` : `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setPageNum(1, pageSize)
            },
            onChange: (value,pageSize) => {
                this.setPageNum(value, pageSize)
            }
        }

        let opt = {
            title: '操作',
            width: '60px',
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" id={record[this.props.config.equalId]} onClick={this.handleChecked}>选择</Button>
                </span>
            )
        }

        return (
            <div>
                {this.renderSearchForm()}
                <Table loading={this.state.loading} columns={[...this.props.config.columns,opt]} dataSource={checkKey(this.state.dataSource.list)} pagination={pageObj} >
                </Table>
            </div>
        )
    }
    render () {
        return (
            <div>
                <Modal
                    title={this.props.config.title}
                    visible={this.props.visible}
                    {...dicModel}
                    footer={null}
                    {...this.props.config.attr}
                    onCancel={this.handleCancel}
                >
                    {this.renderChildren()}
                </Modal>
            </div>
        )
    }
}
export default ModalSelect