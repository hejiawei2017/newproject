import React, {Component} from 'react'
import {houseManageSearch} from "../../utils/dictionary";
import {searchObjectSwitchArray} from "../../utils/utils";
import { Drawer } from 'antd';
import SubTable from '../../components/subTable'
import Search from '../../components/search'
import {houseManageListService} from '../../services'
import HouseDetail from './detail'


class HouseMaintain extends Component {

    constructor () {
        super()
        this.state = {
            isShowDetail: false,
            houseSourceId: '',
            selectedHouseInfo: {},
            drawerTitle: '房源地址',
            searchConfig: {
                items: [
                    {
                        type: 'text',
                        name: '房源编码',
                        key: 'houseNo',
                        searchFilterType: 'string',
                        placeholder: '请输入房源编码'
                    },
                    {
                        type: 'multiple-select',
                        name: '上线状态',
                        key: 'houseStatusIn',
                        selectData: searchObjectSwitchArray(houseManageSearch.houseStatus),
                        renderSelectData: houseManageSearch.houseStatus,
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择上线状态'
                    },
                    {
                        type: 'selectAreaBu',
                        name: '大区/BU',
                        key: 'area',
                        searchFilterType: 'string',
                        placeholder: '请选择大区/BU'
                    },
                    {
                        type: 'text',
                        name: '房东姓名/电话',
                        key: 'landlord',
                        searchFilterType: 'string',
                        placeholder: '请输入房东姓名/电话'
                    },
                    {
                        type: 'text',
                        name: 'BU总管姓名/电话',
                        key: 'bu',
                        searchFilterType: 'string',
                        placeholder: '请输入BU总管姓名/电话'
                    },
                    {
                        type: 'text',
                        name: '主管家姓名/电话',
                        key: 'assist',
                        searchFilterType: 'string',
                        placeholder: '请输入主管家姓名/电话'
                    },
                    {
                        type: 'text',
                        name: '房源地址',
                        key: 'keyword',
                        searchFilterType: 'string',
                        placeholder: '请输入房源地址'
                    }
                ]
            },
            searchFields: {}
        }
    }

    onSearch = (searchFields) => {
        this.setState({
            pageNum: 1,
            searchFields:{
                bu: searchFields.bu.value,
                assist: searchFields.assist.value,
                landlord: searchFields.landlord.value,
                houseStatusIn: !!searchFields.houseStatusIn.value ? searchFields.houseStatusIn.value.join(',') : undefined,
                area: !!searchFields.area.value.length > 0 ? searchFields.area.value[searchFields.area.value.length - 1] : undefined,
                houseNo: searchFields.houseNo.value,
                keyword: searchFields.keyword.value
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    onCloseDrawer = () => {
        this.setState({
            isShowDetail: false
        })
    }
    getDrawerTitle = (title) => {
        this.setState({
            drawerTitle: title
        })
    }

    render () {
        const that = this
        const { searchConfig, searchFields, isShowDetail, houseSourceId, drawerTitle, selectedHouseInfo } = this.state
        const columns = [
            {title: '房源编号', dataIndex: 'houseNoName', width: 150},
            {title: '地址', dataIndex: 'address', width: 150},
            {title: '上线状态', dataIndex: 'houseStatus', width: 150, render: val => {
                return (
                    <span>
                        {houseManageSearch.houseStatus[val]}
                    </span>
                )
            }},
            {title: '区域', dataIndex: 'buArea', width: 150},
            {title: '房东', dataIndex: 'landlord', width: 150},
            {title: 'BU总管', dataIndex: 'bu', width: 150},
            {title: '管家', dataIndex: 'assist', width: 150},
            {title: '创建时间', dataIndex: 'createTime', width: 150},
            {title: '正式上线成功时间', dataIndex: 'houseWorkflowStatusAuditTime', width: 150}
        ];
        const subTableItem = {
            getTableService: houseManageListService.getTable,
            searchFields: searchFields,
            columns: columns,
            refsTab: function (ref) {
                that.tableThis = ref
            },
            rowKey: "houseSourceId",
            operatBtn: [
                {
                    label: 'button',
                    size: "small",
                    className: 'mt10',
                    type: "primary",
                    onClick: record => {
                        that.setState({
                            isShowDetail: true,
                            houseSourceId: record.houseSourceId,
                            selectedHouseInfo: record
                        })
                    },
                    text: '修改'
                }],
            operatBtnWidth: 64,
            antdTableProps: {
                bordered: true
            },
            operatBtnFixed: 'right'
        };
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    isShowDetail ?
                    <Drawer
                    title={drawerTitle}
                    width={1200}
                    onClose={this.onCloseDrawer}
                    visible
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 108px)',
                        paddingBottom: '108px'
                    }}
                    >
                        <div style={{fontSize: 18, textAlign: 'center', borderBottom: 15}}>房源编号：{selectedHouseInfo.houseNoName} &nbsp;&nbsp;上线状态：{houseManageSearch.houseStatus[selectedHouseInfo.houseStatus]}</div>
                        <HouseDetail
                            onCloseDrawer={this.onCloseDrawer}
                            onSetDrawerTitle={this.getDrawerTitle}
                            houseSourceId={houseSourceId}
                            houseInfo={selectedHouseInfo}
                        />
                    </Drawer> : null
                }
            </div>
        )
    }

}

export default HouseMaintain
