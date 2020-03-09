import React, { Component } from 'react'
import { Table, Modal, message } from 'antd'
import { checkKey, dataFormat, envConfig, getNewImagePrefix, pageOption } from "../../utils/utils"
import { sexList, wechatSubscribeSceneObj, subscribeTagMap } from '../../utils/dictionary'
import { weixinUserlistService, weixinLabelService } from '../../services'
import { Form } from "antd/lib/index";
import { connect } from "react-redux";
import { serachingWeixinUserlist, serachWeixinUserlistSuccess } from "../../actions/weixinUserlist";
import Search from '../../components/search'
import moment from 'moment'

const renderSelectSexList = sexList.map((v, i) => (v))
const selectSexList = sexList.map((v, i) => ({value: i, text: v}))

const searchConfig = {
    items: [{
        type: 'text',
        name: '昵称',
        key: 'nickName',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '昵称'
    }, {
        type: 'rangepicker',
        name: '关注时间',
        key: 'range',
        placeholder: ['开始', '结束']
    }, {
        type: 'text',
        name: '手机号',
        key: 'phone',
        placeholder: '手机号'
    }, {
        type: 'text',
        name: '国家',
        key: 'country',
        placeholder: '国家'
    }, {
        type: 'text',
        name: '省市',
        key: 'province',
        placeholder: '省市'
    }, {
        type: 'text',
        name: '城市',
        key: 'city',
        placeholder: '城市'
    }, {
        type: 'select',
        name: '性别',
        key: 'sex',
        renderSelectData: renderSelectSexList,
        selectData: selectSexList
    }, {
        type: 'select',
        name: '是否BU',
        key: 'isBu',
        renderSelectData: {
            0: '否',
            1: '是'
        },
        selectData: [
            {value: '', text: '全部'},
            {value: '0', text: '否'},
            {value: '1', text: '是'}
        ]
    }, {
        type: 'number',
        name: '订单数量',
        key: 'orderAccount'
    }, {
        type: 'select',
        name: '是否房东',
        key: 'isLandlord',
        renderSelectData: {
            0: '否',
            1: '是'
        },
        selectData: [
            {value: '', text: '全部'},
            {value: '0', text: '否'},
            {value: '1', text: '是'}
        ]
    }, {
        type: 'number',
        name: '房源数量',
        key: 'houseAccount'
    }, {
        type: 'number',
        name: '领券数量',
        key: 'couponAccount'
    }, {
        type: 'number',
        name: '用券订单数',
        key: 'couponBooking'
    }]
}

