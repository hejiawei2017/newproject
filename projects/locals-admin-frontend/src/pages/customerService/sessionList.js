import React, {Component} from 'react'
import {Avatar, Form, Row, Col, Button, Icon, message, Popconfirm, Badge, notification } from 'antd'
import {imManagement} from '../../services'
import {dataFormat, checkType} from '../../utils/utils'
import { imOrderType } from '../../utils/dictionary'
import {chatContentAction} from '../../actions/IM'
import Bus from './eventBus'
import './index.less'
import global from '../../utils/Global';
import '../../assets/jmessage-sdk-web.2.6.0.min'
import {connect} from "react-redux";
import moment from "moment";

const mapStateToProps = (state, action) => {
    return {
    }
}

class SessionListForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            dataList:[],
            houseList:'',
            contentList:[],
            activeIndex:0,
            hasNextPage:true,
            pageNum:1,
            hasNextPageCont:false,
            deleteStatus: false,
            delComfirmStatus: false,
            solved:''
        }
        this.listNode = null
        this.getTable = this.getTable.bind(this)
        this.itemChange = this.itemChange.bind(this)
        this.delAll = this.delAll.bind(this)
        this.selAll = this.selAll.bind(this)
    }
    componentDidMount () {
        this.props.onTRef(this)
        this.getTable()
        if (this.listNode) {
            this.listNode.addEventListener('scroll', this.onScrollHandle.bind(this));
        }
        if(!this.props.readOnly){
            if(window.newMessageTipTimer){
                clearInterval(window.newMessageTipTimer)
            }
            window.newMessageTipTimer = setInterval(() => {
                let params = this.composeParams()
                params.createTimeGreaterThanEqual = moment(new Date()).subtract(5, 'minute').subtract(20, 'seconds').format('YYYY-MM-DD HH:mm:ss')
                params.createTimeLessThanEqual = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                imManagement.getTable(params).then((res)=>{
                    let dataList = this.state.dataList
                    let activeIndex = this.state.activeIndex
                    let { listSource, solveType} = this.props
                    if(res && res.list.length){
                        Bus.emit('newMessageTip')
                        if(listSource === '0' && solveType === '0'){
                            dataList = res.list.concat(dataList)
                            this.setState({
                                dataList: dataList,
                                activeIndex: activeIndex + res.list.length
                            })
                        }
                    }
                })
            },20000)
        }
        Bus.on('overChat',()=>{
            // this.refreshPage(this.getTable)
            this.getTable('', true)
        })
        Bus.on('receiveOtherMessage',(groupId)=>{
            const { dataList } = this.state;
            let list = [...dataList]
            list.forEach((ite)=>{
                if(ite.groupIds.includes(groupId)) {
                    ite.unReadCount = 1
                }
            })
            this.setState({
                dataList: list
            })
        })
    }
    refreshPage = (cb) => {
        if (this.listNode) {
            this.listNode.scrollTop = 0
        }
        this.setState({
            hasNextPage:true,
            pageNum:1
        }, cb)
    }
    onScrollHandle = (event) =>{
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = scrollHeight - clientHeight - scrollTop
        if(isBottom < 1){
            if(this.state.hasNextPage){
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(() =>{
                    this.getSceollTable()
                },200)
            }
        }
    }
    getSceollTable = () =>{
        let params = this.composeParams()
        imManagement.getTable(params).then((res)=>{
            if(res.list.length > 0){
                let dataList = this.state.dataList.concat(res.list)
                if(res.hasNextPage){
                    this.setState({
                        dataList:dataList,
                        hasNextPage:true,
                        pageNum:this.state.pageNum + 1
                    })
                }else{
                    this.setState({
                        dataList:dataList,
                        hasNextPage:false,
                        pageNum:this.state.pageNum
                    })
                }
            }
        })
    }
    composeParams = (isRefresh) => {
        let { listSource, solveType, searchVal, readOnly, assistantAuth, editFrom } = this.props
        let params = {
            pageNum: isRefresh ? 1 : this.state.pageNum,
            pageSize: isRefresh ? 50 * this.state.pageNum : 50,
            createTimeGreaterThanEqual:editFrom.timeStart,
            createTimeLessThanEqual:editFrom.timeEnd
        }
        if(readOnly){
            params.sourcePage = 1
            if(assistantAuth){
                params.sourcePage = 3
            }
            if(listSource === '0') {
                if(solveType === '0'){
                    params.hasFirstReplyTime = false
                }else if(solveType === '2'){
                    params.hasFirstReplyTime = true
                }
            }else if(listSource === '1') {
                params.assistName = searchVal
            }else if(listSource === '2') {
                let reg = /^[0-9]+.?[0-9]*$/
                let isHouseNo = reg.test(searchVal)
                if(isHouseNo){
                    params.houseNo = searchVal
                }else{
                    params.houseTitle = searchVal
                }
            }else if(listSource === '3') {
                params.keyword = searchVal
            }
        }else{
            params.replyTimeoutCount = true
            params.sourcePage = 2
            if(listSource === '0' && solveType) {
                params.customerServiceSolved = solveType
            }else if(listSource === '1') {
                params.assistName = searchVal
            }else if(listSource === '2') {
                let reg = /^[0-9]+.?[0-9]*$/
                let isHouseNo = reg.test(searchVal)
                if(isHouseNo){
                    params.houseNo = searchVal
                }else{
                    params.houseTitle = searchVal
                }
            }else if(listSource === '3') {
                params.keyword = searchVal
            }
        }
        return params
    }

    getTable = (ownParams, isRefresh) =>{
        let params = this.composeParams(isRefresh)
        if(ownParams){
            params = ownParams
            this.setState({
                activeIndex: 0,
                deleteStatus: false
            })
        }else{
            this.setState({
                deleteStatus: false
            })
        }
        imManagement.getTable(params).then((res)=>{
            let activeIndex = this.state.activeIndex
            if(res && res.list.length > 0){
                let hasNextPage, pageNum
                if(res.hasNextPage){
                    hasNextPage = true
                    pageNum = params.pageNum + 1
                }else{
                    hasNextPage = false
                    pageNum = params.pageNum
                }
                this.setState({
                    hasNextPage:hasNextPage,
                    pageNum: pageNum,
                    dataList: res.list
                })
                if(activeIndex >= res.list.length){
                    this.props.dispatch(chatContentAction(res.list[res.list.length - 1]))
                    this.setState({
                        activeIndex: res.list.length - 1
                    })
                }else{
                    this.props.dispatch(chatContentAction(res.list[activeIndex]))
                }
            }else{
                this.setState({
                    dataList: [],
                    contentList: []
                })
                this.props.dispatch(chatContentAction())
            }
            res && this.props.getCounts({
                replyTimeoutCount: res.replyTimeoutCount,
                total: res.total,
                solutionCount: res.solutionCount
            })
        })
    }
    itemChange = (index,item)=>{
        const { dataList } = this.state;
        let list = [...dataList]
        list.forEach((ite)=>{
            if(item === ite) {
                ite.unReadCount = 0
            }
        })
        this.setState({
            activeIndex: index,
            dataList: list
        })
        this.props.dispatch(chatContentAction(item))
    }
    receiveSession = (index,item) => {
        imManagement.receiveSession(item.id).then(() =>{
            let dataList = this.state.dataList
            dataList.splice(index, 1)
            this.setState({
                dataList
            })
            // this.props.changeSolveType('1')
            // this.refreshPage(this.getTable)
            this.getTable('', true)
            message.success('领取成功')
        }).catch(() => {
            message.error('领取失败')
            // this.refreshPage(this.getTable)
            this.getTable('', true)
        })
    }
    triggleIcon = (e, item) => {
        e.stopPropagation();
        const { deleteStatus, dataList } = this.state;
        if(deleteStatus) {
            dataList.forEach((itemData)=>{
                if(item.id === itemData.id) {
                    itemData.isSel = !itemData.isSel;
                }
            })
            this.setState({
                dataList
            })
        }
    }
    delAll = () => {
        this.setState({
            deleteStatus: true
        })
    }
    selAll = () => {
        const { dataList, deleteStatus } = this.state;
        if(deleteStatus) {
            let selAry = dataList.map(item => item.isSel)
            if(selAry.includes(undefined)){
                dataList.forEach((item, index)=>{
                    item.isSel = true
                })
            }else{
                dataList.forEach((item, index)=>{
                    item.isSel = undefined
                })
            }
            this.setState({
                dataList
            })
        }
    }
    conFirmSel = () => {
        const { dataList, deleteStatus } = this.state;
        let ids = [], filterAry = [], filterIdx = []
        filterAry = dataList.filter(item => item.isSel)
        ids = filterAry.map(item => item.id)
        dataList.forEach((item, index)=>{
            if(item.isSel) {
                filterIdx.push(index)
            }
        })
        filterAry = dataList.filter((item, index) => !filterIdx.includes(index));
        imManagement.delBatchData(ids).then((data) =>{
            message.success("操作成功")
            this.setState({
                dataList: filterAry
            })
        }).catch(err=> {

        })
    }
    cancelSel = () => {
        const { dataList, deleteStatus } = this.state;
        if(deleteStatus) {
            dataList.forEach((item, index)=>{
                item.isSel = undefined
            })
            this.setState({
                dataList,
                deleteStatus: false,
                delComfirmStatus: false
            })
        }
    }
    handleVisibleChange = (visible) => {
        if (!visible) {
            this.setState({ delComfirmStatus: visible });
            return;
        }
        const { dataList, deleteStatus } = this.state;
        let arrSel = []
        if(deleteStatus) {
            dataList.forEach((item, index)=>{
                if(item.isSel === true) {
                    arrSel.push(item.id)
                }
            })
        }
        if (deleteStatus) {
            if(checkType.isArray(arrSel) && arrSel.length) {
                this.setState({ delComfirmStatus: visible })
            }else {
                message.warning("请至少选择一项")
            }
        } else {
            this.cancel() // show the popconfirm
        }
    }
    confirm = () => {
        const that = this;
        this.setState({ delComfirmStatus: false }, function (){
            that.conFirmSel()
        });
    }
    cancel = () => {
        this.setState({ delComfirmStatus: false });
    }
    getPaltformTypeImg = (platformType) => {
        let img
        switch (platformType) {
            case 1: img = require("../../images/IM/5.png");break
            case 2: img = require("../../images/IM/5.png");break
            case 3: img = require("../../images/IM/5.png");break
            case 4: img = require("../../images/IM/5.png");break
            case 5: img = require("../../images/IM/2.png");break
            case 6: img = require("../../images/IM/3.png");break
            case 7: img = require("../../images/IM/4.png");break
            case 8: img = require("../../images/IM/1.png");break
            case 11: img = require("../../images/IM/5.png");break
            case 99: img = require("../../images/IM/6.png");break
            default: img = require("../../images/IM/5.png")
        }
        return img
    }
    render () {
        let self = this;
        const { dataList, deleteStatus } = this.state;
        const { listSource, solveType } = this.props;
        return (
            <div className="timeout" ref={function (res){self.listNode = res}}>
                <div className="timeout-list">
                    { solveType === '0' && listSource === '0' && global.role.includes('AUTH_CUSTOMER_SERVICE_MANAGER') && !this.props.readOnly ?
                    <Row className="operabtn" >
                        {
                            !deleteStatus && <Col><Button type="primary" onClick={this.delAll}>批量删除</Button></Col>
                        }
                        {
                            deleteStatus &&
                            <React.Fragment>
                                <Col><Button type="primary" onClick={this.selAll}>全选</Button></Col>
                                <Col>
                                    <Popconfirm title="确定删除?"
                                                onVisibleChange={this.handleVisibleChange}
                                                visible={this.state.delComfirmStatus} onConfirm={this.conFirmSel} okText="确认" cancelText="取消"
                                    >
                                        <Button type="primary">删除</Button>
                                    </Popconfirm>
                                </Col>
                                <Col><Button type="primary" onClick={this.cancelSel}>取消</Button></Col>
                            </React.Fragment>
                        }
                    </Row> : null
                    }
                    <div className="list-height">
                        {dataList.length > 0 ? dataList.map(function (item,index){
                            return <div className="item-content" key={index} onClick={function () {self.itemChange(index,item)}}>
                                <div className={parseInt(self.state.activeIndex,10) === parseInt(index,10) ? 'timeout-item active' : 'timeout-item'} >
                                { deleteStatus && listSource === '0' && solveType === '0' ? <div className={`fixed_left ${ item.isSel === true ? 'activeIndex' : '' }`} onClick={function (e) {self.triggleIcon(e, item)}}>
                                    <Icon type="check-circle" theme="filled" />
                                </div> : ''}
                                {
                                    item.customerServiceSolved === 0 && !self.props.readOnly &&
                                    <div className="fixed_right">
                                        <Button type="primary" size="small" onClick={function () {self.receiveSession(index,item)}}>待领取</Button>
                                    </div>
                                }
                                {/*{*/}
                                    {/*item.customerServiceSolved === 0 && !self.props.readOnly &&*/}
                                    {/*<div className="fixed_right_top">*/}
                                        {/*<div className="red">未解决</div>*/}
                                    {/*</div>*/}
                                {/*}*/}
                                {
                                    item.customerServiceSolved === 1 && !self.props.readOnly &&
                                    <div className="fixed_right_top">
                                        <div className="red">解决中</div>
                                    </div>
                                }
                                {
                                    item.customerServiceSolved === 2 && !self.props.readOnly &&
                                    <div className="fixed_right_top">
                                        <div className="blue">已解决</div>
                                    </div>
                                }
                                {
                                    (item.unReadCount !== null && item.unReadCount !== 0 && item.customerServiceSolved === 1 && item.customerServiceSolved === 1) &&
                                    <Badge className="badge" dot />
                                }
                                <Row className="content_box">
                                    <Col span={4} className="avatar_box">
                                        <Avatar icon="user" size={44} src={self.getPaltformTypeImg(item.platformType)} />
                                    </Col>
                                    <Col span={20}>
                                        <div className="order-status">
                                            <span className="status">{imOrderType[item.orderStatus]}</span>
                                            <span className="bar-icon">|</span>
                                            <span className="middleText">{item.bookingUserName}</span>
                                            <span className="small">{dataFormat(item.lastMessageTime,'YY/MM/DD HH:mm')}</span>
                                        </div>
                                        {
                                            self.props.readOnly && <p className="href">{item.lastMessage}</p>
                                        }
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
