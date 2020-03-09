import React, { Component } from 'react'
import { Button, Form, Row, Col, Input, InputNumber,DatePicker, Select, Cascader, Icon, Checkbox, message, Radio } from 'antd'
import Ajax from '../../utils/axios.js'
import SearchUser from '../searchUserModal'
import BuAreaTreeSelect from '../buAreaTreeSelect'
import ModalSelect from '../modalSelect'
import { dataFormat,checkType,envConfig } from '../../utils/utils.js'
import moment from 'moment'
import './index.less'
import XLSX from 'xlsx'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { TextArea } = Input
const { MonthPicker, RangePicker } = DatePicker
const Option = Select.Option
const InputGroup = Input.Group
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group;

/*
插件说明：
version：2.1.1

实例： <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.authrotyList.list)} onRef={} />

onSubmit: 为业务逻辑事件，调用这方法返回一个搜索对象是form表单值。
`config`: 配置列表。
dataSource: 需要导出的这里传值,导出按钮数据
onRef: 获取search实例，

配置说明：const searchConfig = {
        items: [                                                                //数组形式传入多个input配置对象
            {
                // [必填] 输入框类型
                // text|textarea|number|select|multiple-select|datepicker|rangepicker|rangepickerMonth|selectAreaBu弹框选择大区或BU|monthpicker|searchuser|cascader弹出搜索用户Modal|selectInput
                type: "text",
                // [必填] 标题名称
                name: '名称',
                // [必填] 接口key名
                key: 'name',
                // [可选] 字符类型, 针对input框的输入限制 string|select|number
                searchFilterType: "string",
                // [可选] 初始化值
                defaultValue: "",
                // [可选] 提示文字 rangepicker/rangepickerMonth:使用数组形式，例：['开始', '结束']
                placeholder: "请输入名称",
                // [可选] form.getFieldDecorator第二参数中的rules属性
                rules: [{ required: true, message: 'Please input your name!' }]
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
            },
            {
                type: 'rangepicker', //区间选择日期
                name: '日期',
                key: 'dateList',
                searchFilterType: 'string',
                defaultValue: '',
                placeholder: '日期',
                disabledDate: (current) => {
                    return current && current < moment().endOf('day');
                }
            },
            {
                type: 'select',                                                 // 选择框
                name: '交易状态',
                key: 'respStatus',
                selectData: [
                        {value: '', text: '全部'},
                        {value: '0', text: '未来交易'},
                        {value: '1', text: '已完成交易'},
                        {value: '-1', text: '失败交易'}
                ],
                searchFilterType: 'select',
                defaultValue: '',
                placeholder: ''
            },
            {
                type: 'rangeInput',
                name: '价格',
                key: 'rangePrice',
                searchFilterType: 'string',
                defaultLeftValue: '',
                defaultRightValue: '',
                rangeLeftPlaceholder: '不限',
                rangeRightPlaceholder: '不限'
            },
            {
                type: 'cascader',     // 级联选择
                name: '费用类型/费用科目',
                key: 'typeName',
                cascaderOpts: [{
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [{
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [{
                            value: 'xihu',
                            label: 'West Lake'
                        }]
                    }]
                }, {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [{
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [{
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men'
                        }],
                    }]
                }]
            },
            {
                type: 'selectInput',
                name: '城市',
                key: 'houseSourceCityName',
                placeholder: '请输入城市',
                searchFilterType: 'select',
                searchService: orderListService.getCitylist, // 请求
                optionfield: {
                    resListName: 'list', // 响应的字段名
                    optValue: 'name', // option的value的字段名
                    optText: 'name' // option的text的字段名
                }
            },
            {
                type: 'checkbox',                                                 // 选择框
                name: '设施',
                key: 'respStatus',
                checkboxData: [
                    {value: '0', text: '阳台'},
                    {value: '1', text: '允许做饭'},
                    {value: '2', text: '投影'}
                ],
                searchFilterType: 'select',
                defaultValue: []
            },
        ],
        export: {
            name: '活动数据'                                                      //显示导出按钮
        },
        exportFBtn: {
            name: '前端导出',
            url: `/opt/accounting/account-wallets-current-detail-expor`
        },
        exportBlob: {
            name: '文件流导出',
            extend: 'xls',
            url: `/contract/talents/export-talen-excel`,
            params: _this.state.searchFields
        },
        columns：[{                                                              //导出表格配置
            title: '权限编码',
            dataIndex: 'authCode',
            key: 'authCode',
            // 显示输出类型 text | date | render | none
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
            exportType: 'date',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '房源数',
            exportType: 'render',
            key: 'houseSourceCount',
            dataIndex: 'houseSourceCount',
            render: (v) => <span>{v || 0}</span>
        }],
        modalSelectConfig: {
            title : "选择批号", // modal title
            services : managementFeeService.getCommonBatchList, // 【必填】 获取数据
            equalId : "batchNo", // 返回key值 必须对应
            isHideTotal: true,
            columns : [], // 表格 columns
            attr : { // Modal 状态
                width : 800
            },
            searchKeys:[{  // 筛选
                type: 'input',
                key: 'batchNo',
                placeholder: '请输入批号'
            }]
    }
*/

