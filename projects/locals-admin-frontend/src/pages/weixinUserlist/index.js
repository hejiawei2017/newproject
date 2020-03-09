import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Tooltip} from 'antd'
import {
    serachingWeixinUserlist,
    serachWeixinUserlistSuccess
} from '../../actions/weixinUserlist'
import { weixinUserlistService } from '../../services'
import { pageOption, dataFormat, checkKey, getNewImagePrefix, envConfig } from '../../utils/utils'
import { sexList, wechatSubscribeSceneObj, subscribeTagMap } from '../../utils/dictionary'
import UserDetailList from './userDetailList'
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

class WeixinUserlistForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            addDiaVisible: false,
            searchFields:{},
            columns:[],
            visible:false,
            id:''
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount (){
        this.renderTable()
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
                subscribeTimeLessThan: subscribeTimeLessThan,
                subscribeTimeGreaterThan: subscribeTimeGreaterThan,
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
        }, this.renderTable)
    }
    renderTable () { // 获取table数据
        const params = {
            ...this.state.searchFields,
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        weixinUserlistService.getTable(params).then((data) => {
            this.props.dispatch(serachWeixinUserlistSuccess(data))
            this.fixTableFixedCol()
        }).catch((e) => {
            this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        })
    }
    fixTableFixedCol = () => {
        // 当图片加载完成后撑开列表，触发resize让Table的固定元素重新对齐
        setTimeout( function () {
            window.dispatchEvent(new Event('resize'))
        }, 500)
    }
    // 详情
    onDetail = (record) => () => {
        this.setState({
            visible:true,
            id:record.id
        })
    }
    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
        this.renderTable()
    }
    renderContent = (content) => {
        if (!content) return null
        const output = <div className="w200">{content}</div>
        return (
            <Tooltip title={output}>
                <div className="ellipsis w100">{content}</div>
            </Tooltip>
        )
    }
    render () {
        let self = this
        const scroll = {
            x: 1500,
            y: false
        }
        const columns = [{
            title: 'openID',
            dataIndex: 'openId',
            key: 'openId',
            exportType: 'text',
            width: 150,
            render: this.renderContent
        }, {
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
            width: 200,
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
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 134,
            align: 'center',
            fixed: 'right',
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            className="mr-sm"
                            type="primary"
                            size="small"
                            name="stop"
                            onClick={self.onDetail(record)}
                        >
                            用户标志的所有标签
                        </Button>
                    </div>
                )
            }
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
                this.setState({ pageNum: 1, pageSize: pageSize }, this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ pageNum: value, pageSize: pageSize }, this.renderTable)
            }
        }

        return (
            <div>
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                    dataSource={checkKey(this.props.weixinUserlist.list)}
                />
                <Table
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.weixinUserlist.list)}
                    pagination={pageObj}
                    loading={this.props.weixinUserlist.loading}
                />
                {
                    this.state.visible ?
                        <UserDetailList
                            visible={this.state.visible}
                            id={this.state.id}
                            onCancel={this.handleCancel}
                        /> : null
                }
            </div>
        )
    }
}

let WeixinUserlist = Form.create()(WeixinUserlistForm)
export default connect(mapStateToProps)(WeixinUserlist)
