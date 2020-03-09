import React, {Component} from 'react'
import {commentService} from '../../../services/index'
import {Input, Form,Modal,message,Button,InputNumber,Drawer,Radio,Icon,Divider,Upload,Checkbox,DatePicker} from 'antd'
import {connect} from "react-redux"
import moment from 'moment'
const FormItem = Form.Item
const { RangePicker } = DatePicker
const RadioGroup = Radio.Group

class EditActivityForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formDatas:this.props.data
        }
    }

    componentWillUpdate (nextProps){
        if(nextProps.visible !== this.props.visible){
             this.setState({
                formsData:nextProps.data
             })
        }
    }


    onChangeTypeRadio = (e) => {
        const {formDatas} = this.state
        formDatas.activityTypeValue = e.target.value
        this.setState({formDatas})
    }

    //提交数据
    handleOk = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }else if(values.activityTypeValue === 0 && !values.activityNigthCouts){
                message.warn('请填完所有信息再提交')
                return
            }else if(values.activityTypeValue === 1 && !values.activityNigthTime1){
                message.warn('请填完所有信息再提交')
                return
            }else if(values.activityTypeValue === 1 && !values.activityNigthTime2){
                message.warn('请填完所有信息再提交')
                return
            }
            this.formAdd(values)
        })
    }
    onChange =(e,value) =>{
        const {formDatas} = this.state
        formDatas[value] = e
        this.setState({formDatas})
    }

    // 新增数据
    formAdd (obj){
        let date1 = moment(obj.activitySuitDate[0], "YYYY-MM-DD")
        let date2 = moment(obj.activitySuitDate[1], "YYYY-MM-DD")
        const params = {
            'id':this.state.formDatas.id,
            'activityTypeValue': obj.activityTypeValue,
            'activityDiscount': obj.activityDiscount,
            'activitySuitType': obj.activitySuitType,
            'activitySuitDate': [date1,date2],
            'activitySuitWeeks': obj.activitySuitWeeks,
            'activityName': obj.activityName,
            'activityNigthCouts': obj.activityNigthCouts,
            'activityNigthTime1': obj.activityNigthTime1,
            'activityNigthTime2': obj.activityNigthTime2
        }
        console.log('params',params)
        // this.props.dispatch({
        //     type: 'ADD_COMMENT_ING'
        // })
        // commentService.addComment(params).then((data) => {
        //     this.props.dispatch({
        //         type: 'ADD_COMMENT_SUCCESS'
        //     })
        //     message.success('添加成功！')
        //     this.props.onCancel()
        // })
    }

    disabledDate (current) {
        let date = new Date(new Date().getFullYear() + "-" + ( new Date().getMonth() + 1 ) + "-" + new Date().getDate() + " 00:00:00" ) / 1 - 1
        return current < date
    }


    render () {
        const _this = this
        const {formDatas} = this.state
        const {visible, onCancel, form} = this.props
        const { getFieldDecorator } = form
        const config = {
            activityTypeValue:[{ required: true, message: '促销类型不能为空' }],
            activityDiscount:[{ required: true, message: '可提供的折扣不能为空' }],
            activitySuitType: [{ type: 'array', required: true, message: '房型不能为空' }],
            activitySuitDate: [{ type: 'array', required: true, message: '促销适用时间不能为空' }],
            activityName:[{ required: true, message: '活动名称不能为空' }]
        };
        return (
            <Drawer
                title="新增促销活动"
                width={800}
                onClose={onCancel}
                visible={visible}
                style={{
                    overflow: 'auto',
                    height: 'calc(100% - 80px)',
                    paddingBottom: '80px'
                }}
            >
                <Form>
                    <div className="padder-vb-md">
                        <div style={{fontSize:16,fontWeight:500,lineHeight:'42px'}}>促销类型</div>
                        <div style={{width:"100%"}}>
                            <FormItem style={{width:"100%",padding:20,backgroundColor:"#fafafa",borderRadius:4,marginBottom:0}}>
                                {getFieldDecorator('activityTypeValue',
                                    {initialValue:formDatas.activityTypeValue,rules: config.activityTypeValue },
                                )(
                                    <RadioGroup buttonStyle="solid" onChange={_this.onChangeTypeRadio}>
                                        <div style={{width:"100%"}}>
                                            <Radio value={0} style={{marginRight:10,borderRadius:4,width:"74px",textAlgin:"center"}}>连住优惠</Radio>
                                            <div className="disFlex" style={{display:"flex"}}>
                                                <div style={{lineHeight:"39px"}}>
                                                    客人如要享受该优惠，需至少入住
                                                </div>
                                                <div style={{width:"120px",paddingLeft: "10px",paddingRight: "10px"}}>
                                                    <FormItem style={{margin:0}}>
                                                        {getFieldDecorator('activityNigthCouts',
                                                            {initialValue:formDatas.activityNigthCouts}
                                                        )(
                                                            <InputNumber min={0} max={10000} onChange={function (e){_this.onChange(e,'activityNigthCouts')}}/>
                                                        )}
                                                    </FormItem>
                                                    {formDatas.activityTypeValue === 0 && !formDatas.activityNigthCouts && <div className="ant-form-explain" style={{color:'#f5222d'}}>类型为连住优惠时，此处必填！</div>}
                                                </div>
                                                <div style={{lineHeight:"39px",flex:1}}>
                                                    晚
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{width:"100%"}}>
                                            <Radio value={1} style={{marginRight:10,borderRadius:4,width:"74px",textAlgin:"center"}}>限时优惠</Radio>
                                            <div style={{display:"flex"}}>
                                                <div style={{lineHeight:"39px"}}>
                                                    客人如要享受该优惠，需要在
                                                </div>
                                                <div style={{width:"120px",paddingLeft: "10px",paddingRight: "10px"}}>
                                                    <FormItem style={{margin:0}}>
                                                        {getFieldDecorator('activityNigthTime1',
                                                            {initialValue:formDatas.activityNigthTime1}
                                                        )(
                                                            <InputNumber min={0} max={24} onChange={function (e){_this.onChange(e,'activityNigthTime1')}}/>
                                                        )}
                                                    </FormItem>
                                                    {formDatas.activityTypeValue === 1 && !formDatas.activityNigthTime1 && <div className="ant-form-explain" style={{color:'#f5222d'}}>类型为限时优惠时，此处必填！</div>}
                                                </div>
                                                <div style={{lineHeight:"39px"}}>
                                                    点至
                                                </div>
                                                <div style={{width:"120px",paddingLeft: "10px",paddingRight: "10px"}}>
                                                    <FormItem style={{margin:0}}>
                                                        {getFieldDecorator('activityNigthTime2',
                                                            {initialValue:formDatas.activityNigthTime2}
                                                        )(
                                                            <InputNumber min={0} max={24} onChange={function (e){_this.onChange(e,'activityNigthTime2')}}/>
                                                        )}
                                                    </FormItem>
                                                    {formDatas.activityTypeValue === 1 && !formDatas.activityNigthTime2 && <div className="ant-form-explain" style={{color:'#f5222d'}}>类型为限时优惠时，此处必填！</div>}
                                                </div>
                                                <div style={{lineHeight:"39px",flex:1}}>
                                                    点之间预订当晚入住房源
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="padder-vb-md">
                        <div style={{fontSize:16,fontWeight:500,lineHeight:'42px'}}>可提供的折扣为多少？<span style={{fontSize:12,color:'#999999',fontWeight:400}}>（要求：折扣限制20%～99%之间）</span></div>
                        <div className="pt10" style={{display:"flex",width:"100%",padding:20,backgroundColor:"#fafafa",borderRadius:4}}>
                            <div style={{width:160,paddingRight: "10px"}}>
                                <FormItem style={{marginBottom:0}}>
                                    {getFieldDecorator('activityDiscount',
                                        {initialValue:formDatas.activityDiscount, rules: config.activityDiscount },
                                    )(
                                        <InputNumber min={20} max={99} />
                                    )}
                                </FormItem>
                            </div>
                            <div style={{lineHeight:"39px"}}>
                                %
                            </div>
                        </div>
                    </div>
                    <div className="padder-vb-md" >
                        <div style={{fontSize:16,fontWeight:500,lineHeight:'42px'}}>适合那种房型？<span style={{fontSize:12,color:'#999999',fontWeight:400}}>（要求：请在上方至少选择一种房价，以显示房型进行设置）</span></div>
                        <div style={{width:"100%",padding:20,backgroundColor:"#fafafa",borderRadius:4}}>
                            <FormItem style={{marginBottom:0}}>
                                {getFieldDecorator('activitySuitType',
                                    {initialValue: formDatas.activitySuitType, rules: config.activitySuitType}
                                )(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <div style={{marginTop:"10px"}} ><Checkbox value="A">豪华大床房</Checkbox></div>
                                        <div style={{marginTop:"10px"}}><Checkbox value="B">标注房</Checkbox></div>
                                        <div style={{marginTop:"10px"}}><Checkbox value="C">房型三</Checkbox></div>
                                    </Checkbox.Group>
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="padder-vb-md" >
                        <div style={{fontSize:16,fontWeight:500,lineHeight:'42px'}}>折扣的入住日期？</div>
                        <div style={{width:"100%",padding:20,backgroundColor:"#fafafa",borderRadius:4}}>
                            <div className="pt10">
                                <FormItem style={{marginBottom:0,width:300}}>
                                    {getFieldDecorator('activitySuitDate',
                                        { initialValue: formDatas.activitySuitDate ? [moment(formDatas.activitySuitDate[0], "YYYY-MM-DD"), moment(formDatas.activitySuitDate[1], "YYYY-MM-DD")] : null ,
                                           rules: config.activitySuitDate})(
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={_this.disabledDate}
                                        />
                                    )}
                                </FormItem>
                            </div>
                            <div className="pt10">
                                <FormItem style={{marginBottom:0}}>
                                    {getFieldDecorator('activitySuitWeeks',
                                        {initialValue: formDatas.activitySuitWeeks}
                                    )(
                                        <Checkbox.Group style={{ width: '100%' }}>
                                            <Checkbox value={1}>星期一</Checkbox>
                                            <Checkbox value={2}>星期二</Checkbox>
                                            <Checkbox value={3}>星期三</Checkbox>
                                            <Checkbox value={4}>星期四</Checkbox>
                                            <Checkbox value={5}>星期五</Checkbox>
                                            <Checkbox value={6}>星期六</Checkbox>
                                            <Checkbox value={7}>星期天</Checkbox>
                                        </Checkbox.Group>
                                    )}
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div className="padder-vb-md">
                        <div style={{fontSize:16,fontWeight:500,lineHeight:'42px'}}>该促销的名称？</div>
                        <FormItem style={{width:"100%",padding:20,backgroundColor:"#fafafa",borderRadius:4}}>
                            {getFieldDecorator('activityName',
                                {initialValue: formDatas.activityName,rules: config.activityName}
                            )(
                                <Input maxLength={1000} type="text" placeholder={'请填写促销的名称'} />
                            )}
                        </FormItem>
                    </div>
                </Form>
                <div
                    style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right'
                    }}
                >
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={this.handleOk} type="primary" style={{ marginRight: 8 }}>
                        保存并生成日历
                    </Button>
                    <Button onClick={this.handleOk} type="danger">
                        删除日历
                    </Button>
                </div>
            </Drawer>
        )
    }
}

let EditActivity = Form.create()(EditActivityForm)
export default EditActivity