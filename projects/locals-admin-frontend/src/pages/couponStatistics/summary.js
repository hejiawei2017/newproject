import React, { Component } from 'react'
import { SearchParent } from '../../components/index'
import { couponService } from '../../services'
import {Table} from 'antd'
import {pageOption} from '../../utils/utils'

const searchConfig = {
    items: [{
        type: 'text',
        name: '优惠券名称',
        key: 'couponName',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    },{
        type:'select',
        name:'渠道',
        key:'platform',
        selectData:[
            {value: '', text: '全部'},
            {value: 'admin', text: '后台管理充券'},
            {value: 'APP', text: '手机端领取'},
            {value: 'WEB', text: 'WEB领取'}
        ]
    }]
}

class CouponSummary extends Component {
    constructor (props){
        super(props);
        this.state = {
            couponName:null,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0,
            loading:true,
            platform:undefined,
            couponCode:null
        };
        this.getCouponList = this.getCouponList.bind(this)
        this.onSearch = this.onSearch.bind(this)
    }
    componentDidMount = () => {
      this.getCouponList()
    }
    getCouponList = () =>{
        this.setState({
            loading:true
        })
        const {couponName,pageSize,pageNum,platform} = this.state
        let params = {
            couponNameLike:couponName,
            pageNum:pageNum,
            pageSize:pageSize
        }
        if(platform){
            params.platform = platform
        }
        couponService.CouponRedemption(params).then((data)=>{
            this.setState({
                data:data.list,
                loading:false,
                total:data.total
            })
        })
    };
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            couponName:searchFields.couponName.value,
            platform:searchFields.platform.value
        },this.getCouponList)
    }
    render () {
        const columns = [{
            title: '优惠券名称',
            dataIndex: 'coupon.couponName',
            width: 200
        }, {
            title: '优惠券类型',
            render : (v,r)=>{
                return <span>{v.coupon.couponRules.costTypes === 1 ? '立减券' : v.coupon.couponRules.costTypes === 2 ? '折扣券' : '满减券'}</span>
            }
        }, {
            title: '发行数量',
            dataIndex: 'coupon.couponQuantity'
        }, {
            title: '领取数量',
            dataIndex: 'coupon.receiveQuantity'
        }, {
            title: '已使用数量',
            dataIndex: 'coupon.usedQuantity'
        }, {
            title: '未使用数量',
            render : (v,r)=>{
                return <span>{r.coupon.receiveQuantity - r.coupon.usedQuantity - r.coupon.expireQuantity}</span>
            }
        },{
            title: '已过期数量',
            dataIndex: 'coupon.expireQuantity'
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
                    rowKey={'id'}
                    loading={this.state.loading}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default CouponSummary
