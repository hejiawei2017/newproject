import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, message} from 'antd'
import Search from '../../components/search'
import SelectList from '../../components/selectList'
import { roleService } from '../../services'
import { dicModel } from '../../utils/dictionary.js'
import { pageOption, dataFormat, checkKey } from '../../utils/utils.js'
import { serachIngRole, serachRoleSuccess, queryingRoleCode,
    queryRoleCodeSuccess, delingRoleCode, delRoleCodeSuccess,
    addingAuthorities, addAuthoritiesSuccess, addAuthoritiesSuccessEnd,
    batchingAuthorities, batchAuthoritiessSuccess,
    batchAuthoritiessSuccessEnd } from '../../actions/role'

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
    ],
    export: {
        name: '活动数据'
    }
}

const selectListConfig = {
    equalId:"authCode",
    leftColumns: [
        {
            title: '权限编码',
            dataIndex: 'authCode',
            key: 'authCode'
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName'
        }
    ],
    rightColumns: [
        {
            title: '已选权限编码',
            dataIndex: 'authCode',
            key: 'authCode'
        }, {
            title: '已选权限名称',
            dataIndex: 'authName',
            key: 'authName'
        }
    ]
}

const mapStateToProps = (state, action) => {
    if(state.roleCodeList.list && state.roleCodeList.list.length > 0 && state.addAuthorities.list && state.addAuthorities.list.length > 0){
        let authCodeArr = state.roleCodeList.list.map((item)=>{
            return item.authCode
        })
        state.addAuthorities.list = state.addAuthorities.list.filter((item)=>{
            for (let i in authCodeArr){
                if(item.authCode === authCodeArr[i]){
                    return false
                }
            }
            return item
        })
    }

    return {
        roleList: state.roleList,
        roleCodeList: state.roleCodeList,
        delRoleCode: state.delRoleCode,
        addAuthorities: state.addAuthorities,
        batchAuthorities: state.batchAuthorities
    }
}
class RolesForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            haveAddAuthorDiaVisible: false,
            addDiaVisible: false
        }
        this.haveAddAuthorDiaCancel = this.haveAddAuthorDiaCancel.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleDelConfirm = this.handleDelConfirm.bind(this)
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount (){
        this.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                roleNameLike: searchFields.roleNameLike.value
            }
        }, this.renderTable)
    }
    renderTable () { // 获取table数据
        const params = {...this.state.searchFields,
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize
        }

        this.props.dispatch(serachIngRole(this.props.roleList))
        roleService.getTable(params).then((data) => {
            this.props.dispatch(serachRoleSuccess(data))
        }).catch((e) => {
            this.props.dispatch(serachIngRole(this.props.roleList))
        })
    }
    handleDelConfirm (e) {
        let self = this
        let id = e.target.id
        Modal.confirm({
            title: '删除确认',
            content: '确认要删除？',
            okText: '确认',
            cancelText: '取消',
            onOk: () =>{
                self.props.dispatch(delingRoleCode())
                roleService.delRoleCode(id).then((data) => {
                    self.props.dispatch(delRoleCodeSuccess())
                    message.success('删除成功')
                    self.queryRoleCode(this.props.roleCodeList.roleCode)
                })
            }
        });
    }
    haveAddAuthorDiaCancel = () => {
        this.setState({ haveAddAuthorDiaVisible: false })
    }
    addAuthoritiesModalCancel = () =>{
        this.setState({ addDiaVisible: false })
    }
    openModal = (roleCode) => {
        this.queryRoleCode(roleCode)
    }
    addAuthoritiesModal = () => {
        let params = {
            excludeAuthorityCodes:this.props.roleCodeList.roleCode,
            pageSize: 1000
        }
        this.props.dispatch(addingAuthorities([]))
        roleService.addAuthorities(params).then((data) => {
            this.props.dispatch(addAuthoritiesSuccess(data.list))
            this.setState({ addDiaVisible: true })
        })
        this.setState({selectData:[]})
    }
    queryRoleCode = (roleCode) => {
        this.props.dispatch(queryingRoleCode({list: [], roleCode: roleCode}))
        roleService.queryRoleCode(roleCode).then((data) => {
            let item = this.props.roleList.list.filter(i => i["roleCode"] === roleCode)[0]
            this.props.dispatch(queryRoleCodeSuccess({list: data.list,roleCode: roleCode,roleName: item.roleName}))
            this.setState({ haveAddAuthorDiaVisible: true })
        })
    }
    delRoleCodeRequest = () => {
        this.props.dispatch(addAuthoritiesSuccessEnd([]))
        this.setState({ haveAddAuthorDiaVisible: false })
        this.queryRoleCode(this.props.roleCodeList.roleCode)
    }
    addAuthoritiesModalSubmit = () => {
        let arr = []
        for(let i in this.state.selectData){
            arr.push({
                roleCode:this.props.roleCodeList.roleCode,
                roleName:this.props.roleCodeList.roleName,
                authCode:this.state.selectData[i].authCode,
                authName:this.state.selectData[i].authName
            })
        }

        this.props.dispatch(batchingAuthorities([]))
        roleService.batchAuthorities(arr).then((data) => {
            this.props.dispatch(batchAuthoritiessSuccess(data.list))
            message.success('添加成功')
            this.batchAuthoritiesRqeuest()
        })
    }
    batchAuthoritiesRqeuest = () => {
        this.props.dispatch(batchAuthoritiessSuccessEnd([]))
        this.setState({ addDiaVisible: false })//关闭弹框
        this.queryRoleCode(this.props.roleCodeList.roleCode)//刷新列表
    }
    setSelect = (list) => {
        this.setState({selectData:list})
    }
    renderModal = (roleCode) => {
        return (
            <Modal title="拥有权限" {...dicModel} className="hideModel-okBtn" visible={this.state.haveAddAuthorDiaVisible} onCancel={this.haveAddAuthorDiaCancel} >
                {this.renderModalList()}
            </Modal>
        )
    }
    renderModalList = () => {
        const columns = [{
            title: '权限编码',
            dataIndex: 'authCode',
            key: 'authCode'
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName'
        }, {
            title: '操作',
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" id={record.id} onClick={this.handleDelConfirm}>删除</Button>
                </span>
            )
        }]

        return (
            <div>
                <div className="table-operations">
                    <Button className="mb10" onClick={this.addAuthoritiesModal}>增加权限</Button>
                    <Table columns={columns} dataSource={checkKey(this.props.roleCodeList.list)} pagination={false} loading={this.props.roleCodeList.loading} scroll={{ y: 360 }}>
                    </Table>
                </div>
            </div>
        )
    }
    renderAddModal = () => {
        return (
            <Modal title="增加权限" {...dicModel} visible={this.state.addDiaVisible} onOk={this.addAuthoritiesModalSubmit} onCancel={this.addAuthoritiesModalCancel} width={1000}>
                <SelectList setSelect={this.setSelect} selectData={this.state || []} initData={this.props.addAuthorities} config={selectListConfig} />
            </Modal>
        )
    }
    render () {
        let self = this

        const columns = [{
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode'
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'date',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            exportType: 'none',
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" onClick={function (){self.openModal(record.roleCode)}}>权限</Button>
                </span>
            )
        }]
        searchConfig.columns = columns

        const pageObj = {
            total: this.props.roleList.total,
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
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.roleList.list)} />
                {this.renderModal()}
                {this.renderAddModal()}
                <Table columns={columns} dataSource={checkKey(this.props.roleList.list)} pagination={pageObj} loading={this.props.roleList.loading} >
                </Table>
            </div>
        )
    }
}

let Roles = Form.create()(RolesForm)
export default connect(mapStateToProps)(Roles)
