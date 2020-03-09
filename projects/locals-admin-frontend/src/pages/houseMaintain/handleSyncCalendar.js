import React, { Component } from 'react'
import { AAIHouseManagementService } from '../../services'
import { Form, Input, Button, Row,Col,message } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
class HandleSyncCalendar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            localsCalendarUrl: undefined,
            airbnbCalendarUrl: undefined
        }
    }
    componentDidMount () {
        this.updateInfo();
    }
    async updateInfo (){
        const {houseId} = this.props;
        AAIHouseManagementService.getSyncCalendarInfo(houseId).then(res=>{
            console.log('getSyncCalendarInfo',res);
            if(res){
                this.setState({
                    localsCalendarUrl:res.localsCalendarUrl,
                    airbnbCalendarUrl:res.airbnbCalendarUrl
                })
            }
        })
    }
    async putInfo (data){
        await AAIHouseManagementService.putSyncCalendarInfo(data);
        console.log('after putSyncCalendarInfo',data)
    }
    handleClear (){
        const self = this;
        return async function () {
            const {houseId} = self.props;
            const msg = await AAIHouseManagementService.postRemoveSyncCalendar(houseId);
            await self.updateInfo();
            if(msg){
                message.info(msg);
            }
        }
    }
    checkValid (data){
        const valid = {
            isValid:true,
            errmsg:[]
        };
        return valid;
    }
    handleSync (){
        const self = this;
        return async function () {
            const {form,houseId} = self.props;
            const postData = {
                houseSourceId:houseId,
                localsCalendarUrl: form.getFieldValue('localsCalendarUrl'),
                airbnbCalendarUrl: form.getFieldValue('airbnbCalendarUrl')
            };
            const valid = self.checkValid(postData);
            if(valid.isValid){
                await self.putInfo(postData);
                await self.updateInfo();
            }
        }
    }

    render (){
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const {localsCalendarUrl,airbnbCalendarUrl} = this.state;
        return <div className="width-full">
            <div>日历同步</div>
            <hr/>
            <Form>
                <div>路客同步URL地址</div>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator('localsCalendarUrl', {
                        rules: [{
                            required: true, message: '请输入同步地址'
                        }],
                        initialValue:localsCalendarUrl
                    })(
                        <TextArea disabled rows={3}/>
                    )}
                </FormItem>
                <div>Airbnb设置同步的URL地址</div>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator('airbnbCalendarUrl', {
                        initialValue:airbnbCalendarUrl
                    })(
                        <TextArea rows={3}/>
                    )}
                </FormItem>
                <Row type="flex" align="middle" gutter={16}>
                    <Col><Button onClick={this.handleClear()}>清空同步</Button></Col>
                    <Col><Button onClick={this.handleSync()}>立即同步</Button></Col>
                </Row>
            </Form>
        </div>
    }
}

export default Form.create()(HandleSyncCalendar)
