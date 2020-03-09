import React, {Component} from 'react'
import {Form,Modal,Button,Row, Col,Spin,message} from 'antd'
import {connect} from "react-redux"
import {serviceItemManage} from "../../../services"
import ServiceItemAddForm from './serviceItemAdd'
import SetCommonTemplate from './setCommonTemplate'
import DefaultTemplate from './defaultTemplate'
import SetTransportTemplate from './setTransportTemplate'
import Global from "../../../utils/Global"

const mapStateToProps = (state, action) => {
    return {
        serviceItemManageM: state.serviceItemManageM,
        areaM: state.areaM,
        cityM: state.cityM,
        serviceItemM:state.serviceItemM,
        getProviderListM:state.getProviderListM
    }
}

class ServiceDetailForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formData:[],
            areaList:[],
            addVisible:false,
            data:'',
            loading:true,
            propviderLoading:true,
            areaLoading:true,
            updateLoading:true,
            arrData:[],
            cityList:[],
            templatetypeid:'area'
        }
    }

    componentDidMount () {
        this.getDetail()
        this.getAreaList()
        this.getCityList()
        this.getProviderList()
    }

    // 获取table数据
    getProviderList () {
        serviceItemManage.getProviderList().then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_PROVIDER_LIST_SUCCESS',
                payload:data
            })
            this.setState({
                propviderLoading:false
            })
        })
    }
    getDetail () {
        serviceItemManage.getServiceItem(this.props.id).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_ITEM_SUCCESS',
                payload:data
            })
            this.setState({
                loading:false,
                updateLoading:false
            })
        })
    }


    // //获取城市接口
    getCityList () {
        serviceItemManage.getCity().then((data) => {
            this.props.dispatch({
                type: 'GET_CITY_SUCCESS',
                payload:data
            })
            const list = []
            data.map((item) => {
                list.push({
                    label: item.name,
                    value: item.bookvalue,
                    key:item.bookvalue
                })
                return list
            })
            this.setState({
                cityList:list
            })
        })
    }
    // //获取城市接口
    getAreaList () {
        serviceItemManage.getArea().then((data) => {
            this.props.dispatch({
                type: 'GET_AREA_SUCCESS',
                payload:data
            })
            this.buildAreaList (data.list)
        })
    }

    //更改城市字段模式
    buildAreaList (list){
        var arr = []
        list.map((item,index)=>{
            if(index < 3248 && (
                item.code !== "86"
                && item.code !== "124"
                && item.code !== "110100"
                && item.code !== "120100"
                && item.code !== "310100"
                && item.code !== "500100"
            )
            ){
                if( item.parentCode === "110100"){
                    arr.push({
                        label: item.name,
                        value: item.code,
                        code: item.code - 0,
                        parentCode:110000,
                        key:item.code
                    })
                }else if(item.parentCode === "120100") {
                    arr.push({
                        label: item.name,
                        value: item.code,
                        code: item.code - 0,
                        parentCode:120000,
                        key:item.code
                    })
                }else if(item.parentCode === "310100") {
                    arr.push({
                        label: item.name,
                        value: item.code,
                        code: item.code - 0,
                        parentCode:310000,
                        key:item.code
                    })
                }else if(item.parentCode === "500100") {
                    arr.push({
                        label: item.name,
                        value: item.code,
                        code: item.code - 0,
                        parentCode:500000,
                        key:item.code
                    })
                }else {
                    arr.push({
                        label: item.name,
                        value: item.code,
                        code: item.code - 0,
                        parentCode:item.parentCode - 0,
                        key:item.code
                    })
                }

            }
            return arr
        });
        arr.push({
            label:'中国',
            value:86,
            code: 86,
            parentCode:0,
            key:86
        })
        this.setState({
            areaLoading:false,
            arrData:arr
        })
    }


    // 停用
    onStatus = () => {
        const param = {
            id:this.props.serviceItemM.id,
            status:this.props.serviceItemM.status === 1 ? 0 : 1,
            updator:Global.userInfo.nickName,
            timeVersion:new Date().getTime(),
            version:this.props.serviceItemM.version
        }
        this.props.dispatch({
            type: 'STATUS_SERVICE_ITEM_MANAGE_ING'
        })
        serviceItemManage.statusServiceItem(param).then((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_ITEM_MANAGE_SUCCESS'
            })
            message.success('操作成功',0.5)
            this.getDetail()
        })
    }

    //编辑
    onEdit = () =>{
        this.setState({
            addVisible:true,
            dataType:true,
            data:{
                servicecode:this.props.serviceItemM.servicecode,
                servicename:this.props.serviceItemM.servicename,
                templatetypeid:this.props.serviceItemM.templatetypeid,
                id:this.props.serviceItemM.id,
                createTime:this.props.serviceItemM.createTime,
                version:this.props.serviceItemM.version
            }
        })
    }

    //关闭弹窗
    handleCancel = () => {
        this.setState({
            addVisible : false
        })
        this.getDetail()
    }
    handleUpdate = () => {
        this.setState({
            updateLoading:true
        })
        this.getDetail()
    }
    //上一步
    onLast = () => {
        this.props.onLast()
    }

    render () {
        let self = this
        const {visible, onCancel,getProviderListM,orgType} = this.props
        const {loading,propviderLoading,arrData,updateLoading,cityList} = this.state
        let _formData = loading === false ? this.props.serviceItemM : []
        let _disabled = loading === false && orgType === "service" && this.props.serviceItemM.templateList[0].id === null ? false : true

        return (
            <Modal
                visible={visible}
                title="服务商详情管理"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                width="840px"
                footer={[
                    orgType === "service" ?
                        <span
                            key="cancel"
                            className="click-link"
                            onClick={onCancel}
                        >
                        关闭
                        </span> :
                        <span
                            key="cancel"
                            className="click-link"
                            onClick={self.onLast}
                        >
                        上一步
                        </span>
                ]}
            >
                {
                    loading === false && updateLoading === false ?
                        <div>
                            <Row>
                                <Col xs={12}>
                                    {_formData.servicename}({_formData.servicecode})
                                </Col>
                                <Col xs={6}>
                                    {
                                        orgType === "service" && this.props.serviceItemM.templateList[0].id === null ?
                                            <Button
                                                key="linkBtn"
                                                size="small"
                                                type="primary"
                                                onClick={self.onEdit}
                                            >
                                                编辑
                                            </Button> : null
                                    }
                                </Col>
                                <Col xs={6} className="text-right">
                                    状态：{_formData.status === 0 ? '已停用' : '已激活'}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={6} className="pt5">
                                    {_formData.templatetypeid === 0 ? '普通服务模版' : '行李托运服务专用模板'}
                                </Col>
                                <Col xs={12} sm={6} className="pt5">
                                    操作人：{_formData.creator}
                                </Col>
                                <Col xs={12} sm={6} className="pt5">
                                    更新时间：{_formData.timeVersion}
                                </Col>
                                <Col xs={12} sm={6} className="pt5 text-right">
                                    {
                                        orgType === "service" ?
                                            <Button
                                                key="linkBtn"
                                                size="small"
                                                type="primary"
                                                onClick={self.onStatus}
                                            >
                                                {_formData.status === 0 ? '激活' : '停用'}
                                            </Button> : null
                                    }

                                </Col>
                            </Row>


                            <div className="padder-vt-lg">
                                {
                                    loading === false && this.props.serviceItemM.templateList.length > 0 ? this.props.serviceItemM.templateList.map(function (item,index){
                                        return (
                                            <DefaultTemplate
                                                data={item}
                                                id={_formData.id}
                                                k={index}
                                                key={index}
                                                disable={_disabled}
                                                orgType={orgType}
                                                areaList={_formData.templatetypeid === 0 ? arrData : cityList}
                                                onUpdate={self.handleUpdate}
                                                templatetypeid={_formData.templatetypeid}
                                                providerList={propviderLoading === false ? getProviderListM.list : ''}
                                            />
                                        )
                                    }) : null
                                }
                                {
                                    this.props.serviceItemM.templatetypeid === 0 ?
                                        <SetCommonTemplate
                                            id={_formData.id}
                                            orgType={orgType}
                                            onUpdate={self.handleUpdate}
                                            areaList={arrData}
                                            templatetypeid={_formData.templatetypeid}
                                            providerList={propviderLoading === false ? getProviderListM.list : ''}
                                        /> : null
                                }

                                {
                                    this.props.serviceItemM.templatetypeid === 1 ?
                                        <SetTransportTemplate
                                            id={_formData.id}
                                            orgType={orgType}
                                            onUpdate={self.handleUpdate}
                                            areaList={cityList}
                                            templatetypeid={_formData.templatetypeid}
                                            providerList={propviderLoading === false ? getProviderListM.list : ''}
                                        /> : null
                                }

                                {
                                    this.state.addVisible ?
                                        <ServiceItemAddForm
                                            dataType={this.state.dataType}
                                            visible={this.state.addVisible}
                                            data={this.state.data}
                                            onCancel={this.handleCancel}
                                        /> : null
                                }
                            </div>
                        </div> : <div className="text-center padder-v-lg">
                            <Spin size="large" style={{margin:"0 auto"}} />
                        </div>
                }

            </Modal>
        )
    }
}

let ServiceDetail = Form.create()(ServiceDetailForm)
export default connect(mapStateToProps)(ServiceDetail)