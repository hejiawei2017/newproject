import React, {Component} from 'react'
import {Table, Modal, Spin} from 'antd'
import {checkKey, dataFormat, envConfig, getNewImagePrefix, pageOption} from "../../utils/utils"
import {sexList, wechatSubscribeSceneObj} from '../../utils/dictionary'
import {weixinLabelService} from "../../services"
import {Form} from "antd/lib/index";
import {connect} from "react-redux";

const mapStateToProps = (state, action) => {
    return {
        weixinLabelDetailM: state.weixinLabelDetailM
    }
}
class DetailListTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            loading:true
        }
    }
    componentDidMount (){
        this.getLabelManage()
    }
    // 获取table数据
    getLabelManage () {
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            urlData:this.props.data.id + '/' + this.props.data.tagId
        }
        this.setState({
            loading:true
        })
        weixinLabelService.getUserAll(params).then((data) => {
            this.props.dispatch({
                type: 'GET_LABEL_DETAIL_SUCCESS',
                payload:data
            })
            this.setState({
                loading:false
            })
        }).catch((e) => {
            this.setState({
                loading:true
            })
        })
    }
    render () {
        const { visible, onCancel} = this.props
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '头像',
            dataIndex: 'headimgUrl',
            key: 'headimgUrl',
            width:'100px',
            exportType: 'text',
            render: _ => _ ?
                <img className="adsImg height60" src={getNewImagePrefix(_, envConfig.imgPrefix)} alt="加载失败..." width="60px" /> : null
        }, {
            title: 'openID',
            dataIndex: 'id',
            key: 'id',
            width:'150px'
        }, {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
            width:'150px'
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            width:'96px',
            render: val => <span>{sexList[val]}</span>
        }, {
            title: '国家',
            dataIndex: 'country',
            key: 'country',
            width:'100px'
        }, {
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            width:'100px'
        }, {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            width:'100px'
        }, {
            title: '关注标志',
            dataIndex: 'subscribe',
            key: 'subscribe',
            width:'100px',
            render: val => <span>{['未关注','已关注'][val]}</span>
        }, {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 200,
            exportType: 'text'
        }, {
            title: '关注时间',
            dataIndex: 'subscribeTime',
            key: 'subscribeTime',
            width:'150px',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '关注方式',
            dataIndex: 'subscribeScene',
            key: 'subscribeScene',
            width:'150px',
            render: val => <span>{wechatSubscribeSceneObj[val]}</span>
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
        }
        ]

        const pageObj = {
            total: this.props.weixinLabelDetailM.total,
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
        return (
            <Modal
                visible={visible}
                title="详情"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[<span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>]}
                width="90%"
            >
                {
                    this.props.weixinLabelDetailM.list ? (
                        <Table
                            dataSource={checkKey(this.props.weixinLabelDetailM.list[0].userList)}
                            bordered
                            scroll={scroll}
                            columns={columns}
                            rowKey="id"
                            pagination={pageObj}
                            loading={this.state.loading}
                        />
                    ) : <Spin />
                }
            </Modal>
        )
    }
}


let DetailList = Form.create()(DetailListTable)
export default connect(mapStateToProps)(DetailList)
