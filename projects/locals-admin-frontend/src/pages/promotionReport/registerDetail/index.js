
import React, { PureComponent, Fragment } from 'react'
import { Table } from 'antd';
import SearchList from '../search'
import {promotionReportService} from '../../../services'
import { pageOption } from '../../../utils/utils.js'


const searchConfig = {
    items: [{
        type: 'rangepicker',
        name: '注册日期',
        key: 'signDate',
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
    title: '姓名',
    dataIndex: 'username',
    key: 'username'
},
{
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
},
{
    title: '注册时间',
    dataIndex: 'signDate',
    key: 'signDate'
}
];
class RegisterDetail extends PureComponent{
    constructor (props){
        super(props);
        this.state = {
            data:[],
            loading:true,
            promotionDepartment:'',
            promotionGroup:'',
            promotionChannel:'',
            signBeginDate:'',
            signEndDate:'',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0
        }
        this.onSearch = this.onSearch.bind(this)
    }

    componentDidMount (){
        this.getTable()
    }
    getTable =() =>{
        const {pageNum, pageSize, promotionDepartment, promotionGroup,promotionChannel,signBeginDate,signEndDate} = this.state;
        let paramas = {
            pageNum	:pageNum,
            pageSize:pageSize,
            promotionDepartment:promotionDepartment,
            promotionGroup:promotionGroup,
            promotionChannel:promotionChannel,
            signBeginDate:signBeginDate,
            signEndDate:signEndDate
        }
        promotionReportService.getRigisterDetail(paramas).then((data)=>{
            let list = data.list
            for(let i in list){
                list[i].key = i
            }
            this.setState({
                data:list,
                total:data.total,
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
            signBeginDate:searchFields.signDate.value ? searchFields.signDate.value[0] : '',
            signEndDate:searchFields.signDate.value ? searchFields.signDate.value[1] : ''
        },()=>{
            this.getTable()
        })
    }
    render (){
        const { total, pageSize, pageSizeOptions, pageNum } = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
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

export default RegisterDetail;