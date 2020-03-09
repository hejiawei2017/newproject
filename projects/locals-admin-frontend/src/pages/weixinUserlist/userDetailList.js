import React, {Component} from 'react'
import {Table,Modal,Form} from 'antd'
import {pageOption} from "../../utils/utils"
import {weixinUserlistService} from "../../services"
import {serachingWeixinUserLabel, serachWeixinUserLabelSuccess} from "../../actions/weixinUserlist"
import {connect} from "react-redux"

const mapStateToProps = (state, action) => {
    return {
        weixinUserLabel: state.weixinUserLabel
    }
}

class UserDetailList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            loading:true,
            id:''
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
            urlData:this.props.id
        }
        this.props.dispatch(serachingWeixinUserLabel(this.props.weixinUserLabel))
        this.setState({
            loading:true
        })
        weixinUserlistService.getLabel(params).then((data) => {
            this.props.dispatch(serachWeixinUserLabelSuccess(data))
            this.setState({
                loading:false
            })
        }).catch((e) => {
            this.props.dispatch(serachingWeixinUserLabel(this.props.weixinUserLabel))
            this.setState({
                loading:true
            })
        })
    }
    onCancel = (e) =>{
        this.setState({
            loading:false
        })
        this.props.onCancel()
    }

    render () {
        const {visible} = this.props
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '标签名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '标签ID',
            dataIndex: 'tagId',
            key: 'tagId',
            width:'150px',
            align:'center'
        },{
            title: '用户是否存在该标签',
            dataIndex: 'userExit',
            key: 'userExit',
            width:'150px',
            align:'center',
            render: function (text, record, index) {
                return (
                    <span>
                        { text === true ? "存在" : "不存在" }
                    </span>
                )
            }
        }]

        const pageObj = {
            total: this.props.weixinUserLabel.total,
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
                title="用户标志的所有标签"
                okText="确认"
                cancelText="取消"
                onCancel={this.onCancel}
                footer={[<span key="cancel" className="click-link mr-md" onClick={this.onCancel}>关闭</span>]}
            >
                <Table
                    dataSource={this.props.weixinUserLabel.list}
                    bordered
                    scroll={scroll}
                    columns={columns}
                    rowKey="id"
                    loading={this.state.loading}
                    pagination={pageObj}
                />
            </Modal>
        )
    }
}


let UserDetail = Form.create()(UserDetailList)
export default connect(mapStateToProps)(UserDetail)