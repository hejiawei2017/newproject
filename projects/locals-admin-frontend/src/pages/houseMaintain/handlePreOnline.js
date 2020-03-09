import React, { Component } from 'react'
import { AAIHouseManagementService } from '../../services'
import { Form, Input, Row, Col, Button,message } from 'antd';
const FormItem = Form.Item;
const selectUIComSponent = (selected) => <div className = {selected ? 'ui-icon-selected' : 'ui-icon-unselected'}></div>;
class HandlePreOnline extends Component {
    constructor (props) {
        super(props);
        this.state = {
            couldEdit:false,
            hasDoorIp:false,
            isRepeat:false
        }
    }
    componentDidMount () {
        this.updateState();
    }
    updateState (){
        const {houseId} = this.props;
        AAIHouseManagementService.getExtend(houseId).then(res=>{
            console.log('getExtend',res);
            let nextCouldEdit = false,
                nextHasDoorIp = true;
            if (res.recordAirbnbAccount === null){
                nextCouldEdit = true;
            }
            if (res.doorIp === ''){
                nextHasDoorIp = false
            }
            this.setState({
                couldEdit:nextCouldEdit,
                hasDoorIp:nextHasDoorIp,
                ...res
            })
        })
    }
    async putNewData (houseId,data){
        await AAIHouseManagementService.putExtend(houseId,data)
    }
    toggleHasIp (nextHasDoorIp){
        const self = this;
        return function () {
            const {hasDoorIp} = self.state;
            if(hasDoorIp !== nextHasDoorIp){
                self.setState({
                    hasDoorIp: nextHasDoorIp
                })
            }
        }
    }
    checkValid (data){
        const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        const valid = {
            errmsg: [],
            isValid: true
        };
        if(data.doorIp){
            if(!ipReg.test(data.doorIp)){
                valid.isValid = false;
                valid.errmsg.push('ip 地址格式无效');
            }
        }

        return valid;
    }
    serializeData (){
        const {form} = this.props;
        const {hasDoorIp,doorIp,couldEdit,recordAirbnbAccount} = this.state;
        return {
            recordAirbnbAccount: couldEdit ? form.getFieldValue('recordAirbnbAccount') : recordAirbnbAccount,
            doorIp: hasDoorIp ? form.getFieldValue('doorIp') : ''
        }
    }
    injectNextCb (){
        const self = this;
        return async function () {
            const {nextCb,houseId} = self.props;
            const postData = self.serializeData();
            const valid = self.checkValid(postData);
            if(valid.isValid){
                self.setState({isRepeat:true});
                await self.putNewData(houseId,postData);
                self.setState({isRepeat:false});
                message.success('更新成功');
                nextCb();
            }else{
                message.error(valid.errmsg.join(','));
            }
        }
    }
    render (){
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const {hasDoorIp,doorIp,couldEdit,recordAirbnbAccount,isRepeat} = this.state;
        return <div className="width-full" style={{marginBottom: 50}}>
            <div>正式上线必填项</div>
            <hr/>
            <Form>
                <Row>门锁编码（IP）</Row>
                <Row type="flex" gutter={16} align="middle">
                    <Col>
                        <div className="ui-margin-bottom-16" onClick={this.toggleHasIp(true)}>
                            <span className="mr10">{selectUIComSponent(hasDoorIp)}</span>
                            <span>有智能门锁</span>
                        </div>
                    </Col>
                    <Col>
                        <FormItem
                            {...formItemLayout}
                            style={{width:200}}
                        >
                            {getFieldDecorator('doorIp', {
                                rules: [ {
                                    required: true, message: '请输入门锁编码'
                                }],
                                initialValue:doorIp
                            })(
                                <Input placeholder="填写门锁编码" disabled={!hasDoorIp} style={{width:'100%'}} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" gutter={16} align="middle">
                    <Col onClick={this.toggleHasIp(false)}>
                        <div className="ui-margin-bottom-16">
                            <span className="mr10">{selectUIComSponent(!hasDoorIp)}</span>
                            <span>无智能门锁</span>
                        </div>
                    </Col>
                </Row>
                <Row>Airbnb房东账号</Row>
                <Row>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('recordAirbnbAccount', {
                            rules: [ {
                                required: true, message: '请输入Airbnb房东账号'
                            }],
                            initialValue:recordAirbnbAccount
                        })(
                            <Input disabled={!couldEdit}/>
                        )}
                    </FormItem>
                </Row>
                <Row><em className="text-color-warning">*正式上线后不能修改，请谨慎填写</em></Row>
            </Form>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                }}
            >
                <Button
                    style={{
                        marginRight: 8
                    }}
                    onClick={this.props.onCloseDrawer}
                >
                    取消
                </Button>
                <Button type="primary" loading={isRepeat} onClick={this.injectNextCb()}>
                    保存并下一步
                </Button>
            </div>
        </div>
    }
}

export default Form.create()(HandlePreOnline)