const mapStateToProps = (state, action) => {
    return {
        weixinUserlist: state.weixinUserlist,
        weixinUserLabel: state.weixinUserLabel
    }
}
class ActionListTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: 50,
            pageSizeOptions:pageOption.pageSizeOpts,
            loading:true,
            id:'',
            data:'',
            tagAction:false,
            selectedRowKeys: [],
            searchFields: []
        }
        this.okAction = this.okAction.bind(this)
    }
    componentDidMount (){
        this.getLabelManage()
    }
    getRangepicker = (time) => {
        return `${moment(time).format("YYYY-MM-DD")}`
    }
    onSearch = (searchFields) => {
        let subscribeTimeLessThan = null,
            subscribeTimeGreaterThan = null
        if (searchFields.range.value) {
            subscribeTimeGreaterThan = this.getRangepicker(searchFields.range.value[0]) + ' 00:00:00'
            subscribeTimeLessThan = this.getRangepicker(searchFields.range.value[1]) + ' 23:59:59'
        }
        this.setState({
            pageNum:1,
            searchFields:{
                nicknameLike: searchFields.nickName.value,
                subscribeTimeLessThan,
                subscribeTimeGreaterThan,
                country: searchFields.country.value,
                province: searchFields.province.value,
                city: searchFields.city.value,
                sex: searchFields.sex.value,
                phone: searchFields.phone.value,
                isBu: searchFields.isBu.value,
                orderAccount: searchFields.orderAccount.value,
                isLandlord: searchFields.isLandlord.value,
                houseAccount: searchFields.houseAccount.value,
                couponAccount: searchFields.couponAccount.value,
                couponBooking: searchFields.couponBooking.value
            }
        }, this.getLabelManage)
    }
    getLabelManage () { // 获取table数据
        let { tagId } = this.props
        const params = {
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize,
            ...this.state.searchFields
        }
        this.setState({
            loading:true
        })
        this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        weixinUserlistService.getTableByTag(params, tagId).then((data) => {
            this.props.dispatch(serachWeixinUserlistSuccess(data))
            this.setState({
                loading:false
            })
        }).catch((e) => {
            this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        })
    }

    okAction = () => {
        const params = {
            tagId:this.props.tagId,
            userIds:this.state.selectedRowKeys,
            type:2
        }
        this.props.dispatch({
            type: 'ACTION_LABEL_ING'
        })
        weixinLabelService.actionUserLabel(params).then((data) => {
            this.props.dispatch({
                type: 'ACTION_LABEL_SUCCESS'
            })
            message.success('操作成功！')
            this.setState({
                disable:true
            })
            this.props.onCancel()
        }).catch((e) => {
            this.props.dispatch({
                type: 'ACTION_LABEL_ING'
            })
            message.success('操作失败！')
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render () {
        const { selectedRowKeys } = this.state
        const { visible, onCancel } = this.props
        const scroll = {
            x: 1700,
            y: 300
        }

        const columns = [{
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            exportType: 'text',
            width: 100,
            render: val => <span dangerouslySetInnerHTML={{__html: val}}></span>
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            exportType: 'text',
            width: 100,
            render: val => <span>{sexList[val]}</span>
        }, {
            title: '关注标志',
            dataIndex: 'subscribe',
            key: 'subscribe',
            exportType: 'text',
            width: 150,
            render: val => <span>{['未关注','已关注'][val]}</span>
        }, {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
            exportType: 'text'
        }, {
            title: '国家',
            dataIndex: 'country',
            key: 'country',
            exportType: 'text',
            width: 100
        }, {
            title: '省市',
            dataIndex: 'province',
            key: 'province',
            exportType: 'text',
            width: 100
        }, {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            exportType: 'text',
            width: 100
        }, {
            title: '头像',
            dataIndex: 'headimgUrl',
            key: 'headimgUrl',
            exportType: 'text',
            width: 100,
            render: _ => _ ? <img className="adsImg height60" src={getNewImagePrefix(_,envConfig.imgPrefix)} alt="加载失败..." width = "60px" /> : null
        }, {
            title: '关注时间',
            dataIndex: 'subscribeTime',
            key: 'subscribeTime',
            width: 200,
            exportType: 'date',
            render: val => <span>{dataFormat(+val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '关注方式',
            dataIndex: 'subscribeScene',
            key: 'subscribeScene',
            width: 150,
            exportType: 'text',
            render: val => <span>{wechatSubscribeSceneObj[val]}</span>
        }, {
            title: '关注时间段',
            dataIndex: 'subscribeTag',
            key: 'subscribeTag',
            width: 150,
            exportType: 'text',
            render: val => <span>{subscribeTagMap[val]}</span>
        }, {
            title: '是否BU',
            dataIndex: 'isBu',
            key: 'isBu',
            width: 100,
            exportType: 'text',
            render: val => +val === 0 ? <span>否</span> : <span>是</span>
        }, {
            title: '订单数量',
            dataIndex: 'orderAccount',
            key: 'orderAccount',
            width: 100,
            exportType: 'text'
        }, {
            title: '是否消费过',
            dataIndex: 'isCustomer',
            key: 'isCustomer',
            width: 100,
            exportType: 'text',
            render: val => !val ? <span>否</span> : <span>是</span>
        }, {
            title: '是否房东',
            dataIndex: 'isLandlord',
            key: 'isLandlord',
            width: 100,
            exportType: 'text',
            render: val => +val === 0 ? <span>否</span> : <span>是</span>
        }, {
            title: '房源数量',
            dataIndex: 'houseAccount',
            key: 'houseAccount',
            width: 100,
            exportType: 'text'
        }, {
            title: '领券数量',
            dataIndex: 'couponAccount',
            key: 'couponAccount',
            width: 100,
            exportType: 'text'
        }, {
            title: '用券订单数',
            dataIndex: 'couponBooking',
            key: 'couponBooking',
            width: 100,
            exportType: 'text'
        }]

        const pageObj = {
            total: this.props.weixinUserlist.total,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, this.getLabelManage)
            },
            onChange: (value,pageSize) => {
                this.setState({ pageNum: value, pageSize: pageSize }, this.getLabelManage)
            }
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: false,
            onSelection: this.onSelection
        };
        return (
            <Modal
                visible={visible}
                title="批量操作用户标签"
                okText="确认操作"
                cancelText="取消"
                onCancel={onCancel}
                onOk={this.okAction}
                width="90%"
            >
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    dataSource={checkKey(this.props.weixinUserlist.list)}
                />
                <Table
                    dataSource={checkKey(this.props.weixinUserlist.list)}
                    bordered
                    scroll={scroll}
                    columns={columns}
                    rowKey="id"
                    rowSelection={rowSelection}
                    loading={this.state.loading}
                    pagination={pageObj}
                />
            </Modal>
        )
    }
}


let ActionList = Form.create()(ActionListTable)
export default connect(mapStateToProps)(ActionList)
