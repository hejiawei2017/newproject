import React, {Component} from 'react'
import SubTable from '../../../components/subTable/index'
import {cleanKeepingService} from '../../../services/index'
import {Input, Form, Modal, Radio, Row, Col} from 'antd'
import Search from '../../../components/search/index'
import {cleanKeeping} from '../../../utils/dictionary'
import {createUUID} from "../../../utils/utils";
import {message} from "antd/lib/index";
import UploadImage from '../../../components/uploadImage'

import './index.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
let searchConfig = {
    items: [

        {
            type: 'text',
            name: '负责人姓名',
            key: 'principalNameLike',
            searchFilterType: 'string',
            placeholder: '请输入姓名'
        },{
            type: 'text',
            name: '负责人手机号',
            key: 'principalPhoneLike',
            searchFilterType: 'string',
            placeholder: '请输入手机号码'
        },{
            type: 'text',
            name: '公司名称',
            key: 'companyNameLike',
            searchFilterType: 'string',
            placeholder: '请输入公司名称'
        },{
            type: 'text',
            name:  '输入城市名称',
            key: 'cityName',
            searchFilterType: 'string',
            placeholder: '请输入公司名称'
        }
    ]
}
class CleanKeepingCorporationList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isRepeat: false,
            skillVerificationVisible: false,
            detailVisible: false,
            companyId: '',
            searchFields: {},
            buUserInfo: {},
            companyInfo: {},
            corporationImageList: []
        }
    }

    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                principalNameLike: searchFields.principalNameLike.value,
                principalPhoneLike: searchFields.principalPhoneLike.value,
                companyNameLike: searchFields.companyNameLike.value,
                cityName: searchFields.cityName.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }

    // 获取公司资格认证图片
    getComtractImage = () => {
        let arr = [];
        cleanKeepingService.getCorporationImage(this.state.companyId).then(res => {
            res && res.forEach(item => {
                arr.push({
                    uid: createUUID(),
                    url: item
                });
            })
            this.setState({
                corporationImageList: arr
            })
        }).catch(err => {
            this.setState({
                corporationImageList: arr
            })
        })
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
                    companyId: this.state.companyId,
                    auditStatus: values.auditStatus,
                    reason: values.auditStatus === 2 ? values.reason : undefined
                }
                cleanKeepingService.auditCorporation(params).then(res => {
                    if(!!res) {
                        message.success('审批成功！')
                    }
                    this.setState({
                        isRepeat: false,
                        skillVerificationVisible: false
                    }, this.renderTable)
                }).catch(err => {
                    this.setState({isRepeat: false})
                })
            }
        })
    }

    render () {
        let that = this
        const columns = [
            {title: '公司名称', dataIndex: 'companyName', width: 150},
            {title: '省份', dataIndex: 'provinceName', width: 150},
            {title: '城市', dataIndex: 'cityName', width: 150},
            {title: '负责人姓名', dataIndex: 'principalName', width: 150},
            {title: '手机号码', dataIndex: 'principalPhone', width: 150},
            {title: '关联保洁人员', dataIndex: 'cleanerCount', width: 150},
            {title: '资格认证', dataIndex: 'certificationStatus', width: 150, render: val => {
                    return (
                        <span>{cleanKeeping.skillVerificationStatus[val]}</span>
                    )
                }},
            {title: '企业码', dataIndex: 'companyCode', width: 150},
            {title: '账号状态', dataIndex: 'accountStatus', width: 150 ,render: val => {
                return (
                    <span>{cleanKeeping.accountStatus[val]}</span>
                )
            }}
        ];
        const subTableItem = {
            getTableService: cleanKeepingService.getCorporationTable,
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
                confirmTitle: '禁用账号',
                successMessage: '禁用成功！',
                visible: record => {return record.accountStatus === 1},
                onClick: record => {
                    return cleanKeepingService.updateCorporationStatus({companyId: record.id, type: 3})
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
                    return cleanKeepingService.updateCorporationStatus({companyId: record.id, type: 1})
                },
                text: '启用账号'
            },{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                visible: record => {return record.certificationStatus === 1},
                onClick: record => {
                    that.setState({
                        skillVerificationVisible: true,
                        companyId: record.id
                    }, () => {
                        this.getComtractImage()
                    })
                },
                text: '资格认证'
            },{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    that.setState({
                        detailVisible: true,
                        companyId: record.id,
                        companyInfo: record
                    }, () => {
                        this.getComtractImage()
                    })
                },
                text: '详情'
            }],
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
        const { skillVerificationVisible, detailVisible, companyInfo } = this.state
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    skillVerificationVisible ? (
                        <Modal
                            title="资格认证"
                            visible
                            width={600}
                            confirmLoading={this.state.isRepeat}
                            onOk={this.handleSkillVerificationOk}
                            onCancel={this.handleSkillVerificationCancel}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="合同照片"
                                >
                                    <UploadImage
                                        imageUrlList={this.state.corporationImageList}
                                        imageLength={0}
                                        disabled
                                        disabledRemove
                                        getImageInfo={function (fileList) {

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="审批结果"
                                >
                                    {getFieldDecorator('auditStatus', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '审批状态不能为空' }]
                                    })(
                                        <RadioGroup>
                                            <Radio value={1}>通过</Radio>
                                            <Radio value={2}>不通过</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {
                                    this.props.form.getFieldValue('auditStatus') === 2 ?
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
                                            {getFieldDecorator('reason', {
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
                    title="公司详情"
                    className="hideModel-okBtn"
                    visible
                    width={600}
                    onCancel={function () {
                        that.setState({detailVisible: false})
                    }}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="公司名称"
                        >
                            {companyInfo.companyName}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="负责人姓名"
                        >
                            {companyInfo.principalName}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机号码"
                        >
                            {companyInfo.principalPhone}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="合同照片"
                        >
                            <UploadImage
                                imageUrlList={this.state.corporationImageList}
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

CleanKeepingCorporationList = Form.create()(CleanKeepingCorporationList)
export default CleanKeepingCorporationList
