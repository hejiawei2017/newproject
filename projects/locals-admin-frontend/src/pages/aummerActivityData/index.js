import React, { Component } from 'react'
import { aummerActivityService } from '../../services'
import { SubTable } from '../../components'
import { memberLevelMap } from '../../utils/dictionary';
import Search from '../../components/search'

const searchConfig = {
    items: [],
    exportFBtn: {
        name: '导出活动数据'
    }

}

class AummerActivityData extends Component {
    constructor () {
        super()
        this.state = {
            orderBy: ''
        }
        this.tableThis = null
        this.stateChange = this.stateChange.bind(this)
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    render () {
        const _this = this
        const depositMap = {
            0: '否',
            1: '是'
        }
        const couponMap = {
            0: '已领取',
            1: '已领取',
            null: '待领取'
        }
        const columns = [{
            title: '微信昵称',
            dataIndex: 'nickName',
            keyIndex: 'nickName',
            width: 150
        }, {
            title: '姓名',
            dataIndex: 'realName',
            keyIndex: 'realName',
            width: 150
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            width: 150
        }, {
            title: '身份证号',
            dataIndex: 'idCard',
            width: 200
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
            title: '会员等级',
            dataType: 'select',
            dataIndex: 'memberCardCode',
            selectData: memberLevelMap,
            width: 150
        }, {
            title: '保证金减免',
            dataType: 'select',
            dataIndex: 'deposit',
            valIndex: 'conform',
            selectData: depositMap,
            width: 200
        }, {
            title: '减免有效期',
            dataIndex: 'validTimeStart',
            startIndex: 'validTimeStart',
            endIndex: 'validTimeEnd',
            dataType: 'datePicker',
            fmt: 'YYYY-MM-DD',
            width: 200
        }, {
            title: '用户标签',
            dataIndex: 'label',
            width: 200
        }, {
            title: '优惠券领取',
            dataType: 'select',
            dataIndex: 'coupon',
            valIndex: 'conform',
            selectData: couponMap,
            width: 150
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getPaymentManageActivity,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "idCard",
            orderBy: 'create_time desc',
            antdTableProps: {
                bordered: true
            }
        }
        const searchDataSource = this.tableThis && this.tableThis.state.dataSource
        // const searchColumns = columns
        searchConfig.columns = columns
        // console.log('tableThis', searchDataSource, columns)
        return (
            <div>
                <Search config={searchConfig} dataSource={searchDataSource} />
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}

export default AummerActivityData