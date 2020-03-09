import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {doorLockManageService} from '../../services'
import {Row, Col, Drawer, Tabs, Form, Input, DatePicker, Button} from 'antd'
import {dataFormat, envConfig} from "../../utils/utils"
import moment from 'moment';
import Search from '../../components/search'
import './index.less'
import {message} from "antd/lib/index";

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
let searchConfig = {
    items: [

        {
            type: 'text',
            name: '房源编号',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编号'
        },{
            type: 'text',
            name: '门锁编码',
            key: 'lockNo',
            searchFilterType: 'string',
            placeholder: '请输入门锁编码'
        }
    ]
}
class DoorLockManageList extends Component {
    constructor (props) {
        super(props)
        let date = moment()
        const startTime = date.format('HH:mm')
        const endTime = date.add(2,'hour').format('HH:mm')
        const currentDateStr = date.format('YYYY-MM-DD') + ' ' + startTime
        // const tomorrowDateStr = date.clone().add('days',1).format('YYYY-MM-DD') + ' ' + endTime
        const tomorrowDateStr = date.clone().format('YYYY-MM-DD') + ' ' + endTime
        let dateRangeArr = []
        dateRangeArr.push(moment(currentDateStr,'YYYY-MM-DD HH:mm'))
        dateRangeArr.push(moment(tomorrowDateStr,'YYYY-MM-DD HH:mm'))


        this.state = {
            drawerVisible: false,
            doorLockInfo: {},
            dynamicPwdInfo: {}, //动态密码信息
            doorLockPassword: '',
            searchFields: {},
            dateRangeArr: dateRangeArr
        }
    }

    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                houseNo: searchFields.houseNo.value,
                lockNo: searchFields.lockNo.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleSubmit = () => {
        const that = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                doorLockManageService.sendDoorLockPassword({
                    houseSourceId: that.state.doorLockInfo.houseSourceId,
                    lockNo: that.state.doorLockInfo.lockNo,
                    name: values.name,
                    mobile: values.mobile,
                    beginDateTime: values.dateRange[0].valueOf(),
                    endDateTime: values.dateRange[1].valueOf()
                }).then((res) => {
                    if(!!res) {
                        message.success('发送成功！')
                        this.setState({
                            doorLockPassword: res
                        })
                    }
                })
            }
        })

    }
    //发送离线密码
    handleAwayPasswordSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                doorLockManageService.sendDoorLockAwapPassword({
                    lockNo: this.state.doorLockInfo.lockNo,
                    name: values.name,
                    mobile: values.mobile,
                    beginDateTime: values.dateRange[0].valueOf(),
                    endDateTime: values.dateRange[1].valueOf()
                }).then((res) => {
                    if(!!res){
                        message.success('发送成功！')
                        this.setState({
                            doorLockPassword: res.pwd_text
                        })
                    }

                })
            }
        })
    }
    handleTabsChange = (e) => {
        let that = this
        switch(e) {
        case '1' :
            that.props.form.setFieldsValue({
                name: undefined,
                mobile: undefined,
                dateRange: that.state.dateRangeArr
            })
            that.setState({
                doorLockPassword: ''
            })
            break
        case '2' :
            that.props.form.setFieldsValue({
                name: undefined,
                mobile: undefined,
                dateRange: that.state.dateRangeArr
            })
            that.setState({
                doorLockPassword: ''
            })
            that.getDynamicPwdInfo()
            break
        case '3' :
            if(that.tableOpenLockLogThis) {
                that.tableOpenLockLogThis.renderTable()
            }
            break
        case '4' :
            if(that.tableSendPasswordThis) {
                that.tableSendPasswordThis.renderTable()
            }
            break
        default :
            break
        }
    }
    getDynamicPwdInfo = () => {
        doorLockManageService.fetchDoorLockDynamicPwd({
            lockNo: this.state.doorLockInfo.lockNo
        }).then((res) => {
            this.setState({
                dynamicPwdInfo: res
            })
        })
    }
    render () {
        let that = this
        let { drawerVisible, doorLockInfo, dynamicPwdInfo, doorLockPassword } = that.state

        const startTime = moment().format('HH:mm')
        const endTime = moment().add(2,'hour').format('HH:mm')
        const { getFieldDecorator } = this.props.form
        const columns = [
            {title: '房源编号', dataIndex: 'houseNo', width: 200},
            {title: '房源名称', dataIndex: 'houseName', width: 200},
            {title: '门锁情况', dataIndex: 'comuStatus', width: 100, render: val => {
                return (
                    <span>
                        {val === '00' ? '通讯正常' : <span className="color-red">通讯异常</span>}
                    </span>
                )
            }},
            {title: '电量', dataIndex: 'power', width: 100},
            {title: '助理', dataIndex: 'assistNickName', width: 200, render: (val,record) => {
                return (
                    <span>{val}-{record.assistMobile}</span>
                )
            }},
            {title: '门锁编码', dataIndex: 'lockNo', width: 150}
        ];
        const subTableItem = {
            getTableService: doorLockManageService.getTable,
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
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: record => {
                    that.setState({
                        drawerVisible: true,
                        doorLockPassword: '',
                        doorLockInfo: record
                    })
                },
                text: '查看'
            }],
            operatBtnWidth: 120
        }
        const openLockLogSubTableItem = {
            getTableService: doorLockManageService.fetchOpenLockLogTable,
            searchFields: {
                lockNo: doorLockInfo.lockNo
            },
            refsTab: function (ref) {
                that.tableOpenLockLogThis = ref
            },
            rowKey: "op_time",
            columns: [
                {title: '开锁时间', dataIndex: 'op_time', width: 200, render: val => {
                    return (
                        <span>{dataFormat(val,'YYYY-MM-DD HH:mm')}</span>
                    )
                }},
                {title: '手机号', dataIndex: 'user_mobile', width: 200},
                {title: '姓名', dataIndex: 'user_name', width: 100}
            ]
        }
        const sendPasswordRecordSubTableItem = {
            getTableService: doorLockManageService.fetchSendPasswordRecordTable,
            searchFields: {
                lockNo: doorLockInfo.lockNo
            },
            refsTab: function (ref) {
                that.tableSendPasswordThis = ref
            },
            rowKey: "pwd_text",
            columns: [
                {title: '手机号', dataIndex: 'pwd_user_mobile', width: 120},
                {title: '时间', dataIndex: 'valid_time_start', width: 250, render: (val,record) => {
                    return (
                        <div>
                            <p>开始时间：{dataFormat(record.valid_time_start, 'YYYY-MM-DD HH:mm')}</p>
                            <p>结束时间：{dataFormat(record.valid_time_end, 'YYYY-MM-DD HH:mm')}</p>
                        </div>
                    )
                }},
                {title: '已启用', dataIndex: 'status', width: 80, render: val => {
                    return (
                        <span>
                            {val === '01' ? '启用中' : ''}
                            {val === '03' ? '删除' : ''}
                            {val === '11' ? '已启用' : ''}
                            {val === '13' ? '已删除' : ''}
                            {val === '21' ? '启用失败' : ''}
                            {val === '23' ? '删除失败' : ''}
                        </span>
                    )
                }}
            ],
            operatBtn: [{
                label: 'delete',
                size: "small",
                type: "primary",
                onClick: record => {
                    let params = {
                        lockNo: record.lock_no,
                        pwdNo: record.pwd_no
                    }
                    return doorLockManageService.del(params)
                },
                text: '删除'
            }],
            operatBtnWidth: 100
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
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    drawerVisible ?
                        <Drawer
                            title="门锁设置"
                            width={600}
                            visible
                            placement="right"
                            onClose={function () {
                                that.setState({
                                    drawerVisible: false
                                })
                            }}
                            maskClosable
                        >
                            <Row>
                                <Col span={8}>
                                    <img alt="图标失效" className="door-lock-house-image"
                                         src={doorLockInfo.houseImg}
                                    />
                                </Col>
                                <Col span={16}>
                                    <div className="door-lock-house-title">
                                        {doorLockInfo.houseName}
                                    </div>
                                    <div className="door-lock-house-status">
                                        <span>电量：{doorLockInfo.power}</span>
                                        <span>状态：{doorLockInfo.comuStatus === '00' ? '通讯正常' : <span className="color-red">通讯异常</span>}</span>
                                    </div>
                                </Col>
                            </Row>
                            <Tabs tabPosition="top" onChange={that.handleTabsChange}>
                                <TabPane tab="发送临时密码" key="1">
                                    <Form>
                                        <FormItem
                                            {...formItemLayout}
                                            label="姓名"
                                        >
                                            {getFieldDecorator('name', {
                                                rules: [{ required: true, message: '请输入姓名' }]
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="手机"
                                        >
                                            {getFieldDecorator('mobile', {
                                                rules: [
                                                    { required: true, message: '请输入手机' },
                                                    { validator (rule, value, callback) {
                                                        if(value == null){
                                                            callback()
                                                            return
                                                        }else if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/).test(value)) {
                                                            callback('手机输入有误')
                                                        }else{
                                                            callback()
                                                        }
                                                    }}]
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="时间"
                                        >
                                            {getFieldDecorator('dateRange', {
                                                initialValue: that.state.dateRangeArr,
                                                rules: [{ required: true, message: '请选择时间' },
                                                    { validator (rule, value, callback) {
                                                            if(value == null){
                                                                callback()
                                                                return
                                                            }else{
                                                                callback()
                                                            }
                                                        }}]
                                            })(
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment(startTime, 'HH:mm'), moment(endTime, 'HH:mm')]
                                                    }}
                                                    format="YYYY-MM-DD HH:mm"
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="密码"
                                        >
                                            <Input value={doorLockPassword} disabled />
                                        </FormItem>
                                    </Form>
                                    <div className="door-lock-house-btn">
                                        {
                                            doorLockPassword !== '' ?
                                                <Button onClick={function () {
                                                    that.setState({
                                                        doorLockPassword: ''
                                                    })
                                                }} type="primary"
                                                >重新发送</Button> :
                                                <Button onClick={this.handleSubmit} disabled={doorLockPassword !== ''} type="primary">发送</Button>
                                        }

                                    </div>

                                </TabPane>
                                { //第一代门锁
                                    doorLockInfo.lockKind === '0' ? <TabPane tab="查看动态密码" key="2">
                                        <div className="examine-pass-wrapper">
                                            <h1>动态密码：{dynamicPwdInfo.pwd_text}</h1>
                                            <p>有效期  当天{dataFormat(dynamicPwdInfo.valid_time_start,'HH:mm:ss')}~{dataFormat(dynamicPwdInfo.valid_time_end,'HH:mm:ss')}</p>
                                        </div>
                                    </TabPane> : null
                                }
                                { //第二代门锁
                                    doorLockInfo.lockKind === '3' ?
                                        <TabPane tab="发送离线密码" key="2">
                                            <Form>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="姓名"
                                                >
                                                    {getFieldDecorator('name', {
                                                        rules: [{ required: true, message: '请输入姓名' }]
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="手机"
                                                >
                                                    {getFieldDecorator('mobile', {
                                                        rules: [
                                                            { required: true, message: '请输入手机' },
                                                            { validator (rule, value, callback) {
                                                                    if(value == null){
                                                                        callback()
                                                                        return
                                                                    }else if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/).test(value)) {
                                                                        callback('手机输入有误')
                                                                    }else{
                                                                        callback()
                                                                    }
                                                                }}]
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="时间"
                                                >
                                                    {getFieldDecorator('dateRange', {
                                                        initialValue: that.state.dateRangeArr,
                                                        rules: [
                                                            { required: true, message: '请选择时间' },
                                                            { validator (rule, value, callback) {
                                                                    if(value == null){
                                                                        callback()
                                                                        return
                                                                    }else{
                                                                        callback()
                                                                    }

                                                                    // else if(moment(value[1] - value[0]).valueOf() > (1000 * 60 * 60 * 2)){
                                                                    //     callback('发送临时密码不能超过2个小时')
                                                                    //     return
                                                                    // }
                                                                }}]
                                                    })(
                                                        <RangePicker
                                                            showTime={{
                                                                hideDisabledOptions: true,
                                                                defaultValue: [moment('18:00', 'HH:mm'), moment('18:00', 'HH:mm')]
                                                            }}
                                                            format="YYYY-MM-DD HH:mm"
                                                        />
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="密码"
                                                >
                                                    <Input value={doorLockPassword} disabled />
                                                </FormItem>
                                            </Form>
                                            <div className="door-lock-house-btn">
                                                {
                                                    doorLockPassword !== '' ?
                                                        <Button onClick={function () {
                                                            that.setState({
                                                                doorLockPassword: ''
                                                            })
                                                        }} type="primary"
                                                        >重新发送</Button> : null
                                                }
                                                <Button onClick={this.handleAwayPasswordSubmit} disabled={doorLockPassword !== ''} type="primary">发送</Button>
                                            </div>
                                        </TabPane> : null
                                }
                                <TabPane tab="开锁日志" key="3">
                                    <SubTable
                                        {...openLockLogSubTableItem}
                                    />
                                </TabPane>
                                <TabPane tab="密码发送记录" key="4">
                                    <SubTable
                                        {...sendPasswordRecordSubTableItem}
                                    />
                                </TabPane>
                            </Tabs>
                        </Drawer> : null
                }
            </div>
        )
    }
}

DoorLockManageList = Form.create()(DoorLockManageList)
export default DoorLockManageList
