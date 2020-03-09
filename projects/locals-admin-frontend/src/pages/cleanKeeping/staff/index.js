import React, {Component} from 'react'
import SubTable from '../../../components/subTable/index'
import {cleanKeepingService} from '../../../services/index'
import {Input, Form, Modal, DatePicker} from 'antd'
import Search from '../../../components/search/index'
import {cleanKeeping} from '../../../utils/dictionary'
import BuAreaTreeSelect from '../../../components/buAreaTreeSelect'
import {houseSettingService} from "../../../services";
import {dataFormat} from "../../../utils/utils";
import {message} from "antd/lib/index";
import {searchObjectSwitchArray} from "../../../utils/utils";

const FormItem = Form.Item
let searchConfig = {
    items: [

        {
            type: 'text',
            name: '姓名',
            key: 'cleanerName',
            searchFilterType: 'string',
            placeholder: '请输入姓名'
        },{
            type: 'text',
            name: '手机号码',
            key: 'cleanerPhone',
            searchFilterType: 'string',
            placeholder: '请输入手机号码'
        },{
            type: 'text',
            name: '公司名称',
            key: 'companyName',
            searchFilterType: 'string',
            placeholder: '请输入公司名称'
        },{
            type: 'select',
            name: '实名认证状态',
            key: 'verifiedStatus',
            searchFilterType: 'select',
            selectData: searchObjectSwitchArray(cleanKeeping.verifiedStatusList),
            placeholder: '请选择实名认证状态'
        },{
            type: 'select',
            name: '技能认证状态',
            key: 'skillVerificationStatus',
            selectData: searchObjectSwitchArray(cleanKeeping.staffVerificationStatus),
            searchFilterType: 'select',
            placeholder: '请选择技能认证状态'
        }
    ]
}
class CleanKeepingStaffList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isRepeat: false,
            skillVerificationVisible: false,
            cleanerId: '',
            searchFields: {},
            buUserInfo: {}
        }
    }

    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                cleanerName: searchFields.cleanerName.value,
                cleanerPhone: searchFields.cleanerPhone.value,
                companyName: searchFields.companyName.value,
                verifiedStatus: searchFields.verifiedStatus.value,
                skillVerificationStatus: searchFields.skillVerificationStatus.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleSkillVerificationCancel = () => {
        this.setState({
            skillVerificationVisible: false
        })
    }

    handleSkillVerificationOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({isRepeat: true})
                let params = {
                    cleanerId: this.state.cleanerId,
                    auditDate: dataFormat(values.auditDate, 'YYYY-MM-DD HH:DD:SS'),
                    buUserId: this.state.buUserInfo.id,
                    buName: this.state.buUserInfo.realName
                }
                cleanKeepingService.auditStaffCleaner(params).then(res => {
                    if(!!res) {
                        message.success('修改成功！')
                    }
                    this.setState({isRepeat: false, skillVerificationVisible: false})
                }).catch(err => {
                    this.setState({isRepeat: false})
                    message.error('修改失败！')
                })
            }
        })
    }

    //获取BU总管信息
    getBuUserInfo = (buId) => {
        if(!!buId) {
            houseSettingService.fetchPositions({
            }).then((res) => {
                let positionInfo = {} //职位信息
                res.list.forEach(item => {
                    if(item.name === 'BU') {
                        positionInfo = item
                    }
                })

                //根据职位ID获取BU总管
                houseSettingService.fetchHouseRoleUser({
                    positionId: positionInfo.id,
                    organizationId: buId
                }).then((res) => {
                    if(res.list !== null && res.list.length > 0) {
                        this.setState({buUserInfo: res.list[res.list.length - 1]})
                    }else{
                        this.setState({
                            buUserInfo: {
                                realName: '当前BU没有BU总管'
                            }
                        })
                    }
                })

            })
        }

    }

    render () {
        let that = this
        const columns = [
            {title: '姓名', dataIndex: 'realName', width: 100},
            {title: '手机号', dataIndex: 'phone', width: 150},
            {title: '身份证', dataIndex: 'idCardNumber', width: 200},
            {title: '归属公司', dataIndex: 'companyResult', width: 150, render: (val, record) => {
                return (
                    <span>{!!record.companyResult ? record.companyResult.companyName : ''}</span>
                )
            }},
            {title: '地址', dataIndex: 'provinceName', width: 200, render: (val, record) => {
                return <span>{record.provinceName}{record.cityName}{record.districtName}</span>
            }},
            {title: '服务区域', dataIndex: 'districtStreets', width: 150},
            {title: '身份认证', dataIndex: 'verifiedStatus', width: 100, render: val => {
                    return (
                        <span>{cleanKeeping.verifiedStatusList[val]}</span>
                    )
                }},
            {title: '技能认证', dataIndex: 'skillVerificationStatus', width: 150, render: val => {
                return (
                    <span>{cleanKeeping.staffVerificationStatus[val]}</span>
                )
            }},
            {title: '操作人', dataIndex: 'updator', width: 150},
            {title: '账号状态', dataIndex: 'accountStatus', width: 150, render: val => {
                return (
                    <span>{cleanKeeping.accountStatus[val]}</span>
                )
            }}
        ];
        const subTableItem = {
            getTableService: cleanKeepingService.getStaffTable,
            searchFields: this.state.searchFields,
            columns: columns,
            refsTab: function (ref) {
                that.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id",
            operatBtn: [{
                label: 'confirm',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                confirmTitle: '锁定账号',
                successMessage: '锁定成功！',
                visible: record => {return record.accountStatus !== 2},
                onClick: record => {
                    return cleanKeepingService.updateStaffStatus({cleanerId: record.id, type: 2})
                },
                text: '锁定账号'
            },{
                label: 'confirm',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                confirmTitle: '解锁账号',
                successMessage: '解锁成功！',
                visible: record => {return record.accountStatus === 2},
                onClick: record => {
                    return cleanKeepingService.updateStaffStatus({cleanerId: record.id, type: 1})
                },
                text: '解锁账号'
            },{
                label: 'confirm',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                confirmTitle: '禁用账号',
                successMessage: '禁用成功！',
                visible: record => {return record.accountStatus === 1},
                onClick: record => {
                    return cleanKeepingService.updateStaffStatus({cleanerId: record.id, type: 3})
                },
                text: '禁用账号'
            },{
                label: 'confirm',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                confirmTitle: '启用账号',
                successMessage: '启用成功！',
                visible: record => {return record.accountStatus === 3},
                onClick: record => {
                    return cleanKeepingService.updateStaffStatus({cleanerId: record.id, type: 1})
                },
                text: '启用账号'
            },{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                visible: record => { return record.skillVerificationStatus === 0 },
                onClick: record => {
                    if(record.verifiedStatus === 0 || record.verifiedStatus === 1) {
                        message.warning('员工身份未审批，不可进行技能认证！')
                        return ;
                    }
                    if(record.verifiedStatus === 3) {
                        message.warning('员工身份审批不通过，不可进行技能认证！')
                        return ;
                    }
                    that.setState({
                        skillVerificationVisible: true,
                        cleanerId: record.id
                    })
                },
                text: '技能认证'
            }],
            operatBtnFixed: 'right',
            operatBtnWidth: 150
        }
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
        const { getFieldDecorator } = this.props.form
        const { skillVerificationVisible, buUserInfo } = this.state
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    skillVerificationVisible ? (
                        <Modal
                            title="技能认证"
                            visible
                            width={600}
                            confirmLoading={this.state.isRepeat}
                            onOk={this.handleSkillVerificationOk}
                            onCancel={this.handleSkillVerificationCancel}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="技能培训日期"
                                >
                                    {getFieldDecorator('auditDate', {
                                        initialValue: undefined,
                                        rule: [
                                            { required: true, message: '请选择培训日期' }

                                        ]
                                    })(
                                        <DatePicker />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="BU"
                                >
                                    {getFieldDecorator('buId', {
                                        initialValue: ''
                                    })(
                                        <BuAreaTreeSelect onChange={function (areaId,buId) {
                                            that.getBuUserInfo(buId)
                                        }}
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="培训负责人"
                                >
                                    <Input value={buUserInfo.realName} disabled />
                                </FormItem>
                            </Form>
                        </Modal>
                    ) : null
                }
            </div>
        )
    }
}

CleanKeepingStaffList = Form.create()(CleanKeepingStaffList)
export default CleanKeepingStaffList
