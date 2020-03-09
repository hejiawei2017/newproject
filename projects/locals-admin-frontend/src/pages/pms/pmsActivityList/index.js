import React, {Component} from 'react'
import SubTable from '../../../components/subTable'
import {pmsService} from '../../../services'
import { Table,Button,message,Popconfirm,Badge,Menu,Icon} from 'antd'
import { withRouter } from 'react-router-dom'
import Search from '../../../components/search'
import {dataFormat} from '../../../utils/utils'
import AEditActivityForm from './editActivity'
// import PmsNav from '../components'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '促销名称',
            key: 'houseSourceId',
            searchFilterType: 'string',
            placeholder: '请输入促销名称'
        },
        {
            type: 'text',
            name: '促销类型',
            key: 'memberId',
            searchFilterType: 'string',
            placeholder: '请输入促销类型'
        }
    ]
}
class PmsActivityList extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields: {
                orderStatus: 2
            },
            editData:{
                id:123455,
                activityTypeValue:null,
                activityDiscount:null,
                activitySuitType:[],
                activitySuitDate:null,
                activitySuitWeeks: [],
                activityName:null,
                activityNigthCouts:null,
                activityNigthTime1:null,
                activityNigthTime2:null
            }
        }
        // this.storeId = props.match.params.id
        // this.storeName = props.match.params.name
        this.hotelId = this.props.hotelId
    }

    renderTable = () => {
        this.tableThis.renderTable()
    }

    onSearch = (searchFields) => {
        this.setState({
            searchFields: {
                houseSourceId: searchFields.houseSourceId.value,
                memberId: searchFields.memberId.value
            }
        },this.renderTable())
    }

    // 新增数据
    onAdd = () => {
        this.setState({
            visible:true
        })
    }

    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
        this.tableThis.renderTable()
    }

    onDetail = (record) => {
        pmsService.commentOnly(record.id).then((data) => {
            this.setState({
                visible:true,
                id:record.id
            })
        })
    }

    routerPaths = (e) =>{
        this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    }

    render () {
        let _self = this
        const columns = [
            {title: '促销名称',dataIndex: 'houseSourceId',key: 'houseSourceId',width:200},
            {title: '促销类型', dataIndex: 'memberName', width: 100, render: (val) => {
                return (
                    <span>连住优惠</span>
                )
            }},
            {title: '连住优惠天数', dataIndex: 'priceRatio', width: 120},
            {title: '预订日期', dataIndex: 'checkin', width: 200, render: (val,record) => {
                return (
                    <div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')} <div> ~ </div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')}</div>
                )
            }},
            {title: '入住日期', dataIndex: 'comment', width: 200, render: (val,record) => {
                return (
                    <div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')} <div> ~ </div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')}</div>
                )
            }},
            {title: '促销有效时间段', dataIndex: 'timeVersion', width: 200, render: (val,record) => {
                return (
                    <div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')} <div> ~ </div>{dataFormat(record.timeVersion, 'YYYY-MM-DD HH:MM:SS')}</div>
                )
            }}
        ]
        const subTableItem = {
            getTableService: pmsService.getCommentTable,
            columns: columns,
            refsTab: (ref) => {
                _self.tableThis = ref
            },
            rowKey: "bookingId",
            searchFields: _self.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            pageSize: 30,
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                onClick: record => {
                    // _self.onDetail(record)
                    _self.setState({
                        visible: true,
                        editData:{
                            id:record.houseSourceId,
                            activityTypeValue:0,
                            activityDiscount:20,
                            activitySuitType:["A", "B"],
                            activitySuitDate:['2019-01-04','2019-01-07'],
                            activitySuitWeeks: [1, 2, 3],
                            activityName:record.memberName,
                            activityNigthCouts:null,
                            activityNigthTime1:null,
                            activityNigthTime2:null
                        }
                    })
                },
                text: '编辑促销'
             }, {
                label: 'delete',
                size: "small",
                type: "primary",
                onClick: record => {
                    return pmsService.del(record.id)
                },
                text: '删除'
            }],
            operatBtnWidth: 150,
            isModal: true
        }
        return (
            <div>
                {/*<PmsNav current={'pmsActivityList'}*/}
                        {/*routerPath={this.routerPaths}*/}
                        {/*storeTitle={this.storeName}*/}
                {/*/>*/}
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right padder-v-sm">
                    <Button
                        type="primary"
                        onClick={_self.onAdd}
                    >
                        新增
                    </Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {
                    this.state.visible ?
                        <AEditActivityForm
                        //    wrappedComponentRef={this.saveFormRef}
                           visible={this.state.visible}
                           id={this.state.id}
                           data={this.state.editData}
                           onCancel={this.handleCancel}
                        /> : null
                }
            </div>
        )
    }
}


export default withRouter(PmsActivityList)
