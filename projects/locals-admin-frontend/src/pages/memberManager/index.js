import React, { Component } from 'react'
import { notification, Modal,Form,Select,DatePicker,Drawer,message } from 'antd'
import { aummerActivityService,userService} from '../../services'
import Search from '../../components/search'
import { SubTable } from '../../components'
import CheckModal from './checkModal'
import { memberLevelList, sexMap, dicModel, memberCardCodeList } from '../../utils/dictionary'
import { dataFormat } from '../../utils/utils'
import './index.less'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '手机号码',
            key: 'mobile',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入手机号码'
        },{
            type: 'text',
            name: '用户ID',
            key: 'userId',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入用户ID'
        },{
            type: 'select',
            name: '会员等级',
            key: 'memberCardCode',
            defaultValue: '',
            selectData: [
                {value: '', text: '所有'},
                {value: 'NORMAL', text: '普卡'},
                {value: 'SILVER', text: '银卡'},
                {value: 'GOLD', text: '金卡'},
                {value: 'BLACK', text: '黑卡'}
            ],
            searchFilterType: 'select',
            placeholder: '请选择会员等级'
        },{
            type: 'select',
            name: '保证金减免',
            key: 'isExemptDeposit',
            searchFilterType: 'select',
            selectData: [
                {value: '', text: '所有'},
                {value: '1', text: '是'},
                {value: '0', text: '否'}
            ],
            defaultValue: '',
            placeholder: '请选择'
        }, {
            type: 'rangepicker',
            name: '注册时间',
            key: 'createTime',
            searchFilterType: 'rangepicker',
            defaultValue: ''
        }, {
            type: 'select',
            name: '权益标签',
            key: 'vipType',
            searchFilterType: 'select',
            selectData: [
                {value: '', text: '所有'},
                {value: '1', text: '个人商旅'},
                {value: '2', text: '企业商旅'}
            ],
            defaultValue: '',
            placeholder: '请选择权益标签'
        }
    ]
}

