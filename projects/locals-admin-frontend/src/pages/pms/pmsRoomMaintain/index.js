import React, { Component } from 'react'
import {Table, Form, Button, Modal, Input, Select, message, Popconfirm, Drawer, Row, Col, Tabs, DatePicker} from 'antd'
import SubTable from '../../../components/subTable'
import {doorLockManageService, pmsService} from '../../../services'
import {pageOption, checkKey, dataFormat} from '../../../utils/utils'
import {withRouter} from "react-router-dom";
import moment from 'moment';
import './index.less'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const RangePicker = DatePicker.RangePicker
const { Option } = Select

class PmsRoomMaintain extends Component {
    constructor (props) {
        super(props)
        let date = moment()
        const startTime = date.format('HH:mm')
        const endTime = date.add(2,'hour').format('HH:mm')
        const currentDateStr = date.format('YYYY-MM-DD') + ' ' + startTime
        const tomorrowDateStr = date.clone().format('YYYY-MM-DD') + ' ' + endTime
        let dateRangeArr = []
        dateRangeArr.push(moment(currentDateStr,'YYYY-MM-DD HH:mm'))
        dateRangeArr.push(moment(tomorrowDateStr,'YYYY-MM-DD HH:mm'))
        this.state = {
            roomList: [],
            roomTypeList: [],
            roomId: '',
            doorLockInfo: {},
            dynamicPwdInfo: {},
            seletType: false,
            houseSourceId: '',
            doorLockPassword: '',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            dateRangeArr: dateRangeArr,
            addDiaVisible: false,
            drawerVisible: false,
            loading: true,
            searchFields: {},
            columns: [],
            visible: false,
            mode: 'add'
        }
        this.renderTable = this.renderTable.bind(this)
    }
    componentDidMount () {
        this.renderTable()
        pmsService.getRoomType(this.props.hotelId).then((data) => {
            this.setState({
                seletType: true,
                roomTypeList: data
            })
        })
    }
    handleSelectChange = (value) => {
        this.setState({
            houseSourceId: value
        })
    }
    renderTable () { // 获取table数据
        pmsService.getRoomList(this.props.hotelId).then((data) => {
            this.setState({
                loading : false,
                roomList:data
            })
        })
    }

