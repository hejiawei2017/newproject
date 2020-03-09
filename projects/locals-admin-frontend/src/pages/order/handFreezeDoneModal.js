import React, { Component } from 'react'
import { Modal, Form, Input, Radio , Button, Divider, Col } from 'antd'
import './handFreezeDoneModal.less'
import moment from 'moment'
import * as API from 'services'
const Fragment = React.Fragment
export default class haneFreezeDisplay extends Component {
    handleOk = e => {
        e.preventDefault()
        this.confirmApproval()
    }

    confirmApproval = () => {

    }

    operaFreeze = (values) => {
        // API.orderService.changeDate(values)
        // .then(() => {
        //     this.showAfterConfirm()
        // })
        this.showAfterConfirm()
    }

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '操作成功！',
            onOk: () => {
                this.handleCancel()
                modal.destroy()
            }
        })
    }

    handleCancel = () => {
        this.props.toggleHandleDoneModal()
    }

    render = () => {
        const { visible, form, refundInfo } = this.props
        let { disposeDate, prograss, chargeStatus } = refundInfo
        disposeDate = moment(disposeDate).format("YYYY-MM-DD HH:mm:ss")
        return (
            <Modal
                width={360}
                title={'提前退保证金'}
                className="handwork-order-modal"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName={'refund_info_modal'}
                footer={null}
            > <div style={{padding: "10px 0px"}}>
                <p className="aHeadText">申请时间: {disposeDate}</p>
                <p className="aHeadText">状态: {chargeStatus === 1 ? "成功" : ""}</p>
            </div>
            </Modal>
        )
    }
}