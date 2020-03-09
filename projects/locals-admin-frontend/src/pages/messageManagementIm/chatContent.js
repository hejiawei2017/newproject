import React, {Component} from 'react'
import { connect } from 'react-redux'
import {Avatar, Row, Col, Button, Input } from 'antd'
import { imManagement, userService } from '../../services'
import {getFixNewImagePrefix,getNewImagePrefix,dataFormat} from '../../utils/utils'
import { paltformType, imOrderType } from '../../utils/dictionary'
import './index.less'
import global from '../../utils/Global';
import '../../assets/jmessage-sdk-web.2.6.0.min'

const mapStateToProps = (state, action) => {
    return {
        chatContent: state.chatContent.list
    }
}
class ChatContent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataList:[],
            inputMessage:'',
            houseList:'',
            contentList:[],
            id:'',
            houseId:'',
            activeIndex:0,
            hasNextPage:false,
            pageNum:1,
            hasNextPageCont:false,
            pageNumCont:1,
            assistantName:'',
            assistantId:'',
            bookingUserName:'',
            bookingUserId:'',
            orderId:'',
            tenantNumber:'',
            checkInDate:'',
            checkOutDate:'',
            totalPrice:'',
            total:'',
            solved:''
        }
        this.contentNode = null
        this.listNode = null
        this.getHouseDeatil = this.getHouseDeatil.bind(this)
    }
    componentDidMount () {
        if (this.listNode) {
            this.listNode.addEventListener('scroll', this.onScrollHandle.bind(this));
        }
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollTop.bind(this));
        }
    }
    componentWillReceiveProps (nextProps){
        if(nextProps.chatContent && nextProps.chatContent.id){
            let query = {
                pageNum: 1,
                pageSize: 10,
                sessionId: nextProps.chatContent.id
            }
            this.getContent(query)
            this.getHouseDeatil(nextProps.chatContent.houseSourceId)
        }else{
            this.setState({
                houseList: [],
                contentList: []
            })
        }
        return true
    }
    onScrollHandle = (event) =>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if(isBottom){
            if(this.state.hasNextPage){
                let params = {
                    pageNum: this.state.pageNum,
                    pageSize: 50,
                    replyTimeoutCount: true,
                    createTimeGreaterThanEqual:this.props.editFrom.tiemStart,
                    createTimeLessThanEqual:this.props.editFrom.timeEnd
                }
                this.getSceollTable(params)
            }
        }
    }
    onScrollTop = (event) =>{
        if(this.props.chatContent){
            const {id} = this.props.chatContent
            const scrollTop = event.target.scrollTop
            if(scrollTop === 0){
                if(this.state.hasNextPageCont){
                    let params = {
                        pageNum: this.state.pageNumCont,
                        pageSize: 10,
                        sessionId: id
                    }
                    this.getSceollContent(params)
                }
            }
        }
    }
    total = (num) =>{
        this.props.cancel(num)
    }
    getHouseDeatil = (id) =>{
        imManagement.getHouseDetail(id).then((res)=>{
            this.setState({
                houseList:res
            })
        })
    }
    getContent = (query) =>{
        imManagement.getContent(query).then((res)=>{
            let contentList = res.messages.list.reverse()
            if(res.messages.hasNextPage){
                this.setState({
                    contentList: contentList,
                    pageNumCont: this.state.pageNumCont + 1,
                    hasNextPageCont: true
                })
            }else{
                this.setState({
                    contentList: res.messages.list,
                    pageNumCont: this.state.pageNumCont,
                    hasNextPageCont: false
                })
            }
            setTimeout(()=>{
                let {clientHeight,scrollHeight} = this.contentNode;
                let n = scrollHeight - clientHeight
                this.contentNode.scrollTop = n
            },500)
        })
    }
    getSceollContent = (query) =>{
        imManagement.getContent(query).then((res)=>{
            if(res.messages.list.length > 0){
                let contentList = res.messages.list.reverse()
                for(let i = 0 ; i < contentList.length ; i++){
                    this.state.contentList.unshift(contentList[i])
                }
                if(res.messages.hasNextPage){
                    this.setState({
                        contentList: this.state.contentList,
                        pageNumCont: this.state.pageNumCont + 1,
                        hasNextPageCont: true
                    })
                }else{
                    this.setState({
                        contentList: this.state.contentList,
                        pageNumCont: this.state.pageNumCont,
                        hasNextPageCont: false
                    })
                }
            }
        })
    }
    render () {
        let self = this
        let { bookingUserName, assistantName, assistantMobile, orderId, tenantNumber, checkInDate, checkOutDate, totalPrice, bookingHeadUrl, orderStatus, randomId, lastMessageTime, sessionOrderView, sessionUserView} = self.props.chatContent || {}
        let { bookingMemberMobile } = sessionOrderView || {}
        let { memberCardName, isVip } = sessionUserView || {}
        let { houseNo, address, title, buName, buPhone, assistName, assistPhone } = this.state.houseList || {}
        return (
            <div className="chat-content">
                {self.props.chatContent ?
                    <div className="chat-header">
                        <Row>
                            <Col span={3}>
                                <div className="header-left">
                                    <Avatar size="large" icon="user" src={getFixNewImagePrefix(bookingHeadUrl)} />
                                </div>
                            </Col>
                            <Col span={21}>
                                <div className="chat-order">
                                    <p>订单状态：<span>{imOrderType[orderStatus]} | {randomId}</span> {dataFormat(lastMessageTime,'YY/MM/DD HH:mm')}</p>
                                    <p>入住信息：{tenantNumber}人 | ¥{totalPrice} | {bookingUserName} {bookingMemberMobile}</p>
                                    <p>会员等级： {memberCardName} | {isVip}</p>
                                </div>
                                <div className="chat-house">
                                    <p>房源：{houseNo} | {title} | 地址：{address}</p>
                                    <p>BU：{buName} {buPhone}   管家：{assistantName} {assistantMobile}</p>
                                </div>
                            </Col>
                        </Row>
                    </div> : null
                }
                <div className="chat">
                    <div className="chat-body" ref={function (res){self.contentNode = res}} >
                        {self.state.contentList.length > 0 ? self.state.contentList.map(function (item){
                            return item.fromUserId === global.userInfo.id ? (
                                <div className="chat-item" style={{float:'right',textAlign:'right'}} key={item.id}>
                                    <div className="name">
                                        <small style={{ color: '#ccc' }}>
                                            {dataFormat(item.createTime, 'YYYY年MM月DD日 HH:mm')}
                                        </small> &nbsp;&nbsp;
                                        {item.fromUserName}
                                    </div>
                                    <div className="box">
                                        <div className="chat-cont-right">
                                            <div className="chat-text">
                                                <p>{item.content}</p>
                                            </div>
                                            <i className="icon"></i>
                                        </div>
                                    </div>
                                    <Avatar className="chat-img" icon="user" src={getFixNewImagePrefix(item.headUrl)}/>
                                </div>
                            ) : (
                                <div className="chat-item" style={{float:'left',textAlign:'left'}} key={item.id}>
                                    <div className="name">
                                        {item.fromUserName} &nbsp;&nbsp;
                                        <small style={{ color: '#ccc' }}>
                                            {dataFormat(item.createTime, 'YYYY年MM月DD日 HH:mm')}
                                        </small>
                                    </div>
                                    <Avatar className="chat-img" icon="user" src={getFixNewImagePrefix(item.headUrl)}/>
                                    <div className="box">
                                        <div className="chat-cont">
                                            <i className="icon"></i>
                                            <div className="chat-text">
                                                <p>{item.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                        }) : <div className="no-more">暂无聊天内容</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps)(ChatContent)
