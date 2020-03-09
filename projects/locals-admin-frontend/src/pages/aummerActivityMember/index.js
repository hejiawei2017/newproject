import React, { Component } from 'react'
import { notification } from 'antd'
import { aummerActivityService } from '../../services'
import Search from '../../components/search'
import { SubTable } from '../../components'
import CheckModal from './checkModal'
import { memberLevelMap, MarginMap, sexMap } from '../../utils/dictionary'
const memberLevelOption = []
for (const key in memberLevelMap) {
    if (memberLevelMap.hasOwnProperty(key)) {
        memberLevelOption.unshift({value: key, text: memberLevelMap[key]})
    }
}
const MarginOption = []
for (const key in MarginMap) {
    if (MarginMap.hasOwnProperty(key)) {
        MarginOption.unshift({value: key, text: MarginMap[key]})
    }
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '手机号码',
            key: 'mobile',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        },{
            type: 'text',
            name: '身份证号',
            key: 'idCard',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入'
        },{
            type: 'select',
            name: '会员等级',
            key: 'validStatus',
            searchFilterType: 'select',
            selectData: memberLevelOption,
            renderSelectData: memberLevelMap,
            defaultValue: '',
            placeholder: '请选择'
        },{
            type: 'select',
            name: '状态',
            key: 'validStatus1',
            searchFilterType: 'select',
            selectData: MarginOption,
            renderSelectData: MarginMap,
            defaultValue: '',
            placeholder: '请选择'
        },{
            type: 'datepicker',
            name: '注册时间',
            key: 'createTime',
            searchFilterType: 'datepicker',
            defaultValue: ''
        }
    ]
}

class AummerActivityMember extends Component {
    constructor () {
        super()
        this.state = {
            editModalVisible: false,
            editFrom: {},
            modalType:'',
            searchFields:{},
            orderBy: ''
        }
        this.tableThis = null
        this.stateChange = this.stateChange.bind(this)
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                mobile: searchFields.mobile.value,
                idCard: searchFields.idCard.value,
                createTime: searchFields.createTime.value
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
    render () {
        const _this = this
        const _state = this.state
        const {editModalVisible, editFrom, modalType} = _state
        const depositMap = {
            0: '否',
            1: '是'
        }
        const columns = [{
            title: '用户ID',
            dataIndex: 'userId',
            width: 200
        }, {
            title: '姓名',
            dataIndex: 'realName',
            width: 150
        }, {
            title: '用户名',
            dataIndex: 'name',
            width: 150
        }, {
            title: '性别',
            dataIndex: 'sex',
            dataType: 'select',
            selectData: sexMap,
            width: 150
        }, {
            title: '微信昵称',
            dataIndex: 'nickName',
            width: 200
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            width: 150
        }, {
            title: '身份证号',
            dataIndex: 'idCard',
            width: 200
        }, {
            title: '邮箱地址',
            dataIndex: 'email',
            width: 150
        }, {
            title: '会员等级',
            dataType: 'select',
            dataIndex: 'memberCardCode',
            selectData: memberLevelMap,
            width: 150
        }, {
            title: '用户标签',
            dataIndex: 'label',
            width: 150
        }, {
            title: '保证金减免',
            dataType: 'select',
            dataIndex: 'deposit',
            valIndex: 'conform',
            selectData: depositMap,
            width: 150
        }, {
            title: '减免有效期',
            dataIndex: 'validTimeStart',
            startIndex: 'validTimeStart',
            endIndex: 'validTimeEnd',
            dataType: 'datePicker',
            fmt: 'YYYY-MM-DD',
            width: 150
        }]
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
                className: 'mr10',
                // visible: (record) => record.conform === null,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: '', editFrom: record})
                },
                text: '修改'
            }, {
                label: 'button',
                size: "small",
                type: "primary",
                // visible: (record) => record.conform === 0 || record.conform === 1,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: 'readOnly', editFrom: record})
                },
                text: '查看'
            }],
            operatBtnWidth: 150,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            },
            orderBy: 'create_time desc'
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {editModalVisible &&
                <CheckModal
                    visible={editModalVisible}
                    editFrom={editFrom}
                    modalType={modalType}
                    stateChange={this.stateChange}
                    checkUserInfo={this.checkUserInfo}
                />}
            </div>
        )
    }
}

export default AummerActivityMember