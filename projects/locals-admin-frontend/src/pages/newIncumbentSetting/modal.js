import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Input,
    Form,
    Button,
    Modal,
    Radio,
    DatePicker,
    Select,
    Switch,
    Cascader,
    Tabs,
    message,
    Icon,
    Row,
    Col
} from 'antd'
import { newIncumbentSettingService, newRoleService } from '../../services'

import {
    setArrayToData,
    getArrayValueToparent
} from '../../utils/arrayTransform'
import { SubTable } from '../../components'
import { moveTypeList } from '../../utils/dictionary'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.less'

moment.locale('zh-cn')

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
const TabPane = Tabs.TabPane
const Search = Input.Search
const TextArea = Input.TextArea

const mapStateToProps = (state, action) => {
    return {}
}
class IncumbentModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editeInfoVisible: false,
            confirmLoading: false,
            // moveDivVisible: true,
            siteData: [],
            oSiteData: [],
            positionData: [],
            organizationData: [],
            roleData: [],
            siteDataArr: [],
            newOrganizations: [
                {
                    currentDepartment: '',
                    currentPosition: ''
                }
            ],
            currentPosition: '',
            initOfficeData: {},
            number: 1
        }
    }
    componentDidMount () {
        this.getSiteTable()
        // this.getRoleList()
        // this.getPositionList()
        // this.getTreeList()
        let {
            editeInfoVisible,
            editInfoData,
            moveDivVisible,
            positionData,
            organizationData,
            organizationArrData
        } = this.props
        let items = {
            editInfoData,
            positionData,
            organizationData,
            organizationArrData
        }
        // console.log('items', items)
        if (editeInfoVisible) {
            this.setState({
                ...items,
                editeInfoVisible
            })
        }
        if (moveDivVisible) {
            let organizationPositionViews =
                items.editInfoData.organizationPositionViews
            let organizationsArr
            let newOrganizations = []
            let initOfficeData = {}
            let currentPosition = ''
            if (
                organizationPositionViews &&
                organizationPositionViews.length > 0
            ) {
                organizationPositionViews.map((item, index) => {
                    let arr = item['deptName'].split('/')
                    let name = arr[arr.length - 1]
                    organizationsArr = getArrayValueToparent(
                        items.organizationArrData,
                        'parentId',
                        'id',
                        'name',
                        name
                    )
                    // console.log('organizationsArr', organizationsArr)
                    initOfficeData = {
                        id: this.state.number + index,
                        currentDepartment: organizationsArr,
                        currentPosition: item.positionId
                    }
                    currentPosition = item.positionId
                    newOrganizations.push(initOfficeData)
                    return item
                })
            }
            this.setState({
                ...items,
                moveDivVisible,
                newOrganizations,
                initOfficeData,
                currentPosition,
                number: this.state.number + organizationPositionViews.length
            })
        }
    }
    getSiteTable = () => {
        newIncumbentSettingService
            .getSiteTable({ pageNum: 1, pageSize: 20000 })
            .then(e => {
                let siteData = setArrayToData(
                    e.list,
                    'parentCode',
                    'code',
                    'children',
                    this.changeArray,
                    this.isChildren,
                    2
                )
                let workplace = this.props.editInfoData.workplace
                let siteDataArr = this.state.siteDataArr
                if (siteDataArr.length === 0) {
                    siteDataArr = getArrayValueToparent(
                        e.list,
                        'parentCode',
                        'code',
                        'name',
                        workplace
                    )
                }
                this.setState({
                    siteData,
                    siteDataArr,
                    oSiteData: e.list
                })
            })
    }
    getRoleList = () => {
        newRoleService.getTable({ pageNum: 1, pageSize: 20000 }).then(e => {
            let roleData = e.list
            this.setState({
                roleData
            })
        })
    }
    putEmployee = values => {
        let oSiteData = this.state.oSiteData
        if (values.workplace && values.workplace.length > 0) {
            let workplaceCode = values.workplace[values.workplace.length - 1]
            oSiteData.map(item => {
                if (item.code === workplaceCode) {
                    values.workplace = item.name
                }
                return item
            })
        } else {
            values.workplace = null
        }
        let params = {
            id: values.id,
            realName: values.realName,
            sex: values.sex,
            idCard: values.idCard,
            privateEmail: values.privateEmail,
            companyEmail: values.companyEmail,
            mobile: values.mobile,
            comMobile: values.comMobile,
            education: values.education,
            inductionTime: values.inductionTime,
            contractPositiveTime: values.contractPositiveTime,
            contractExpireTime: values.contractExpireTime,
            workplace: values.workplace,
            isDepartmentPrincipal: values.isDepartmentPrincipal ? 1 : 0
        }
        newIncumbentSettingService
            .putEmployee(params)
            .then(record => {
                if (record) {
                    message.success(record)
                } else {
                    message.success('修改成功！')
                }
                this.setState({ confirmLoading: false })
                this.props.submitInfoChangeTable()
            })
            .catch(error => {
                this.setState({ confirmLoading: false })
            })
    }
    putEmployeeBizMove = values => {
        let params = {
            moveType: values.moveType,
            moveEmployeeId: values.moveEmployeeId,
            handoverEmployeeId: values.handoverEmployeeId,
            moveCause: values.moveCause
        }
        if (values.moveType === '1') {
            params.raiseLeaveTime = values.raiseLeaveTime.format('YYYY-MM-DD')
            params.leaveTime = values.leaveTime.format('YYYY-MM-DD')
            params.bonusBeginMonth = values.bonusBeginMonth
        }
        if (values.moveType === '3') {
            let bol = 0
            params.userOrganizationPositions = values.userOrganizationPositions.map(
                item => {
                    // let isArea = false;
                    if (
                        item.positionId.length === 0 ||
                        item.organizationId.length === 0
                    ) {
                        bol++
                    }
                    return {
                        ...item,
                        organizationId:
                            item.organizationId[item.organizationId.length - 1]
                    }
                }
            )
            if (bol !== 0) {
                message.error('请选择部门/职位！！')
                return false
            }
        }
        // console.log('putEmployeeBizMove', params)
        // return false
        newIncumbentSettingService
            .putEmployeeBizMove(params)
            .then(data => {
                if (data) {
                    message.success(data)
                } else {
                    message.success('修改成功！')
                }
                this.setState({ confirmLoading: false })
                this.props.submitInfoChangeTable()
            })
            .catch(() => {
                this.setState({ confirmLoading: false })
            })
    }
    changeItem = item => {
        return {
            value: item.id,
            label: item.name
        }
    }
    changeArray = item => {
        return {
            value: item.code,
            label: item.name
        }
    }
    isChildren = item => {
        return item.name === '市辖区'
    }
    changeState = obj => {
        this.setState(obj)
    }
    removeChild = (item, index) => {
        let newOrganizations = this.state.newOrganizations
        let {
            // currentDepartment,
            // currentPosition
            userOrganizationPositions
        } = this.props.form.getFieldsValue()
        newOrganizations.splice(index, 1)
        userOrganizationPositions.splice(index, 1)
        // currentDepartment.splice(index, 1)
        // currentPosition.splice(index, 1)
        this.setState({
            newOrganizations
        })
        // this.props.form.setFieldsValue({
        //     // currentDepartment,
        //     // currentPosition
        //     userOrganizationPositions
        // })
        // console.log('newOrganizations', newOrganizations, index, this.props.form.getFieldsValue())
    }
    searchEmployee = value => {
        if (!value) {
            this.props.form.setFieldsValue({
                handoverEmployeeName: '',
                handoverEmployeeId: null
            })
            this.setState({ handoverEmployeeId: null }, () => {
                this.props.form.validateFields(['bonusBeginMonth'], {
                    force: true
                })
            })
        } else {
            newIncumbentSettingService.getTable({ search: value }).then(e => {
                if (e.total > 0 && e.list[0]) {
                    let item = e.list[0]
                    this.props.form.setFieldsValue({
                        handoverEmployeeName:
                            (item.realName || '') +
                            ' - ' +
                            (item.comMobile || ''),
                        handoverEmployeeId: item.id
                    })
                    let positionViews = false
                    let currentPosition = this.state.currentPosition
                    this.state.positionData.map(i => {
                        if (i.name === '助理' && i.id === currentPosition) {
                            positionViews = true
                        }
                        return i
                    })
                    this.setState(
                        {
                            handoverEmployeeId: item.id,
                            positionViews
                        },
                        () => {
                            this.props.form.validateFields(
                                ['bonusBeginMonth'],
                                {
                                    force: true
                                }
                            )
                        }
                    )
                }
            })
        }
    }
    addOrganizations = () => {
        let newOrganizations = this.state.newOrganizations
        let initOfficeData = { ...this.state.initOfficeData }
        let number = this.state.number + 1
        initOfficeData.id = number
        newOrganizations.push(initOfficeData)
        // console.log('newOrganizations',newOrganizations)
        this.setState({
            number,
            newOrganizations
        })
    }
    handleEditInfoSubmit = e => {
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //   console.log('Received values of form: ', values);
                this.setState({ confirmLoading: true })
                this.putEmployee(values)
            }
        })
    }
    handleMoveDivSubmit = e => {
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);
                this.setState({ confirmLoading: true })
                console.log('handleMoveDivSubmit(', values)
                this.putEmployeeBizMove(values)
            }
        })
    }
    renderRoleOption = () => {
        let roleData = this.state.roleData
        return roleData.map(item => (
            <Option key={item.roleCode}>{item.roleName}</Option>
        ))
    }
    renderpositionOption = () => {
        let positionData = this.state.positionData
        return positionData.map(item => (
            <Option key={item.id}>{item.name}</Option>
        ))
    }
    render () {
        let _this = this
        let _state = this.state
        let {
            editeInfoVisible,
            moveDivVisible,
            siteData,
            moveType,
            editInfoData,
            siteDataArr,
            newOrganizations,
            organizationData,
            confirmLoading,
            handoverEmployeeId,
            positionViews
        } = _state
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        }
        const formItemLayoutUser1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        }
        let columns = [
            {
                title: '异动人员',
                dataIndex: 'moveEmployeeRealName',
                key: 'moveEmployeeRealName',
                width: 100
            },
            {
                title: '操作人',
                dataIndex: 'operationEmployeeRealName',
                key: 'operationEmployeeRealName',
                width: 100
            },
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                dataType: 'time',
                fmt: 'YYYY年MM月DD日'
            },
            {
                title: '异动类型',
                dataIndex: 'moveType',
                key: 'moveType',
                width: 120,
                dataType: 'select',
                selectData: moveTypeList
            },
            {
                title: '异动原因',
                dataIndex: 'moveCause',
                key: 'moveCause',
                width: 120
            },
            {
                title: '交接人员',
                dataIndex: 'handoverEmployeeRealName',
                key: 'handoverEmployeeRealName',
                width: 120
            },
            {
                title: '原部门',
                dataIndex: 'originalPositions',
                key: 'originalPositions',
                width: 200,
                render: (v, o) => {
                    if (v && v.length > 0) {
                        return v.map((item, index) => {
                            return (
                                <div
                                    key={`originalDepartments-originalPositions-${index}`}
                                    className="flex"
                                >
                                    <div className="flex">
                                        {o['originalDepartments'] &&
                                        o['originalDepartments'][index] &&
                                        o['originalDepartments'][index].fullName
                                            ? o['originalDepartments'][index]
                                                  .fullName + '-'
                                            : ''}
                                    </div>
                                    <div className="text-right">
                                        {item.name}
                                    </div>
                                </div>
                            )
                        })
                    }
                }
            },
            {
                title: '现部门',
                dataIndex: 'currentPositions',
                key: 'currentPositions',
                width: 200,
                render: (v, o) => {
                    if (v && v.length > 0) {
                        return v.map((item, index) => {
                            return (
                                <div
                                    key={`currentDepartments-currentPositions-${index}`}
                                    className="flex"
                                >
                                    <div className="flex">
                                        {o['currentDepartments'] &&
                                        o['currentDepartments'][index] &&
                                        o['currentDepartments'][index].fullName
                                            ? o['currentDepartments'][index]
                                                  .fullName + '-'
                                            : ''}
                                    </div>
                                    <div className="text-right">
                                        {item.name}
                                    </div>
                                </div>
                            )
                        })
                    }
                }
            }
        ]
        let columns2 = [
            {
                title: '操作人',
                dataIndex: 'updator',
                key: 'updator',
                width: 100
            },
            {
                title: '操作时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 140,
                dataType: 'time',
                fmt: 'YYYY年MM月DD日'
            },
            {
                title: '修改字段-修改前-修改后',
                dataIndex: 'record',
                key: 'record',
                render: v => <span dangerouslySetInnerHTML={{ __html: v }} />
            }
        ]
        const subTableItem = {
            getTableService: newIncumbentSettingService.getMoveTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: 'id',
            searchFields: {
                employeeId: editInfoData ? editInfoData.id : ''
            }
            // orderBy: 'create_time desc',
        }
        const subTableItem2 = {
            getTableService: newIncumbentSettingService.getModifyRecordsTable,
            columns: columns2,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: 'id',
            searchFields: {
                employeeId: editInfoData ? editInfoData.id : ''
            }
            // orderBy: 'create_time desc',
        }
        return (
            <div className="newIncumbentSetting-page--modal">
                {editeInfoVisible &&
                    editInfoData && (
                        <Modal
                            title="修改人员"
                            visible={editeInfoVisible}
                            className="newIncumbentSetting-modal"
                            confirmLoading={confirmLoading}
                            width={640}
                            onCancel={function () {
                                _this.changeState({ editeInfoVisible: false })
                                _this.props.changeState({
                                    editeInfoVisible: false
                                })
                            }}
                            onOk={this.handleEditInfoSubmit}
                        >
                            <div>
                                <Tabs>
                                    <TabPane tab="基本信息" key="1">
                                        <Form>
                                            <FormItem
                                                {...formItemLayout}
                                                label="id"
                                                style={{ display: 'none' }}
                                            >
                                                {getFieldDecorator('id', {
                                                    initialValue:
                                                        editInfoData.id
                                                })(
                                                    <Input
                                                        placeholder=""
                                                        disabled
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="员工编号"
                                            >
                                                {getFieldDecorator(
                                                    'memberCode',
                                                    {
                                                        initialValue:
                                                            editInfoData.memberCode,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入员工编号!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input
                                                        placeholder="员工编号"
                                                        disabled
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="姓名"
                                            >
                                                {getFieldDecorator('realName', {
                                                    initialValue:
                                                        editInfoData.realName,
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请输入姓名!'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="姓名" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="性别"
                                            >
                                                {getFieldDecorator('sex', {
                                                    initialValue: editInfoData.sex.toString(),
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请选择性别!'
                                                        }
                                                    ]
                                                })(
                                                    <RadioGroup>
                                                        <RadioButton value="1">
                                                            男
                                                        </RadioButton>
                                                        <RadioButton value="0">
                                                            女
                                                        </RadioButton>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="身份证号码"
                                            >
                                                {getFieldDecorator('idCard', {
                                                    initialValue:
                                                        editInfoData.idCard,
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                '请输入身份证号码!'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="身份证号码" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="私人邮箱"
                                            >
                                                {getFieldDecorator(
                                                    'privateEmail',
                                                    {
                                                        initialValue:
                                                            editInfoData.privateEmail,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入私人邮箱!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input placeholder="私人邮箱" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="私人电话"
                                            >
                                                {getFieldDecorator('mobile', {
                                                    initialValue:
                                                        editInfoData.mobile,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入私人电话!'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="私人电话" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="公司电话"
                                            >
                                                {getFieldDecorator(
                                                    'comMobile',
                                                    {
                                                        initialValue:
                                                            editInfoData.comMobile,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入公司电话!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input placeholder="公司电话" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="学历"
                                            >
                                                {getFieldDecorator(
                                                    'education',
                                                    {
                                                        initialValue:
                                                            editInfoData.education,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入学历!'
                                                            }
                                                        ]
                                                    }
                                                )(<Input placeholder="学历" />)}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="公司邮箱"
                                            >
                                                {getFieldDecorator(
                                                    'companyEmail',
                                                    {
                                                        initialValue:
                                                            editInfoData.companyEmail,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入公司邮箱!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input placeholder="公司邮箱" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="入职日期"
                                            >
                                                {getFieldDecorator(
                                                    'inductionTime',
                                                    {
                                                        initialValue: editInfoData.inductionTime
                                                            ? moment(
                                                                  editInfoData.inductionTime
                                                              )
                                                            : null,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                type: 'object',
                                                                message:
                                                                    '请选择入职日期!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <DatePicker format="YYYY-MM-DD" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="合同转正日期"
                                            >
                                                {getFieldDecorator(
                                                    'contractPositiveTime',
                                                    {
                                                        initialValue: editInfoData.contractPositiveTime
                                                            ? moment(
                                                                  editInfoData.contractPositiveTime
                                                              )
                                                            : null,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                type: 'object',
                                                                message:
                                                                    '请选择合同转正日期!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <DatePicker format="YYYY-MM-DD" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="合同到期日期"
                                            >
                                                {getFieldDecorator(
                                                    'contractExpireTime',
                                                    {
                                                        initialValue: editInfoData.contractExpireTime
                                                            ? moment(
                                                                  editInfoData.contractExpireTime
                                                              )
                                                            : null,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                type: 'object',
                                                                message:
                                                                    '请选择合同到期日期!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <DatePicker format="YYYY-MM-DD" />
                                                )}
                                            </FormItem>
                                            {(editInfoData
                                                .organizationPositionViews
                                                .length > 0
                                                ? editInfoData.organizationPositionViews
                                                : [{}]
                                            ).map((item, index) => {
                                                return (
                                                    <div
                                                        className="word"
                                                        key={`editInfoData-word-${index}`}
                                                    >
                                                        <div className="title">
                                                            工作岗位
                                                        </div>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="部门"
                                                        >
                                                            {getFieldDecorator(
                                                                `organizations[${index}]`,
                                                                {
                                                                    initialValue: [
                                                                        item.deptName
                                                                    ],
                                                                    rules: [
                                                                        {
                                                                            required: false,
                                                                            type:
                                                                                'array',
                                                                            message:
                                                                                '请输入部门!'
                                                                        }
                                                                    ]
                                                                }
                                                            )(
                                                                <Input
                                                                    placeholder=""
                                                                    disabled
                                                                />
                                                            )}
                                                            {/* <Cascader options={organizationData} placeholder="请选择" /> */}
                                                        </FormItem>
                                                        <FormItem
                                                            {...formItemLayout}
                                                            label="职位"
                                                        >
                                                            {getFieldDecorator(
                                                                `positions[${index}]`,
                                                                {
                                                                    initialValue:
                                                                        item.posName,
                                                                    rules: [
                                                                        {
                                                                            required: false,
                                                                            message:
                                                                                '请输入职位!'
                                                                        }
                                                                    ]
                                                                }
                                                            )(
                                                                <Input
                                                                    placeholder=""
                                                                    disabled
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </div>
                                                )
                                            })}
                                            <FormItem
                                                {...formItemLayout}
                                                label="工作地点"
                                            >
                                                {getFieldDecorator(
                                                    'workplace',
                                                    {
                                                        initialValue: siteDataArr,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                type: 'array',
                                                                message:
                                                                    '请输入工作地点!'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Cascader
                                                        options={siteData}
                                                        placeholder="请选择"
                                                        changeOnSelect
                                                    />
                                                )}
                                            </FormItem>
                                            {/* <FormItem
                                {...formItemLayout}
                                label="角色权限"
                            >
                                {getFieldDecorator('workplace', {
                                    initialValue: [],
                                    rules: [{ required: false, type: 'array', message: '请选择角色权限!' }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="请选择角色权限"
                                    >
                                        {this.renderRoleOption()}
                                    </Select>
                                )}
                            </FormItem> */}
                                            <FormItem
                                                {...formItemLayout}
                                                label="是否部门负责人"
                                            >
                                                {getFieldDecorator(
                                                    `isDepartmentPrincipal`,
                                                    {
                                                        initialValue:
                                                            editInfoData.isDepartmentPrincipal ===
                                                            1,
                                                        valuePropName:
                                                            'checked',
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入是否部门负责人!'
                                                            }
                                                        ]
                                                    }
                                                )(<Switch />)}
                                            </FormItem>
                                            {/* <div className="flex"><Button>增加工作岗位</Button></div> */}
                                        </Form>
                                    </TabPane>
                                    <TabPane tab="日志" key="3">
                                        <div className="mb20">
                                            员工姓名：{' '}
                                            <Input
                                                placeholder=""
                                                disabled
                                                className="w100"
                                                value={editInfoData.realName}
                                            />
                                        </div>
                                        <SubTable {...subTableItem2} />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Modal>
                    )}
                {moveDivVisible &&
                    editInfoData && (
                        <Modal
                            title="异动"
                            width="720px"
                            visible={moveDivVisible}
                            confirmLoading={confirmLoading}
                            className="newIncumbentSetting-modal--change ant-form--mb5"
                            onCancel={function () {
                                _this.changeState({ moveDivVisible: false })
                                _this.props.changeState({
                                    moveDivVisible: false
                                })
                            }}
                            onOk={this.handleMoveDivSubmit}
                        >
                            <div>
                                <Tabs>
                                    <TabPane tab="异动" key="1">
                                        <Form>
                                            <FormItem
                                                {...formItemLayout}
                                                style={{ display: 'none' }}
                                            >
                                                {getFieldDecorator(
                                                    'moveEmployeeId',
                                                    {
                                                        initialValue:
                                                            editInfoData.id
                                                    }
                                                )(
                                                    <Input
                                                        placeholder=""
                                                        disabled
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="异动类型"
                                            >
                                                {getFieldDecorator('moveType', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入异动类型!'
                                                        }
                                                    ]
                                                })(
                                                    <Select
                                                        onChange={function (e) {
                                                            _this.changeState({
                                                                moveType: e
                                                            })
                                                            _this.props.form.resetFields(
                                                                [
                                                                    'handoverEmployeeTel',
                                                                    'handoverEmployeeName'
                                                                ]
                                                            )
                                                        }}
                                                    >
                                                        <Option value="1">
                                                            离职
                                                        </Option>
                                                        <Option value="2">
                                                            待分配
                                                        </Option>
                                                        <Option value="3">
                                                            岗位调动
                                                        </Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="异动员工"
                                            >
                                                {getFieldDecorator(
                                                    'moveEmployeeRealName',
                                                    {
                                                        initialValue:
                                                            editInfoData.realName
                                                    }
                                                )(
                                                    <Input
                                                        placeholder=""
                                                        disabled
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="原部门"
                                            >
                                                {editInfoData.organizationPositionViews.map(
                                                    (item, index) => {
                                                        return (
                                                            <div
                                                                className="form-div-inline"
                                                                key={`form-inline-${index}`}
                                                            >
                                                                <FormItem>
                                                                    {getFieldDecorator(
                                                                        `organizations[${index}]`,
                                                                        {
                                                                            initialValue:
                                                                                item.deptName
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            placeholder=""
                                                                            disabled
                                                                            style={{
                                                                                width: 220
                                                                            }}
                                                                        />
                                                                    )}
                                                                </FormItem>
                                                                <FormItem>
                                                                    {getFieldDecorator(
                                                                        `positions[${index}]`,
                                                                        {
                                                                            initialValue:
                                                                                item.posName
                                                                        }
                                                                    )(
                                                                        <Input
                                                                            placeholder=""
                                                                            disabled
                                                                        />
                                                                    )}
                                                                </FormItem>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </FormItem>
                                            {moveType === '3' && (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="现部门"
                                                >
                                                    {newOrganizations.map(
                                                        (item, index) => {
                                                            return (
                                                                <div
                                                                    className="form-div-inline"
                                                                    key={`form-inline-initOfficeData-${
                                                                        item.id
                                                                    }`}
                                                                >
                                                                    <FormItem>
                                                                        {getFieldDecorator(
                                                                            `userOrganizationPositions[${index}]['organizationId']`,
                                                                            {
                                                                                initialValue:
                                                                                    item.currentDepartment
                                                                            }
                                                                        )(
                                                                            <Cascader
                                                                                options={
                                                                                    organizationData
                                                                                }
                                                                                placeholder="请选择"
                                                                                changeOnSelect
                                                                                style={{
                                                                                    width: 220
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </FormItem>
                                                                    <FormItem>
                                                                        {getFieldDecorator(
                                                                            `userOrganizationPositions[${index}]['positionId']`,
                                                                            {
                                                                                initialValue:
                                                                                    item.currentPosition
                                                                                // getValueFromEvent: this.getValueFromEvent
                                                                            }
                                                                        )(
                                                                            <Select
                                                                                placeholder="请选择"
                                                                                className="minw100"
                                                                                onChange={function (
                                                                                    value
                                                                                ) {
                                                                                    _this.setState(
                                                                                        {
                                                                                            currentPosition: value
                                                                                        },
                                                                                        () => {
                                                                                            let newOrganizations =
                                                                                                _this
                                                                                                    .state
                                                                                                    .newOrganizations
                                                                                            newOrganizations = newOrganizations.map(
                                                                                                i => {
                                                                                                    return {
                                                                                                        id:
                                                                                                            i.id,
                                                                                                        currentDepartment:
                                                                                                            i.currentDepartment,
                                                                                                        currentPosition: value
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                            _this.setState(
                                                                                                {
                                                                                                    newOrganizations
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }}
                                                                                // onChange={this.getValueFromEvent}
                                                                            >
                                                                                {this.renderpositionOption()}
                                                                            </Select>
                                                                        )}
                                                                    </FormItem>
                                                                    <Icon
                                                                        type="delete"
                                                                        theme="outlined"
                                                                        onClick={function () {
                                                                            _this.removeChild(
                                                                                item,
                                                                                index
                                                                            )
                                                                        }}
                                                                    />
                                                                    <FormItem
                                                                        style={{
                                                                            display:
                                                                                'none'
                                                                        }}
                                                                    >
                                                                        {getFieldDecorator(
                                                                            `userOrganizationPositions[${index}]['userId']`,
                                                                            {
                                                                                initialValue:
                                                                                    editInfoData.userId
                                                                            }
                                                                        )(
                                                                            <Input
                                                                                placeholder=""
                                                                                disabled
                                                                            />
                                                                        )}
                                                                    </FormItem>
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                    <Button
                                                        onClick={
                                                            this
                                                                .addOrganizations
                                                        }
                                                    >
                                                        增加工作岗位
                                                    </Button>
                                                </FormItem>
                                            )}
                                            {moveType === '1' && (
                                                <Row
                                                    key={`moveType-${moveType}`}
                                                >
                                                    <Col span={6}>
                                                        <FormItem
                                                            {...formItemLayoutUser1}
                                                            label="交接员工"
                                                        />
                                                    </Col>
                                                    <Col span={7}>
                                                        <FormItem>
                                                            {getFieldDecorator(
                                                                'handoverEmployeeTel',
                                                                {
                                                                    rules: [
                                                                        {
                                                                            // required: ,
                                                                            message:
                                                                                '请输入员工手机号！'
                                                                        }
                                                                    ]
                                                                }
                                                            )(
                                                                <Search
                                                                    placeholder="请输入手机号"
                                                                    maxLength="11"
                                                                    onSearch={function (
                                                                        value
                                                                    ) {
                                                                        _this.searchEmployee(
                                                                            value
                                                                        )
                                                                    }}
                                                                    enterButton
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={8} push={1}>
                                                        <FormItem>
                                                            {getFieldDecorator(
                                                                'handoverEmployeeName',
                                                                {
                                                                    rules: [
                                                                        {
                                                                            // required: moveType === "1",
                                                                            message:
                                                                                '请先输入员工手机号！'
                                                                        }
                                                                    ]
                                                                }
                                                            )(
                                                                <Input
                                                                    placeholder="交接员工姓名"
                                                                    disabled
                                                                />
                                                            )}
                                                        </FormItem>
                                                        <FormItem
                                                            style={{
                                                                display: 'none'
                                                            }}
                                                        >
                                                            {getFieldDecorator(
                                                                'handoverEmployeeId',
                                                                {}
                                                            )(
                                                                <Input
                                                                    placeholder=""
                                                                    disabled
                                                                />
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            )}
                                            {moveType === '1' &&
                                                positionViews && (
                                                    <Row>
                                                        <Col span={15} push={6}>
                                                            <p
                                                                style={{
                                                                    color:
                                                                        'red',
                                                                    fontSize:
                                                                        '12px',
                                                                    lineHeight:
                                                                        '1.6'
                                                                }}
                                                            >
                                                                注：交接人员会承接离职员工的职务、权限、房源等；若交接人员无公司手机号，则也会承接离职员工的公司手机号；请谨慎填写
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                )}
                                            {moveType === '1' &&
                                                positionViews && (
                                                    <FormItem
                                                        {...formItemLayout}
                                                        label="奖金起记月份	"
                                                        key={`bonusBeginMonth-${handoverEmployeeId}`}
                                                    >
                                                        {getFieldDecorator(
                                                            'bonusBeginMonth',
                                                            {
                                                                rules: [
                                                                    {
                                                                        required:
                                                                            handoverEmployeeId >
                                                                            0,
                                                                        message:
                                                                            '请选择奖金起记月份!'
                                                                    }
                                                                ]
                                                            }
                                                        )(
                                                            <RadioGroup>
                                                                <RadioButton value="0">
                                                                    当月
                                                                </RadioButton>
                                                                <RadioButton value="1">
                                                                    次月
                                                                </RadioButton>
                                                            </RadioGroup>
                                                        )}
                                                    </FormItem>
                                                )}
                                            {moveType === '1' && (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="离职提出时间	"
                                                >
                                                    {getFieldDecorator(
                                                        'raiseLeaveTime',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    type:
                                                                        'object',
                                                                    message:
                                                                        '请选择离职提出时间!'
                                                                }
                                                            ]
                                                        }
                                                    )(<DatePicker />)}
                                                </FormItem>
                                            )}
                                            {moveType === '1' && (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="正式离职时间"
                                                >
                                                    {getFieldDecorator(
                                                        'leaveTime',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    type:
                                                                        'object',
                                                                    message:
                                                                        '请选择正式离职时间!'
                                                                }
                                                            ]
                                                        }
                                                    )(<DatePicker />)}
                                                </FormItem>
                                            )}
                                            <FormItem
                                                {...formItemLayout}
                                                label="异动原因"
                                            >
                                                {getFieldDecorator(
                                                    'moveCause',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请填写异动原因!'
                                                            }
                                                        ]
                                                    }
                                                )(<TextArea rows={4} />)}
                                            </FormItem>
                                        </Form>
                                    </TabPane>
                                    <TabPane tab="日志" key="3">
                                        <div className="mb20">
                                            异动人员：{' '}
                                            <Input
                                                placeholder=""
                                                disabled
                                                className="w100"
                                                value={editInfoData.realName}
                                            />
                                        </div>
                                        <SubTable {...subTableItem} />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Modal>
                    )}
            </div>
        )
    }
}

let NewincumbentModal = Form.create()(IncumbentModal)
export default connect(mapStateToProps)(NewincumbentModal)
