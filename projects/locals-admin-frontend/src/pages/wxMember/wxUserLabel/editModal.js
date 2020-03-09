import React, { Component } from 'react'
import { Button, Form, Modal, Row, Col, Input, InputNumber,DatePicker, Select, Cascader, Icon, Checkbox, message, Radio } from 'antd'
import moment from 'moment'
import { checkType } from '../../../utils/utils.js'
const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker

class EditLabelModalForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editModalVisible: true,
            selectDir: [],
            rangeDis: false,
            subData: {},
            curId: '',
            curItems: []
        }
    }
    componentWillMount () {
    }
    componentDidMount (){
        this.setState({
            curItems: this.props.items
        })
    }
    componentWillReceiveProps (nextProps,props){
        if( nextProps.items != null && nextProps.items instanceof Array && nextProps.items.length > 0 ) {
            this.setState({
                curItems: nextProps.items
            })
        }
        if ( nextProps.rangeDis !== props.rangeDis ) {
            this.setState({
                rangeDis: nextProps.rangeDis
            })
        }
    }

    handleCancel = () => {
        // this.setState({
        //     editModalVisible: false
        // })
        this.props.handleCancel(false);
    }
    modalAddSave = (values) => {
        this.props.modalAddSave(values)
    }
    modalEditSave = (values) => {
        this.props.modalEditSave(values)
    }
    onModalOk = (e) => {
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleCancel()
                e && e.preventDefault()
                this.getData().then((data)=>{
                    if(data){
                        if(this.props.editType === 'add'){
                            this.modalAddSave(data)
                        }else{
                            this.modalEditSave(data)
                        }
                    }
                }).catch(err=>console.log(err))
            }
        })
    }
    afterClose = ()=>{
        this.resetFields()
    }
    resetFields = () =>{
        this.props.form.resetFields()
    }
    getPlaceHolder = (item) => {
        return item.placeholder || ''
    }
    getType = (item) => {
        const items = this.props.items;
        for (let n = 0 ; n < items.length ; n++) {
            if(items[n].key === item){
                return items[n].element
            }
        }
    }
    getSearchValue (type,value){
        // console.log(type,value)
        switch (type) {
        case "datepicker":
            if(value){
                return moment(value).format("YYYY-MM-DD")
            }else{
                return undefined
            }
        case "rangepicker":
            if (value) {
                // 将range时间处理成 '2018-07-01 00:00:01' - '2018-07-11 23:59:59'
                let startTime = value[0].format('YYYY-MM-DD')
                let endTime = value[1].format('YYYY-MM-DD')
                return [startTime, endTime]
            } else {
                return undefined
            }
        case "radio":
            return value
        default:
            if (!checkType.isEmpty(value)) {
                return value
            } else {
                return undefined
            }
        }
    }
    getData = () => {
        return new Promise((resolve, reject)=>{
            this.props.form.validateFields((err, values) => {
                // console.log(values, "valuesvaluesvalues")
                if (!err) {
                    const data = {}
                    for(var i in values){
                        data[i] = {
                            value : this.getSearchValue(this.getType(i),values[i]),
                            type : this.getType(i)
                        }
                    }
                    this.setState({subData: data})
                    resolve(data)
                }else{
                    reject(false)
                }
            })

        })
    }
    handleSubmit = (e) => {
        e && e.preventDefault()
        this.getData().then((data)=>{
            // console.log(data,"datadatadatadata")
            if(data){
                this.props.onSubmit(data)
            }
        }).catch(err=>console.log(err))
    }
    onRadioChange = (e,dataItem) => {
        let curItems = this.state.curItems;
        curItems.forEach((item,index)=>{
            if(item.key === dataItem.key && item.key === "termOfValidity") {
                if(e.target.value === 2) {
                    this.props.changeDis(true)
                }else {
                    this.props.changeDis(false)
                }
            }
        })
    }
    getInitalValue = (item) => {
        // console.log(item,"itemrange")
        switch (item.element) {
        case "datepicker":
        case "monthpicker":
        case "rangepicker":
            return { initialValue: item.defaultValue ? [moment(item.defaultValue[0]), moment(item.defaultValue[1])] : '' }
        case "multiple-select":
            return {}
        case "rangepickerMonth":
            return {initialValue: item.defaultValue ? [moment(item.defaultValue[0]), moment(item.defaultValue[1])] : ''}
        case "rangeInput":
            return {
                initialValue: {
                    rangeLeftValue: item.defaultLeftValue,
                    rangeRightValue: item.defaultRightValue
                }
            }
        case "radio":
            // console.log(item.defaultValue,"item.defaultValue")
            return {
                initialValue: Number(item.defaultValue)
            }
        default:
            return {initialValue: item.defaultValue || ''}
        }
    }
    onSel = (e,dir) => {
        console.log(e)
        let selStr = ""
        dir.forEach((item,index) => {
            if(item.value === e) {
                selStr = item.text
            }
        })
        console.log(e, selStr )
        let curItems = this.state.curItems;
        if(selStr === "房源活动") {
            curItems.forEach((item,index)=>{
                if(item.key === "describe" || item.key === "aaiDescribe") {
                    item.label = "AAI说明"
                    item.key = "aaiDescribe"
                }
            })
        }else {
            curItems.forEach((item,index)=>{
                if(item.key === "describe" || item.key === "aaiDescribe") {
                    item.label = "说明"
                    item.key = "describe"
                }
            })
        }
        this.setState({
            curItems
        })
    }
    renderFormItem = () => {
        const self = this;
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }
        let _attr = {
            onChange : function (val) {
            }
        }
        let formItems = this.state.curItems;
        let formItemList = []
        formItems.map((item, index) => {
            let FormItemDom
            let key = item.key;
            switch (item.element) {
                case 'number':
                    FormItemDom = <InputNumber {..._attr} placeholder={item.placeholder || '请输入'} />
                    break
                case "select":
                    let opts = []
                    let dir = item.selectData;
                    opts = dir.map((v, i) => (<Option value={v.value} key={i}>{v.text}</Option>))
                    FormItemDom = <Select onChange={ function (e) { self.onSel(e, dir) }} placeholder={item.placeholder || '请选择'}>{opts}</Select>
                    break
                case 'radio':
                    let radioOpt = [];
                    let radioDir = item.radioData;
                    radioOpt = radioDir.map((v, i) => (<Radio value={v.value} key={i}>{v.label}</Radio>))
                    FormItemDom = <RadioGroup onChange={ function (e){ self.onRadioChange(e,item)} }>{radioOpt}</RadioGroup>
                    break
                case 'textarea':
                    FormItemDom = <Input.TextArea {..._attr} rows={3} placeholder={item.placeholder || '请输入'} />
                    break
                case "datepicker":
                    FormItemDom = <DatePicker {..._attr}/>
                    break
                case "rangepicker":
                    if(this.props.rangeDis){
                        FormItemDom = <RangePicker {..._attr} disabledDate={item.disabledDate} allowClear={false} format="YYYY-MM-DD" />
                    } else {
                        FormItemDom = <RangePicker style={{display:"none"}} {..._attr} disabledDate={item.disabledDate} allowClear={false} format="YYYY-MM-DD" />
                    }
                    break
                default:
                    FormItemDom = <Input {..._attr} placeholder={item.placeholder || '请输入'} />
                    break
            }
            if(item.element === "rangepicker") {
                if(this.props.rangeDis){ //如果可以 显示
                    formItemLayout.key = key
                    formItemList.push((
                        <FormItem
                            {...formItemLayout}
                            label={item.label}
                        >
                            {getFieldDecorator(key, {
                                ...this.getInitalValue(item),
                                rules: item.rules ? [item.rules] : ''
                            })(FormItemDom)}
                        </FormItem>
                    ))
                }
                return false;
            }

            formItemLayout.key = key
            formItemList.push((
                <FormItem
                    {...formItemLayout}
                    label={item.label}
                >
                    {getFieldDecorator(key, {
                        ...this.getInitalValue(item),
                        rules: item.rules ? [item.rules] : ''
                    })(FormItemDom)}
                </FormItem>
            ))
            return item
        })
        return formItemList
    }

    render () {
        const {confirmLoading, formItems} = this.state
        const { editModalVisible, editType } = this.props;
        return (
            <Modal
                visible={editModalVisible}
                title={editType === "add" ? '新增标签' : '编辑标签'}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                confirmLoading={confirmLoading}
                cancelText="关闭"
                okText="保存"
                afterClose={this.afterClose}
            >
                <Form>
                    {this.renderFormItem()}
                </Form>
            </Modal>
        )
    }
}

let EditLabelModal = Form.create()(EditLabelModalForm)
export default EditLabelModal
