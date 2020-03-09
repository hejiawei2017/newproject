import React, {Component} from 'react'
import SubTable from '../../../components/subTable/index'
import {cleanKeepingService} from '../../../services/index'
import {Input, Form, Modal, Radio, Row, Col} from 'antd'
import {cleanKeeping} from '../../../utils/dictionary'
import Search from '../../../components/search/index'
import {message} from "antd/lib/index";
import './index.less'
import {searchObjectSwitchArray, createUUID} from "../../../utils/utils";
import UploadImage from '../../../components/uploadImage'


const FormItem = Form.Item
const RadioGroup = Radio.Group

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
        },
        {
            type: 'select',
            name: '审批状态',
            key: 'auditStatus',
            selectData: searchObjectSwitchArray(cleanKeeping.workflowStatus),
            searchFilterType: 'select',
            placeholder: '请选择审批状态'
        },{
            type: 'text',
            name: '公司名称',
            key: 'companyName',
            searchFilterType: 'string',
            placeholder: '请输入公司名称'
        }
    ]
}
class CleanKeepingStaffAuditList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isRepeat: false,
            skillVerificationVisible: false,
            detailVisible: false,
            searchFields: {},
            staffAuditInfo: {},
            staffImageList: []
        }

    }

    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                cleanerName: searchFields.cleanerName.value,
                cleanerPhone: searchFields.cleanerPhone.value,
                companyName: searchFields.companyName.value,
                auditStatus: searchFields.auditStatus.value,
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
                this.setState({isRepeat: true});
                let params = {
                    userId: this.state.staffAuditInfo.userId,
                    checkStatus: values.checkStatus,
                    verifiedRejectReason: values.verifiedRejectReason || '审核通过'
                }
                cleanKeepingService.updateStaffAudit(params).then(res => {
                    if(!!res) {
                        message.success('审批成功！')
                    }
                    this.setState({isRepeat: false, skillVerificationVisible: false});
                    this.renderTable();
                }).catch(err => {
                    this.setState({isRepeat: false})
                    message.error('审批失败！')
                })
            }
        })
    }
    getCardImage = (record) => {
        let arr = [];
        const that = this;
        cleanKeepingService.getStaffIdCardImage(record.cleanerId).then(res => {

            res && res.forEach(item => {
                arr.push({
                    uid: createUUID(),
                    url: item
                });
            })
            that.setState({
                staffAuditInfo: record,
                staffImageList: arr
            })
        }).catch(err => {
            that.setState({
                staffImageList: arr
            })
        })
    }

    render () {
        let that = this;
        const columns = [
            {title: '姓名', dataIndex: 'name', width: 100},
            {title: '手机号', dataIndex: 'phone', width: 150},
            {title: '身份证', dataIndex: 'idCardNumber', width: 200},
            {title: '归属公司', dataIndex: 'companyName', width: 150},
            {title: '地址', dataIndex: 'provinceName', width: 200, render: (val, record) => {
                return <span>{record.provinceName}{record.cityName}{record.districtName}</span>
            }},
            {title: '服务区域', dataIndex: 'cleanerDistrictStreet', width: 150},
            {title: '审批状态', dataIndex: 'auditStatus', width: 150, render: val => {
                    return (
                        <span>{cleanKeeping.workflowStatus[val]}</span>
                    )
                }},
            {title: '实名认证状态', dataIndex: 'verifiedStatus', width: 150, render: val => {
                return (
                    <span>{cleanKeeping.verifiedStatusList[val]}</span>
                )
            }}
        ];
        const subTableItem = {
            getTableService: cleanKeepingService.getStaffAuditTable,
            searchFields: this.state.searchFields,
            columns: columns,
            refsTab: function (ref) {
                that.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "cleanerId",
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                visible: record => {return (record.verifiedStatus === 0 || record.verifiedStatus === 1)},
                onClick: record => {
                    if(record.verifiedStatus === 0) {
                        message.warning('该员工未上传身份证照片，不可审批！');
                        return;
                    }
                    that.getCardImage(record);
                    that.setState({skillVerificationVisible: true})
                },
                text: '审批'
            },{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    that.getCardImage(record);
                    that.setState({detailVisible: true})
                },
                text: '详情'
            }],
            operatBtnFixed: 'right',
            operatBtnWidth: 100
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
        const { skillVerificationVisible, staffAuditInfo, detailVisible } = this.state
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    skillVerificationVisible ? (
                        <Modal
                            title="认证审批"
                            visible
                            width={600}
                            confirmLoading={this.state.isRepeat}
                            onOk={this.handleSkillVerificationOk}
                            onCancel={this.handleSkillVerificationCancel}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                >
                                    {staffAuditInfo.name}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号码"
                                >
                                    {staffAuditInfo.idCardNumber}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证照片"
                                >
                                    <UploadImage
                                        imageUrlList={this.state.staffImageList}
                                        imageLength={0}
                                        disabled
                                        disabledRemove
                                        getImageInfo={function (fileList) {

                                         }}
                                    />

                                </FormItem>
                                <FormItem
                                    {...{
                                        labelCol: {
                                            xs: { span: 24 },
                                            sm: { span: 3 }
                                        },
                                        wrapperCol: {
                                            xs: { span: 24 },
                                            sm: { span: 15 }
                                        }
                                    }}
                                    label="审批结果"
                                >
                                    {getFieldDecorator('checkStatus', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '审批状态不能为空' }]
                                    })(
                                        <RadioGroup>
                                            <Radio value={1}>通过</Radio>
                                            <Radio value={0}>不通过</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {
                                    this.props.form.getFieldValue('checkStatus') === 0 ?
                                        <FormItem
                                            {...{
                                                labelCol: {
                                                    xs: { span: 24 },
                                                    sm: { span: 3 }
                                                },
                                                wrapperCol: {
                                                    xs: { span: 24 },
                                                    sm: { span: 15 }
                                                }
                                            }}
                                            label="审批意见"
                                        >
                                            {getFieldDecorator('verifiedRejectReason', {
                                                initialValue: '',
                                                rules: [{ required: true, message: '审批意见不能为空' }]
                                            })(
                                                <Input placeholder="请填写不通过原因" />
                                            )}
                                        </FormItem> : null
                                }

                            </Form>
                        </Modal>
                    ) : null
                }
                {
                    detailVisible ? (
                        <Modal
                            title="认证详情"
                            visible
                            width={600}
                            className="hideModel-okBtn"
                            onCancel={function () {
                                that.setState({
                                    detailVisible: false
                                })
                            }}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                >
                                    {staffAuditInfo.name}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证号码"
                                >
                                    {staffAuditInfo.idCardNumber}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="身份证照片"
                                >
                                    <UploadImage
                                        imageUrlList={this.state.staffImageList}
                                        imageLength={0}
                                        disabled
                                        disabledRemove
                                        getImageInfo={function (fileList) {

                                        }}
                                    />

                                </FormItem>
                            </Form>
                        </Modal>
                    ) : null
                }
            </div>
        )
    }
}

CleanKeepingStaffAuditList = Form.create()(CleanKeepingStaffAuditList)
export default CleanKeepingStaffAuditList
