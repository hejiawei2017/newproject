import React, {PureComponent,Fragment} from 'react'
import {Table, Button, Form, Input, message,Divider,Popconfirm} from 'antd'
import OperateModal from './operateModal'
import {couponChannelService} from '../../services'
import {pageOption} from "../../utils/utils";

const FormItem = Form.Item

class Channel extends PureComponent {
    state = {
        visible: false,
        channelList: [],
        editContent: null,
        pageNum: pageOption.pageNum,
        pageSize: pageOption.pageSize,
        totalCount: 0,
        pageSizeOptions: pageOption.pageSizeOptions
    }

    componentDidMount () {
        this.getChannelList()
    }

    operate = () => () => {
        this.setState({
            editContent: null,
            visible: true,
            title: '新增'
        })
    }
    update = (recode) => () => {
        this.setState({
            editContent: recode,
            visible: true,
            title: '修改'
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    getChannelList = () => {
        const params = {
            orderBy: 'create_time desc',
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        couponChannelService.getChannelList(params).then((data) => {
            this.setState({
                channelList: data
            })
        }).catch(e => {
            message.error(e.errorDetail)
        })
    };
    // 新增和添加
    onSubmit = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            if (!error) {
                if (this.state.editContent) {
                    const params = {
                        id: this.state.editContent.id,
                        ...values
                    };
                    couponChannelService.putChannel(params).then((data)=>{
                        if (data === 1) {
                            this.setState({
                                visible: false
                            }, () => {
                                message.success('修改成功')
                                this.getChannelList()
                            })
                        }
                    }).catch(e => {
                        message.error(e.errorDetail)
                    })
                } else {
                    couponChannelService.postChannel(values).then((data) => {
                        if (data === 1) {
                            this.setState({
                                visible: false
                            }, () => {
                                message.success('新增成功')
                                this.getChannelList()
                            })
                        }
                    }).catch(e => {
                        message.error(e.errorDetail)
                    })
                }

            }
        })

    }
    // 删除
    confirm =id=> ()=>{
        couponChannelService.deleteChannel(id).then((data)=>{
            if(data === 1){
                message.success('删除成功');
                this.getChannelList()
            }
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    renderForm = () => {
        const {getFieldDecorator} = this.props.form
        const {editContent} = this.state
        return (
            <div>
                <FormItem
                    label="渠道名称"
                >
                    {getFieldDecorator('channelName', {
                        rules: [{
                            required: true,
                            message: '请输入渠道名称'
                        }],
                        initialValue: editContent ? editContent.channelName : ''
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    label="channel"
                >
                    {getFieldDecorator('code', {
                        rules: [{
                            required: true,
                            message: '请输入channel'
                        }],
                        initialValue: editContent ? editContent.code : ''
                    })(
                        <Input/>
                    )}
                </FormItem>
            </div>
        )
    }

    render () {
        const {visible, title} = this.state
        const columns = [
            {
                title: '渠道名称',
                dataIndex: 'channelName'
            },
            {
                title: 'channel',
                dataIndex: 'code'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime'
            },
            {
                title: '创建者',
                dataIndex: 'creator'
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (v, recode) => {
                    return (
                        <Fragment>
                            <Button
                                size="small"
                                type="primary"
                                onClick={this.update(recode)}
                            >
                                修改
                            </Button>
                            <Divider type="vertical" />
                            <Popconfirm title="确认删除?" onConfirm={this.confirm(recode.id)} okText="确认" cancelText="取消">
                            <Button
                                size="small"
                                type="danger"
                            >
                                删除
                            </Button>
                            </Popconfirm>
                        </Fragment>

                    )
                }
            }
        ]
        const { totalCount, pageSize, pageSizeOptions, pageNum } = this.state;
        const pagination = {
            total: totalCount,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize }, this.getChannelList())
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize
                }, this.getChannelList())
            }
        }
        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.operate('add')}
                    >新增渠道标识</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.channelList}
                    rowKey={'id'}
                    pagination={pagination}
                />
                <OperateModal
                    visible={visible}
                    title={title}
                    onCancel={this.onCancel}
                    onSubmit={this.onSubmit}
                >
                    {this.renderForm()}
                </OperateModal>
            </div>
        )
    }
}

Channel = Form.create()(Channel)

export default Channel