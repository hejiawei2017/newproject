import React, {Component} from 'react';
import { Row, Col, Button, Modal, Form, Input } from 'antd';
import {longRentService} from '../../services'
import {ApprovalStatus, manageStatus, longRentalStatus} from '../../utils/dictionary'
import moment from 'moment'
import LayerPhotos from '../../components/layerPhotos'

const FormItem = Form.Item;
const { TextArea } = Input;
class ApprovalDetail extends Component{
    constructor (props){
        super(props);
        this.state = {
            visible:false,
            roomData:{},
            unitData:{},
            imageData:[],
            logData:[],
            title:"不通过原因",
            showPicture:false,
            picType:''
        };
    }
    componentDidMount () {
        const houseSourceId = this.props.detailItem.houseSourceId
        const houseNo = this.props.detailItem.houseNo
        longRentService.getLongRentalApprovalDetail({houseSourceId}).then(roomData => {
            this.setState({roomData})
        })
        longRentService.getLongRentalUnitDetail({houseNo}).then(unitData => {
            this.setState({unitData})
        })
        longRentService.getTextImages().then(imageData => {
            this.setState({imageData})
        })
        longRentService.getLongRentalLog({houseSourceId}).then(logData => {
            console.log(logData);
            this.setState({logData})
        })
    }

    handleOk=()=>{
        const {form} = this.props;
        console.log(form.getFieldValue('reason'));
        //todo add api cb
        this.hideModal();
    };
    handleCancel=()=>{
        this.hideModal();
    };
    handleSubmit=()=>{
        console.log(this.state);

    };
    hideModal=()=>{
        this.setState({
            visible:false
        })
    };
    showModal=()=>{
        this.setState({
            visible:true
        })
    };
    handleDisapproval=()=>{
        this.showModal()
    }

