import React, { Component } from 'react'
import { connect } from "react-redux"
import {dataFormat, getFixNewImagePrefix, getSpeImagePrefix} from "../../utils/utils";
import {Modal, Form, Row, Col, Checkbox} from 'antd'
import {isBeds, isBedsType} from "../../utils/dictionary";
import {notification} from "antd/lib/index";
import {houseCheckingService} from "../../services";
import { Map, Marker } from 'react-amap'

import './index.less'
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        houseListM: state.houseListM,
        imageListM: state.imageListM,
        dataDetail: state.dataDetail,
        imagesDetail: state.imagesDetail,
        horizontalImages: state.horizontalImages,
        facilities: state.facilities,
        allFacilities: state.allFacilities,
        memberHouses: state.memberHouses,
        bedsDetail: state.bedsDetail,
        auditRecords: state.auditRecords
    }
}
class HouseManageDetail extends Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            onlineVisible: false,
            showAllHousing: true,
            btnStatus: true
        }
    }
    componentDidMount () {
        this.props.onTRef(this)
    }

    preOnLine = (record) => () => {
        let self = this
        self.setState({ loading: true })
        houseCheckingService.getAllFacil().then((data) => {
            let getArr = []
            data.forEach((item) => {
                for (let i = 0; i < item.facilityItem.length; i++) {
                    getArr = getArr.concat(item.facilityItem[i])
                }
            })
            self.props.dispatch({
                type: 'GET_ALLFACILITIES_SUCCESS',
                payload: getArr
            });
        })
        houseCheckingService.houseImage(record.houseSourceId).then((data) => {
            self.props.dispatch({
                type: 'GET_IMAGE_SUCCESS',
                payload: data
            })
        });
        houseCheckingService.houseDetail(record.houseSourceId).then((data) => {
            self.setState({
                onlineVisible: true
            })
            self.props.dispatch({
                type: 'GET_DATA_SUCCESS',
                payload: data
            })
            self.props.dispatch({
                type: 'GET_IMAGES_SUCCESS',
                payload: data.images
            })
            self.props.dispatch({
                type: 'GET_HORIZONTAL_SUCCESS',
                payload: data.horizontalImages
            })
            self.props.dispatch({
                type: 'GET_FACILITIES_SUCCESS',
                payload: data.facilities
            })
            self.props.dispatch({
                type: 'GET_MEMBERHOUSE_SUCCESS',
                payload: data.memberHouses
            })
            self.props.dispatch({
                type: 'GET_BEDSDETAIL_SUCCESS',
                payload: data.beds
            })
            self.setState({ loading: false })
            self.getAdress()
        }).catch(function (err) {
            self.setState({
                onlineVisible: false,
                loading: false
            })
        });
    }
    checkAll = (e) => {
        this.setState({
            btnStatus: !this.state.btnStatus
        })
        this.rendShowAll()
    }
    checkAllHousing = (e) => {
        this.setState({
            showAllHousing: !this.state.showAllHousing
        })
    }
    rendShowAll = () => {
        if (this.state.btnStatus) {
            this.setState({
                showAll: 'showAll'
            })
        } else {
            this.setState({
                showAll: ""
            })
        }
    }
    getAdress = () => {
        let self = this
        const { dataDetail } = this.props
        let location = parseFloat(dataDetail.longitude) + ',' + parseFloat(dataDetail.latitude)
        const urlKey = 'key=796b8987073397da384a802341a8c4dc&poitype=all&radius=3000&output=json&extensions=all&roadlevel=0'
        const aMapUrl = urlKey + '&location=' + location;
        // fetch(aMapUrl).then(response => {//这里是个坑啊，必须要return response.json()，返回了响应体的内容
        //     return response.json();
        // }).then(function (data) {
        houseCheckingService.getAdress(aMapUrl).then(function (data) {
            //console.log(data);
            self.setState({
                address: data.formatted_address
            })
        }).catch(function (e) {
            self.setState({
                address: ""
            })
        });
        if (dataDetail.latitude >= 100) {
            self.setState({
                address: ""
            })
        }
    }
    renderFacilities = () => {
        let self = this
        let allArr = this.props.allFacilities
        let newReDom = [];
        let reDom = allArr.map(function (item, index) {
            if (index < 12) {
                return <Col span={8} key={item.code} data-key={index} className={self.getfilterActive(item)}>{item.name}</Col>
            } else {
                return <Col span={8} key={item.code} data-key={index} className={self.getfilterActive(item)}>{item.name}</Col>
            }
        })
        for (let i in reDom) {
            for (let j in self.props.facilities) {
                if (reDom[i] && reDom[i].key === self.props.facilities[j].code) {
                    newReDom.push(reDom[i])
                    reDom.splice(i, 1)
                }
            }
        }
        let arr3 = newReDom.concat(reDom);
        return arr3
    }
    getfilterActive = (item) => {
        let reItem = ""
        for (let i in this.props.facilities) {
            if (item.code === this.props.facilities[i].code) {
                reItem = "active"
            }
        }
        return reItem
    }
    renderModalRules = () => {
        let self = this
        const { dataDetail } = this.props
        let position
        if (dataDetail) {
            if (!dataDetail.latitude) {
                position = {
                    longitude: parseFloat(200),
                    latitude: parseFloat(200)
                }
            } else {
                position = {
                    longitude: parseFloat(dataDetail.longitude),
                    latitude: parseFloat(dataDetail.latitude)
                }
            }
        }
        return (
            <div className="house-checking-facilities">
                <div className="fal-fun">
                    <h4 className="ant-span-red">便利设施</h4>
                    <Row gutter={24} className={self.state.showAll}>
                        {self.props.allFacilities.length > 0 ? self.renderFacilities() : <div>暂无便利设施</div>
                        }
                    </Row>
                    {self.state.btnStatus === true ?
                        <div className="checkAll ant-span-red" data-key="Y" onClick={self.checkAll}>查看全部<span className="bottom"><i className="bottom-arrow1"></i><i className="bottom-arrow2"></i></span></div>
                        :
                        <div className="checkAll ant-span-red" data-key="N" onClick={self.checkAll}>收起<span className="top"><i className="top-arrow1"></i><i className="top-arrow2"></i></span></div>
                    }
                </div>
                <div id="amap">
                    <Map amapkey="3306de7f91c3ef8a5c5ca3c057dcedf1" center={position} zoom={14}>
                        <Marker position={position}></Marker>
                        {/* icon={require("../../images/locals.png")} */}
                    </Map>
                    <div className="address">
                        {/* {position.latitude >= parseFloat(100) ? <p></p> : <p>{self.state.address}</p>} */}
                        <p>{self.state.address}</p>
                    </div>
                </div>
            </div>
        )
    }
    renderModalPrice = () => {
        const { dataDetail } = this.props
        return (
            <div>
                <div className="house-checking-price" style={{marginBottom: 0}}>
                    <h4 className="ant-span-red">价格及相关费用</h4>
                    <span>
                        <Form layout="inline">
                            <FormItem label="日常价">
                                <span className="price">{dataDetail.standardPrice ? dataDetail.standardPrice : '空'}</span>
                            </FormItem>
                            <FormItem label="周末价">
                                <span className="price">{dataDetail.weekPrice ? dataDetail.weekPrice : '空'}</span>
                            </FormItem>
                            <FormItem label="清洁费">
                                <span className="price">{dataDetail.clearPrice ? dataDetail.clearPrice : '空'}</span>
                            </FormItem>
                            <FormItem label="保证金">
                                <span className="price">{dataDetail.deposit ? dataDetail.deposit : '空'}</span>
                            </FormItem>
                        </Form>
                    </span>
                </div>
                <div className="house-checking-price" style={{marginTop: 0}}>
                    <h4 className="ant-span-red">参与活动</h4>
                    <Row>
                        {
                            dataDetail.discounts && dataDetail.discounts.map((item,index) => {
                                return (
                                    <Col span={8} key={'discounts_' + index}>
                                        <Checkbox checked>{item.tagName}</Checkbox>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </div>
        )
    }
    renderModalPerson = () => {
        let self = this
        const { dataDetail } = this.props
        return (
            <div className="house-checking-person">
                <div className="person-landlord">
                    <div className="message">
                        <Row guttter={24}>
                            <Col span={3}>
                                {dataDetail.memberAvatar ? <img src={getSpeImagePrefix(dataDetail.memberAvatar)} alt="加载失败..." /> : <img src={require("../../images/locals.png")} alt="加载失败..." />}
                            </Col>
                            <Col span={21}>
                                <ul>
                                    <li>
                                        <i>姓名：{dataDetail.memberNickName ? dataDetail.memberNickName : '空'}</i>
                                        <span>职业：{dataDetail.memberLabel ? dataDetail.memberLabel : '空'}</span>
                                    </li>
                                    <li>
                                        <i>注册时间：{dataFormat(dataDetail.memberCreateTime, 'YYYY年MM月DD日')}</i>
                                        <span>airbnb 账号：{dataDetail.airbnbAccount ? dataDetail.airbnbAccount : '空'}</span>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        <p>介绍：{dataDetail.memberIntroduce ? dataDetail.memberIntroduce : '空'}</p>
                    </div>
                    <div>
                        <Row gutter={24}>
                            <Col span={24} className="authentication">
                                <span>身份验证</span>
                                <div className="padd identity">
                                    <p>电子邮箱：{dataDetail.memberEmail ? dataDetail.memberEmail : '空'}</p>
                                    <p>手机号码：{dataDetail.memberMobile ? dataDetail.memberMobile : '空'}</p>
                                    <p>线下身份：{dataDetail.memberCerNumber ? dataDetail.memberCerNumber : '未验证'}</p>
                                </div>
                            </Col>
                            <Col span={24} className="housing" style={{ paddingBottom: '26px' }}>
                                <span>TA的{self.props.memberHouses.length}个房源</span>
                                <div className={self.state.showAllHousing === true ? "padd otherHousing" : "padd"}>

                                    {self.props.memberHouses.length > 0 ? self.props.memberHouses.map(function (item, index) {
                                        return (
                                            <div className="landlord-house-wrap clear clearfix" key={index}>
                                                <div className="landlord-house-type">{isBedsType[item.houseType]}</div>
                                                <div className="landlord-house-title">{item.title}</div>
                                            </div>
                                        )
                                    }) : <div>暂无其他房源</div>
                                    }

                                </div>
                                {self.props.memberHouses.length > 4 ?
                                    self.state.showAllHousing === true ?
                                        <div className="checkAll ant-span-red" data-key="N" onClick={self.checkAllHousing}>展开<span className="bottom"><i className="bottom-arrow1"></i><i className="bottom-arrow2"></i></span></div>
                                        :
                                        <div className="checkAll ant-span-red" data-key="Y" onClick={self.checkAllHousing}>收起<span className="top"><i className="top-arrow1"></i><i className="top-arrow2"></i></span></div>
                                    :
                                    null
                                }
                            </Col>
                        </Row>
                    </div>
                    <div className="ant-label">
                        <span>房东</span>
                    </div>
                </div>
                <div className="person-designer">
                    <Row guttter={24}>
                        <Col span={3}>
                            {dataDetail.designNameImage ? <img src={getSpeImagePrefix(dataDetail.designNameImage)} alt="加载失败..." /> : <img src={require("../../images/locals.png")} alt="加载失败..." />}
                        </Col>
                        <Col span={21}>
                            <ul>
                                <li>
                                    姓名：<span>{dataDetail.designer ? dataDetail.designer : '空'}</span>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <div className="p">
                        介绍：{dataDetail.designdes ? dataDetail.designdes : '空'}
                    </div>
                    <div className="ant-label">
                        <span>设计师</span>
                    </div>
                </div>
                <div className="person-other">
                    <Form layout="inline">
                        <FormItem label="设计统筹设置">
                            <span className="setup">空</span>
                        </FormItem>
                        <FormItem label="卫生人员设置">
                            {
                                dataDetail.clearers && dataDetail.clearers.map((item, index) => {
                                    return <span key={index} className="setup">{item.clearerName ? item.clearerName : '空'}--{item.clearerPhone ? item.clearerPhone : '空'}</span>
                                })
                            }
                        </FormItem>
                        <FormItem label="辅助房东设置">
                            <span className="setup">{dataDetail.assistName ? dataDetail.assistName : '空'}--{dataDetail.assistPhone ? dataDetail.assistPhone : '空'}</span>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
    renderModalOther = () => {
        const { dataDetail } = this.props
        return (
            <div className="house-checking-other">
                <Form layout="inline">
                    <FormItem label="门锁编码（IP）">
                        <span>{dataDetail.doorIp ? dataDetail.doorIp : '空'}</span>
                    </FormItem>
                </Form>
            </div>
        )
    }

    renderModalImg = () => {
        return (
            <div className="house-checking-img">
                <Row gutter={24} type="flex" justify="space-around" align="middle">
                    <Col span={12}>
                        {this.props.imagesDetail.length > 0 ?
                            <div className="house-checking-img-list" onClick={this.showSwiper('【路客】图片（共' + this.props.imagesDetail.length + '张）')}>
                                <img src={getFixNewImagePrefix(this.props.imagesDetail[0].imgPath)} style={{ display: 'inline-block', width: '180px', height: '130px' }} alt="加载失败..." />
                                <p>【路客】图片</p>
                            </div>
                            :
                            <div className="house-checking-img-list" >
                                <span>无图片</span>
                                <p>【路客】图片</p>
                            </div>
                        }
                        <p>共<i className="ant-span-red">
                            {this.props.imagesDetail.length > 0 ? this.props.imagesDetail.length : 0}
                        </i>张图片</p>
                    </Col>
                    <Col span={12}>
                        {this.props.horizontalImages.length > 0 ?
                            <div className="house-checking-img-list" onClick={this.showSwiper('【横图】图片（共' + this.props.horizontalImages.length + '张）')}>
                                <img src={getFixNewImagePrefix(this.props.horizontalImages[0].imgPath)} style={{ display: 'inline-block', width: '180px', height: '130px' }} alt="加载失败..." />
                                <p>【横图】图片</p>
                            </div>
                            :
                            <div className="house-checking-img-list">
                                <span>无图片</span>
                                <p>【横图】图片</p>
                            </div>
                        }
                        <p>
                            共
                            <i className="ant-span-red">
                                {this.props.horizontalImages.length > 0 ? this.props.horizontalImages.length : 0}
                            </i>
                            张图片
                        </p>
                    </Col>
                </Row>
            </div>
        )
    }
    showSwiper = (tl) => () => {
        if (tl.indexOf("路客") !== -1) {
            this.setState({
                visible: false,
                btnStatus: true,
                showAll: '',
                swiperVisible: true,
                showAllHousing: true,
                showRecordsHistory: false,
                text: tl,
                imgIndex: 0,
                imgHeight: this.props.imagesDetail.length * 60
            })
        } else {
            this.setState({
                visible: false,
                btnStatus: true,
                showAll: '',
                swiperVisible: true,
                showAllHousing: true,
                showRecordsHistory: false,
                text: tl,
                imgIndex: 0,
                imgHeight: this.props.horizontalImages.length * 60
            })
        }
        notification.destroy()
    }
    // 关闭弹出框
    handleDetailCancel = (e) => {
        this.setState({
            //visible: false,
            onlineVisible: false,
            swiperVisible: false,
            confirmVisible: false,
            btnStatus: true,
            showAllHousing: true,
            showRecordsHistory: false,
            showAll: '',
            imgIndex: 0
        })
        notification.destroy()
    }
    renderModalConfig = () => {
        const that = this
        const { dataDetail } = this.props
        const toiletCount = (dataDetail.toiletNumber ? dataDetail.toiletNumber : 0) + (dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0)
        return (
            <div className="house-checking-config">
                <h4 className="ant-span-red">房屋信息</h4>
                <p>出租类型：{ dataDetail.houseType ? isBedsType[dataDetail.houseType] : '空'}
                </p>
                <p>房屋面积：{ dataDetail.houseArea ? dataDetail.houseArea + '㎡' : '无'}
                </p>
                <p>
                    房屋户型：
                    <span>
                        {!!dataDetail.roomNumber ? dataDetail.roomNumber : 0}房
                        {!!dataDetail.livingNumber ? dataDetail.livingNumber : 0}厅
                        {!!dataDetail.kitchenNumber ? dataDetail.kitchenNumber : 0}厨
                        {!!toiletCount ? toiletCount : 0}卫
                        {!!dataDetail.balconyNumber ? dataDetail.balconyNumber : 0}阳台
                        {!!dataDetail.studyNumber ? dataDetail.studyNumber : 0}书房
                    </span>
                </p>
                <p>
                    卫生间：
                    <span>
                        {!!dataDetail.toiletNumber ? dataDetail.toiletNumber : 0}独立卫生间
                        {!!dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0}公共卫生间
                    </span>
                </p>
                <p>
                    床铺数：
                    <span>{!!dataDetail.bedNumber ? (dataDetail.bedNumber + '张床') : '0张床'}</span>
                </p>
                <p>
                    床型：

                    {
                        dataDetail.beds && dataDetail.beds.length > 0 ? dataDetail.beds.map(function (item, index) {
                            return <span key={'beds_' + index}> {isBeds[item.bedCode]}{index !== (dataDetail.beds.length - 1) ? ',' : '' }</span>
                        }) : null
                    }
                </p>
                <p>
                    宜住人数：<span>宜住{!!dataDetail.tenantNumber ? dataDetail.tenantNumber : 0}人</span>
                </p>
            </div>
        )
    }
    renderModalTable = () => {
        const { dataDetail } = this.props

        return (
            <div className="house-checking-table">
                <table>
                    <tbody>
                    <tr>
                        <th>路客标题</th>
                        <td>{dataDetail.title ? dataDetail.title : '空'}</td>
                    </tr>
                    <tr>
                        <th>Airbnb标题</th>
                        <td>{dataDetail.airbnbEnTitle ? dataDetail.airbnbEnTitle : '空'}</td>
                    </tr>
                    <tr>
                        <th>booking标题</th>
                        <td>{dataDetail.bookingEnTitle ? dataDetail.bookingEnTitle : '空'}</td>
                    </tr>
                    <tr>
                        <th>途家标题</th>
                        <td>{dataDetail.tujiaEnTitle ? dataDetail.tujiaEnTitle : '空'}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    renderModalHouseDescribe = () => {
        const { dataDetail } = this.props

        let summary = dataDetail.summary ? dataDetail.summary.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        let navigationInfo = dataDetail.navigationInfo ? dataDetail.navigationInfo.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        let housingCode = dataDetail.housingCode ? dataDetail.housingCode.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        return (
            <div className="house-checking-des">
                <div className="des-cont">
                    <h4 className="ant-span-red">房子描述</h4>
                    <div>
                        <span dangerouslySetInnerHTML={{
                            __html: summary
                        }}
                        ></span>
                    </div>
                </div>
                <div className="des-route des-item">
                    <h4 className="ant-span-red">乘车路线</h4>
                    <div>
                        <span dangerouslySetInnerHTML={{
                            __html: navigationInfo
                        }}
                        ></span>
                    </div>
                </div>
                <div className="des-park des-item">
                    <h4 className="ant-span-red">周边停车场推荐</h4>
                        <div>
                            <span dangerouslySetInnerHTML={{
                                __html: dataDetail.parkInfo
                            }}
                            ></span>
                        </div>
                </div>
                <div className="des-rule des-item">
                    <h4 className="ant-span-red">房屋守则</h4>
                    <div>
                        <span dangerouslySetInnerHTML={{
                            __html: housingCode
                        }}
                        ></span>
                    </div>
                </div>
                <div className="des-way des-item">
                    <h4 className="ant-span-red">开门方式</h4>
                    <div>
                        <span dangerouslySetInnerHTML={{
                            __html: dataDetail.openDoorInfo
                        }}
                        ></span>
                    </div>
                </div>
            </div>
        )
    }
    render () {
        const self = this
        return (
            <Modal className="ant-house-manage-detail" title="房源详情" width="800px" visible={self.state.onlineVisible} bodyStyle={{ padding: "10px", minWidth: "800px" }} onCancel={self.handleDetailCancel} footer={[<span key="cancel" className="click-link" onClick={self.handleDetailCancel}>关闭</span>]}>
                <div className="ant-online-spply">
                    <Row gutter={24}>
                        <Col span={24}>
                            {self.renderModalImg()}
                            {self.renderModalConfig()}
                            {self.renderModalTable()}
                            {self.renderModalHouseDescribe()}
                            {self.renderModalRules()}
                            {self.renderModalPrice()}
                            {self.renderModalPerson()}
                            {self.renderModalOther()}
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}
export default connect(mapStateToProps)(HouseManageDetail)
