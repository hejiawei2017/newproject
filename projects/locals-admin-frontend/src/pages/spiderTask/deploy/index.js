import React, { Component } from 'react'
import { spiderTaskService } from '../../../services/index'
import {SubTable} from '../../../components/index'
import {searchObjectSwitchArray} from '../../../utils/utils'
import {spiderTaskDictionary} from '../../../utils/dictionary'
import { Modal, Form, Select, Input, Button, Checkbox, Radio } from 'antd'
import {message} from "antd/lib/index";

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class SpiderTaskDeploy extends Component {
    constructor (props) {
        super (props)
        this.state = {
            deployInfo: {},
            visible: false,
            mode: 'add'
        }
    }

    openModal = (mode, record) => {
        this.setState({
            visible: true,
            deployInfo: record,
            mode
        })
    }

    renderTable = () => {
        this.tableThis.renderTable()
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            let params = values;
            params.network = params.network.join(',');
            if(this.state.mode === 'add') {
                if(params.searchCity === '以下所有城市'){
                    delete params.searchCity;
                }
                spiderTaskService.createDeployInfo(params).then(res => {
                    message.success('提交成功');
                    this.setState({
                        visible: false
                    })
                    this.renderTable();
                }).catch(err => {

                })
            }else {
                params.id = this.state.deployInfo.id;
                params.status = this.state.deployInfo.status;
                spiderTaskService.updateDeployInfo(params).then(res => {
                    message.success('提交成功');
                    this.setState({
                        visible: false
                    })
                    this.renderTable();
                }).catch(err => {

                })
            }
        })
    }

    handleTaskType = (e) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({searchCity: '以下所有城市'});
    }

    render () {
        let self = this
        const columns = [{
            title: '任务配置名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 100
        }, {
            title: '任务类型',
            dataIndex: 'taskType',
            key: 'taskType',
            width: 100,
            render: function (val) {
                return <span>{spiderTaskDictionary.taskTypes[val]}</span>
            }
        }, {
            title: '城市',
            dataIndex: 'searchCity',
            key: 'searchCity',
            width: 100
        }, {
            title: '接口轮训间隔',
            dataIndex: 'interfaceIntervalTime',
            key: 'interfaceIntervalTime',
            width: 130,
            render: function (val) {
                return <span>{(val / 1000)} 秒</span>
            }
        }, {
            title: '权重比值',
            dataIndex: 'weightValue',
            key: 'weightValue',
            width: 100
        }, {
            title: '投放终端',
            dataIndex: 'terminalType',
            key: 'terminalType',
            width: 100,
            render: function (val) {
                return <span>{spiderTaskDictionary.terminalTypes[val]}</span>
            }
        }, {
            title: '终端读取配置时间',
            dataIndex: 'terminalReadDeployTime',
            key: 'terminalReadDeployTime',
            width: 150,
            render: function (val) {
                return <span>{(val / 1000)} 秒</span>
            }
        }, {
            title: '每次工作条数',
            dataIndex: 'pageSize',
            key: 'pageSize',
            width: 150
        }, {
            title: '终端网络类型',
            dataIndex: 'network',
            key: 'network',
            width: 150,
            render: function (val) {
                let arr = !!val ? val : []
                if(arr && typeof val === 'string') {
                    arr = val.split(',')
                }
                let nameArr = []
                arr.forEach(item => {
                    nameArr.push(spiderTaskDictionary.networks[Number(item)])
                })
                return <span>{nameArr.join(',')}</span>
            }
        }, {
            title: '配置状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: function (val) {
                return <span>{spiderTaskDictionary.status[val]}</span>
            }
        }]
        const subTableItem = {
            getTableService: spiderTaskService.getDeployTable,
            columns: columns,
            refsTab: function (ref) {
                self.tableThis = ref
            },
            rowKey: "id",
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                onClick: function (record) {
                    self.openModal('edit', record)
                },
                text: '编辑'
            },{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                visible: function (record) {
                    return record.status === 0
                },
                onClick: function (record) {
                    spiderTaskService.updateDeployStatus({
                        id: record.id,
                        status: 1
                    }).then(res => {
                        message.success('操作成功');
                        self.renderTable();
                    })
                },
                text: '启用'
            },{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                visible: function (record) {
                    return record.status === 1
                },
                onClick: function (record) {
                    spiderTaskService.updateDeployStatus({
                        id: record.id,
                        status: 0
                    }).then(res => {
                        message.success('操作成功');
                        self.renderTable();
                    })
                },
                text: '停用'
            },{
                label: 'delete',
                size: "small",
                type: "primary",
                className: 'mr10',
                onClick: function (record) {
                    const params = {
                        id: record.id,
                        status: 2
                    }
                    return spiderTaskService.deleteDeployInfo(params)
                },
                text: '删除'
            }],
            operatBtnWidth: 150,
            operatBtnFixed: 'right'
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        }
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { deployInfo } = this.state
        const taskTypeList = searchObjectSwitchArray(spiderTaskDictionary.taskTypes)
        const terminalTypeList = searchObjectSwitchArray(spiderTaskDictionary.terminalTypes)
        const plainOptions = searchObjectSwitchArray(spiderTaskDictionary.networks,null,null,'label');
        if(deployInfo && !!deployInfo.network) {
            if(typeof deployInfo.network === 'string') {
                deployInfo.network = deployInfo.network.split(',')
            }

        }
        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={
                        function () {
                            self.openModal('add', {
                                searchCity: '以下所有城市',
                                fullDose: 1
                            })
                        }}
                    >
                        新增配置
                    </Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {
                    this.state.visible ?
                        <Modal
                            visible
                            width={600}
                            title={this.state.mode === 'add' ? '新增配置' : '修改配置'}
                            onCancel={function () {
                                self.setState({visible: false})
                            }}
                            onOk={function () {
                                self.handleSubmit();
                            }}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="任务配置名称"
                                >
                                    {getFieldDecorator('taskName', {
                                        initialValue: deployInfo.taskName,
                                        rules: [{ required: true, message: '请输入任务配置名称' }]
                                    })(
                                        <Input placeholder="请输入任务配置名称"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="任务类型"
                                >
                                    {getFieldDecorator('taskType', {
                                        initialValue: deployInfo.taskType,
                                        rules: [{ required: true, message: '请选择任务类型' }]
                                    })(
                                        <Select placeholder="请选择任务类型" onChange={this.handleTaskType}>
                                            {
                                                taskTypeList.map(item => {
                                                    return <Option key={'taskType_' + item.value} value={Number(item.value)}>{item.text}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="任务数据量类型"
                                >
                                    {getFieldDecorator('fullDose', {
                                        initialValue: deployInfo.fullDose
                                    })(
                                        <RadioGroup disabled={this.state.mode !== 'add' && deployInfo.status === 1}>
                                            <Radio value={1}>全量</Radio>
                                            <Radio value={2}>坐标范围</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="接口轮训间隔(毫秒)"
                                >
                                    {getFieldDecorator('interfaceIntervalTime', {
                                        initialValue: deployInfo.interfaceIntervalTime,
                                        rules: [{ required: true, message: '请输入接口轮训间隔时间' }]
                                    })(
                                        <Input placeholder="请输入接口轮训间隔时间"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="权重比值"
                                >
                                    {getFieldDecorator('weightValue', {
                                        initialValue: deployInfo.weightValue,
                                        rules: [{ required: true, message: '请输入权重比值' }]
                                    })(
                                        <Input placeholder="请输入权重比值"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="投放终端"
                                >
                                    {getFieldDecorator('terminalType', {
                                        initialValue: deployInfo.terminalType,
                                        rules: [{ required: true, message: '请选择投放终端' }]
                                    })(
                                        <Select placeholder="请选择任务类型">
                                            {
                                                terminalTypeList.map(item => {
                                                    return <Option key={'terminalType_' + item.value} value={Number(item.value)}>{item.text}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="终端读取配置时间(毫秒)"
                                >
                                    {getFieldDecorator('terminalReadDeployTime', {
                                        initialValue: deployInfo.terminalReadDeployTime,
                                        rules: [{ required: true, message: '请输入终端读取配置时间' }]
                                    })(
                                        <Input placeholder="请输入终端读取配置时间"/>
                                    )}
                                </FormItem>
                                {
                                    getFieldValue('taskType') === 0 || deployInfo.taskType === 0 ? (
                                        <FormItem
                                            {...formItemLayout}
                                            label="城市"
                                        >
                                            {getFieldDecorator('searchCity', {
                                                initialValue: deployInfo.searchCity
                                            })(
                                                <Select placeholder="选择城市" disabled={this.state.mode !== 'add' && deployInfo.status === 1}>
                                                    {
                                                        spiderTaskDictionary.airbnbCityDictionary.map((item,index) => {
                                                            return <Option key={`bnbSearchCity_${index}`} value={item.value}>{item.name}</Option>
                                                        })
                                                    }

                                                </Select>
                                            )}
                                        </FormItem>
                                    ) : null
                                }
                                {
                                    getFieldValue('taskType') === 1 || deployInfo.taskType === 1 ? (
                                        <FormItem
                                            {...formItemLayout}
                                            label="城市"
                                        >
                                            {getFieldDecorator('searchCity', {
                                                initialValue: deployInfo.searchCity
                                            })(
                                                <Select disabled={this.state.mode !== 'add' && deployInfo.status === 1}>
                                                    {
                                                        spiderTaskDictionary.tuJiaCityDictionary.map((item,index) => {
                                                            return <Option key={`tuJiaSearchCity_${index}`} value={item}>{item}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    ) : null
                                }
                                <FormItem
                                    {...formItemLayout}
                                    label="每次工作条数(建议2条一次)"
                                >
                                    {getFieldDecorator('pageSize', {
                                        initialValue: deployInfo.pageSize,
                                        rules: [{ required: true, message: '请输入每次工作条数' }]
                                    })(//修改时，如果状态为启用，不可以修改，否则会影响脚本工作
                                        <Input placeholder="请输入每次工作条数" disabled={this.state.mode !== 'add' && deployInfo.status === 1}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="终端网络类型"
                                >
                                    {getFieldDecorator('network', {
                                        initialValue: deployInfo.network,
                                        rules: [{ required: true, message: '请选择投放终端' }]
                                    })(
                                        <CheckboxGroup options={plainOptions} />
                                    )}
                                </FormItem>
                            </Form>
                        </Modal> : null
                }
            </div>
        )
    }
}

SpiderTaskDeploy = Form.create()(SpiderTaskDeploy)
export default SpiderTaskDeploy
