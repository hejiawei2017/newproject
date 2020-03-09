
import React, { PureComponent, Fragment } from 'react'
import { Table } from 'antd';
import SearchList from '../search'
import {promotionReportService} from '../../../services'
import { pageOption } from '../../../utils/utils.js'


const searchConfig = {
    items: [{
        type: 'rangepicker',
        name: '预定日期',
        key: 'bookingDate',
        searchFilterType: 'string',
        placeholder: ['开始时间','结束时间']
    },{

        type: 'rangepicker',
        name: '入住日期',
        key: 'checkInDate',
        searchFilterType: 'string',
        placeholder: ['开始时间','结束时间']
    }]
}
const columns = [{
    title: '部门',
    dataIndex: 'promotionDepartment',
    key: 'promotionDepartment'
}, {
    title: '分组',
    dataIndex: 'promotionGroup',
    key: 'promotionGroup'
}, {
    title: '推广渠道',
    dataIndex: 'promotionChannel',
    key: 'promotionChannel'
}, {
    title: '订单数',
    dataIndex: 'orderCount',
    key: 'orderCount',
    align:'center'
},
{
    title: '订单金额',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    align:'center'
}
];

class OrderDetail extends PureComponent{
    constructor (props){
        super(props);
        this.state = {
            data:[],
            loading:true,
            promotionDepartment:'',
            promotionGroup:'',
            promotionChannel:'',
            bookingBeginDate:'',
            bookingEndDate:'',
            checkInBeginDate:'',
            checkInEndDate:'',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOptions
        }
        this.onSearch = this.onSearch.bind(this)
    }

    componentDidMount (){
        this.getTable()
    }
    getTable =() =>{
        const {pageNum, pageSize, promotionDepartment, promotionGroup,promotionChannel,bookingBeginDate,bookingEndDate,checkInBeginDate,checkInEndDate} = this.state;
        let paramas = {
            pageNum	:pageNum,
            pageSize:pageSize,
            promotionDepartment:promotionDepartment,
            promotionGroup:promotionGroup,
            promotionChannel:promotionChannel,
            bookingBeginDate:bookingBeginDate,
            bookingEndDate:bookingEndDate,
            checkInBeginDate:checkInBeginDate,
            checkInEndDate:checkInEndDate
        }
        promotionReportService.getOrderList(paramas).then((data)=>{
            let list = data.list
            for(let i in list){
                list[i].key = i
            }
            this.setState({
                data:list,
                totalCount:data.total,
                loading:false
            })
        })
    }
    onSearch = (searchFields) =>{
        this.setState({
            loading:true,
            promotionDepartment:searchFields.deparmentName.value === '全部' ? '' : searchFields.deparmentName.value ,
            promotionGroup:searchFields.grounpName.value === '全部' ? '' : searchFields.grounpName.value,
            promotionChannel:searchFields.channelName.value === '全部' ? '' : searchFields.channelName.value,
            bookingBeginDate:searchFields.bookingDate.value ? searchFields.bookingDate.value[0] : '',
            bookingEndDate:searchFields.bookingDate.value ? searchFields.bookingDate.value[1] : '',
            checkInBeginDate:searchFields.checkInDate.value ? searchFields.checkInDate.value[0] : '',
            checkInEndDate:searchFields.checkInDate.value ? searchFields.checkInDate.value[1] : ''
        },()=>{
            this.getTable()
        })
    }
    render (){
        const { totalCount, pageSize, pageSizeOptions, pageNum } = this.state;
        const pagination = {
            total: totalCount,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${totalCount}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize }, this.getTable())
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize
                }, this.getTable())
            }
        }
        return(<Fragment>
            <SearchList searchConfig={searchConfig} getParams={this.onSearch} />
            <Table
                dataSource={this.state.data}
                columns={columns}
                pagination={pagination}
                loading={this.state.loading}
            />
        </Fragment>
        )
    }
}

export default OrderDetail;