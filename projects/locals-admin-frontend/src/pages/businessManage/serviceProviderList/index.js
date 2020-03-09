import React, { Component } from 'react'
import { Table,Button } from 'antd'
import {serviceProviderList} from '../../../services'
import {pageOption, dataFormat, checkKey} from '../../../utils/utils'
import {connect} from "react-redux"
import Search from '../../../components/search'
import ProviderEditForm from './providerEdit'
import ServiceDetailForm from '../serviceItemManage/serviceDetail'
import ProviderLinkTable from './providerLinkTable'

const mapStateToProps = (state, action) => {
    return {
        serviceProviderListM: state.serviceProviderListM,
        delServiceProviderM: state.delServiceProviderM,
        getProviderItemM:state.getProviderItemM,
        getLinkProviderM:state.getLinkProviderM,
        getLinkItemProviderM:state.getLinkItemProviderM
    }
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '服务商编号',
            key: 'providercode',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入服务商编号'
        },
        {
            type: 'text',
            name: '品牌名称',
            key: 'providerbrandname',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入品牌名称'
        },
        {
            type: 'text',
            name: '公司名称',
            key: 'providername',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入公司名称'
        }
    ]
}
class ServiceProviderList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            visible:false,
            dataType:true,
            formData:[],
            linkVisible:false,
            itemVisible:false,
            itemId:''
        }
        this.onAdd = this.onAdd.bind(this)
    }

    componentDidMount () {
        this.getServiceProviderList()
    }

    // 获取table数据
    getServiceProviderList () {
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        serviceProviderList.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_SERVICE_PROVIDER_LIST_SUCCESS',
                payload:data
            })
        })
    }


    // 搜索数据
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                providercode: searchFields.providercode.value,
                providerbrandname: searchFields.providerbrandname.value,
                providername: searchFields.providername.value
            }
        }, this.getServiceProviderList)
    }

    //新增
    onAdd = () =>{
        this.setState({
            visible:true,
            dataType:false
        })
    }

    // 详情
    onDetail = (record) => () => {
        serviceProviderList.getProvider(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_PROVIDER_ITEM_SUCCESS',
                payload:data
            })
            this.setState({
                visible:true,
                id:record.id,
                dataType:true,
                linkVisible:false,
                itemVisible:false
            })
        })
    }

    // 关闭弹出框
    handleCancel = () => {
        this.setState({
            visible: false,
            linkVisible:false,
            itemVisible:false
        })
        this.getServiceProviderList()
    }

    //下一步关联项目
    onNextLink = () =>{
        this.setState({
            visible: false,
            linkVisible:true
        })
        serviceProviderList.getLinkProvider(this.state.id).then((data) => {
            this.props.dispatch({
                type: 'GET_LINK_PROVIDER_SUCCESS',
                payload:data
            })
        })
    }

    //返回到编辑页
    onLastDetail = () =>{
        this.setState({
            visible:true,
            linkVisible:false
        })
    }

    //下一步项目详情
    onNextItem = (data) =>{
        this.setState({
            linkVisible:false,
            itemVisible:true,
            itemId:data
        })
    }

    //返回到关联项目
    onLastLink = () =>{
        this.setState({
            linkVisible:true,
            itemVisible:false
        })
    }

    // 主体
    render () {
        let self = this
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '服务项编号',
            dataIndex: 'providercode',
            key: 'providercode'
        }, {
            title: '服务商品牌名称',
            dataIndex: 'providerbrandname',
            key: 'providerbrandname'
        }, {
            title: '服务商公司名称',
            dataIndex: 'providername',
            key: 'providername'
        }, {
            title: '操作人',
            dataIndex: 'updator',
            key: 'updator'
        }, {
            title: '更新时间',
            dataIndex: 'timeVersion',
            key: 'timeVersion',
            className:'ant-table-nowrap',
            width:150,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:80,
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            name="lookDetail"
                            className="mr-sm"
                            onClick={self.onDetail(record)}
                        >详情</Button>
                    </div>
                )
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: Number(this.props.serviceProviderListM.total || 0 ),
            pageSize: this.props.serviceProviderListM.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getServiceProviderList)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getServiceProviderList)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.serviceProviderListM.list)} />
                <div className="text-right padder-v-sm">
                    <Button
                        type="primary"
                        onClick={self.onAdd}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.serviceProviderListM.list)}
                    rowKey="providercode"
                    pagination={pageObj}
                />
                {
                    this.state.visible ?
                        <ProviderEditForm
                            visible={this.state.visible}
                            id={this.state.id}
                            formData={this.props.getProviderItemM}
                            dataType={this.state.dataType}
                            onNext={this.onNextLink}
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.linkVisible ?
                        <ProviderLinkTable
                            visible={this.state.linkVisible}
                            data={this.props.getLinkProviderM}
                            onLast={this.onLastDetail}
                            onNext={this.onNextItem}
                            onCancel={this.handleCancel}
                        /> : null
                }
                {
                    this.state.itemVisible ?
                        <ServiceDetailForm
                            visible={this.state.itemVisible}
                            id={this.state.itemId}
                            orgType="provider"
                            onCancel={this.handleCancel}
                            onLast={this.onLastLink}
                        /> : null
                }
            </div>
        )
    }
}
export default connect(mapStateToProps)(ServiceProviderList)
