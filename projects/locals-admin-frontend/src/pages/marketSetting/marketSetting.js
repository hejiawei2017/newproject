import React, { Component,Fragment } from 'react'
import { SearchParent} from '../../components/index'
import {Button, message, Table, Popconfirm} from 'antd'
import {maketService} from '../../services'
import {pageOption,dataFormat} from "../../utils/utils";
import CollectionCreateForm from "./createMarketModel";
import CancelModel from "./cancelModel";
import global from '../../utils/Global'
import './index.less'

const searchConfig = {
    items: [ {
        type: 'multiple-select',
        name: '规则类型',
        key: 'type',
        selectData: [
            {value: 1, text: '拉粉奖励'},
            {value: 2, text: '注册奖励'},
            {value: 3, text: '礼包奖励'},
            {value: 4, text: '订单奖励'},
            {value: 5, text: '房晚奖励'}
        ]
    },{
        type: 'text',
        name: '规则名称',
        key: 'name',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入规则名称'
    },{
        type: 'text',
        name: '规则ID',
        key: 'id',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入规则ID'
    },{
        type: 'multiple-select',
        name: '规则状态',
        key: 'state',
        selectData: [
            {value: 0, text: '待启用'},
            {value: 1, text: '已启用'},
            {value: 2, text: '已过期'},
            {value: 3, text: '已删除'},
            {value: 4, text: '已取消'}
        ]
    }]
};
class MarketSetting extends Component {
    state = {
        searchFields: {},
        visible: false,
        behavior: '',
        marketList: [],
        pageNum: pageOption.pageNum,
        pageSize: pageOption.pageSize,
        pageSizeOptions: pageOption.pageSizeOptions,
        id:'',
        total:0,
        loading:true,
        readContent:null,
        createMaket:{},
        cancelData:{},
        giftData: []
    };
    async componentDidMount () {
        await this.getMarketList();
        await this.getGiftData();
    }
    async getMarketList (searchFields) {
        const {pageNum,pageSize} = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize
        };
        if(searchFields && searchFields !== {}){
            if(searchFields.id && searchFields.id.value)params.id = searchFields.id.value
            if(searchFields.name && searchFields.name.value)params.nameLike = searchFields.name.value
            if(searchFields.state && searchFields.state.value && searchFields.state.value.length !== 0)params.stateIn = searchFields.state.value
            if(searchFields.type && searchFields.type.value && searchFields.type.value.length !== 0)params.typeIn = searchFields.type.value
        }
        maketService.getMaketList(params).then((data) =>{
            this.setState({
                pageNum:data.pageNum,
                marketList:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    async getGiftData () {
        maketService.getGiftData().then((res) =>{
            if(res.list && res.list.length !== 0){
                const arr = res.list.filter((r) => {
                    return r.title.indexOf('卡套餐') !== -1
                })
                this.setState({ giftData:arr })
            }
        })
    }
    operateMarket = (behavior,record) => () => {
        this.setState({
            visible: true,
            behavior: behavior,
            readContent:record || null
        })
    };
    onSearch = (searchFields) => {
        this.setState({
            searchFields
        })
        if(searchFields === {}) return
        this.getMarketList (searchFields)
    };
    onCancelRule = id => () => {
        const params = { id }
        maketService.getRuleData(params).then((data) =>{
            this.setState({
                visibleCancel: true,
                cancelData:data
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    handleOk = (e) => {
        this.setState({
          visible: false
        });
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
          visibleCancel: false
        });
    }
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const _data = {
                startTime: new Date(values.time[0]).getTime(),
                endTime: new Date(values.time[1]).getTime(),
                name:values.name,
                bonus:values.bonus,
                type:values.type,
                state:0,
                additionType: 0,
                scope:'all',
                scopeDesc:'全部房源',
                dayOfMonth:'',
                nightsLimit:0
            }
            if(values.type === '1') {
                _data.dayOfMonth = 9
            }
            if(values.type === '5') {
                _data.nightsLimit = 1
            }
            if(values.type === '3') {
                if(values.giftCode === '0') {
                    alert('请检查礼包选择情况！')
                    return
                }
                _data.scope = values.giftCode;
                const giftData = this.state.giftData
                const one = giftData.filter((item) =>{
                    return item.id === values.giftCode
                })
                _data.scopeDesc = one[0].title;
                _data.additionType = 1;
            }
            this.putNewRule(_data)
        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    // 新增规则
    putNewRule = (_data) => {
        const form = this.formRef.props.form;
        maketService.putNewRule(_data).then((data) => {
            form.resetFields();
            this.setState({ visible: false });
            this.getMarketList()
            message.success('新增成功');
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    onDelete = id => () => {
        const _data = {
            id,
            state:4
        }
        maketService.updateRule(_data).then((data)=>{
            if(data === 1){
                this.getMarketList(this.state.searchFields)
                this.setState({
                    visibleCancel: false,
                    searchFields:{}
                });
                message.success('取消成功');
            }
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    render () {
        const role = global.role
        function checkAdult (r) {
            if(r === "AUTH_MARKET_SET" || r === "AUTH_ADMIN" || r === "AUTH_SUPER" ){
                return r
            }
        }
        const havePermission = role.filter(checkAdult)
        const columns = [
            {
                title: '规则类型',
                width: 100,
                dataIndex: 'type',
                render :(v,record) =>{
                    if(record.type === 1){
                        return <div>拉粉奖励</div>
                    }else if(record.type === 2) {
                        return <div>注册奖励</div>
                    }else if(record.type === 3) {
                        return <div>礼包奖励</div>
                    }else if(record.type === 4) {
                        return <div>订单奖励</div>
                    }else if(record.type === 5) {
                        return <div>房晚奖励</div>
                    }
                }
            },
            {
                title: '规则名称',
                width: 100,
                dataIndex: 'name'
            },
            {
                title: '规则ID',
                width: 200,
                dataIndex: 'id'
            },
            {
                title: '使用范围',
                width: 80,
                // dataIndex: 'name',
                render: (v,record) =>{
                    return <div>全部房源</div>
                }
            }, {
                title: '详细规则',
                width: 110,
                dataIndex: 'bonus',
                render :(v,record) =>{
                    if(record.type === 1){
                        return <div>{`${record.bonus}元/粉丝`}</div>
                    }else if(record.type === 2) {
                        return <div>{`${record.bonus}元/新会员`}</div>
                    }else if(record.type === 3) {
                        return <div>{`${record.bonus}元/${record.scopeDesc}`}</div>
                    }else if(record.type === 4) {
                        return <div>{`${record.bonus}元/订单`}</div>
                    }else if(record.type === 5) {
                        return <div>{`${record.bonus}元/房晚`}</div>
                    }
                }
            },
            {
                title: '状态',
                width: 80,
                dataIndex: 'state',
                render :(v,record) =>{
                    if(record.state === 0){
                        return <div>待启用</div>
                    }else if(record.state === 1) {
                        return <div>已启用</div>
                    }else if(record.state === 2) {
                        return <div>已过期</div>
                    }else if(record.state === 3) {
                        return <div>已删除</div>
                    }else if(record.state === 4){
                        return <div>已取消</div>
                    }
                }
            },
            {
                title: '有效期',
                width: 100,
                render:(v,record) =>{
                    return <div>{dataFormat(record.startTime,"YYYY-MM-DD HH:mm:ss")}-{dataFormat(record.endTime,"YYYY-MM-DD HH:mm:ss")}</div>
                }
            },
            {
                title: '创建时间',
                width: 200,
                render:(v,record) =>{
                    return <div>{dataFormat(record.createTime,"YYYY-MM-DD HH:mm:ss")}</div>
                }
            },
            {
                title: '操作',
                width: 100,
                align:'center',
                render: (v) => {
                    let commonBtn = {
                        className: 'mr-sm',
                        type: 'primary',
                        size: 'small'
                    };
                    if((v.state !== 0 && v.state !== 1) || havePermission.length === 0){
                        commonBtn.disabled = 'disabled'
                    }
                    return (
                        <Fragment>
                            <Button {...commonBtn} onClick={this.onCancelRule(v.id)}>取消</Button>
                        </Fragment>
                    )
                }
            }
            ];
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
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getMarketList()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getMarketList()})
            }
        };
        let createBtn = {}
        if(havePermission.length === 0){
            createBtn.disabled = 'disabled'
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
                        onClick={this.operateMarket('add')}
                        {...createBtn}
                    >创建规则</Button>
                    <Table
                        columns={columns}
                        dataSource={this.state.marketList}
                        rowKey={'id'}
                        pagination={pagination}
                        loading={this.state.loading}
                        scroll={{ x: '105%' }}
                    />
                    <CollectionCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        giftData={this.state.giftData}
                    />
                    <CancelModel
                        visible={this.state.visibleCancel}
                        onCancel={this.handleCancel}
                        onDelete={this.onDelete}
                        cancelData={this.state.cancelData}
                    />
                </div>
            </div>
        )
    }
}

export default MarketSetting