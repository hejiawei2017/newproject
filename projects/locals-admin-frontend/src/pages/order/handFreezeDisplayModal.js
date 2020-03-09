import React, { Component } from 'react'
import { Modal, Form, Input, Radio , Button, Divider, Col } from 'antd'
import './handFreezeDisplayModal.less'
import moment from 'moment'
import * as API from 'services'
const Fragment = React.Fragment

export default class haneFreezeDisplay extends Component {
    handleOk = e => {
        e.preventDefault()
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
        this.props.toggleHandleDisplayModal()
    }

    render = () => {
        const { visible, orderCostDetailView , freezeInfo } = this.props
        // console.log(freezeInfo,"freezeInfo")
        let { depositResult = "", disposeResult = "", disposeDate = "", prograss = "", amount = "" } = freezeInfo;
        disposeDate = moment(disposeDate).format("YYYY-MM-DD HH:mm:ss")
        return (
            <Modal
                width={360}
                className="handwork-order-modal"
                title={'冻结保证金'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName={'freeze_modal'}
                footer={null}
            > <div className="freezeBox">
                <p>冻结金额: { amount }</p>
                <p>冻结原因: { depositResult }</p>
                <p>冻结时间: { disposeDate }</p>
                <p>目前进度: <span className={ disposeResult === true ? 'text-color-warning' : 'text-color-green' }>{ disposeResult === true ? '审核成功' : '成功提交，进度可与途家客服确认' }</span></p>
            </div>
            </Modal>
        )
    }
}