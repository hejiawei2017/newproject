import React, {PureComponent, Fragment} from 'react'
import {Modal, Form, Row, Col, Input, Button, Radio, InputNumber, Popconfirm, message, Checkbox } from 'antd'
import moment from 'moment'
import PropTypes from "prop-types";
import {dataFormat} from "../../utils/utils";
import {imManagement} from "../../services";

const FormItem = Form.Item
const defaultSpan = {
    span: 12
}
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 10}
    }
}

class DiscountsModal extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            bookingDetail: {},
            disabled: true
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount () {
        this.loadBookingDetailPlus(this.props.checkedOrder.id)
    }
    loadBookingDetailPlus (id) {
        imManagement.findBookingDetailByBookingIdPlus(id).then((data) => {
            let outDate = dataFormat(data.checkoutDate, 'DD')
            let inDate = dataFormat(data.checkinDate, 'DD')
            let day = parseInt(outDate, 0) - parseInt(inDate, 0)
            data.day = day
            this.setState({
                bookingDetail: data
            })
        })
    }
    onSubmit = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            this.props.onSubmit(error, values)
        })
    }
    render () {
        const self = this
        const {visible, onCancel, checkedOrder} = this.props
        const {bookingDetail} = this.state
        const {getFieldDecorator} = this.props.form
        return (
            <Modal
                title="特别优惠"
                visible={visible}
                width="500px"
                onCancel={onCancel}
                onOk={self.onSubmit}
                destroyOnClose
            >
                <Form>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="入住时间"
                            >
                                {dataFormat(checkedOrder.checkinDate,'YYYY年MM月DD日')}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="退房时间"
                            >
                                {dataFormat(checkedOrder.checkoutDate,'YYYY年MM月DD日')}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label={(bookingDetail.day || '') + '晚房费'}
                            >
                                {getFieldDecorator('roomPrice', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入房费'
                                        },
                                        {
                                            validator (rule, value, callback) {
                                                let num = parseInt(value, 0)
                                                if(num < 100){
                                                    callback('房费不可小于100')
                                                }
                                                callback()
                                            }
                                        }
                                    ],
                                    initialValue: bookingDetail ? bookingDetail.roomPrice : 100
                                })(
                                    <InputNumber precision={2}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label = "免清洁费"
                            >
                                {getFieldDecorator('noCleanFee', {
                                    initialValue: false
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label = "免保证金"
                            >
                                {getFieldDecorator('noDeposit', {
                                    initialValue: false
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
DiscountsModal.defaultProps = {
    title: '默认操作',
    couponDetail: null
}

DiscountsModal.propTypes = {
    couponDetail: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string
}

DiscountsModal = Form.create()(DiscountsModal)

export default DiscountsModal
