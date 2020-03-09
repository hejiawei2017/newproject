import React, { Component } from 'react'
import PmsNav from '../components/pms-nav'
import PmsStoreHome from '../pmsStoreHome'
import PmsStoreState from '../pmsStoreState'
import PmsEditStore from '../pmsEditStore'
import PmsRoomMaintain from '../pmsRoomMaintain'
import PmsUnderHouse from '../pmsUnderHouse'
import PmsStoreFacility from '../pmsStoreFacility'
import PmsActivityList from '../pmsActivityList'
import PmsStaff from '../pmsStaff'
import { Order } from '../../../pages/index'

import './index.less'

class AAIHouseManagement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            step: 'pmsStoreState',
            finishedStep:[]
        }
    }
    componentDidMount () {
        // this.updateListInfo()()
    }


    switchShowCase (step){
        const configMap = new Map()
            // .set('pmsStoreHome',(hotelId)=>(
            //     <PmsStoreHome
            //         onCloseDrawer={this.props.onCloseDrawer}
            //         hotelId={hotelId}
            //     />
            //
            // ))
            .set('pmsStoreState',(hotelId)=>(
                <PmsStoreState
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsEditStore',(hotelId)=>(
                <PmsEditStore
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsRoomMaintain',(hotelId)=>(
                <PmsRoomMaintain
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                    hotelNo={this.props.hotelNo}
                    hotelType={this.props.hotelType}
                />
            )).set('pmsUnderHouse',(hotelId)=>(
                <PmsUnderHouse
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsStoreFacility',(hotelId)=>(
                <PmsStoreFacility
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsActivityList',(hotelId)=>(
                <PmsActivityList
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsOrder',(hotelId)=>(
                <Order
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            )).set('pmsStaff',(hotelId)=>(
                <PmsStaff
                    onCloseDrawer={this.props.onCloseDrawer}
                    hotelId={hotelId}
                />
            ))

        return typeof configMap.get(step) === "function" && configMap.get(step) || (()=>{})
    }
    // sideSwitch (){
    //     const self = this;
    //     return function (step) {
    //         self.setState({
    //             step
    //         },() =>{
    //             const {step} = self.state;
    //             if(typeof self.props.onSetDrawerTitle === 'function'){
    //                 const cbText = self.state.stepList.find(val=>val.code === step).text;
    //                 self.props.onSetDrawerTitle(cbText)
    //             }
    //         })
    //     }
    // }

    routerPaths = (e) =>{
        console.log('e',e)
        this.setState({ step: e })
        // console.log("/pms/" + e + this.storeName + "/" + this.storeId)
        //     this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    }
    render (){
        const {step,finishedStep,apiKeyList} = this.state;
        return (
            <div className="pms-container">
                <PmsNav
                    current={step}
                    routerPath={this.routerPaths}
                    // storeTitle={this.storeName}
                />
                {this.switchShowCase(step)(this.props.hotelId)}
            </div>
        )
    }
}
export default AAIHouseManagement
