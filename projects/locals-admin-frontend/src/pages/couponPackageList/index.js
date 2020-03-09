import React, { Component } from 'react'
import { SearchParent } from '../../components/index'
import { giftPacksService,couponService } from '../../services'
import {Button, Switch, Table, message, Popconfirm} from 'antd'
import OperatePackageModal from './operatePackageModal'
import {pageOption} from "../../utils/utils";

const searchConfig = {
    items: [{
        type: 'text',
        name: '活动名称',
        key: 'activityName',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    }, {
        type: 'select',
        name: '活动状态',
        key: 'activityStatus',
        selectData: [
            {value: '', text: '全部'},
            {value: 1, text: '启用'},
            {value: 2, text: '停用'}
        ]
    }]
}

class CouponPackageList extends Component {
    constructor (props){
        super(props)
        this.state = {
            visible: false,
            title:'',
            behavior: 'add',
            activitiesList:[],
            loading:true,
            couponList:[],
            editContent:null,
            itemId:'',
            activityName:'',
            activityStatus:'',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0
        }
        this.addOperate = this.addOperate.bind(this)
        this.editOperate = this.editOperate.bind(this)
        this.update = this.update.bind(this)
        this.onCancel = this.onCancel.bind(this)
    }
    componentDidMount (){
        this.getActivitiesList()
        this.getCouponList()
    }
    getActivitiesList =() =>{
        const {activityStatus,activityName,pageNum,pageSize} = this.state;
        let paramas = {
            orderBy: 'create_time desc',
            pageNum:pageNum,
            pageSize:pageSize
        }
        if(activityStatus)paramas.activityStatusLike = activityStatus
        if(activityName)paramas.activityNameLike = activityName

        giftPacksService.getActivitiesList(paramas).then((data)=>{
            this.setState({
                activitiesList:data.list,
                loading:false,
                total:data.total
            })
        })
    }
    getCouponList = () =>{
        couponService.getValidCouponList().then((data) =>{
            this.setState({couponList:data})
        })
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            activityStatus:searchFields.activityStatus.value,
            activityName:searchFields.activityName.value
        }, ()=>this.getActivitiesList)
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    onDelete = (id) =>() =>{
        giftPacksService.deleteActivitie(id).then((data)=>{
            if(data === 1){
                message.success('删除成功')
                this.getActivitiesList()
            }
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    onSubmit = (err,value,behavior) =>{
        if(!err){
            if(behavior === 'add'){
                const params = {
                    activityName:value.activityName,
                    activityQuantity:value.activityQuantity,
                    landlordDescription:value.landlordDescription,
                    activityIntroduction:value.activityIntroduction,
                    startTime:value.time[0].format('YYYY-MM-DD'),
                    endTime:value.time[1].format('YYYY-MM-DD'),
                    activityStatus:value.activityStatus
                }
                giftPacksService.postActivitie(params).then((data)=>{
                    if(data >= 1){
                        this.setState({
                            visible:false
                        },()=>{
                            message.success('新增成功')
                            this.getActivitiesList()
                        })
                    }
                }).catch(e=>{
                    message.error(e.errorDetail)
                })
            }else if(behavior === 'update'){
                const params = {
                    activityName:value.activityName,
                    activityQuantity:value.activityQuantity,
                    landlordDescription:value.landlordDescription,
                    activityIntroduction:value.activityIntroduction,
                    startTime:value.time[0].format('YYYY-MM-DD'),
                    endTime:value.time[1].format('YYYY-MM-DD'),
                    activityStatus:value.activityStatus,
                    id:this.state.editContent.id
                }
                giftPacksService.putActivitie(params).then((data)=>{
                    if(data >= 1){
                        this.setState({
                            visible:false
                        },()=>{
                            message.success('修改成功')
                            this.getActivitiesList()
                        })
                    }
                }).catch(e=>{
                    message.error(e.errorDetail)
                })
            }
        }
    }
    addOperate = (title) => () => {
        this.setState({
            visible: true,
            title:title,
            behavior: 'add',
            editContent:null
        })
    }
    editOperate = (title,itemId) => () => {
        this.setState({
            visible: true,
            title:title,
            behavior: 'edit',
            editContent:null,
            itemId:itemId
        })
    }
    update = (title,record) => () => {
        this.setState({
            visible: true,
            title: title,
            behavior: 'update',
            editContent:record
        })
    }
    toUpdate = () =>{
        this.getActivitiesList()
    }
    changeStatus = (status,id) =>()=>{
        const params = {
            id:id,
            activityStatus:status === 1 ? 0 : 1
        }
        giftPacksService.putActivitie(params).then((data)=>{
            if(data === 1){
                message.success('更改状态成功')
                this.getActivitiesList()
            }
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    render () {
        const columns = [
            {
            title: '活动名称',
            dataIndex: 'activityName'
        }, {
            title: '活动兑换码',
            dataIndex: 'activityCode'
        }, {
            title: '包含券数量',
            align:'center',
            dataIndex:'activityQuantity'
        }, {
            title: '活动状态',
            dataIndex: 'status',
            render: (v,record) => {
                return <Switch onChange={this.changeStatus(record.activityStatus,record.id)} checked={ record.activityStatus === 1 } />
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            width:300,
            render: (v, record) => {
                let commonBtn = {
                    className: 'mr-sm',
                    type: 'primary',
                    size: 'small'
                }
                return (
                    <div>
                        <Button
                            {...commonBtn}
                            onClick={this.update('编辑活动',record)}
                        >编辑活动</Button>
                        <Button
                            {...commonBtn}
                            onClick={this.editOperate('活动绑定优惠券',record.id)}
                        >活动绑定优惠券</Button>
                        <Popconfirm title="确认删除?" onConfirm={this.onDelete(record.id)} okText="确认" cancelText="取消">
                        <Button
                            {...commonBtn}
                            type={'danger'}
                        >删除</Button>
                        </Popconfirm>
                    </div>
                )
            }
        }]
        const { pageSize, pageSizeOptions, pageNum ,total} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                console.log(current,pageSize)
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getActivitiesList()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getActivitiesList()})
            }
        }
        return (
            <div>
                <SearchParent
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.addOperate('创建活动')}
                    >创建活动</Button>
                </div>
                <Table
                    columns={columns}
                    loading={this.state.loading}
                    dataSource={this.state.activitiesList}
                    pagination={pagination}
                    rowKey={'id'}
                />
                <OperatePackageModal
                    visible={this.state.visible}
                    title={this.state.title}
                    behavior={this.state.behavior}
                    onCancel={this.onCancel}
                    couponList={this.state.couponList}
                    onSubmit={this.onSubmit}
                    editContent={this.state.editContent}
                    itemId={this.state.itemId}
                    update={this.toUpdate}
                />
            </div>
        )
    }
}

export default CouponPackageList
