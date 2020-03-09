import React, { Component, Fragment } from 'react'
import { promotionService } from '../../services'
import Search from '../../components/search'
import { pageOption } from '../../utils/utils.js'
import { connect } from "react-redux"
import { Table, Button, message } from 'antd'
import EditModal from './editModal'
import GrounpDartpment from './grounpDartpment'

const mapStateToProps = (state, action) => {
    return {
        promotionList: state.promotionList,
        deapartmentList: state.deapartmentList,
        groupList: state.groupList
    }
}

const searchConfig = {
    items: [{
        type: 'text',
        name: '推广部门',
        key: 'departmentLike',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入推广渠道名称'
    },
    {
        type: 'text',
        name: '分组名称',
        key: 'branchLike',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入分组名称'
    },
    {
        type: 'text',
        name: '推广名称',
        key: 'nameLike',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入推广名称'
    },
    {
        type: 'text',
        name: '推广编码',
        key: 'codeLike',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入推广编码'
    },
    {
        type: 'text',
        name: '显示状态',
        key: 'active',
        searchFilterType: 'select',
        defaultValue: '有效',
        placeholder: ''
    }
    ]
}
class Promotion extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editModalVisible: false,
            compileModalVisible: false,
            channelAddModal: false,
            grounpAddModal: false,
            departmentEditModal: false,
            grounpEditModal: false,
            editFrom: {},
            searchFields: {},
            editContent: {},
            editDepartmentContent: {},
            editGrounpContent: {},
            loading: true,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOptions,
            departmentLike: '',
            branchLike: '',
            nameLike: '',
            codeLike: '',
            active: undefined,
            orderBy: 'create_time desc',
            editNewDartpment:null,
            addNewDartpment:null,
            editNewGrounp:null,
            addNewGrounp:null,
            typeMoadl:''
        };
        this.tableThis = null;
        this.stateChange = this.stateChange.bind(this);
        this.edit = this.edit.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.grounpAddOk = this.grounpAddOk.bind(this);
        this.departmentEditOk = this.departmentEditOk.bind(this);
        this.grounpEditOk = this.grounpEditOk.bind(this);
        this.changeModalState = this.changeModalState.bind(this);
        this.getAddParams = this.getAddParams.bind(this);
        this.addDepartmentButton = this.addDepartmentButton.bind(this);
        this.addGroupButton = this.addGroupButton.bind(this);
        this.editDepartmentButton = this.editDepartmentButton.bind(this);
        this.editGrounpButton = this.editGrounpButton.bind(this);
        this.compileModalState = this.compileModalState.bind(this);
        this.getCompileParams = this.getCompileParams.bind(this);
        this.setChannelAddModal = this.setChannelAddModal.bind(this);
        this.setGrounpAddModal = this.setGrounpAddModal.bind(this);
        this.setDepartmentEditModal = this.setDepartmentEditModal.bind(this);
        this.setGrounpEditModal = this.setGrounpEditModal.bind(this);
    }
    componentDidMount () {
        this.fetchData()
    }
    // 获取数据
    async fetchData () {
        await this.getPromotionTable();
        await this.getGroup();
        await this.getDeapartmentTable();
    }
    // 请求table数据
    getPromotionTable = () => {
        let paramas;
        const {active} = this.state;
        paramas = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            orderBy: this.state.orderBy,
            departmentName: this.state.departmentLike,
            groupName: this.state.branchLike,
            promotionName: this.state.nameLike,
            promotionCode: this.state.codeLike,
            peomotionDesState: active === '无效' ? 0 : active === '有效' ? 1 : active === '停用' ? 2 : undefined
        }
        promotionService.getPromotionTable(paramas).then((data) => {
            this.props.dispatch({
                type: 'GET_PROMOTION_LIST',
                payload: data
            })
        }).then(() => {
            this.setState({
                loading: false
            })
        }).catch((err) => {
            message.error(err)
        })
    }
    // 查询推广分组列表
    getGroup = () => {
        promotionService.getGroup().then((data) => {
            this.props.dispatch({
                type: 'GET_GROUP_LIST',
                payload: data
            })
        })
    }
    // 查询推广部门列表
    getDeapartmentTable = () => {
        promotionService.getDeapartmentTable().then((data) => {
            this.props.dispatch({
                type: 'GET_DEAPAT_LIST',
                payload: data
            })
        })
    }
    stateChange (obj, fn) {
        this.setState(obj, () => fn && fn());
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum: 1,
            departmentLike: searchFields.departmentLike.value,
            branchLike: searchFields.branchLike.value,
            nameLike: searchFields.nameLike.value,
            codeLike: searchFields.codeLike.value,
            active: searchFields.active.value
        }, () => {
            this.getPromotionTable()
        })
    }
    // 编辑行数据
    edit = (record) => (e) => {
        e.preventDefault();
        this.setState({
            compileModalVisible: true,
            editContent: record,
            typeMoadl:false
        })
    }
    // 新增部门弹窗
    addDepartmentButton = () => {
        this.setState({
            compileModalVisible: false,
            editModalVisible: false,
            channelAddModal: true

        })
    }
    // 新增分组弹窗
    addGroupButton = () => {
        this.setState({
            compileModalVisible: false,
            editModalVisible: false,
            grounpAddModal: true
        })
    }
    // 编辑部门弹窗
    editDepartmentButton = (paramas) => {
        this.props.deapartmentList.map((item) => {
            if (paramas.departmentId === item.departmentName || paramas.departmentId === item.id) {
                this.setState({
                    editDepartmentContent: item,
                    compileModalVisible: false,
                    editModalVisible: false,
                    departmentEditModal: true
                })
            }
            return true;
        })
    }
    // 编辑分组弹窗
    editGrounpButton = (paramas) => {
        this.props.groupList.map((item) => {
            if (paramas.groupId === item.id || paramas.groupId === item.groupName) {
                this.setState({
                    editGrounpContent: item,
                    compileModalVisible: false,
                    editModalVisible: false,
                    grounpEditModal: true
                })
            }
            return true;
        })
    }
    // 改变渠道新增弹窗的状态
    changeModalState = (state) => {
        this.setState({ editModalVisible: state })
    }
    //改变渠道修改弹窗的状态
    compileModalState = (state) => {
        this.setState({
            compileModalVisible: state
        })
    }
    // 得到新增的参数并新增推广渠道
    getAddParams = (value) => {
        let newValue = value;
        if(value.departmentId === '请选择'){
            message.error('请选择推广部门')
            return false;
        }
        if(value.groupId === '请选择'){
            message.error('请选择推广分组')
            return false;
        }
        let departmentName;
        let groupName;
        this.props.deapartmentList.map((item) => {
            if (newValue.departmentId === item.id) {
                departmentName = item.departmentName;
            }else if(newValue.departmentId === item.departmentName){
                newValue.departmentId = item.id
                departmentName = item.departmentName
            }
            return true;
        });
        this.props.groupList.map((item) => {
            if (newValue.groupId === item.id) {
                groupName = item.groupName
            }else if(newValue.groupId === item.groupName){
                newValue.groupId = item.id
                groupName = item.groupName
            }
            return true;
        })
        const paramas = {
            departmentName: departmentName,
            groupName: groupName,
            ...newValue
        }
        promotionService.addChannel(paramas).then((data) => {
            this.setState({
                editModalVisible: false,
                editNewDartpment:null,
                addNewDartpment:null,
                editNewGrounp:null,
                addNewGrounp:null
            }, () => {
                this.getPromotionTable()
                message.success('新增成功')
            })
        }).catch(() => {
            message.error('新增失败，请重新添加')
        })
    }
    // 得到参数并修改推广渠道
    getCompileParams = (value) => {
        let groupName;
        let groupId;
        let departmentName;
        let departmentId;
        if (value.groupId === this.state.editContent.groupName) {
            groupName = this.state.editContent.groupName;
            groupId = this.state.editContent.groupId;
        } else {
            this.props.groupList.map((item) => {
                if (item.id === value.groupId || item.id === value.groupName || item.groupName === value.groupId) {
                    groupName = item.groupName;
                    groupId = item.id;
                }
                return true;
            })
        }
        if (value.departmentId === this.state.editContent.departmentName) {
            departmentName = this.state.editContent.departmentName;
            departmentId = this.state.editContent.departmentId;
        }
        this.props.deapartmentList.map((item) => {
            if (item.id === value.departmentId || item.id === value.departmentName || item.departmentName === value.departmentId) {
                departmentName = item.departmentName
                departmentId = item.id
            }
            return true;
        })
        const paramas = {
            id: this.state.editContent.id,
            groupName: groupName,
            departmentName: departmentName,
            groupId: groupId,
            departmentId: departmentId,
            peomotionDesState: value.peomotionDesState,
            promotionDes: value.promotionDes,
            promotionName: value.promotionName
        }
        promotionService.modifyChannel(paramas).then((data) => {
            this.setState({
                compileModalVisible: false,
                editNewDartpment:null,
                addNewDartpment:null,
                editNewGrounp:null,
                addNewGrounp:null
            }, () => {
                this.getPromotionTable()
                message.success('修改成功')
            })
        }).catch(() => {
            message.error('删除失败')
        })
    }
    // 删除推广渠道
    deleteChannel = (record) => (e) => {
        e.preventDefault();
        promotionService.deleteChannel(record.id).then((data) => {
            this.getPromotionTable()
        }).catch(() => {
            message.error('删除失败')
        })
    }
    // 新增推广部门
    channelAddOk = (params) => {
        promotionService.addDepartment(params).then((data) => {
            this.setState({
                channelAddModal: false,
                editModalVisible:this.state.typeMoadl,
                compileModalVisible:!this.state.typeMoadl,
                editNewDartpment: params.departmentName,
                addNewDartpment: null
            }, () => {
                this.getDeapartmentTable()
                message.success('新增成功')
            })
        }).catch(() => {
            message.error('新增失败')
        })
    }
    // 新增推广分组
    grounpAddOk = (paramas) => {
        promotionService.addGroup(paramas).then((data) => {
            this.setState({
                grounpAddModal: false,
                editModalVisible:this.state.typeMoadl,
                compileModalVisible:!this.state.typeMoadl,
                editNewGrounp: paramas.groupName,
                addNewGrounp: null
            }, () => {
                this.getGroup();
                message.success('新增成功')
            })
        }).catch(() => {
            message.error('新增失败')
        })
    }
    // 修改推广部门
    departmentEditOk = (value) => {
        const paramas = {
            id: this.state.editDepartmentContent.id,
            ...value
        }
        promotionService.modifyDepartment(paramas).then((data) => {
            this.setState({
                departmentEditModal: false,
                editModalVisible:this.state.typeMoadl,
                compileModalVisible:!this.state.typeMoadl,
                addNewDartpment : value.departmentName,
                editNewDartpment: null
            }, () => {
                this.getDeapartmentTable();
                this.getPromotionTable();
                message.success('修改成功')
            })
        }).catch(() => {
            message.error('修改失败')
        })
    }
    // 修改推广分组
    grounpEditOk = (value) => {
        const paramas = {
            id: this.state.editGrounpContent.id,
            ...value
        }
        promotionService.modifyGroup(paramas).then(() => {
            this.setState({
                grounpEditModal: false,
                editModalVisible:this.state.typeMoadl,
                compileModalVisible:!this.state.typeMoadl,
                editNewGrounp: value.groupName,
                addNewGrounp : null
            }, () => {
                this.getGroup();
                this.getPromotionTable();
                message.success('修改成功')
            })
        }).catch(() => {
            message.error('修改失败')
        })
    }
    addChannelModal = (e) => {
        e.preventDefault();
        this.setState({
            editModalVisible: true,
            typeMoadl: true
        })
    }
    onChangeTable = (a, b, c) => {
        const order = c.order === 'descend' ? 'desc' : c.order === 'ascend' ? 'asc' : ''
        this.setState({
            orderBy: `create_time ${order}`,
            loading: true
        }, () => {
            this.getPromotionTable()
        })
    }
    setChannelAddModal = () =>{
        this.setState({
            channelAddModal:false,
            editModalVisible:this.state.typeMoadl,
            compileModalVisible:!this.state.typeMoadl
        })
    }
    setGrounpAddModal = () =>{
        this.setState({
            grounpAddModal: false,
            editModalVisible:this.state.typeMoadl,
            compileModalVisible:!this.state.typeMoadl
        })
    }
    setDepartmentEditModal = () =>{
        this.setState({
            departmentEditModal: false,
            editModalVisible:this.state.typeMoadl,
            compileModalVisible:!this.state.typeMoadl
        })
    }
    setGrounpEditModal = (typeButon) =>{
        this.setState({
            grounpEditModal: false,
            editModalVisible:this.state.typeMoadl,
            compileModalVisible:!this.state.typeMoadl
        })
    }
    render () {
        const { promotionList, deapartmentList, groupList } = this.props;
        const columns = [
            {
                title: '推广部门',
                dataIndex: 'departmentName'
            },
            {
                title: '分组名称',
                dataIndex: 'groupName'
            },
            {
                title: '推广名称',
                dataIndex: 'promotionName'
            },
            {
                title: '推广编码',
                dataIndex: 'promotionCode'
            },
            {
                title: '生效日期',
                dataIndex: 'createTime',
                sorter: true,
                dataType: 'time',
                fmt: 'YYYY-MM-DD'
            },
            {
                title: '状态',
                align: 'center',
                render: (text,record) => (
                    <span style={{color:record.peomotionDesState === 0 ? '#bec5d1' : record.peomotionDesState === 2 ? 'red' : 'black'}}>
                        {record.peomotionDesState === 0 ? '无效' : record.peomotionDesState === 1 ? '有效' : '停用'}
                    </span>
                )
            },
            {
                title: '最后操作员',
                dataIndex: 'lastOperator'
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <span>
                            <Button size="small" type="primary" onClick={
                                this.edit(record)
                            }
                            >编辑</Button>
                        </span>
                    </div>
                )
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
                this.setState({ pageNum: 1, pageSize }, this.getPromotionTable())
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize
                }, this.getPromotionTable())
            }
        }
        return (<Fragment>
            <Search onSubmit={this.onSearch} config={searchConfig} />
            <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: 20 }}>
                <Button type="primary" onClick={
                    this.addChannelModal
                }
                >新增推广渠道</Button>
            </div>
            <Table
                loading={this.state.loading}
                dataSource={promotionList}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                onChange={this.onChangeTable}
            />
            <EditModal
                title={'新增'}
                visible={this.state.editModalVisible}
                handleCancel={this.changeModalState}
                deapartmentList={deapartmentList}
                groupList={groupList}
                getParams={this.getAddParams}
                addDepartmentButton={this.addDepartmentButton}
                addGroupButton={this.addGroupButton}
                editDepartmentButton={this.editDepartmentButton}
                editGrounpButton={this.editGrounpButton}
                editNewDartpment={this.state.editNewDartpment}
                addNewDartpment={this.state.addNewDartpment}
                editNewGrounp={this.state.editNewGrounp}
                addNewGrounp={this.state.addNewGrounp}
            />
            <EditModal
                title={'编辑'}
                visible={this.state.compileModalVisible}
                handleCancel={this.compileModalState}
                deapartmentList={deapartmentList}
                groupList={groupList}
                getParams={this.getCompileParams}
                editContent={this.state.editContent}
                addDepartmentButton={this.addDepartmentButton}
                addGroupButton={this.addGroupButton}
                editDepartmentButton={this.editDepartmentButton}
                editGrounpButton={this.editGrounpButton}
                editNewDartpment={this.state.editNewDartpment}
                addNewDartpment={this.state.addNewDartpment}
                editNewGrounp={this.state.editNewGrounp}
                addNewGrounp={this.state.addNewGrounp}
            />
            {/* 新增部门弹窗 */}
            <GrounpDartpment
                title={'新增'}
                visible={this.state.channelAddModal}
                label={'推广部门名称'}
                paramsName={'departmentName'}
                handleOk={this.channelAddOk}
                handleCancel={this.setChannelAddModal}
                typeButton={'add'}
            />
            {/* 新增分组弹窗 */}
            <GrounpDartpment
                title={'新增'}
                visible={this.state.grounpAddModal}
                label={'推广分组名称'}
                paramsName={'groupName'}
                handleOk={this.grounpAddOk}
                handleCancel={this.setGrounpAddModal}
            />
            {/* 编辑部门弹窗 */}
            <GrounpDartpment
                title={'编辑'}
                visible={this.state.departmentEditModal}
                label={'推广部门名称'}
                paramsName={'departmentName'}
                editContent={this.state.editDepartmentContent.departmentName}
                handleOk={this.departmentEditOk}
                handleCancel={this.setDepartmentEditModal}
            />
            {/* 编辑分钟弹窗 */}
            <GrounpDartpment
                title={'编辑'}
                visible={this.state.grounpEditModal}
                label={'推广分组名称'}
                paramsName={'groupName'}
                editContent={this.state.editGrounpContent.groupName}
                handleOk={this.grounpEditOk}
                handleCancel={this.setGrounpEditModal}
            />
        </Fragment>
        )
    }
}

export default connect(mapStateToProps)(Promotion)