import React, { Component } from 'react'
import { Avatar, Row, Col, Button, Input } from 'antd'
import { imManagement } from '../../services'
import { getFixNewImagePrefix, getNewImagePrefix, dataFormat } from '../../utils/utils'
import { paltformType, imOrderType } from '../../utils/dictionary'
import './index.less'
const Search = Input.Search;
class ImMessage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataList: [],
            houseList: '',
            contentList: [],
            id: '',
            houseId: '',
            activeIndex: 0,
            hasNextPage: false,
            pageNum: 1,
            hasNextPageCont: false,
            pageNumCont: 1,
            assistantName: '',
            assistantId: '',
            bookingUserName: '',
            bookingUserId: '',
            orderId: '',
            tenantNumber: '',
            checkInDate: '',
            checkOutDate: '',
            totalPrice: ''
        }
        this.contentNode = null
        this.listNode = null
        this.getContent = this.getContent.bind(this)
        this.getHouseDeatil = this.getHouseDeatil.bind(this)
        this.getAssiTable = this.getAssiTable.bind(this)
        this.itemChange = this.itemChange.bind(this)
    }
    componentDidMount () {
        this.props.onARef(this)
        let params = {
            pageNum: 1,
            pageSize: 500,
            createTimeGreaterThanEqual: this.props.editFrom.timeStart,
            createTimeLessThanEqual: this.props.editFrom.timeEnd
        }
        this.getAssiTable(params)
        if (this.listNode) {
            this.listNode.addEventListener('scroll', this.onScrollHandle.bind(this));
        }
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollTop.bind(this));
        }
    }
    onScrollHandle = (event) => {
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if (isBottom) {
            if (this.state.hasNextPage) {
                let params = {
                    pageNum: this.state.pageNum,
                    pageSize: 50,
                    createTimeGreaterThanEqual: this.props.editFrom.tiemStart,
                    createTimeLessThanEqual: this.props.editFrom.timeEnd
                }
                this.getSceollTable(params)
            }
        }
    }
    onScrollTop = (event) => {
        const scrollTop = event.target.scrollTop
        if (scrollTop === 0) {
            if (this.state.hasNextPageCont) {
                let params = {
                    pageNum: this.state.pageNumCont,
                    pageSize: 10,
                    sessionId: this.state.id
                }
                this.getSceollContent(params)
            }
        }
    }
    getAssiTable = (params) => {
        imManagement.getTable(params).then((res) => {
            if (res && res.list.length > 0) {
                if (res.hasNextPage) {
                    this.setState({
                        hasNextPage: true,
                        pageNum: params.pageNum + 1,
                        id: res.list[0].id,
                        houseId: res.list[0].houseSourceId,
                        dataList: res.list,
                        assistantName: res.list[0].assistantName,
                        assistantId: res.list[0].assistantId,
                        bookingUserName: res.list[0].bookingUserName,
                        bookingUserId: res.list[0].bookingUserId,
                        orderId: res.list[0].orderId,
                        tenantNumber: res.list[0].tenantNumber,
                        checkInDate: res.list[0].checkInDate,
                        checkOutDate: res.list[0].checkOutDate,
                        totalPrice: res.list[0].totalPrice
                    })
                } else {
                    this.setState({
                        hasNextPage: false,
                        pageNum: params.pageNum,
                        id: res.list[0].id,
                        houseId: res.list[0].houseSourceId,
                        dataList: res.list,
                        assistantName: res.list[0].assistantName,
                        assistantId: res.list[0].assistantId,
                        bookingUserName: res.list[0].bookingUserName,
                        bookingUserId: res.list[0].bookingUserId,
                        orderId: res.list[0].orderId,
                        tenantNumber: res.list[0].tenantNumber,
                        checkInDate: res.list[0].checkInDate,
                        checkOutDate: res.list[0].checkOutDate,
                        totalPrice: res.list[0].totalPrice
                    })
                }
                let query = {
                    pageNum: params.pageNum,
                    pageSize: 10,
                    sessionId: res.list[0].id
                }
                this.getContent(query)
                this.getHouseDeatil(res.list[0].houseSourceId)
            }else{
                this.setState({
                    id: '',
                    houseId: '',
                    dataList: [],
                    assistantName: '',
                    assistantId: '',
                    bookingUserName: '',
                    bookingUserId: '',
                    orderId: '',
                    tenantNumber: '',
                    checkInDate: '',
                    checkOutDate: '',
                    totalPrice: '',
                    contentList: []
                })
            }
        })
    }
    getSceollTable = (params) => {
        imManagement.getTable(params).then((res) => {
            if (res.list.length > 0) {
                for (var i = 0; i < res.list.length; i++) {
                    this.state.dataList.push(res.list[i])
                }
                if (res.hasNextPage) {
                    this.setState({
                        hasNextPage: true,
                        pageNum: this.state.pageNum + 1
                    })
                } else {
                    this.setState({
                        hasNextPage: false,
                        pageNum: this.state.pageNum
                    })
                }
            }
        })
    }
    getHouseDeatil = (id) => {
        imManagement.getHouseDetail(id).then((res) => {
            this.setState({
                houseList: res
            })
        })
    }
    getContent = (query) => {
        imManagement.getContent(query).then((res) => {
            if (res.messages.hasNextPage) {
                this.setState({
                    contentList: res.messages.list,
                    pageNumCont: this.state.pageNumCont + 1,
                    hasNextPageCont: true
                })
            } else {
                this.setState({
                    contentList: res.messages.list,
                    pageNumCont: this.state.pageNumCont,
                    hasNextPageCont: false
                })
            }
            setTimeout(() => {
                let { clientHeight, scrollHeight } = this.contentNode;
                let n = scrollHeight - clientHeight
                this.contentNode.scrollTop = n
            }, 500)
        })
    }
    getSceollContent = (query) => {
        imManagement.getContent(query).then((res) => {
            if (res.messages.list.length > 0) {
                for (var i = 0; i < res.messages.list.length; i++) {
                    this.state.contentList.unshift(res.messages.list[i])
                }
                if (res.messages.hasNextPage) {
                    this.setState({
                        contentList: this.state.contentList,
                        pageNumCont: this.state.pageNumCont + 1,
                        hasNextPageCont: true
                    })
                } else {
                    this.setState({
                        contentList: this.state.contentList,
                        pageNumCont: this.state.pageNumCont,
                        hasNextPageCont: false
                    })
                }
            }
        })
    }
    itemChange = (index, id, houseSourceId, bookingUserName, orderId, tenantNumber, checkInDate, checkOutDate, totalPrice, assistantName, assistantId, bookingUserId) => {
        //console.log(bookingUserName)
        this.setState({
            activeIndex: index,
            assistantName: assistantName,
            assistantId: assistantId,
            bookingUserName: bookingUserName,
            bookingUserId: bookingUserId,
            id: id,
            orderId: orderId,
            tenantNumber: tenantNumber,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalPrice: totalPrice
        }, () => {
            let query = {
                pageNum: 1,
                pageSize: 10,
                sessionId: id
            }
            this.getContent(query)
            //console.log(houseSourceId)
            this.getHouseDeatil(houseSourceId)
        })
    }
    searchAssi = (val) => {
        let params = {
            pageNum: 1,
            pageSize: 50,
            assistName: val,
            createTimeGreaterThanEqual: this.props.editFrom.timeStart,
            createTimeLessThanEqual: this.props.editFrom.timeEnd
        }
        this.getAssiTable(params)
    }
    render () {
        let self = this
        return (
            <div className="timeout">
                <div className="search-im">
                    <Search
                        placeholder="助理姓名"
                        enterButton="Search"
                        onSearch={self.searchAssi}
                    />
                </div>
                <Row>
                    <Col span={8}>
                        <div className="timeout-list">
                            <div className="title">消息列表</div>
                            <div className="list-height" ref={function (res) { self.listNode = res }} >
                                {self.state.dataList.length > 0 ? self.state.dataList.map(function (item, index) {
                                    return <div className={parseInt(self.state.activeIndex, 10) === parseInt(index, 10) ? 'timeout-item active' : 'timeout-item'} key={index} onClick={function () { self.itemChange(index, item.id, item.houseSourceId, item.bookingUserName, item.orderId, item.tenantNumber, item.checkInDate, item.checkOutDate, item.totalPrice, item.assistantName, item.assistantId, item.bookingUserId) }}>
                                        <Row>
                                            <Col span={3}>
                                                <Avatar icon="user" src={getFixNewImagePrefix(item.bookingHeadUrl)} />
                                            </Col>
                                            <Col span={21}>
                                                <div className="large">
                                                    <span className="red">{imOrderType[item.orderStatus]}</span>·{item.bookingUserName}
                                                    <span className="small">{dataFormat(item.lastMessageTime, 'YYYY年MM月DD日 HH:mm')}</span>
                                                    <div>
                                                        来自{paltformType[item.platformType]}
                                                        {item.firstReplyTime ?
                                                            <p className="block text-right">已解决</p>
                                                            : <p className="red text-right">未解决</p>
                                                        }
                                                    </div>
                                                </div>
                                                <p className="href">{item.lastMessage}</p>
                                                <p className="normal">{dataFormat(item.checkInDate, 'MM月DD日')}-{dataFormat(item.checkOutDate, 'MM月DD日')}</p>
                                                <p className="normal">【{item.houseNo}】{item.address}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                }) : <div className="no-more">暂无聊天列表信息</div>
                                }
                            </div>
                        </div>
                    </Col>
                    <Col span={16}>
                        <div className="timeout-content">
                            <div className="title">聊天页</div>
                            <div>
                                {self.state.dataList.length > 0 ?
                                    <div>
                                        <div className="timeout-msg">
                                            <p>
                                                <span>客人：{self.state.bookingUserName}</span>
                                                <span>助理：{self.state.assistantName}</span>
                                            </p>
                                            {self.state.orderId ?
                                                <p className="red">
                                                    <span>预订已接受</span>
                                                    <span>订单号：{self.state.orderId}</span>
                                                </p>
                                                :
                                                <p className="red">
                                                    <span>咨询</span>
                                                    <span>订单号：无</span>
                                                </p>
                                            }
                                            <p>{self.state.tenantNumber}位房客，{dataFormat(self.state.checkInDate, 'MM月DD日')}-{dataFormat(self.state.checkOutDate, 'MM月DD日')}，￥{self.state.totalPrice}</p>
                                        </div>
                                        <div className="timeout-house">
                                            {self.state.houseList ?
                                                <div>
                                                    <img alt="" className="img" src={self.state.houseList.image ? getNewImagePrefix(self.state.houseList.image) : require("../../images/noImg.png")} />
                                                    <div className="timeout-prod">
                                                        <p>{self.state.houseList.address}</p>
                                                        <p>
                                                            {self.state.houseList.livingRoomNumber ? self.state.houseList.livingRoomNumber + '间卧室·' : null}
                                                            {self.state.houseList.toiletNumber ? self.state.houseList.toiletNumber + '个卫生间·' : null}
                                                            {self.state.houseList.bedNumber ? self.state.houseList.bedNumber + '张床' : null}
                                                        </p>
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                    : null
                                }
                                <div className="chat" ref={function (res) { self.contentNode = res }} >
                                    {self.state.contentList.length > 0 ? self.state.contentList.map(function (item) {
                                        return <div className="chat-item" style={{ float: 'left', textAlign: 'left' }} key={item.id}>
                                            <div className="name">
                                                {item.fromUserId === self.state.bookingUserId ? '客人：' : '助理：'}
                                                {item.fromUserName} &nbsp;&nbsp;
                                                <small style={{ color: '#ccc' }}>
                                                    {dataFormat(item.createTime, 'YYYY年MM月DD日 HH:mm')}
                                                </small>
                                            </div>
                                            <Avatar className="chat-img" icon="user" src={getFixNewImagePrefix(item.headUrl)} />
                                            <div className="box">
                                                <div className="chat-cont">
                                                    <i className="icon"></i>
                                                    <div className="chat-text">
                                                        <p>{item.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }) : <div className="no-more">暂无聊天内容</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default ImMessage