/*
    onSubmit导出数据类型
    {
        mobile: {value: "11", type: "text"},
        couponState: {value: "222", type: "text"}
    }
*/

class SearchForm extends Component {
    constructor (props){
        super(props)
        this.state = {
            isExport: false,
            searchData : {},
            showKey : '',
            uploadModal : false,
            monthMode: ['month', 'month'],
            radioValue: 1,
            isModalSelectVisible : false,
            selectDir: [],
            radioDir: [],
            expand: false,
            showExpandBtn: false,
            selectInputValue: '',
            selectInputData: {},
            selectedAreaBuList: [] //选中的大区
        }
        this.exportCSV = this.exportCSV.bind(this)
        this.exportFCSV = this.exportFCSV.bind(this)
        this.optsRender = this.optsRender.bind(this)
        this.selectInit = this.selectInit.bind(this)
        this.exportUrl = this.exportUrl.bind(this)
        this.exportBlob = this.exportBlob.bind(this);
    }
    componentWillMount () {
        this.itemsInit()
        this.expandInit()
        this.selectInit()
        this.radioInit()
    }
    componentDidMount () {
        this.props.onRef && (this.props.onRef(this))
        let setData = {}
        for(let i of this.props.config.items){
            setData[i.key] = i.defaultValue
        }
        this.props.form.setFieldsValue(setData)
    }

    itemsInit = () => {
        for(let i in this.props.config.items){
            let item = this.props.config.items[i]
            if((!item.renderSelectData) && item.selectData && item.selectData.length > 0){
                item.renderSelectData = {}
                item.selectData.map((i) => {
                    item.renderSelectData[i.value] = [i.text]
                    return i
                })
            }else if((!item.selectData) && item.renderSelectData){
                item.selectData = []
                for (const key in item.renderSelectData) {
                    item.selectData.push({
                        value: key,
                        text: item.renderSelectData[key]
                    })
                }
            }
        }
    }
    expandInit = () => {
        if (this.props.config.items.length > 3) {
            if(this.props.config.expand === false) {
                this.setState({showExpandBtn: false, expand: true})
                return;
            }
            this.setState({showExpandBtn: true})
        }
    }
    selectInit () {
        let items = this.props.config.items
        let arr = []
        let searchData = {}
        for (let i = 0; i < items.length; i++) {
            if (items[i].type === 'select' || items[i].type === 'multiple-select') {
                arr.push({
                    key: items[i].key,
                    data: items[i].selectData
                })
            }
            if(items[i].defaultValue){
                searchData[items[i].key] = {
                    value: items[i].defaultValue,
                    type: items[i].type
                }
            }
        }
        this.setState({
            selectDir: arr,
            searchData
        })
    }

