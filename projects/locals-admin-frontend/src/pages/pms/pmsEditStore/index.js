
import React, {Component} from 'react'
import {Input, Form,Button,InputNumber,Radio,Divider,message,Search,Spin} from 'antd'
import {connect} from "react-redux"
import { withRouter } from 'react-router-dom'
// import PmsNav from '../components'
import {pmsService} from '../../../services'
import EditStoreForm from '../pmsStoreList/editStoreForm'
// import EditStore from '../pmsStoreList/editStoreForm';

class PmsEditStore extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editData:{
                hotelName:null,
                address:null,
                longitude:null,
                latitude:null,
                linkMan:null,
                linkPhone:null,
                currency: 'CNY',
                exchangeRate:null,
                hotelType: 1,
                overBooking:null,
                hotelNo:null,
                images: [{
                    module: "门店",
                    images: []
                }],
                fileLists: [],
                positions: {
                    longitude : null,
                    latitude : null
                }
            },
            loading: true,
            upteLoading: false
        }
        // this.storeId = props.match.params.id
        // this.storeName = props.match.params.name
        this.hotelId = this.props.hotelId
    }


       // // 组件渲染后调用
    componentDidMount (){
        this.getStoreInfo()
    }


    getStoreInfo = () =>{
        pmsService.getStoreInfo(this.hotelId).then((res) => {
            const {editData} = this.state
            editData.hotelName = res.hotelName
            editData.hotelEnName = res.hotelEnName
            editData.enAddress = res.enAddress
            editData.address = res.address
            editData.email = res.email
            editData.longitude = res.longitude
            editData.latitude = res.latitude
            editData.linkMan = res.linkMan
            editData.linkPhone = res.linkPhone
            editData.currency = res.currency
            editData.exchangeRate = res.exchangeRate
            editData.hotelType = res.hotelType
            editData.overBooking = res.overBooking
            editData.hotelNo = res.hotelNo
            pmsService.getStoreImage(this.hotelId).then((res) => {
                console.log('res',res)
                if(res !== null){
                    editData.images[0].images = res[0].images
                    editData.fileLists = res[0].images
                    this.setState({
                        editData: editData,
                        loading: false,
                        upteLoading: false
                    })
                }else{
                    this.setState({
                        editData: editData,
                        loading: false,
                        upteLoading: false
                    })
                }
            }).catch(err => {
                this.setState({ upteLoading: false})
                message.error('获取门店图片失败')
            })
        }).catch(err => {
            this.setState({
                upteLoading: false
            })
            message.error('获取门店信息失败')
        })
    }

    routerPaths = (e) =>{
        this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    }

    onChangeForms = (obj) =>{
        this.setState({
            upteLoading: true
        })
        console.log('刷新')
        this.getStoreInfo()
    }

    render () {
        const _this = this
        const {loading,upteLoading} = _this.state
        return (
            <div style={{position:'relative'}}>
                {
                    !loading ?
                        <EditStoreForm
                            type="EditStore"
                            data={this.state.editData}
                            saveforms={_this.onChangeForms}
                            id={this.hotelId}
                        />
                        :
                        <div style={{width:'100%',height:300,position:'absolute',left:0,top:0,zIndex:888,display:'flex',alignItems:'center',justifyContent: 'center'}}>
                            <Spin/>
                        </div>
                }
                {
                    upteLoading && <div className="pmsLoading">
                        <Spin/>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(PmsEditStore)
