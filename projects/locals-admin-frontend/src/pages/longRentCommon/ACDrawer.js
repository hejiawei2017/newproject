import React, {Component} from 'react';
import { Row, Col, Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
class ACDrawer extends Component{
    constructor (props){
        super(props);
        this.state = {
            visible:false,
            title:"不通过原因",
            showPicture:false,
            picType:''
        };
    }
    handleOk=()=>{
        const {form} = this.props;
        console.log(form.getFieldValue('reason'));
        //todo add api cb
        this.hideModal();
    };
    handleCancel=()=>{
        this.hideModal();
    };
    handleSubmit=()=>{
        console.log(this.state);

    };
    hideModal=()=>{
        this.setState({
            visible:false
        })
    };
    showModal=()=>{
        this.setState({
            visible:true
        })
    };
    handleDisapproval=()=>{
        this.showModal()
    };
    renderPic=()=>{
        // todo add ui function
        return this.state.picType;
    };
    renderModal=()=>{
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 }
            }
        };
        return (
            <FormItem
                {...formItemLayout}
            >
                {getFieldDecorator('reason', {
                    rules: [{
                        required: true, message: '请输入不通过原因'
                    }],
                    initialValue:''
                })(
                    <TextArea rows={5} placeholder={'请输入不通过原因'}/>
                )}
            </FormItem>
        )
    };
    showPic=(type)=>{
        return () => {
            this.setState({
                showPicture:true,
                picType:type
            },()=>{
                console.log(this.state);
            })
        };
    };
    hidePic=()=>{
        this.setState({showPicture:false})
    };
    renderModify=({origin,ifModify,after})=>{
        if(origin !== after || ifModify){
            return (
                <div className="flex-inline">
                    <div className="del-red-line">{origin}</div>
                    &nbsp;
                    <div className="text-color-warning">{after}</div>
                </div>
            )
        }else {
            return origin
        }
    };
    render () {
        const {detailItem} = this.props;
        console.log(detailItem)
        let testText = '123'
        return <div>
            <Row type="flex" justify="space-between">
                <Col >
                    <b>{testText || 'test'}</b>
                </Col>
                <Col >
                    <div style={{marginRight:20}}>{testText}</div>
                </Col>
            </Row>
            <hr />
            <div>
                <Row>
                    <Col span={10}>
                        <div>房源编码：{testText}</div>
                    </Col>
                    <Col span={10} push={4}>
                        <div>贝壳房屋信息ID：{testText}</div>
                    </Col>
                </Row>
                <div>小区地址：{testText}</div>
                <div>房源位置：{testText}</div>
            </div>
            <hr />
            <div>
                <div ><b>整屋信息</b></div >
                <div >户型：{testText}2室1厅1厨1卫 | 25/25层</div >
                <div >房屋朝向：{this.renderModify({origin:testText,ifModify:true,after:testText})}</div >
                <div >面积：{testText}125㎡</div >
                <div >经营状态：{testText}不可租</div >
                <div >长租状态：{testText}未上架</div >
                <div >可看时间：{testText}提前预约可看房</div >
                <div >户型特点：{testText}普通房屋</div >
                <div >
                    公共区图片：{testText}12张
                    &nbsp;&nbsp;
                    <Button
                        onClick={this.showPic('public')}
                    >查看</Button>
                </div >
                <div >整屋配置：{testText}集中供暖 | 精装修 | 无车位</div >
            </div>
            <hr />
            <div>
                <div ><b>出租单元信息</b></div >
                <div >经营状态：不可租{testText}</div >
                <div >长租状态：未上架{testText}</div >
                <div >可看时间：提前预约可看房{testText}</div >
                <div >可入住时间：2019-01-01{testText}   租期：1个月 - 6个月{testText}</div >
                <div >租客要求：爱干净、不吸烟{testText}</div >
                <div >是否收取中介费：不收{testText}</div >
                <div >服务内容：免费维修{testText}</div >
                <div >长租租金：8000元/月 | 押一付三 | 服务费200 元(每月）{testText}</div >
                <div >房源设施：床品齐全、油烟机、燃气灶、智能锁、衣柜、书桌、天然气、电视、冰箱、洗衣机、空调、热水器{testText}</div >
                <div >
                    房源图片：{testText}12张
                    &nbsp;&nbsp;
                    <Button
                        onClick={this.showPic('source')}
                    >查看</Button>
                </div >
                <div >联系人：郑州席悦 18860352942{testText}</div >
            </div>
            <hr />
            <div>
                <div ><b>审批结果</b></div >
                <div>{testText}</div>
            </div>
            <hr />
            <div>
                <Row type="flex" justify="space-between">
                    <Col >
                        <div>提交时间：{testText}</div>
                    </Col>
                    <Col >
                        <div>
                            <Button
                                onClick={this.handleSubmit}
                            >
                                审批通过
                            </Button >
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                onClick={this.handleDisapproval}
                            >
                                不通过
                            </Button >
                        </div>
                    </Col>
                </Row>
            </div>
            <Modal
                title={this.state.title}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                {this.renderModal()}
            </Modal>
            <Modal
                visible={this.state.showPicture}
                onCancel={this.hidePic}
                footer={null}
            >
                {this.renderPic()}
            </Modal>
        </div>;
    }
}
export default Form.create()(ACDrawer);
