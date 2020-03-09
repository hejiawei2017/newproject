import React, {Component} from 'react'
import {Table,Modal } from 'antd'
import {dataFormat} from "../../utils/utils"
class PayLogList extends Component {
    render () {
        const { moreVisible, onCancel} = this.props
        const scroll = {
            x:true,
            y:false
        }
        const payLogColumns = [{
            title: '支付单号',
            dataIndex: 'outNo',
            key: 'outNo',
            width:'150px'
        },{
            title: '微信openId/支付宝账号',
            dataIndex: 'payUser',
            key: 'payUser',
            width:'200px'
        },{
            title: '支付方式',
            dataIndex: 'payType',
            key: 'payType',
            width:'96px',
            render: function (text, record, index) {
                return (
                    <div>
                        {
                            record.payType === "AliPay" ? "支付宝" : record.payType === "WechatPay" ? "微信" : record.payType === "AliPay" ? "现金" : null
                        }
                    </div>
                )

            }
        },{
            title: '支付类别',
            dataIndex: 'payCategory',
            key: 'payCategory',
            width:'96px',
            render: function (text, record, index) {
                return (
                    <div>
                        {
                            record.payCategory === "1" ? "支付" : record.payCategory === "2" ? "退款" : record.payCategory === "3" ? "退押金" : record.payCategory === "4" ? "支付房东" : null
                        }
                    </div>
                )

            }
        },{
            title: '支付状态',
            dataIndex: 'state',
            key: 'state',
            width:'96px',
            render: function (text, record, index) {
                return (
                    <div>
                        {
                            record.state === 0 ? "失败" : record.state === 1 ? "成功" : null
                        }
                    </div>
                )

            }
        },{
            title: '支付总金额',
            dataIndex: 'totalFee',
            key: 'totalFee',
            width:'150px'
        },{
            title: '支付返回结果',
            dataIndex: 'remark',
            key: 'remark',
            width:'150px'
        },{
            title: '支付返回信息',
            dataIndex: 'returnMsg',
            key: 'returnMsg',
            width:'150px'
        },{
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:'150px',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
        return (
            <Modal
                visible={moreVisible}
                title="详情"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                footer={[<span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>]}
                width="90%"
            >
                <Table
                    dataSource={this.props.payLogData}
                    bordered
                    scroll={scroll}
                    columns={payLogColumns}
                    rowKey="bookingId"
                    pagination={false}
                />
            </Modal>
        )
    }
}


export default PayLogList