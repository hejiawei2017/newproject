import React, { Component } from 'react';
import { AAIHouseManagementService } from '../../services';
import { Row, Col, Form, Button, message, Input } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
class HandleRule extends Component {
    constructor (props) {
        super(props);
        this.state = {
            housingCode: '',
            dirty: false,
            isRepeat:false
        }
    }
    componentDidMount () {
        this.updateInfo();
    }

    updateInfo (){
        const {houseId} = this.props;
        AAIHouseManagementService.getRuleInfo(houseId).then(res=>{
            console.log('getRuleInfo',res);
            this.setState({
                housingCode:res.housingCode
            })
        })
    }
    serialPostData (){
        const {form} = this.props;
        return {
            housingCode: form.getFieldValue('housingCode')
        }
    }
    checkDataValidate (data){
        // data is post data;
        const res = {
            isValid: true,
            errmsg: []
        };
        return res;
    }
    async updateRuleInfo (houseId,data){
        await AAIHouseManagementService.putRuleInfo(houseId,data);
    }
    injectNextCb (){
        const self = this;
        return async function () {
            const {nextCb,houseId} = self.props;
            const {dirty} = self.state;
            const postData = self.serialPostData();
            const valid = self.checkDataValidate(postData);
            if(dirty){
                if(valid.isValid){
                    self.setState({isRepeat:true});
                    await self.updateRuleInfo(houseId,postData);
                    self.setState({isRepeat:false});
                    message.success('更新成功');
                    nextCb()
                }else {
                    message.error(valid.errmsg.join(','))
                }
            }else {
                nextCb();
            }
        }
    }
    setDirty (){
        const self = this;
        return function () {
            self.setState({
                dirty:true
            })
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
        const {housingCode,isRepeat} = this.state;
        return <div className="width-full" style={{marginBottom: 50}}>
            <div>房屋守则</div>
            <hr/>
            <div><em>*以下为建议房屋守则，可根据自身实际需求修改</em></div>
            <Form>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator('housingCode', {
                        rules: [{
                            required: true, message: '请输入房屋守则'
                        }],
                        initialValue:housingCode
                    })(
                        <TextArea rows={20} onChange={this.setDirty()}/>
                    )}
                </FormItem>
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

export default Form.create()(HandleRule)
