import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { formatMoney } from '../../utils/utils'

class EidtModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            modalData: {}
        }
    }
    componentDidMount () {
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.life) {
            this.setState({
                visible: nextProps.life
            })
        }
        if (nextProps.modalData) {
            this.setState({
                modalData: nextProps.modalData
            })
        }
    }
    hideModal = () => {
        this.setState({
            visible: false
        }, () => this.props.hideModal())
    }
    render () {
        const {
            visible,
            modalData
        } = this.state
        return (
            <Modal
                title="流程及票据"
                visible={visible}
                onCancel={this.hideModal}
                width={1050}
                footer={null}
                centered
            >
                <div className="journalModal">
                    <div className="journalModal__title head-between bb pb5">
                        <p>{modalData.typeAndSubject}</p>
                        <p>状态：已打款</p>
                    </div>
                    <div className="journalModal__info pb5 mt20">
                        <p>{modalData.title}</p>
                        <div className="head-between info-list mt20">
                            <div>
                                <p className="pb5">房源编码：{modalData.houseNo}</p>
                                <p>费用申报人：{modalData.submitter}</p>
                            </div>
                            <div>
                                <p className="pb5">房源地址：{modalData.address}</p>
                                <p>申报时间：{modalData.approveTime}</p>
                            </div>
                        </div>
                        <p className="total">
                            <span>费用总计：<i>{formatMoney(modalData.totalPrice)}</i> 元</span>
                        </p>
                    </div>
                    <div className="journalModal__record mt20">
                        <p className="bb pb5">流程记录</p>
                        <div className="mt20">
                            <p className="head-between">
                                <span>{modalData.accounting}（财务会计）</span>
                                <span>{modalData.paymentTime}</span>
                            </p>
                            <p className="record-msg">{modalData.accountingInfo}</p>
                        </div>
                        <div className="mt20">
                            <p className="head-between">
                                <span>{modalData.approver}（审批人）</span>
                                <span>{modalData.approveTime}</span>
                            </p>
                            <p className="record-msg">{modalData.approveInfo}</p>
                        </div>
                        <div className="mt20">
                            <p className="head-between">
                                <span>{modalData.submitter}（提交人）</span>
                                <span>{modalData.submitTime}</span>
                            </p>
                            <p className="record-msg">{modalData.submitInfo}</p>
                        </div>
                    </div>
                    <div className="mt20">
                        <Button className="mr10"><a href={modalData.attachmentPath}>下载附件</a></Button>
                        <Button><a href={modalData.invoicePath}>下载发票</a></Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default EidtModal