import React, { Component } from 'react'
import { Modal, Row, Col, Radio, Card, DatePicker, Button, notification, Select, message } from 'antd'
import { dataFormat, checkType } from '../../utils/utils'
import moment from 'moment'
import {aummerActivityService, goodsListService, couponService} from '../../services'
import {orderService,maketService} from '../../services'
import { sexMap, memberLevelMap,mapVipType,couponDetailStatus,couponBtnStatus } from '../../utils/dictionary'
import { SubTable } from '../../components'
import './index.less'
import RankChangeRecord from './rankChangeRecord'
import GivingRecord from './givingRecord'
import EquityTimeline from './equityTimeline'

const Option = Select.Option;
const { RangePicker } = DatePicker;

const RadioGroup = Radio.Group
const format = "YYYY-MM-DD HH:mm"
class checkModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null,
            rankChangeRecordVisible:false,
            consumptionVisible:false,
            topupVisible:false,
            givingVisible:false,
            couponSearchFields:{
                mobile: "",
                couponState: 0
            }
        }
    }
    componentDidMount (){
        let setData = this.state.couponSearchFields
        setData.mobile = this.props.editFrom.mobile
        if(setData.mobile !== ""){
            this.setState({
                couponSearchFields: setData
            })
        }
    }
    oprationRank = () =>{
        this.props.changRank(this.props.editFrom)
    }
    onChange = (val) => {
        const {name,value} = val.target
        this.setState({
            [name]: value
        })
    }
    onPickerChange = (value, dateString) => {
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
                message: '该信息没有保证金ID字段！'
            })
        }else if(!conform){
            notification.error({
                message: '请选择审核结果！'
            })
        }
    }
    equityRecord = () => {
        this.setState({
            equityTimelineVisible:true
        })
    }
    rankChangeRecord = () =>{
        this.setState({
            rankChangeRecordVisible:true
        })
    }
    consumptionRecord = () =>{
        this.setState({
            consumptionVisible:true
        })
    }
    topupRecord = () =>{
        this.setState({
            topupVisible:true
        })
    }
    givingRecord = () =>{
        this.setState({
            givingVisible:true
        })
    }
    equitySubmitModal = () =>{
        this.setState({
            equityTimelineVisible:false
        })
    }
    equityCancelModal = () =>{
        this.setState({
            equityTimelineVisible:false
        })
    }
    rankSubmitModal = () =>{
        this.setState({
            rankChangeRecordVisible:false
        })
    }
    rankCancelModal = () =>{
        this.setState({
            rankChangeRecordVisible:false
        })
    }
    consumptionSubmitModal = () =>{
        this.setState({
            consumptionVisible:false
        })
    }
    consumptionCancelModal = () =>{
        this.setState({
            consumptionVisible:false
        })
    }
    topupSubmitModal = () =>{
        this.setState({
            topupVisible:false
        })
    }
    topupCancelModal = () =>{
        this.setState({
            topupVisible:false
        })
    }
    givingSubmitModal = () =>{
        this.setState({
            givingVisible:false
        })
    }
    givingCancelModal = () =>{
        this.setState({
            givingVisible:false
        })
    }
    couponHandleChange = (value) =>{
        let setData = {
            mobile: this.state.couponSearchFields.mobile
        }
        if(value.key !== ""){
            setData.couponState = value.key
        }
        if(setData.mobile !== ""){
            this.setState({
                couponSearchFields: setData
            },this.couponTableThis.getTableRender)
        }
    }
    //获取第三方订单编号
    getD3OrderNo = (value,list,_this) => {
        aummerActivityService.getOrderNo(value).then(res => {
            list.forEach(item => {
                if(item.fromOrderCode === value) {
                    if(!!res) {
                        item.randomId = res.randomId
                    }
                }
            })
            _this.couponTableThis.setState({dataSource:list})
        })
    }
    getSubTableDataSource = (dataSource) => {
        dataSource.forEach(item => {
            if(item.fromOrderCode && item.fromOrderCode.length === 19) {
                this.getD3OrderNo(item.fromOrderCode,dataSource,this)
            }
        })
    }
    couponTakeEffect = (id) => {
        couponService.takeEffect(id).then(() => message.success('成功生效'))
    }
    render () {
        const _this = this
        const _state = this.state
        const {editFrom, modalType} = this.props
        const disabled = modalType === 'readOnly'
        const {
            exemptDepositId,
            realName,
            username,
            userId,
            memberCardCode,
            idCard,
            mobile,
            isExemptDeposit,
            sex,
            nickName,
            email,
            validTimeStart,
            validTimeEnd,
            vipType,
            vipValidTimeStart,
            vipValidTimeEnd,
            companyEmail,
            companyTaxpayerId,
            companyCity,
            companyName,
            createTime
        } = editFrom
        const startTime = validTimeStart ? moment(validTimeStart) : null
        const endTime = validTimeEnd ? moment(validTimeEnd) : null
        const labelSpan = {
            first: 3,
            last: 9
        }
        const columns = [{
            title: '行程编号',
            dataIndex: 'randomId',
            width: 150
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
            title: '预订服务费',
            dataIndex: 'servicePrice',
            width: 150
        }, {
            title: '优惠券减免',
            dataIndex: 'discountPrice',
            width: 150
        }, {
            title: '保证金减免',
            dataIndex: 'specialNoDepositPriceFlag',
            width: 150,
            render: (v) =>{
                if(v === 1){
                    return '是'
                }else{
                    return '否'
                }
            }
        }, {
            title: '会员折扣',
            dataIndex: 'memberDiscount',
            width: 150
        }, {
            title: '清洁费',
            dataIndex: 'clearPrice',
            width: 150
        }]
        const vouchersColumns = [{
            title: '优惠券ID',
            dataIndex: 'id',
            width: 150,
            render: (text, record) => (
                <span>
                    {record.id}
                </span>
            )
        }, {
            title: '优惠券名称',
            dataIndex: 'memberDiscount',
            width: 150,
            render: (text, record) => (
                <span>
                    {record.coupon.couponName}
                </span>
            )
        }, {
            title: '领取时间',
            dataIndex: 'createTime',
            width: 150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '有效期',
            dataIndex: 'startTime',
            width: 150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '过期时间',
            dataIndex: 'endTime',
            width: 150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '订单编码',
            dataIndex: 'orderCode',
            width: 150
        }, {
            title: '券状态',
            dataIndex: 'couponState',
            width: 150,
            render: (text, record) => (
                <span>
                    {couponDetailStatus[record.couponState]}
                </span>
            )
        }]
        const marketColumns = [{
            title: '用户ID',
            dataIndex: 'userId',
            width: 150
        }, {
            title: '真实姓名',
            dataIndex: 'realName',
            width: 150
        }, {
            title: '用户名',
            dataIndex: 'username',
            width: 150
        }, {
            title: '性别',
            dataIndex: 'sex',
            width: 150,
            render: (v) =>{
                if(v === 1){
                    return '男'
                }else if(v === 0){
                    return '女'
                }else{
                    return '未知'
                }
            }
        }, {
            title: '微信昵称',
            dataIndex: 'nickName',
            width: 150
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            width: 150
        }, {
            title: '注册时间',
            dataIndex: 'registerTime',
            width: 150,
            render:  val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '会员等级',
            dataIndex: 'memberCardName',
            width: 150
        }, {
            title: '权益标签',
            dataIndex: 'vipType',
            width: 150,
            render: (v) =>{
                if(v === 1){
                    return '个人商旅'
                }else{
                    return '企业商旅'
                }
            }
        }, {
            title: '渠道',
            dataIndex: 'platform',
            width: 150,
            render: (v) =>{
                if(v === 1){
                    return '预订app'
                }else if(v === 2){
                    return '预订小程序'
                }else if(v === 3){
                    return 'H5'
                }else if(v === 4){
                    return 'pc官网'
                }else if(v === 5){
                    return '途家'
                }else if(v === 6){
                    return 'airbnb'
                }else if(v === 7){
                    return '飞猪'
                }else if(v === 8){
                    return 'booking'
                }else if(v === 11){
                    return '公众号'
                }else if(v === 99){
                    return '其他'
                }
            }
        }]
        const marketTableItem = {
            getTableService: maketService.getDnUser,
            searchFields: {upperId:this.props.editFrom.userId},
            columns: marketColumns,
            pageSize: 5,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id"
        }
        const subTableItem = {
            getTableService: orderService.getOrderList,
            searchFields: {bookingMemberMobile:mobile,statusNotEqual: 0},
            columns: columns,
            pageSize: 5,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id"
        }
        const couponSubTableItem = {
            getTableService: aummerActivityService.getCouponList,
            columns: vouchersColumns,
            pageSize: 10,
            refsTab: function (ref) {
                _this.couponTableThis = ref
            },
            setDataSource: this.getSubTableDataSource,
            rowKey: "id",
            antdTableProps: {
                bordered: true
            },
            searchFields: _state.couponSearchFields,
            operatBtn: [
                {
                    label: 'delete',
                    size: "small",
                    type: "primary",
                    className: 'mr10',
                    disabled,
                    onClick: record => {
                        return couponService.deleteRecord(record.id)
                    },
                    text: '删除'
                },
                {
                    label: 'button',
                    size: "small",
                    type: "primary",
                    disabled,
                    onClick: record => {
                        _this.couponTakeEffect(record.id)
                    },
                    text: '立即生效'
                }
            ]
        }
        const depositDisabled = (!(exemptDepositId > 0)) || modalType === 'readOnly'
        return (
            <div>
                <div>
                    <Card title="基本信息" type="inner">
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                用户名：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {username}
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
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                护照号：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}></Col>
                        </Row>
                    </Card>
                    <Card title="账号信息" type="inner"
                        extra={
                            <div>
                                <Button className="conBtn" onClick={_this.oprationRank} disabled={disabled}>升/降</Button>
                                <Button className="conBtn" onClick={_this.rankChangeRecord}>等级变更</Button>
                            </div>
                        }
                    >
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
                                <RadioGroup name="conform" onChange={_this.onChange} value={(_state.isExemptDeposit === 0 || _state.isExemptDeposit === 1) ? _state.isExemptDeposit : isExemptDeposit} disabled={depositDisabled}>
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
                                    onChange={_this.onPickerChange}
                                    disabled={depositDisabled}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                权益标签：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {mapVipType[vipType]}
                            </Col>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                标签有效期：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                <div onClick={_this.equityRecord} className="blue">
                                    <span>{vipValidTimeStart ? dataFormat(vipValidTimeStart) + '~' : ''}</span>
                                    <span>{vipValidTimeEnd ? dataFormat(vipValidTimeEnd) : ''}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                企业邮箱：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {companyEmail}
                            </Col>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                所在城市：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {companyCity}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                对应公司纳税号：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {companyTaxpayerId}
                            </Col>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                所属公司：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}>
                                {companyName}
                            </Col>
                        </Row>
                    </Card>
                    <Card title="账户信息" type="inner"
                        extra={
                            <div>
                                {/* <Button className="conBtn" onClick={this.consumptionRecord}>消费记录</Button>
                                <Button className="conBtn" onClick={this.topupRecord}>充值记录</Button> */}
                                <Button className="conBtn" onClick={this.givingRecord}>赠送记录</Button>
                            </div>
                        }
                    >
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                账户总余额：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}></Col>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                充值余额：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}></Col>
                        </Row>
                        <Row>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                赠送余额：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}></Col>
                            <Col className="gutter-row text-right" span={labelSpan.first}>
                                其他余额：
                            </Col>
                            <Col className="gutter-row" span={labelSpan.last}></Col>
                        </Row>
                    </Card>
                    <Select labelInValue defaultValue={{ key: couponBtnStatus[0] }} className={"couponBtn"} onChange={this.couponHandleChange}>
                        {function (){
                            let optionList = []
                            for(let i in couponBtnStatus){
                                optionList.push(<Option key={i} value={i}>{couponBtnStatus[i]}</Option>)
                            }
                            return optionList
                        }()}
                    </Select>
                    <Card title="券统计" type="inner">
                        <SubTable
                            {...couponSubTableItem}
                        />
                    </Card>
                    <Card title="订单记录" type="inner">
                        <SubTable
                            {...subTableItem}
                        />
                    </Card>
                    <Card title="分销系统•下级用户" type="inner">
                        <SubTable
                            {...marketTableItem}
                        />
                    </Card>
                </div>
                <Modal
                    title="等级变更记录"
                    visible={_state.rankChangeRecordVisible}
                    width="860px"
                    className="aummer-activity-userInfo-modal"
                    onCancel={this.rankCancelModal}
                    onOk={this.rankSubmitModal}
                    okText=""
                    cancelText=""
                >
                    <RankChangeRecord
                        editFrom={editFrom}
                        modalType={modalType}
                    />
                </Modal>
                <Modal
                    title="权益时间线"
                    visible={_state.equityTimelineVisible}
                    width="860px"
                    className="aummer-activity-userInfo-modal"
                    onCancel={this.equityCancelModal}
                    onOk={this.equitySubmitModal}
                    okText=""
                    cancelText=""
                >
                    <EquityTimeline
                        editFrom={editFrom}
                        modalType={modalType}
                    />
                </Modal>
                {/* <Modal
                    title="消费记录"
                    visible={_state.consumptionVisible}
                    width="860px"
                    className="aummer-activity-userInfo-modal"
                    onCancel={this.consumptionCancelModal}
                    onOk={this.consumptionSubmitModal}
                >
                    <ConsumptionRecord
                        editFrom={editFrom}
                        modalType={modalType}
                    />
                </Modal>
                <Modal
                    title="充值记录"
                    visible={_state.topupVisible}
                    width="860px"
                    className="aummer-activity-userInfo-modal"
                    onCancel={this.topupCancelModal}
                    onOk={this.topupSubmitModal}
                >
                    <TopupRecord
                        editFrom={editFrom}
                        modalType={modalType}
                    />
                </Modal> */}
                <Modal
                    title="返现记录"
                    visible={_state.givingVisible}
                    width="860px"
                    className="aummer-activity-userInfo-modal"
                    onCancel={this.givingCancelModal}
                    onOk={this.givingSubmitModal}
                >
                    <GivingRecord
                        editFrom={editFrom}
                        modalType={modalType}
                    />
                </Modal>
                <div className="ply-btn">
                    <Button onClick={this.submitModal} type="primary" disabled={disabled}>保存</Button>
                    <Button
                        style={{
                            marginRight: 8
                        }}
                        onClick={this.cancelModal}
                        disabled={disabled}
                    >
                        取消
                    </Button>
                </div>
            </div>
        )
    }
}
export default checkModal
