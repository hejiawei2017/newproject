import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, Popconfirm, notification } from 'antd'
import Search from '../../components/search'
import SelectList from '../../components/selectList'
import { userAdminService } from '../../services'
import UploadDownloadBtns from '../../components/uploadDownloadBtns'
import { dicModel } from '../../utils/dictionary.js'
import {pageOption, dataFormat, checkKey, envConfig,getImgPrefix} from '../../utils/utils.js'
import {serachIngUser,serachUserSuccess,queryingUserCode,
    queryUserCodeSuccess,delingUserCode,delUserCodeSuccess,
    addingAuthorities,addUserSuccess,addUserSuccessEnd,
    batchingAuthorities,batchUsersSuccess,batchUsersSuccessEnd} from '../../actions/userAdmin'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '手机号码',
            key: 'mobileLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入手机号码'
        },
        {
            type: 'text',
            name: '用户昵称',
            key: 'nickNameLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入用户昵称'
        }
    ],
    export: {
        name: '活动数据'
    }
}

const uploadDownloadBtnsConfig = {
    download: {
        url : 'http://120.78.15.214/upload/180522/1A6J2180522171334932.xlsx'
    },
    upload: {
        url : '/platform/user-roles/import',
        type: 'arr',
        postData : {
            '手机号' : 'mobile',
            '角色' : 'roles'
        }
    }
}

const selectListConfig = {
    equalId:"roleCode",
    leftColumns: [
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode'
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName'
        }
    ],
    rightColumns: [
        {
            title: '已选角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode'
        }, {
            title: '已选角色名称',
            dataIndex: 'roleName',
            key: 'roleName'
        }
    ]
}

