import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {commentService, newIncumbentSettingService} from '../../services'
import {ApprovalStatus} from '../../utils/dictionary'
import Search from '../../components/search'
import {
    setArrayToData
} from "../../utils/arrayTransform";
import { Drawer } from 'antd';
import HouseDetail from '../houseMaintain/detail';


const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源编码',
            key: 'houseSourceId',
            searchFilterType: 'string',
            placeholder: '请输入房源编码'
        }, {
            type: 'select',
            name: '审批状态',
            key: 'houseSourceId2',
            searchFilterType: 'string',
            renderSelectData: ApprovalStatus,
            placeholder: '请选择'
        }, {
            type: 'text',
            name: 'BU姓名/手机',
            key: 'memberId',
            searchFilterType: 'string',
            placeholder: '请输入BU姓名/手机'
        }, {
            type: 'text',
            name: '管家姓名/手机',
            key: 'memberId2',
            searchFilterType: 'string',
            placeholder: '请输入管家姓名/手机'
        }, {
            type: 'text',
            name: '小区名称',
            key: 'memberId3',
            searchFilterType: 'string',
            placeholder: '请输入小区名称'
        }, {
            type: 'rangepicker',
            name: '提交时间',
            key: 'memberId4',
            searchFilterType: 'string',
            placeholder: '请选择'
        }, {
            type: 'cascader',
            name: '城市',
            key: 'memberId5',
            cascaderOpts: [],
            searchFilterType: 'string',
            placeholder: '请选择'
        }
    ]
}
class LongRentLease extends Component {
    constructor () {
        super ()
        this.state = {
            searchFields: {
                orderStatus: 2
            },
            isShowDetail:false,
            drawerTitle: '上架审批' || '变更审批'
        }
    }
    componentDidMount (){
        this.getSiteTable()
    }

    getSiteTable = () => {
        newIncumbentSettingService
        .getSiteTable({ pageNum: 1, pageSize: 20000 })
        .then(e => {
            let siteData = setArrayToData(
                e.list,
                "parentCode",
                "code",
                "children",
                this.changeArray,
                this.isChildren
            );
            // let workplace = this.props.editInfoData.workplace;
            // let siteDataArr = this.state.siteDataArr;
            // if (siteDataArr.length === 0) {
            //     siteDataArr = getArrayValueToparent(
            //         e.list,
            //         "parentCode",
            //         "code",
            //         "name",
            //         workplace
            //     );
            // }
            searchConfig['items'][6].cascaderOpts = siteData
            this.setState({
                siteData,
                // siteDataArr,
                oSiteData: e.list
            });
        });
    };
    renderTable = () => {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                id: searchFields.id.value,
                houseSourceId: searchFields.houseSourceId.value,
                phone: searchFields.phone.value,
                orderStatus: searchFields.orderStatus.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        }, this.renderTable)
    }
    changeArray = item => {
        return {
            value: item.code,
            label: item.name
        };
    };
    isChildren = item => {
        return item.name === "市辖区";
    };
    onCloseDrawer = () =>{
        this.setState({isShowDetail:false})
    };
    render () {
        let that = this

        const columns = [
            {
                title: '房源编码',
                dataIndex: 'houseSourceId',
                key: 'houseSourceId',
                width: 100
            },{
                title: '城市',
                dataIndex: 'comment',
                width: 100
            },{
                title: '区+小区',
                dataIndex: 'memberName',
                width: 200
            },{
                title: '单元',
                dataIndex: 'priceRatio',
                width: 200
            },{
                title: '月租金',
                dataIndex: 'descriptionMatch',
                width: 100
            },{
                title: 'BU总管',
                dataIndex: 'memberId',
                width: 100
            },{
                title: '管家',
                dataIndex: 'creator',
                width: 100
            },{
                title: '审批类型',
                dataIndex: 'communication',
                width: 100
            },{
                title: '审批状态',
                dataIndex: 'status',
                width: 100
            },{
                title: '提交时间',
                dataIndex: 'createTime',
                type: 'date',
                width: 100
            }
        ]
        const subTableItem = {
            getTableService: commentService.getCommentTable,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            pageSize: 30,
            operatBtn: [
                {
                    label: 'button',
                    size: "small",
                    className: 'mt10',
                    type: "primary",
                    visible: (record) => record.status === 1,
                    onClick: record => {
                        console.log(record);
                        that.setState({
                            isShowDetail: true
                            // houseSourceId: record.houseSourceId
                        })
                    },
                    text: '查看'
                }, {
                    label: 'button',
                    size: "small",
                    className: 'mt10',
                    type: "primary",
                    visible: (record) => record.status !== 1,
                    text: '查看日志'
                }
            ],
            operatBtnWidth: 120,
            operatBtnFixed: 'right',
            // isModal: true,
            scroll: {
                x: 'auto'
            }
        };
        const {isShowDetail,drawerTitle,houseSourceId} = this.state;
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
                            123
                        </Drawer> : null
                }
            </div>
        )
    }
}

export default LongRentLease
