import React, {Component} from 'react';
import { Row, Col, Button, Modal, Form, Input,Radio,Select,Checkbox } from 'antd';
import UploadImage from '../../components/uploadImage';
import {longRentService} from '../../services'
const FormItem = Form.Item;
const { Option } = Select;
const Search = Input.Search
class HandleHouseInfo extends Component{
    constructor (props){
        super(props)
        this.state = {

        }
    }
    getData=()=>{
        return {data:{}}
    }
    handleSubmit = () => {

    }
    handleInputSearch = (keyword) => {
        console.log(keyword)
        longRentService.getLongRentalHouseDetail({houseNo: keyword}).then(data => {
            console.log(data)
        })
    }
    render () {
        const that = this
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };
        const noLabelFormItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        }
        const inlineFormItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 12 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            }
        }
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form onSubmit={this.handleSubmit} className={'pt20'} style={{padding: '20px'}}>
                <FormItem
                    {...{
                        labelCol: { span: 3 },
                        wrapperCol: { span: 5 }
                    }}
                    label="房源编码"
                >
                    {getFieldDecorator('houseNo', {
                        rules: [{
                            required: true, message: '请输入房源编码'
                        }],
                        initialValue: ''
                    })(
                        <Search
                            placeholder="请输入房源编码"
                            onSearch={function (keyword) {
                                that.handleInputSearch(keyword)
                            }}
                            enterButton
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="租赁方式"
                >
                    {getFieldDecorator('rentType', {
                        rules: [{
                            required: true
                        }],
                        initialValue: '0'
                    })(
                        <Radio.Group>
                            <Radio value="0">整租</Radio>
                            <Radio value="1">合租</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
                <Row gutter={12}>
                    <Col span={8}>
                        <FormItem
                            {...{
                                labelCol: {
                                    xs: { span: 0 },
                                    sm: { span: 9 }
                                },
                                wrapperCol: {
                                    xs: { span: 24 },
                                    sm: { span: 15 }
                                }
                            }}
                            label="商家品牌"
                        >

                            {getFieldDecorator('companyBrand', {
                                rules: [{
                                    required: true, message: '请输入商家品牌'
                                }],
                                initialValue:'北京路客互联网科技有限公司'
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >

                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入'
                                }],
                                initialValue:'路客精品公寓'
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Form.Item label="房源基本信息" {...formItemLayout} colon={false}>
                </Form.Item>
                <Row gutter={12}>
                    <Col span={6}>
                        <FormItem
                            {...inlineFormItemLayout}
                            label="房源位置"
                        >
                            {getFieldDecorator('select', {
                                rules: [{ required: true, message: '请选择城市' }]
                            })(
                                <Select placeholder="请选择城市">
                                    {
                                        that.props.cityData && that.props.cityData.map((item, index) => {
                                            return (
                                                <Option value={item.value}>{item.text}</Option>
                                            )
                                        })

                                    }
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >
                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入房屋守则'
                                }],
                                initialValue:''
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={12}>
                            <Col span={24}>
                                <FormItem
                                    {...formItemLayout}
                                    label="小区地址："
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} offset={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                <Row gutter={12}>
                            <Col span={8}>
                                <FormItem
                                    {...{labelCol: {
                                            xs: { span: 24 },
                                            sm: { span: 12 }
                                        },
                                        wrapperCol: {
                                            xs: { span: 24 },
                                            sm: { span: 12 }
                                        }}}
                                    label="原始户型："
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                            <Option value="china">China</Option>
                                            <Option value="usa">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                            <Option value="china">China</Option>
                                            <Option value="usa">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                            <Option value="china">China</Option>
                                            <Option value="usa">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                            <Option value="china">China</Option>
                                            <Option value="usa">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                            <Option value="china">China</Option>
                                            <Option value="usa">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                <Row gutter={12}>
                            <Col span={6} offset={4}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >
                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input addonAfter={"㎡"} addonBefore={"整屋建筑面积"}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input addonAfter={"㎡"} addonBefore={"整屋建筑面积"}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    {...noLabelFormItemLayout}
                                >

                                    {getFieldDecorator('housingCode', {
                                        rules: [{
                                            required: true, message: '请输入房屋守则'
                                        }],
                                        initialValue:''
                                    })(
                                        <Input addonAfter={"㎡"} addonBefore={"整屋建筑面积"}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                <Row>
                            <FormItem
                                {...formItemLayout}
                                label="是否改造："
                            >
                                {getFieldDecorator('radio-group', {
                                    rules: [{
                                        required: true, message: '请输入房屋守则'
                                    }]
                                })(
                                    <Radio.Group>
                                        <Radio value="a">户型未改造</Radio>
                                        <Radio value="b">户型改造过<span>注：为避免误伤为问题房源，如户型改造过请如实填写</span></Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>

                        </Row>
                {form.getFieldValue('radio-group') === "b" ? (
                    <Row gutter={12}>
                        <Col span={4} offset={4}>
                            <FormItem
                                {...noLabelFormItemLayout}
                            >

                                {getFieldDecorator('housingCode', {
                                    rules: [{
                                        required: true, message: '请输入房屋守则'
                                    }],
                                    initialValue:''
                                })(
                                    <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                        <Option value="china">China</Option>
                                        <Option value="usa">U.S.A</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                {...noLabelFormItemLayout}
                            >

                                {getFieldDecorator('housingCode', {
                                    rules: [{
                                        required: true, message: '请输入房屋守则'
                                    }],
                                    initialValue:''
                                })(
                                    <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                        <Option value="china">China</Option>
                                        <Option value="usa">U.S.A</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                {...noLabelFormItemLayout}
                            >

                                {getFieldDecorator('housingCode', {
                                    rules: [{
                                        required: true, message: '请输入房屋守则'
                                    }],
                                    initialValue:''
                                })(
                                    <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                        <Option value="china">China</Option>
                                        <Option value="usa">U.S.A</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <FormItem
                                {...noLabelFormItemLayout}
                            >

                                {getFieldDecorator('housingCode', {
                                    rules: [{
                                        required: true, message: '请输入房屋守则'
                                    }],
                                    initialValue:''
                                })(
                                    <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                        <Option value="china">China</Option>
                                        <Option value="usa">U.S.A</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                ) : null}
                <Form.Item
                    {...formItemLayout}
                    label="户型特点："
                >
                    {getFieldDecorator("checkbox-group", {
                        initialValue: ["A", "B"]
                    })(
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                <Col span={8}><Checkbox value="A">普通房屋</Checkbox></Col>
                                <Col span={8}><Checkbox value="B">半地下室</Checkbox></Col>
                                <Col span={8}><Checkbox value="C">全地下室</Checkbox></Col>
                            </Row>
                        </Checkbox.Group>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="房屋朝向："
                >
                    {getFieldDecorator("checkbox-group", {
                        initialValue: [1, 2]
                    })(
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                {[
                                    {val:0,text:'东'},
                                    {val:1,text:'东南'},
                                    {val:2,text:'南'},
                                    {val:3,text:'西南'},
                                    {val:4,text:'西'},
                                    {val:5,text:'西北'},
                                    {val:6,text:'北'},
                                    {val:7,text:'东北'}
                                ].map((item,key)=><Col key={key} span={3}><Checkbox value={item.val}>{item.text}</Checkbox></Col>)}
                            </Row>
                        </Checkbox.Group>
                    )}
                </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <FormItem
                            {...inlineFormItemLayout}
                            label="房屋配置："
                        >
                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入房屋守则'
                                }],
                                initialValue:''
                            })(
                                <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                    <Option value="china">China</Option>
                                    <Option value="usa">U.S.A</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >

                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入房屋守则'
                                }],
                                initialValue:''
                            })(
                                <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                    <Option value="china">China</Option>
                                    <Option value="usa">U.S.A</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...noLabelFormItemLayout}
                        >
                            {getFieldDecorator('housingCode', {
                                rules: [{
                                    required: true, message: '请输入房屋守则'
                                }],
                                initialValue:''
                            })(
                                <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                    <Option value="china">China</Option>
                                    <Option value="usa">U.S.A</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={4}><Row type={"flex"} justify="end">公共区域图片:</Row></Col>
                    <Col span={20}>
                        <Row gutter={12}>
                            {new Array(11).fill(1).map((val,key)=>(
                                <Col span={4} key={key}>
                                    <FormItem
                                        {...noLabelFormItemLayout}
                                    >
                                        {getFieldDecorator('avatar', {
                                            // initialValue: landlordInfo && landlordInfo.avatar,
                                            // rules: [{ required: true, message: '图标不能为空' }]
                                        })(
                                            <UploadImage
                                                imageUrlList={[]}
                                                imageLength={1}
                                                getImageInfo={this.getImageInfo }
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...noLabelFormItemLayout}
                                    >
                                        {getFieldDecorator('avatar', {
                                            rules: [{
                                                required: true, message: '请输入房屋守则'
                                            }],
                                            initialValue:''
                                        })(
                                            <Select placeholder="Please select a country" style={{ width: "100%" }}>
                                                <Option value="china">China</Option>
                                                <Option value="usa">U.S.A</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
                <Row type={"flex"} justify="space-around">
                    <Button onClick={this.props.onSubmitCb(this.getData())}>保存</Button>
                    <Button onClick={this.props.onCancel}>取消</Button>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(HandleHouseInfo)
