import React, { Component } from 'react'
import Search from '../../components/search'
import { lotelService } from '../../services'
import {SubTable} from '../../components'
import { Button } from 'antd'
import LotelDrawer from './lotelDrawer'
import {dataFormat} from '../../utils/utils'
import {lotelStatus} from '../../utils/dictionary'


const searchConfig = {
    items: [
        {
            type: 'text',
            name: '店名',
            key: 'shopName',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入店面名称'
        },
        {
            type: 'text',
            name: '城市',
            key: 'city',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入城市名称'
        }
    ]
}
class Lotel extends Component {
    constructor (props) {
        super (props)
        this.state = {
            lotelId: '',
            visible: false,
            mode: 'add',
            searchFields: {}
        }
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                shopName: searchFields.shopName && searchFields.shopName.value,
                city: searchFields.city && searchFields.city.value
            }
        })
    }

    openModal = (mode, record) => {
        this.setState({
            visible: true,
            lotelId: !!record ? record.id : '',
            mode
        })
    }

    onDrawerCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.renderTable()
        })
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }

    render () {
        let self = this
        const columns = [{
            title: 'Lotel编码',
            dataIndex: 'lotelNo',
            key: 'lotelNo',
            width: 150
        }, {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            width: 150
        }, {
            title: '店名',
            dataIndex: 'shopName',
            key: 'shopName',
            width: 150
        }, {
            title: '房源数',
            dataIndex: 'shopCount',
            key: 'shopCount',
            width: 150
        }, {
            title: '添加日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            render: function (val) {
                return <span>{dataFormat(val)}</span>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: function (val) {
                return <span>{lotelStatus[val]}</span>
            }
        }, {
            title: '添加人',
            dataIndex: 'creator',
            key: 'creator',
            width: 150
        }]
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: lotelService.getTable,
            columns: columns,
            refsTab: function (ref) {
                self.tableThis = ref
            },
            rowKey: "id",
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                onClick: function (record) {
                    self.openModal('edit', record)
                },
                text: '编辑'
            }],
            operatBtnWidth: 100,
            operatBtnFixed: 'right',
            searchFields: self.state.searchFields
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={
                        function () {
                            self.openModal('add')
                        }}
                    >
                        新增
                    </Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {this.state.visible ?
                    <LotelDrawer
                        lotelId={this.state.lotelId}
                        lotelNo={this.state.lotelNo}
                        mode={this.state.mode}
                        onCancel={this.onDrawerCancel}
                        visible
                    /> : null }
            </div>
        )
    }
}
export default Lotel
