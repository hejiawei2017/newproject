import React, { Component } from 'react'
import Search from '../../components/search'
import { newRoleService } from '../../services'
import {SubTable} from '../../components'
import { Form, Button, Modal, Input, message, Popconfirm } from 'antd'

const FormItem = Form.Item

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '角色名称',
            key: 'roleNameLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入角色名称'
        }
    ]
}
class RolesForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            visible: false,
            mode: 'add'
        }
        this.tableThis = null
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                roleNameLike: searchFields.roleNameLike.value
            }
        }, this.renderTable)
    }

    openModal = (mode, record) => {
        this.setState({
            visible: true,
            mode
        })

        if (mode === 'edit') {
            this.props.form.setFieldsValue({
                roleCode: record.roleCode,
                roleName: record.roleName
            })
        }
    }

    onModalOk = () => {
        let self = this
        const {mode} = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (mode === 'add') {
                    newRoleService.addRole(values)
                    .then(() => {
                        self.onModalCancel()
                        self.tableThis.renderTable()
                    })
                    .catch(err => {
                        message.error(err)
                    })
                } else {
                    newRoleService.editRole(values)
                    .then(() => {
                        self.onModalCancel()
                        self.tableThis.renderTable()
                    })
                    .catch(err => message.error(err))
                }

            }
        })
    }

    onModalCancel = () => {
        this.setState({
            visible: false,
            mode: 'add'
        })
        this.props.form.resetFields()
    }

    deleteRole = (record) => {
        const self = this
        newRoleService.deleteRole(record.id)
        .then(() => {
            self.onModalCancel()
            self.tableThis.renderTable()
        })
        .catch(err => message.error(err))
    }

    render () {
        let self = this
        const columns = [{
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 300
        }, {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode',
            width: 300
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                console.log('record', record)
                return (
                    <React.Fragment>
                        <Button className="ml10" type="primary" onClick={function () {
                            self.openModal('edit', record)
                        }}
                        >
                            编辑
                        </Button>
                        {/* <Popconfirm title="是否确定执行删除角色操作？" okText="确认" cancelText="取消" onConfirm={this.deleteRole.bind(this, record)}>
                            <Button className="ml10" type="danger">删除</Button>
                        </Popconfirm> */}
                    </React.Fragment>
                )
            }
        }]
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: newRoleService.getTable,
            columns: columns,
            refsTab: function (ref) {
                self.tableThis = ref
            },
            rowKey: "id",
            searchFields: self.state.searchFields
            // orderBy: 'create_time desc',
        }
        const {visible, mode} = this.state
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
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={
                        function () {
                            self.openModal('add')
                        }
                        }
                    >
                        新增角色
                    </Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                <Modal
                    visible={visible}
                    title={'新增'}
                    onOk={this.onModalOk}
                    onCancel={this.onModalCancel}
                    cancelText="关闭"
                    okText="保存"
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="角色代码"
                        >
                            {getFieldDecorator('roleCode', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入角色代码' }]
                            })(
                                <Input placeholder="请输入角色代码" disabled={mode === 'edit' ? true : false} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色名称	"
                        >
                            {getFieldDecorator('roleName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入角色名称' }]
                            })(
                                <Input placeholder="请输入角色名称" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(RolesForm)
