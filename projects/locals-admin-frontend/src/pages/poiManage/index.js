import React, { Component } from 'react'
import { message, Select, Form, Modal, Input, Radio, Button, InputNumber,Icon } from 'antd'
import { poiManagement } from '../../services'
import './index.less'
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

class PoiLabel extends Component {
    constructor (props) {
        super(props)
        this.state = {
            visible:false,
            saveVisible:false,
            editType:'add',
            oneList:'',
            twoList:'',
            threeList:'',
            threeid:'',
            fourList:'',
            fourid:'',
            oneActive:0,
            twoActive:0,
            threeActive:0,
            fourActive:0,
            id:'',
            parentid:'',
            name:'',
            poilevel:'',
            longitude:'',
            latitude:'',
            status:'',
            sortnumber:'',
            distance:'',
            hot:'',
            circleArr:[],
            circleAll:[],
            statusAll:[],
            onePageNum:2,
            oneHasNextPage:false,
            towPageNum:2,
            threePageNum:2,
            threeHasNextPage:false,
            fourPageNum:2,
            fourHasNextPage:false,
            cityId:'',
            poiCode:''
        }
        this.oneListNode = null
        this.threeListNode = null
        this.fourListNode = null
    }
    componentDidMount () {
        this.init(this.state.cityId)
        if (this.oneListNode) {
            this.oneListNode.addEventListener('scroll', this.oneScrollHandle.bind(this));
        }
        if (this.threeListNode) {
            this.threeListNode.addEventListener('scroll', this.threeScrollHandle.bind(this));
        }
        if (this.fourListNode) {
            this.fourListNode.addEventListener('scroll', this.fourScrollHandle.bind(this));
        }
    }
    oneScrollHandle = (event) =>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if(isBottom){
            if(this.state.oneHasNextPage){
                this.getSceollInit()
            }
        }
    }
    threeScrollHandle = (event) =>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if(isBottom){
            if(this.state.threeHasNextPage){
                this.getSceollThr()
            }
        }
    }
    fourScrollHandle = (event) =>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if(isBottom){
            if(this.state.fourHasNextPage){
                this.getSceollFor()
            }
        }
    }
    init = (parid) => {
        let params = {
            pageSize:50,
            pageNum:1,
            poiLevel:1
        }
        poiManagement.getLabelTabel(params).then((res) => {
            if(res.list.length > 0){
                if(res.hasNextPage){
                    this.setState({
                        oneHasNextPage:true,
                        oneList:res.list,
                        twoActive:0,
                        threeActive:0,
                        fourActive:0
                    })
                }else{
                    this.setState({
                        oneHasNextPage:false,
                        oneList:res.list,
                        twoActive:0,
                        threeActive:0,
                        fourActive:0
                    })
                }
                if(parseInt(res.list[0].hasNode,10) === 1){
                    if(parid){
                        this.secmenu(parid)
                    }else{
                        this.secmenu(res.list[0].id,'')
                    }
                }else{
                    this.setState({
                        oneList:[]
                    })
                }
            }
        })
    }
    getSceollInit = () =>{
        let params = {
            pageSize:50,
            pageNum:this.state.onePageNum,
            poiLevel:1
        }
        poiManagement.getLabelTabel(params).then((res)=>{
            if(res.list.length > 0){
                for(var i = 0 ; i < res.list.length ; i++){
                    this.state.oneList.push(res.list[i])
                }
                if(res.hasNextPage){
                    this.setState({
                        oneHasNextPage:true,
                        onePageNum:this.state.onePageNum + 1
                    })
                }else{
                    this.setState({
                        oneHasNextPage:false,
                        onePageNum:this.state.onePageNum
                    })
                }
            }
        })
    }
    secmenu = (id) => {
        let params = {
            pageSize:50,
            pageNum:1,
            parentId:id,
            poiLevel:2
        }
        poiManagement.getLabelTabel(params).then((res) => {
            this.setState({
                twoList:res.list
            })
            if(parseInt(res.list[0].hasNode,10) === 1){
                if(res.list[0].poiCode === 'SYSTEM_HOT_CODE'){
                    // 用 relationId
                    this.setState({
                        poiCode: res.list[0].poiCode
                    })
                    this.thrmenu(res.list[0].id,'relationId')
                }else{
                   // 用 parentId
                    this.setState({
                        poiCode: ''
                    })
                    this.thrmenu(res.list[0].id,'parentId')
                }
            }else{
                this.setState({
                    threeList:[],
                    fourList:[]
                })
            }
        })
    }
    thrmenu = (id,flag) => {
        let params
        if(flag === 'parentId'){
            params = {
                pageSize:50,
                pageNum:1,
                parentId:id,
                poiLevel:3
            }
        }else{
            params = {
                pageSize:50,
                pageNum:1,
                relationId:id,
                poiLevel:3
            }
        }
        poiManagement.getLabelTabel(params).then((res) => {
            if(res.list.length > 0){
                if(res.hasNextPage){
                    this.setState({
                        threeHasNextPage:true,
                        threeList:res.list,
                        fourid:res.list[0].id,
                        fourActive:0,
                        parentid:res.list[0].id
                    })
                }else{
                    this.setState({
                        threeHasNextPage:false,
                        threeList:res.list,
                        fourid:res.list[0].id,
                        fourActive:0,
                        parentid:res.list[0].id
                    })
                }
                if(parseInt(res.list[0].hasNode,10) === 1){
                    this.formenu(res.list[0].id,'')
                }else{
                    this.setState({
                        fourList:[]
                    })
                }
            }else{
                this.setState({
                    threeList:[],
                    fourList:[]
                })
            }
        })
    }
    getSceollThr = () =>{
        let params
        if(this.state.poiCode === 'SYSTEM_HOT_CODE'){
            params = {
                pageSize:50,
                pageNum:this.state.threePageNum,
                relationId:this.state.threeid,
                poiLevel:3
            }
        }else{
            params = {
                pageSize:50,
                pageNum:this.state.threePageNum,
                parentId:this.state.threeid,
                poiLevel:3
            }
        }
        poiManagement.getLabelTabel(params).then((res)=>{
            if(res.list.length > 0){
                for(var i = 0 ; i < res.list.length ; i++){
                    this.state.threeList.push(res.list[i])
                }
                if(res.hasNextPage){
                    this.setState({
                        threeHasNextPage:true,
                        threePageNum:this.state.threePageNum + 1
                    })
                }else{
                    this.setState({
                        threeHasNextPage:false,
                        threePageNum:this.state.threePageNum
                    })
                }
            }
        })
    }
    formenu = (id) => {
        let params = {
            pageSize:50,
            pageNum:1,
            parentId:id,
            poiLevel:4
        }
        poiManagement.getLabelTabel(params).then((res) => {
            if(res.list.length > 0){
                if(res.hasNextPage){
                    this.setState({
                        fourHasNextPage:true,
                        fourList:res.list
                    })
                }else{
                    this.setState({
                        fourHasNextPage:false,
                        fourList:res.list
                    })
                }
            }else{
                this.setState({
                    fourList:[]
                })
            }
        })
    }
    getSceollFor = () =>{
        let params = {
            pageSize:50,
            pageNum:this.state.fourPageNum,
            parentId:this.state.fourid,
            poiLevel:4
        }
        poiManagement.getLabelTabel(params).then((res)=>{
            if(res.list.length > 0){
                for(var i = 0 ; i < res.list.length ; i++){
                    this.state.fourList.push(res.list[i])
                }
                if(res.hasNextPage){
                    this.setState({
                        fourHasNextPage:true,
                        fourPageNum:this.state.fourPageNum + 1
                    })
                }else{
                    this.setState({
                        fourHasNextPage:false,
                        fourPageNum:this.state.fourPageNum
                    })
                }
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    statusChange = (value,id,parentid,sortnumber) =>{
        let self = this
        let params = {
            'id': id,
            'parentId': parentid,
            'sortNumber': sortnumber,
            'status':parseInt(value,10)
        }
        let statusAll = this.state.statusAll || []
        statusAll[id] = value
        let equal = []
        let noequal = []
        if (self.state.circleArr && self.state.circleArr.length > 0) {
            self.state.circleArr.forEach((item, index) => {
                if(item.id !== id){
                    noequal.push(item)
                }else{
                    item.status = parseInt(value,10)
                    equal.push(item)
                }
            })
        }
        if(equal.length > 0 ){
            self.setState({
                circleArr:[...equal,...noequal],
                statusAll
            })
        }else{
            self.setState({
                circleArr:[...noequal,params],
                statusAll
            })
        }
    }
    dotNow = (value,id,parentid,status) =>{
        let self = this
        let params = {
            'id': id,
            'parentId': parentid,
            'sortNumber': JSON.stringify(value),
            'status':status
        }
        let circleAll = this.state.circleAll || []
        circleAll[id] = value
        let equal = []
        let noequal = []
        if (self.state.circleArr && self.state.circleArr.length > 0) {
            self.state.circleArr.forEach((item, index) => {
                if(item.id !== id){
                    noequal.push(item)
                }else{
                    item.sortNumber = JSON.stringify(value)
                    equal.push(item)
                }
            })
        }
        if(equal.length > 0 ){
            self.setState({
                circleArr:[...equal,...noequal],
                circleAll
            })
        }else{
            self.setState({
                circleArr:[...noequal,params],
                circleAll
            })
        }
    }
    onModalOk = (values) => {
        let that = this
        that.props.form.validateFields((err, values) => {
            if (!err) {
                if (that.state.editType === 'edit') {
                    values['id'] = that.state.id
                    values['parentId'] = that.state.parentid
                    that.changepoi(values,false)
                    if(that.state.hot === values.hot){
                        //console.log("对的",that.state.hot,values.hot)
                    }else{
                        that.putHot(that.state.id)
                    }
                }else{
                    values['parentId'] = that.state.parentid
                    values['poiLevel'] = that.state.poilevel
                    that.postpoi(values,false)
                    if(values.hot === "true"){
                        that.putHot(that.state.id)
                    }
                }
            }
        })
    }
    putHot = (id) =>{
        poiManagement.postHot(id).then((res)=>{
            console.log(res)
        })
    }
    changepoi = (params,flag) =>{
        poiManagement.putPoi(params).then((res)=>{
            message.success('修改成功！')
            if(flag === true){
                this.setState({
                    oneActive:null,
                    visible:false,
                    circleArr:[],
                    circleAll:[],
                    statusAll:[]
                })
            }else{
                this.setState({
                    oneActive:null,
                    visible:false
                })
            }
            this.init(this.state.cityId)
        })
    }
    postpoi = (params) =>{
        poiManagement.postPoi(params).then((res)=>{
            message.success('添加成功！')
            this.setState({
                visible:false,
                id:'',
                parentid: '',
                name:'',
                longitude:'',
                latitude:'',
                status:'',
                sortnumber:'',
                distance:'',
                circleArr:[],
                circleAll:[],
                statusAll:[]
            })
            this.init(this.state.cityId)
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    oneChange = (event) =>{
        let id = event.target.getAttribute("data-id")
        let name = event.target.getAttribute("data-name")
        let index = event.target.getAttribute("data-index")
        if(this.state.circleArr && this.state.circleArr.length > 0){
            this.setState({
                saveVisible:true
            })
        }else{
            this.setState({
                cityId:id,
                oneActive:index,
                twoActive:0,
                threeActive:0,
                fourActive:0
            })
            this.secmenu(id)
        }
    }
    twoChange = (event) =>{
        let id = event.target.getAttribute("data-id")
        let index = event.target.getAttribute("data-index")
        let poicode = event.target.getAttribute("data-poicode")
        if(this.state.circleArr && this.state.circleArr.length > 0){
            this.setState({
                saveVisible:true
            })
        }else{
            this.setState({
                threeid:id,
                twoActive:index,
                threeActive:0,
                fourActive:0,
                poiCode: poicode
            })
            if(poicode === 'SYSTEM_HOT_CODE'){
                // 用 relationId
                this.thrmenu(id,'relationId')
            }else{
               // 用 parentId
               this.thrmenu(id,'parentId')
            }
        }
    }
    threeChange = (event) =>{
        let id = event.target.getAttribute("data-id")
        let parentid = event.target.getAttribute("data-parentid")
        let index = event.target.getAttribute("data-index")
        if(this.state.circleArr && this.state.circleArr.length > 0){
            this.setState({
                saveVisible:true
            })
        }else{
            this.setState({
                parentid:id,
                fourid:id,
                threeActive:index,
                fourActive:0
            })
            this.formenu(id)
        }
    }
    fourChange = (event) =>{
        let id = event.target.getAttribute("data-id")
        let parentid = event.target.getAttribute("data-parentid")
        let index = event.target.getAttribute("data-index")
        this.setState({
            fourActive:index
        })
    }
    editInfo = (event) =>{
        let id = event.currentTarget.getAttribute("data-id")
        let parentid = event.currentTarget.getAttribute("data-parentid")
        let name = event.currentTarget.getAttribute("data-name")
        let longitude = event.currentTarget.getAttribute("data-longitude")
        let latitude = event.currentTarget.getAttribute("data-latitude")
        let status = event.currentTarget.getAttribute("data-status")
        let sortnumber = event.currentTarget.getAttribute("data-sortnumber")
        let distance = event.currentTarget.getAttribute("data-distance")
        let hot = event.currentTarget.getAttribute("data-hot")
        if(this.state.circleArr && this.state.circleArr.length > 0){
            this.setState({
                saveVisible:true
            })
        }else{
            this.setState({
                editType:'edit',
                id:id,
                parentid: parentid,
                name:name,
                longitude:longitude,
                latitude:latitude,
                status:status,
                sortnumber:sortnumber,
                distance:distance,
                hot:hot,
                visible:true
            },console.log(this.state))
        }
    }
    addInfo = (event) => {
        if(this.state.circleArr && this.state.circleArr.length > 0){
            this.setState({
                saveVisible:true
            })
        }else{
            let parentid = event.currentTarget.getAttribute("data-parentid")
            let poilevel = event.currentTarget.getAttribute("data-poilevel")
            if(parentid){
                this.setState({
                    editType:'add',
                    id:'',
                    parentid: parentid,
                    name:'',
                    poilevel:poilevel,
                    longitude:'',
                    latitude:'',
                    status:'',
                    sortnumber:'',
                    distance:'',
                    hot:'',
                    visible:true
                })
            }else{
                this.setState({
                    editType:'add',
                    id:'',
                    name:'',
                    poilevel:poilevel,
                    longitude:'',
                    latitude:'',
                    status:'',
                    sortnumber:'',
                    distance:'',
                    hot:'',
                    visible:true
                })
            }
        }
    }
    saveChange = () =>{
        let self = this
        self.setState({
            saveVisible:false
        })
        if(self.state.circleArr && self.state.circleArr.length > 0){
            self.state.circleArr.forEach((item,index)=>{
                if((self.state.circleArr.length - 1) === index){
                    self.changepoi(item,true)
                }else{
                    self.changepoi(item,false)
                }
            })
        }else{
            message.success('无修改信息！')
        }
    }
    saveCancel = () =>{
        this.setState({
            saveVisible:false,
            circleArr:[],
            circleAll:[],
            statusAll:[]
        })
    }
    renderSavw = () =>{
        return (
            <Modal
                title="确认修改"
                visible={this.state.saveVisible}
                onOk={this.saveChange}
                onCancel={this.saveCancel}
                okText="保存"
            >
                <p>有已修改信息，是否保存</p>
            </Modal>
        )
    }
    rederModal = () => {
        let self = this
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
        return (
            <Modal
                visible={self.state.visible}
                title={self.state.editType === 'add' ? '新增' : '编辑'}
                onOk={self.onModalOk}
                onCancel={self.handleCancel}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: self.state.name,
                            rules: [{ required: true, message: '例:小南湖公园' }]
                        })(
                            <Input placeholder="请输入名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="排序"
                    >
                        {getFieldDecorator('sortNumber', {
                            initialValue: self.state.sortnumber,
                            rules: [{ required: true, message: '例:99，数字越大越排前' }]
                        })(
                            <Input placeholder="请输入排序" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="经度"
                    >
                        {getFieldDecorator('longitude', {
                            initialValue: self.state.longitude,
                            rules: [{ required: true, message: '例:104.065735' }]
                        })(
                            <Input placeholder="请输入经度" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="纬度"
                    >
                        {getFieldDecorator('latitude', {
                            initialValue: self.state.latitude,
                            rules: [{ required: true, message: '例:30.659462' }]
                        })(
                            <Input placeholder="请输入纬度" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="距离"
                        extra="距离单位为公里，若无设置默认为1公里"
                    >
                        {getFieldDecorator('distance', {
                            initialValue: (self.state.distance ? self.state.distance : '1'),
                            rules: [{ required: true, message: '请输入距离，单位：公里' }]
                        })(
                            <Input placeholder="请输入距离，单位：公里" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('status', {
                            initialValue: self.state.status,
                            rules: [{ required: true, message: '请选择状态' }]
                        })(
                            <RadioGroup name="conform" onChange={self.onChange}>
                                <Radio value="1">可用</Radio>
                                <Radio value="0">禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {self.state.editType === 'edit' ?
                        <FormItem
                            {...formItemLayout}
                            label="同步热门"
                        >
                            {getFieldDecorator('hot', {
                                initialValue: self.state.hot,
                                rules: [{ required: true, message: '请选择是否热门' }]
                            })(
                                <RadioGroup name="conform" onChange={self.onChange}>
                                    <Radio value="true">是</Radio>
                                    <Radio value="false">否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        : null
                    }
                </Form>
            </Modal>
        )
    }
    render () {
        let self = this
        let { oneList, twoList, threeList, fourList, circleAll, statusAll } = this.state
        const editStatus = {
            1:'可用',
            0:'禁用'
        }
        return (
            <div className="poilabel">
                <Button type="primary" className="save-btn" onClick={self.saveChange}>保存</Button>
                <div className="table">
                    <div className="table-one"><span>一级</span><span className="text-right">排名/状态</span></div>
                    <div className="table-two"><span>二级</span><span className="text-right">排名/状态</span></div>
                    <div className="table-three"><span>三级</span><span className="text-right">排名/状态</span></div>
                    <div className="table-four"><span>四级</span><span className="text-right">排名/状态</span></div>
                </div>
                <div className="box-table card-container">
                    <div className="antd-bat-tabs-one">
                        <div className="card" ref={function (res){self.oneListNode = res}}>
                            {oneList.length > 0 ? oneList.map((item, index) => {
                                return <div key={index} className={(self.state.cityId === item.id || parseInt(self.state.oneActive,10) === parseInt(index,10)) ? 'active tabs' : 'tabs'}>
                                        <span className="text-cont" onClick={self.oneChange} data-name={item.name} data-index={index} data-id={item.id} data-parentid={item.parentId}>{item.name}</span>
                                        <span className="text-right">
                                            <InputNumber style={{width:'50px'}} size="small" className="sort" onChange={function (e){self.dotNow(e, item.id,item.parentId,item.status)}} value={(circleAll && circleAll[item.id]) || item.sortNumber || ''}/>
                                            <Select value={editStatus[(statusAll && statusAll[item.id]) || JSON.stringify(item.status) || '']} onChange={function (e){self.statusChange(e, item.id,item.parentId,item.sortNumber)}} size="small" className="select">
                                                <Option value="0">禁用</Option>
                                                <Option value="1">可用</Option>
                                            </Select>
                                        </span>
                                    </div>
                                })
                                : ''
                            }
                        </div>
                        {/* <div className="add-label" data-poilevel="1"  data-parentid={oneList.length > 0 ? oneList[0].parentId : ''} onClick={self.addInfo}> + 添加</div> */}
                    </div>
                    <div className="antd-bat-tabs-two">
                        <div className="card">
                             {twoList.length > 0 ? twoList.map((properties, index) => {
                                return <div key={index} className={parseInt(self.state.twoActive,10) === parseInt(index,10) ? 'active tabs' : 'tabs'}>
                                        <span className="text-cont" onClick={self.twoChange} data-poicode={properties.poiCode} data-index={index} data-id={properties.id} data-parentid={properties.parentId}>{properties.name}</span>
                                        <span className="text-right">
                                            <InputNumber style={{width:'50px'}} size="small" className="sort" onChange={function (e){self.dotNow(e, properties.id,properties.parentId,properties.status)}} value={(circleAll && circleAll[properties.id]) || properties.sortNumber || ''}/>
                                            <Select value={editStatus[(statusAll && statusAll[properties.id]) || JSON.stringify(properties.status) || '']} onChange={function (e){self.statusChange(e, properties.id,properties.parentId,properties.sortNumber)}} size="small" className="select">
                                                <Option value="0">禁用</Option>
                                                <Option value="1">可用</Option>
                                            </Select>
                                        </span>
                                    </div>
                                })
                                : ''
                            }
                        </div>
                        {/* <div className="add-label" data-poilevel="2"  data-parentid={twoList.length > 0 ? twoList[0].parentId : ''} onClick={self.addInfo}> + 添加</div> */}
                    </div>
                    <div className="antd-bat-tabs-three">
                        <div className="card" ref={function (res){self.threeListNode = res}}>
                            {threeList.length > 0 ? threeList.map((row, index) => {
                                return <div key={index} className={parseInt(self.state.threeActive,10) === parseInt(index,10) ? 'active tabs' : 'tabs'}>
                                        <span className="text-cont" onClick={self.threeChange} data-index={index} data-id={row.id} data-parentid={row.parentId}>{row.name}</span>
                                        <span className="text-icon" onClick={self.editInfo}
                                            data-id={row.id}
                                            data-parentid={row.parentId}
                                            data-name={row.name}
                                            data-longitude={row.longitude}
                                            data-latitude={row.latitude}
                                            data-status={row.status}
                                            data-sortnumber={row.sortNumber}
                                            data-distance={row.distance}
                                            data-hot={row.hot}
                                        >
                                            <Icon type="form" theme="outlined" />
                                        </span>
                                        <span className="text-right">
                                            <InputNumber style={{width:'50px'}} size="small" className="sort" onChange={function (e){self.dotNow(e, row.id,row.parentId,row.status)}} value={(circleAll && circleAll[row.id]) || row.sortNumber || ''}/>
                                            <Select value={editStatus[(statusAll && statusAll[row.id]) || JSON.stringify(row.status) || '']} onChange={function (e){self.statusChange(e, row.id,row.parentId,row.sortNumber)}} size="small" className="select">
                                                <Option value="0">禁用</Option>
                                                <Option value="1">可用</Option>
                                            </Select>
                                        </span>
                                    </div>
                                })
                                : ''
                            }
                        </div>
                        <div className="add-label" data-poilevel="3" data-parentid={threeList.length > 0 ? threeList[0].parentId : ''} onClick={self.addInfo}> + 添加</div>
                    </div>
                    <div className="antd-bat-tabs-four">
                        <div className="card" ref={function (res){self.fourListNode = res}}>
                            {fourList.length > 0 ? fourList.map((last, index) => {
                                return <div key={index} className={parseInt(self.state.fourActive,10) === parseInt(index,10) ? 'active tabs' : 'tabs'}>
                                        <span className="text-cont" onClick={self.fourChange} data-index={index} data-id={last.id} data-parentid={last.parentId}>{last.name}</span>
                                        <span className="text-icon" onClick={self.editInfo}
                                            data-id={last.id}
                                            data-parentid={last.parentId}
                                            data-name={last.name}
                                            data-longitude={last.longitude}
                                            data-latitude={last.latitude}
                                            data-status={last.status}
                                            data-sortnumber={last.sortNumber}
                                            data-distance={last.distance}
                                            data-hot={last.hot}
                                        >
                                            <Icon type="form" theme="outlined" />
                                        </span>
                                        <span className="text-right">
                                            <InputNumber style={{width:'50px'}} size="small" className="sort" onChange={function (e){self.dotNow(e, last.id,last.parentId,last.status)}} value={(circleAll && circleAll[last.id]) || last.sortNumber || ''}/>
                                            <Select value={editStatus[(statusAll && statusAll[last.id]) || JSON.stringify(last.status) || '']} onChange={function (e){self.statusChange(e, last.id,last.parentId,last.sortNumber)}} size="small" className="select">
                                                <Option value="0">禁用</Option>
                                                <Option value="1">可用</Option>
                                            </Select>
                                        </span>
                                    </div>
                                })
                                : ''
                            }
                        </div>
                        <div className="add-label" data-poilevel="4" data-parentid={fourList.length > 0 ? fourList[0].parentId : ''} onClick={self.addInfo}> + 添加</div>
                    </div>
                </div>
                {self.state.visible === true ? self.rederModal() : ''}
                {self.state.saveVisible === true ? self.renderSavw() : ''}
            </div>
        )
    }
}
const PoiLabelForm = Form.create()(PoiLabel)
export default PoiLabelForm