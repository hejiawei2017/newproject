import React, {Component} from 'react';
import { Row, Col, Modal, Form, Input,Select,DatePicker } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const tableConfig = {
    originator:{
        apiKey:'originator',
        values:[
            {
                value:'1',
                text:'租客姓名+身份证',
                apiKey: '1',
                isDefault:true
            },
            {
                value:'2',
                text:'管家姓名+手机',
                apiKey: '2'
            }
        ],
        rules:{},
        label:'发起人：'
    },
    dismissDate:{
        apiKey:'dismissDate',
        rules:{
            required: true, message: '请输入解除租约时间'
        },
        label:'解除租约时间：'
    },
    reduceRules:{
        apiKey:'reduceRules',
        rules:{
            required: true, message: '请输入退租条款'
        },
        label:'退租条款：'
    }
};
class HandleRentReduceModal extends Component{
    constructor (props){
        super(props);
        this.state = {
            visible:false
        };
    }
    getConfig=(key)=>{
        const config = tableConfig;
        return key ? config[key] : config;
    };
    submitInfo=()=>{
        console.log(this.props.form.getFieldsValue());
        this.props.onCancel();
    };
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 20 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                width={800}
                title="发起解除租约"
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                onOk={this.submitInfo}
                okText={'提交退租'}
            >
                <FormItem
                    {...formItemLayout}
                    label={this.getConfig('originator').label}
                >
                    {getFieldDecorator(this.getConfig('originator').apiKey, {
                        rules: [this.getConfig('originator').rules],
                        initialValue:this.getConfig('originator').values.find(val=>val.isDefault).value
                    })(
                        <Select style={{ width: "100%" }}>
                            {this.getConfig('originator').values.map((val,key)=>(
                                <Option key={key} value={val.value}>{val.text}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={this.getConfig('dismissDate').label}
                >
                    {getFieldDecorator(this.getConfig('dismissDate').apiKey, {
                        rules: [this.getConfig('dismissDate').rules]
                    })(
                        <DatePicker />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={this.getConfig('reduceRules').label}
                >
                    {getFieldDecorator(this.getConfig('reduceRules').apiKey, {
                        rules: [this.getConfig('reduceRules').rules]
                    })(
                        <TextArea
                            rows={5}
                        />
                    )}
                </FormItem>
            </Modal>
        );
    }
}
export default Form.create()(HandleRentReduceModal)
