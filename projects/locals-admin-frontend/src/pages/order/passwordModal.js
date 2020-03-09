import React, { Component } from 'react'
import {Modal, Drawer, Table, message, Select, Button, Row, Col, Spin} from 'antd'
import {connect} from "react-redux";
import {orderService, weixinTemplateMessageService} from '../../services'
import {checkKey} from "../../utils/utils";
import moment from 'moment';

const Option = Select.Option;
@connect(state => ({
    currentOrder: state.order.currentOrder
}))
class PasswordModal extends Component {
    constructor (props) {
        super(props)
        this.lastFetchId = 0;
        this.state = {
            searchRoomVisible: false,
            loading : true,
            houseNo: '',
            roomName: '',
            orderLotels: [],
            roomData: [],
            roomValue: [],
            roomFetching: false
        }
    }
    componentDidMount () {
        this.renderTable()
    }
    renderTable = () => {
        this.setState({
            loading : true
        })
        const { bookingId } = this.props.currentOrder
        orderService.getOrderlotels({
            orderId: bookingId
        }).then((res) => {
            if(res.notRowRoomNum){
                for(let i = 0; i < res.notRowRoomNum; i++){
                    res.orderLotels.push({})
                }
            }
            this.setState({
                loading : false,
                houseNo: res.houseNo,
                roomNum: res.roomNum,
                notRowRoomNum: res.notRowRoomNum,
                roomName: res.roomName || '',
                orderLotels: res.orderLotels
            })
        })
    }
    handleCancel = () => {
        this.props.togglePasswordModal()
    }
    openModal = (record) => {
        this.chooiseRoom = record
        this.setState({
            searchRoomVisible: true
        })
    }
    onCancleModel = () => {
        this.setState({
            searchRoomVisible: false
        })
    }
    onOkModel = () => {
        const { bookingId } = this.props.currentOrder
        const type = this.chooiseRoom.id ? 'update' : 'save'
        if(type === 'save'){
            orderService.saveOrderLotel({
                orderId: bookingId,
                roomNumberId: this.searchRoom.id,
                roomNumber: this.searchRoom.roomNumber,
                doorIp: this.searchRoom.doorIp
            }).then(() => {
                this.setState({
                    searchRoomVisible: false
                })
                this.renderTable()
            }).catch(err => message.error(err))
        }else if(type === 'update'){
            orderService.updateOrderLotel({
                orderLotelId : this.chooiseRoom.id,
                roomNumberId: this.searchRoom.id,
                roomNumber: this.searchRoom.roomNumber,
                doorIp: this.searchRoom.doorIp
            }).then(() => {
                this.setState({
                    searchRoomVisible: false
                })
                this.renderTable()
            }).catch(err => message.error(err))
        }
    }
    onSearchRoom = (value = '') => {
        let { checkinDate, checkoutDate, houseSourceId } = this.props.currentOrder
        checkinDate = moment(checkinDate).format('YYYY-MM-DD')
        checkoutDate = moment(checkoutDate).format('YYYY-MM-DD')
        this.timer && clearTimeout(this.timer)
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ roomData: [], roomFetching: true });
        this.timer = setTimeout(() =>{
            const params = {
                roomNumber: value,
                houseSourceId,
                checkIn: checkinDate,
                checkOut: checkoutDate
            }
            orderService.getroomlist(params).then((data) =>{
                if (fetchId !== this.lastFetchId) {
                    return;
                }
                this.setState({ roomData: data, roomFetching: false });
            })
        },500)
    }
    handleChange = (roomNumber) => {
        this.searchRoom = this.state.roomData.filter(room => room.roomNumber === roomNumber)[0]
        this.select.blur()
        this.setState({
            roomValue: roomNumber,
            roomData: [],
            roomFetching: false
        });
    }
    sendPassword = (record) => {
        this.setState({
            loading: true
        })
        orderService.sendPassword(record.id).then(() => {
            message.success('发送成功')
            this.setState({
                loading: false
            })
            this.renderTable()
        })
    }
    sendCheckIn = (record) => {
        this.setState({
            loading: true
        })
        weixinTemplateMessageService.pmsCheckIn({orderId: record.id}).then(() => {
            message.success('发送成功')
            this.setState({
                loading: false
            })
            this.renderTable()
        })
    }
    render () {
        const { houseNo, roomName, orderLotels, roomNum, notRowRoomNum, searchRoomVisible, roomFetching, roomData } = this.state
        const { currentOrder, visible } = this.props
        const self = this
        const columns = [{
            title: '房号',
            dataIndex: 'roomNumber',
            key: 'roomNumber'
        }, {
            title: '已办入住客名',
            dataIndex: 'bookingMemberName',
            key: 'bookingMemberName',
            render: function (text, record, index) {
                return record.id && (
                    <Row>
                        {
                            record.bookingMemberName &&
                            <Col span={14}>
                                {record.bookingMemberName}
                            </Col>
                        }
                        <Col span={10}>
                            <Button
                                type="primary"
                                className="ml5"
                                size="small"
                                onClick={function () {self.sendCheckIn(record)}}
                            >
                                发送入住
                            </Button>
                        </Col>
                    </Row>
                )
            }
        }, {
            title: '密码',
            dataIndex: 'doorPassword',
            key: 'doorPassword',
            render: function (text, record) {
                return record.id && (
                    <Row>
                        {
                            record.doorPassword &&
                            <Col span={14}>
                                {record.doorPassword}
                            </Col>
                        }
                        <Col span={10}>
                            <Button
                                type="primary"
                                className="ml5"
                                size="small"
                                onClick={function () {self.sendPassword(record)}}
                            >
                                发送密码
                            </Button>
                        </Col>
                    </Row>
                )
            }
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return <React.Fragment>
                    <Button size="small" type="primary" className="ml5" onClick={function () {
                        self.openModal(record)
                    }}
                    >
                        {record.id ? '重排房' : '排房'}
                    </Button>
                </React.Fragment>
            }
        }]
        return (
            <div>
                <Drawer
                    title={'房型（房源）: ' + houseNo + '' + roomName}
                    visible={visible}
                    width={600}
                    onClose={this.handleCancel}
                >
                    <div>
                        订单房数：{roomNum}  未排房数：{notRowRoomNum}
                        <Button className="ml20" size="small" type="primary" onClick={this.renderTable}>刷新</Button>
                    </div>
                    <Table loading={this.state.loading} columns={columns} rowKey={function (record, index) { return record.key || '' + index}} dataSource={checkKey(orderLotels)} pagination={false} >
                    </Table>
                </Drawer>
                {
                    searchRoomVisible &&
                    <Modal
                        title="查找房间"
                        visible={searchRoomVisible}
                        width={500}
                        onCancel={this.onCancleModel}
                        onOk={this.onOkModel}
                    >
                        <Select
                            ref={ function (c){ self.select = c }}
                            showSearch
                            placeholder="输入房间号码查找"
                            notFoundContent={roomFetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.onSearchRoom}
                            onChange={this.handleChange}
                            onFocus={this.onSearchRoom}
                            style={{ width: '100%' }}
                        >
                            {roomData.map(d => <Option title={d.roomNumber + ' ' + (d.houseType || '')} key={d.roomNumber}>{d.roomNumber + ' ' + (d.houseType || '')}</Option>)}
                        </Select>
                    </Modal>
                }

            </div>

        )
    }
}


export default PasswordModal
