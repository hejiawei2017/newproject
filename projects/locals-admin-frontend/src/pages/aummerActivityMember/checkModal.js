import React, { Component } from 'react'
import { Modal, Row, Col, Radio, Card, Button, notification, DatePicker } from 'antd'
import { dataFormat, checkType } from '../../utils/utils'
import moment from 'moment'
import { aummerActivityService } from '../../services'
import { sexMap, memberLevelMap } from '../../utils/dictionary'
import { SubTable } from '../../components'
import './index.less'
const { RangePicker } = DatePicker;

const RadioGroup = Radio.Group
const format = "YYYY-MM-DD HH:mm"
class checkModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null
        }
    }
    onChange = (val) => {
        const {name,value} = val.target
        this.setState({
            [name]: value
        })
    }
    onPickerChange = (value, dateString) => {
        // console.log('onPickerChange', value,value[0].format(format), dateString)
        // const {name,value} = val.target
        this.setState({
            dateString: value
        })
    }
    cancelModal = () => {
        this.setState({conform: null,dateString: null})
        this.props.stateChange({editModalVisible: false})
    }
    submitModal = () => {
        let {exemptDepositId, conform: conform2, validTimeStart, validTimeEnd} = this.props.editFrom
        let {conform, dateString} = this.state

        if(checkType.isArray(dateString) && dateString.length > 0){
            validTimeStart = dateString[0].format("x")
            validTimeEnd = dateString[1].format("x")
        }else if(!(validTimeStart && validTimeEnd)){
            notification.error({
                message: '请选择减免有效期！'
            })
            return false
        }
        console.log(validTimeStart, validTimeEnd)
        conform = conform || conform2
        if(exemptDepositId && (conform === 0 || conform === 1)){
            const _this = this
            this.props.checkUserInfo({id: exemptDepositId, conform, validTimeStart, validTimeEnd},()=>{
                _this.setState({conform: null,dateString: null})
            })
        }else if(!exemptDepositId){
            notification.error({
                message: '该信息没有ID字段！'
            })
        }else if(!conform){
            notification.error({
                message: '请选择审核结果！'
            })
        }
    }
    getFooter = (dis) =>{
        const cancel = <Button onClick={this.cancelModal} key="modal-cancel-user-info">关闭</Button>
        const ok = <Button type="primary" onClick={this.submitModal} key="modal-ok-user-info">保存</Button>
        if(dis)return [cancel]
        return [cancel,ok]
    }
    render () {
        const _this = this
        const _state = this.state
        const {visible, editFrom, modalType} = this.props
        const {
            exemptDepositId,
            realName,
            userName,
            userId,
            memberCardCode,
            idCard,
            mobile,
            conform,
            sex,
            nickName,
            email,
            validTimeStart,
            validTimeEnd,
            createTime
        } = editFrom
        const startTime = validTimeStart ? moment(validTimeStart) : null
        const endTime = validTimeEnd ? moment(validTimeEnd) : null
        const labelSpan = {
            first: 3,
            last: 9
        }
        const columns = [{
            title: '订单编号',
            dataIndex: 'bookingNumber',
            width: 200
        }, {
            title: '房源名称',
            dataIndex: 'title',
            width: 150
        }, {
            title: '支付总金额',
            dataIndex: 'totalPrice',
            width: 150
        }, {
            title: '房费总金额',
            dataIndex: 'roomPrice',
            width: 150
        }, {
            title: '平台服务费',
            dataIndex: 'servicePrice',
            width: 150
        }, {
            title: '优惠券减免',
            dataIndex: 'discountPrice',
            width: 150
        }, {
            title: '保证金减免',
            dataIndex: 'depositDiscountPrice',
            width: 150
        }, {
            title: '会员折扣',
            dataIndex: 'memberDiscount',
            width: 150
        }, {
            title: '清洁费',
            dataIndex: 'clearPrice',
            width: 150
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getBookingDetails,
            getTableServiceData: userId,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "bookingId"
        }
        const disabled = (!(exemptDepositId > 0)) || modalType === 'readOnly'
        console.log(disabled,exemptDepositId,modalType)
        return (
            <Modal
                title="用户信息"
                visible={visible}
                okText="保存"
                cancelText="取消"
                width="860px"
                className="aummer-activity-userInfo-modal"
                onCancel={this.cancelModal}
                onOk={this.submitModal}
                footer={this.getFooter(disabled)}
            >
                <Card>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            用户名：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {userName}
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            姓名：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {realName}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            用户ID：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {userId}
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            性别：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {sexMap[sex]}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            身份证号：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {idCard}
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            手机号码：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {mobile}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            生日：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {(idCard && typeof idCard === "string") && (idCard.substr(6,8).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"))}
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            微信昵称：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {nickName}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            邮箱地址：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {email}
                        </Col>
                    </Row>
                </Card>
                <Card title="账号信息" type="inner">
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            会员等级：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {memberLevelMap[memberCardCode]}
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            注册时间：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {dataFormat(createTime)}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            保证金减免：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            <RadioGroup name="conform" onChange={this.onChange} value={(_state.conform === 0 || _state.conform === 1) ? _state.conform : conform} disabled={disabled}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            减免有效期：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            <RangePicker
                                style={{width:300}}
                                size="small"
                                showTime={{ format: 'HH:mm' }}
                                format={format}
                                placeholder={['开始时间', '结束时间']}
                                value={_state.dateString || [startTime, endTime]}
                                onChange={this.onPickerChange}
                                disabled={disabled}
                            />
                        </Col>
                    </Row>
                </Card>
                <Card title="订单记录" type="inner">
                    <SubTable
                        {...subTableItem}
                    />
                </Card>
            </Modal>
        )
    }
}
export default checkModal