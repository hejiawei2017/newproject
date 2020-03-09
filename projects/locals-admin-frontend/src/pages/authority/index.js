import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, Input, message, Popconfirm } from 'antd'
import Search from '../../components/search'
import { serachingAuthority, serachAuthoritySuccess } from '../../actions/authority'
import { authorityService } from '../../services'
import { pageOption, dataFormat, checkKey } from '../../utils/utils'

const FormItem = Form.Item

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '权限名称',
            key: 'authNameLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入权限名称'
        }
    ],
    export: {
        name: '活动数据'
    }
}

const mapStateToProps = (state, action) => {
    return {
        authrotyList: state.authrotyList
    }
}

class AuthorityForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            addDiaVisible: false,
            searchFields: {},
            columns: [],
            visible: false,
            mode: 'add'
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum: 1,
            searchFields: {
                authNameLike: searchFields.authNameLike.value
            }
        }, this.renderTable)
    }
    renderTable () { // 获取table数据
        const params = {
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }

        this.props.dispatch(serachingAuthority(this.props.authrotyList))
        authorityService.getTable(params).then((data) => {
            this.props.dispatch(serachAuthoritySuccess(data))
        }).catch((e) => {
            this.props.dispatch(serachingAuthority(this.props.authrotyList))
        })
    }

    openModal = (mode, record) => {
        this.setState({
            visible: true,
            mode
        })

        if (mode === 'edit') {
            this.props.form.setFieldsValue({
                authCode: record.authCode,
                authName: record.authName
            })
        }
    }

    onModalOk = () => {
        let self = this
        const { mode } = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (mode === 'add') {
                    authorityService.addAuthority(values)
                        .then(() => {
                            self.onModalCancel()
                            self.renderTable()
                        })
                        .catch(err => {
                            message.error(err)
                        })
                } else {
                    authorityService.editAuthority(values)
                        .then(() => {
                            self.onModalCancel()
                            self.renderTable()
                        })
                        .catch(err => message.error(err))
                }

            }
        })
    }

    onModalCancel = () => {
        this.setState({
            visible: false
        })
        this.props.form.resetFields()
    }

    deleteAuthority = (record) => {
        const self = this
        authorityService.deleteAuthority(record.id)
            .then(() => {
                self.onModalCancel()
                self.renderTable()
            })
            .catch(err => message.error(err))
    }

    render () {
        const self = this
        const columns = [{
            title: '权限编码',
            dataIndex: 'authCode',
            key: 'authCode',
            exportType: 'text'
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName',
            exportType: 'text'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'date',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return <React.Fragment>
                    <Button className="ml10" type="primary" onClick={function () {
                        self.openModal('edit', record)
                    }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否确定执行删除权限操作？"
                        okText="确认"
                        cancelText="取消" onConfirm={function () { self.deleteAuthority(record)}}
                    >
                        <Button className="ml10" type="danger">删除</Button>
                    </Popconfirm>
                </React.Fragment>
            }
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: this.props.authrotyList.total,
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({ pageNum: value, pageSize: pageSize }, this.renderTable)
            }
        }

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }

        const { visible, mode } = this.state
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.authrotyList.list)} />
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={
                        function () {
                            self.openModal('add')
                        }
                    }
                    >
                        新增权限
                    </Button>
                </div>
                <Table columns={columns} dataSource={checkKey(this.props.authrotyList.list)} pagination={pageObj} loading={this.props.authrotyList.loading} >
                </Table>
                <Modal
                    visible={visible}
                    title={mode === 'add' ? '新增' : '编辑'}
                    onOk={this.onModalOk}
                    onCancel={this.onModalCancel}
                    cancelText="关闭"
                    okText="保存"
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="权限代码"
                        >
                            {getFieldDecorator('authCode', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入权限代码' }]
                            })(
                                <Input placeholder="请输入权限代码" disabled={mode === 'edit' ? true : false} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="权限名称"
                        >
                            {getFieldDecorator('authName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入权限名称' }]
                            })(
                                <Input placeholder="请输入权限名称" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

let Authority = Form.create()(AuthorityForm)
export default connect(mapStateToProps)(Authority)
