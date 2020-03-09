import React, { Component } from 'react'
import { notification } from 'antd';
import { aummerActivityService } from '../../services'
import Search from '../../components/search'
import { SubTable } from '../../components'
import CheckModal from './checkModal'
import { AummerActivityStatusMap, AummerActivityStatusResMap } from '../../utils/dictionary';

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
            type: 'datepicker',
            name: '提交时间',
            key: 'createTime',
            searchFilterType: 'datepicker',
            defaultValue: ''
        }
    ]
}

class AummerActivityApplication extends Component {
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
    checkUserInfo = (record)=>{
        aummerActivityService.putPaymentExemptDeposit(record).then(e=>{
            notification.success({
                message: '审核成功！'
            })
            this.setState({editModalVisible: false})
            this.tableThis.renderTable()
        })
    }
    render () {
        const _this = this
        const _state = this.state
        const {editModalVisible, editFrom, modalType} = _state
        const columns = [{
            title: '姓名',
            dataIndex: 'realName',
            width: 150
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            width: 150
        }, {
            title: '身份证号',
            dataIndex: 'idCard',
            width: 250
        }, {
            title: '年龄',
            dataIndex: 'age',
            valIndex: 'idCard',
            render: (v,o) => <span>{o['idCard'] && (new Date().getFullYear() - o['idCard'].substr(6,4))}</span>,
            width: 150
        }, {
            title: '提交时间',
            dataIndex: 'createTime',
            dataType: 'time',
            fmt: 'YYYY-MM-DD HH:mm',
            width: 200
        }, {
            title: '处理状态',
            dataType: 'select',
            dataIndex: 'conform',
            selectData: AummerActivityStatusMap,
            width: 150
        }, {
            title: '处理结果',
            dataType: 'select',
            dataIndex: 'conform2',
            valIndex: 'conform',
            selectData: AummerActivityStatusResMap,
            width: 150
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getPaymentExemptDeposit,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "idCard",
            searchFields: _state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                visible: (record) => record.conform === null,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: '', editFrom: record})
                },
                text: '编辑'
            }, {
                label: 'button',
                size: "small",
                type: "primary",
                className: '',
                visible: (record) => record.conform === 0 || record.conform === 1,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: 'readOnly', editFrom: record})
                },
                text: '查看'
            }],
            operatBtnWidth: 100,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            },
            sorterKeys: [{
                key: 'createTime',
                str: 'create_time'
            }, {
                key: 'orderNumber',
                str: 'order_number'
            }],
            orderBy: 'create_time desc'
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                <CheckModal
                    visible={editModalVisible}
                    editFrom={editFrom}
                    modalType={modalType}
                    stateChange={this.stateChange}
                    checkUserInfo={this.checkUserInfo}
                />
            </div>
        )
    }
}

export default AummerActivityApplication