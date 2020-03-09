import React, { PureComponent } from 'react'
import { Button, message, Tooltip, Popconfirm,Table} from 'antd'
import { couponService } from '../../services'
import OperateModal from './operateModal'
import {pageOption, dataFormat} from "../../utils/utils"
import './index.less'

class CouponRuleSetting extends PureComponent {
    constructor (props){
        super(props);
        this.state = {
            searchFields: {},
            visible: false,
            editData:null,
            editId:'',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0,
            loading:true
        }
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    componentDidMount = () => {
      this.renderTable()
    }
    renderTable =()=>{
        let params = {
            orderBy: 'create_time desc',
            pageNum:this.state.pageNum,
            pageSize:this.state.pageSize
        }
        couponService.getRuleTable(params).then((data)=>{
            this.setState({
                data:data.list,
                total:data.total,
                loading:false
            })
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    };
    // 新增和修改优惠券规则
    onSubmit = (err,value, type) =>{
        if(!err){
            let params = {
                rulesName:value.rulesName,
                couponType:value.couponType,
                feeTypes:value.free,
                costExpress:value.costExpress,
                costSharingType:value.costSharingType,
                memberType:value.memberType,
                calculateType:value.calculateType
            };
            if(value.couponType === 3){ //满减劵
                params.fullValue = value.fullMoney;
                params.reduceValue = value.fullSubtractMoney;
            }else if(value.couponType === 2){ // 折扣劵
                let _discountMoney = value.discountMoney
                try {
                    _discountMoney = _discountMoney.replace('折','')
                } catch (error) {
                    console.log(error)
                }
                params.discount = _discountMoney
            } else if(value.couponType === 1){ // 立减劵
                params.faceValue = value.subtractMoney
            }
            if(value.calculateType === 1){ //成本固定比例
                params.costRatio = (value.luke) / 100
            }else { //浮动比例
                params.costTypes = value.costTypes;
                params.costRatio = (value.luke0) / 100;
                params.totalFeeRatio = (value.luke1) / 100;
                params.operatorValue1 = value.than0;
                params.operatorValue2 = value.than1;
                params.calculatePrice = value.momey;
            }
            if(type === 'add'){ //新增
                couponService.putMoneyRule(params).then((data)=>{
                    if(data === 1){
                        this.setState({
                            visible: false
                        },()=>{
                            message.success('新增成功')
                            this.renderTable()
                        })

                    }
                }).catch((e)=>{
                    message.error('新增失败',e)
                })
            }else { // 修改
                params.id = this.state.editId
                couponService.putRule(params).then((data)=>{
                    if(data === 1){
                        this.setState({
                            visible: false
                        },()=>{
                            message.success('修改成功')
                            this.renderTable()
                        })

                    }
                }).catch(e=>{
                    message.error('修改失败',e)
                })
            }

        }

    }
    // 修改弹窗
    operateEdit = (behavior,id) => () => {
        couponService.getOneRule(id).then((data)=>{
            this.setState({
                editData:data,
                visible: true,
                behavior: behavior,
                editId:id
            })
        }).catch(e => {
            message.error(e)
        })

    }
    // 新增弹窗
    operateAdd = (behavior) => () => {
        this.setState({
            editData:null,
            visible: true,
            behavior: behavior
        })
    }
    // 删除优惠券规则
    onDelete = (id) => () => {
        couponService.deleteRule(id).then((data)=>{
            if(data === 1) {
                message.success('删除成功')
                this.renderTable()
            }
        }).catch((e)=>{
            message.error('删除失败',e)
        })
    }
    render () {
        const _this = this
        const columns = [{
            title: '规则名称',
            dataIndex: 'rulesName'
        }, {
            title: '面额（元）/ 折扣',
            dataIndex: 'faceValue',
            width: 200,
            render: (v,record) =>{
                if(v){
                    return `立减${v}元`
                }else if(record.discount){
                    return `${(record.discount * 10).toFixed(1)}折`
                }else{
                    return `满${record.fullValue}减${record.reduceValue}`
                }
            }
        }, {
            title: '优惠券类型',
            dataType: 'couponType',
            render: (v,record) =>{
                return <span>
                    { record.couponType === 1 ? '立减券' : record.couponType === 2 ? '折扣' : '满减券'}
                </span>
            }
        }, {
            title: '优惠项',
            dataType: 'feeTypes',
            render: (v,record)=>{
                const {feeTypes} = record;
                let renderContent = [];
                if(feeTypes.indexOf('1') !== -1){
                    renderContent.push('首晚房晚价格')
                }
                if(feeTypes.indexOf('2') !== -1){
                    renderContent.push('房晚实际价格')
                }
                if(feeTypes.indexOf('3') !== -1){
                    renderContent.push('清洁费')
                }
                if(feeTypes.indexOf('4') !== -1){
                    renderContent.push('预订服务费')
                }
                if(feeTypes.indexOf('5') !== -1){
                    renderContent.push('保险费')
                }
                if(feeTypes.indexOf('6') !== -1){
                    renderContent.push('商务出行套餐费')
                }
                return <Tooltip title={renderContent.join(",")}>
                    <span>
                    详细
                </span>
                </Tooltip>
            }
        }, {
            title: '创建时间',
            render : (v,r)=>{
                return <span>{dataFormat(r.createTime)}</span>
            }
        }, {
            title: '创建者',
            dataIndex: 'creator'
        }, {
            title: '最新修改时间',
            render : (v,r)=>{
                return <span>{dataFormat(r.timeVersion)}</span>
            }
        }, {
            title: '最新修改者',
            dataIndex: 'updator'
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
                        {/* <Button
                            {...commonBtn}
                            onClick={this.operateEdit('edit',record.id)}
                        >修改</Button> */}
                        <Button
                            {...commonBtn}
                            onClick={this.operateEdit('view',record.id)}
                        >查看</Button>
                        <Popconfirm placement="left" title={'确认删除？'} onConfirm={this.onDelete(record.id)} okText="确认" cancelText="取消">
                        <Button
                            {...commonBtn}
                            type="ghost"
                        >删除</Button>
                        </Popconfirm>
                    </div>
                )
            },
            width: 200
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
                this.setState({ pageNum: 1, pageSize:pageSize,loading:true },()=>{ _this.renderTable()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize,
                    loading:true
                },()=>{_this.renderTable()})
            }
        }
        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.operateAdd('add')}
                    >添加规则</Button>
                </div>
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
                    title={this.state.behavior === 'add' ? '创建规则' : '修改规则'}
                    onCancel={this.onCancel}
                    onSubmit={this.onSubmit}
                    editData={this.state.editData}
                />
            </div>
        )
    }
}

export default CouponRuleSetting