class AummerActivityMember extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showTable: true,
            editModalVisible: false,
            editFrom: {},
            modalType:'',
            searchFields:{},
            orderBy: '',
            visible:false,
            userInfo: {},
            cordList: [],
            level: 0
        }
        this.tableThis = null
        this.openModal = this.openModal.bind(this)
        this.stateChange = this.stateChange.bind(this)
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        let str1,str2
        if(searchFields.createTime.value){
            let date1 = new Date(searchFields.createTime.value[0]); //时间对象
            str1 = date1.getTime(); //转换成时间戳
            let date2 = new Date(searchFields.createTime.value[1]); //时间对象
            str2 = date2.getTime(); //转换成时间戳
        }
        this.setState({
            pageNum:1,
            showTable : false,
            searchFields:{
                mobile: searchFields.mobile.value,
                userId: searchFields.userId.value,
                memberCardCode: searchFields.memberCardCode.value,
                isExemptDeposit: searchFields.isExemptDeposit.value,
                createTimeStart: str1,
                createTimeEnd: str2,
                vipType: searchFields.vipType.value
            }
        })
    }
    checkUserInfo = (record,fn)=>{
        aummerActivityService.putPaymentExemptManage(record).then(e=>{
            notification.success({
                message: '修改成功！'
            })
            this.setState({editModalVisible: false})
            this.tableThis.renderTable()
            fn && fn()
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const form = this.props.form
        const { getFieldValue } = form
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var validTime = getFieldValue('validTime')
                var params = {
                    userId: this.state.userInfo.userId,
                    memberCardCode: getFieldValue('memberCardCode'),
                    validTimeStart: +validTime[0],
                    validTimeEnd: +validTime[1]
                }
                userService.putMember(params).then(res => {
                    message.success('操作成功!')
                    this.setState({
                        visible: false
                    }, this.tableThis.renderTable)
                })
            }
        })
    }
    toggleModal = () => {
        this.setState({ visible: false })
    }
    openModal = (record) => {
        let currentCode = record.memberCardCode
        if(record.memberCardCode){
            this.setState({
                userInfo: record,
                editModalVisible:false,
                visible: true,
                cordList: Object.values(memberCardCodeList),
                level: memberCardCodeList[currentCode]['level']
            })
        }else{
            this.setState({
                userInfo: record,
                editModalVisible:false,
                visible: true,
                cordList: Object.values(memberCardCodeList),
                level: ''
            })
        }
    }
    renderModal = () => {
        const state = this.state
        const FormItem = Form.Item
        const { getFieldDecorator } = this.props.form
        const Option = Select.Option
        const RangePicker = DatePicker.RangePicker
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }
        const timePlaceHolder = ['有效期起', '有效期止']
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择有效时间!' }]
        }
        return (
            <Modal
                {...dicModel}
                title="升/降级会员"
                visible={state.visible}
                onCancel={this.toggleModal}
                onOk={this.handleSubmit}
                destroyOnClose="true"
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="会员等级"
                    >
                        {getFieldDecorator('memberCardCode', {
                            rules: [{
                                required: true,
                                message: '请选择卡类!'
                            }]
                        })(
                            <Select>
                                {state.cordList.map( (v, i) => (
                                    <Option
                                        key={v.code}
                                        value={v.code}
                                    >{v.name}</Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="有效范围"
                    >
                        {getFieldDecorator('validTime', rangeConfig)(
                            <RangePicker placeholder={timePlaceHolder} format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    onClose = () =>{
        this.setState({
            editModalVisible: false
        });
    }
    render () {
        const _this = this
        const _state = this.state
        const {editModalVisible, editFrom, modalType} = _state
        const depositMap = {
            0: '否',
            1: '是'
        }
        const depositType = {
            1: '个人商旅',
            2: '企业商旅'
        }
        const columns = [{
            title: '用户ID',
            width: 200,
            dataIndex: 'userId'
        }, {
            title: '姓名',
            width: 200,
            dataIndex: 'realName'
        }, {
            title: '用户名',
            width: 200,
            dataIndex: 'username'
        }, {
            title: '性别',
            dataIndex: 'sex',
            width: 200,
            dataType: 'select',
            selectData: sexMap
        }, {
            title: '微信昵称',
            width: 200,
            dataIndex: 'nickName'
        }, {
            title: '手机号码',
            width: 200,
            dataIndex: 'mobile'
        }, {
            title:'注册时间',
            width: 200,
            dataType: 'createTime',
            dataIndex: 'createTime',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD')}</span>
        }, {
            title: '会员等级',
            width: 200,
            dataType: 'select',
            dataIndex: 'memberCardCode',
            selectData: memberLevelList
        }, {
            title: '权益标签',
            width: 200,
            dataType: 'select',
            dataIndex: 'vipType',
            selectData: depositType
        }, {
            title: '保证金减免',
            width: 200,
            dataType: 'select',
            dataIndex: 'isExemptDeposit',
            valIndex: 'isExemptDeposit',
            selectData: depositMap
        }, {
            title: '减免有效期',
            width: 200,
            dataIndex: 'validTimeStart',
            startIndex: 'validTimeStart',
            endIndex: 'validTimeEnd',
            dataType: 'datePicker',
            fmt: 'YYYY-MM-DD'
        }]
        // ,{
        //     title: '状态',
        //     dataIndex: 'validStatus1'
        // }
        const subTableItem = {
            getTableService: aummerActivityService.getMembersManage,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "userId",
            searchFields: _state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: '',
                //visible: (record) => record.conform === null,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: '', editFrom: record})
                },
                text: '修改'
            }, {
                label: 'button',
                size: "small",
                type: "primary",
                className: 'ml10',
                //visible: (record) => record.conform === 0 || record.conform === 1,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: 'readOnly', editFrom: record})
                },
                text: '查看'
            }, {
                label: 'button',
                size: 'small',
                type: 'primary',
                className: 'ml10',
                onClick: function (record) {
                    _this.openModal(record)
                },
                text: '升/降级'
            }],
            operatBtnWidth: 200,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
            //orderBy: 'create_time desc'
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                {
                     this.state.showTable ? '请输入搜索条件，点击搜索。' :
                     <SubTable {...subTableItem} />
                }
                {editModalVisible &&
                    <Drawer
                        title={modalType ? '查看' : '修改'}
                        placement="right"
                        width="90%"
                        onClose={_this.onClose}
                        visible={editModalVisible}
                        className="menberManager"
                    >
                        <CheckModal
                            visible={editModalVisible}
                            editFrom={editFrom}
                            modalType={modalType}
                            stateChange={this.stateChange}
                            checkUserInfo={this.checkUserInfo}
                            changRank={this.openModal}
                        />
                    </Drawer>
                }
                {_this.renderModal()}
            </div>
        )
    }
}

AummerActivityMember = Form.create()(AummerActivityMember)
export default AummerActivityMember
