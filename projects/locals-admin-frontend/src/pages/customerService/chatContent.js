import React, {Component} from 'react'
import { connect } from 'react-redux'
import {Avatar, Button, Input, notification} from 'antd'
import { imManagement, userService } from '../../services'
import {getFixNewImagePrefix} from '../../utils/utils'
import './index.less'
import OrderDrawer from './orderDrawer'
import chatTimeFormat from './utils'
import global from '../../utils/Global';
import '../../assets/jmessage-sdk-web.2.6.0.min'
import Bus from "./eventBus";
import {chatContentAction} from "../../actions/IM";

const { TextArea } = Input;
// 创建JIM 对象
const JIM = new window.JMessage()
global.JIM = JIM
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
            contentList:[],
            id:'',
            houseId:'',
            activeIndex:0,
            hasNextPage:false,
            pageNum:1,
            hasNextPageCont:false,
            pageNumCont:1,
            totalPrice:'',
            manageOnline:false,
            closeBtnDisabled:false,
            noPropsDate:false,
            solved:''
        }
        this.contentNode = null
    }
    componentDidMount () {
        this.JIMInit()
        window.chatTipDestroy = false
        if(window.chatTipTimer){
            clearInterval(window.chatTipTimer)
            document.title = '路客管理后台'
        }
        document.addEventListener('visibilitychange', () =>{
            if(document.visibilityState !== 'hidden' && !window.chatTipDestroy) {
                if(window.chatTipTimer){
                    clearInterval(window.chatTipTimer)
                }
                document.title = '路客管理后台'
            }
        })
        Bus.on('newMessageTip',()=>{
            this.newMessageTip('【您有待领取的超时未回复通知】', true)
        })
    }
    componentWillReceiveProps (nextProps){
        if(nextProps.chatContent && nextProps.chatContent.id && (this.props.id !== nextProps.chatContent.id)){
            this.setState({
                manageOnline: false,
                noPropsDate: false,
                id: nextProps.chatContent.id,
                pageNumCont: 1,
                contentList: []
            })
            let query = {
                pageNum: 1,
                pageSize: 10,
                sessionId: nextProps.chatContent.id
            }
            if(nextProps.chatContent.customerServiceSolved === 1){
                imManagement.assistantOnline(nextProps.chatContent.id).then((data) => {
                    if(data){
                        this.setState({
                            manageOnline: true
                        })
                    }
                })
            }
            this.getContent(query)
        }else {
            this.setState({
                noPropsDate: true
            })
        }
        return true
    }
    componentWillUnmount () {
        window.chatTipDestroy = true
    }
    newMessageTip = (title = "【您有新的回复内容】", notify) => {
        //在浏览器其他TAB页监听新的消息
        let flashStep = 0
        if(this.props.solveType !== '1' || notify || window.chatTipDestroy){
            notification.info({
                message: title,
                duration: 5
            })
        }
        if(document.visibilityState === 'hidden' || window.chatTipDestroy) {
            if(window.chatTipTimer){
                clearInterval(window.chatTipTimer)
            }
            window.chatTipTimer = setInterval(() => {
                flashStep++
                if (flashStep === 3) {flashStep = 1}
                if (flashStep === 1) {document.title = title}
                if (flashStep === 2) {document.title = '路客管理后台'}
            },500)
        }
    }
    JIMInit = () =>{
        imManagement.getSecretKey({appType: 'aai'}).then((data) =>{
            JIM.init({
                "appkey": data.appKey,
                "random_str": data.randomStr,
                "signature": data.signature,
                "timestamp": data.timestamp,
                "flag": 1
            }).onSuccess( () =>{
                this.getImUserInfo()
            }).onFail( (data) =>{

            })
        })
    }
    getImUserInfo = () =>{
        if(global.userInfo && global.userInfo.id){
            imManagement.getImUserInfo(global.userInfo.id, 'aai').then((data) =>{
                this.imUserInfo = data
                this.imLogin()
            })
        }else{
            userService.getUserInfo().then((data) =>{
                imManagement.getImUserInfo(data.id, 'aai').then((data) =>{
                    this.imUserInfo = data
                    this.imLogin()
                })
            })
        }
    }
    imLogin = () =>{
        JIM.login({
            'username': this.imUserInfo.username,
            'password': this.imUserInfo.password
        }).onSuccess( () =>{
            console.log('666,login success!!!')
            JIM.onMsgReceive((data) =>{
                console.log('监听',data)
                this.handleReceiveMessage(data)
            })
        }).onFail( (data) =>{
            console.log('login failed!!!',data)
            if (data.code === 880103) {
                this.registerIm()
            }else if(data.code === 880107){
                JIM.onMsgReceive((data) =>{
                    console.log('监听',data)
                    this.handleReceiveMessage(data)
                })
            }
        }).onTimeout( () =>{

        })
    }
    onSendMessage = (textarea) =>{
        let message = textarea || this.state.textarea
        if(!message){
            message.error('内容不能为空')
        }else{
            this.sendApiMessage(message)
            this.sendImMessage(message)
        }
    }
    sendImMessage = (message, type = '0') =>{
        const {groupId} = this.props.chatContent
        JIM.sendGroupMsg({
            'target_gid': groupId,
            'content': message,
            'need_receipt': true,
            'extras': {
                'messageTypeId': type,
                'sendUserAvatar': global.userInfo.avatar,
                'landlordHeadUrl': global.userInfo.avatar,
                'fromUserName': global.userInfo.nickName,
                'bookingUserId': global.userInfo.id,
                'sendUserId': global.userInfo.id
            }
        }).onSuccess((data ,msg) =>{
            console.log('发送成功', data, msg)
        }).onFail((data) =>{
            console.log(data)
        });
    }
    sendApiMessage = (message, type = '0') =>{
        const {id, groupId, houseSourceId} = this.props.chatContent
        let params = {
            bookingId: id,
            content: message,
            conversationType: 'group',
            fromType: '9',
            groupId: groupId,
            houseSourceId: houseSourceId,
            messageTypeId: type,
            orderId: id,
            platformType: '9',
            sessionId: id
        }
        imManagement.sendMessage(params).then((data) =>{
            let item = {
                fromUserId: global.userInfo.id,
                id: new Date().getTime(),
                messageTypeId: type,
                headUrl: global.userInfo.avatar,
                createTime: new Date().getTime(),
                fromUserName: global.userInfo.nickName,
                content: data.lastMessage
            }
            this.state.contentList.push(item)
            this.setState({
                contentList: this.state.contentList,
                textarea: ''
            }, ()=>{
                let {clientHeight,scrollHeight} = this.contentNode;
                let n = scrollHeight - clientHeight
                if(this.contentNode) {
                    this.contentNode.scrollTop = n
                }
            })

        })
    }
    //处理接收到的极光消息
    handleReceiveMessage = (data) =>{
        this.newMessageTip()
        const { groupIds } = this.props.chatContent
        let messageList = data.messages;
        messageList.forEach(item => {
            let from_id = item.content.from_id
            let extras = item.content.msg_body.extras
            let { bookingUserId, sessionId } = extras
            if (groupIds.includes(sessionId)) {//groupIds里面放的其实是sessionId数组
                if (extras.messageTypeId) {
                    let listItem = {
                        id: item.msg_id,
                        fromUserId: item.content.from_id,
                        fromUserName: item.content.from_name,
                        fromType: null,
                        headUrl: extras.sendUserAvatar,
                        content: item.content.msg_body.text,
                        messageTypeId: extras.messageTypeId,
                        createTime: item.content.create_time
                    }
                    this.state.contentList.push(listItem)
                    if(from_id !== bookingUserId){
                        this.setState({
                            manageOnline: true
                        })
                    }
                    this.setState({
                        contentList: this.state.contentList
                    }, ()=>{
                        let {clientHeight,scrollHeight} = this.contentNode;
                        let n = scrollHeight - clientHeight
                        if(this.contentNode) {
                            this.contentNode.scrollTop = n
                        }
                    })
                }
            }else{
                console.log("其他群组聊天")
                Bus.emit('receiveOtherMessage', sessionId)
            }

        })
    }
    //刷新im
    registerIm = () =>{
        JIM.register({
            'username': this.imUserInfo.username,
            'password': this.imUserInfo.password,
            'nickname': this.imUserInfo.nickName
        }).onSuccess( () =>{
            this.imLogin()
        }).onFail( () =>{
        })
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
    getContent = (query) =>{
        imManagement.getContent(query).then((res)=>{
            let contentList = res.messages.list.reverse()
            let pageNumCont, hasNextPageCont
            if(res.messages.hasNextPage){
                pageNumCont = this.state.pageNumCont + 1
                hasNextPageCont = true
            }else{
                hasNextPageCont = false
                pageNumCont = 1
            }
            this.setState({
                contentList: contentList,
                pageNumCont: pageNumCont,
                hasNextPageCont: hasNextPageCont,
                closeBtnDisabled: false
            }, () =>{
                setTimeout(() => {
                    if(this.contentNode){
                        this.contentNode.addEventListener('scroll', this.onScrollTop.bind(this));
                        let {clientHeight,scrollHeight} = this.contentNode
                        let n = scrollHeight - clientHeight
                        this.contentNode.scrollTop = n
                    }
                },200)

            })
        })
        imManagement.setRead({sessionId: query.sessionId})
    }
    getSceollContent = (query) =>{
        imManagement.getContent(query).then((res)=>{
            if(res.messages.list.length > 0){
                let contentList = res.messages.list.reverse()
                contentList = contentList.concat(this.state.contentList)
                if(this.contentNode){
                    this.contentNode.scrollTop = 1
                }
                if(res.messages.hasNextPage){
                    this.setState({
                        contentList: contentList,
                        pageNumCont: this.state.pageNumCont + 1,
                        hasNextPageCont: true
                    })
                }else{
                    this.setState({
                        contentList: contentList,
                        pageNumCont: this.state.pageNumCont,
                        hasNextPageCont: false
                    })
                }
            }
        })
    }
    chatingFun = (e) => { //获取当前值
        this.setState({
            textarea: e.target.value
        })
    }
    onkeydown = (e) =>{
        let keyCode = e.keyCode
        if(!e.shiftKey && keyCode === 13) {// 只按【Enter】
            const textarea = this.state.textarea
            setTimeout(()=>{
                this.setState({
                    textarea: ''
                }, () =>{
                    this.onSendMessage(textarea)
                })
            },0)
        }
    }
    textareaDisabled = () => {
        this.setState({
            closeBtnDisabled: true
        })
    }
    isShowChatTime = (item ,index) => {
        if(this.state.contentList && this.state.contentList.length){
            if(index){
                let diff = item.createTime - this.state.contentList[index - 1].createTime
                return diff > 60 * 1000
            }else{
                return true
            }
        }
    }
    filterChatText = (item,index) => {
        let text = ''
        switch (item.messageTypeId) {
            case 2: text = '您已发送特别优惠'; break
            case 3: text = '您已同意客人的预订'; break
            case 4: text = '您已拒绝客人的预订'; break
            default: text = ''
        }
        return (
            <div className="chat-bar" key={index}>
                <span>{text}</span>
            </div>
        )
    }
    render () {
        let self = this
        let { customerServiceSolved } = self.props.chatContent || {}
        return (self.state.contentList.length > 0 && !self.state.noPropsDate) ? (
            <div className="chat-content">
                <OrderDrawer chatContent={self.props.chatContent} readOnly={self.props.readOnly} assistantAuth={self.props.assistantAuth} textareaDisabled={self.textareaDisabled} parent={self}/>
                <div className="chat">
                    <div className="chat-body" ref={function (res){ self.contentNode = res }} >
                        {
                            this.state.manageOnline && !this.props.assistantAuth && <div className="manageOnline">管家已上线，客服宝宝可以休息啦！</div>
                        }
                        {
                            self.state.contentList.map(function (item, index){
                                if(item.messageTypeId === 2 || item.messageTypeId === 3 || item.messageTypeId === 4){
                                    return self.filterChatText(item,index)
                                }
                                return item.fromUserId === global.userInfo.id ? (
                                    <div className="chat-item" style={{float:'right',textAlign:'right'}} key={item.id}>
                                        {
                                            self.isShowChatTime(item, index) &&
                                            <div className="chat-time">
                                                <span>
                                                    {chatTimeFormat(item.createTime)}
                                                </span>
                                            </div>
                                        }
                                        <div className="name">
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
                                    <div className="chat-item" style={{float:'left',textAlign:'left'}} key={item.id + item.fromUserName}>
                                        {
                                            self.isShowChatTime(item, index) &&
                                            <div className="chat-time">
                                                <span>
                                                    {chatTimeFormat(item.createTime)}
                                                </span>
                                            </div>
                                        }
                                        <div className="name">
                                            {item.fromUserName}
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
                            }
                        )}
                    </div>
                </div>
                {
                    (self.state.contentList.length > 0 && ((customerServiceSolved === 1 && !this.props.readOnly) || (this.props.assistantAuth && this.props.readOnly))) &&
                    <div className="chat-footer">
                        <TextArea value={this.state.textarea} onChange={self.chatingFun}
                            disabled={this.state.closeBtnDisabled} placeholder="输入对话......"
                            autosize={{ minRows: 1, maxRows: 4 }}
                            onKeyDown={function (e) { self.onkeydown(e) }}
                        >
                        </TextArea>
                        <Button onClick={function () {
                            self.onSendMessage()
                        }} disabled={this.state.closeBtnDisabled}
                        >发送</Button>
                    </div>
                }
            </div>
        ) : <div className="no-more">暂无聊天内容</div>
    }
}
export default connect(mapStateToProps)(ChatContent)
