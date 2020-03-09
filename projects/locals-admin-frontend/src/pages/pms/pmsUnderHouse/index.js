
import React, {Component} from 'react'
import {Popover, Icon, message, Spin, Pagination} from 'antd'
import { Map, Markers } from 'react-amap';
import { withRouter } from 'react-router-dom'
import {pmsService} from '../../../services'
import PmsStoreHouseItem from './pmsStoreItem'
import PmsStoreForm from './pmsStoreForm'
import AddHouseForm from './addHouse'

class PmsUnderHouse extends Component {
    constructor (props) {
        super(props)
        this.state = {
            center: {
                "longitude":0,
                "latitude": 0
            },
            useCluster: false,
            uploading:false,
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
            },
            houseList: [],
            noneHouseList: [],
            updateLoading: false,
            paginationPage: 1
        }
        this.hotelId = this.props.hotelId
        // this.storeId = props.match.params.id
        // this.storeName = props.match.params.name
    }


    // // 组件渲染后调用
    // componentDidMount (){
    //     this.getStoreInfo()
    // }

    componentDidMount () {
        this.setState({
            loading : true
        })
        this.getStoreInfo()
    }

    routerPaths = (e) =>{
        this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    }

    getStoreInfo = () =>{
        pmsService.getStoreInfo(this.hotelId).then((res) => {
            console.log('res',res)
            const {hotelInfo} = this.state
            hotelInfo.hotelName = res.hotelName
            hotelInfo.hotelEnName = res.hotelEnName
            hotelInfo.address = res.address
            hotelInfo.enAddress = res.enAddress
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
                hotelInfo: hotelInfo
            })
            // if(res.hotelType !== 4){
                this.getYetStoreUnderHouse(this.hotelId) //获取该门店项目中已下挂的房源
                // this.getCanStoreUnderHouse(res.hotelNo,res.hotelType) //获取该门店项目中可下挂的房源
            // }else{
                this.setState({
                    hotelType : res.hotelType,
                    loading: false,
                    updateLoading: false
                })
            // }
        }).catch(err => {
            this.setState({
                loading: false,
                updateLoading: false
            })
            message.error('获取门店信息失败')
        })
    }

    //获取该门店项目中已经下挂的房源
    getYetStoreUnderHouse = (hotelNo,hotelType) =>{
        pmsService.getYetStoreUnderHouse(hotelNo,hotelType).then(res=>{
            if(res && res.length > 0){
                this.setState({
                    houseList: res && res || [],
                    loading: false,
                    center: {
                        "longitude": res[0].longitude ? res[0].longitude : 0,
                        "latitude": res[0].latitude ? res[0].latitude : 0
                    }
                })
            }else {
                this.setState({
                    houseList: res && res || [],
                    loading: false
                })
            }

        }).catch(err => {
            this.setState({ loading: false })
        })
    }


    // //获取该门店项目中可下挂的房源
    // getCanStoreUnderHouse = (hotelNo,hotelType) =>{ //获取该门店项目中可下挂的房源
    //     pmsService.getCanStoreUnderHouse(hotelNo,hotelType).then(res=>{
    //         this.setState({
    //             noneHouseList: res && res || []
    //         })
    //     }).catch(err => {})
    // };


    renderMarkerLayout = (extData) => {
        return (
            <Popover content={extData.title} placement="top" style={{width:200}}>
                {/*<Icon type="environment" theme="filled" style={{color:'#e84358',fontSize:'28px'}} />*/}
                <img src={require("../../../images/pms/map-icon-1.png")} alt=""/>
            </Popover>
        )
    };

    storeMarker (){
        const {houseList} = this.state;
        let markersArr = [];
        houseList.map((_item) => {
            markersArr.push({
                position:{
                    "longitude": _item.longitude ? _item.longitude : 0,
                    "latitude": _item.latitude ? _item.latitude : 0
                },
                title: _item.title ? _item.title : ''
            });
            return _item
        });
        return(
            <Map plugins={['ToolBar']} center={this.state.center} zoom={16}>
                <Markers
                    useCluster
                    markers={markersArr}
                    render={this.renderMarkerLayout}
                />
            </Map>
        )
    }

    delItem = (data) => {
        const houseList = this.state.houseList.filter(t => data !== t.id);
        this.setState({houseList})
    };

    onAdd = () =>{
        this.setState({
            visible: true
        })
    };


    handleOk = () =>{
        this.getStoreInfo();
        this.setState({
            visible: false,
            updateLoading: true,
            paginationPage: 1
        })
    };

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    };

    paginationChange = (page, pageSize) => {
        this.setState({paginationPage: page})
    };

    render () {
        let _self = this;
        const {hotelInfo,houseList,loading,updateLoading,visible,paginationPage,noneHouseList} = this.state;
        return (
            <div>
                {!loading ?
                        <div>
                            <PmsStoreForm forms={hotelInfo}/>
                            <div className="pms-form padder-vb-md" style={{padding:"0 20px 20px"}}>
                                <div style={{paddingBottom:20,fontSize:"16px",fontWeight:600}}>客房信息</div>
                                    {houseList.length > 0 ?
                                        <div style={{display:"flex"}}>
                                            <div style={{flex:1,paddingRight:20}}>
                                                <div className="pmsStoreHouse-list" style={{display:"flex",flexWrap:"wrap",alignItems:"flex-start"}}>
                                                    {
                                                        houseList.map( function (item,index) {
                                                            if((paginationPage * 8) > index && ((paginationPage - 1) * 8) <= index) {
                                                                return(
                                                                    <PmsStoreHouseItem
                                                                        hotelId={_self.hotelId}
                                                                        item={item}
                                                                        key={index}
                                                                        delItem={_self.delItem}
                                                                    />
                                                                )
                                                            }else {
                                                                return(<div key={index}/>)
                                                            }
                                                        })
                                                    }
                                                    <div style={{width:218,marginRight:15,marginBottom:15}}>
                                                        <div className="ant-card-bordered"
                                                             style={{
                                                                 width:122,
                                                                 height:122,
                                                                 backgroundColor:'rgba(0,0,0,.2)',
                                                                 marginBottom:15,
                                                                 cursor:'pointer',
                                                                 borderRadius: 4
                                                             }}
                                                             onClick={_self.onAdd}
                                                        >
                                                            <div className="displayFlexCenter" style={{paddingTop:40,width:122,height:60}}>
                                                                <Icon type="plus" style={{fontSize:40}} />
                                                            </div>
                                                            <div className="displayFlexCenter" style={{height:60,fontSize:13}}>
                                                                添加下架房源/房型
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Pagination style={{textAlign:'center'}} defaultPageSize={8} onChange={this.paginationChange} defaultCurrent={1} total={houseList ? houseList.length : 0} />
                                            </div>
                                            <div style={{width:460,height: 600}}>
                                                 {this.storeMarker()}
                                            </div>
                                        </div>
                                        :
                                        <div style={{width:218,marginRight:15,marginBottom:15}}>
                                            <div className="ant-card-bordered"
                                                 style={{
                                                     width:122,
                                                     height:122,
                                                     backgroundColor:'rgba(0,0,0,.2)',
                                                     marginBottom:15,
                                                     cursor:'pointer',
                                                     borderRadius: 4
                                                 }}
                                                 onClick={_self.onAdd}
                                            >
                                                <div className="displayFlexCenter" style={{paddingTop:40,width:122,height:60}}>
                                                    <Icon type="plus" style={{fontSize:40}} />
                                                </div>
                                                <div className="displayFlexCenter" style={{height:60,fontSize:13}}>
                                                    添加下架房源/房型
                                                </div>
                                            </div>
                                        </div>}
                            </div>
                        </div>
                        :
                        <div className="pmsLoading">
                            <Spin/>
                        </div>
                }
                {
                    visible ?
                        <AddHouseForm
                            hotelNo= {this.hotelId}
                            hotelInfo={hotelInfo}
                            houseList={houseList}
                            wrappedComponentRef={this.saveFormRef}
                            visible={visible}
                            onCancel={this.handleCancel}
                            onOk={this.handleOk}
                        /> : null
                }
                {
                    updateLoading && <div className="pmsLoading">
                        <Spin/>
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(PmsUnderHouse)
