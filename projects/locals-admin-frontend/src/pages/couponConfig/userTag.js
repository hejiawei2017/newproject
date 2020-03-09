import React, {Component, Fragment} from 'react'
import {Table, Button, Form, Input, Select, message, Popconfirm,Divider} from 'antd'
import OperateModal from './operateModal'
import {generationMap, memberCardCodeList, newOldMemberMap} from '../../utils/dictionary'
import {dataSetupService} from '../../services'
import {pageOption} from "../../utils/utils";

const FormItem = Form.Item
const Option = Select.Option

class UserTag extends Component {
    state = {
        visible: false,
        userTagList: [],
        editContent:null,
        pageNum: pageOption.pageNum,
        pageSize: pageOption.pageSize,
        totalCount: 0,
        pageSizeOptions: pageOption.pageSizeOptions
    }

    componentDidMount () {
        this.getUserTagTable()
    }

    getUserTagTable = () => {
        const params = {
            orderBy: 'create_time desc',
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        dataSetupService.getUserTagTable(params).then((data) => {
            this.setState({userTagList: data})
        }).catch((e) => {
            message.error('查询失败' + e)
        })
    }
    operate = key => () => {
        this.setState({
            visible: true,
            title: key === 'add' ? '新增' : '修改',
            editContent:null,
            editId:null
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    onSubmit = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            if (!error) {
                let params = {
                    labelName: values.userLabel,
                    memberProperty: values.memberProperty,
                    userProperty: values.newOldMember
                }
                if(this.state.editId){ //新增
                    params.id = this.state.editId
                    dataSetupService.updateUserTag(params).then((data)=>{
                        if (data === 1) {
                            message.success('修改成功')
                            this.setState({
                                visible: false
                            }, () => {
                                this.getUserTagTable()
                            })
                        }
                    }).catch(e=>{
                        message.error('修改失败',e)
                    })
                }else {
                    dataSetupService.postUserLabel(params).then((data) => {
                        if (data === 1) {
                            message.success('新增成功')
                            this.setState({
                                visible: false
                            }, () => {
                                this.getUserTagTable()
                            })
                        }
                    }).catch(e=>{
                        message.error('新增失败',e)
                    })
                }

            }
        })
    }
    delete = (id) => () =>{
        dataSetupService.deleteUserLabel(id).then((data)=>{
            if(data === 1){
                this.getUserTagTable()
                message.success('删除成功')
            }
        }).catch(e=>{
            message.error('删除失败' + e)
        })
    }
    update = (key,id) =>() =>{
        dataSetupService.getUserTag(id).then((data)=>{
            this.setState({
                editContent:data,
                visible: true,
                title: key === 'add' ? '新增' : '修改',
                editId:id
            })
        }).catch(e=>{
            message.error('查询失败',e)
        })
    }
    renderNewOldMemberOption = () => {
        let result = []
        let initOption = [{value: 0, label: '无限制'},...newOldMemberMap]
        result = initOption.map(v => {
            return <Option key={v.value} value={v.label}>{v.label}</Option>
        })
        return result
    }
    renderMemberPropertiesOption = () => {
        let result = []
        let initOption = <Option key="noLimit" value="无限制">无限制</Option>
        result.push(initOption)
        for (let i in memberCardCodeList) {
            let option = <Option key={i} value={memberCardCodeList[i]['name']}>{memberCardCodeList[i]['name']}</Option>
            result.push(option)
        }
        return result
    }
    renderForm = () => {
        const {getFieldDecorator} = this.props.form;
        const {editContent} = this.state;
        return (
            <div>
                <FormItem
                    label="用户标签"
                >
                    {getFieldDecorator('userLabel', {
                        rules: [{
                            required: true,
                            message: '请输入用户标签'
                        }],
                        initialValue:editContent ? editContent.labelName : ''
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    label="会员属性"
                >
                    {getFieldDecorator('memberProperty', {
                        initialValue: editContent ? editContent.memberProperty : '无限制'
                    })(
                        <Select>
                            {this.renderMemberPropertiesOption()}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label="新旧用户"
                >
                    {getFieldDecorator('newOldMember', {
                        initialValue: editContent ? editContent.userProperty : '无限制'
                    })(
                        <Select>
                            {this.renderNewOldMemberOption()}
                        </Select>
                    )}
                </FormItem>
            </div>
        )
    }

    render () {
        const {visible, title} = this.state
        const columns = [
            {
                title: '标签编号',
                dataIndex: 'id'
            },
            {
                title: '用户标签',
                dataIndex: 'labelName'
            },
            {
                title: '会员属性',
                dataIndex: 'memberProperty'
            },
            {
                title: '新旧用户',
                dataIndex: 'userProperty'
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
                render: (v,record) => {
                    return (
                        <Fragment>
                            <Button
                                size="small"
                                type="primary"
                                onClick={this.update('edit',record.id)}
                            >
                                编辑
                            </Button>
                            <Divider type="vertical" />
                            <Popconfirm title="确认删除?" onConfirm={this.delete(record.id)} okText="确认" cancelText="取消">
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
                this.setState({ pageNum: 1, pageSize }, this.getUserTagTable())
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize
                }, this.getUserTagTable())
            }
        }
        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.operate('add')}
                    >新增用户标签</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.userTagList}
                    pagination={pagination}
                    rowKey={'id'}
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

UserTag = Form.create()(UserTag)

export default UserTag