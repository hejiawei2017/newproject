import React, {Component} from 'react'
import {Input, Form,Modal,Button,InputNumber,Row,DatePicker,Col,Select,Divider,message,Alert,Spin,Icon} from 'antd'
import {connect} from "react-redux"
import {serviceIncrementManage} from "../../../services"
import AuditingLogTable from './auditingLog'//查看审核记录
import AuditingReject from './auditingReject'//驳回
import {validTypeIdList, chargeTypeList, ChargeTypeList, ContainUnit} from "../../../utils/dictionary"
import moment from 'moment'
import Global from "../../../utils/Global"
import {reg} from "../../../utils/utils"
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const { RangePicker } = DatePicker

const mapStateToProps = (state, action) => {
    return {
        serviceIncrementProviderListM: state.serviceIncrementProviderListM,
        serviceIncrementServiceListM:state.serviceIncrementServiceListM,
        serviceIncrementDetailM:state.serviceIncrementDetailM,
        linkIncrementProviderListM: state.linkIncrementProviderListM
    }
}

class IncrementDetailForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formData:[],
            disable:true,
            loading:true,
            serviceLoading:true,
            provideLoading:true,
            logVisible:false,
            rejectVisible:false,
            getLoading:true,
            serviceList:[],
            Chargetype:1,
            Validtypeid:'',
            changeShowType:false,
            serviceListOne:[],
            providerList:[],
            serviceListTwo:[],
            customsArr:[],
            alert:false,
            enterLoading:false,
            saveLoading:false,
            Height: window.screen.height - 100,
            parm:null,
            numK:0,
            Lists:[],
            total:0,
            valueErr:false,
            linkProviderList:[],
            setTimeing:true,
            alertMes:[],
            alertText:''
        }
        this.handleOk = this.handleOk.bind(this)
        this.handleChangeChargetype = this.handleChangeChargetype.bind(this)
        this.onChangeCharget = this.onChangeCharget.bind(this)
        this.handldValidtypeid = this.handldValidtypeid.bind(this)
        this.disabledRangeTime = this.disabledRangeTime.bind(this)
        this.range = this.range.bind(this)
        this.onLogSee = this.onLogSee.bind(this)
        this.addItemForm = this.addItemForm.bind(this)
        this.onChage = this.onChage.bind(this)
    }

    componentDidMount () {
        this.getProviderList()
        this.getDetail()
        this.getLinkProviderList()
        this.getDetailServiceList()
        this.props.form.getFieldDecorator('serviceList', {initialValue:[]})
        this.props.form.getFieldDecorator('templatetypeid', {initialValue:[]})
    }

    //收费模式
    handleChangeChargetype (value){
        this.props.form.setFieldsValue({
            serviceList: [],
            templatetypeid : []
        })
        this.setState({
            Chargetype:value,
            changeShowType:this.state.changeShowType ? false : true,
            Lists:[],
            total:0
        })
    }
    //时间有效期
    handldValidtypeid = (value) =>{
        this.setState({
            Validtypeid:value
        })
    }

    //获取详情
    getDetail (){
        this.setState({
            getLoading:true
        })
        if(this.props.dataType !== 1){
            serviceIncrementManage.getIncrementDetail(this.props.id).then((data) => {
                this.props.dispatch({
                    type: 'GET_SERVICE_INCREMENT_DETAIL_SUCCESS',
                    payload:data
                })
                this.setState({
                    getLoading:false,
                    Chargetype:data.chargetypeid,
                    Lists:data.serviceList && data.serviceList.length > 0 ? data.serviceList : [],
                    total:data.serviceList.length
                })
                let arr = []
                if(data.serviceList.length > 0){
                    data.serviceList.map((item) => {
                        arr.push(item.templatetypeid)
                        return arr
                    })
                }
                this.props.form.setFieldsValue({
                    serviceList :data.serviceList,
                    templatetypeid : arr
                })
            })
        }
    }

    //获取险情服务项列表接口
    getDetailServiceList () {
        let params = {
            status: "1"
        }
        const par = this.props.dataType !== 3 ? params : null
        serviceIncrementManage.getServiceList(par).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_INCREMENT_SERVICE_LIST_SUCCESS',
                payload:data
            })
            const Arr = []
            const Brr = []
            data.list.map((item) => {
                Arr.push(item)
                if(item.templateTypeId === 0){
                    Brr.push(item)
                }
                return Arr
            })
            this.setState({
                serviceLoading:false,
                serviceListOne:Brr,
                serviceListTwo:Arr
            })

        })
    }

    //获取服务商列表接口
    getProviderList () {
        this.setState({
            provideLoading:true
        })
        serviceIncrementManage.getProviderList().then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS',
                payload:data
            })
            this.setState({
                providerList:data.list,
                provideLoading:false
            })
        })
    }

    //获取服务商列表接口
    getLinkProviderList () {
        this.setState({
            loading:true
        })
        serviceIncrementManage.linkProviderList().then((data) => {
            this.props.dispatch({
                type: 'LINK_SERVICE_INCREMENT_PROVIDER_LIST_SUCCESS',
                payload:data
            })
            this.setState({
                loading:false,
                linkProviderList:data
            })
        })
    }

    //关闭Modal
    handleCancel = () =>{
        this.setState({
            logVisible:false,
            rejectVisible:false
        })
        this.getDetail()
    }

    deleteItem = (data) =>{
        let lists = [...this.state.Lists]
        this.state.total--
        const getValue = this.props.form.getFieldsValue()
        getValue.cashprice.splice(data,1)
        getValue.cashcontainunit.splice(data,1)
        getValue.Chargetypeid.splice(data,1)
        getValue.containcount.splice(data,1)
        getValue.containunit.splice(data,1)
        getValue.providerid.splice(data,1)
        getValue.serviceid.splice(data,1)
        getValue.templatetypeid.splice(data,1)
        this.props.form.setFieldsValue({
            cashprice : getValue.cashprice,
            cashcontainunit : getValue.cashcontainunit,
            Chargetypeid : getValue.Chargetypeid,
            containcount : getValue.containcount,
            containunit : getValue.containunit,
            providerid : getValue.providerid,
            serviceid : getValue.serviceid,
            templatetypeid : getValue.templatetypeid
        })
        if(lists[data].id){
            this.props.dispatch({
                type: 'DEL_SERVICE_INCREMENT_ING'
            })
            serviceIncrementManage.delServiceItem(lists[data].id).then((data) => {
                this.props.dispatch({
                    type: 'DEL_SERVICE_INCREMENT_SUCCESS'
                })
                message.success('操作成功',0.5)
            })
        }
        lists.splice(data,1)
        this.setState({
            Lists: lists
        })
    }

    addItemForm (){
        this.state.Lists.push({
            id:null,
            serviceid:'',
            providerid:[],
            containcount:"1",
            containunit: "次",
            templatetypeid:0,
            overtopprice: 0,
            overtopcount:1,
            chargetypeid:1,
            cashprice: 1,
            cashcontainunit: "次",
            unitprice:0,
            commit:true
        })
        this.state.total++
        this.setState({
            Lists:this.state.Lists
        })
    }

    onChage = (value,index,record) =>{
        const getValue = this.props.form.getFieldsValue()
        let addLength = 0
        const alertMes = []
        alertMes[index] = false
        this.setState({
            alertMes
        })
        this.state.Lists.map((serItem) => {
            if(serItem.serviceid === value ){
                addLength ++
            }
            return true
        })
        if(addLength > 0){
            const alertMes = []
            alertMes[index] = true
            this.setState({
                alertMes
            })
            const lists = [...this.state.Lists]
            lists.map((item,i) =>{
                if(index === i){
                    record['providerid'] = []
                    record['serviceid'] = []
                    getValue.providerid[index] = []
                    getValue.serviceid[index] = ""
                }
                return item
            })
            this.props.form.setFieldsValue({
                providerid : getValue.providerid,
                serviceid : getValue.serviceid
            })
        }else {
            const lists = [...this.state.Lists]
            const serviceLists = this.state.serviceLoading === false && this.state.Chargetype === 1 || this.state.Lists.length > 1 ? this.state.serviceListOne : this.state.serviceListTwo
            lists.map((item,i) =>{
                if(index === i){
                    this.state.linkProviderList.map((lItem)=>{
                        if(value === lItem.id){
                            if(lItem.prividers.length === 0){
                                message.warning("该服务项没有关联的服务商，请重新选择！！！");
                                item['providerid'] = []
                                item['serviceid'] = []
                                getValue.providerid[index] = []
                                getValue.templatetypeid[index] = lItem.templatetypeid
                                getValue.serviceid[index] = ""
                                return lItem
                            }else{
                                item['providerid'] = lItem.prividers
                                item['templatetypeid'] = lItem.templatetypeid
                                item['serviceid'] = value
                                getValue.providerid[index] = lItem.prividers
                                getValue.templatetypeid[index] = lItem.templatetypeid
                                getValue.serviceid[index] = lItem.serviceid
                                if(lItem.templatetypeid === 1 || lItem.templatetypeid === "1"){
                                    serviceLists.map((pItem) => {
                                        if(value === pItem.id){
                                            this.setState({
                                                alertText:pItem.servicename
                                            })
                                        }
                                        return pItem
                                    })
                                }
                            }
                        }
                        return lItem
                    })
                }
                return item
            })
            this.setState({
                Lists: lists
            })
            this.props.form.setFieldsValue({
                providerid : getValue.providerid,
                serviceid : getValue.serviceid,
                templatetypeid : getValue.templatetypeid
            })
        }

    }

    handleContaincount = (index,value,item) =>{
        const lists = [...this.state.Lists]
        lists.map((item,i) =>{
            if(index === i){
                item['containcount'] = value
            }
            return item
        })
    }

    onChangeCharget = (index,value,item) =>{
        const lists = [...this.state.Lists]
        lists.map((item,i) =>{
            if(index === i){
                item['chargetypeid'] = value
            }
            return item
        })
    }

    addVal (data,value){
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.setState({
                    valueErr:true
                })
                return
            }else if(value === 2 && values.serviceList.length < 1 ){
                this.setState({
                    alert:true
                })
                return
            }
            const serviceList = this.state.Lists
            serviceList.map((item,index) => {
                item.cashprice = values.cashprice[index]
                item.cashcontainunit = values.Chargetypeid[index] === 3 ? values.cashcontainunit[index] : "次"
                item.chargetypeid = values.Chargetypeid[index]
                item.containcount = values.containcount[index]
                item.containunit = values.containunit[index]
                item.templatetypeid = values.templatetypeid[index]
                item.serviceid = values.serviceid[index] || ""
                item.providerid = values.providerid[index] || ""
                if(item.id){
                    item.createTime = this.props.serviceIncrementDetailM.createTime
                    item.timeVersion = this.props.serviceIncrementDetailM.timeVersion
                    item.creator = this.props.serviceIncrementDetailM.creator
                }
                if(this.props.dataType === 4){
                    item.activityid = ""
                    item.id = ""
                }
                return true
            })
            this.setState({
                Lists:serviceList
            })
            if(data === "add"){
                this.setState({
                    alert:false
                })
                if(this.state.Lists.length > 0){
                    let addLength = 0
                    this.state.Lists.map((item) => {
                        if(item.templatetypeid === 1 || item.templatetypeid === "1"){
                            addLength ++
                        }
                        return item
                    })
                    if( addLength === 0) {
                        this.addItemForm()
                    }
                }else{
                    this.addItemForm()
                }
                this.setState({
                    valueErr:false
                })
            }

            if(data === "save"){
                const rangeTimeValue = values['startAndEndTime']
                const validstarttime = values.validtypeid !== 0 ? new Date(rangeTimeValue[0]) / 1 : new Date().getTime()
                const validendtime = values.validtypeid !== 0 ? new Date(rangeTimeValue[1]) / 1 : new Date().getTime()
                const customsNew = this.props.dataType === 2 ? this.props.serviceIncrementDetailM.customs : []
                if(this.props.dataType === 1 || this.props.dataType === 4){
                    customsNew.push({
                        customservicename :values.customservicename,
                        phone : values.phone,
                        status : value
                    })
                }else{
                    customsNew[0].customservicename = values.customservicename
                    customsNew[0].phone = values.phone
                    customsNew[0].updator = Global.userInfo.nickName
                    customsNew[0].timeVersion = new Date().getTime()
                }
                const params = {
                    status:value,
                    serviceList:this.state.Lists,
                    activityname:values.activityname,
                    remark:values.remark,
                    customservicename:values.customservicename,
                    phone:values.phone,
                    validtypeid:values.validtypeid,
                    chargetypeid:values.chargetypeid,
                    packageprice:values.chargetypeid === 2 ? 0 : values.packageprice,
                    serviceremark:values.serviceremark,
                    validendtime: validendtime,
                    validstarttime:validstarttime,
                    creator:Global.userInfo.nickName,
                    servicemaxcount:serviceList.length || 0,
                    servicetotalcount:serviceList.length || 0,
                    roomnight:values.roomnight || 0,
                    bookingtotalprice:values.bookingtotalprice || 0,
                    customs:customsNew,
                    oldBusinessActivityService:serviceList,
                    timeVersion:new Date().getTime()
                }
                if(this.props.dataType === 1 || this.props.dataType === 4){
                    this.formAdd(params)
                }else if(this.props.dataType === 2){
                    this.formUpdate(params)
                }
            }
        })
    }

    //提交数据
    handleOk = () => {
        if(this.state.saveLoading === false){
            this.addVal("save",1)
        }

    }
    submint = () =>{
        this.addVal("add",1)
    }
    //提交审核
    handleLook = (e) =>{
        e.preventDefault()
        if(this.state.enterLoading === false){
            this.addVal("save",2)
        }
    }
    // 新增数据
    formAdd (obj){
        this.setState({
            saveLoading:true
        })
        this.props.dispatch({
            type: 'ADD_SERVICE_INCREMENT_MANAGE_ING'
        })
        serviceIncrementManage.addServiceList(obj).then((data) => {
            this.props.dispatch({
                type: 'ADD_SERVICE_INCREMENT_MANAGE_SUCCESS'
            })
            message.success('新增成功',0.5)
            this.props.onCancel()
            this.setState({
                saveLoading:false
            })
        }).catch((data) => {
            message.success('新增失败',0.5)
            this.setState({
                saveLoading:false
            })
        })
    }

    // 更新原本数据
    formUpdate (obj){
        const parpm = obj
        // parpm.version = this.props.serviceIncrementDetailM.version + 1
        parpm.version = this.props.serviceIncrementDetailM.version
        parpm.activitycode = this.props.serviceIncrementDetailM.activitycode
        parpm.id = this.props.serviceIncrementDetailM.id
        parpm.createTime = new Date().getTime()
        parpm.updator = Global.userInfo.nickName
        this.setState({
            enterLoading:true,
            saveLoading:true
        })
        this.props.dispatch({
            type: 'UPDATE_SERVICE_INCREMENT_MANAGE_ING'
        })
        serviceIncrementManage.updateServiceList(parpm).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_SERVICE_INCREMENT_MANAGE_SUCCESS'
            })
            message.success('操作成功',0.5)
            this.setState({
                enterLoading:false,
                saveLoading:true
            })
            this.props.onCancel()
        }).catch((data) => {
            message.success('操作失败',0.5)
            this.setState({
                enterLoading:false,
                saveLoading:true
            })
            this.props.onCancel()
        })
    }

    // 审核通过
    acorssExam = () =>{
        const params = {
            activitystatus : 4,
            activitycode:this.props.serviceIncrementDetailM.activitycode,
            activityid:this.props.serviceIncrementDetailM.id,
            remark:"",
            creator:Global.userInfo.nickName,
            status:4,
            oldBusinessActivity:{
                id:this.props.serviceIncrementDetailM.id,
                status:4,
                timeVersion : new Date().getTime(),
                version : this.props.serviceIncrementDetailM.version,
                creator:Global.userInfo.nickName
            }
        }
        this.props.dispatch({
            type: 'STATUS_SERVICE_INCREMENT_MANAGE_ING'
        })
        serviceIncrementManage.statusServiceItem(params).then((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_INCREMENT_MANAGE_SUCCESS',
                payload:data
            })
            message.success('操作成功',0.5)
            this.props.onCancel()
        }).catch((data) => {
            message.success('操作失败',0.5)
            this.props.onCancel()
        })
    }

    //查看审核
    onLogSee = () => {
        this.setState({
            logVisible:true
        })
    }

    // 驳回
    returnExam = () =>{
        this.setState({rejectVisible: true})
    }

    //时间禁止
    range (start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    disabledDate (current) {

        let date = new Date(new Date().getFullYear() + "-" + ( new Date().getMonth() + 1 ) + "-" + new Date().getDate() + " 00:00:00" ) / 1 - 1
        return current < date || current > 4102415999000
    }
    disabledRangeTime (_, type) {
        if (type === "start") {
            return {
                disabledHours: () => this.range(0, 60).splice(24, 20)
            }
        }
        return {
            disabledHours: () => this.range(0, 60).splice(24, 4)
        }
    }

    render () {
        const _this = this
        const {visible, onCancel, form ,dataType,serviceIncrementDetailM} = this.props
        const {disable,serviceLoading,getLoading,Chargetype,Validtypeid,total,serviceListOne,serviceListTwo,providerList,provideLoading,loading} = this.state
        const { getFieldDecorator } = form
        const _getLoading = dataType === 1 ? false : getLoading
        const _formData = dataType !== 1 && _getLoading === false ? serviceIncrementDetailM : ""
        const _disable = dataType === 3 ? disable : false
        const _Validtypeid = Validtypeid !== "" ? Validtypeid : _formData.validtypeid || 0 //有限期
        const _validstarttime = [moment(_formData.validstarttime).format('YYYY-MM-DD HH:mm'), moment(_formData.validendtime).format('YYYY-MM-DD HH:mm')]
        const _Customs = dataType !== 1 && _getLoading === false ? _formData.customs[0].customservicename : ""
        const _Phone = dataType !== 1 && _getLoading === false ? _formData.customs[0].phone : ""
        const serviceLists = serviceLoading === false && Chargetype === 1 || this.state.Lists.length > 1 ? serviceListOne : serviceListTwo
        const _disabled = dataType === 3 ? true : false
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span:5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:19 }
            }
        }

        const ContainCountList = []
        for(let i = 0; i <= 50;i++){
            ContainCountList.push( {
                value: i ,
                label: i === 0 ? '不限' : i
            })
        }
        const _data = {
            listOne:[{
                label:'增值服务编号',
                codetag:'activitycode',
                placeholder:'请输入增值服务编号',
                value:dataType === 1 || dataType === 4 ? "" : _formData.activitycode,
                message:'增值服务编号不能为空',
                disabled:true,
                relus:false,
                max:2000
            },{
                label:'增值服务名称',
                codetag:'activityname',
                placeholder:'请输入增值服务名称',
                value:_formData.activityname,
                message:'增值服务名称不能为空',
                disabled:_disable ,
                relus:true,
                max:100
            },{
                label:'服务备注',
                codetag:'remark',
                placeholder:'请输入增值服务名称',
                value:_formData.remark,
                message:'增值服务名称不能为空',
                disabled:_disable,
                relus:true,
                max:2000
            }],//客服姓名
            listStrategy:[{
                label:'预订房晚',
                codetag:'roomnight',
                placeholder:'请输入预订房晚',
                value:_formData.roomnight || 1,
                message:'预订房晚不能为空',
                disabled:_disable,
                relus:false
            },{
                label:'预订房晚费',
                codetag:'bookingtotalprice',
                placeholder:'请输入预订房晚费',
                value:_formData.bookingtotalprice || 1,
                message:'预订房晚费不能为空',
                disabled:_disable,
                relus:false
            }]
        }


        const formItems = this.state.Lists.map((item,index) => {
            return (
                <div className="ant-template" key={index}>
                    <FormItem
                        {...formItemLayout}
                        label="服务项"
                    >
                        {getFieldDecorator(`serviceid[${index}]`, {
                            initialValue:item.serviceid,
                            rules: [{ required:true, message:'服务项不能为空' }]},
                        )(
                            <Select
                                disabled={_disabled}
                                validateStatus="error"
                                placeholder="请选择服务项"
                                onChange={function (value) {_this.onChage(value,index,item)}}
                            >
                                {
                                    serviceLists.length > 0 ? serviceLists.map(function (num,index) {
                                        return <Option key={num.id} value={num.id}>{num.servicename}</Option>
                                    }) : null
                                }
                            </Select>
                        )}
                    </FormItem>
                    {
                        item.templatetypeid === 1 || item.templatetypeid === "1" ?
                            <Row>
                                <Col xs={5} className="text-center"></Col>
                                <Col xs={19} className="text-center padder-vb-md">
                                    <Alert message={"当选择了该" + this.state.alertText + "项后该增值服务不允许再添加额外的服务项。"} type="error" />
                                </Col>
                            </Row> : null
                    }
                    {
                        this.state.alertMes[index] ?
                            <Row>
                                <Col xs={5} className="text-center"></Col>
                                <Col xs={19} className="text-center padder-vb-md">
                                    <Alert message="每个服务项是唯一的，该增值服务已含有该服务项，请重新选择！！！" type="error" />
                                </Col>
                            </Row> : null
                    }
                    <FormItem label="服务商" {...formItemLayout} >
                        {getFieldDecorator(`providerid[${index}]`,
                            {
                                initialValue:item.providerid,
                                rules: [{type: 'array',required:true, message:'服务商不能为空' }]
                            },
                        )(
                            <Select
                                disabled
                                mode="multiple"
                                placeholder="请选择服务商"
                            >
                                {
                                    providerList.length > 0 ? providerList.map(function (num,index) {
                                        return <Option key={num.id} value={num.id} > {num.providername} </Option>
                                    }) : null
                                }
                            </Select>
                        )}
                    </FormItem>

                    <div style={{height:50,display:Chargetype === 2 ? "block" : "none"}}>
                        <Row type="flex" justify="space-between" align="top">
                            <Col xs={5} className="text-right">
                                <label htmlFor="chargetypeid" className="ant-form-item-required" title="收费模式">收费的模式：</label>
                            </Col>
                            <Col xs={19}>
                                <Row type="flex" justify="space-between" align="top">
                                    <Col xs={12}>
                                        <FormItem style={{marginBottom:0}}>
                                            {getFieldDecorator(`Chargetypeid[${index}]`,
                                                {
                                                    initialValue:item.chargetypeid,
                                                    rules: [{ required:true, message:'收费模式不能为空' }]
                                                },
                                            )(
                                                <Select
                                                    disabled={_disabled}
                                                    placeholder="请选择收费模式"
                                                    onChange={function (value) {_this.onChangeCharget(index, value,item)}}
                                                >
                                                    {
                                                        ChargeTypeList.map(function (num,index) {
                                                            return <Option key={num.value} value={num.value} >{num.label}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={6}>
                                        <FormItem>
                                            {getFieldDecorator(`cashprice[${index}]`,
                                                {
                                                    initialValue:item.cashprice,
                                                    rules: [{ required:true, message:'价格不能为空' }]
                                                },
                                            )(
                                                <InputNumber
                                                    disabled={_disabled}
                                                    placeholder="请输入价格"
                                                    min={1}
                                                    max={100000}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={5}>
                                        <FormItem style={{height:50,marginBottom:0,display:item.chargetypeid === 3 ? "block" : "none"}}>
                                            {getFieldDecorator(`cashcontainunit[${index}]`, {initialValue:item.cashcontainunit, rules: [{ required:false, message:'cashcontainunit' }]},
                                            )(
                                                <Select placeholder="请选择单位">
                                                    {
                                                        ContainUnit.map(function (num,index) {
                                                            return <Option key={num.value} value={num.value} >{num.label}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Row type="flex" className="mb" justify="space-between" align="top" style={{height:50,display:Chargetype === 2 ? "none" : "block"}} >
                        <Col xs={5} className="text-right">
                            <label htmlFor="containcount" className="ant-form-item-required" title="包含数量">包含数量：</label>
                        </Col>
                        <Col xs={19}>
                            <Row type="flex" justify="space-between" align="top">
                                <Col xs={12}>
                                    <FormItem style={{marginBottom:0}}>
                                        {getFieldDecorator(`containcount[${index}]`, {initialValue:item.containcount === "0" ? item.containcount - 0 : item.containcount ,rules: [{ required:true, message:'包含数量不能为空' }]},
                                        )(
                                            <Select
                                                disabled={_disabled}
                                                placeholder="请选择包含数量"
                                                onChange={function (value) {_this.handleContaincount(index,value,item)}}
                                            >
                                                {
                                                    ContainCountList.map(function (num,index) {
                                                        return <Option key={num.value} value={num.value} >{num.label}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xs={6}>
                                    <FormItem style={{marginBottom:0,display:item.containcount === 0 || item.containcount === "0" ? "none" : "block"}}>
                                        {getFieldDecorator(`containunit[${index}]`, {initialValue:item.containunit, rules: [{ required:true, message:'单位不能为空' }]},
                                        )(
                                            <Select
                                                disabled={_disabled}
                                                placeholder="请选择单位"
                                            >
                                                {
                                                    ContainUnit.map(function (item,index) {
                                                        return <Option key={index} value={item.value} >{item.label}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xs={5} />
                            </Row>
                        </Col>
                    </Row>

                    {
                        dataType !== 3 ?
                            <Row>
                                <Col xs={24} className="text-center">
                                    <Button
                                        type="dashed"
                                        onClick={function () {_this.deleteItem(index)}}
                                        className="ant-btn-dashed-danger"
                                        style={{ width:"220px"}}
                                    >
                                        <Icon type="minus-circle-o" /> 删除服务项
                                    </Button>
                                </Col>
                            </Row> : null
                    }

                </div>
            )
        })

        return (
            <Modal
                visible={visible}
                title={dataType === 3 ? "增值服务详情" : dataType === 2 ? "编辑增值服务" : "新增增值服务"}
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                width="840px"
                wrapClassName="scroll-center-modal"
                style={{top:0}}
                footer={[
                    <Row key="Row" type="flex" justify="space-between" align="middle">
                        <Col xs={14} key="col1" className="text-left">
                            {
                                dataType !== 3 ? "" :
                                    <Button
                                        key="seeLog"
                                        type="primary"
                                        name="seeLog"
                                        className="mr-sm"
                                        onClick={this.onLogSee}
                                    >审核记录</Button>
                            }
                            {
                                _formData.status === 2 && dataType === 3 ?
                                    <span key="buttonGroup1">
                                        <Button
                                            key="returnExam"
                                            type="primary"
                                            name="returnExam"
                                            className="mr-sm"
                                            onClick={this.returnExam}
                                        >驳回审批</Button>
                                        <Button
                                            key="acorssExam"
                                            type="primary"
                                            name="acorssExam"
                                            className="mr-sm"
                                            onClick={this.acorssExam}
                                        >审批通过</Button>
                                    </span> : null
                            }
                        </Col>
                        <Col xs={10} key="col2" className="text-right">
                            {
                                dataType === 3 ? "" :
                                    <span key="buttonGroup">
                                        <Button
                                            key="save"
                                            type="primary"
                                            name="save"
                                            className="mr-md"
                                            loading={this.state.saveLoading}
                                            onClick={this.handleOk}
                                        >保存</Button>
                                        <Button
                                            key="submit"
                                            type="primary"
                                            name="submit"
                                            className="mr-md"
                                            loading={this.state.enterLoading}
                                            onClick={this.handleLook}
                                        >提交审核</Button>
                                    </span>
                            }
                            <span key="cancel" className="click-link" onClick={onCancel}>
                                取消
                            </span>
                        </Col>
                    </Row>
                ]}
            >

                {
                    serviceLoading === false
                    && provideLoading === false
                    && loading === false
                    && _getLoading === false ?
                        <div>
                            <Form onSubmit={this.submint} style={{paddingBottom:"70px"}}>
                                <div>
                                    {_data.listOne.length > 0 ? _data.listOne.map(function (item,index) {
                                        return (
                                            <Row key={index}>
                                                <Col xs={24}>
                                                    <FormItem label={item.label} {...formItemLayout}>
                                                        {getFieldDecorator(item.codetag,
                                                            {initialValue:item.value, rules: [{ required:item.relus, message:item.message }]},
                                                        )(
                                                            item.codetag === "activitycode" ? <div className={item.value ? 'ant-input ant-input-disabled' : ''}>
                                                                {item.value}
                                                            </div> : <Input maxLength={item.max} type="text" disabled={item.disabled} placeholder={item.placeholder} />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        )}) : null
                                    }
                                    <Row type="flex" className="mb" justify="space-between" align="top">
                                        <Col xs={5} className="text-right" style={{padding:"8px 0"}}>
                                            <label htmlFor="customservicename" className="ant-form-item-required" title="签约价(￥)">服务客服：</label>
                                        </Col>
                                        <Col xs={19}>
                                            <Row type="flex" justify="space-between" align="top">
                                                <Col xs={10}>
                                                    <FormItem style={{marginBottom:0}} >
                                                        {getFieldDecorator("customservicename",
                                                            {
                                                                initialValue:_Customs,
                                                                rules: [{ required:true, message:"客服姓名不能为空" }]
                                                            },
                                                        )(
                                                            <Input type="text" maxLength={15} disabled={_disable} placeholder="请输入客服姓名" />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col xs={13}>
                                                    <FormItem style={{marginBottom:0}}>
                                                        {getFieldDecorator("phone", {initialValue:_Phone,
                                                            rules: [
                                                                { required:true, message:"手机号码不能为空" },
                                                                {
                                                                    pattern:reg.tel,message: '请输入正确手机号码!'
                                                                }
                                                            ]},
                                                        )(
                                                            <Input
                                                                type="text"
                                                                maxLength={11}
                                                                disabled={_disable}
                                                                placeholder="请输入手机号码"
                                                            />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    {/*服务策略*/}
                                    <div className="template">
                                        <Divider />
                                        <h3 style={{fontSize:20,fontWeight:600}} className="padder-vb-lg">服务策略</h3>
                                        <Row type="flex" className="mb" justify="space-between" align="top">
                                            <Col xs={5} className="text-right" style={{padding:"8px 0"}}>
                                                <label htmlFor="validtypeid" style={{padding:"8px 0"}} className="ant-form-item-required" title="服务有效期">服务有效期：</label>
                                            </Col>
                                            <Col xs={19}>
                                                <Row type="flex" justify="space-between" align="top">
                                                    <Col xs={10}>
                                                        <FormItem style={{marginBottom:0}}>
                                                            {getFieldDecorator("validtypeid",
                                                                {initialValue:_Validtypeid,
                                                                    rules: [{ required:true, message:"请选择有效期" }]
                                                                },
                                                            )(
                                                                <Select
                                                                    disabled={_disable}
                                                                    placeholder="请选择服务有效期"
                                                                    onChange={this.handldValidtypeid}
                                                                >
                                                                    {
                                                                        validTypeIdList.map(function (item,index) {
                                                                            return <Option key={item.value} value={item.value} >{item.label}</Option>
                                                                        })
                                                                    }
                                                                </Select>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col xs={13}>
                                                        {
                                                            _Validtypeid !== 0 ?
                                                                <FormItem style={{marginBottom:0}}>
                                                                    {getFieldDecorator('startAndEndTime', {
                                                                        initialValue:[moment(_validstarttime[0], "YYYY-MM-DD HH:mm:ss"), moment(_validstarttime[1], "YYYY-MM-DD HH:mm:ss")],
                                                                        rules: [{ type: 'array', required: true, message: '请选择时间' }]
                                                                    })(

                                                                        <RangePicker
                                                                            disabled={_disable}
                                                                            disabledDate={this.disabledDate}
                                                                            disabledTime={this.disabledRangeTime}
                                                                            showTime={{
                                                                                hideDisabledOptions: false,
                                                                                defaultValue: [
                                                                                    moment("00:00:00", "HH:mm:ss"),
                                                                                    moment("23:59:59", "HH:mm:ss")
                                                                                ]
                                                                            }}
                                                                            format="YYYY-MM-DD HH:mm:ss"
                                                                        />
                                                                    )}

                                                                </FormItem> : null

                                                        }
                                                    </Col>

                                                </Row>
                                            </Col>
                                        </Row>
                                        {_data.listStrategy.length > 0 ? _data.listStrategy.map(function (item,index) {
                                            return (
                                                <Row key={index}>
                                                    <Col>
                                                        <FormItem label={item.label} {...formItemLayout}>
                                                            {getFieldDecorator(item.codetag,
                                                                {initialValue:item.value, rules: [{ required:item.rules, message:item.message }]},
                                                            )(
                                                                <InputNumber
                                                                    disabled={item.disabled}
                                                                    min={1}
                                                                    max={10000}
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            )}) : null
                                        }
                                    </div>

                                    {/*服务内容*/}
                                    <div className="template">
                                        <Divider />
                                        <h3 style={{fontSize:20,fontWeight:600}} className="padder-vb-lg">服务内容</h3>
                                        <FormItem label="服务收费模式" {...formItemLayout}>
                                            {getFieldDecorator("chargetypeid", {initialValue:Chargetype, rules: [{ required:true, message:"服务收费模式不能为空" }]},
                                            )(
                                                <Select
                                                    disabled={_disable}
                                                    placeholder="请选择服务收费模式"
                                                    onChange={this.handleChangeChargetype}
                                                >
                                                    {
                                                        chargeTypeList.map(function (item,index) {
                                                            return <Option key={item.value} value={item.value} >{item.label}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                        {
                                            Chargetype !== 2 ?
                                                <FormItem label="套餐价格（￥）" {...formItemLayout}>
                                                    {getFieldDecorator("packageprice", {
                                                        initialValue:_formData.packageprice,
                                                        rules: [
                                                            { required:true, message:"套餐价格不能为空" },
                                                            {
                                                                pattern:reg.intDot,message: '小数点不能超过两位'
                                                            }
                                                        ]
                                                    }
                                                    )(
                                                        <InputNumber
                                                            min={0}
                                                            max={99999999}
                                                            disabled={_disable}
                                                            placeholder="请输入套餐价格"
                                                        />
                                                    )}
                                                </FormItem> : null
                                        }

                                        <FormItem label="服务说明" {...formItemLayout}>
                                            {getFieldDecorator("serviceremark", {
                                                initialValue:_formData.serviceremark,
                                                rules: [{ required:true, message:"服务说明不能为空" }]},
                                            )(
                                                <TextArea
                                                    maxLength={500}
                                                    disabled={_disable}
                                                    placeholder="请输入服务说明"
                                                    autosize={{ minRows: 2, maxRows: 6 }}
                                                />
                                            )}
                                        </FormItem>
                                    </div>

                                    {/*服务多项*/}
                                    <Divider />
                                    <p className="text-center padder-vb-lg">一共{total}个服务</p>
                                    {
                                        this.state.alert ?
                                            <div className="text-center mb" style={{color:"red"}}>
                                                <Alert message="至少添加一个服务项" type="error" />
                                            </div> : null
                                    }

                                </div>
                                {formItems}
                                {
                                    dataType !== 3 ?
                                        <Row>
                                            <Col xs={24} className="text-center">
                                                <Button
                                                    type="dashed"
                                                    // onClick={this.addItem}
                                                    onClick={this.submint}
                                                    className="ant-btn-dashed-primary"
                                                    style={{ width:"220px"}}
                                                >
                                                    <Icon type="plus-circle-o" /> 增加服务项
                                                </Button>
                                            </Col>
                                        </Row> : null
                                }
                            </Form>
                            {/*查看审核记录*/}
                            {
                                this.state.logVisible ?
                                    <AuditingLogTable
                                        visible={this.state.logVisible}
                                        id={_formData.id}
                                        activitycode={_formData.activitycode}
                                        activityname={_formData.activityname}
                                        onCancel={this.handleCancel}
                                    /> : null
                            }

                            {/*驳回原因*/}
                            {
                                this.state.rejectVisible ?
                                    <AuditingReject
                                        visible={this.state.rejectVisible}
                                        id={_formData.id}
                                        activitycode={_formData.activitycode}
                                        activityname={_formData.activityname}
                                        onCancel={this.handleCancel}
                                        version={_formData.version}
                                    /> : null
                            }
                        </div> : <div className="padder-v-lg text-center">
                            <Spin size="large" style={{margin:"0 auto"}} />
                        </div>
                }
            </Modal>
        )
    }
}

let IncrementDetail = Form.create()(IncrementDetailForm)
export default connect(mapStateToProps)(IncrementDetail)