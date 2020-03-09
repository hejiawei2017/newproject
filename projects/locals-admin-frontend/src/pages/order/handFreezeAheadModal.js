import React, { Component } from 'react'
import { connect } from "react-redux"
import { Modal, Form, Input, Radio , Button, Divider, Col, message } from 'antd'
import './handFreezeAheadModal.less'
import { freezeServer } from '../../services'
import * as API from 'services'
const Fragment = React.Fragment

@connect(state => ({
    orderIdOrder: state.order.orderIdOrder
}))

@Form.create()

export default class haneFreezeDisplay extends Component {

    constructor (props) {
        super(props)
        this.state = {
            onSubStatus: false
        }
    }

    handleOk = e => {
        e.preventDefault()
        this.setState({
            onSubStatus: true
        })
        this.operaFreeze()
    }

    operaFreeze = () => {
        const { orderIdOrder } = this.props
        let obj = {
            reason: "",
            amount: 0
        };
        obj.tujiaOrderNo = orderIdOrder.apiOrderId;
        freezeServer.postFreezeStatus(obj).then((data)=>{
            console.log(data);
            this.setState({
                onSubStatus: false
            })
            this.showAfterConfirm()
        }).catch(err=>{
            message.error(JSON.stringify(err))
            this.setState({
                onSubStatus: false
            })
        })
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
        this.props.toggleHandleAheadModal()
        this.setState({
            onSubStatus: false
        })
    }

    render = () => {
        const { visible } = this.props
        const { onSubStatus } = this.state;
        return (
            <Modal
                width={340}
                className="handwork-order-modal"
                title={''}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName={'refund_modal'}
                footer={[
                    <div className="freezeFooter">
                        <Button key="submit" loading={onSubStatus} type="primary" onClick={this.handleOk}>
                            提交
                        </Button>
                        <Button key="back" onClick={this.handleCancel}>取消</Button>
                    </div>
                ]}
            > <div style={{padding: "10px 20px"}}>
                <p className="text-center aHeadText">是否确定要提前退保证金</p>
            </div>
            </Modal>
        )
    }
}