import React, { Component } from 'react'
import { Modal, Row, Col, Radio, Card, Input, Button, notification } from 'antd'
import { getNewImagePrefix } from '../../utils/utils'
import './index.less'

const RadioGroup = Radio.Group

class checkModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            reason: ''
        }
    }
    onChange = (val) => {
        const {name,value} = val.target
        this.setState({
            [name]: value
        })
    }
    cancelModal = () => {
        this.setState({conform: null, reason: ''})
        this.props.stateChange({editModalVisible: false})
    }
    submitModal = () => {
        const {id} = this.props.editFrom
        const {conform, reason} = this.state
        console.log({id, conform, reason})
        if(id && (conform === 0 || conform === 1)){
            this.setState({conform: null, reason: ''})
            this.props.checkUserInfo({id, conform, reason})
        }else if(!id){
            notification.error({
                message: '该信息没有ID字段！'
            })
        }else if(!conform){
            notification.error({
                message: '请选择审核结果！'
            })
        }
    }
    getFooter = () =>{
        const cancel = <Button onClick={this.cancelModal} key="modal-cancel-user-info">关闭</Button>
        const ok = <Button type="primary" onClick={this.submitModal} key="modal-ok-user-info">提交</Button>
        switch(this.props.editFrom.conform){
        case 0:
            return [cancel]
            break
        case 1:
            return [cancel]
            break
        default:
            return [cancel,ok]
            break
        }
    }
    render () {
        const _state = this.state
        const {visible, editFrom, modalType} = this.props
        const {realName, idCard, mobile, studentCardPicUrl, conform, reason} = editFrom
        return (
            <Modal
                title="用户信息"
                visible={visible}
                okText="提交"
                cancelText="取消"
                width="640px"
                className="aummer-activity-userInfo-modal"
                onCancel={this.cancelModal}
                onOk={this.submitModal}
                footer={this.getFooter()}
            >
                <Card>
                    <Row>
                        <Col className="gutter-row text-right" span={4}>
                            客户姓名：
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {realName}
                        </Col>
                        <Col className="gutter-row text-right" span={4}>
                            身份证号：
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {idCard}
                        </Col>
                    </Row>
                    <Row className="mt10">
                        <Col className="gutter-row text-right" span={4}>
                            手机号码：
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {mobile}
                        </Col>
                        <Col className="gutter-row text-right" span={4}>
                            年龄：
                        </Col>
                        <Col className="gutter-row" span={8}>
                            {idCard && (new Date().getFullYear() - idCard.substr(6,4))}
                        </Col>
                    </Row>
                </Card>
                <Card title="资料补充" type="inner">
                    <Row>
                        <Col className="gutter-row text-right" span={4}>
                            学生证照片：
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <img src={getNewImagePrefix(studentCardPicUrl)} alt="暂无图片" className="maxw100 maxheight200" />
                            {/* <a href={getNewImagePrefix(studentCardPicUrl)} target="_target">
                                <img src={getNewImagePrefix(studentCardPicUrl)} alt="暂无图片" className="maxw100 maxheight200" />
                            </a> */}
                        </Col>
                    </Row>
                </Card>
                <Card title="审核" type="inner">
                    <Row>
                        <Col className="gutter-row text-right" span={4}>
                            审核结果：
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <RadioGroup name="conform" onChange={this.onChange} value={(_state.conform === 0 || _state.conform === 1) ? _state.conform : conform} disabled={modalType === 'readOnly'}>
                                <Radio value={1}>符合</Radio>
                                <Radio value={0}>不符合</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row className="mt10">
                        <Col className="gutter-row text-right" span={4}>
                            审核结果：
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input name="reason" onChange={this.onChange} value={_state.reason || reason} readOnly={modalType === 'readOnly'} />
                        </Col>
                    </Row>
                </Card>
            </Modal>
        )
    }
}
export default checkModal