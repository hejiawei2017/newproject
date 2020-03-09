import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {longRentService, cityService} from '../../services'
import {ApprovalStatus} from '../../utils/dictionary'
import Search from '../../components/search'
import { Drawer } from 'antd';
import DetailDrawer from './detail';
import '../longRentCommon/index.less';

const columns = [
    {
        title: '房源编码',
        dataIndex: 'houseNo',
        key: 'houseNo',
        width: 100
    },{
        title: '城市',
        dataIndex: 'cityName',
        width: 100
    },{
        title: '区+小区',
        dataIndex: 'areaName',
        render: (text, record) => {
            return (record.areaName || '') + ' ' + record.neighbourhoodName
        },
        width: 200
    },{
        title: '单元',
        dataIndex: 'unitNo',
        render: (text, record) => {
            return record.buildingNo + '号楼-' + record.unitNo + '单元-' + record.doorNumber
        },
        width: 200
    },{
        title: '月租金',
        dataIndex: 'monthRentPrice',
        width: 100
    },{
        title: 'BU总管',
        dataIndex: 'buName',
        width: 100
    },{
        title: '管家',
        dataIndex: 'buManagerName',
        width: 100
    },{
        title: '审批类型',
        dataIndex: 'approvalType',
        render: (text, record) => {
            return record.approvalType === '1' ? '变更审批' : '上架审批'
        },
        width: 100
    },{
        title: '审批状态',
        dataIndex: 'houseWorkflowStatus',
        render: (text, record) => {
            return ApprovalStatus[record.approvalType]
        },
        width: 100
    },{
        title: '提交时间',
        dataIndex: 'createTime',
        type: 'date',
        width: 100
    }
];
class LongRentApproval extends Component {
    constructor (props) {
        super (props);
        this.state = {
            onClickItem: {},
            cityData: [],
            areaData: [],
            renderSearchConfig: false,
            searchFields: {}
        }
    }
    componentDidMount (){
        this.getSiteTable()
    }
    getSiteTable = () => {
        const params = {
            existCity: true,
            pageNum: 1,
            pageSize: 10000,
            areaLevel: 3
        }
        cityService.getChinaAreas(params)
        .then(data => {
            const list = []
            if(data && data.list instanceof Array) {
                data.list.forEach((item,index) => {
                    list.push({
                        text: item.name,
                        value: item.code,
                        key: index
                    })
                })
            }
            this.setState({
                cityData: list,
                renderSearchConfig: true
            })
        });
    }
    onSearch = (searchFields) => {
        let searchFieldsTem = {}
        if(searchFields.workflowStatus.value){
            searchFieldsTem.workflowStatus = searchFields.workflowStatus.value.join(',')
        }
        if(isNaN(searchFields.buName.value)){
            searchFieldsTem.buName = searchFields.buName.value
        }else{
            searchFieldsTem.buMobile = searchFields.buName.value
        }
        if(isNaN(searchFields.managerName.value)){
            searchFieldsTem.managerName = searchFields.managerName.value
        }else{
            searchFieldsTem.managerMobile = searchFields.managerName.value
        }
        searchFieldsTem.houseNo = searchFields.houseNo.value
        searchFieldsTem.neighbourhoodName = searchFields.neighbourhoodName.value
        if(searchFields.commitBeginTime.value instanceof Array){
            searchFieldsTem.commitBeginTime = searchFields.commitBeginTime.value[0]
            searchFieldsTem.commitEndTime = searchFields.commitBeginTime.value[1]
        }
        searchFieldsTem.cityCode = searchFields.city.value
        searchFieldsTem.areaCode = searchFields.area.value
        searchFieldsTem.approvalType = 0
        if(this.props.approvalType){
            searchFieldsTem.approvalType = this.props.approvalType
        }
        this.setState({
            searchFields: searchFieldsTem
        })
    }
    onCloseDrawer = () =>{
        this.setState({isShowDetail:false})
    }
    render () {
        let that = this;
        const subTableItem = {
            getTableService: longRentService.getLongRentalApproval,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "houseSourceId",
            searchFields: this.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            pageSize: 10,
            operatBtn: [
                {
                    label: 'button',
                    size: "small",
                    type: "primary",
                    text: '查看',
                    onClick: record => {
                        that.setState({
                            isShowDetail: true,
                            onClickItem: record
                        })
                    }
                }
            ],
            operatBtnWidth: 100,
            operatBtnFixed: 'right',
            scroll: {
                x: 'auto'
            }
        };
        let searchConfig = {
            items: [
                {
                    type: 'text',
                    name: '房源编码',
                    key: 'houseNo',
                    searchFilterType: 'string',
                    placeholder: '请输入房源编码'
                }, {
                    type: 'multiple-select',
                    name: '审批状态',
                    key: 'workflowStatus',
                    searchFilterType: 'string',
                    renderSelectData: ApprovalStatus,
                    placeholder: '请选择'
                }, {
                    type: 'text',
                    name: 'BU姓名/手机',
                    key: 'buName',
                    searchFilterType: 'string',
                    placeholder: '请输入BU姓名/手机'
                }, {
                    type: 'text',
                    name: '管家姓名/手机',
                    key: 'managerName',
                    searchFilterType: 'string',
                    placeholder: '请输入管家姓名/手机'
                }, {
                    type: 'text',
                    name: '小区名称',
                    key: 'neighbourhoodName',
                    searchFilterType: 'string',
                    placeholder: '请输入小区名称'
                }, {
                    type: 'rangepicker',
                    name: '提交时间',
                    key: 'commitBeginTime',
                    searchFilterType: 'string'
                }, {
                    type: 'select',
                    name: '城市',
                    key: 'city',
                    selectData: this.state.cityData,
                    searchFilterType: 'select',
                    fun: (self, value) => {
                        cityService.getChinaAreas({parentCode: value}).then((data) => {
                            const list = []
                            if(data && data.list instanceof Array) {
                                data.list.forEach((item,index) => {
                                    list.push({
                                        text: item.name,
                                        value: item.code,
                                        key: index
                                    })
                                })
                            }
                            this.setState({
                                areaData: list
                            })
                        })
                    },
                    placeholder: '请选择'
                }, {
                    type: 'select',
                    name: '区',
                    key: 'area',
                    selectData: this.state.areaData,
                    searchFilterType: 'select',
                    placeholder: '请选择'
                }
            ],
            exportBlob: {
                name: this.props.approvalType ? '更变审批数据' : '上架审批数据',
                extend: 'xls',
                url: `/prod-plus/long/rental/approval/list/excel/export`,
                params: this.state.searchFields
            },
            columns: columns
        }
        const {isShowDetail, drawerTitle, renderSearchConfig, onClickItem} = this.state;
        return (
            <div>
                {
                    renderSearchConfig && <Search onSubmit={this.onSearch} config={searchConfig} />
                }
                <SubTable
                    {...subTableItem}
                />
                {
                    isShowDetail ?
                        <Drawer
                            title={drawerTitle}
                            width={800}
                            onClose={this.onCloseDrawer}
                            visible
                        >
                            <DetailDrawer
                                detailItem={onClickItem}
                            />
                        </Drawer> : null
                }
            </div>
        )
    }
}

export default LongRentApproval;
