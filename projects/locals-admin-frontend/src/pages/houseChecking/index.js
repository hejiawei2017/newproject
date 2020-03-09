import React, { Component } from 'react'
import { houseCheckingService } from '../../services'
import { Table, Button, message, Modal, Input, Form, notification, Row, Col, Carousel, Checkbox } from 'antd'
import { searchObjectSwitchArray, pageOption, dataFormat, checkKey, getFixNewImagePrefix, getNewImagePrefix, getSpeImagePrefix } from '../../utils/utils.js'
import {isStatus, isBeds, isBedsType, houseManageSearch} from '../../utils/dictionary'
import { connect } from "react-redux"
import Search from '../../components/search'
import { Map, Marker } from 'react-amap'
import './index.less'
import {equalsRoleExist, equalsUserExistSuperAuth} from "../../utils/getUserRole";
const FormItem = Form.Item
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group

const mapStateToProps = (state, action) => {
    return {
        houseListM: state.houseListM,
        imageListM: state.imageListM,
        dataDetail: state.dataDetail,
        imagesDetail: state.imagesNewAndOldDetail,
        horizontalImages: state.horizontalNewAndOldImages,
        facilities: state.facilities,
        allFacilities: state.allFacilities,
        memberHouses: state.memberHouses,
        bedsDetail: state.bedsDetail,
        auditRecords: state.auditRecords
    }
}

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源编号',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编号'
        },
        {
            type: 'text',
            name: '关键字',
            key: 'keyword',
            searchFilterType: 'string',
            placeholder: '请输入房源地址、标题'
        },
        {
            type: 'multiple-select',
            name: '上线状态',
            key: 'houseStatusIn',
            selectData: searchObjectSwitchArray(houseManageSearch.houseStatus),
            renderSelectData: houseManageSearch.houseStatus,
            searchFilterType: 'multiple-select',
            placeholder: '请选择上线状态'
        },{
            type: 'text',
            name: 'BU姓名/电话',
            key: 'bu',
            searchFilterType: 'string',
            placeholder: '请输入BU姓名/电话'
        },
        {
            type: 'text',
            name: '管家姓名/电话',
            key: 'assist',
            searchFilterType: 'string',
            placeholder: '请输入管家姓名/电话'
        }
    ],
    export: {
        name: '房源列表数据'
    }
}
const acceptAgeConfig = [{
    value: '1',
    label:'儿童',
    listId:'child'
},{
    value: '2',
    label:'老人',
    listId:'elder'
},{
    value: '3',
    label:'外宾',
    listId:'foreigner'
}];
const acceptSexConfig = [{
    value: '1',
    label:'男性',
    listId:'man'
},{
    value: '2',
    label:'女性',
    listId:'woman'
}]
class HouseChecking extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOpts,
            onlineVisible: false,
            swiperVisible: false,
            confirmVisible: false,
            confirmId: "",
            confirmStatus: "",
            confirmText: "",
            text: "",
            imgHeight: "",
            activeImg: 0,
            visible: false,
            btnStatus: true,
            showAll: "",
            showRecordsHistory: false,
            imgLeft: 0,
            imgIndex: 0,
            textareaValue: "",
            prevIndex: true,
            nextIndex: true,
            showAllHousing: true,
            address: '',
            loading: false,
            sorterA: 'desc',
            currentHouse: {}
        }
        this.checkAll = this.checkAll.bind(this)
        this.checkAllHousing = this.checkAllHousing.bind(this)
        this.statusSubmit = this.statusSubmit.bind(this)
        this.goto = this.goto.bind(this)
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
        this.swipeBigPic = null
    }
    componentDidMount () {
        this.getHouse()
    }
    // 点击排序
    handleChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            if (sorter.order === 'descend') {
                this.setState({
                    sorterA: 'desc'
                })
            } else if (sorter.order === 'ascend') {
                this.setState({
                    sorterA: 'asc'
                })
            }
            this.getHouse({ orderBy: (sorter.field + ' ' + this.state.sorterA) })
        } else {
            this.getHouse()
        }
    }
    getHouse (sortData) {
        let params = {
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...sortData
        }
        this.setState({ loading: true })
        houseCheckingService.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_HOUSE_SUCCESS',
                payload: data
            })
            this.setState({ loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }
    onSearch = (searchFields) => { // 搜索数据
        this.setState({
            pageNum: 1,
            searchFields: {
                keyword: searchFields.keyword.value,
                houseNo: searchFields.houseNo.value,
                bu: searchFields.bu.value,
                assist: searchFields.assist.value,
                houseStatusIn: !!searchFields.houseStatusIn.value ? searchFields.houseStatusIn.value.join(',') : undefined
            }
        }, this.getHouse)
    }
    preOnLine = (record) => () => {
        let self = this
        self.setState({
            loading: true,
            currentHouse: record
        })
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
                type: 'GET_NEW_OLD_IMAGES_SUCCESS',
                payload: data.imagesNewAndOld ? data.imagesNewAndOld : []
            })
            self.props.dispatch({
                type: 'GET_NEW_OLD_HORIZONTAL_SUCCESS',
                payload: data.horizontalImagesNewAndOld ? data.horizontalImagesNewAndOld : []
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
        }).catch(function () {
            self.setState({
                onlineVisible: false,
                loading: false
            })
        });
        houseCheckingService.getAuditLog(record.houseSourceId).then((data) => {
            if (data.length > 0) {
                let array = []
                for (let i = 0; i < data.length; i++) {
                    array.unshift(data[i])
                }
                self.props.dispatch({
                    type: 'GET_AUDITRECORDS_SUCCESS',
                    payload: array
                })
                self.setState({
                    textareaValue: typeof array[0].description === 'string' ? array[0].description.replace(/(null)/, '') : ''
                })
            } else {
                self.props.dispatch({
                    type: 'GET_AUDITRECORDS_SUCCESS',
                    payload: []
                })
                self.setState({
                    textareaValue: ""
                })
            }
        });
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
    toAuditLog = () => {
        this.setState({
            showRecordsHistory: true
        })
    }
    handleTextareaChange = (e) => {
        let val = e.target.value
        if (val === 'null' || val === 'undefined') val = ''
        this.setState({
            textareaValue: val
        })
    }
    success = () => {
        message.success('审核成功', 10);
    };
    statusSubmit (e) {
        let self = this
        const { dataDetail } = this.props
        let id = dataDetail.houseSourceId
        let status = dataDetail.houseWorkflowStatus
        let isT = e.currentTarget.getAttribute("data-key")
        let newStatus
        let conText
        if (isT === "Y") {
            if (status === 1) {
                newStatus = 2;
            } else if (status === 4) {
                newStatus = 5;
            } else if (status === 7) {
                newStatus = 5;
            }
            conText = "审核通过"
        } else if (isT === "N") {
            if (status === 1) {
                newStatus = 3;
            } else if (status === 4) {
                newStatus = 6;
            } else if (status === 7) {
                newStatus = 8
            }
            conText = "审核拒绝"
        }
        self.setState({
            confirmId: id,
            confirmStatus: newStatus,
            confirmText: conText,
            confirmVisible: true
        })
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
    handleCancel = (e) => {
        this.setState({
            visible: false,
            //onlineVisible: false,
            swiperVisible: false,
            confirmVisible: false,
            btnStatus: true,
            showAllHousing: true,
            showRecordsHistory: false,
            showAll: '',
            imgIndex: 0,
            imgLeft: 0
        })

        this.swipeBigPic.slick.slickGoTo(0)
        notification.destroy()
    }
    handleOk = () => {
        let self = this
        houseCheckingService.putAudit(self.state.confirmId, self.state.confirmStatus, self.state.textareaValue).then((data) => {
            self.success()
            self.setState({
                btnStatus: true,
                showAllHousing: true,
                confirmVisible: false,
                onlineVisible: false,
                showAll: ''
            })
            self.getHouse()
        })
    }
    handleOnlyCancel = () => {
        this.setState({
            confirmVisible: false
        })
    }
    renderConfirm = () => {
        return (
            <Modal
                title="审核确认"
                visible
                onOk={this.handleOk}
                onCancel={this.handleOnlyCancel}
            >
                <p style={{ fontSize: '16px', lineHeight: '28px' }}>确认{this.state.confirmText}？</p>
            </Modal>
        )
    }
    //预上线申请弹窗
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
                        {this.props.horizontalImages && this.props.horizontalImages.length > 0 ?
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
                                {this.props.horizontalImages && this.props.horizontalImages.length > 0 ? this.props.horizontalImages.length : 0}
                            </i>
                            张图片
                        </p>
                    </Col>
                </Row>
            </div>
        )
    }
    renderModalConfig = () => {
        const that = this
        const { dataDetail } = this.props
        const isRoomPreInfoExisted = (dataDetail.roomNumberPre && dataDetail.roomNumber !== dataDetail.roomNumberPre) || (dataDetail.livingNumberPre && dataDetail.livingNumberPre !== dataDetail.livingNumber) || (dataDetail.kitchenNumberPre && dataDetail.kitchenNumberPre !== dataDetail.kitchenNumber) || (dataDetail.roomNumberPre && dataDetail.roomNumberPre !== dataDetail.roomNumber) || (dataDetail.balconyNumberPre && dataDetail.balconyNumberPre !== dataDetail.balconyNumber) || (dataDetail.studyNumberPre && dataDetail.studyNumberPre !== dataDetail.studyNumber)
        const isToiletPreInfoExisted = (dataDetail.toiletNumberPre && dataDetail.toiletNumberPre !== dataDetail.toiletNumber) || (dataDetail.publicToiletNumberPre && dataDetail.publicToiletNumberPre !== dataDetail.publicToiletNumber)
        const toiletCountPre = (dataDetail.toiletNumberPre ? dataDetail.toiletNumberPre : 0) + (dataDetail.publicToiletNumberPre ? dataDetail.publicToiletNumberPre : 0)
        const toiletCount = (dataDetail.toiletNumber ? dataDetail.toiletNumber : 0) + (dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0)

        //判断床铺信息是否有修改
        let bedFlag = true
        if(!!dataDetail.bedsPre && !!dataDetail.beds) {
            let bedCodeArr = []
            let bedCodePreArr = []
            dataDetail.bedsPre.forEach(item => {
                bedCodePreArr.push(item.bedCode)
            })
            dataDetail.beds.forEach(item => {
                bedCodeArr.push(item.bedCode)
            })
            bedFlag = JSON.stringify(bedCodeArr) !== JSON.stringify(bedCodePreArr)
        }

        return (
            <div className="house-checking-config">
                <h4 className="ant-span-red">房屋信息</h4>
                <p>出租类型：
                {
                    dataDetail.houseTypePre && dataDetail.houseType !== dataDetail.houseTypePre ?
                        <span className="red">{isBedsType[dataDetail.houseTypePre]} <s className="nonuse">{isBedsType[dataDetail.houseType]}</s></span> :
                        <span>{ dataDetail.houseType ? isBedsType[dataDetail.houseType] : '空'}</span>
                }
                </p>
                <p>房屋面积：
                {
                    dataDetail.houseAreaPre && dataDetail.houseAreaPre !== dataDetail.houseArea ?
                        <span className="red">{dataDetail.houseAreaPre}㎡ <s className="nonuse">{dataDetail.houseArea}㎡</s></span> :
                        <span>{ dataDetail.houseArea ? dataDetail.houseArea + '㎡' : '无'}</span>
                }
                </p>
                <p>
                    房屋户型：
                    {
                        isRoomPreInfoExisted ?
                            <span className="red">
                                {!!dataDetail.roomNumberPre ? dataDetail.roomNumberPre : dataDetail.roomNumber ? dataDetail.roomNumber : 0}房
                                {!!dataDetail.livingNumberPre ? dataDetail.livingNumberPre : dataDetail.livingNumber ? dataDetail.livingNumber : 0}厅
                                {!!dataDetail.kitchenNumberPre ? dataDetail.kitchenNumberPre : dataDetail.kitchenNumber ? dataDetail.kitchenNumber : 0}厨
                                {!!toiletCountPre ? toiletCountPre : toiletCount}卫
                                {!!dataDetail.balconyNumberPre ? dataDetail.balconyNumberPre : dataDetail.balconyNumber ? dataDetail.balconyNumber : 0}阳台
                                {!!dataDetail.studyNumberPre ? dataDetail.studyNumberPre : dataDetail.studyNumber ? dataDetail.studyNumber : 0}书房
                                <s className="nonuse">
                                    {!!dataDetail.roomNumber ? dataDetail.roomNumber : 0}房
                                    {!!dataDetail.livingNumber ? dataDetail.livingNumber : 0}厅
                                    {!!dataDetail.kitchenNumber ? dataDetail.kitchenNumber : 0}厨
                                    {!!toiletCount ? toiletCount : 0}卫
                                    {!!dataDetail.balconyNumber ? dataDetail.balconyNumber : 0}阳台
                                    {!!dataDetail.studyNumber ? dataDetail.studyNumber : 0}书房
                                </s>
                            </span> :
                            <span>
                                {!!dataDetail.roomNumber ? dataDetail.roomNumber : 0}房
                                {!!dataDetail.livingNumber ? dataDetail.livingNumber : 0}厅
                                {!!dataDetail.kitchenNumber ? dataDetail.kitchenNumber : 0}厨
                                {!!toiletCount ? toiletCount : 0}卫
                                {!!dataDetail.balconyNumber ? dataDetail.balconyNumber : 0}阳台
                                {!!dataDetail.studyNumber ? dataDetail.studyNumber : 0}书房
                            </span>
                    }
                </p>
                <p>
                    卫生间：
                    {
                        isToiletPreInfoExisted ?
                            <span className="red">
                                {!!dataDetail.toiletNumberPre ? dataDetail.toiletNumberPre : dataDetail.toiletNumber ? dataDetail.toiletNumber : 0}独立卫生间
                                {!!dataDetail.publicToiletNumberPre ? dataDetail.publicToiletNumberPre : dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0}公共卫生间
                                <s className="nonuse">
                                    {!!dataDetail.toiletNumber ? dataDetail.toiletNumber : 0}独立卫生间
                                    {!!dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0}公共卫生间
                                </s>
                            </span> :
                            <span>
                                {!!dataDetail.toiletNumber ? dataDetail.toiletNumber : 0}独立卫生间
                                {!!dataDetail.publicToiletNumber ? dataDetail.publicToiletNumber : 0}公共卫生间
                            </span>
                    }
                </p>
                <p>
                    床铺数：
                    {
                        dataDetail.bedNumberPre && dataDetail.bedNumberPre !== dataDetail.bedNumber ?
                        <span className="red">{dataDetail.bedNumberPre}张床<s className="nonuse">{dataDetail.bedNumber}张床</s></span> :
                        <span>{!!dataDetail.bedNumber ? (dataDetail.bedNumber + '张床') : '0张床'}</span>
                    }
                </p>
                <p>
                    床型：
                    {
                        bedFlag && dataDetail.bedsPre && dataDetail.bedsPre.length > 0 ? dataDetail.bedsPre.map(function (item, index) {
                            return <span className="red" key={'beds_pre_' + index}> {isBeds[item.bedCode]}{index !== (dataDetail.bedsPre.length - 1) ? ',' : '' }</span>
                        }) : null
                    }
                    {
                        bedFlag && dataDetail.bedsPre && dataDetail.beds && dataDetail.bedsPre.length > 0 ? <s className="nonuse">
                            {
                                dataDetail.beds.map(function (item, index) {
                                    return isBeds[item.bedCode] + (index !== (dataDetail.beds.length - 1) ? ',' : '')
                                })
                            }
                        </s> : null
                    }
                    {
                         (!bedFlag || !dataDetail.bedsPre || dataDetail.bedsPre && dataDetail.bedsPre.length === 0) && dataDetail.beds && dataDetail.beds.length > 0 ? dataDetail.beds.map(function (item, index) {
                            return <span key={'beds_' + index}> {isBeds[item.bedCode]}{index !== (dataDetail.beds.length - 1) ? ',' : '' }</span>
                        }) : null
                    }
                </p>
                <p>
                    宜住人数：
                    {
                        dataDetail.tenantNumberPre && dataDetail.tenantNumberPre !== dataDetail.tenantNumber ?
                        <span className="red">宜住{dataDetail.tenantNumberPre}人<s className="nonuse">宜住{dataDetail.tenantNumber}人</s></span> :
                        <span>宜住{!!dataDetail.tenantNumber ? dataDetail.tenantNumber : 0}人</span>
                    }
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
                            <td>
                                {
                                    dataDetail.titlePre && dataDetail.titlePre !== dataDetail.title
                                        ? (
                                            <div className="title">
                                                <p className="red">{dataDetail.titlePre}</p>
                                                <p><s>{dataDetail.title}</s></p>
                                            </div>
                                        )
                                        : (
                                            <div className="title">
                                                <p>{dataDetail.title ? dataDetail.title : '空'}</p>
                                            </div>
                                        )
                                }
                                <span>空</span>
                            </td>
                        </tr>
                        <tr>
                            <th>Airbnb标题</th>
                            <td>
                                {dataDetail.airbnbTitlePre && dataDetail.airbnbTitlePre !== dataDetail.airbnbTitle
                                    ? (
                                        <div className="title">
                                            <p className="red">{dataDetail.airbnbTitlePre}</p>
                                            <p><s>{dataDetail.airbnbTitle}</s></p>
                                        </div>
                                    )
                                    : (
                                        <div className="title">
                                            <p>{dataDetail.airbnbTitle ? dataDetail.airbnbTitle : '空'}</p>
                                        </div>
                                    )
                                }
                                {dataDetail.airbnbEnTitlePre && dataDetail.airbnbEnTitlePre !== dataDetail.airbnbEnTitle
                                    ? (
                                        <div>
                                            <span className="red">{dataDetail.airbnbEnTitlePre}</span>
                                            <span><s>{dataDetail.airbnbEnTitle}</s></span>
                                        </div>
                                    ) : (
                                        <div>
                                            <span>{dataDetail.airbnbEnTitle ? dataDetail.airbnbEnTitle : '空'}</span>
                                        </div>
                                    )
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>booking标题</th>
                            <td>
                                {
                                    dataDetail.bookingTitlePre && dataDetail.bookingTitlePre !== dataDetail.bookingTitle
                                        ? (
                                            <div className="title">
                                               <p className="red">{dataDetail.bookingTitlePre}</p>
                                                <p><s>{dataDetail.bookingTitle}</s></p>
                                            </div>
                                        )
                                        : (
                                            <div className="title">
                                                <p>{dataDetail.bookingTitle ? dataDetail.bookingTitle : '空'}</p>
                                            </div>
                                        )}
                                {dataDetail.bookingEnTitlePre && dataDetail.bookingEnTitlePre !== dataDetail.bookingEnTitle
                                    ? (
                                        <div>
                                            <span className="red">{dataDetail.bookingEnTitlePre}</span>
                                            <span><s>{dataDetail.bookingEnTitle}</s></span>
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <span>{dataDetail.bookingEnTitle ? dataDetail.bookingEnTitle : '空'}</span>
                                        </div>
                                    )}
                            </td>
                        </tr>
                        <tr>
                            <th>途家标题</th>
                            <td>
                                {dataDetail.tujiaTitlePre && dataDetail.tujiaTitle !== dataDetail.tujiaTitlePre
                                    ? (
                                        <div className="title">
                                            <p className="red">{dataDetail.tujiaTitlePre}</p>
                                            <p><s>{dataDetail.tujiaTitle}</s></p>
                                        </div>
                                    )
                                    : (
                                        <div className="title">
                                            <p>{dataDetail.tujiaTitle ? dataDetail.tujiaTitle : '空'}</p>
                                        </div>
                                    )}
                                {dataDetail.tujiaEnTitlePre && dataDetail.tujiaEnTitlePre !== dataDetail.tujiaEnTitle
                                    ? (
                                        <div>
                                            <span className="red">{dataDetail.tujiaEnTitlePre}</span>
                                            <span><s>{dataDetail.tujiaEnTitle}</s></span>
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <span>{dataDetail.tujiaEnTitle ? dataDetail.tujiaEnTitle : '空'}</span>
                                        </div>
                                    )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    renderModalHouseDescribe = () => {
        const { dataDetail } = this.props
        let modifiedSummaryPre = dataDetail.summaryPre ? dataDetail.summaryPre.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        let modifiedSummary = dataDetail.summary ? dataDetail.summary.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        let navigationInfoPre = dataDetail.navigationInfoPre ? dataDetail.navigationInfoPre.replace(/(\r\n)|(\n)/g,'<br>') : '空'
        let navigationInfo = dataDetail.navigationInfo ? dataDetail.navigationInfo.replace(/(\r\n)|(\n)/g,'<br>') : '空'

        let modifiedHousingCodePre = dataDetail.housingCodePre ? dataDetail.housingCodePre.replace(/\d+\b/g, m => '<br>' + m) : '空'
        let modifiedHousingCode = dataDetail.housingCode ? dataDetail.housingCode.replace(/\d+\b/g, m => '<br>' + m) : '空'

        return (
            <div className="house-checking-des">
                <div className="des-addr">
                    <h4 className="ant-span-red">房子地址</h4>
                    {
                        <div>
                            <p>
                                省份：
                                {
                                    dataDetail.provinceNamePre && dataDetail.provinceNamePre !== dataDetail.provinceName ?
                                        <span className="red">
                                            {dataDetail.provinceNamePre}
                                            <s className="nonuse">
                                                {dataDetail.provinceName}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.provinceName}</span>
                                }
                            </p>
                            <p>
                                城市：
                                {
                                    dataDetail.cityNamePre && dataDetail.cityNamePre !== dataDetail.cityName ?
                                        <span className="red">
                                            {dataDetail.cityNamePre}
                                            <s className="nonuse">
                                                {dataDetail.cityName}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.cityName}</span>
                                }
                            </p>
                            <p>
                                区域：
                                {
                                    dataDetail.districtNamePre && dataDetail.districtNamePre !== dataDetail.areaName ?
                                        <span className="red">
                                            {dataDetail.districtNamePre}
                                            <s className="nonuse">
                                                {dataDetail.districtName}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.districtName}</span>
                                }
                            </p>
                            <p>
                                街道：
                                {
                                    dataDetail.streetPre && dataDetail.streetPre !== dataDetail.street ?
                                        <span className="red">
                                            {dataDetail.streetPre}
                                            <s className="nonuse">
                                                {dataDetail.street}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.street}</span>
                                }
                            </p>
                            <p>
                                详细地址：
                                {
                                    dataDetail.addressPre && dataDetail.addressPre !== dataDetail.address ?
                                        <span className="red">
                                            {dataDetail.addressPre}
                                            <s className="nonuse">
                                                {dataDetail.address}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.address}</span>
                                }
                            </p>
                            <p>
                                门牌号：
                                {
                                    dataDetail.houseNumberPre && dataDetail.houseNumberPre !== dataDetail.houseNumber ?
                                        <span className="red">
                                            {dataDetail.houseNumberPre}
                                            <s className="nonuse">
                                                {dataDetail.houseNumber}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.houseNumber}</span>
                                }
                            </p>
                            <p>
                                英文地址：
                                {
                                    dataDetail.addressEnPre && dataDetail.addressEnPre !== dataDetail.addressEn ?
                                        <span className="red">
                                            {dataDetail.addressEnPre}
                                            <s className="nonuse">
                                                {dataDetail.addressEn}
                                            </s>
                                        </span> :
                                        <span>{dataDetail.addressEn}</span>
                                }
                            </p>
                        </div>
                    }
                </div>
                <div className="des-cont">
                    <h4 className="ant-span-red">房子描述</h4>
                    {dataDetail.summaryPre && dataDetail.summaryPre !== dataDetail.summary
                        ? (
                            <div>
                                { /* eslint-disable */}
                                <span className="red" dangerouslySetInnerHTML={{
                                    __html: modifiedSummaryPre
                                }}
                                >
                                </span>
                                <span>
                                    <s dangerouslySetInnerHTML={{
                                    __html: modifiedSummary
                                    }}
                                    >
                                    </s>
                                </span>
                            </div>
                        )
                        : (
                            <div>
                                <span dangerouslySetInnerHTML={{
                                    __html: modifiedSummary
                                }}
                                >
                                </span>
                            </div>
                        )
                    }
                </div>
                <div className="des-route des-item">
                    <h4 className="ant-span-red">乘车路线</h4>
                    {dataDetail.navigationInfoPre && dataDetail.navigationInfoPre !== dataDetail.navigationInfo
                        ? (
                            <div>
                                { /* eslint-disable */}
                                <span className="red" dangerouslySetInnerHTML={{
                                    __html: navigationInfoPre
                                }}
                                >
                                </span>
                                <span>
                                    <s dangerouslySetInnerHTML={{
                                        __html: navigationInfo
                                    }}
                                    >
                                    </s>
                                </span>
                            </div>
                        )
                        : (
                            <div>
                                <span dangerouslySetInnerHTML={{
                                    __html: navigationInfo
                                }}
                                >
                                </span>
                            </div>
                        )
                    }
                </div>
                <div className="des-park des-item">
                    <h4 className="ant-span-red">周边停车场推荐</h4>
                    {dataDetail.parkInfoPre && dataDetail.parkInfoPre !== dataDetail.parkInfo
                        ? (
                            <div>
                                <span className="red">{dataDetail.parkInfoPre}</span>
                                <span><s>{dataDetail.parkInfo}</s></span>
                            </div>
                        )
                        : (
                            <div>
                                <span>{dataDetail.parkInfo ? dataDetail.parkInfo : '空'}</span>
                            </div>
                        )}
                </div>
                <div className="des-rule des-item">
                    <h4 className="ant-span-red">房屋守则</h4>
                    {dataDetail.housingCodePre && dataDetail.housingCodePre !== dataDetail.housingCode
                        ? (
                            <div>
                                { /* eslint-disable */}
                                <span className="red" dangerouslySetInnerHTML={{
                                        __html: modifiedHousingCodePre
                                }}
                                >

                                </span>
                                <span>
                                    <s dangerouslySetInnerHTML={{
                                        __html: modifiedHousingCode
                                    }}
                                    >

                                    </s>
                                </span>
                            </div>
                        )
                        : (
                            <div>
                                <span dangerouslySetInnerHTML={{
                                    __html: modifiedHousingCode
                                }}
                                >

                                </span>
                            </div>
                        )}
                </div>
                <div className="des-way des-item">
                    <h4 className="ant-span-red">开门方式</h4>
                    {dataDetail.openDoorInfoPre && dataDetail.openDoorInfoPre !== dataDetail.openDoorInfo
                        ? (
                            <div>
                                <span className="red">{dataDetail.openDoorInfoPre}</span>
                                <span><s>{dataDetail.openDoorInfo}</s></span>
                            </div>
                        )
                        : (
                            <div>
                                <span>{dataDetail.openDoorInfo ? dataDetail.openDoorInfo : '空'}</span>
                            </div>
                        )}
                </div>
            </div>)
    }
    getfilterActive = (item, facilitiesList) => {
        let reItem = ""
        for (let i in facilitiesList) {
            if (item.code === facilitiesList[i].code) {
                reItem = "active"
            }
        }
        return reItem
    }
    renderFacilities = () => {
        let self = this
        let allArr = this.props.allFacilities
        let newReDom = [];

        //房源设施信息，如果pre有值，就展示pre数据，若pre没有值，就不展示
        let facilitiesList = !!this.props.dataDetail.facilitiesPre ? this.props.dataDetail.facilitiesPre : (!!this.props.dataDetail.facilities ? this.props.dataDetail.facilities : [])
        let reDom = allArr.map(function (item, index) {
            if (index < 12) {
                return <Col span={8} key={item.code} data-key={index} className={self.getfilterActive(item, facilitiesList)}>{item.name}</Col>
            } else {
                return <Col span={8} key={item.code} data-key={index} className={self.getfilterActive(item, facilitiesList)}>{item.name}</Col>
            }
        })
        for (let i in reDom) {
            for (let j in facilitiesList) {
                if (!!reDom[i] && reDom[i].key === facilitiesList[j].code) {
                    newReDom.push(reDom[i])
                    reDom.splice(i, 1)
                }
            }
        }
        let arr3 = newReDom.concat(reDom);
        return arr3
    }
    checkAll (e) {
        let rc = e.currentTarget.getAttribute("data-key")
        if (rc === "N") {
            this.setState({
                btnStatus: true
            })
        } else {
            this.setState({
                btnStatus: false
            })
        }
        this.rendShowAll();
    }
    checkAllHousing (e) {
        let rs = e.currentTarget.getAttribute("data-key")
        if (rs === 'N') {
            this.setState({
                showAllHousing: false
            })
        } else {
            this.setState({
                showAllHousing: true
            })
        }
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
        // 已做了兼容
        // fetch(aMapUrl).then(response => {//这里是个坑啊，必须要return response.json()，返回了响应体的内容
        //     return response.json();
        // }).
        houseCheckingService.getAdress(aMapUrl).then(function (data) {
            // console.log(data);
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
                                {dataDetail.standardPricePre ? <div>
                                    <span className={dataDetail.standardPricePre ? 'price red' : 'price'}>{dataDetail.standardPricePre}</span>
                                    <span className="price"><s>{dataDetail.standardPrice}</s></span>
                                </div> : <div>
                                    <span className="price">{dataDetail.standardPrice ? dataDetail.standardPrice : '空'}</span>
                                </div>}
                            </FormItem>
                            <FormItem label="周末价">
                                {dataDetail.weekPricePre ? <div>
                                    <span className={dataDetail.weekPricePre ? 'price red' : 'price'}>{dataDetail.weekPricePre}</span>
                                    <span className="price"><s>{dataDetail.weekPrice}</s></span>
                                </div> : <div>
                                    <span className="price">{dataDetail.weekPrice ? dataDetail.weekPrice : '空'}</span>
                                </div>}
                            </FormItem>
                            <FormItem label="清洁费">
                                {dataDetail.clearPricePre ? <div>
                                    <span className={dataDetail.clearPricePre ? 'price red' : 'price'}>{dataDetail.clearPricePre}</span>
                                    <span className="price"><s>{dataDetail.clearPrice}</s></span>
                                </div> : <div>
                                    <span className="price">{dataDetail.clearPrice ? dataDetail.clearPrice : '空'}</span>
                                </div>}
                            </FormItem>
                            <FormItem label="保证金">
                                {dataDetail.depositPre ? <div>
                                    <span className={dataDetail.depositPre ? 'price red' : 'price'}>{dataDetail.depositPre}</span>
                                    <span className="price"><s>{dataDetail.deposit}</s></span>
                                </div> : <div>
                                    <span className="price">{dataDetail.deposit ? dataDetail.deposit : '空'}</span>
                                </div>}
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
                                        {
                                            dataDetail.airbnbAccountPre
                                                ? (
                                                    <React.Fragment>
                                                        <span className={dataDetail.airbnbAccountPre ? 'price red' : 'price'}>{dataDetail.airbnbAccountPre}</span>
                                                        <span><s>{dataDetail.airbnbAccount}</s></span>
                                                    </React.Fragment>
                                                )
                                                : (
                                                    <span>
                                                        airbnb 账号：{dataDetail.airbnbAccount ? dataDetail.airbnbAccount : '空'}
                                                    </span>
                                                )
                                        }
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        {dataDetail.memberIntroduce ? <p>介绍：{dataDetail.memberIntroduce}</p> : <p>介绍：空</p>}
                    </div>
                    <div>
                        <Row gutter={24}>
                            <Col span={24} className="authentication">
                                <span>身份验证</span>
                                <div className="padd identity">
                                    {dataDetail.memberEmail ? <p>电子邮箱：{dataDetail.memberEmail}</p> : <p>电子邮箱：空</p>}
                                    {dataDetail.memberMobile ? <p>手机号码：{dataDetail.memberMobile}</p> : <p>手机号码：未验证</p>}
                                    {dataDetail.memberCerNumber ? <p>线下身份：{dataDetail.memberCerNumber}</p> : <p>线下身份：未验证</p>}
                                    {/* {dataDetail.memberLabel ? <p>路客钱包：{dataDetail.memberLabel}</p> : <p>路客钱包：空</p>} */}
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
                                    姓名：
                                    {dataDetail.designerPre ? <div>
                                        <span className={dataDetail.designer ? 'red' : ''}>{dataDetail.designerPre}</span>
                                        <span><s>{dataDetail.designer}</s></span>
                                    </div> : <div>
                                            <span>{dataDetail.designer ? dataDetail.designer : '空'}</span>
                                        </div>}
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    {dataDetail.designdesPre ? <div className="p">
                    <span className={dataDetail.designdes ? 'red' : ''}>介绍：{dataDetail.designdesPre}</span>
                        <span><s>介绍：{dataDetail.designdes}</s></span>
                    </div> : <div className="p">
                            {dataDetail.designdes ? <span>介绍：{dataDetail.designdes}</span> : <span>介绍：空</span>}
                        </div>}
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
                                    return <span key={index} className="setup">{item.clearerName ? item.clearerName  : '空'}--{item.clearerPhone ? item.clearerPhone : '空'}</span>
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
                        {dataDetail.doorIpPre && dataDetail.doorIp !== dataDetail.doorIpPre ?
                            <div>
                                <span className={dataDetail.doorIpPre ? 'door red' : 'door'}>{dataDetail.doorIpPre}</span>
                                <span className="door"><s>{dataDetail.doorIp}</s></span>
                            </div> :
                            <div className="door">
                                <span>{dataDetail.doorIp ? dataDetail.doorIp : '空'}</span>
                            </div>
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
    renderModalBookingSetting = () => {
        const { dataDetail } = this.props
        let acceptAgeList =  []
        let acceptSexList = []
        let tujiaDiscounts = []
        if(!!dataDetail.tujiaAcceptAgePre){
            acceptAgeList = dataDetail.tujiaAcceptAgePre.split(',')
        }else {
            if(!!dataDetail.tujiaAcceptAge) {
                acceptAgeList = dataDetail.tujiaAcceptAge.split(',')
            }
        }
        if(!!dataDetail.tujiaAcceptSexPre){
            acceptSexList = dataDetail.tujiaAcceptSexPre.split(',')
        }else {
            if(!!dataDetail.tujiaAcceptSex) {
                acceptSexList = dataDetail.tujiaAcceptSex.split(',')
            }
        }
        if(!!dataDetail.tujiaDiscountsPre) {
            tujiaDiscounts = dataDetail.tujiaDiscountsPre
        }else {
            if(!!dataDetail.tujiaDiscounts) {
                tujiaDiscounts = dataDetail.tujiaDiscounts
            }
        }
        return (
            <div>
                <div className="house-checking-setting">
                    <h4 className="ant-span-red">预定设置</h4>
                    {/*<h4 className="ant-span-red">途家预定设置</h4>*/}
                    {/*<p>最少入住天（房晚）数：<span className="red bold">{!!dataDetail.tujiaMinRequiredDaysPre ? dataDetail.tujiaMinRequiredDaysPre : dataDetail.tujiaMinRequiredDays}</span>晚</p>*/}
                    <Form>
                        {/*<FormItem label="连住优惠">*/}
                            {/*{*/}
                                {/*tujiaDiscounts.map((item,index) => {*/}
                                    {/*return (*/}
                                        {/*<p className="discount-rule" key={'discount_' + index}>*/}
                                            {/*最少住<span className="red bold">{item.stayDays}</span>天（晚），即可享房费+清洁费的*/}
                                            {/*<span className="red bold">{item.discountRatio}</span>%折扣；适用时间*/}
                                            {/*<span className="red bold">{dataFormat(item.bookingDateRangeStartDate)}至{dataFormat(item.bookingDateRangeEndDate)}</span>*/}
                                        {/*</p>*/}
                                    {/*)*/}
                                {/*})*/}
                            {/*}*/}
                        {/*</FormItem>*/}
                        <FormItem label="可接待房客类型">
                            <CheckboxGroup options={acceptAgeConfig} value={acceptAgeList} />
                        </FormItem>
                        <FormItem label="可接待房客性别">
                            <CheckboxGroup options={acceptSexConfig} value={acceptSexList} />
                        </FormItem>
                    </Form>
                </div>
                {/*<div className="house-checking-setting">*/}
                    {/*<h4 className="ant-span-red">Airbnb预定设置</h4>*/}
                    {/*<p>最少入住天（房晚）数：<span className="red bold">{dataDetail.airbnbDefaultMinNightsPre ? dataDetail.airbnbDefaultMinNightsPre : dataDetail.airbnbDefaultMinNights}</span>晚</p>*/}
                    {/*<p className="discount-rule">*/}
                        {/*周末最短入住天（房晚）数：<span className="red bold">{dataDetail.airbnbDefaultWeekendMinNightsPre ? dataDetail.airbnbDefaultWeekendMinNightsPre : dataDetail.airbnbDefaultWeekendMinNights}</span>天（晚）*/}
                        {/*<span className="discount-des">*针对包含星期五和星期六的预定</span>*/}
                    {/*</p>*/}
                    {/*<p className="discount-rule">*/}
                        {/*周连住优惠：<span className="red bold">{dataDetail.airbnbWeeklyPriceFactorPre ? dataDetail.airbnbWeeklyPriceFactorPre : dataDetail.airbnbWeeklyPriceFactor}</span>%折扣优惠*/}
                        {/*<span className="discount-des">*针对7天（房晚）及以上的预定</span>*/}
                    {/*</p>*/}
                    {/*<p className="discount-rule">*/}
                        {/*月连住优惠：<span className="red bold">{dataDetail.airbnbMonthlyPriceFactorPre ? dataDetail.airbnbMonthlyPriceFactorPre : dataDetail.airbnbMonthlyPriceFactor}</span>%折扣优惠*/}
                        {/*<span className="discount-des">*针对28天（房晚）及以上的预定</span>*/}
                    {/*</p>*/}
                {/*</div>*/}
            </div>
        )
    }
    renderModal = () => {
        let self = this
        const { dataDetail } = this.props
        const {currentHouse} = this.state

        return (
            <Modal className="ant-house-checking" title="房源上线申请" width="800px" visible bodyStyle={{ padding: "10px", minWidth: "800px" }} onCancel={self.handleDetailCancel} footer={[<span key="cancel" className="click-link" onClick={self.handleDetailCancel}>关闭</span>]}>
                <div className="ant-online-spply">
                    <h1>房源编号：{currentHouse.houseNoName}</h1>
                    <Row gutter={24}>
                        <Col span={18}>
                            {self.renderModalImg()}
                            {self.renderModalConfig()}
                            {self.renderModalTable()}
                            {self.renderModalHouseDescribe()}
                            {self.renderModalRules()}
                            {self.renderModalPrice()}
                            {self.renderModalBookingSetting()}
                            {self.renderModalPerson()}
                            {self.renderModalOther()}
                        </Col>
                        <Col span={6}>
                            {//当登录者为BU角色并且没有超级管理员和管理员权限，BU角色可以审批状态7这个节点，其他节点不可审批
                                ((!equalsRoleExist('ROLE_BU') || equalsUserExistSuperAuth(['AUTH_ADMIN','AUTH_SUPER','AUTH_ADMIN_HOUSE'])) && dataDetail.houseWorkflowStatus === 1) || ((!equalsRoleExist('ROLE_BU') || equalsUserExistSuperAuth(['AUTH_ADMIN','AUTH_SUPER','AUTH_ADMIN_HOUSE'])) && dataDetail.houseWorkflowStatus === 4) || dataDetail.houseWorkflowStatus === 7 ?
                                    <div>
                                        <Button type="primary" size="small" className="mr-sm mb" data-key="Y" onClick={self.statusSubmit}>审核通过</Button>
                                        <Button type="primary" size="small" className="mr-sm mb" data-key="N" onClick={self.statusSubmit}>审核拒绝</Button>
                                    </div> :
                                    <div>
                                        <Button type="primary" size="small" className="mr-sm mb" disabled>审核通过</Button>
                                        <Button type="primary" size="small" className="mr-sm mb" disabled>审核拒绝</Button>
                                    </div>
                            }
                            {self.props.auditRecords.length > 0 ? self.props.auditRecords.map(function (item, index) {
                                if (index === 0) {
                                    return <TextArea key={index} placeholder="请填写审核意见" value={self.state.textareaValue ? self.state.textareaValue : ''} rows={8} style={{ width: '158px', resize: 'none' }} onChange={self.handleTextareaChange} />
                                } else {
                                    return null
                                }
                            }) : <TextArea placeholder="请填写审核意见" value={self.state.textareaValue ? self.state.textareaValue : ''} rows={8} style={{ width: '158px', resize: 'none' }} onChange={self.handleTextareaChange} />
                            }
                            <p className="ant-span-red history" onClick={self.toAuditLog}>查看历史审核记录</p>
                            <div id="auditRecords-log" className={self.state.showRecordsHistory === true ? "showRecordsHistory" : ""}>
                                {self.props.auditRecords.length > 0 ? self.props.auditRecords.map(function (item, index) {
                                    return <div key={index}>
                                        <button>{isStatus[item.afterWorkFlowStatus]}</button>
                                        <p>时间：{dataFormat(item.createTime, "YYYY/MM/DD HH:MM:SS")}</p>
                                        <p>信息反馈：{item.description && item.description.replace(/(null)/, '')}</p>
                                    </div>
                                }) : <div>无更多历史审核信息</div>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
    goto (e) {
        let obj
        let self = this
        let nt = parseInt(e.currentTarget.getAttribute("data-key"), 10)
        if (e.currentTarget.getAttribute("data-status") === "I") {
            obj = self.props.imagesDetail
        } else {
            obj = self.props.horizontalImages
        }
        let imgLength = obj.length;
        if (nt >= (imgLength - 5)) {
            self.setState((prevState, props) => ({
                imgLeft: (imgLength - 5) * 60,
                imgIndex: nt
            }))
            self.swipeBigPic.slick.slickGoTo(nt)
        } else {
            self.setState((prevState, props) => ({
                imgLeft: nt * 60,
                imgIndex: nt
            }))
            self.swipeBigPic.slick.slickGoTo(nt)
        }
    }
    prev (e) {
        let self = this
        let obj
        if (e.currentTarget.getAttribute("data-status") === "I") {
            obj = self.props.imagesDetail
        } else {
            obj = self.props.horizontalImages
        }
        let imgLength = obj.length
        let index = parseInt(self.state.imgIndex - 1, 10)
        if (self.state.prevIndex === true) {
            self.setState({
                prevIndex: false
            })
            if (index >= (imgLength - 5)) {
                self.setState({
                    imgLeft: (imgLength - 5) * 60,
                    imgIndex: index
                })
                self.swipeBigPic.slick.slickPrev()
            } else if (index < (imgLength - 5) && index > 0) {
                self.setState({
                    imgLeft: index * 60,
                    imgIndex: index
                })
                self.swipeBigPic.slick.slickPrev()
            } else if (index === 0) {
                self.setState({
                    imgLeft: 0 * 60,
                    imgIndex: 0
                })
                self.swipeBigPic.slick.slickPrev()
            }
        }
        setTimeout(() => {
            self.setState({
                prevIndex: true
            })
        }, 1000);
    }
    next (e) {
        let self = this
        let obj
        if (e.currentTarget.getAttribute("data-status") === "I") {
            obj = self.props.imagesDetail
        } else {
            obj = self.props.horizontalImages
        }
        let imgLength = obj.length
        let index = parseInt(self.state.imgIndex + 1, 10)
        if (self.state.nextIndex === true) {
            self.setState({
                nextIndex: false
            })
            if (index <= (imgLength - 5)) {
                self.setState({
                    imgLeft: index * 60,
                    imgIndex: index
                })
                self.swipeBigPic.slick.slickNext()
            } else if (index > (imgLength - 5) && index < (imgLength - 1)) {
                self.setState({
                    imgLeft: (imgLength - 5) * 60,
                    imgIndex: index
                })
                self.swipeBigPic.slick.slickNext()
            } else if (index === (imgLength - 1)) {
                self.setState({
                    imgLeft: (imgLength - 5) * 60,
                    imgIndex: imgLength - 1
                })
                self.swipeBigPic.slick.slickNext()
            }
        }
        setTimeout(() => {
            self.setState({
                nextIndex: true
            })
        }, 1000);
    }
    //图片轮播
    renderModalSwiper = () => {
        let self = this
        return (
            <Modal title={self.state.text} width="800px" visible bodyStyle={{ padding: "10px" }} onCancel={self.handleCancel} footer={[<span key="cancel" className="click-link" onClick={self.handleCancel}>关闭</span>]}>
                <Carousel dots={false} ref={function (res) { self.swipeBigPic = res }}>
                    {self.state.text.indexOf("路客") !== -1 ? self.props.imagesDetail.map(function (item, index, key) {
                        return <div className="carousel-img" key={index}>
                            <img className="wsm-full ant-masonry-cell" style={{ width: 'auto', height: '500px', margin: '0 auto' }} src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..." />
                            <div className="img-p">
                                <p>{`【${item.module}】${item.description}`}</p>
                            </div>
                        </div>
                    }) : self.props.horizontalImages && self.props.horizontalImages.map(function (item, index, key) {
                        return <div className="carousel-img" key={index}>
                            <img className="wsm-full ant-masonry-cell" style={{ width: 'auto', height: '500px', margin: '0 auto' }} src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..." />
                            <div className="img-p">
                                <p>{`【${item.module}】${item.description}`}</p>
                            </div>
                        </div>
                    })
                    }
                </Carousel>
                <div className="swiper-dots">
                    <div className="dots-img">
                        <ul style={{ width: self.state.imgHeight + 'px', left: -self.state.imgLeft + 'px' }}>
                            {self.state.text.indexOf("路客") !== -1 ? self.props.imagesDetail.map(function (item, index, key) {
                                return <li key={index} className={self.state.imgIndex === index ? "active" : ""} data-key={index} data-status="I" onClick={self.goto}>
                                    <img src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..." />
                                </li>
                            }) : self.props.horizontalImages && self.props.horizontalImages.map(function (item, index, key) {
                                return <li key={index} className={self.state.imgIndex === index ? "active" : ""} data-key={index} data-status="H" onClick={self.goto}>
                                    <img src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..." />
                                </li>
                            })
                            }
                        </ul>
                    </div>
                    {self.state.text.indexOf("路客") !== -1 ?
                        <div>
                            <div className="dots-left" data-status="I" onClick={self.prev}></div>
                            <div className="dots-right" data-status="I" onClick={self.next}></div>
                        </div>
                        :
                        <div>
                            <div className="dots-left" data-status="H" onClick={self.prev}></div>
                            <div className="dots-right" data-status="H" onClick={self.next}></div>
                        </div>
                    }
                </div>
            </Modal>
        )
    }
    // 主体
    render () {
        let self = this
        const scroll = {
            x: 1250,
            y: false
        }
        const columns = [{
            title: '房源编号',
            dataIndex: 'houseNoName',
            key: 'houseNoName',
            width: 150
        }, {
            title: '房源标题',
            dataIndex: 'title',
            key: 'title',
            width: 350
        }, {
            title: '房源地址',
            dataIndex: 'address',
            key: 'address',
            width: 350
        }, {
            title: 'BU总管',
            dataIndex: 'bu',
            key: 'bu',
            width: 150
        }, {
            title: '助理',
            dataIndex: 'assist',
            key: 'assist',
            width: 150
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            sorter: true
        }, {
            title: '状态',
            dataIndex: 'houseStatus',
            key: 'houseStatus',
            width: 180,
            render: val => <span>{isStatus[val]}</span>
        }, {
            title: '操作',
            width: 200,
            fixed: 'right',
            render: function (record) {
                if (record.houseWorkflowStatus === 1) {
                    return (
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                className="mr-sm"
                                onClick={self.preOnLine(record)}
                            >预上线审核中</Button>
                        </div>
                    )
                } else if (record.houseWorkflowStatus === 4) {
                    return (
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                className="mr-sm"
                                onClick={self.preOnLine(record)}
                            >正式上线审核中</Button>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                className="mr-sm"
                                onClick={self.preOnLine(record)}
                            >详情</Button>
                        </div>
                    )
                }
            }
        }]
        searchConfig.columns = columns
        const pageObj = {
            total: Number(this.props.houseListM.total || 0),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.getHouse)
            },
            onChange: (value, pageSize) => {
                this.setState({ 'pageNum': value, pageSize }, this.getHouse)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.houseListM.list)} />
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.houseListM.list)}
                    rowKey="houseSourceId"
                    pagination={pageObj}
                    onChange={this.handleChange}
                    loading={this.state.loading}
                />
                {this.state.confirmVisible && this.renderConfirm()}
                {this.state.onlineVisible && this.renderModal()}
                {this.state.swiperVisible && this.renderModalSwiper()}
            </div>
        )
    }
}
export default connect(mapStateToProps)(HouseChecking)