    openModal = (mode, record) => {
        this.setState({
            visible: true,
            mode
        })
        if (mode === 'edit') {
            this.setState({
                roomId: record.id,
                houseSourceId: record.houseSourceId
            })
            this.props.form.setFieldsValue({
                roomNumber: record.roomNumber,
                houseType: record.houseNo + ' ' + record.houseType,
                remark: record.remark,
                doorIp: record.doorIp
            })
        }
    }
    openDrawer = (record) => {
        this.setState({
            drawerVisible: true,
            doorLockInfo: record
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
            lockNo: this.state.doorLockInfo.doorIp
        }).then((res) => {
            this.setState({
                dynamicPwdInfo: res
            })
        })
    }
    onModalOk = () => {
        let self = this
        const { mode } = this.state
        this.props.form.validateFields(['roomNumber', 'houseType', 'doorIp', 'remark'], (err, values) => {
            if (!err) {
                values.houseType = ''
                values.houseSourceId = this.state.houseSourceId
                if (mode === 'add') {
                    pmsService.addRoomList(values)
                        .then(() => {
                            self.onModalCancel()
                            self.renderTable()
                        })
                        .catch(err => {
                            message.error(err)
                        })
                } else {
                    let params = {
                        remark: values.remark,
                        lockNo: values.doorIp,
                        houseSourceId: this.state.houseSourceId,
                        roomNumberId: this.state.roomId
                    }
                    pmsService.checkDoorLock(params).then(() =>{
                        values.id = this.state.roomId
                        pmsService.editRoomList(values).then(() => {
                            self.onModalCancel()
                            self.renderTable()
                        }).catch(err => message.error(err))
                    }).catch(err => {
                        message.error(err)
                    })
                }
            }
        })
    }
    //发送临时密码
    handleSubmit = () => {
        const that = this
        this.props.form.validateFields(['name', 'mobile', 'dateRange'], (err, values) => {
            if (!err) {
                doorLockManageService.sendDoorLockPassword({
                    houseSourceId: that.state.doorLockInfo.houseSourceId,
                    lockNo: that.state.doorLockInfo.doorIp,
                    roomNumber: that.state.doorLockInfo.roomNumber,
                    roomNumberId: that.state.doorLockInfo.id,
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
        this.props.form.validateFields(['name', 'mobile', 'dateRange'], (err, values) => {
            if (!err) {
                doorLockManageService.sendDoorLockAwapPassword({
                    lockNo: this.state.doorLockInfo.doorIp,
                    roomNumber: this.state.doorLockInfo.roomNumber,
                    roomNumberId: this.state.doorLockInfo.id,
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
    onModalCancel = () => {
        this.setState({
            visible: false
        })
        this.props.form.resetFields()
    }
    deleteRoom = (record) => {
        const self = this
        let params = {
            houseSourceId: this.state.houseSourceId,
            id: record.id
        }
        pmsService.deleteRoomList(JSON.stringify(params))
            .then(() => {
                self.onModalCancel()
                self.renderTable()
            })
            .catch(err => message.error(err))
    }

    render () {
        const self = this
        const { getFieldDecorator } = this.props.form
        const startTime = moment().format('HH:mm')
        const endTime = moment().add(2,'hour').format('HH:mm')
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
        const that = this
        const { visible, mode, drawerVisible, doorLockInfo, doorLockPassword, dynamicPwdInfo } = this.state
        const columns = [{
            title: '房号',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
            exportType: 'text'
        }, {
            title: '房型（房源）',
            key: 'houseType',
            render: (text, record) => {
                return record.houseNo + ' ' + record.houseType
            }
        }, {
            title: '门锁状态',
            dataIndex: 'doorLockStatus',
            key: 'doorLockStatus',
            exportType: 'text'
        }, {
            title: '门锁电量',
            dataIndex: 'doorLockPower',
            key: 'doorLockPower',
            exportType: 'text'
        }, {
            title: '门锁ip',
            dataIndex: 'doorIp',
            key: 'doorIp',
            exportType: 'text'
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            exportType: 'text'
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return <React.Fragment>
                    <Button className="ml10" type="primary" onClick={function () {
                        self.openModal('edit', record)
                    }}
                    >
                        编辑
                    </Button>
                    <Button className="ml10" type="primary" onClick={function () {
                        self.openDrawer(record)
                    }}
                    >
                        密码
                    </Button>
                    <Popconfirm
                        title="是否确定执行删除权限操作？"
                        okText="确认"
                        cancelText="取消" onConfirm={function () { self.deleteRoom(record)}}
                    >
                        <Button className="ml10" type="danger">删除</Button>
                    </Popconfirm>
                </React.Fragment>
            }
        }]
        const openLockLogSubTableItem = {
            getTableService: doorLockManageService.fetchOpenLockLogTable,
            searchFields: {
                lockNo: doorLockInfo.doorIp
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
                lockNo: doorLockInfo.doorIp
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

        return (
            <div>
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={
                        function () {
                            self.openModal('add')
                        }
                    }
                    >
                        新增
                    </Button>
                </div>
                <Table loading={this.state.loading} columns={columns} rowKey={function (record) { return record.id}} dataSource={checkKey(this.state.roomList)} pagination={false} >
                </Table>
                <Modal
                    visible={visible}
                    title={mode === 'add' ? '新增' : '编辑'}
                    onOk={this.onModalOk}
                    onCancel={this.onModalCancel}
                    cancelText="关闭"
                    okText="保存"
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="房号"
                        >
                            {getFieldDecorator('roomNumber', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入房号' }]
                            })(
                                <Input placeholder="请输入房号"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="房型（房源）"
                        >
                            {getFieldDecorator('houseType', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择房型（房源）' }]
                            })(
                                <Select
                                    placeholder="请选择房型（房源）"
                                    onChange={this.handleSelectChange}
                                >
                                    {this.state.roomTypeList.map(d => <Option title={d.houseNo + ' ' + d.title} key={d.id}>{d.houseNo + ' ' + d.title}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="门锁ip"
                        >
                            {getFieldDecorator('doorIp', {
                                initialValue: '',
                                rules: [{ required: mode !== 'add', message: '请输入门锁ip' }]
                            })(
                                <Input disabled={mode === 'add'} placeholder="请输入门锁ip" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="备注"
                        >
                            {getFieldDecorator('remark', {
                                initialValue: '',
                                rules: [{ required: false, message: '请输入备注' }]
                            })(
                                <Input placeholder="请输入备注" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
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
                            <div className="mb5">
                                {doorLockInfo && doorLockInfo.houseNo} {doorLockInfo && doorLockInfo.houseType}
                            </div>
                            <div className="door-lock-house-status">
                                <span>房号：{doorLockInfo && doorLockInfo.roomNumber}</span>
                                <span className="mr20">电量：{doorLockInfo && doorLockInfo.doorLockPower}</span>
                                <span>状态：{doorLockInfo && doorLockInfo.doorLockStatus}</span>
                            </div>
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
                                                <Button onClick={that.handleSubmit} disabled={doorLockPassword !== ''} type="primary">发送</Button>
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
PmsRoomMaintain = Form.create()(PmsRoomMaintain)
export default withRouter(PmsRoomMaintain)

