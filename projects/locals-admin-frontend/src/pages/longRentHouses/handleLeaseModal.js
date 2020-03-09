import React, {Component} from 'react';
import { Row, Col, Button, Modal, Form, Input,Radio,Select,Checkbox,DatePicker } from 'antd';
import UploadImage from '../../components/uploadImage';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
class HandleLeaseModal extends Component{
    constructor (props){
        super(props);
        this.state = {
            visible:false
        };
    }
    getData=()=>{
        return {data:this.props.form.getFieldsValue()}
    };
    hideModal=()=>{
      this.setState({visible:false})
    };
    submitInfo=()=>{
        console.log(this.props.form.getFieldsValue());
        this.hideModal();
    };
    render () {
        const noLabelFormItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                width={1200}
                className="hideModel-okBtn"
                title="租金账单管理"
                visible={this.props.visible}
                onCancel={this.props.onCancel}
            >
                <Row gutter={12} type={"flex"}>
                    <Col span={12}><b>整租·中贸广场 2号楼 1单元 3310</b></Col>
                    <Col span={12}><b>租约编码：103438430430480343</b></Col>
                    <Col span={6}>承租人姓名：杨琬晴 13661769517</Col>
                    <Col span={6}>承租人证件：身份证 500102199206230504</Col>
                    <Col span={6}>签约信息：5000元/月 押一付一</Col>
                    <Col span={6}>租期：2019.01.01-2019.03.31</Col>
                </Row>
                <hr />
                <div>
                    <div>
                        <b>租约账单</b>
                        已收11600元
                        待收11400元
                    </div>
                    {/*todo table?*/}
                </div>
                <Modal
                    visible={this.state.visible}
                    title={'结算操作'}
                    onCancel={this.hideModal}
                    onOk={this.submitInfo}
                >
                    <Row type={"flex"} align={"center"}>
                        <Col span={4}>入住时间：</Col>
                        <Col span={20}>2018-12-27~2018-12-31</Col>
                    </Row>
                    <Row>
                        <Col span={4}>账单金额：</Col>
                        <Col span={20}>640元</Col>
                    </Row>
                    <Row type={"flex"} align={"center"}>
                        <Col span={4}>实收金额：</Col>
                        <Col span={20}>
                            <FormItem
                                {...noLabelFormItemLayout}
                            >
                                {getFieldDecorator('amountReceived', {
                                    rules: [{
                                        required: true, message: '请输入实收金额'
                                    }],
                                    initialValue:''
                                })(
                                    <Input addonAfter={"元"}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div>备注</div>
                    <FormItem
                        {...noLabelFormItemLayout}
                    >
                        {getFieldDecorator('remark', {
                            rules: [{
                                required: true, message: '请输入备注'
                            }],
                            initialValue:''
                        })(
                            <TextArea
                                rows={5}
                            />
                        )}
                    </FormItem>
                </Modal>
            </Modal>
        );
    }
}
export default Form.create()(HandleLeaseModal)