    renderModal=()=>{
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 }
            }
        };
        return (
            <FormItem
                {...formItemLayout}
            >
                {getFieldDecorator('reason', {
                    rules: [{
                        required: true, message: '请输入不通过原因'
                    }],
                    initialValue:''
                })(
                    <TextArea rows={5} placeholder={'请输入不通过原因'}/>
                )}
            </FormItem>
        )
    };
    showPic=(type)=>{
        return () => {
            const houseSourceId = this.props.detailItem.houseSourceId
            longRentService.getLongRentalImages({
                imageType: type === 'public' ? 0 : -1,
                houseSourceId
            }).then((data) => {
                console.log(data);
            })
            this.setState({
                showPicture:true,
                picType:type
            },()=>{
                console.log(this.state);
            })
        };
    };
    hidePic=()=>{
        this.setState({showPicture:false})
    };
    renderModify=({origin,ifModify,after})=>{
        if(origin !== after || ifModify){
            return (
                <div className="flex-inline">
                    <div className="del-red-line">{origin}</div>
                    &nbsp;
                    <div className="text-color-warning">{after}</div>
                </div>
            )
        }else {
            return origin
        }
    }
    orientationFormat = (text) => {
        if(text){
            text = text.split(',')
            text = text.map(item => {
                switch (item) {
                    case 'E': return '东'
                    case 'W': return '西'
                    case 'S': return '南'
                    case 'N': return '北'
                    case 'SE': return '东南'
                    case 'NE': return '东北'
                    case 'SW': return '西南'
                    case 'NW': return '西北'
                    case 'NIL': return '未知'
                    default: return '未知'
                }
            })
            return text.join(',')
        }
    }
    render () {
        const that = this
        const {roomData, unitData, imageData, showPicture, logData} = this.state;
        let testText = '××'
        return <div>
            <Row type="flex" justify="space-between">
                <Col >
                    <b>{roomData.cityName + '-' + roomData.areaName + '-' + roomData.neighbourhoodName + '-' + roomData.buildingNo + '号楼-' + roomData.unitNo + '单元-' + roomData.doorNumber}</b>
                </Col>
                <Col >
                    <div style={{margin:'0 20px'}}>{'状态：' + ApprovalStatus[roomData.houseWorkflowStatus]}</div>
                </Col>
            </Row>
            <hr />
            <div>
                <Row>
                    <Col span={10}>
                        <div>房源编码：{roomData.houseNo}</div>
                    </Col>
                    <Col span={10} push={4}>
                        <div>贝壳房屋信息ID：{roomData.beikeNo}</div>
                    </Col>
                </Row>
                <div>小区地址：{roomData.neighbourhoodAddress}</div>
                <div>房源位置：{roomData.cityName + roomData.neighbourhoodName}</div>
            </div>
            <hr />
            <div>
                <div ><b>整屋信息</b></div >
                <div >户型：{roomData.remouldRoomNumber}室{roomData.remouldLivingNumber}厅{roomData.remouldKitchenNumber}厨{roomData.remouldToiletNumber}卫 | {roomData.floor}/{roomData.totalFloors}层</div >
                <div >房屋朝向：{this.orientationFormat(roomData.orientation)}</div >
                {/*<div >房屋朝向：{this.renderModify({origin:testText,ifModify:true,after:testText})}</div >*/}
                <div >面积：{roomData.houseArea}㎡</div >
                <div >户型特点：{roomData.huxingCharacter === 0 ? '普通房屋' : roomData.huxingCharacter === 1 ? '半地下' : '全地下室'}</div >
                <div >
                    公共区图片：{testText}张
                    &nbsp;&nbsp;
                    <Button
                        onClick={this.showPic('public')}
                    >查看</Button>
                </div >

                <div >整屋配置：{roomData.decorationType === 1 ? '精装修' : ''}</div >
            </div>
            <hr />
            <div>
                <div ><b>出租单元信息</b></div >
                <div >经营状态：{manageStatus[unitData.manageStatus]}</div >
                <div >长租状态：{longRentalStatus[roomData.longRentalStatus]}</div >
                <div >可看时间：{unitData.availableVisitTime === 2 ? '随时可看房' : '预约可看房'}</div >
                <div >可入住时间：{moment(unitData.checkInDate).format('YYYY-MM-DD')}   租期：{unitData.minRentTime}个月-{unitData.maxRentTime}个月</div >
                <div >租客要求：{unitData.renterRequire}</div >
                <div >是否收取中介费：{unitData.agencyFee}</div >
                <div >服务内容：{unitData.serviceItem}</div >
                <div >长租租金：
                    {
                        unitData.unitPriceViews && unitData.unitPriceViews.map(item => {
                            return item.monthRentPrice
                        })
                    }
                </div >
                <div >房源设施：{unitData.rentUnitFacility}</div >
                <div >
                    房源图片：{testText}张
                    &nbsp;&nbsp;
                    <Button
                        onClick={this.showPic('source')}
                    >查看</Button>
                </div >
                <div >联系人：{unitData.contact} {unitData.contactPhone}</div >
            </div>
            <hr />
            <div>
                <div ><b>审批结果</b></div >
                {
                    logData.length && logData.map((item, index) => {
                        return (
                            <div key={index}>
                                <div>{item.approvaler},{ApprovalStatus[item.approvalStatus]}。{item.description}</div>
                                <div>{item.approvalTime}</div>
                            </div>
                        )
                    })
                }
            </div>
            <hr />
            <div>
                <Row type="flex" justify="space-between">
                    <Col >
                        <div>提交时间：{testText}</div>
                    </Col>
                    <Col >
                        <div>
                            <Button
                                onClick={this.handleSubmit}
                            >
                                审批通过
                            </Button >
                            &nbsp;&nbsp;&nbsp;
                            <Button
                                onClick={this.handleDisapproval}
                            >
                                不通过
                            </Button >
                        </div>
                    </Col>
                </Row>
            </div>
            <Modal
                title={this.state.title}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                {this.renderModal()}
            </Modal>
            {
                showPicture ?
                    <LayerPhotos imagesDetail={imageData} modalWidth={500} handleCancelPhotos={function () {
                        that.setState({
                            showPicture: false
                        })
                    }}
                    /> : null
            }
        </div>
    }
}
ApprovalDetail = Form.create()(ApprovalDetail)
export default ApprovalDetail
