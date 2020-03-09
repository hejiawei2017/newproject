import React, { Component } from 'react'
import { SearchParent } from '../../components/index'
import { getCouponListService } from '../../services'
import {Table,message} from 'antd'
import { dataFormat, dateDiff,pageOption } from '../../utils/utils';


const searchConfig = {
    items: [{
        type: 'text',
        name: '手机号码',
        key: 'mobile',
        searchFilterType: 'string',
        defaultValue: ''
    }, {
        type: 'datepicker',
        name: '领取日期',
        key: 'createTimeGreaterThanEqual',
        searchFilterType: 'string',
        defaultValue: ''
    }, {
        type: 'select',
        name: '券状态',
        key: 'couponState',
        selectData: [
            {value: '',text:'全部'},
            {value: -1,text:'作废'},
            {value: 0,text:'待使用'},
            {value: 1,text:'已使用'},
            {value: 2,text:'已过期'},
            {value: 3,text:'未使用'}
        ]
    } ,{
        type:'text',
        name:'优惠卷ID',
        key:'id',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    }
    ]
};

class CouponReceive extends Component {
    constructor (props){
        super(props);
        this.state = {
            data:[],
            loading:true,
            total:0,
            mobile:null,
            createTimeGreaterThanEqual:null,
            couponState:null,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions
        };
        this.getCouponList = this.getCouponList.bind(this)
        this.onSearch = this.onSearch.bind(this)
    }
    componentDidMount = () => {
      this.getCouponList()
    };
    getCouponList = () =>{
        const {mobile,createTimeGreaterThanEqual,couponState,id,pageNum,pageSize,couponCode} = this.state
        let params = {
            pageNum:pageNum,
            pageSize:pageSize,
            mobile:mobile,
            createTimeGreaterThanEqual:createTimeGreaterThanEqual,
            couponState:couponState,
            id:id,
            couponCodeLike:couponCode
        };
        if(createTimeGreaterThanEqual){
            params.createTimeLessThanEqual = `${createTimeGreaterThanEqual} 23:59:59`
        }
        getCouponListService.getCouponList(params).then((data)=>{
            this.setState({
                data:data.list,
                loading:false,
                total:data.total
            })
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    };
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            mobile:searchFields.mobile.value,
            createTimeGreaterThanEqual:searchFields.createTimeGreaterThanEqual.value,
            couponState:searchFields.couponState.value,
            id:searchFields.id.value
        }, this.getCouponList)
    };
    render () {
        const columns = [{
            title: '券优惠码',
            dataIndex: 'coupon.couponCode'
        }, {
            title: '优惠卷ID',
            dataIndex: 'id'
        }, {
            title: 'unionID（公众号）',
            dataIndex: 'unionId'
        }, {
            title: '用户ID',
            dataIndex: 'userId'
        }, {
            title: '手机号码',
            dataIndex: 'mobile'
        }, {
            title: '领取时间',
            render : (v,r)=>{
                return <span>{dataFormat(r.createTime)}</span>
            }
        }, {
            title: '过期时间',
            render : (v,r)=>{
                return <span>{dataFormat(r.endTime)}</span>
            }
        }, {
            title: '剩余有效期',
            render: (v,r)=>{
              return (
                <span>{dateDiff(Date.parse(new Date()),r.endTime) <= 0 ? 0 : dateDiff(Date.parse(new Date()),r.endTime)}天</span>
              )
            }
        }, {
            title: '优惠券使用状态',
            render : (v,r)=>{
                return <span>{r.couponState === -1 ? '作废' : r.couponState === 0 ? '待使用' : r.couponState === 1 ? '已使用' : r.couponState === 2 ? '已过期' : r.couponState === 3 ? '未生效' : null}</span>
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
                this.setState({ pageNum: 1, pageSize:pageSize },this.getCouponList)
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },this.getCouponList)
            }
        }
        return (
            <div>
                <SearchParent
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    loading={this.state.loading}
                    rowKey={'id'}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default CouponReceive
