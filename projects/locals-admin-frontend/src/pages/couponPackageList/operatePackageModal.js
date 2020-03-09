import React, {PureComponent, Fragment} from 'react'
import {
    Table,
    Modal,
    Form,
    Row,
    Col,
    Input,
    Button,
    Radio,
    InputNumber,
    Select,
    Popconfirm,
    message,
    DatePicker
} from 'antd'
import PropTypes from 'prop-types'
import {dataFormat} from '../../utils/utils'
import moment from 'moment'
import {giftPacksService, couponService} from '../../services'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const { TextArea } = Input
const {RangePicker} = DatePicker;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
    }
}
const formItemInlineLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
    }
}
const footerRadio = {
    labelCol: {
        sm: {span: 6}
    },
    wrapperCol: {
        sm: {span: 9}
    }
}
const defaultSpan = {
    span: 13
}

class OperatePackageModal extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            behavior: 'add',
            isEdit: false,
            couponIdNeed: false,
            disabled: true,
            itemsList: [],
            itemId: '',
            cacheData:{}
        }
        this.onOk = this.onOk.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.itemId !== this.state.itemId) {
            this.setState({
                itemId: nextProps.itemId
            }, () => {
                this.getActivitie()
            })
        }
    }

    getActivitie = () => {
        const activityId = this.state.itemId;
        giftPacksService.getActivitie(activityId).then((data) => {
            this.setState({itemsList: data.itemList})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    }
    onCancel = () => {
        this.props.onCancel()
    }
    onOk = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            this.props.onSubmit(error, values, this.props.behavior)
        })
    }
    addNew = () => {
        const activityId = this.props.itemId;
        const couponId = this.props.form.getFieldValue("couponName");
        const couponQuantity = this.props.form.getFieldValue("couponQuantity");
        const params = {
            activityId: activityId,
            couponId: couponId,
            couponQuantity: couponQuantity
        }
        giftPacksService.postActivitieItem(params).then((data) => {
            if (data === 1) {
                message.success('新增成功')
                this.props.update(true)
                this.getActivitie()
            }
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    onDetele = (id) => () => {
        giftPacksService.deleteActivitieItem(id).then((data) => {
            if (data === 1) {
                message.success('删除成功')
                this.getActivitie()
            }
        }).catch(e => {
            message.error(e.errorDetail)
        })
    }
    changeToEdit = (record) =>() =>{
        this.setState({
            cacheData:record
        })
    }
    disabledDate = (current) => {
        return current < moment().startOf('day')
    }
    onSubmit = (id) => () =>{
        console.log(id)
        const couponQuantity = this.props.form.getFieldValue(`couponCount${id}`);
        const params = {
            id:id,
            couponQuantity:couponQuantity
        }
        giftPacksService.putActivitieItem(params).then((data)=>{
            if(data === 1){
                message.success('修改成功')
                this.setState({
                    cacheData:{}
                })
                this.getActivitie()
            }
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    renderFormItem = () => {
        const {getFieldDecorator} = this.props.form
        const {couponList, title, editContent} = this.props
        return (
            <div>
                {(title === '编辑活动' || title === '创建活动') &&
                <Fragment>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="活动名称"
                            >
                                {getFieldDecorator('activityName', {
                                    rules: [{
                                        required: true,
                                        message: '请输入活动名称'
                                    }],
                                    initialValue: editContent ? editContent.activityName : null
                                })(
                                    <Input placeholder="请输入活动名称"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="房东描述"
                            >
                                {getFieldDecorator('landlordDescription', {
                                    rules: [{
                                        required: false
                                    }],
                                    initialValue: editContent ? editContent.landlordDescription : null
                                })(
                                    <Input placeholder="请输入房东描述"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="活动发放数量"
                            >
                                {getFieldDecorator('activityQuantity', {
                                    rules: [{
                                        required: true,
                                        message: '请输入活动发放数量'
                                    }],
                                    initialValue: editContent ? editContent.activityQuantity : null
                                })(
                                    <Input placeholder="请输入活动发放数量"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="领取有效期"
                            >
                                {getFieldDecorator('time', {
                                    rules: [{type: 'array', required: true, message: '请选择时间'}],
                                    initialValue: editContent ? [moment(dataFormat(editContent.startTime)), moment(dataFormat(editContent.endTime))] : null
                                })(
                                    <RangePicker format={'YYYY/MM/DD'} disabledDate={this.disabledDate}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...footerRadio}
                                label="活动状态"
                            >
                                {getFieldDecorator('activityStatus', {
                                    initialValue: editContent ? editContent.activityStatus : 1
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>启用</Radio>
                                        <Radio value={0}>停用</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="活动介绍"
                            >
                                {getFieldDecorator('activityIntroduction', {
                                    rules: [{
                                        required: false
                                    }],
                                    initialValue: editContent ? editContent.activityIntroduction : null
                                })(
                                    <TextArea rows={4}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Fragment>}
                {title === '活动绑定优惠券' &&
                <Row gutter={6}>
                    <Col span={11}>
                        <FormItem
                            {...formItemInlineLayout}
                            label="优惠券名称"
                        >
                            {getFieldDecorator('couponName', {
                                initialValue: couponList.length > 0 ? couponList[0].id : null
                            })(
                                <Select>
                                    {couponList.map((item) => {
                                        return <Option value={item.id} key={item.id}>{item.couponName}-{item.description}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem
                            {...formItemInlineLayout}
                            label="优惠券数量"
                        >
                            {getFieldDecorator('couponQuantity', {
                                rules: [{
                                    required: true,
                                    message: '输入优惠券数量'
                                }],
                                initialValue: 1
                            })(
                                <InputNumber min={1} max={99999}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            style={{marginTop: 3}}
                            onClick={this.addNew}
                        >新增</Button>
                    </Col>
                </Row>}
            </div>
        )
    }
    renderTable = () => {
        const {itemsList,cacheData} = this.state
        const {getFieldDecorator} = this.props.form
        const columns = [{
            title: '优惠券兑换码',
            dataIndex: 'coupon.couponCode'
        }, {
            title: '优惠券名称',
            dataIndex: 'coupon.couponName'
        }, {
            title: '有效期',
            dataIndex: 'effectiveDays',
            render: (v, record) => {
                return (
                    <span>
                        {record.coupon.effectiveDays !== null ? `${record.coupon.effectiveDays}天` : `到${dataFormat(record.coupon.endTime)}`}
                    </span>
                )
            }
        }, {
            title: '券数量',
            dataIndex: 'couponQuantity',
            render: (count, record) => {
                if(cacheData.id === record.id){
                    return (
                        <span>
                        {getFieldDecorator(`couponCount${record.id}`, {
                        })(
                            <InputNumber min={1} max={99999} disabled={false}/>
                        )}
                    </span>
                    )
                }
                    return (
                            <InputNumber min={1} max={99999} disabled value={record.couponQuantity}/>
                    )

            }
        }, {
            title: '操作',
            dataIndex: 'action',
            render: (v, record) => {
                let commonBtn = {
                    className: 'mr-sm',
                    type: 'primary',
                    size: 'small'
                }
                return (
                    <Fragment>
                        <Popconfirm title="确认删除?" onConfirm={this.onDetele(record.id)} okText="确认" cancelText="取消">
                            <Button
                                {...commonBtn}
                            >删除</Button>
                        </Popconfirm>
                        {cacheData.id === record.id ?
                            <Button
                            {...commonBtn}
                            onClick={this.onSubmit(record.id)}
                            >
                            保存
                        </Button> :
                        <Button
                            {...commonBtn}
                            type={'default'}
                            onClick={this.changeToEdit(record)}
                        >
                            编辑
                        </Button>}
                    </Fragment>

                )
            },
            width: 200
        }]
        const pagination = {
            pageSize: 5
        }
        return (
            <Table
                columns={columns}
                dataSource={itemsList}
                rowKey={'id'}
                pagination={pagination}
            />
        )
    }
    renderFooter () {
        let footerList = [<Button key="btn1" onClick={this.onCancel}>关闭</Button>]
        if(this.props.behavior === 'add' || this.props.behavior === 'update'){
            footerList.push(<Button key="btn2" className="ant-btn-primary" onClick={this.onOk}>保存</Button>)
        }
        return footerList
    }
    render () {
        const {visible, title} = this.props
        return (
            <Modal
                title={title}
                visible={visible}
                footer={this.renderFooter()}
                width="840px"
                onCancel={this.onCancel}
                style={{top: 0}}
                destroyOnClose
            >
                <Form>
                    {this.renderFormItem()}
                </Form>
                {title === '活动绑定优惠券' && this.renderTable()}
            </Modal>
        )
    }
}

OperatePackageModal.defaultProps = {
    title: '默认操作',
    couponDetail: null
}

OperatePackageModal.propTypes = {
    couponDetail: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string
}

OperatePackageModal = Form.create()(OperatePackageModal)

export default OperatePackageModal
