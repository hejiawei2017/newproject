import React, { Component } from 'react'
import {houseListService} from '../../services'
import { Table,Button,message,Modal,Input, Form,notification, Tooltip} from 'antd'
import {pageOption,dataFormat,checkPhone} from '../../utils/utils.js'
import {connect} from "react-redux"
import {checkKey,envConfig} from "../../utils/utils"
import Search from '../../components/search'
import {newRentTyep} from '../../utils/dictionary'
import { Map, Marker } from 'react-amap'
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        houseListM: state.houseListM,
        imageListM: state.imageListM,
        detailListM: state.detailListM,
        detailDesigerM: state.detailDesigerM,
        editAppM: state.editAppM
    }
}

const EditCreateForm = Form.create()(
    class extends React.Component {
        render () {
            const { editVisible, onCancel, onCreate, form } = this.props
            const { getFieldDecorator } = form
            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 6 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span:18 }
                }
            }
            return (
                <Modal
                    visible={editVisible}
                    title="修改App排序"
                    okText="确认"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form>
                        <FormItem label="app排序" {...formItemLayout}>
                            {getFieldDecorator("orderByApp", {initialValue:this.props.editData.orderByApp})(
                                <Input type="number" placeholder="app排序" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            )
        }
    }
)

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源标题',
            key: 'titleLike',
            searchFilterType: 'string',
            placeholder: '请输入房源标题'
        },
        {
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编码'
        }, {
            type: 'text',
            name: '房东助理',
            key: 'assist',
            searchFilterType: 'string',
            placeholder: '请输入房东助理'
        }, {
            type: 'text',
            name: 'BU',
            key: 'bu',
            searchFilterType: 'string',
            placeholder: '请输入BU'
        }, {
            type: 'number',
            name: '卫生间',
            key: 'toiletNumber',
            searchFilterType: 'number',
            placeholder: '请输入卫生间数量'
        }, {
            type: 'number',
            name: '房间数',
            key: 'roomNumber',
            searchFilterType: 'number',
            placeholder: '请输入房间数量'
        }, {
            type: 'text',
            name: '地址',
            key: 'address',
            placeholder: '请输入地址'
        }
    ],
    export: {
        name: '房源列表数据'
    }
}

