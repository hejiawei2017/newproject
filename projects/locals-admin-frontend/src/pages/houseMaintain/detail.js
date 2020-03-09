import React, { Component } from 'react'
import HandleFacility from './handleFacility';
import HandleRule from './handleRule';
import AAIHouseManagementSidebar from './selfSidebar';
import HandleStaff from './handleStaff';
import HandleBooking from './handleBooking';
import HandleOnlineStatus from './handleOnlineStatus';
import HandlePreOnline from './handlePreOnline';
import HandleSyncCalendar from './handleSyncCalendar';
import HouseAddress from './address'
import HouseBaseInfo from './baseInfo'
import HousePrices from './prices'
import HouseDescribe from './describe'
import HouseImages from './images'

import './index.less';
import AAIHouseManagementService from '../../services/aai-house-management-service';
const sideBarConfig = [
    {
    code:'address',
    text:'房源地址',
    apiKey:['syncAddressCheck']
},{
    code:'info',
    text:'房屋信息',
    apiKey:['syncRoomCheck']
},{
    code:'image-list',
    text:'图片上传',
    apiKey:['syncLocalsImageCheck','syncHorizontalImageCheck']
},{
    code:'description',
    text:'房源描述',
    apiKey:['syncDescCheck']
},{
    code:'price-n-activity',
    text:'价格&活动',
    apiKey:['syncPriceActCheck']
},{
    code:'facility',
    text:'配套设施',
    apiKey:['syncFacilityCheck']
},{
    code:'rule',
    text:'房屋守则',
    apiKey:['syncRuleCheck']
},{
    code:'booking',
    text:'预定设置',
    apiKey:[]
},{
    code:'staff',
    text:'人员设置',
    apiKey:['syncPeopleCheck']
},{
    code:'pre-online',
    text:'正式上线必填项',
    apiKey:[] // syncOtherCheck
},{
    code:'sync-calendar',
    text:'日历同步',
    apiKey:[] //syncCalendarCheck
},{
    code:'online-status',
    text:'各平台上线状态',
    apiKey:[]
}];
class AAIHouseManagement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            step: 'address',
            stepList: sideBarConfig,
            finishedStep:[],
            apiKeyList: sideBarConfig.map(val=>val.apiKey).toString().split(',')
        }
    }
    componentDidMount () {
        this.updateListInfo()()
    }

    handleNext (){
        const self = this;
        return function () {
            const {step,stepList} = self.state;
            const stepIndex = stepList.map(val=>val.code).indexOf(step);
            self.updateListInfo()();

            if(stepList.length !== stepIndex){
                self.setState({
                    step: stepList[stepIndex + 1].code
                },() =>{
                    const {step} = self.state;
                    if(typeof self.props.onSetDrawerTitle === 'function'){
                        const cbText = self.state.stepList.find(val=>val.code === step).text;
                        self.props.onSetDrawerTitle(cbText)
                    }
                })
            }

        }
    }
    updateListInfo (){
        const self = this;
        return function () {
            const { houseSourceId } = self.props;
            const { apiKeyList } = self.state;
            AAIHouseManagementService.getProgress(houseSourceId).then(res=>{
                const newFinishedStep = [];
                for(let key in res){
                    // console.log(key);
                    if(res[key] === 1 && apiKeyList.includes(key)){
                        newFinishedStep.push(key)
                    }
                }
                self.setState({
                    finishedStep:newFinishedStep
                })
            })
        }
    }
    switchShowCase (step){
        const nextCb = this.handleNext();
        const configMap = new Map()
            .set('facility',(houseId)=>(
                <HandleFacility
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseId={houseId}
                />
            ))
            .set('rule',(houseId)=>(
                <HandleRule
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            ))
            .set('staff',(houseId)=>(
                <HandleStaff
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            )).set('booking',(houseId)=>(
                <HandleBooking
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            )).set('online-status',(houseId)=>(
                <HandleOnlineStatus
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            )).set('pre-online',(houseId)=>(
                <HandlePreOnline
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            )).set('sync-calendar',(houseId)=>(
                <HandleSyncCalendar
                    onCloseDrawer={this.props.onCloseDrawer}
                    houseId={houseId}
                    nextCb={nextCb}
                />
            )).set('address',(houseId)=>(
                <HouseAddress
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseInfo={this.props.houseInfo}
                    houseSourceId={houseId}
                />
            )).set('info',(houseId)=>(
                <HouseBaseInfo
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseSourceId={houseId}
                />
            )).set('image-list',(houseId)=>(
                <HouseImages
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseInfo={this.props.houseInfo}
                    houseSourceId={houseId}
                />
            )).set('description',(houseId)=>(
                <HouseDescribe
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseSourceId={houseId}
                />
            )).set('price-n-activity',(houseId)=>(
                <HousePrices
                    onCloseDrawer={this.props.onCloseDrawer}
                    nextCb={nextCb}
                    houseSourceId={houseId}
                />
            ));

        return typeof configMap.get(step) === "function" && configMap.get(step) || (()=>{})
    }
    sideSwitch (){
       const self = this;
       return function (step) {
           self.setState({
               step
           },() =>{
               const {step} = self.state;
               if(typeof self.props.onSetDrawerTitle === 'function'){
                   const cbText = self.state.stepList.find(val=>val.code === step).text;
                   self.props.onSetDrawerTitle(cbText)
               }
           })
       }
    }
    render (){
        const {step,finishedStep,apiKeyList} = this.state;
        const {onSetDrawerTitle} = this.props;
        return <div className="flex-box">
            <AAIHouseManagementSidebar
                config={this.state.stepList}
                handleSwitch={this.sideSwitch()}
                houseId={this.props.houseSourceId}
                updateListInfo={this.updateListInfo()}
                finishedStep={finishedStep}
                apiKeyList = {apiKeyList}
                currentCode={this.state.step}
            />
            {this.switchShowCase(step)(this.props.houseSourceId)}
        </div>
    }
}
export default AAIHouseManagement
