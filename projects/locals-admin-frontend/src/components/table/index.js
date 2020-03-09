import React, { Component } from 'react'
import {Button, Form, Row, Col, Input, InputNumber,DatePicker,Modal,message,Upload,Icon, Table } from 'antd'
import {dataFormat} from '../../utils/utils.js'
import Ajax from '../../utils/axios.js'
import moment from 'moment'
import './index.less'
import XLSX from 'xlsx'

const Dragger = Upload.Dragger;
const FormItem = Form.Item
const ButtonGroup = Button.Group
const { TextArea } = Input

/*
插件说明：
version：2.1

实例： <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.authrotyList.list)} />

onSubmit: 为业务逻辑事件，调用这方法返回一个搜索对象是form表单值。
config: 配置列表。
dataSource: 需要导出的这里传值,导出按钮数据

配置说明：const searchConfig = {
        items: [                                                                //数组形式传入多个input配置对象
            {
                type: "text"                                                    //输入框类型 text|textarea|number|datepicker
                name: '名称',                                                   //标题名称
                key: 'name',                                                    //接口key名
                searchFilterType: "string",                                     //字符类型,前端搜索使用 string|number|datepicker
                defaultValue: "",                                               //初始化值
                placeholder: "请输入名称",                                       //提示文字
                rules: [{ required: true, message: 'Please input your name!' }] //错误提示
            },
            {
                type: "textarea",
                name: '地址',
                key: "address",
                searchFilterType: "string",
                extendAttr: () => { { rows = 1 } }                              //额外attr参数
            },
            {
                type: "number",
                name: '年龄',
                key: "age",
                searchFilterType: "number",
                defaultValue: "",
                extendAttr: () => { { min = 1, max = 10 } },
                fun: () => { console.log("number") },                           //选择后调用方法
            }
        ],
        export: {
            name: '活动数据'                                                      //显示导出按钮
        },
        columns：[{                                                              //导出表格配置
            title: '权限编码',
            dataIndex: 'authCode',
            key: 'authCode',
            exportType: 'text'
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName',
            exportType: 'text'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'date',                                                 //显示输出类型 text | date | none
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
    }
*/

class TableForm extends Component {
    constructor (props){
        super(props)
        this.exportCSV = this.exportCSV.bind(this)
        this.state = {
            loading:false
        }
    }
    componentDidMount () {
    }
    renderChildren () {

    }
    infoModal (){

    }
    render () {
        let data = this.props.config
        return (
            <div>
                <Table>
                    {this.renderChildren()}
                </Table>
                {this.infoModal()}
                {this.props.exntedModal()}
            </div>
        )
    }
}
export default Form.create()(TableForm)