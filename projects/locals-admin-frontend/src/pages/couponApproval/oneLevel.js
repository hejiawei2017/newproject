import React, { Component } from 'react'
import { SearchParent } from '../../components/index'
import { couponAuditService,couponService } from '../../services'
import {Button, message, Table} from 'antd'
import OperateModal from './operateModal.js'
import {pageOption} from "../../utils/utils";


const searchConfig = {
    items: [{
        type: 'select',
        name: '券状态',
        key: 'state',
        selectData: [
            {value: '', text: '全部'},
            {value: 1, text: '启用'},
            {value: 2, text: '停用'}
        ]
    }, {
        type: 'text',
        name: '创建者',
        key: 'creator',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    }]
}

class OneLevel extends Component {
    constructor (props){
        super(props);
        this.state = {
            searchFields: {},
            visible: false,
            behavior: '',
            editContent:'',
            data:[],
            userList:[],
            channelList:[],
            houseTagList: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0,
            state:'',
            creator: undefined,
            loading:true
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.getReviews = this.getReviews.bind(this)
    }
    componentDidMount (){
        this.getReviews()
        this.getUserList()
        this.getChannelList()
        this.getHouseTagList()
    }
    onSubmit = (err,value) =>{
        if(!err){
            const params = {
                id:this.state.editContent.id,
                opinion:value.suggestion
            }
            if(value.state)params.state = value.state
            couponAuditService.putReviews(params).then((data)=>{
                if(data === 1){
                    message.success('已审批')
                    this.setState({visible:false})
                    this.getReviews()
                }
            }).catch(e=>{
                message.error(e.errorDetail)
            })
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            creator:searchFields.creator.value,
            state:searchFields.state.value,
            loading:true
        },this.getReviews)
    }
    getReviews = () =>{
        const {state,pageSize,pageNum,creator} = this.state
        let params = {
            orderBy: 'create_time desc',
            grade:1,
            pageNum:pageNum,
            creator:creator,
            pageSize:pageSize
        }
        if(state){
            params.state = state
        }
        if(creator){
            params.creator = creator
        }
        couponAuditService.getReviews(params).then((data)=>{
            this.setState({
                data: data.list,
                total:data.total,
                loading:false
            })
        })
    }
    getUserList = () => {
        couponService.getUserList().then((data) => {
            this.setState({userList: data})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    };
    getChannelList = () => {
        couponService.getChannelList().then((data) => {
            this.setState({channelList: data})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    }
    getHouseTagList = () => {
        couponService.getHouseTagList().then((data) => {
            this.setState({houseTagList: data})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    };
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    operate = record => () => {
        this.setState({
            visible: true,
            editContent:record
        })
    }
    render () {
        const columns = [ {
            title: '优惠券名称',
            dataIndex: 'coupon.couponName'
        }, {
            title: '发放数量',
            dataIndex: 'coupon.couponQuantity',
            render :(v,record) =>{
                return <div>
                    {v === '-1' ? '无限制' : `${v}张`}
                </div>
            }
        }, {
            title: '创建者',
            dataIndex: 'creator'
        }, {
            title: '审批状态',
            dataIndex: 'state',
            render: (v,record)=>{
                return <span>{record.state === 0 ? '待审批' : record.state === 1 ? '审批通过' : '审批不通过'}</span>
            }
        }, {
            title: '操作',
            dataIndex: 'action',
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
                            onClick={this.operate(record)}
                            disabled={record.state !== 0}
                        >审批</Button>
                    </div>
                )
            },
            width: 250
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
                this.setState({ pageNum: 1, pageSize:pageSize,loading:true },this.getReviews)
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize,
                    loading:true
                },this.getReviews)
            }
        }
        return (
            <div>
                <SearchParent
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <Table
                    dataSource={this.state.data}
                    columns={columns}
                    rowKey={'id'}
                    pagination={pagination}
                    loading={this.state.loading}

                />
                <OperateModal
                    visible={this.state.visible}
                    behavior={this.state.behavior}
                    onCancel={this.onCancel}
                    editContent={this.state.editContent}
                    channelList={this.state.channelList}
                    houseTagList={this.state.houseTagList}
                    userList={this.state.userList}
                    onSubmit={this.onSubmit}
                />
            </div>
        )
    }
}

export default OneLevel