class HouseList extends Component {
    constructor () {
        super()
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            imageVisible:false,
            visible:false,
            facilitiesStr:[],
            editVisible:false,
            editData:[],
            tabledata:[],
            wringVisible:false,
            sorterA:''
        }
    }
    componentDidMount () {
        this.getHouse()
    }

    getHouse (sortData){
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...sortData
        }
        houseListService.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_HOUSE_SUCCESS',
                payload:data
            })
        })
    }

    // 搜索数据
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                titleLike: searchFields.titleLike.value,
                houseNo: searchFields.houseNo.value,
                assist: searchFields.assist.value,
                bu: searchFields.bu.value,
                toiletNumber: searchFields.toiletNumber.value,
                roomNumber: searchFields.roomNumber.value,
                address: searchFields.address.value
            }
        }, this.getHouse)
    }

    // 点击图片
    onImage = (record) => () => {
        this.setState({
            imageVisible: true
        })
        houseListService.houseImage(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_IMAGE_SUCCESS',
                payload: data
            })
        })
    }

    // 点击详情
    onDetail = (record) => () => {
        this.setState({
            visible: true
        })
        houseListService.houseDetail(record.id).then((data) => {
            console.log(data)
            this.props.dispatch({
                type: 'GET_DETAIL_HOUSE_SUCCESS',
                payload: data
            })
        })
        houseListService.houseDesiger(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_DETAIL_DESIGER_SUCCESS',
                payload: data
            })
            let str = ""
            for( let i = 0 ; i < data.length;i++ ){
                str += data[i].code + '、'
            }
            this.setState({
                facilitiesStr: str
            })
        })
    }
    //修改长短租
    confirm = (record) => () => {
        let self = this
        if(record.rentType === 0){
            houseListService.rentChange(record.id,1).then((data) =>{
                message.success('修改成功！')
                self.getHouse()
            })
        }else if(record.rentType === 1){
            houseListService.rentChange(record.id,0).then((data) =>{
                message.success('修改成功！')
                self.getHouse()
            })
        }
    }
    onEdit = (record) => () => {
        this.setState({
            editVisible:true,
            editData:record,
            editVersion:record.version,
            wringVisible:false
        })
    }

    // App排序表单提交
    handleCreate = () => {
        const form = this.formRef.props.form
        notification.destroy()
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            if (values.orderByApp > 999999999){
                notification.error({
                    message: '错误提示',
                    description: 'app排序不能超过999999999'
                });
                return
            }
            const parpoms = {
                id: this.formRef.props.editData.id,
                version: this.formRef.props.editData.version,
                orderByApp:values.orderByApp
            }
            this.props.dispatch({
                type: 'EDIT_APP_ING'
            })
            houseListService.houseEdit(parpoms).then((data) => {
                this.props.dispatch({
                    type: 'EDIT_APP_SUCCESS'
                })
                message.loading('正在加载...', 0.5)
                notification.destroy()
                this.getHouse()
            }).catch((e) => {
                message.loading('修改失败...', 0.5)
            })
            this.setState({
                editVisible: false
            })
        })
        this.formRef.props.form.resetFields()
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef
    }


    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            imageVisible: false,
            editVisible: false
        })
        notification.destroy()
    }

    // 点击排序
    handleChange = (pagination, filters, sorter) => {
        if(sorter.order){
            if(sorter.order === 'descend'){
                this.setState({
                    sorterA : 'desc'
                })
            }else if(sorter.order === 'ascend'){
                this.setState({
                    sorterA : 'asc'
                })
            }
            this.getHouse({orderBy:(sorter.field + ' ' + this.state.sorterA)})
        }else{
            this.getHouse()
        }
    }

    //图片弹窗
    renderModal = () => {
        return (
            <Modal title="房源图片" width="800px" visible={this.state.imageVisible } bodyStyle={{padding:"10px"}} onCancel={this.handleCancel} footer={[<span key="cancel" className="click-link" onClick={this.handleCancel}>关闭</span>]}>
                <div className="ant-masonry">
                    { this.props.imageListM.length > 0 ? this.props.imageListM.map(function (item,index) {
                        return <div className="ant-masonry-item" key={index}>
                            <img className="wsm-full ant-masonry-cell" style={{width:'100%',height:'100%'}} src={item.imgPath} alt="加载失败..." />
                        </div>
                    }) : <div style={{padding:"20px"}}>暂无房源图片</div>
                    }
                </div>
            </Modal>
        )
    }

    //详情弹窗
    renderModalList = () => {
        let self = this
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:18 }
            }
        }
        let detailsData = this.props.detailListM
        const detailColumns = [{
            label:'房源ID',
            codetag:'houseSourceId',
            placeholder:'空',
            value:detailsData.houseSourceId
        },{
            label:'摘要',
            codetag:'summary',
            placeholder:'空',
            value:detailsData.summary
        },{
            label:'房屋守则',
            codetag:'housingCode',
            placeholder:'空',
            value:detailsData.housingCode
        },{
            label:'清洁人员',
            codetag:'clearers',
            placeholder:'空',
            value:detailsData.clearers
        },{
            label:'经度',
            codetag:'longitude',
            placeholder:'空',
            value:detailsData.longitude
        },{
            label:'纬度',
            codetag:'latitude',
            placeholder:'空',
            value:detailsData.latitude
        },{
            label:'地图信息',
            codetag:'xy',
            placeholder:'空',
            value:detailsData.clearer
        },{
            label:'导航信息',
            codetag:'navigationInfo',
            placeholder:'空',
            value:detailsData.navigationInfo
        },{
            label:'泊车信息',
            codetag:'parkInfo',
            placeholder:'空',
            value:detailsData.parkInfo
        },{
            label:'门锁信息',
            codetag:'openDoorInfo',
            placeholder:'空',
            value:detailsData.openDoorInfo
        },{
            label:'设计师简介',
            codetag:'designdes',
            placeholder:'空',
            value:detailsData.designdes
        },{
            label:'遍历设施',
            codetag:'facilitiesStr',
            placeholder:'空',
            value:this.state.facilitiesStr
        }]

        return (
            <Modal
                visible={this.state.visible}
                title="详情"
                onCancel={this.handleCancel}
                footer={[<span key="cancel" className="click-link" onClick={this.handleCancel}>关闭</span>]}
            >
                <Form>
                    {detailColumns.map(function (item,index) {
                        return <FormItem label={item.label} key={index} {...formItemLayout}>
                            {self.renderInput(item,index)}
                        </FormItem>})
                    }
                </Form>
            </Modal>
        )
    }
    renderInput = (item,index)=> {
        let position = {}
        let detailsData = this.props.detailListM
        if (detailsData && detailsData.longitude) {
            position = {
                longitude: parseFloat(detailsData.longitude),
                latitude: parseFloat(detailsData.latitude)
            }
        }

        if(item.codetag === "xy" ){
            if(position.longitude){
                return (<div id="amap" className="h300">
                    <Map amapkey="3306de7f91c3ef8a5c5ca3c057dcedf1" center={position} zoom={14}>
                        <Marker position={position}></Marker>
                    </Map>
                </div>)
            }else{
                return <span className="ant-form-text">空</span>
            }
        }else if(item.codetag === "clearers"){
            let str = []
            item.value && item.value.forEach(i => {
                str.push(<span className="ant-form-text">【{i.clearerName}】 id:{i.clearId} <br></br> 手机:{i.clearerPhone} <br></br> openId:{i.clearerOpenId}</span>)
            });
            return str.length === 0 ? '空' : str
        }else{
            return <span className="ant-form-text">{item.value ? item.value : '空'}</span>
        }
    }
    renderContent = (content) => {
        if (!content) return null
        const output = <div className="w200">{content}</div>
        return (
            <Tooltip title={output}>
                <div className="ellipsis w100">{content}</div>
            </Tooltip>
        )
    }
    // 主体
    render () {
        let self = this
        const scroll = {
            x: 4000,
            y:false
        }
        const columns = [{
            title: '房源编码',
            dataIndex: 'houseNo',
            key: 'houseNo',
            width:150
        }, {
            title: '会员名称',
            dataIndex: 'memberName',
            key: 'memberName',
            width: 150
        }, {
            title: '房源标题',
            dataIndex: 'title',
            key: 'title',
            width:'200px',
            render: this.renderContent
        }, {
            title: '长短租',
            dataIndex: 'rentType',
            key: 'rentType',
            width:'150px',
            render: val => <span>{newRentTyep[val]}</span>
        },{
            title: 'BU',
            dataIndex: 'buName',
            key: 'buName',
            width:'150px'
        }, {
            title: 'BU电话',
            dataIndex: 'buPhone',
            key: 'buPhone',
            width:'150px',
            render: val => <span>{checkPhone[val]}</span>
        }, {
            title: '房东助理',
            dataIndex: 'assistName',
            key: 'assistName',
            width:'150px'
        }, {
            title: '房东助理电话',
            dataIndex: 'assistPhone',
            key: 'assistPhone',
            width:'150px'
        }, {
            title: '超过房客数',
            dataIndex: 'otherTenantNumber',
            key: 'otherTenantNumber',
            width:'100px'
        }, {
            title: '标准价格',
            dataIndex: 'standardPrice',
            key: 'standardPrice',
            width:'100px'
        }, {
            title: '周末价格',
            dataIndex: 'weekPrice',
            key: 'weekPrice',
            width:'100px'
        }, {
            title: '清洁费',
            dataIndex: 'clearPrice',
            key: 'clearPrice',
            width:'100px'
        }, {
            title: '保证金',
            dataIndex: 'deposit',
            key: 'deposit',
            width:'100px'
        }, {
            title: '床数',
            dataIndex: 'bedNumber',
            key: 'bedNumber',
            width:'100px'
        }, {
            title: '房间数',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
            width:'100px'
        }, {
            title: '卫生间数',
            dataIndex: 'toiletNumber',
            key: 'toiletNumber',
            width:'100px'
        }, {
            title: '最多房客数',
            dataIndex: 'tenantNumber',
            key: 'tenantNumber',
            width:'100px'
        }, {
            title: '国家编号',
            dataIndex: 'countryCode',
            key: 'countryCode',
            width:'100px'
        }, {
            title: '国家名称',
            dataIndex: 'countryName',
            key: 'countryName',
            width:'100px'
        }, {
            title: '区域编号',
            dataIndex: 'areaCode',
            key: 'areaCode',
            width:'150px'
        }, {
            title: '区域名称',
            dataIndex: 'areaName',
            key: 'areaName',
            width:'150px'
        }, {
            title: '省编号',
            dataIndex: 'provinceCode',
            key: 'provinceCode',
            width:'150px'
        }, {
            title: '省名称',
            dataIndex: 'provinceName',
            key: 'provinceName',
            width:'100px'
        }, {
            title: '城市编号',
            dataIndex: 'cityCode',
            key: 'cityCode',
            width:'100px'
        }, {
            title: '城市名称',
            dataIndex: 'cityName',
            key: 'cityName',
            width:'100px'
        }, {
            title: '城市英文名',
            dataIndex: 'cityEnName',
            key: 'cityEnName',
            width:'120px'
        }, {
            title: '房源地址',
            dataIndex: 'address',
            key: 'address',
            width:'250px'
        }, {
            title: '是否发布',
            dataIndex: 'houseStatusStr',
            key: 'houseStatusStr',
            width:'100px'
        }, {
            title: '房东类型',
            dataIndex: 'houseLandlordTypeStr',
            key: 'houseLandlordTypeStr',
            width:'100px'
        }, {
            title: '辅助房东ID',
            dataIndex: 'assistId',
            key: 'assistId',
            width:'150px'
        }, {
            title: '辅助房东OpenId',
            dataIndex: 'assistOpenId',
            key: 'assistOpenId',
            width:'150px'
        }, {
            title: '预计上线日期',
            dataIndex: 'onlinePlanTimeStr',
            key: 'onlinePlanTimeStr',
            width:'150px',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '确定上线日期',
            dataIndex: 'onlinePlanTimeConfirmStr',
            key: 'onlinePlanTimeConfirmStr',
            width:'150px',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '设计师名称',
            dataIndex: 'designer',
            key: 'designer',
            width:'100px'
        }, {
            title: '评分',
            dataIndex: 'stars',
            key: 'stars',
            width:'100px'
        }, {
            title: '审核时间排序',
            dataIndex: 'orderBy1',
            key: 'orderBy1',
            width:'140px',
            sorter: true
        }, {
            title: '好评率排序',
            dataIndex: 'orderBy2',
            key: 'orderBy2',
            width:'120px',
            sorter: true
        }, {
            title: 'app排序',
            dataIndex: 'orderByApp',
            key: 'orderByApp',
            width:'150px',
            align: 'right',
            sorter: true,
            render: function (text, record, index) {
                return (
                    <div>
                        {record.orderByApp ? <span>{record.orderByApp}&nbsp;&nbsp;</span> : null}
                        <Button
                            type="primary"
                            size="small"
                            name="lookPick"
                            onClick={self.onEdit(record)}
                        >
                            修改
                        </Button>
                    </div>
                )
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
            width:'150px',
            align: 'center',
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'140px',
            fixed:'right',
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            name="lookPick"
                            className="mr-sm"
                            onClick={self.onImage(record)}
                        >查看图片</Button>
                        <Button
                            type="primary"
                            size="small"
                            name="lookDetail"
                            onClick={self.onDetail(record)}
                        >详情</Button>
                        {/* {record.rentType !== null ?
                            <Popconfirm title={record.rentType === 0 ? "当前显示为长租，确认修改为短租？" : "当前显示为短租，确认修改为长租？"} onConfirm={self.confirm(record)} okText="Yes" cancelText="No">
                                <Button style={{marginTop:'5px'}} type="primary" size="small" name="changeRent">修改长短租</Button>
                            </Popconfirm>
                            :
                            null
                        } */}
                    </div>
                )
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total:Number(this.props.houseListM.total || 0 ),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getHouse)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getHouse)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.houseListM.list)} />
                <Table
                    bordered
                    size="small"
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.houseListM.list)}
                    rowKey="id"
                    onChange={this.handleChange}
                    pagination={pageObj}
                    loading={this.props.houseListM.loading}
                />
                {this.renderModal()}
                {this.renderModalList()}
                <EditCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    editVisible={this.state.editVisible}
                    editData={this.state.editData}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps)(HouseList)
