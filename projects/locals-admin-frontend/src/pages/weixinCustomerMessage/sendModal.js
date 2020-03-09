import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, message, Popover,Select,Form,Button} from 'antd'
import SelectList from '../../components/selectList'
import { pageOption, getNewImagePrefix, dataFormat} from '../../utils/utils.js'
import {weixinUserlistService, weixinCustomerMessageService, weixinLabelService} from '../../services'
import { serachingWeixinUserlist, serachWeixinUserlistSuccess,getWeixinSearchListSuccess,getWeixinSearchList } from '../../actions/weixinUserlist'
import { dicModel } from '../../utils/dictionary'
const Option = Select.Option
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        weixinUserlist: state.weixinUserlist,
        weixinLabelM: state.weixinLabelM
    }
}

const selectListConfig = {
    equalId: "id",
    isShowSelectAll: true,
    showPage: true,
    scroll: {scroll:{y: 300 }},
    leftColumns: [{
        title: 'openID',
        dataIndex: 'openId',
        key: 'openID',
        width: 80,
        render: val => (
            <Popover content={val}>
                <div className="ellipsis w50">{val}</div>
            </Popover>
        )
    }, {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 80,
        render: val => <span dangerouslySetInnerHTML={{__html: val}}></span>
    }, {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 80,
        render: val => (val === 1 ? '男' : '女')
    }, {
        title: '头像',
        dataIndex: 'headimgUrl',
        key: 'headimgUrl',
        width: 80,
        render: (url) => {
            if (url) {
                return <img className="adsImg" src={getNewImagePrefix(url)} alt="加载失败..." width="60" />
            }
        }
    }, {
        title: '关注时间',
        dataIndex: 'subscribeTime',
        key: 'subscribeTime',
        width: 80,
        render: val => (
            <Popover content={dataFormat(val - 0, 'YYYY-MM-DD HH:mm:ss')}>
                <div className="ellipsis w50">{dataFormat(val - 0, 'YYYY-MM-DD HH:mm:ss')}</div>
            </Popover>
        )
    }],
    rightColumns: [{
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 80,
        render: val => <span dangerouslySetInnerHTML={{__html: val}}></span>
    }]
}



class SendMessage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            selectData: [],
            pageNum: pageOption.pageNum,
            pageSize: 100,
            uploading: false,
            loading:true,
            searchloading:true,
            searchData:[],
            searchList:'',
            data:''
        }
        this.handleOk = this.handleOk.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }
    componentDidMount () {
        this.getUserList()
        this.getLabelList()
    }
    //获取列表
    getUserList = () => {
        const params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.setState({loading:true})
        this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        weixinUserlistService.getTable(params).then((data) => {
            this.props.dispatch(serachWeixinUserlistSuccess(data))
            this.setState({
                loading:false,
                data:data
            })
        }).catch((e) => {
            this.setState({loading:false})
            this.props.dispatch(serachingWeixinUserlist(this.props.weixinUserlist))
        })
    }


    //获取搜索列表
    getLabelList () {
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.setState({searchloading:true})
        weixinLabelService.getTable(params).then((data) => {
            this.props.dispatch({
                type: 'GET_LABEL_LIST_SUCCESS',
                payload:data
            })
            this.setState({
                searchloading:false
            })
        }).catch( e =>{
            this.setState({searchloading:false})
        })
    }

    setSelect = (list) => {
        this.setState({
            selectData: list
        })
    }
    setPageNum = (pageNum, pageSize) => {
        this.setState({
            pageNum: pageNum,
            pageSize: pageSize
        }, this.getUserList)
    }
    handleSubmit = (e) => {
        e.preventDefault()
        let _this = this
        Modal.confirm({
            title: '确认推送?',
            okText: '确认',
            cancelText: '取消',
            onOk () {
                _this.onOk()
            }
        })
    }

    onOk = () => {
        var userId = []
        this.state.selectData.forEach( v => {
            userId.push(v.id)
        })
        let sendType = this.props.sendType
        let params = {
            [sendType]: this.props.id, // 客服id
            userIds: userId
        }
        if (userId.length && sendType) {
            this.setState({uploading: true})
            weixinCustomerMessageService.postMessage(params).then(res => {
                message.success('推送成功')
                this.setState({
                    uploading: false
                }, this.props.closeModal())
            }).catch(e => {
                this.setState({uploading: false})
            })
        } else {
            message.error('参数丢失无法推送!')
        }
    }

    //筛选标签
    handleSearch = () =>{
        if(this.state.searchData.length > 0){
            let params = {
                tagIds: this.state.searchData
            }
            this.setState({
                loading:true
            })
            this.props.dispatch(getWeixinSearchList(this.props.weixinUserlist))
            weixinUserlistService.getSearchList(params).then((data) => {
                this.props.dispatch(getWeixinSearchListSuccess(data))
                this.setState({
                    loading:false,
                    data:data
                })
            }).catch((e) => {
                this.setState({loading:false})
                this.props.dispatch(getWeixinSearchList(this.props.weixinUserlist))
            })
        }else{
            this.getUserList()
        }
    }

    handleOk = (value) => {
        this.setState({
            searchData:value
        })
    }
    renderSearch = () =>{
        return (
            <Form className="padder-vb-md" layout="inline">
                <FormItem>
                    筛选标签：
                </FormItem>
                <FormItem style={{ width: '300px' }}>
                    <Select
                        mode="multiple"
                        style={{ width: '300px' }}
                        placeholder="请选择筛选标签"
                        onChange={this.handleOk}
                    >
                        {
                            this.state.searchloading === false && this.props.weixinLabelM.list.length > 0 ? this.props.weixinLabelM.list.map(function (item,index) {
                                return (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                )
                            }) : null
                        }
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="submit" className="ant-btn ant-btn-primary ant-btn-icon-only" onClick={this.handleSearch}>
                        <i className="anticon anticon-search"></i>搜索
                    </Button>
                </FormItem>
            </Form>
        )
    }

    renderTable = () => {
        return (
            <SelectList
                setSelect={this.setSelect}
                setPageNum={this.setPageNum}
                selectData={this.state || []}
                // initData={this.props.weixinUserlist}
                initData={this.state.data}
                config={selectListConfig}
                loading={this.state.loading}
            />
        )
    }
    render () {
        const props = this.props
        return (
            <Modal
                {...dicModel}
                title={props.title}
                visible={props.visible}
                onCancel={props.closeModal}
                onOk={this.handleSubmit}
                confirmLoading={this.state.uploading}
                width="90%"
                destroyOnClose
            >
                {this.renderSearch()}
                {this.props.weixinUserlist ? this.renderTable() : null}
            </Modal>
        )
    }
}

SendMessage = connect(mapStateToProps)(SendMessage)
export default SendMessage