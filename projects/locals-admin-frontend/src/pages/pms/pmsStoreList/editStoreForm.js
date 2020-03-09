import React, {Component} from 'react'
import {Input, Form,Button,InputNumber,Radio,message,Icon} from 'antd'
import EditStoreImg from './editStoreImg'
import {reg} from "../../../utils/utils"
import {pmsService} from '../../../services'
const FormItem = Form.Item
const RadioGroup = Radio.Group

class EditStoreForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            fileLists: this.props.data.fileLists,
            formDatas: this.props.data,
            loading: false,
            saveLoading: false,
            longitude: 0,
            latitude: 0,
            datas: this.props.datas,
            exRateErr: false,
            hotelNoErr: false,
            hotelNoMag:'项目编号不能为空!',
            CNY: 'CNY'
        }
    }

    // // 组件渲染后调用
    componentDidMount (){
        const {data} = this.props
        this.setState({
            hotelNoErr: data.hotelType === 4 ? false : true
        })
    }

    componentWillUpdate (nextProps){
        if(nextProps.data !== this.props.data){
             this.setState({
                formsData: nextProps.data,
                fileLists: nextProps.data.fileLists,
                hotelNoErr: nextProps.data.hotelType === 4 ? false : true
             })
        }
    }

    correctingItems = (data) =>{
        const {form} = this.props
        const linkPhone = form.getFieldValue('linkPhone')
        if(linkPhone){
            pmsService.correctingEmployee(linkPhone).then((res) => {
                if(res){
                    form.setFieldsValue({
                        linkMan: res.realName
                    })
                }else{
                    message.warning('查询不到' + linkPhone + '的员工，请确认后再试！')
                }
            }).catch(err => { })
        }else{
            message.warning('请填写联系人电话之后再获取！')
        }
    }

    onChangeRadio = (e,data) =>{
        if(data === 'currency'){
            this.setState({CNY: e.target.value});
            if(e.target.value !== 'CNY'){
                this.setState({
                    exRateErr : true
                }, () => { this.props.form.validateFields(['exchangeRate'], { force: true }) })
            }else{
                this.setState({
                    exRateErr : false
                },() => { this.props.form.validateFields(['exchangeRate'], { force: true })})
            }
        }else{
            if(e.target.value === 4){
                if(this.props.form.getFieldValue('hotelNo')){
                    console.log(this.props.form.setFieldsValue)
                    this.props.form.setFieldsValue({ hotelNo: null})
                }
                this.setState({
                    hotelNoErr : false
                },() => { this.props.form.validateFields(['hotelNo'], { force: true })})
            }else{
                this.setState({
                    hotelNoErr: true
                })
            }
        }
    }

    onChangeFiles = (fileLists) =>{
        this.setState({
            fileLists: fileLists.images || []
        })
    }

    correcting = () =>{
        const {form} = this.props
        const hotelNo = form.getFieldValue('hotelNo')
        if(hotelNo === null || hotelNo === undefined){
            this.props.form.validateFields(['hotelNo'], { force: true })
            return
        }
        this.setState({ loading: true })
        pmsService.correctingHouseNo(hotelNo).then(res=>{
            this.setState({ loading: false})
            if(res){
                message.success('校验成功该项目编号可以使用！')
            }else{
                message.error('经校验无该合同，请确认项目编号正确后再试！')
            }
        }).catch(err => {
            this.setState({ loading: false })
        })
    }

    //提交数据
    handleOk = (e) => {
        e.preventDefault()
        const hotelNo = this.props.form.getFieldValue('hotelNo')
        const hotelType = this.props.form.getFieldValue('hotelType')
        if(hotelType !== 4 && (!hotelNo || hotelNo === null || hotelNo === undefined)){
            this.setState({
                hotelNoErr : true
            }, () => { this.props.form.validateFields(['hotelNo'], { force: true })})
            return
        }else{
            this.setState({
                hotelNoErr : false
            },() => {this.props.form.validateFields(['hotelNo'], { force: true }) })
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }else if(this.state.fileLists.length === 0){
                message.error('门店图片不能为空')
                return
            }
            this.setState({ saveLoading: true})
            const params = {
                hotelName: values.hotelName,
                hotelEnName: values.hotelEnName,
                address: values.address,
                enAddress: values.enAddress,
                longitude: values.longitude || 0,
                latitude: values.latitude || 0,
                linkMan: values.linkMan,
                linkPhone: values.linkPhone,
                email: values.email,
                currency: values.currency,
                exchangeRate: values.currency === 'CNY' ? 1 : values.exchangeRate,
                hotelType: values.hotelType,
                overBooking: values.overBooking,
                hotelNo: values.hotelType === 4 ? null : values.hotelNo,
                images: {
                    module: "门店",
                    images: this.state.fileLists
                }
            }
            if(values.hotelType !== 4){
                try{
                    pmsService.correctingHouseNo(values.hotelNo).then(res=>{
                        if(res){
                            this.saveForms(params)
                        }else{
                            this.setState({
                                saveLoading: false,
                                hotelNoErr : true
                            })
                            message.error('项目编号验证不通过，请确认项目编号正确后再试！')
                        }
                    }).catch(err => {
                        this.setState({ saveLoading: false })
                    })
                }catch(error){
                    this.setState({ saveLoading: false })
                    if( error === "error" ){
                        return false
                    }
                }
            }else{
                this.saveForms(params)
            }
        })
    }

    saveForms = (params) =>{
        console.log('params',params)
        if(this.props.type === 'EditStore'){
            pmsService.editStore(this.props.id,params).then((res) => {
                message.success('修改成功')
                this.setState({ saveLoading: false })
            }).catch(err => {
                message.error('修改失败')
                this.setState({ saveLoading: false })
            })
        }else{
            pmsService.addStore(params).then((res) => {
                message.success('提交成功')
                this.setState({ saveLoading: false })
                this.props.onCancel()
            }).catch(err => {
                message.error('提交失败')
                this.setState({ saveLoading: false })
            })
        }
    }


    render () {
        const _this = this
        const {formDatas,saveLoading,CNY} = _this.state
        const { onCancel, form} = _this.props
        const { getFieldDecorator } = form
        const data = [
            {
                id:'0',
                label:'门店名称',
                codetag:'hotelName',
                placeholder:'请输入门店名称',
                value:formDatas.hotelName,
                remarks:null,
                disabled: false,
                search: false,
                maxLength:100,
                config: [{ required:true, message:'门店名称不能为空' }]
            }, {
                id:'1',
                label:'En',
                codetag:'hotelEnName',
                placeholder:'请输入英文门店名称',
                value:formDatas.hotelEnName,
                remarks:null,
                disabled: false,
                search: false,
                maxLength:150,
                config: [{ required:true, message:'英文门店名称不能为空' }]
            }, {
                id:'2',
                label:'门店地址',
                codetag:'address',
                placeholder:'请输入门店地址',
                value: formDatas.address,
                remarks:null,
                disabled: false,
                search: false,
                maxLength:400,
                config: [{ required:true, message:'门店地址不能为空' }]
            }, {
                id:'3',
                label:'En',
                codetag:'enAddress',
                placeholder:'请输入英文门店地址',
                value: formDatas.enAddress,
                remarks:null,
                disabled: false,
                search: false,
                maxLength:400,
                config: [{ required:true, message:'英文门店地址不能为空' }]
            }, {
                id:'4',
                label:'门店位置',
                remarks:"（中国查高德，中国以外查Coogle）",
                search: false,
                children:[
                    {
                        codetag:'longitude',
                        placeholder:'门店位置的经度',
                        value: formDatas.longitude,
                        disabled: false,
                        maxLength:20,
                        config: [
                            { required:true, message:'门店位置的经度不能为空'},
                            {
                                validator (rule, value, callback) {
                                    if (isNaN(value)) {
                                        callback('请输入的数字类型')
                                    }
                                    let num = parseInt(value, 0)
                                    if(num < -180 || num > 180){
                                        callback('经度范围为-180°～180°')
                                    }
                                    callback()
                                }
                            }
                        ]
                    },
                    {
                        codetag:'latitude',
                        placeholder:'门店位置的纬度',
                        value: formDatas.latitude,
                        disabled: false,
                        maxLength:20,
                        config: [
                            { required:true, message:'门店位置的纬度不能为空' },
                            {
                                validator (rule, value, callback) {
                                    let reg = /^[0-9]+.?[0-9]*$/
                                    if (!reg.test(value)) {
                                        callback('请输入的数字类型')
                                    }
                                    let num = parseInt(value, 0)
                                    if(num < -90 || num > 90){
                                        callback('纬度范围为-90°～90°')
                                    }
                                    callback()
                                }
                            }
                        ]
                    }
                ]
            }, {
                id:'5',
                label:'联系人电话',
                codetag:'linkPhone',
                placeholder:'请输入联系人电话',
                search: false,
                value: formDatas.linkPhone,
                remarks:" ",
                config: [{ required:true, message:'联系人电话不能为空' },
                        {pattern:reg.tel,message: '请输入正确手机号码!'}]
            }, {
                id:'6',
                label:'联系人姓名',
                codetag:'linkMan',
                placeholder:'请输入联系人姓名',
                search: true,
                disabled: true,
                maxLength:10,
                value: formDatas.linkMan,
                remarks:" ",
                config: [{ required:true, message:'联系人姓名不能为空' }]
            },
            {
                id:'7',
                label:'联系人邮箱',
                codetag:'email',
                placeholder:'请输入联系人邮箱',
                search: false,
                value: formDatas.email,
                remarks:" ",
                config: [{ required:true, message:'联系人邮箱不能为空' }, {
                    type: 'email', message: '输入的邮箱无效'
                }]
            }
        ]
        const plainOptions = [
            {
                label:'门店币种',
                codetag:'currency',
                radios: [
                    { label: '人民币', value: 'CNY' },
                    { label: '加币', value: 'CAD' },
                    { label: '泰铢', value: 'THB' },
                    { label: '美元', value: 'USD' }
                ],
                value: formDatas.currency
            },
            {
                label:'门店类型',
                codetag:'hotelType',
                radios: [
                    { label: '酒店', value: 1 },
                    { label: '公寓', value: 2 },
                    { label: '客栈', value: 3 },
                    { label: '民宿', value: 4 }
                ],
                value: formDatas.hotelType
            }]
        const style = {width:314}
        const style2 = {flex:1}
        return (
            <Form>
                <div className="formTop" style={{padding: "20px"}}>
                    <div className="padder-vb-md" style={{fontSize:"16px",fontWeight:600}}>门店信息</div>
                    {
                        data.length > 0 ? data.map(function (item,index) {
                            return(
                                <div key={index} style={{display:"flex"}}>
                                    <div style={{lineHeight:"39px",width:"100px"}}>
                                        {item.label}
                                    </div>
                                    {
                                        item.children ?
                                            <div style={{width:319,display:'flex'}}>
                                                {
                                                    item.children.map((_item,_index) =>{
                                                        return (
                                                            <div style={{flex:1,paddingRight:5}} key={_index}>
                                                                <FormItem>
                                                                    {getFieldDecorator(_item.codetag,
                                                                        {initialValue:_item.value, rules: _item.config},
                                                                    )(
                                                                        <Input maxLength={item.maxLength} type="text" disabled={_item.disabled} placeholder={_item.placeholder} />
                                                                    )}
                                                                </FormItem>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :
                                            <div style={item.remarks ? style : style2}>
                                                <FormItem>
                                                    {getFieldDecorator(item.codetag,
                                                        {initialValue:item.value, rules: item.config},
                                                    )(
                                                        !item.search ?
                                                            <Input type="text" maxLength={item.maxLength} disabled={item.disabled} placeholder={item.placeholder} />
                                                            :
                                                            <Input type="text" maxLength={item.maxLength} disabled={item.disabled} placeholder={item.placeholder} addonAfter={<Icon type="search" onClick={function (){ _this.correctingItems(item.codetag)}} />} />
                                                    )}
                                                </FormItem>
                                            </div>
                                    }
                                    {
                                        item.remarks && <div style={{lineHeight:"39px",color:"#666666",fontSize:13,fontWeight:400,paddingLeft:20,flex:1}}>{item.remarks}</div>
                                    }
                                </div>
                            )
                        }) : null
                    }
                    {
                        plainOptions.map((item,index) => {
                            return (
                                <div style={{display:"flex"}} key={index}>
                                    <div style={{lineHeight:"39px",width:100}}>
                                        {item.label}
                                    </div>
                                    <div>
                                        <FormItem>
                                            {getFieldDecorator(item.codetag,{initialValue:item.value},
                                            )(
                                                <RadioGroup buttonStyle="solid" onChange={function (e){ _this.onChangeRadio(e, item.codetag)}}>
                                                    {
                                                        item.radios.map(function (_item,_index) {
                                                            return (
                                                                <Radio value={_item.value} key={_index} style={{marginRight:10,borderRadius:4,width:"74px",textAlgin:"center"}}>{_item.label}</Radio>
                                                            )
                                                        })
                                                    }
                                                    </RadioGroup>
                                            )}
                                        </FormItem>
                                    </div>
                                    {
                                        item.codetag === 'currency' &&
                                            <div style={{display:'flex'}} >
                                                <div style={{lineHeight:"39px",color:"#666666",fontSize:13,fontWeight:400,paddingRight:10}}>对人民币汇率</div>
                                                <div style={{lineHeight:"39px",color:"#666666",fontSize:13,fontWeight:400,width:120}}>
                                                    {
                                                        <FormItem style={{margin:0}}>
                                                            {getFieldDecorator('exchangeRate',
                                                                {initialValue:formDatas.exchangeRate,rules: [{ required: this.state.exRateErr, message:'汇率不能为空' }]},
                                                            )(
                                                                <InputNumber disabled={CNY === 'CNY'} min={0} placeholder="请填写汇率"/>
                                                            )}
                                                        </FormItem>
                                                    }
                                            </div>
                                        </div>
                                    }
                                    <div style={{flex:1}}></div>
                                </div>
                            )
                        })
                    }
                    <div style={{display:"flex"}}>
                        <div style={{lineHeight:"39px",width:"100px"}}>
                            项目编号
                        </div>
                        <div style={{width:314,marginBottom:15}}>
                            <FormItem style={{margin:0}}>
                                {getFieldDecorator('hotelNo',
                                    {initialValue:formDatas.hotelNo, rules: [{ required: this.state.hotelNoErr, message: '项目编号不能为空!' }]},
                                )(
                                    <Input type="text" disabled={!this.state.hotelNoErr} placeholder="请填写项目编号"/>
                                )}
                            </FormItem>
                        </div>
                        <div style={{lineHeight:"39px",paddingLeft:"20px"}}>
                            <Button
                                type="primary"
                                disabled={!this.state.hotelNoErr}
                                loading={this.state.loading && this.state.hotelNoErr ? true : false}
                                onClick={_this.correcting}
                            >校验</Button>
                        </div>
                    </div>
                    <div className="disFlex" style={{display:"flex"}}>
                        <div style={{lineHeight:"39px",width:100}}>
                            超订设置
                        </div>
                        <div style={{lineHeight:"39px"}}>
                            允许按门店超订
                        </div>
                        <div style={{width:225,paddingLeft: 10,paddingRight: 10}}>
                            <FormItem>
                                {getFieldDecorator('overBooking',
                                    {initialValue:formDatas.overBooking,
                                        rules:[{ required:true, message:'超订设置不能为空' }]
                                    }
                                )(
                                    <InputNumber disabled={!(formDatas.overBooking === 0 || formDatas.overBooking === null)} min={0} max={100} />
                                )}
                            </FormItem>
                        </div>
                        <div style={{lineHeight:"39px",flex:1,color:"#666666",fontSize:13,fontWeight:400}}>
                            %（计算结果若有小数向上取整为1）
                        </div>
                    </div>
                </div>
                <EditStoreImg lists={this.state.fileLists} imagesLists={this.state.formDatas.images} onChange={_this.onChangeFiles}/>
                {
                    this.props.type === "EditStore" ?
                        <div style={{
                            width: '100%',
                            padding: '50px 20px 30px',
                            display: 'flex',
                            background: '#fff'}}
                        >
                            <div style={{flex:1}}></div>
                            <Button onClick={this.handleOk} type="primary" style={{width:110}} loading={saveLoading ? true : false}>
                                {saveLoading ? '提交中' : '提交'}
                            </Button>
                        </div>
                        :
                        <div style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                width: '100%',
                                borderTop: '1px solid #e9e9e9',
                                padding: '10px 16px',
                                background: '#fff',
                                textAlign: 'right',
                                zIndex:111
                            }}
                        >
                            <Button onClick={onCancel} style={{ marginRight: 8 }}>
                                取消
                            </Button>
                            <Button onClick={this.handleOk} type="primary" style={{width:110}} loading={saveLoading ? true : false}>
                                {saveLoading ? '提交中' : '提交'}
                            </Button>
                        </div>
                }
            </Form>
        )
    }
}

let EditStore = Form.create()(EditStoreForm)
export default EditStore
