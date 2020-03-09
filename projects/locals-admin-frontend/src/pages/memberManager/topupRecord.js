import React, { Component } from 'react'
import { aummerActivityService } from '../../services'
import { SubTable } from '../../components'
import './index.less'
class topupModal extends Component {
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
            title: '充值交易单号',
            dataIndex: 'title',
            width: 150
        }, {
            title: '充值金额',
            dataIndex: 'totalPrice',
            width: 150
        }, {
            title: '赠送金额',
            dataIndex: 'roomPrice',
            width: 150
        }, {
            title: '充值时间',
            dataIndex: 'servicePrice',
            width: 150
        }]
        const subTableItem = {
            getTableService: aummerActivityService.getBookingDetails,
            getTableServiceData: userId,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "bookingId",
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: '',
                //visible: (record) => record.conform === null,
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: '', editFrom: record})
                },
                text: '查看'
            }],
            operatBtnWidth: 100,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
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
export default topupModal