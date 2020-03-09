import React, {Component} from 'react'
import { Modal, Row, Col } from 'antd'
import { dataFormat } from '../../utils/utils'

class DetailModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list: []
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.data) {
            this.showDetailModal(nextProps.data)
        }
        // console.log('批量--->', nextProps.visible)
    }
    handleCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.props.stateChange({detailType: false})
        })
    }
    showDetailModal = (record) => {
        const {
            isneedremake,
            wnership,
            status,
            createdhousesource,
            paytype,
            haselevator
        } = record
        record.isneedremake = (isneedremake === 0) ? '否' : '是'
        record.wnership = (wnership === 0) ? '自有' : '租赁'
        switch (status) {
            case -1:
            record.status = '已退回'
            break
            case 0:
            record.status = '待审核'
            break
            case 6:
            record.status = '草稿'
            break
            case 1:
            record.status = '已审核'
            break
            case 2:
            record.status = '已到账'
            break
            case 4:
            record.status = '已解约'
            break
            default: record.status = '已删除'
        }
        record.createdhousesource = (createdhousesource === 0) ? '否' : '是'
        record.paytype = (paytype === 0) ? '合作费' : '保证金'
        record.haselevator = (haselevator === 0) ? '否' : '是'
        this.renderModal(record)
    }
    renderModal = (detail) => {
        let list = [{
            key: '申报人',
            value: detail.createdby
        }, {
            key: '创建时间',
            value: dataFormat(detail.createdtime)
        }, {
            key: '合同地址',
            value: detail.remark
        }, {
            key: '打款金额',
            value: detail.amount
        }, {
            key: '确认到账金额',
            value: detail.checkamount
        }, {
            key: '城市名',
            value: detail.cityname
        }, {
            key: '银行卡号',
            value: detail.cmbaccountnumber
        }, {
            key: '合同编码',
            value: detail.contractnumber
        }, {
            key: '合同编号',
            value: detail.contractversion
        }, {
            key: '邮箱',
            value: detail.email
        }, {
            key: '合同管理协议合作时间 开始',
            value: dataFormat(detail.starttime)
        }, {
            key: '合同管理协议合作时间 结束',
            value: dataFormat(detail.endtime)
        }, {
            key: '上线时间',
            value: dataFormat(detail.entertime)
        }, {
            key: '面积',
            value: detail.housearea
        }, {
            key: '姓名',
            value: detail.houseownername
        }, {
            key: '房型',
            value: detail.housetype
        }, {
            key: '身份证',
            value: detail.idcard
        }, {
            key: '是否需要硬装',
            value: detail.isneedremake
        }, {
            key: '房东归属',
            value: detail.landlordtype
        }, {
            key: '手机',
            value: detail.linkphone
        }, {
            key: '预计上线时间',
            value: dataFormat(detail.onlinetime)
        }, {
            key: '房屋产权',
            value: detail.wnership
        }, {
            key: '打款人',
            value: detail.payer
        }, {
            key: '租赁开始',
            value: dataFormat(detail.rentingendtime)
        }, {
            key: '租赁结束',
            value: dataFormat(detail.rentingstarttime)
        }, {
            key: '报备人',
            value: detail.reportername
        }, {
            key: '区域',
            value: detail.secondparty
        }, {
            key: '签约人姓名',
            value: detail.signname
        }, {
            key: '审核状态',
            value: detail.status
        }, {
            key: '支付宝',
            value: detail.aliplayaccount
        }, {
            key: '招商银行账户',
            value: detail.cmbaccountowner
        }, {
            key: '房东信息来源',
            value: detail.houseownerchannel
        }, {
            key: '打款时间',
            value: dataFormat(detail.payertime)
        }, {
            key: '申报时间',
            value: dataFormat(detail.reportertime)
        }, {
            key: '是否已经创建房源',
            value: detail.createdhousesource
        }, {
            key: '租赁价格',
            value: detail.rentingprice
        }, {
            key: '房东编码',
            value: detail.membercode
        }, {
            key: '费用类型',
            value: detail.paytype
        }, {
            key: '备注',
            value: detail.remark
        }, {
            key: '计划表ID',
            value: detail.planid
        }, {
            key: '是否有电梯',
            value: detail.haselevator
        }]
        this.setState({
            list
        })
    }
    render () {
        const {
            list
        } = this.state
        const {
            visible
        } = this.props
        const leftCol = {
            align: 'right',
            span: 12
        }
        const rightCol = {
            span: 12
        }
        return (
            <Modal
                title="详情"
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
                style={{ top: 20 }}
            >
                {list.map(v=>(
                    <Row key={v.key}>
                        <Col {...leftCol}>{v.key}：</Col>
                        <Col {...rightCol}>{v.value}</Col>
                    </Row>
                ))}
            </Modal>
        )
    }
}

export default DetailModal