import React, {Component} from 'react'
import {connect} from "react-redux"
import {message,Spin} from 'antd'
import { withRouter } from 'react-router-dom'
// import PmsNav from '../components'
import {pmsService} from '../../../services'
import PmsFacility from './pmsFacility'
import PmsStoreForm from '../pmsUnderHouse/pmsStoreForm'
import './index.less'

class PmsStoreFacility extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading:false,
            hotelInfo: {
                hotelName:null,
                address:null,
                longitude:null,
                latitude:null,
                linkMan:null,
                linkPhone:null,
                // currency: 'CNY',
                // exchangeRate:null,
                hotelType: 1,
                // overBooking:null,
                hotelNo:null
            }
        }
        // this.storeId = props.match.params.id
        // this.storeName = props.match.params.name
        this.hotelId = this.props.hotelId
    }

    // // 组件渲染后调用
    componentDidMount (){
        this.getStoreInfo()
    }

    routerPaths = (e) =>{
        this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    }

    getStoreInfo = () =>{
        this.setState({
            loading: true
        })
        pmsService.getStoreInfo(this.hotelId).then((res) => {
            const {hotelInfo} = this.state
            hotelInfo.hotelName = res.hotelName
            hotelInfo.address = res.address
            hotelInfo.longitude = res.longitude
            hotelInfo.latitude = res.latitude
            // editData.linkMan = res.linkMan
            // editData.linkPhone = res.linkPhone
            // editData.currency = res.currency
            // editData.exchangeRate = res.exchangeRate
            hotelInfo.hotelType = res.hotelType
            // editData.overBooking = res.overBooking
            hotelInfo.hotelNo = res.hotelNo
            this.setState({
                hotelInfo: hotelInfo,
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
            message.error('获取门店信息失败')
        })
    }

    render () {
        const {loading,hotelInfo} = this.state
        return (
            <div>
                {/*<PmsNav*/}
                    {/*current={'pmsStoreFacility'}*/}
                    {/*routerPath={this.routerPaths}*/}
                    {/*storeTitle={this.storeName}*/}
                {/*/>*/}
                {
                    !loading ?
                        <div>
                            <PmsStoreForm forms={hotelInfo}/>
                            <PmsFacility storeId = {this.hotelId} />
                        </div>
                        :
                        <div className="pmsLoading">
                            <Spin/>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(PmsStoreFacility)
