import React, { Component } from 'react'
import {commentService} from '../../services'
import { Table,Button,message,Popconfirm} from 'antd'
import CommentDetailForm from './commentDetail'
import {pageOption,dataFormat,checkKey} from '../../utils/utils'
import Search from '../../components/search'
import {connect} from "react-redux"

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源id',
            key: 'houseSourceId',
            searchFilterType: 'string',
            placeholder: '请输入房源id'
        },
        {
            type: 'text',
            name: '房东id',
            key: 'memberId',
            searchFilterType: 'string',
            placeholder: '请输入房东id'
        },
        {
            type: 'text',
            name: '评价对象id',
            key: 'toMemberId',
            searchFilterType: 'string',
            placeholder: '请输入评价对象id'
        }
    ],
    export: {
        name: '房源评论数据'
    }
}

const mapStateToProps = (state, action) => {
    return {
        commentListM: state.commentListM,
        onlyCommentM: state.onlyCommentM,
        addCommentM: state.addCommentM
    }
}


class CommentList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts,
            tableData: [],
            detailsData:[],
            id:'',
            dataType:true,
            visible:false,
            formShow:false,
            formData:[]
        }
        this.onAdd = this.onAdd.bind(this)
    }

    componentDidMount () {
        this.getComment()
    }
    getComment (){
        let params = {...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        commentService.getCommentTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_COMMENT_TABLE_SUCCESS',
                payload:data
            })
        })
    }

    // 搜索数据
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                houseSourceId: searchFields.houseSourceId.value,
                memberId: searchFields.memberId.value,
                toMemberId: searchFields.toMemberId.value
            }
        }, this.getComment)
    }


    // 新增数据
    onAdd = () => {
        this.setState({
            visible:true,
            dataType:false,
            formShow:true
        })
    }
    // 详情
    onDetail = (record) => () => {
        commentService.commentOnly(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_COMMENT_ONLY_SUCCESS',
                payload: data
            })
            this.setState({
                visible:true,
                id:record.id,
                dataType:true,
                formShow:true
            })
        })
    }
    // 删除
    onDetele = (record) => () => {
        commentService.commentDel(record.id).then((data) => {
            this.props.dispatch({
                type: 'DEL_COMMENT_SUCCESS'
            })
            message.success('删除成功',0.5)
            this.getComment()
        })
    }


    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
        this.formRef.props.form.resetFields()
        this.getComment()
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    //主体
    render () {
        let self = this
        const scroll = {
            x:true,
            y:false
        }
        const columns = [{
            title: '房源ID',
            dataIndex: 'houseSourceId',
            key: 'houseSourceId',
            width:'180px'
        }, {
            title: '预订ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width:'150px'
        }, {
            title: '房东名称',
            dataIndex: 'memberName',
            key: 'memberName',
            width:'150px'
        }, {
            title: '评价对象id',
            dataIndex: 'toMemberId',
            key: 'toMemberId',
            width:'180px'
        }, {
            title: '评价内容',
            dataIndex: 'comment',
            key: 'comment',
            width:'250px'
        }, {
            title: '评星',
            dataIndex: 'stars',
            key: 'stars',
            width:'80px',
            align: 'center'
        },{
            title: '描述相符',
            dataIndex: 'descriptionMatch',
            key: 'descriptionMatch',
            width:'90px',
            align: 'center'
        },{
            title: '沟通交流',
            dataIndex: 'communication',
            key: 'communication',
            width:'90px',
            align: 'center'
        },{
            title: '干净指数',
            dataIndex: 'clean',
            key: 'clean',
            width:'90px',
            align: 'center'
        },{
            title: '位置便利指数',
            dataIndex: 'locationConvenient',
            key: 'locationConvenient',
            width:'110px',
            align: 'center'
        },{
            title: '办理入住',
            dataIndex: 'checkin',
            key: 'checkin',
            width:'90px',
            align: 'center'
        },{
            title: '性价比',
            dataIndex: 'priceRatio',
            key: 'priceRatio',
            width:'90px',
            align: 'center'
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:'150px',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'120px',
            fixed:'right',
            render: function (text, record, index) {
                return (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            name="onDetail"
                            className="mr-sm"
                            onClick={self.onDetail(record)}
                        >编辑</Button>
                        <Popconfirm placement="left" title="确定删除这条评论？" onConfirm={self.onDetele(record)} okText="确定" cancelText="取消">
                            <Button
                                type="danger"
                                size="small"
                                name="onDetele"
                            >删除</Button>
                        </Popconfirm>
                    </div>
                )
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: Number(this.props.commentListM.total || 0 ),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.getComment)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.getComment)
            }
        }

        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.commentListM.list)} />
                <div className="text-right padder-v-sm">
                    <Button
                        type="primary"
                        onClick={self.onAdd}
                    >
                        新增
                    </Button>
                </div>
                <Table
                    size="small"
                    bordered
                    scroll={scroll}
                    columns={columns}
                    dataSource={checkKey(this.props.commentListM.list)}
                    rowKey="id"
                    pagination={pageObj}
                />
                {
                    this.state.formShow ? <CommentDetailForm wrappedComponentRef={this.saveFormRef} visible={this.state.visible} id={this.state.id} formData={this.props.onlyCommentM} dataType={this.state.dataType} onCancel={this.handleCancel} /> : null
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(CommentList)