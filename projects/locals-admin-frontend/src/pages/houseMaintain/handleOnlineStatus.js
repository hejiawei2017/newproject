import React, { Component } from 'react';
import { AAIHouseManagementService } from '../../services';
import { Row, Col,Button,Icon,Collapse,Timeline } from 'antd';
const Panel = Collapse.Panel;
const onlineStatusApiKeyDict = [
    {
        apiKey:'localStatus',
        apiValue:-1,
        explanation:'房源已下架',
        text:'房源已下架',
        listId:'localStatus--1'
    },{
        apiKey:'localStatus',
        apiValue:0,
        explanation:'预上线筹建中',
        text:'项目筹建',
        listId:'localStatus-0'
    },{
        apiKey:'localStatus',
        apiValue:1,
        explanation:'预上线审核中',
        text:'预上线审核中',
        listId:'localStatus-1'
    },{
        apiKey:'localStatus',
        apiValue:2,
        explanation:'预上线审核通过',
        text:'预上线通过',
        listId:'localStatus-2'
    },{
        apiKey:'localStatus',
        apiValue:3,
        explanation:'预上线审核拒绝',
        text:'预上线拒绝',
        listId:'localStatus-3'
    },{
        apiKey:'localStatus',
        apiValue:4,
        explanation:'上线审核中',
        text:'正式上线审核中',
        listId:'localStatus-4'
    },{
        apiKey:'localStatus',
        apiValue:5,
        explanation:'上线审核通过',
        text:'正式上线通过',
        listId:'localStatus-5'
    },{
        apiKey:'localStatus',
        apiValue:6,
        explanation:'上线审核拒绝',
        text:'正式上线拒绝',
        listId:'localStatus-6'
    },{
        apiKey:'localStatus',
        apiValue:7,
        explanation:'信息被修改,等待重新审核',
        text:'信息被修改,等待重新审核',
        listId:'localStatus-7'
    },{
        apiKey:'localStatus',
        apiValue:8,
        explanation:'信息被修改, 审核不通过',
        text:'信息被修改, 审核不通过',
        listId:'localStatus-8'
    },{
        apiKey:'airbnbStatus',
        apiValue:0,
        explanation:'未提交',
        text:'未提交',
        listId:'airbnbStatus-0'
    },{
        apiKey:'airbnbStatus',
        apiValue:1,
        explanation:'审核中',
        text:'审核中',
        listId:'airbnbStatus-1'
    },{
        apiKey:'airbnbStatus',
        apiValue:2,
        explanation:'审核通过',
        text:'审核通过',
        listId:'airbnbStatus-2'
    },{
        apiKey:'airbnbStatus',
        apiValue:3,
        explanation:'审核拒绝',
        text:'审核拒绝',
        listId:'airbnbStatus-3'
    },{
        apiKey:'bookingStatus',
        apiValue:0,
        explanation:'未提交',
        text:'未提交',
        listId:'bookingStatus-0'
    },{
        apiKey:'bookingStatus',
        apiValue:1,
        explanation:'审核中',
        text:'审核中',
        listId:'bookingStatus-1'
    },{
        apiKey:'bookingStatus',
        apiValue:2,
        explanation:'审核通过',
        text:'审核通过',
        listId:'bookingStatus-2'
    },{
        apiKey:'bookingStatus',
        apiValue:3,
        explanation:'审核拒绝',
        text:'审核拒绝',
        listId:'bookingStatus-3'
    },{
        apiKey:'tujiaStatus',
        apiValue:0,
        explanation:'未提交',
        text:'未提交',
        listId:'tujiaStatus-0'
    },{
        apiKey:'tujiaStatus',
        apiValue:1,
        explanation:'审核中',
        text:'审核中',
        listId:'tujiaStatus-0'
    },{
        apiKey:'tujiaStatus',
        apiValue:2,
        explanation:'审核通过',
        text:'审核通过',
        listId:'tujiaStatus-2'
    },{
        apiKey:'tujiaStatus',
        apiValue:3,
        explanation:'审核拒绝',
        text:'审核拒绝',
        listId:'tujiaStatus-3'
    }];
