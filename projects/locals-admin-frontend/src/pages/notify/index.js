import 'braft-editor/dist/index.css'
import React, { Component } from 'react'
import { notifyService } from '../../services'
import Search from '../../components/search'
import { Table, Button, message, Popconfirm, Modal } from 'antd'
import { pageOption } from '../../utils/utils.js'
import qs from 'qs'
import moment from 'moment'
import './notify.less'

const options = [
    {
        text: '房东端重要通知',
        value: 2
    },
    {
        text: '房东端系统通知',
        value: 3
    },
    {
        text: '房东端活动通知',
        value: 4
    }
]
const searchConfig = {
    items: [
        {
            type: 'select',
            name: '通知类型',
            key: 'noticeType',
            defaultValue: '',
            placeholder: '',
            renderSelectData: {
                2: '房东端重要通知',
                3: '房东端系统通知',
                4: '房东端活动通知'
            },
            extendAttr: {
                allowClear: true
            },
            selectData: options
        }
    ]
}
class NotifyLandlord extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            checkItem: null,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            total: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            currentItemContent: null,
            visible: false,
            searchFields: {},
            selectedRows: [], // 选中的checkbox
            toUserIds: ''
        }
    }
    componentDidMount (){
        this.queryData()
    }
    queryData = () => {
        const {pageNum, pageSize, searchFields} = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            ...searchFields
        }
        this.setState({
            loading: true
        })
        notifyService.getNotice(params).then((data) =>{
            this.setState({
                pageNum:data.pageNum,
                tableData:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })

    }
    onSearch = (nextSearchFields) => {
        const searchFields = Object.entries(nextSearchFields).reduce((prev, curr) => {
            const [key, val] = curr
            prev[key] = val.value
            return prev
        },{})
        this.setState({
            pageNum: 1,
            searchFields
        }, this.queryData)
    }
    deleteRecord = (record) => {
        notifyService.delNotice({
            noticeIds: [record.id]
        }).then((data) =>{
            this.queryData()
            message.success('删除成功')
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    configSave = (values) => {
        // landlordService.setExamConfig(values).then((data) =>{
        //     this.setState({
        //         configVisible: false
        //     })
        //     message.success('配置成功')
        // }).catch((e)=>{
        //     message.error(e.errorDetail)
        // })
    }
    handleContent2Html = (currentItemContent) => {
        this.setState({
            visible: true,
            currentItemContent
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    // 多条删除
    removeRecordByMultipart = () => {
        const noticeIds = Object.values(this.state.selectedRows).reduce((prev, curr) => {
            prev.push(curr.id)
            return prev
        }, [])
        notifyService.delNotice({
            noticeIds
        }).then((data) =>{
            this.setState({
                selectedRowKeys: []
            }, this.queryData)
            message.success('删除成功')
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    // 通过user ids删除
    // removeRecordByUserIds = () => {
    //     const { selectedRows, toUserIds } = this.state
    //     const noticeIds = [selectedRows[0].id]
    //     const _toUserIds = toUserIds.trim('').split(',')
    //     const submitData = {
    //         noticeIds,
    //         toUserId: _toUserIds
    //     }
    //     notifyService.delNotice(submitData).then((data) =>{
    //         this.queryData()
    //         message.success('删除成功')
    //     }).catch((e)=>{
    //         message.error(e.errorDetail)
    //     })
    // }
    render () {
        const _state = this.state
        const { pageSize, pageSizeOptions, pageNum , total, loading, selectedRows} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.queryData()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.queryData()})
            }
        }
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            width: 100
        },{
            title: '标题',
            dataIndex: 'title',
            width: 170
        },{
            title: '内容',
            dataIndex: 'content',
            width: 260,
            render: (val) => {
                const valStr = val.replace(/<[^>]+>/g,"")
                return (
                    <div>
                        {(valStr && valStr.length > 15 ? valStr.slice(0, 15) + '...' : valStr)}
                        <span
                            style={{color: '#3e90f7', marginLeft: 10, cursor: 'pointer'}}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() => this.handleContent2Html(val)}
                        >
                            查看
                        </span>
                    </div>
                )
            }
        },{
            title: '发送ID',
            dataIndex: 'toUserId',
            width: 100,
            render (val) {
                return String(val) === '-1' ? '群发' : val
            }
        },{
            title: '通知简短内容',
            dataIndex: 'briefContent',
            width: 200,
            render: val => val ? val : '无'
        },{
            title: '跳转链接',
            dataIndex: 'url',
            width: 200,
            render (val) {
                if(!val) return '无'
                return (val && val.length > 20 ? val.slice(0, 20) + '...' : val)
            }
        },{
            title: '通知附加参数',
            dataIndex: 'extra',
            width: 200,
            render: val => val ? qs.stringify(val) : val
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            width: 160,
            render (val) {
                return moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
        },{
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render:  (text, record) => {
                return (
                    <Popconfirm
                        title="你确定要删除吗?"
                        // eslint-disable-next-line react/jsx-no-bind
                        onConfirm={() => this.deleteRecord(record)}
                        okText={'确定'}
                        cancelText={'取消'}
                    >
                        <Button size="small" type="danger">{'删除'}</Button>
                    </Popconfirm>
                )
            }
        }]
        const scroll = {
            x: 0,
            y: false
        }
        columns.forEach(column => {
            scroll.x = scroll.x + column.width
        })

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows
                })
            }
          };

        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                {
                    selectedRows.length > 1 ? (
                        <div className="mb10" style={{border: '1px solid #d9d9d9', borderRadius: 6, background: '#fbfbfb', padding: 12}}>
                            <div style={{flex: 1}}>
                                <h3 style={{marginBottom: 10}}>
                                    多条记录
                                </h3>
                                <Button type="danger" onClick={this.removeRecordByMultipart}>{'删除'}</Button>
                            </div>
                        </div>
                    ) : null
                }
                {/* <div className="mb10" style={{border: '1px solid #d9d9d9', borderRadius: 6, background: '#fbfbfb', padding: 12}}>
                    <div style={{flex: 1}}>
                        <h3 style={{marginBottom: 10}}>
                            多条记录
                        </h3>
                        <Button type="danger" onClick={this.removeRecordByMultipart}>{'删除'}</Button>
                    </div>
                    <h2 style={{fontSize: 18, marginBottom: 12}}>增强功能</h2>
                    <div style={{display: 'flex'}}>
                        <div style={{flex: 1}}>
                            <h3>
                                通知类型
                            </h3>
                            <Select style={{width: '96%', display: 'block', margin: '10px 0'}}>
                                {
                                    options.map(({value, text}) => <Select.Option key={value} value={value}>{text}</Select.Option>)
                                }
                            </Select>
                            <Button type="danger">{'删除'}</Button>
                        </div>
                        {
                            this.state.selectedRows.length === 0 ? <div style={{flex: 1}} /> : (
                                this.state.selectedRows.length > 1 ? (
                                    <div style={{flex: 1}}>
                                        <h3 style={{marginBottom: 10}}>
                                            多条记录
                                        </h3>
                                        <Button type="danger" onClick={this.removeRecordByMultipart}>{'删除'}</Button>
                                    </div>
                                ) : (
                                    // 这里后台说改了怕有问题 所以隐藏。 但是感觉这个是需要的。。注释掉 by weizheng pan
                                    <div style={{flex: 1}}>
                                        <h3>
                                            输入用户ID
                                        </h3>
                                        <Input.TextArea
                                            rows={4}
                                            style={{margin: '10px 0'}}
                                            value={this.state.toUserIds}
                                            placeholder={'多个用户用,号隔开'}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={e => {
                                                this.setState({
                                                    toUserIds: e.target.value
                                                })
                                            }}
                                        />
                                        <Button type="danger" onClick={this.removeRecordByUserIds}>{'删除'}</Button>
                                    </div>
                                )
                            )
                        }
                        <div style={{flex: 1}} />
                    </div>
                </div> */}
                <Table
                    scroll={scroll}
                    loading={loading}
                    columns={columns}
                    dataSource={_state.tableData}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    rowKey={function (record) {
                        return record.id
                    }}
                />
                <Modal
                    title="内容"
                    width={600}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div dangerouslySetInnerHTML={{__html: this.state.currentItemContent}}></div>
                </Modal>
            </div>
        )
    }
}

export default NotifyLandlord
