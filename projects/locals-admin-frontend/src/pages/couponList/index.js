
import React, {Component,Fragment} from 'react'
import { SearchParent} from '../../components/index'
import TableTooltip from '../../components/tableTooltip'
import {couponService,couponAuditerService} from '../../services'
import {Button, message, Table, Popconfirm,Tooltip} from 'antd'
import OperateCouponModal from './operateCouponModal.js'
import {couponTypeMap} from '../../utils/dictionary'
import {pageOption,dataFormat} from "../../utils/utils";
import { stat } from 'fs';

let selectCouponType = couponTypeMap.map(v => ({value: v.value, text: v.label}));
selectCouponType.unshift({value: '', text: '全部'});

const searchConfig = {
    items: [ {
        type: 'text',
        name: '优惠券名称',
        key: 'couponName',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    // }, {
    //     type: 'select',
    //     name: '券状态',
    //     key: 'status',
    //     selectData: [
    //         {value: '', text: '全部'},
    //         {value: 0, text: '启用'},
    //         {value: 1, text: '停用'}
    //     ]
    // }, {
    //     type: 'select',
    //     name: '优惠券类型',
    //     key: 'couponType',
    //     selectData: selectCouponType
    }, {
        type: 'text',
        name: '优惠券类型ID',
        key: 'id',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入内容'
    }]
};