const logDict = [
    {key:'localStatus',text:'路客',listId:'localStatus',apiKey:'locals'},
    {key:'airbnbStatus',text:'Airbnb',listId:'airbnbStatus',apiKey:'airbnb'},
    {key:'bookingStatus',text:'booking',listId:'bookingStatus',apiKey:'booking'},
    {key:'tujiaStatus',text:'途家',listId:'tujiaStatus',apiKey:'tujia'}
];
class HandleOnlineStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dict: onlineStatusApiKeyDict,
            sets: logDict,
            status:{},
            activePanel:[],
            logs:{}
        }
    }
    componentDidMount () {
        this.updateInfo();
    }
    updateInfo (){
        const {houseId} = this.props;
        AAIHouseManagementService.getSyncStatus(houseId).then(res=>{
            console.log('getSyncStatus',res);
            this.setState({
                status:res
            })
        })
    }
    handleActiveChange (){
        const self = this;
        return function (activePidArr){
            // console.log(self.state,activePidArr);
            const {activePanel,sets} = self.state;
            const {houseId} = self.props;
            activePidArr.forEach(val=>{
                if(!Array.isArray(self.state[val])){
                    AAIHouseManagementService.getSyncLogs(houseId,{platform:sets.find(item=>item.key === val).apiKey}).then(res=>{
                        console.log('getSyncLogs',res);
                        if(res){
                            self.setState({
                                [val]:res.list.map((item,index)=>{
                                    item.listId = +new Date() + index;
                                    return item;
                                }),
                                [`${val}-meta`]:res
                            })
                        }else{
                            self.state[val] = [];
                        }
                    })
                }
            });
        }
    }

    renderLog (log,type){
        const {dict} = this.state;
        const match = dict.find(item=>(item.apiKey === type && +item.apiValue === +log.status));
        console.log('renderLog',match);
        return <div>
            <div className={`${this.getColorClass(match.apiValue)}`}>{match.text}</div>
            <div>{log.date}</div>
            <div>信息反馈：{log.desc}</div>
        </div>
    }
    loadMoreLog (type){
        const self = this;
        return function () {
            const {sets} = self.state;
            const {houseId} = self.props;
            const metaInfo = self.state[`${type}-meta`];
            const originalList = self.state[type];
            AAIHouseManagementService.getSyncLogs(houseId,{
                platform:sets.find(item=>item.key === type).apiKey,
                pageNum:metaInfo.current + 1
            }).then(res=>{
                console.log('loadMoreLog',res);
                if(res){
                    self.setState({
                        [`${type}-meta`]:res,
                        [type]:[...originalList,...res.list].map((item,index)=>{
                            if(!item.listId){
                                item.listId = +new Date() + index;
                            }
                            return item;
                        })
                    })
                }

            })
        }
    }
    getColorClass (key){
        const redColorList = [0,3,6,-1,8];
        if(redColorList.includes(key)){
            return 'text-color-warning'
        }
        return 'text-color-green'
    }

    render (){
        console.log('render');
        const {dict,sets,status,logs} = this.state;
        return <div className="width-full" style={{marginBottom: 50}}>
            <div>各平台上线状态</div>
            <hr/>
            <Collapse onChange={this.handleActiveChange()}>
                {sets.map(val=>{
                    const item = dict.find(item=>item.apiKey === val.key && +status[val.key] === +item.apiValue) || {};
                    // console.log(val,this.state[val.text]);
                    return (
                        <Panel
                            key={val.listId}
                            header={<div>
                                <span>{val.text} </span>
                                <span className={`${this.getColorClass(item.apiValue)}`}>{item && item.text || ''}</span>
                            </div>}
                        >
                            <Timeline>
                                {Array.isArray(this.state[val.key]) && this.state[val.key].map(log=>{
                                    console.log(log);
                                    return (
                                        <Timeline.Item key={`log-${log.listId}`}>
                                            {this.renderLog(log,val.key)}
                                        </Timeline.Item>
                                    )
                                }) }
                                {this.state[`${val.key}-meta`] && this.state[`${val.key}-meta`].hasNextPage && (
                                    <Timeline.Item ><Button onClick={this.loadMoreLog(val.key)}>更多</Button> </Timeline.Item>
                                )}
                            </Timeline>
                        </Panel>
                    )
                })}
            </Collapse>
        </div>
    }
}

export default HandleOnlineStatus
