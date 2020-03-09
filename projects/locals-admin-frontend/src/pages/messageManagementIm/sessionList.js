import React, {Component} from 'react'
import {Avatar, Form, Row, Col, Button, Input } from 'antd'
import { imManagement, userService } from '../../services'
import {getFixNewImagePrefix,getNewImagePrefix,dataFormat} from '../../utils/utils'
import { paltformType, imOrderType } from '../../utils/dictionary'
import {chatContentAction} from '../../actions/IM'
import './index.less'
import global from '../../utils/Global';
import '../../assets/jmessage-sdk-web.2.6.0.min'
import {addingAuthorities} from "../../actions/userAdmin";
import {connect} from "react-redux";

const { TextArea } = Input;
const mapStateToProps = (state, action) => {
    return {

    }
}
// 创建JIM 对象
const JIM = new window.JMessage()
global.JIM = JIM
class SessionListForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataList:[],
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
        this.getTable = this.getTable.bind(this)
        this.itemChange = this.itemChange.bind(this)
    }
    componentDidMount () {
        this.props.onTRef(this)
        let params = {
            pageNum: 1,
            pageSize: 500,
            replyTimeoutCount: true,
            createTimeGreaterThanEqual:this.props.editFrom.timeStart,
            createTimeLessThanEqual:this.props.editFrom.timeEnd
        }
        this.JIMInit(() =>{
            //监听
            JIM.onMsgReceive((data) =>{
                console.log(data)
            });
        })
        this.getTable(params)
        if (this.listNode) {
            this.listNode.addEventListener('scroll', this.onScrollHandle.bind(this));
        }
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollTop.bind(this));
        }
    }
    JIMInit = (cb) =>{
        imManagement.getSecretKey({appType: 'aai'}).then((data) =>{
            JIM.init({
                "appkey": data.appKey,
                "random_str": data.randomStr,
                "signature": data.signature,
                "timestamp": data.timestamp,
                "flag": 1
            }).onSuccess( () =>{
                this.getImUserInfo()
                cb()
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
            console.log('login success!!!')
        }).onFail( (data) =>{
            console.log('login failed!!!')
            if (data.code === "880103") {
                this.registerIm();
            }
        }).onTimeout( () =>{

        })
    }
    sendImMessage = () =>{
        console.log(this.state.groupId,global.userInfo)
        JIM.sendGroupMsg({
            'target_gid': this.state.groupId,
            'content': 'hello world',
            'need_receipt': true,
            'extras': {
                'messageTypeId': '0',
                'sendUserAvatar': global.userInfo.avatar,
                'fromUserName': global.userInfo.username,
                'bookingUserId': global.userInfo.id,
                'sendUserId': global.userInfo.id
            }
        }).onSuccess((data ,msg) =>{
            console.log(data,msg)
        }).onFail((data) =>{
            console.log(data)
            //同发送单聊文本
        });
    }
    sendApiMessage = () =>{
        let params = {
            bookingId: this.state.id,
            content: 'hello world',
            conversationType: 'group',
            fromType: '2',
            groupId: this.groupId,
            houseSourceId: this.state.houseSourceId,
            // houseSourceTitle: that.imOrderInfo.title,
            messageSource: 'booking_Mini_Program',
            messageTypeId: '0',
            orderId: this.state.id,
            platformType: '2',
            sessionId: this.sessionId
        }
        imManagement.sendMessage(params).then((data) =>{

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
        const scrollTop = event.target.scrollTop
        if(scrollTop === 0){
            if(this.state.hasNextPageCont){
                let params = {
                    pageNum: this.state.pageNumCont,
                    pageSize: 10,
                    sessionId: this.state.id
                }
                this.getSceollContent(params)
            }
        }
    }
    getTable = (params) =>{
        imManagement.getTable(params).then((res)=>{
            if(res && res.list.length > 0){
                if(res.hasNextPage){
                    this.setState({
                        total:res.replyTimeoutCount,
                        hasNextPage:true,
                        pageNum: params.pageNum + 1,
                        id: res.list[0].id,
                        groupId: res.list[0].groupId,
                        houseId: res.list[0].houseSourceId,
                        dataList: res.list,
                        assistantName: res.list[0].assistantName,
                        assistantId: res.list[0].assistantId,
                        bookingUserName: res.list[0].bookingUserName,
                        bookingUserId: res.list[0].bookingUserId,
                        orderId:res.list[0].orderId,
                        tenantNumber:res.list[0].tenantNumber,
                        checkInDate:res.list[0].checkInDate,
                        checkOutDate:res.list[0].checkOutDate,
                        totalPrice:res.list[0].totalPrice
                    })
                }else{
                    this.setState({
                        total:res.replyTimeoutCount,
                        hasNextPage:false,
                        pageNum: params.pageNum,
                        id: res.list[0].id,
                        groupId: res.list[0].groupId,
                        houseId: res.list[0].houseSourceId,
                        dataList: res.list,
                        assistantName: res.list[0].assistantName,
                        assistantId: res.list[0].assistantId,
                        bookingUserName: res.list[0].bookingUserName,
                        bookingUserId: res.list[0].bookingUserId,
                        orderId:res.list[0].orderId,
                        tenantNumber:res.list[0].tenantNumber,
                        checkInDate:res.list[0].checkInDate,
                        checkOutDate:res.list[0].checkOutDate,
                        totalPrice:res.list[0].totalPrice
                    })
                }
                this.props.dispatch(chatContentAction(res.list[0]))
            }else{
                this.setState({
                    total: '',
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
                this.props.dispatch(chatContentAction())
            }
            // console.log("这里的总数",res.total)
            res && this.total(res.replyTimeoutCount)

        })
    }
    total = (num) =>{
        this.props.cancel(num)
    }
    itemChange = (index,item)=>{
        this.setState({
            activeIndex: index
        })
        this.props.dispatch(chatContentAction(item))
    }

    render () {
        let self = this
        return (
            <div className="timeout">
                <div className="timeout-list">
                    <div className="list-height" ref={function (res){self.listNode = res}} >
                        {self.state.dataList.length > 0 ? self.state.dataList.map(function (item,index){
                            return <div className="item-content" key={index} onClick={function () {self.itemChange(index,item)}}>
                                <div className={parseInt(self.state.activeIndex,10) === parseInt(index,10) ? 'timeout-item active' : 'timeout-item'} >
                                <Row>
                                    <Col span={2}>
                                        <Avatar icon="user" src={getFixNewImagePrefix(item.bookingHeadUrl)} />
                                    </Col>
                                    <Col span={21}>
                                        <div className="order-status">
                                            <span className="status">{imOrderType[item.orderStatus]}</span>
                                            <span>|</span>
                                            <span className="">{item.bookingUserName}</span>
                                            <span className="small">{dataFormat(item.lastMessageTime,'YY/MM/DD HH:mm')}</span>
                                        </div>
                                        <div className="last-message">
                                            <span className="href">{item.lastMessage}</span>
                                            {item.firstReplyTime ?
                                                <span className="block text-right font-size15 font-weight">已解决</span>
                                                : <span className="red text-right font-size15 font-weight">未解决</span>
                                            }
                                        </div>

                                        <p className="normal">入住时间：{dataFormat(item.checkInDate,'MM/DD')}-{dataFormat(item.checkOutDate,'MM/DD')}</p>
                                        <p className="normal">【{item.houseNo}】{item.address}</p>
                                    </Col>
                                </Row>
                                </div>
                            </div>
                        }) : <div className="no-more">暂无聊天列表信息</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
const SessionList = Form.create()(SessionListForm);
export default connect(mapStateToProps)(SessionList)
