import React, { Component } from 'react'
import { aummerActivityService } from '../../services'
import { SubTable } from '../../components'
import { dataFormat } from '../../utils/utils'
import './index.less'
class givingModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null
        }
    }
    render () {
        const _this = this
        const {editFrom} = this.props
        const {
            userId
        } = editFrom
        const columns = [{
            title: '充值交易单号/行程编号（订单号）',
            dataIndex: 'randomId',
            width: 200
        }, {
            title: '返现',
            dataIndex: 'consumptionOfGold',
            width: 200
        }, {
            title: '预计到账时间',
            dataIndex: 'expectToAccountTime',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
            width: 200
        }, {
            title: '实际到账时间',
            dataIndex: 'actualToAccountTime',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
            width: 200
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getGivingRecord,
            getTableServiceData: userId,
            columns: columns,
            antdTableProps: {
                bordered: true
            },
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id"
        }
        return (
            <div>
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}
export default givingModal