class CouponList extends Component {
    state = {
        searchFields: {},
        isRepeat: false,
        visible: false,
        behavior: '',
        ruleList: [],
        userList: [],
        channelList: [],
        houseTagList: [],
        couponList: [],
        pageNum: pageOption.pageNum,
        pageSize: pageOption.pageSize,
        pageSizeOptions: pageOption.pageSizeOptions,
        couponName:'',
        status:'',
        couponType:'',
        id:'',
        total:0,
        loading:true,
        auditListOne:[],
        auditListTwo:[],
        readContent:null
    };
    componentDidMount () {
        this.getCouponList();
        this.getRuleTable();
        this.getUserList();
        this.getChannelList();
        this.getHouseTagList();
        this.getAuditListOne();
        this.getAuditListTwo();
    }
    getCouponList = () =>{
        const {pageNum,pageSize,couponName,id} = this.state;
        let params = {
            orderBy: 'create_time desc',
            pageNum: pageNum,
            pageSize: pageSize
        };
        if(couponName)params.couponNameLike = couponName
        //if(status !== "")params.status = status
        //if(couponType)params.couponType = couponType
        if(id)params.id = id
        couponService.getCouponList(params).then((data) =>{
            this.setState({
                pageNum:data.pageNum,
                couponList:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    };
    getRuleTable = () => {
        couponService.getRuleTable().then((data) => {
            this.setState({ruleList: data.list})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    };
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
    };
    getHouseTagList = () => {
        couponService.getHouseTagList().then((data) => {
            const list = this.classifyData(data);
            this.setState({houseTagList: list})
        }).catch(e => {
            message.error(e.errorDetail)
        })
    };
    getAuditListOne = () =>{
        const params = {
            grade:1
        };
        couponAuditerService.getAuditList(params).then((data)=>{
            this.setState({
                auditListOne:data.list
            })
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    };
    getAuditListTwo = () =>{
        const params = {
            grade:2
        };
        couponAuditerService.getAuditList(params).then((data)=>{
            this.setState({
                auditListTwo:data.list
            })
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    };
    onSearch = (searchFields) => {
        this.setState({
            pageNum: 1,
            couponName:searchFields.couponName.value,
            //status:searchFields.status.value,
            //couponType:searchFields.couponType.value,
            id:searchFields.id.value
        },()=>{ this.getCouponList()})
    };
    onCancel = () => {
        this.setState({
            visible: false
        })
    };

    classifyData = (data) => {
        let newData = {};
        let newList = [];
        data && data.forEach(item => {
            if(newData[item.categoryId]) {
                newList.forEach(newListItem => {
                    if(newListItem.categoryId === item.categoryId) {
                        newListItem.list.push(item);
                    }
                })
            }else {
                newList.push({
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                    list: [{...item}]
                })
            }
            newData[item.categoryId] = item;
        })
        return newList;
    }

    operateCoupon = (behavior,record) => () => {
        this.setState({
            visible: true,
            behavior: behavior,
            readContent:record || null
        })
    };
    openCoupon = record =>()=>{
        this.setState({
            visible: true,
            behavior: 'view',
            readContent: record
        })
    };
    onSubmitAdd = (value) => {
        if(this.state.isRepeat){
            return ;
        }
        this.setState({
            isRepeat: true
        });
        try {
            let params = {
                synopsis: value.synopsis,
                remark: value.remark,
                bookPeriodType: value.bookPeriodType,
                bookStartTime: value.bookRangePicker && value.bookRangePicker[0],
                bookEndTime: value.bookRangePicker ? value.bookRangePicker[1] : (value.bookEndTime ? value.bookEndTime : undefined),
                bookAfterEffectiveDays: value.bookAfterEffectiveDays,
                bookEffectiveDays: value.bookEffectiveDays,
                rulesId: value.moneyRuleId,
                labelIds: value.userTagsId,
                channelIds: value.channelId,
                houseSourceTag: value.houseTagName,
                cityNames: value.couponCityName,
                couponName: value.couponName,
                description: value.description,
                validityPeriodType: value.validityPeriodType,
                receiveLimitType: value.getLimit,
                receiveLimit: value.getLimit === 0 ? -1 : value.receiveLimit,
                useRestrictionType: value.useRestrictionType,
                useCouponLimit: value.useCouponLimit,
                nightsLimit: value.nightsLimit === -1 ? value.nightsLimit : value.nights,
                workDays : value.workDays,
                dateLimit : value.dateLimit,
                holidayLimit:  1 ,
                reviewerIds: value.secondLevel ? [value.firstLevel,value.secondLevel && value.secondLevel] : [value.firstLevel]
            }

            if(value.count >= 0){
                params.couponQuantity = value.count
            }else{
                params.couponQuantity = -1
            }
            if (value.validityPeriodType === 2) {
                params.afterEffectiveDays = value.effective
                if(value.endTime){
                    params.endTime = value.endTime
                }else{
                    params.effectiveDays = value.day
                }
            } else if (value.validityPeriodType === 1) {
                params.startTime = value.rangePicker && value.rangePicker[0]
                params.endTime = value.rangePicker && value.rangePicker[1]
            }
            couponService.postCoupon(params).then((data)=>{
                if(data >= 1){
                    this.setState({
                        visible: false
                    },()=>{
                        message.success('新增成功');
                        this.getCouponList()
                    })
                }
                this.setState({
                    isRepeat: false
                });
            }).catch(err => {
                this.setState({
                    isRepeat: false
                });
            })
        }catch (e) {
            console.log(JSON.stringify(e));
            this.setState({
                isRepeat: false
            });
        }


    }
    onSubmitEdit = (value, id) => {
        let params = {
            synopsis: value.synopsis,
            remark: value.remark,
            couponName: value.couponName,
            description: value.description,
            houseSourceTag: value.houseTagName,
            dateLimit: value.dateLimit,
            cityNames: value.couponCityName,
            id: id
        }
        couponService.editCoupon(params).then((data)=>{
            this.setState({
                visible: false
            },()=>{
                message.success('修改成功')
                this.getCouponList()
            })
        })
    }
    // 新增和修改
    onSubmit = (err, value, behavior, id) => {
        if(behavior === 'add'){//新增
            if (!err) {
                this.onSubmitAdd(value)
            }
        }else{//修改
            if (!err || !err.synopsis && !err.remark && !err.couponName && !err.description) {
                this.onSubmitEdit(value, id)
            }
        }
    };
    onDetele = (id) =>()=>{
        couponService.deleteCoupon(id).then((data)=>{
            if(data >= 1){
                message.success('删除成功');
                this.getCouponList()
            }
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    };
    render () {
        const columns = [
            {
                title: '优惠券名称',
                width: 100,
                dataIndex: 'couponName'
            },
            {
                title: '优惠券类型ID',
                width: 100,
                dataIndex: 'id'
            },
            {
                title: '使用规则',
                width: 100,
                dataIndex: 'description',
                render:(v) =>{
                    return <TableTooltip content={v} width={100}/>
                }
            },
            {
                title: '优惠券类型',
                width: 80,
                dataIndex: 'couponType',
                render: (v, record) => {
                    return <div>
                    {record.couponRules.couponType === 1 ? '立减券' : record.couponRules.couponType === 2 ? '折扣' : '满减券'}
                </div>
                }
            }, {
                title: '使用限制',
                dataIndex: 'useCouponLimit',
                render :(v,record) =>{
                    return <div>
                        {record.useCouponLimit === '-1' ? '无限制' : `${record.useCouponLimit}晚`}
                    </div>
                }
            },
            {
                title: '发放数量',
                dataIndex: 'couponQuantity',
                render :(v,record) =>{
                    return <div>
                        {record.couponQuantity === '-1' ? '无限制' : `${record.couponQuantity}张`}
                    </div>
                }
            },
            {
                title: '更新时间',
                render:(v,record) =>{
                    return <div>{dataFormat(record.createTime,"YYYY-MM-DD HH:mm:ss")}</div>
                }
            },
            {
                title: '审批状态',
                render :(v,r)=>{
                    return r.couponReviews.map((item,index)=>{
                        return<div key={index.toString()}>{item.grade}级审核结果:{item.state === 0 ? '待审批' : item.state === 1 ? '审批通过' : '审批不通过'}</div>
                    })

                }
            },
            {
                title: '操作',
                align:'center',
                render: (v, record) => {
                    let commonBtn = {
                        className: 'mr-sm',
                        type: 'primary',
                        size: 'small'
                    };
                    return (
                        <Fragment>
                            <Button
                                {...commonBtn}
                                onClick={this.openCoupon(record)}
                            >查看</Button>
                            <Button
                                {...commonBtn}
                                onClick={this.operateCoupon('edit',record)}
                            >修改</Button>
                            {record.couponCode &&
                            <Tooltip title={record.couponCode}>
                                <Button
                                    {...commonBtn}
                                >优惠码</Button>
                            </Tooltip>
                            }
                            <Popconfirm title="确认删除?" onConfirm={this.onDetele(record.id)} okText="确认" cancelText="取消">
                                <Button
                                    {...commonBtn}
                                    type="danger"
                                >删除</Button>
                            </Popconfirm>
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
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getCouponList()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getCouponList()})
            }
        };
        return (
            <div>
                <SearchParent
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.operateCoupon('add')}
                    >创建优惠券</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.couponList}
                    rowKey={'id'}
                    pagination={pagination}
                    loading={this.state.loading}
                    scroll={{ x: '105%' }}
                />
                <OperateCouponModal
                    visible={this.state.visible}
                    behavior={this.state.behavior}
                    onCancel={this.onCancel}
                    ruleList={this.state.ruleList}
                    userList={this.state.userList}
                    channelList={this.state.channelList}
                    houseTagList={this.state.houseTagList}
                    onSubmit={this.onSubmit}
                    auditListOne={this.state.auditListOne}
                    auditListTwo={this.state.auditListTwo}
                    readContent={this.state.readContent}
                />
            </div>
        )
    }
}

export default CouponList
