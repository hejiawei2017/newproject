import React, {Component} from 'react'
import SubTable from '../../../components/subTable'
import {pmsService} from '../../../services'
import {Button, Drawer} from 'antd'
import { withRouter } from 'react-router-dom'
import AddStoreForm from './addStore'
import Search from '../../../components/search'
import {HoletType, houseManageSearch} from '../../../utils/dictionary'
import PmsHotelDetail from "../pmsHotelDetail";
import './index.less'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '名称',
            key: 'hotelName',
            searchFilterType: 'string',
            placeholder: '请输入门店名称'
        },
        {
            type: 'text',
            name: '地址',
            key: 'address',
            searchFilterType: 'string',
            placeholder: '请输入门店地址'
        }
    ]
};

class PmsStoreList extends Component {

    constructor (props) {
        super (props);
        this.state = {
            searchFields: {
                hotelName: null,
                address: null
            },
            isShowDetail: false,
            drawerTitle:null,
            hotelId: null
        }
    }

    // renderTable = () => {
    //     this.tableThis.renderTable()
    // };

    onSearch = (searchFields) => {
        this.setState({
            searchFields: {
                hotelNameLike: searchFields.hotelName.value,
                addressLike: searchFields.address.value
            }
        })
    };

    pathsGo = (data) => {
        this.setState({
            isShowDetail: true,
            drawerTitle: data.hotelName,
            hotelNo: data.hotelNo,
            hotelType: data.hotelType,
            hotelId: data.id
        })
        // this.props.history.push({ pathname:"/pms/pmsStoreState/" + data.hotelName + "/" + data.id, parms: { name:data.hotelName, id: data.id}})
    };

    onCloseDrawer = () =>{
        this.setState({
            isShowDetail: false
        })
    };

    // 新增数据
    onAdd = () => {
        this.setState({
            visible:true
        })
    };

    // 关闭弹出框(包括提交成功的关闭)
    handleCancel = (e) => {
        this.setState({
            visible: false
        });
        this.tableThis.renderTable()
    };

    render () {
        const {isShowDetail,drawerTitle} = this.state;
        let _self = this;
        const columns = [
            {title: '门店类型',dataIndex: 'hotelType',key: 'houseSourceId',width:200,render: v => <span>{HoletType[v]}</span>},
            {title: '门店名称', dataIndex: 'hotelName', width: 200},
            {title: '门店地点', dataIndex: 'address', width: 200}
            // {title: '今明日入住/退房', dataIndex: 'priceRatio', width: 200, render: (val,record) => {
            //     const connt = 10
            //     return (
            //         <span>
            //             <Badge count={10} style={{ backgroundColor: connt === 0 ? '#999' : '#1890ff',marginRight:10 }}/>
            //             <Badge count={10} style={{ backgroundColor: connt === 0 ? '#999' : '#1890ff' }}/>
            //         </span>
            //     )
            // }}
        ];
        const subTableItem = {
            getTableService: pmsService.getStoreTable,
            columns: columns,
            refsTab: (ref) => {
                _self.tableThis = ref
            },
            rowKey: "id",
            searchFields: _self.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            pageSize: 30,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    _self.pathsGo(record)
                },
                text: '查看门店'
             }],
            operatBtnWidth: 120,
            isModal: true
        };
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right padder-v-sm">
                    <Button type="primary" onClick={_self.onAdd}>
                        新增
                    </Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {
                    this.state.visible ?
                        <AddStoreForm
                            visible={this.state.visible}
                            id={this.state.id}
                            onCancel={this.handleCancel}
                        /> : null
                }

                {
                    isShowDetail ?
                        <Drawer
                            title={drawerTitle}
                            width="100%"
                            onClose={this.onCloseDrawer}
                            visible
                            className={'ant-drawer-body'}
                        >
                            {/*<div style={{fontSize: 18, textAlign: 'center', borderBottom: 15}}>房源编号：{selectedHouseInfo.houseNoName} &nbsp;&nbsp;上线状态：{houseManageSearch.houseStatus[selectedHouseInfo.houseStatus]}</div>*/}
                            <PmsHotelDetail
                                onCloseDrawer={this.onCloseDrawer}
                                hotelId={this.state.hotelId}
                                hotelNo={this.state.hotelNo}
                                hotelType={this.state.hotelType}
                                // onSetDrawerTitle={this.getDrawerTitle}
                                // houseSourceId={houseSourceId}
                                // houseInfo={selectedHouseInfo}
                            />
                        </Drawer> : null
                }
            </div>
        )
    }
}


export default withRouter(PmsStoreList)
