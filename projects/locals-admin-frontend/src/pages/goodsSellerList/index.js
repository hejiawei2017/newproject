import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {goodsSellerService} from '../../services'
import {dataFormat} from '../../utils/utils'
import {message} from 'antd/lib/index'
import {Form, Button} from 'antd'
import EditModal from './editModal'

const defaultFormParams = {
    name: null,
    companyName: null,
    id: null,
    contactName: null,
    phone: null
}

class GoodsSellerList extends Component {
    constructor () {
        super ()
        this.state = {
            formParams: null,
            editModalVisible: false,
            editType: 'add' // value = 'add' or 'edit'
        }
    }

    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }

    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleSubmit = (record) => {
        let that = this;
        that.props.form.validateFields((err, values) => {
            if (!err) {
                let data = values;
                if (that.state.editType === 'add') {
                    goodsSellerService.add(data).then((e) => {
                        message.success('添加成功！')
                        that.setState({
                            editModalVisible: false
                        }, () => {
                            that.renderTable()
                        })
                    })
                } else {
                    data['id'] = record.id
                    goodsSellerService.update(data).then((e) => {
                        message.success('修改成功！')
                        that.setState({
                            editModalVisible: false
                        }, () => {
                            that.renderTable()
                        })
                    })
                }
            }
        })
    }

    handleAddSellerParams = () => {
        this.stateChange({
            editModalVisible: true,
            editType: 'add',
            formParams: JSON.parse(JSON.stringify(defaultFormParams))
        })
    }

    render () {
        let that = this
        const columns = [
            {
                title: '序号', key: 'length', width: 100, render: function (text, record, index) {
                    return (
                        <span>{((that.tableThis.state.pageNum - 1) * 10) + index + 1}</span>
                    )
                }
            },
            {title: '供应商ID', dataIndex: 'id', width: 200},
            {title: '供应商名称', dataIndex: 'name', width: 150},
            {title: '供应商公司全称', dataIndex: 'companyName', width: 200},
            {title: '供应商联系人', dataIndex: 'contactName', width: 150},
            {title: '供应商联系方式', dataIndex: 'phone', width: 200},
            {
                title: '最近修改时间',
                dataIndex: 'timeVersion',
                width: 200,
                render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {title: '创建者', dataIndex: 'creator', width: 200}
        ]
        const subTableItem = {
            getTableService: goodsSellerService.getTable,
            columns: columns,
            refsTab: (ref) => {
                that.tableThis = ref
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mr10',
                type: "primary",
                onClick: record => {
                    that.setState({
                        editModalVisible: true,
                        editType: 'edit',
                        formParams: {
                            name: record.name,
                            companyName: record.companyName,
                            id: record.id,
                            contactName: record.contactName,
                            phone: record.phone
                        }
                    })
                },
                text: '修改'
            }, {
                label: 'delete',
                size: "small",
                type: "primary",
                onClick: record => {
                    return goodsSellerService.del(record.id)
                },
                text: '删除'
            }],
            operatBtnWidth: 150,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
        };
        return (
            <div>
                <div className="text-right padder-v-sm">
                    <Button type="primary"
                        onClick={this.handleAddSellerParams}
                    >新增供应商</Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {this.state.editModalVisible ?
                    <EditModal
                        handleSubmit={this.handleSubmit}
                        stateChange={this.stateChange}
                        form={this.props.form}
                        formParams={this.state.formParams}
                        editType={this.state.editType}
                        editModalVisible={this.state.editModalVisible}

                    /> : null
                }
            </div>
        )
    }
}

GoodsSellerList = Form.create()(GoodsSellerList)
export default GoodsSellerList