import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {houseSettingService} from '../../services'
import { Row, Col, Modal, Form, Select, Button, Radio } from 'antd'
import Search from '../../components/search'
import {searchObjectSwitchArray} from "../../utils/utils"
import {message} from "antd/lib/index";
import {houseManageSearch} from "../../utils/dictionary"
import EditModal from './editModal'
import LogModal from './logModal'
import ComponentTreeSelect from '../../components/buAreaTreeSelect/index'
import './index.less'


const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class HouseSettingList extends Component {
    constructor () {
        super ()
        this.state = {
            searchConfig: {
                items: [
                    {
                        type: 'text',
                        name: '房源编码',
                        key: 'houseNo',
                        searchFilterType: 'string',
                        placeholder: '请输入房源编码'
                    },
                    {
                        type: 'multiple-select',
                        name: '上线状态',
                        key: 'houseWorkflowStatus',
                        selectData: searchObjectSwitchArray(houseManageSearch.houseStatus),
                        renderSelectData: houseManageSearch.houseStatus,
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择上线状态'
                    },
                    {
                        type: 'selectAreaBu',
                        name: '大区/BU',
                        key: 'areaName',
                        searchFilterType: 'string',
                        placeholder: '请选择大区/BU'
                    },

                    {
                        type: 'text',
                        name: 'BU总管',
                        key: 'buUser',
                        searchFilterType: 'string',
                        placeholder: '请输入姓名或手机号'
                    },
                    {
                        type: 'text',
                        name: '管家姓名',
                        key: 'assistUser',
                        searchFilterType: 'string',
                        placeholder: '请输入姓名或手机号'
                    },
                    {
                        type: 'text',
                        name: '副管家手机号',
                        key: 'associateAssistUser',
                        searchFilterType: 'string',
                        placeholder: '请输入副管家手机号'
                    }
                ]
            },
            editModalVisible: false,
            logModalVisible: false,
            batchEditBuVisible: false,
            batchEditAssistVisible: false,
            loading: false,
            loadingStatus: false,
            searchFields: {},
            houseInfo: {},
            formerBuList: [],
            nowBuList: [],
            batchBuForm: {}, //批量BU表单
            batchAssistForm: {}, //批量管家表单
            assistantBuList: [], //设置管家模块下的bu数据
            mainAssistantList: [],
            awardMonth: ''
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields: {
                houseNo: searchFields.houseNo.value,
                houseWorkflowStatus: !!searchFields.houseWorkflowStatus.value ? searchFields.houseWorkflowStatus.value.join(',') : undefined,
                areaName: !!searchFields.areaName.value.length > 0 ? searchFields.areaName.value[searchFields.areaName.value.length - 1] : undefined,
                buUser: searchFields.buUser.value,
                assistUser: searchFields.assistUser.value,
                associateAssistUser: searchFields.associateAssistUser.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    handleSubmit = () => {
        this.stateChange({
            editModalVisible: false
        }, this.renderTable)
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleBatchBuShow = () => {
        this.setState({
            batchEditBuVisible: !this.state.batchEditBuVisible
        })
    }

    //根据bu获取管家集合
    getMainAssistantInfo = (buId) => {
        houseSettingService.fetchPositions({}).then((res) => {
            let assistantInfo = {}
            res.list.forEach(item => {
                if(item.name === '助理') {
                    assistantInfo = item
                }
            })

            //获取管家
            houseSettingService.fetchHouseRoleUser({
                positionId: assistantInfo.id,
                organizationId: buId,
                pageSize: 100
            }).then((res) => {
                if(res !== null) {
                    this.props.form.setFieldsValue({formerAssistantId: undefined, nowAssistantId: undefined})
                    //如果管家没有设置手机号时，不展示管家数据
                    const mainAssistantList = res.list.filter(item => {
                        return !!item.comMobile
                    })
                    this.setState({
                        loadingStatus:false,
                        mainAssistantList
                    })
                }
            }).catch(()=>{
                this.setState({
                    loadingStatus:false
                })
            })
        })
    }
    handleRefreshSystem = () => {
        houseSettingService.fetchRefreshSystem().then((res) => {
            if(!!res) {
                setTimeout(() => {
                    message.success('刷新成功！')
                    this.renderTable()
                }, 2000)

            }
        })
    }
    handleBatchAssistShow = () => {
        this.setState({
            batchEditAssistVisible: !this.state.batchEditAssistVisible
        })
    }
    handleSubmitBatchEditBu = () => {
        let { batchBuForm } = this.state
        let params = batchBuForm
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true })
                houseSettingService.fetchBatchEditHouseBu(params).then((res) => {
                    if(!!res) {
                        message.success('批量修改成功！')
                        batchBuForm = {}
                        setTimeout(() => {
                            this.stateChange({
                                loading: false,
                                batchEditBuVisible: false,
                                batchBuForm
                            },this.renderTable)
                        }, 2000)
                    }else{
                        this.stateChange({ loading: false })
                    }
                }).catch(e => {
                    this.stateChange({ loading: false })
                })
            }
        })

    }

    render () {
        let that = this
        let { areaList, houseInfo, batchBuForm, batchAssistForm, mainAssistantList, awardMonth, loadingStatus } = this.state
        const columns = [
            {title: '房源编号', dataIndex: 'houseNo', width: 150},
            {title: '房源地址', dataIndex: 'address', width: 150},
            {title: '大区', dataIndex: 'areaName', width: 150},
            {title: '上线状态', dataIndex: 'houseWorkflowStatus', width: 150, render: val => {
                return (
                    <div>
                        {houseManageSearch.houseStatus[val]}
                    </div>
                )
            }},
            {title: 'BU', dataIndex: 'buAreaName', width: 150},
            {title: 'BU总管(私人手机)-公司手机', dataIndex: 'buUserName', width: 250, render: (val,record) => {

                return (
                    <div>
                        {val}
                        {!!record.buUserPhone ? '(' + record.buUserPhone + ')' : ''}
                        {!!record.buUserCompanyPhone ? '-' + record.buUserCompanyPhone : ''}
                    </div>
                )
            }},
            {title: '管家(私人手机)-公司手机', dataIndex: 'assistUserName', width: 250, render: (val,record) => {
                return (
                    <div>
                        {val}
                        {!!record.assistUserPhone ? '(' + record.assistUserPhone + ')' : ''}
                        {!!record.assistUserCompanyPhone ? '-' + record.assistUserCompanyPhone : ''}
                    </div>
                )
            }},

            {title: '副管家-私人手机', dataIndex: 'associateAssistUsers', width: 250, render: function (val, record) {
                let arr = []
                if(record.associateAssistUsers !== null) {
                    arr = record.associateAssistUsers
                }
                return (
                    arr.map(item => {
                        return <div key={'phone_' + item.associateAssistUserPhone}>{item.associateAssistUserName}-{item.associateAssistUserPhone}</div>
                    })
                )
            }}
        ]
        const subTableItem = {
            getTableService: houseSettingService.getTable,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "houseId",
            searchFields: this.state.searchFields,
            antdTableProps: {
                bordered: true
            },
            pageSize: 30,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    let thenAssistantList = []
                    if(record.associateAssistUsers !== null) {
                        record.associateAssistUsers.forEach((item,index) => {
                            thenAssistantList.push({
                                userId: item.associateAssistUserId,
                                name: item.associateAssistUserName,
                                code: item.associateAssistUserId,
                                mobile: item.associateAssistUserPhone,
                                index: 'assistantIndex_' + index
                            })
                        })
                    }
                    that.setState({
                        editModalVisible: true,
                        houseInfo: {
                            houseSourceId: record.houseId,
                            houseNo: record.houseNo,
                            houseWorkflowStatus: record.houseWorkflowStatus,
                            areaId: record.areaId || '',
                            buId: record.buAreaId || '',
                            buUserId: record.buUserId || '',
                            mainAssistantId: record.assistUserId || '',
                            thenAssistantList: thenAssistantList
                        }
                    })
                },
                text: '编辑'
            },
            {
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    that.setState({
                        logModalVisible: true,
                        houseInfo: {
                            houseSourceId: record.houseId,
                            houseNo: record.houseNo
                        }
                    })
                },
                text: '查看日志'
             }],
            operatBtnWidth: 120,
            operatBtnFixed: 'right',
            scroll: {
                x: 1720
            }
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 }
            }
        }

        const formItemStatus = loadingStatus ? {
            hasFeedback: true,
            validateStatus: 'validating'
        } : {}

        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Search onSubmit={this.onSearch} config={this.state.searchConfig} />
                <div className="house-setting-btn-group">
                    <Button onClick={this.handleRefreshSystem} type="primary">刷新系统</Button>
                    <Button onClick={this.handleBatchBuShow} type="primary">批量修改BU</Button>
                    <Button onClick={this.handleBatchAssistShow} type="primary">批量修改管家</Button>
                </div>

                <SubTable
                    {...subTableItem}
                />
                {this.state.editModalVisible ?
                    <EditModal
                        editModalVisible={this.state.editModalVisible}
                        stateChange={this.stateChange}
                        handleSubmit={this.handleSubmit}
                        houseInfo={houseInfo}
                    /> : null
                }
                {this.state.logModalVisible ?
                    <LogModal
                        logModalVisible={this.state.logModalVisible}
                        houseSourceId={houseInfo.houseSourceId}
                        stateChange={this.stateChange}
                    /> : null
                }
                {this.state.batchEditBuVisible ?
                    <Modal
                    visible
                    onOk={this.handleSubmitBatchEditBu}
                    onCancel={function () {
                        batchBuForm = {}
                        that.stateChange({
                            batchEditBuVisible: false,
                            batchBuForm
                        })
                    }}
                    confirmLoading={this.state.loading}
                    title="批量修改BU"
                    >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="原BU"
                        >
                            {getFieldDecorator('originBuId', {
                                initialValue: batchBuForm.originBuId,
                                rules: [{ required: true, message: '请选择原BU' }]
                            })(
                                <ComponentTreeSelect onChange={function (areaId, buId) {
                                    let batchBuForm = that.state.batchBuForm
                                    batchBuForm.originAreaId = areaId
                                    batchBuForm.originBuId = buId

                                    that.setState({
                                        batchBuForm
                                    })
                                }}
                                />
                            )}

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="现BU"
                        >
                            {getFieldDecorator('newBuId', {
                                initialValue: batchBuForm.newBuId,
                                rules: [{ required: true, message: '请选择现BU' }]
                            })(
                                <ComponentTreeSelect onChange={function (areaId, buId) {
                                    let batchBuForm = that.state.batchBuForm
                                    batchBuForm.newAreaId = areaId
                                    batchBuForm.newBuId = buId
                                    that.setState({
                                        batchBuForm
                                    })
                                }}
                                />
                            )}

                        </FormItem>
                        <Row gutter={10} justify="end">
                            <Col span={19} offset={5}>
                                <div className="house-setting-mark">注：本次操作会将【原BU】旗下所有的房源转到【现BU】旗下，请谨慎操作！</div>
                            </Col>
                        </Row>
                    </Form>

                </Modal> : null }

                {this.state.batchEditAssistVisible ?
                    <Modal
                    visible
                    onOk={function () {
                        that.props.form.validateFields((err, values) => {
                            if (!err) {
                                that.stateChange({ loading: true })
                                houseSettingService.fetchBatchEditHouseAssist({
                                    originAssistId: batchAssistForm.formerAssistantId,
                                    newAssistId: batchAssistForm.nowAssistantId,
                                    awardMonth: awardMonth
                                }).then((res) => {
                                    if(!!res) {
                                        setTimeout(() => {
                                            message.success('批量修改成功！')
                                            batchAssistForm = {}
                                            that.stateChange({
                                                batchEditAssistVisible: false,
                                                loading: false,
                                                batchAssistForm
                                            })
                                        })
                                    }else{
                                        that.stateChange({ loading: false })
                                    }
                                }).catch(e => {
                                    that.stateChange({ loading: false })
                                })
                            }
                        })
                    }}
                    onCancel={function () {
                        batchAssistForm = {}
                        that.stateChange({
                            batchEditAssistVisible: false,
                            batchAssistForm
                        })
                    }}
                    confirmLoading={this.state.loading}
                    title="批量修改管家"
                    >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="所属BU"
                        >
                            {getFieldDecorator('buId', {
                                initialValue: batchAssistForm.buId,
                                rules: [{ required: true, message: '请选择BU' }]
                            })(
                                <ComponentTreeSelect onChange={function (areaId, buId) {
                                    let batchAssistForm = that.state.batchAssistForm
                                    batchAssistForm.assistantAreaId = areaId
                                    batchAssistForm.assistantBuId = buId
                                    that.setState({
                                        loadingStatus: areaId > 0,
                                        batchAssistForm
                                    }, () => {
                                        that.getMainAssistantInfo(buId)
                                    })
                                }}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="原管家"
                            {...formItemLayout}
                            {...formItemStatus}
                        >
                            {getFieldDecorator('formerAssistantId', {
                                initialValue: batchAssistForm.formerAssistantId,
                                rules: [{ required: true, message: '请选择原管家' }]
                            })(
                                <Select placeholder="请选择原管家" onChange={function (val) {
                                    batchAssistForm.formerAssistantId = val
                                    that.stateChange({batchAssistForm})
                                }}
                                >
                                    {
                                        mainAssistantList.map(item => {
                                            return (<Option value={item.userId} key={item.userId}>{item.mobile}({item.realName})</Option>)
                                        })
                                    }
                                </Select>
                            )}

                        </FormItem>
                        <FormItem
                            label="现管家"
                            {...formItemLayout}
                            {...formItemStatus}
                        >
                            {getFieldDecorator('nowAssistantId', {
                                initialValue: batchAssistForm.nowAssistantId,
                                rules: [{ required: true, message: '请选择现管家' }]
                            })(
                                <Select placeholder="请选择现管家" onChange={function (val) {
                                    batchAssistForm.nowAssistantId = val
                                    that.stateChange({batchAssistForm})
                                }}
                                >
                                    {
                                        mainAssistantList.map(item => {
                                            return (<Option value={item.userId} key={item.userId}>{item.mobile}({item.realName})</Option>)
                                        })
                                    }
                                </Select>
                            )}

                        </FormItem>
                        <Row gutter={10} justify="end">
                            <Col span={19} offset={5}>
                                <div className="house-setting-mark">注：本次操作会将【原管家】旗下所有的房源转到【现管家】旗下，请谨慎操作！</div>
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label="接管月奖起计月份"
                        >
                            {getFieldDecorator('awardMonth', {
                                rules: [{ required: true, message: '请选择接管月奖起计月份' }]
                            })(
                                <RadioGroup onChange={function (e) {
                                    let val = e.target.value
                                    that.setState({awardMonth: val})
                                }}
                                >
                                    <Radio value={0}>当月</Radio>
                                    <Radio value={1}>次月</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <Row gutter={10} justify="end">
                            <Col span={19} offset={5}>
                                <div className="house-setting-mark">注：该月份的选择会影响【路客订单奖】、【月度入住奖】的计算。</div>
                            </Col>
                        </Row>
                    </Form>

                </Modal> : null}
            </div>
        )
    }
}

HouseSettingList = Form.create()(HouseSettingList)
export default HouseSettingList
