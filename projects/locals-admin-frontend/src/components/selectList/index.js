import React, { Component } from 'react'
import { Table, Button,Row, Col } from 'antd'
import {checkKey} from '../../utils/utils.js'
import './index.less'

/*
插件说明：
version：1.0

实例：<SelectList setSelect={this.setSelect} selectData={this.state || []} initData={initData} config={selectListConfig} />

父級配置：
setSelect = (list) => {
            this.setState({selectData:list})
}

如何獲取參數：輸出this.state.selectData。

隐藏某项的【选择】按钮： 在数据中添加disabled属性为true

setSelect: 保存值
selectData: 選中參數
initData: 初始化值。
config: 配置列表。

const selectListConfig = {
    equalId:"authCode",                 //匹配key名
    isShowSelectAll: false,        //是否显示全选/全取消按钮,默认为:false
    isFixedSelect: true, // 选择栏右浮动
    leftColumns: [                      //左表格
        {
            title: '权限编码',           //表格標題
            dataIndex: 'authCode',      //表格值
            key: 'authCode'             //表格key名
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName'
        }, {
            title: '昵称',
            dataIndex: 'nickname', // 会对昵称进行输出html，解决微信的emoji符号
            key: 'nickname',
            render: val => <span dangerouslySetInnerHTML={{__html: val}}></span>
        }
    ],
    rightColumns: [                     //右表格
        {
            title: '已选权限编码',
            dataIndex: 'authCode',
            key: 'authCode'
        }, {
            title: '已选权限名称',
            dataIndex: 'authName',
            key: 'authName'
        }
    ]
}

*/

class selectListForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            isShowSelectAll: {
                display: this.props.config.isShowSelectAll ? 'block' : 'none'
            }
        }
        this.handleChecked = this.handleChecked.bind(this)
        this.handleUncheck = this.handleUncheck.bind(this)
        this.selectAll = this.selectAll.bind(this)
        this.unSelectAll = this.unSelectAll.bind(this)
    }
    handleChecked (e) {
        let id = e.target.id
        this.setSelectData(id)
    }
    handleUncheck (e){
        let id = e.target.id
        this.delSelectData(id)
    }
    selectAll () {
        for(let i in this.props.initData.list){
            this.setSelectData(this.props.initData.list[i].id)
        }
    }
    unSelectAll () {
        this.setSelect([])
    }
    setSelectData (id){
        let props = this.props
        let isCheck = true
        let equalId = props.config.equalId
        let list = props.selectData.selectData
        for(let i in list){
            if(String(list[i][equalId]) === String(id)){
                return isCheck = false
            }
        }
        if(isCheck){
            let item = props.initData.list.filter(function (t) {
                return String(t[equalId]) === String(id) ? true : false
            })
            if (item[0] && !item[0]['disabled']) {
                list.push(item[0])
            } else {
                console.log('无法选择!')
            }
            this.setSelect(list)
        }
    }
    delSelectData (id){
        let list = this.props.selectData.selectData
        list.splice(list.findIndex(t => t[this.props.config.equalId] === id),1)
        this.setSelect(list)
    }
    setSelect (list) {
        this.props.setSelect(list)
    }
    setPageNum (pageNum,pageSize) {
        this.props.setPageNum(pageNum,pageSize)
    }
    getRowSelection (){
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                for(let i in selectedRows){
                    this.setSelectData(selectedRows[i].id)
                }
            },
            hideDefaultSelections:true,
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name
            })
        }
    }
    getSelectAll (){
        if(this.props.config.isShowSelectAll){
            return <Button size="small" className="selectListSelectAllBtn" type="primary" onClick = {this.selectAll}> 全选</Button>
        }else{
            return ""
        }
    }
    getUnSelectAll (){
        if(this.props.config.isShowSelectAll){
            return <Button size="small" className="selectListSelectAllBtn" type="primary" onClick = {this.unSelectAll} >全取消</Button>
        }else{
            return ""
        }
    }
    getRightChildren (){
        let opt = {
            title: this.props.config.isShowSelectAll ? '' : '操作',
            width: '60px',
            fixed: this.props.config.isFixedSelect ? 'right' : false,
            align: 'center',
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" id={record[this.props.config.equalId]} onClick={this.handleUncheck}>取消选择</Button>
                </span>
            )
        }
        return (
            <div className="text-right positionRel">
                {this.getUnSelectAll()}
                <Table columns={[...this.props.config.rightColumns,opt]} dataSource={checkKey(this.props.selectData.selectData)} size="middle" pagination={false} {...this.props.config.scroll}>>
                </Table>
            </div>
        )
    }
    getLeftChildren (){
        let pageObj = false
        let opt = {
            title: this.props.config.isShowSelectAll ? '' : '操作',
            width: '60px',
            fixed: this.props.config.isFixedSelect ? 'right' : false,
            align: 'center',
            render: (text, record) => {
                if (typeof record.disabled === 'boolean' && record.disabled) {
                    return <Button size="small" className="mr10" disabled>无法选择</Button>
                } else {
                    return (
                        <Button size="small" className="mr10" type="primary" rowKey="id" id={record[this.props.config.equalId]} onClick={this.handleChecked}>选择</Button>
                    )
                }
            }
        }
        if(this.props.config.showPage){
            pageObj = {
                total: Number(this.props.initData.total),
                pageSize: this.props.selectData.pageSize,
                pageSizeOptions: this.props.selectData.pageSizeOptions,
                current: this.props.selectData.pageNum,
                showTotal: (total) => `共 ${total} 条`,
                onShowSizeChange: (current, pageSize) => {
                    this.setPageNum(1, pageSize)
                },
                onChange: (value,pageSize) => {
                    this.setPageNum(value, pageSize)
                }
            }
        }
        return (
            <div className="text-right positionRel">
                {this.getSelectAll()}
                <Table
                    columns={[...this.props.config.leftColumns,opt]}
                    dataSource={checkKey(this.props.initData.list)}
                    size="middle"
                    rowKey="id"
                    loading={this.props.loading}
                    pagination={pageObj} {...this.props.config.scroll}
                >
                </Table>
            </div>
        )
    }
    render () {
        return (
            <div>
                <Row gutter={24}>
                    <Col span={12} >{this.getLeftChildren()}</Col>
                    <Col span={12} >{this.getRightChildren()}</Col>
                </Row>
            </div>
        )
    }
}
export default selectListForm
