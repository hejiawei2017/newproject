import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {cityService, commentService, longRentService, newIncumbentSettingService} from '../../services'
import {ApprovalStatus, longRentalStatus, manageStatus} from '../../utils/dictionary'
import Search from '../../components/search'
import { Drawer,Row,Button } from 'antd';
import HandleHouseInfo from './handleHouseInfo';
import HandleLeaseInfo from './handleLeaseInfo';
import "../longRentCommon/index.less";
import PmsHotelDetail from "../pms/pmsStoreList";

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
        dataIndex: 'buManager',
        width: 100
    },{
        title: '长租状态',
        dataIndex: 'longRentalStatus',
        render: (text, record) => {
            return longRentalStatus[record.longRentalStatus]
        },
        width: 100
    },{
        title: '经营状态',
        dataIndex: 'manageStatus',
        render: (text, record) => {
            return manageStatus[record.manageStatus]
        },
        width: 100
    }
]

class LongRentHouses extends Component {
    constructor (props) {
        super (props);
        this.state = {
            searchFields: {},
            cityData: [],
            areaData: [],
            isShowDetail:false,
            drawerTitle: '上架审批' || '变更审批',
            isShowPost:false
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
    renderTable = () => {
        this.tableThis.renderTable()
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
    changeArray = item => {
        return {
            value: item.code,
            label: item.name
        };
    };

    onCloseDrawer = () =>{
        this.setState({isShowDetail:false,isShowPost:false})
    };
    showPost=()=>{
      this.setState({
          isShowPost:true
      })
    };
    hidePost=()=>{
        this.setState({
            isShowPost:false
        })
    };
    submitPostData=(data)=>{
      return ()=>{
          console.log(data)
      }
    };
    render () {
        let that = this
        const subTableItem = {
            getTableService: longRentService.getLongRentalList,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "houseNo",
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
                    type: 'select',
                    name: '长租状态',
                    key: 'longRentalStatus',
                    searchFilterType: 'string',
                    renderSelectData: longRentalStatus,
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
                }, {
                    type: 'text',
                    name: '小区名称',
                    key: 'neighbourhoodName',
                    searchFilterType: 'string',
                    placeholder: '请输入小区名称'
                }, {
                    type: 'select',
                    name: '经营状态',
                    key: 'manageStatus',
                    searchFilterType: 'string',
                    renderSelectData: manageStatus,
                    placeholder: '请选择'
                }
            ],
            exportBlob: {
                name: '长租房源数据',
                extend: 'xls',
                url: `/prod-plus/long/rental/approval/list/excel/export`,
                params: this.state.searchFields
            },
            columns: columns
        }


        const {isShowDetail,drawerTitle,isShowPost,renderSearchConfig} = this.state;
        return (
            <div>
                {
                    renderSearchConfig && <Search onSubmit={this.onSearch} config={searchConfig}>
                        <div className="flex-inline">
                            <Button className="margin-right-def" onClick={this.showPost}>发布长租房源</Button>
                        </div>
                    </Search>
                }
                <SubTable
                    {...subTableItem}
                />
                {/*<Drawer*/}
                    {/*title={drawerTitle}*/}
                    {/*width={1200}*/}
                    {/*onClose={this.onCloseDrawer}*/}
                    {/*visible={isShowDetail}*/}
                    {/*style={{*/}
                        {/*overflow: 'auto',*/}
                        {/*height: 'calc(100% - 108px)',*/}
                        {/*paddingBottom: '108px'*/}
                    {/*}}*/}
                {/*>*/}
                    {/*<LongRentPostHouseDrawer*/}
                        {/*onCancel={this.onCloseDrawer}*/}
                        {/*onSubmitCb={this.submitPostData}*/}
                    {/*/>*/}
                {/*</Drawer>*/}
                {/*<Drawer*/}
                    {/*title={"长租房源查看"}*/}
                    {/*width={1200}*/}
                    {/*onClose={this.onCloseDrawer}*/}
                    {/*visible={isShowPost}*/}
                    {/*style={{*/}
                        {/*overflow: 'auto',*/}
                        {/*height: 'calc(100% - 108px)',*/}
                        {/*paddingBottom: '108px'*/}
                    {/*}}*/}
                {/*>*/}
                    {/*222*/}
                    {/**/}
                {/*</Drawer>*/}
                {
                    isShowPost ?
                        <Drawer
                            title={'新发布/编辑整屋信息'}
                            width="100%"
                            onClose={this.hidePost}
                            visible
                            className={'ant-drawer-body'}
                        >
                            <HandleHouseInfo
                                onCancel={this.onCloseDrawer}
                                onSubmitCb={this.submitPostData}
                                cityData={this.state.cityData}
                            />
                        </Drawer> : null
                }

                {/*<HandleLeaseInfo*/}
                    {/*onCancel={this.onCloseDrawer}*/}
                    {/*onSubmitCb={this.submitPostData}*/}
                {/*/>*/}
            </div>
        )
    }
}

export default LongRentHouses
