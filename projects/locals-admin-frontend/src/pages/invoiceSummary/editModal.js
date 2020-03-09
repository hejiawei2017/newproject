import React, { Component } from 'react'
import { Modal, Row, Col, Icon, Tooltip} from 'antd'

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            editModalVisible: true,
            invoiceInfo: null
        }
        this.onModalOk = this.onModalOk.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
        this.getType = this.getType.bind(this)
    }
    componentDidMount () {
        // console.log('editform-->', this.props._data)
    }
    onModalOk () {
        this.setState({
            editModalVisible: false
        }, this.props.stateChange({editModalVisible: false}))
    }
    getType (val) {
        switch (val) {
        case 1:
            return '电子普通发票'
        case 2:
            return '纸质普通发票'
        case 3:
            return '专用票'
        default: return ''
        }
    }
    renderTitle () {
        let _props = this.props._data
        if (this.state.titleType === 1) {
            return (
                <div>
                    <Row className="pt5">
                        <Col span={12}>发票类型：{this.getType(_props.detail.invoiceType)}</Col>
                        <Col span={12}>收件人：{_props.detail.username}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>抬头类型：个人</Col>
                        <Col span={12}>联系电话：{_props.detail.phoneNumber}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>发票抬头：{_props.detail.titleName}</Col>
                        <Col span={12}>邮寄地址：{_props.detail.address}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>电子邮箱：{_props.detail.email}</Col>
                    </Row>
                </div>
            )
        } else {
            return (
                <div>
                    <Row className="pt5">
                        <Col span={12}>发票类型：{this.getType(_props.detail.invoiceType)}</Col>
                        <Col span={12}>电子邮箱：{_props.detail.email}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>抬头类型：{(_props.detail.titleType === 1) ? '个人' : '企业'}</Col>
                        <Col span={12}>收件人：{_props.detail.username}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>发票抬头：{_props.detail.titleName}</Col>
                        <Col span={12}>联系电话：{_props.detail.phoneNumber}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>纳税人识别号：{_props.detail.taxCode}</Col>
                        <Col span={12}>邮寄地址：{_props.detail.address}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>公司注册地址：{_props.detail.registeredAddress}</Col>
                        <Col span={12}>公司注册电话：{_props.detail.registeredAddress}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>开户银行：{_props.detail.depositBank}</Col>
                        <Col span={12}>银行账号：{_props.detail.bankAccount}</Col>
                    </Row>
                </div>
            )
        }
    }
    getContent () {
        let _props = this.props._data
        return (
            <div>
                <div className="bb pb5">
                    <Row className="fs15">订单信息</Row>
                    <Row className="pt5">
                        <Col span={12}>姓名：{_props.detail.username}</Col>
                        <Col span={12}>手机号码：{_props.detail.registeredPhoneNum}</Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>订单编号：{_props.detail.tripCode}</Col>
                    </Row>
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15">订单信息</Row>
                    {this.renderTitle()}
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15">费用信息</Row>
                    <Row className="pt5">
                        <Col span={12}>
                            <Tooltip placement="top" title={'开票金额=预定总费用（已包含发票服务费）'}>
                                开票金额（预订总费用） <Icon type="exclamation-circle-o" /> ：{_props.detail.orderPrice}
                            </Tooltip>
                        </Col>
                        <Col span={12}>
                            <Tooltip placement="top" title={'发票服务费=(房费总价格+清洁费-会员折扣-优惠卷减免金额)*0.06'}>
                                发票服务费： <Icon type="exclamation-circle-o" />：{_props.detail.servicePrice}
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row className="pt5">
                        <Col span={12}>
                            <Tooltip placement="top" title={'剩余开票金额=原预订总费用-退还房费-退还清洁费-退还发票服务费'}>
                                剩余开票金额 <Icon type="exclamation-circle-o" />：{_props.detail.surplusInvoicePrice}
                            </Tooltip>
                        </Col>
                    </Row>
                </div>
                <div className="mt10 bb pb5">
                    <Row className="fs15 pt5">电子发票</Row>
                    <Row>地址：<a href={_props.detail.url} target="view_window">{_props.detail.url}</a></Row>
                </div>
                <div className="mt10">
                    <Row className="fs15 pt5">快递单</Row>
                    <Row className="pt5">
                        <Col span={12}>快递单号：{_props.detail.expressNumber}</Col>
                    </Row>
                </div>
            </div>
        )
    }
    render () {
        let _state = this.state
        return (
            <Modal
                visible={_state.editModalVisible}
                title="详情"
                width={800}
                onOk={this.onModalOk}
                onCancel={this.onModalOk}
                cancelText="取消"
                okText="确定"
                style={{ top: 20 }}
                footer={null}
            >{this.getContent()}
            </Modal>
        )
    }
}

export default EditModal