const mapStateToProps = (state, action) => {
    if(state.userCodeList.list && state.userCodeList.list.length > 0 && state.addUser.list && state.addUser.list.length > 0){
        let roleCodeArr = state.userCodeList.list.map((item)=>{
            return item.roleCode
        })
        state.addUser.list = state.addUser.list.filter((item)=>{
            for (let i in roleCodeArr){
                if(item.roleCode === roleCodeArr[i]){
                    return false
                }
            }
            return item
        })
    }
    return {
        userList: state.userList,
        userCodeList: state.userCodeList,
        delUserCode: state.delUserCode,
        addUser: state.addUser,
        batchUser: state.batchUser
    }
}
class UserAdminForm extends Component {
    constructor (props,content) {
        super (props)
        this.state = {
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            userLoginLogsTotalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            addDiaVisible: false,
            searchFields:{},
            userId: '',
            haveUserDiaVisible: false,
            userLoginLogsPageNum: pageOption.pageNum,
            userLoginLogsPageSize: pageOption.pageSize,
            userLoginLogsDetailsVisibel: false,
            userLoginLogsDetailsList: []
        }
        this.haveUserDiaCancel = this.haveUserDiaCancel.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleDelConfirm = this.handleDelConfirm.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.openUserLoginLogsModal = this.openUserLoginLogsModal.bind(this)
    }
    componentDidMount (){
        this.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                nickNameLike: searchFields.nickNameLike.value,
                mobile: searchFields.mobileLike.value
            }
        }, this.renderTable)
    }
    renderTable () { // 获取table数据
        const params = {...this.state.searchFields,
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize
        }
        this.props.dispatch(serachIngUser(this.props.userList))
        userAdminService.getTable(params).then((data) => {
            this.props.dispatch(serachUserSuccess(data))
        }).catch((e) => {
            this.props.dispatch(serachIngUser(this.props.userList))
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
                self.props.dispatch(delingUserCode())
                userAdminService.delUserCode(id).then((data) => {
                    self.props.dispatch(delUserCodeSuccess())
                    self.queryUserId(this.props.userCodeList.userId)
                })
            }
        });
    }
    haveUserDiaCancel = () => {
        this.setState({ haveUserDiaVisible: false })
    }
    addUserModalCancel = () =>{
        this.setState({ addDiaVisible: false })
    }
    openModal = (userId) => {
        this.queryUserId(userId)
    }
    addUserModal = () => {
        let roleCode = (this.props.userCodeList.list[0]) ? this.props.userCodeList.list[0].roleCode : ""
        let params = {
            excludeRoleCodes:roleCode,
            pageSize: 1000
        }
        this.props.dispatch(addingAuthorities([]))
        userAdminService.addUser(params).then((data) => {
            this.props.dispatch(addUserSuccess(data.list))
            this.setState({ addDiaVisible: true })
        })
        this.setState({selectData:[]})
    }
    queryUserId = (userId) => {
        this.props.dispatch(queryingUserCode({
            list: [],
            userId: userId
        }))
        userAdminService.queryUserId(userId).then((data) => {
            this.props.dispatch(queryUserCodeSuccess({
                list: data.list,
                userId: userId
            }))
            this.setState({ haveUserDiaVisible: true })
        })
    }
    delUserCodeRequest = () => {
        this.props.dispatch(addUserSuccessEnd([]))
        this.setState({ haveUserDiaVisible: false })
        this.queryUserId(this.props.userCodeList.userId)
    }
    addUserModalSubmit = () => {
        let arr = []
        for(let i in this.state.selectData){
            arr.push({
                roleCode:this.state.selectData[i].roleCode,//"ROLE_BOOKING_API"
                roleName:this.state.selectData[i].roleName,//"Booking接口角色"
                userId:this.props.userCodeList.userId
            })
        }

        this.props.dispatch(batchingAuthorities([]))
        userAdminService.batchUser(arr).then((data) => {
            this.props.dispatch(batchUsersSuccess(data.list))
            this.batchUserRqeuest()
        })
    }
    batchUserRqeuest = () => {
        this.props.dispatch(batchUsersSuccessEnd([]))
        this.setState({ addDiaVisible: false })//关闭弹框
        this.queryUserId(this.props.userCodeList.userId)//刷新列表
    }
    setSelect = (list) => {
        this.setState({selectData:list})
    }
    renderModal = (userCode) => {
        return (
            <Modal title="拥有角色" {...dicModel} className="hideModel-okBtn" visible={this.state.haveUserDiaVisible} onCancel={this.haveUserDiaCancel} >
                {this.renderModalList()}
            </Modal>
        )
    }
    renderModalList = () => {
        const columns = [{
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode'
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName'
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
                    <Button className="mb10" onClick={this.addUserModal}>增加角色</Button>
                    <Table columns={columns} dataSource={checkKey(this.props.userCodeList.list)} pagination={false} loading={this.props.userCodeList.loading} scroll={{ y: 360 }}>
                    </Table>
                </div>
            </div>
        )
    }
    renderAddModal = () => {
        return (
            <Modal title="增加角色" {...dicModel} visible={this.state.addDiaVisible} onOk={this.addUserModalSubmit} onCancel={this.addUserModalCancel} width={1000}>
                <SelectList setSelect={this.setSelect} selectData={this.state || []} initData={this.props.addUser} config={selectListConfig} />
            </Modal>
        )
    }
    popConfirm = (mobile) =>{
        userAdminService.refreshTimeout({mobile}).then((data) => {
            notification.success({
                message:'用户初始化成功！'
            })
        })
    }
    onUserLoginLogsModalCancel = () => {
        this.setState({
            userLoginLogsDetailsVisibel: false,
            userLoginLogsDetailsList: []
        })
    }
    openUserLoginLogsModal = (userId) => {
        this.setState({
            userLoginLogsDetailsVisibel: true,
            userLoginLogsDetailsList: [],
            userId: userId
        },this.getUserLoginLogsDetailsList)
    }
    getUserLoginLogsDetailsList = () => {
        // 获取登录日志查询列表
        const params = {
            userId:this.state.userId,
            pageSize: this.state.userLoginLogsPageSize,
            pageNum: this.state.userLoginLogsPageNum
        }
        userAdminService.userLoginLogs(params).then((data)=>{
            if(data){
                this.setState({
                    userLoginLogsTotalCount:data.total,
                    userLoginLogsDetailsList: data.list
                })
            }
        })
    }
    render () {
        let self = this

        const columns = [{
            title: '用户ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '用户昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        }, {
            title: '真实姓名',
            dataIndex: 'realName',
            key: 'realName'
        }, {
            title: '标签',
            dataIndex: 'label',
            key: 'label'
        }, {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: _ => _ ? <img className="adsImg height60" src={getImgPrefix(_,envConfig.imgPrefix)} alt="加载失败..." width = "60px" /> : null
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        }, {
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile'
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: _ => <span>{['女','男'][_]}</span>
        }, {
            title: '城市',
            dataIndex: 'cityName',
            key: 'cityName'
        }, {
            title: '是否验证',
            dataIndex: 'isValidate',
            key: 'isValidate',
            render: val => <span>{['否','是'][val]}</span>
        }, {
            title: '最后密码重置时间',
            dataIndex: 'lastPasswordResetDate',
            key: 'lastPasswordResetDate',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            exportType: 'date',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }, {
            title: '操作',
            exportType: 'none',
            width: 80,
            render: (text, record) => (
                <span>
                    <Button size="small" className="mr10" type="primary" onClick={function (){self.openModal(record.id)}}>角色</Button>
                    <Popconfirm title="用户登录异常过多,点击'确认'清除验证等待时间!" onConfirm={function () {self.popConfirm(record.mobile)}} okText="确认" cancelText="取消">
                        <Button size="small" className="mt10" type="primary">解封</Button>
                    </Popconfirm>
                    <Button
                        size="small"
                        className="order-log__btn mt10" type="primary" ghost onClick={function (){self.openUserLoginLogsModal(record.id)}}
                    >日志</Button>
                </span>
            )
        }]
        searchConfig.columns = columns

        const userLloginLogsDetail = [{
            title: 'ip地址',
            dataIndex: 'ipAddress',
            key: 'ipAddress'
        }, {
            title: '设备平台',
            dataIndex: 'devicePlatform',
            key: 'devicePlatform'
        }, {
            title: '网站偏好',
            dataIndex: 'sitePreference',
            key: 'sitePreference'
        }, {
            title: '应用平台',
            dataIndex: 'appPlatform',
            key: 'appPlatform'
        }, {
            title: '失败信息',
            dataIndex: 'message',
            key: 'message'
        }, {
            title: '登录状态',
            dataIndex: 'loginStatus',
            key: 'loginStatus',
            render: _ => <span>{['','成功','失败'][_]}</span>
        }, {
            title: '链路跟踪id',
            dataIndex: 'traceId',
            key: 'traceId'
        }, {
            title: '登录时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const pageObj = {
            total: this.props.userList.total,
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

        const pageObjDetail = {
            total: this.state.userLoginLogsTotalCount,
            pageSize: this.state.userLoginLogsPageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ userLoginLogsPageNum: 1, userLoginLogsPageSize: pageSize }, this.getUserLoginLogsDetailsList)
            },
            onChange: (value, pageSize) => {
                this.setState({ userLoginLogsPageNum: value, userLoginLogsPageSize: pageSize }, this.getUserLoginLogsDetailsList)
            }
        }

        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={checkKey(this.props.userList.list)} />
                <div className="pt10 mb10 text-right">
                    <UploadDownloadBtns config={uploadDownloadBtnsConfig} />
                </div>
                <Table columns={columns} dataSource={checkKey(this.props.userList.list)} pagination={pageObj} loading={this.props.userList.loading} >
                </Table>
                {this.renderModal()}
                {this.renderAddModal()}
                <Modal
                    visible={this.state.userLoginLogsDetailsVisibel}
                    title="登录日志"
                    width="90%"
                    footer={[<Button onClick={this.onUserLoginLogsModalCancel} key="batch-detail-modal">关闭</Button>]}
                    onCancel={this.onUserLoginLogsModalCancel}
                >
                    <Table
                        columns={userLloginLogsDetail}
                        dataSource={this.state.userLoginLogsDetailsList}
                        rowKey="id"
                        pagination={pageObjDetail}
                    />
                </Modal>
            </div>
        )
    }
}

let UserAdmin = Form.create()(UserAdminForm)
export default connect(mapStateToProps)(UserAdmin)
