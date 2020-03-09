import React, { Component } from 'react'
import { aummerActivityService } from '../../services'
import { SubTable } from '../../components'
import './index.less'
class consumprionModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null
        }
    }
    cancelModal = () =>{}
    submitModal = () =>{}
    render () {
        const _this = this
        const {editFrom} = this.props
        const {
            userId
        } = editFrom
        const columns = [{
            title: '行程编号（订单号）',
            dataIndex: 'title',
            width: 150
        }, {
            title: '扣除充值金额',
            dataIndex: 'totalPrice',
            width: 150
        }, {
            title: '扣除赠送金额',
            dataIndex: 'roomPrice',
            width: 150
        }, {
            title: '扣除其他现金金额',
            dataIndex: 'servicePrice',
            width: 150
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getBookingDetails,
            getTableServiceData: userId,
            columns: columns,
            antdTableProps: {
                bordered: true
            },
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "bookingId"
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
export default consumprionModal