    radioInit = () => {
        let items = this.props.config.items
        let arr = []
        let value = 1;
        items.forEach((item,index)=>{
            if(item.type === 'radio'){
                if(item.renderRadioData && item.renderRadioData instanceof Array) {
                    item.renderRadioData.forEach((item1,index1)=>{
                        arr.push({
                            value: item1.value,
                            label: item1.label
                        })
                    })
                }
                if(item.defaultValue) {
                    value = item.defaultValue;
                }
            }
        })
        this.setState({
            radioDir: arr,
            radioValue: value
            // searchData
        })
    }
    getData = (fun) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {}
                for(var i in values){
                    data[i] = {
                        value : this.getSearchValue(this.getType(i),values[i]),
                        type : this.getType(i)
                    }
                }
                this.setState({searchData:data})
                fun && fun(data)
                return data
            }else{
                return false
            }
        })
    }
    handleSearch = (e) => {
        e && e.preventDefault()
        this.getData((data)=>{
            if(data){
                this.props.onSubmit(data)
            }
        })
    }
    getSearchValue (type,value){
        switch (type) {
        case "datepicker":
            if(value){
                return moment(value).format("YYYY-MM-DD")
            }else{
                return undefined
            }
        case "monthpicker":
            if (value) {
                return moment(value).format('YYYY-MM')
            } else {
                return undefined
            }
        case "rangepicker":
            if (value) {
                // 将range时间处理成 '2018-07-01 00:00:01' - '2018-07-11 23:59:59'
                let startTime = value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
                let endTime = value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
                return [startTime, endTime]
            } else {
                return undefined
            }
        case "rangepickerMonth":
            if (value) {
                // 将range时间处理成 '2018-07' - '2018-08'
                let startTime = value[0].format('YYYY-MM')
                let endTime = value[1].format('YYYY-MM')
                return [startTime, endTime]
            } else {
                return undefined
            }
        case "multiple-select":
            return value
        case "cascader":
            return value
        case "checkbox":
            return value
        case "radio":
            return value
        case "selectAreaBu":
            return this.state.selectedAreaBuList
        default:
            if (!checkType.isEmpty(value)) {
                return value
            } else {
                return undefined
            }
        }
    }
    getType = (item) => {
        for (let n = 0 ; n < this.props.config.items.length ; n++) {
            if(this.props.config.items[n].key === item){
                return this.props.config.items[n].type
            }
        }
    }
    handleReset = () => {
        this.props.form.resetFields()
        this.setState({
            searchData:{},
            selectedAreaBuList: []
        })
        if(this.props.form.getFieldValue('id')){
            // BUG resetFields 清除不干净，额外加多判断清除
            this.props.form.setFieldsValue({'id': ''})
        }
    }
    getInitalValue (item) {
        switch (item.type) {
        case "datepicker":
        case "monthpicker":
        case "rangepicker":
        case "multiple-select":
            return {}
        case "rangepickerMonth":
            return {initialValue: item.defaultValue ? [moment(item.defaultValue[0], 'YYYY-MM'), moment(item.defaultValue[1], 'YYYY-MM')] : ''}
        case "rangeInput":
            return {
                initialValue: {
                    rangeLeftValue: item.defaultLeftValue,
                    rangeRightValue: item.defaultRightValue
                }
            }
        case "radio":
            return {
                initialValue: item.defaultValue
            }
        default:
            return {initialValue: item.defaultValue || ''}
        }
    }
    getChildren () {
        const { getFieldDecorator } = this.props.form
        const count = this.state.expand ? 24 : 3
        let formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16}
            }
        }
        const children = []
        for (let i = 0; i < this.props.config.items.length; i++) {
            let item = this.props.config.items[i]
            if(item.name.length > 5){//兼容字数超过情况
                formItemLayout.labelCol = {xs: { span: 20 },sm: { span: 10 }}
            }
            children.push(
                <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
                    <FormItem key={i} {...formItemLayout} label={item.name}>
                        {getFieldDecorator(item.key, {
                            rules : item.rules ? item.rules : '',
                            ...this.getInitalValue(item)
                        })(
                            this.getInputType(item)
                        )}
                    </FormItem>
                </Col>
            )
        }
        return children
    }
    getPlaceHolder (item) {
        return item.placeholder || ''
    }
    getInputType (item){
        let self = this
        let bol = true
        let _attr = {
            ...item.extendAttr,
            type : item.searchFilterType,
            onChange : function (value) {
                setTimeout(() => {
                    self.getData()
                    item.fun && item.fun(self, value)
                }, 300)

            }
        }
        if(item.placeholder){
            _attr.placeholder = item.placeholder || ''
        }
        switch (item.type) {
        case "text":
            return <Input {..._attr} />
        case "number":
            return <InputNumber {..._attr} />
        case "textarea":
            return <TextArea {..._attr} />
        case "datepicker":
            return <DatePicker {..._attr} />
        case "monthpicker":
            return <MonthPicker {..._attr} />
        case "rangepicker":
            return <RangePicker disabledDate={item.disabledDate} allowClear={false} format="YYYY-MM-DD" {..._attr} />
        case "rangepickerMonth":
            const monthFormat = 'YYYY-MM'
            return <RangePicker allowClear={false} mode={this.state.monthMode} format={monthFormat} {..._attr} onPanelChange={function (value,mode){return self.onRangepickerMonth(value,mode,item)}}/>
        case "select":
            let opts = []
            let items = this.props.config.items
            let arr = []
            let searchData = {}
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === 'select' || items[i].type === 'multiple-select') {
                    arr.push({
                        key: items[i].key,
                        data: items[i].selectData
                    })
                }
                if(items[i].defaultValue){
                    searchData[items[i].key] = {
                        value: items[i].defaultValue,
                        type: items[i].type
                    }
                }
            }
            let dir = arr
            for(let i = 0; i < dir.length; i++) {
                if (item.key === dir[i].key) {
                    if(dir[i].data){
                        opts = dir[i].data.map((v, i) => (<Option value={v.value} key={i}>{v.text}</Option>))
                    }
                }
            }
            return <Select {..._attr} getPopupContainer={function () { return document.getElementById("form_area") } }>{opts}</Select>
        case "multiple-select":
            let multiOpts = []
            let multiDir = this.state.selectDir
            for(let i = 0; i < multiDir.length; i++) {
                if (item.key === multiDir[i].key) {
                    multiOpts = multiDir[i].data.map((v, i) => (<Option value={v.value} key={i}>{v.text}</Option>))
                }
            }
            return <Select mode="multiple" {..._attr} getPopupContainer={function () { return document.getElementById("form_area") } }>{multiOpts}</Select>
        case 'modalSelect':
            return <Input readOnly={bol} onClick={function (){self.setState({isModalSelectVisible: true, modalSelectKey: item.key})}} />
        case 'searchuser':
            return <SearchUser {..._attr} getData={this.getData} field={item.key} form={this.props.form} />
        case 'cascader':
            if(!!item.loadData){
                return <Cascader {..._attr} loadData={item.loadData} options={item.cascaderOpts} fieldNames={item.fieldNames} changeOnSelect />
            }
            return <Cascader {..._attr} options={item.cascaderOpts} />
        case "rangeInput":
            return <RangeInput {..._attr} rangeLeftPlaceholder={item.rangeLeftPlaceholder} rangeRightPlaceholder={item.rangeRightPlaceholder} />

        case 'checkbox':
            return <CheckboxGroup {..._attr} options={item.checkboxData} />
        case 'radio':
            let radioOpt = [];
            let radioDir = this.state.radioDir;
            radioOpt = radioDir.map((v, i) => (<Radio value={v.value} key={i}>{v.label}</Radio>))
            return <RadioGroup {..._attr} >{radioOpt}</RadioGroup>
        case 'selectAreaBu':
            const {selectedAreaBuList} = self.state
            let buId = selectedAreaBuList.length > 0 ? selectedAreaBuList[selectedAreaBuList.length - 1] : ''
            return (
                <BuAreaTreeSelect buId={buId} placeholder={self.getPlaceHolder(item)} isSelectArea onChange={function (areaId,buId) {
                    let arr = []
                    if(!!areaId) {
                        arr.push(areaId)
                    }
                    if(!!buId) {
                        arr.push(buId)
                    }
                    self.setState({
                        selectedAreaBuList: arr
                    })
                }}
                />
            )
        case 'selectInput':
            let selectInputAttr = {
                showSearch: true,
                defaultActiveFirstOption: false,
                showArrow: false,
                filterOption: false,
                notFoundContent: null
            }
            const { selectInputData } = this.state
            const options = selectInputData[item.key] ? selectInputData[item.key].map(d => <Option key={d.value}>{d.text}</Option>) : null
            return <Select {..._attr} {...selectInputAttr} onSearch={function (value) {return self.selectInputSearch(value, item)}} onChange={function (value) { return self.selectInputChange(value, item)}}>{options}</Select>
        default:
            break
        }
    }
    selectInputSearch = (value, item) => {
        let params = {
            areaLevel: 3,
            nameLike: value
        }
        const { selectInputData } = this.state
        const { resListName, optValue, optText } = item.optionfield
        value && item.searchService(params).then(res => {
            // console.log('--->', res)
            let list = [], optv, optt
            for (let i = 0; i < res[resListName].length; i++) {
                if (optValue) {
                    optv = res[resListName][i][optValue]
                } else {
                    optv = res[resListName][i][optText]
                }
                list.push({
                    value: optv,
                    text: res[resListName][i][optText]
                })
            }
            selectInputData[item.key] = list
            this.setState({selectInputData})
        })
    }
    selectInputChange = (value, item) => {
        this.props.form.setFieldsValue({[item.key]: value})
    }
    onRangepickerMonth (value,mode,item){
        this.props.form.setFieldsValue({[item.key]: value})
        this.setState({
            monthMode: [
              mode[0] === 'date' ? 'month' : mode[0],
              mode[1] === 'date' ? 'month' : mode[1]
            ]
        })
        setTimeout(() => {
            this.getData()
            item.fun && item.fun(this)
        }, 300)
    }
    optsRender (val) {
        let dir = JSON.parse(JSON.stringify(this.state.selectDir))
        for (let i = 0; i < dir.length; i++) {
            if (dir[i].key === val.key) {
                dir[i].data = val.data
            }
        }
        this.setState({
            selectDir: dir
        })
    }
    exportCSV (header){
        let params = this.formatTable(this.props.config.columns,this.props.dataSource)
        const ws = XLSX.utils.json_to_sheet(params.data,params.header)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `${this.props.config.export.name}.xlsx`)
    }
    exportFCSV (header){
        let params = this.formatTable(this.props.config.columns,this.props.dataSource)
        const ws = XLSX.utils.json_to_sheet(params.data,params.header)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `${this.props.config.exportFBtn.name}.xlsx`)
    }
    getRenderType (obj,key,item){
        let isDom = obj.render(key, item)
        if(typeof isDom === "object"){//虚DOM通过正则匹配
            let _str = JSON.stringify(isDom)
            try {//字符串
                return _str.match(/props":{"children":"(\S*)"}/)[1]
            } catch (error) {//数组
                return this.renderTypeArr(_str)
            }
        }else{
            return isDom
        }
    }
    exportUrl (){
        this.setState({isExport : true})
        message.warning('正在导出!')
        Ajax.get(this.props.config.exportFBtn.url,this.props.config.exportFBtn.params).then(res => {
            this.setState({isExport : false})
            window.location.href = `${envConfig.newImagePrefix}${res}`
            message.success('导出成功!')
        }).catch((err) => {
            this.setState({isExport : false});
            console.log(err);
            message.warning(`导出失败!${err.message}`)
        })
    }
    renderTypeArr (str){
        let reStr = ""
        if(str.match(/props":{"children":(\S*)},/)){
            let arrStr = JSON.parse(str.match(/props":{"children":(\S*)},/)[1])
            if(typeof arrStr === "object"){
                for(let index in arrStr){
                    reStr = reStr + arrStr[index]
                }
            }else{
                reStr = arrStr
            }
            return reStr
        }else{
            return reStr
        }
    }
    formatTable (header,table){
        /* 返回数据模板
        [
            { A:"S", B:"h", C:"e", D:"e", E:"t", F:"J", G:"S" },
            { A: 1,  B: 2,  C: 3,  D: 4,  E: 5,  F: 6,  G: 7  },
            { A: 2,  B: 3,  C: 4,  D: 5,  E: 6,  F: 7,  G: 8  }
        ], {header:["A","B","C","D","E","F","G"], skipHeader:true}
        */
        let returnHeader = []
        let returnTable = []
        let title = {}
        for(let index in header){//获取header
            if(header[index].exportType !== "none"){
                returnHeader.push(header[index].key)
                title[header[index].key] = header[index].title
            }
        }
        returnTable.push(title)

        if(table){
            for(let index in table){//获取table
                let dataItem = {}
                header.forEach((o) => {
                    switch (o.exportType){
                    case 'text':
                        dataItem[o.key] = table[index][o.key]
                        break
                    case 'date':
                        dataItem[o.key] = dataFormat(table[index][o.key],'YYYY-MM-DD HH:mm:ss')
                        break
                    case 'render':
                        dataItem[o.key] = this.getRenderType(o,table[index][o.key], table[index])
                        break
                    default :
                        dataItem[o.key] = table[index][o.key]
                    }
                })
                returnTable.push(dataItem)
            }
        }
        return {
            data: returnTable,
            header:{header:returnHeader, skipHeader:true}
        }
    }
    onLoop = (value, item, arr = []) => {
        let opts = value,
            allOpts = item,
            text = arr
        if (opts.length > text.length) {
            if (text.length === 0) {
                for (let i = 0; i < item.length; i++) {
                    if (value[text.length] === item[i].value) {
                        text.push(item[i].label)
                        allOpts = item[i].children
                        return this.onLoop(opts, allOpts, text)
                    }
                }
            } else {
                for (let i = 0; i < allOpts.length; i++) {
                    if (value[text.length] === allOpts[i].value) {
                        text.push(allOpts[i].label)
                        if (allOpts[i].children) {
                            allOpts = allOpts[i].children
                        } else {
                            return text
                        }
                        return this.onLoop(opts, allOpts, text)
                    }
                }
            }
        }
    }
    getRangepickerMonth (startDate, endDate, format){
        let dateFormat = format ? format : "YYYY-MM"
        return `${moment(startDate).format(dateFormat)} - ${moment(endDate).format(dateFormat)}`
    }
    getRangepicker (startDate, endDate, format){
        let dateFormat = format ? format : "YYYY-MM-DD"
        return `${moment(startDate).format(dateFormat)} - ${moment(endDate).format(dateFormat)}`
    }
    exportBlob (){
        this.setState({isExport : true})
        message.warning('正在导出!')
        console.log(this.props.config);
        Ajax.formGet(this.props.config.exportBlob.url,`${this.props.config.exportBlob.name}.${this.props.config.exportBlob.extend}`,this.props.config.exportBlob.params,true).then(res => {
            this.setState({isExport : false})
            // window.location.href = `${envConfig.newImagePrefix}${res}`
            console.log(res);
            message.success('导出成功!')
        }).catch((err) => {
            this.setState({isExport : false});
            console.log(err);
            message.warning(`导出失败!${err.message}`)
        })
    }
    getExportBtn () {
        if(this.props.config.export){
            return <Button className="ml10" type="primary" style={{ marginLeft: 8 }} onClick={this.exportCSV} >导出</Button>
        }else if(this.props.config.exportFBtn && this.props.config.exportFBtn.url){
           return <Button className="ml10" type="primary" disabled={this.state.isExport} onClick={this.exportUrl} >导出</Button>
        }else if(this.props.config.exportFBtn){
            return <Button className="ml10" type="primary" onClick={this.exportFCSV} >导出</Button>
        }else if(this.props.config.exportBlob){
            return <Button className="ml10" type="primary" onClick={this.exportBlob} >导出</Button>
        }else{
            return ''
        }
    }
    setSelect = (id) => {
        const key = this.state.modalSelectKey
        this.props.form.setFieldsValue({[key]: id})
        this.setState({
            isModalSelectVisible:false,
            modalSelectValue: id
        },()=>{
            this.getData()
            console.log(this.props.form.getFieldsValue())
        })
    }
    toggle = () => {
        const { expand } = this.state
        this.setState({ expand: !expand })
    }
    render () {
        const { expand, showExpandBtn } = this.state
        return (
            <Form
                className="ant-advanced-search-form "
                onSubmit={this.handleSearch}
            >
                <Row gutter={24} id="form_area">
                    <Col span={24} className="searchInputItem" >
                        {this.getChildren()}
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Col span={8} style={{textAlign: 'right'}}>
                        {this.props.children || null}
                        <ButtonGroup>
                            <Button type="primary" icon="search" htmlType="submit" />
                            <Button type="primary" icon="close" onClick={this.handleReset} />
                        </ButtonGroup>
                        <ButtonGroup>
                            {this.getExportBtn()}
                        </ButtonGroup>
                        {showExpandBtn ?
                            <a className="ml10" style={{fontSize: 14}} onClick={this.toggle}>
                                <span>{expand ? '收起' : '展开'}</span>
                                <Icon className="ml5" type={expand ? 'up' : 'down'} />
                            </a> : null}
                    </Col>
                </Row>

                {this.state.isModalSelectVisible && <ModalSelect setSelect={this.setSelect} initData={this.state.modalSelectValue} config={this.props.config.modalSelectConfig} visible={this.state.isModalSelectVisible} />}
            </Form>
        )
    }
}

class RangeInput extends Component {

    constructor (props) {
        super(props)
        const value = props.value || {}
        this.state = {
            rangeLeftValue: value.rangeLeftValue || '',
            rangeRightValue: value.rangeLeftValue || ''
        }
    }
    componentWillReceiveProps (nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }
    handleRangeLeftValue = (e) => {
        const rangeLeftValue = e.target.value || ''

        if (!('value' in this.props)) {
            this.setState({ rangeLeftValue });
        }
        this.triggerChange({ rangeLeftValue });
    }
    handleRangeRightValue = (e) => {
        const rangeRightValue = e.target.value || ''

        if (!('value' in this.props)) {
            this.setState({ rangeRightValue });
        }
        this.triggerChange({ rangeRightValue });
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }
    render () {
        const state = this.state
        const { rangeLeftPlaceholder, rangeRightPlaceholder } = this.props
        return (
            <InputGroup compact>
                <Input
                    value={state.rangeLeftValue}
                    style={{ width: '45%', textAlign: 'center' }}
                    placeholder={rangeLeftPlaceholder}
                    onChange={this.handleRangeLeftValue}
                />
                <Input style={{ width: '10%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', padding: 0 }} placeholder="~" disabled />
                <Input
                    value={state.rangeRightValue}
                    style={{ width: '45%', textAlign: 'center', borderLeft: 0 }}
                    placeholder={rangeRightPlaceholder}
                    onChange={this.handleRangeRightValue}
                />

            </InputGroup>
        );
    }

}

SearchForm = Form.create({})(SearchForm)

export default SearchForm
