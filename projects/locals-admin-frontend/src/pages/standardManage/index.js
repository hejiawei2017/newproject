import React, { Component } from 'react'
import { standardManageService } from '../../services'
import SubTable from '../../components/subTable'
import Search from '../../components/search'
import EditModal from './editModal'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '关键字',
            key: 'keywords',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入房源编码/房源地址'
        }, {
            type: 'select',
            name: '城市',
            key: 'city',
            selectData: []
        }, {
            type: 'select',
            name: '计划类型',
            key: 'planType',
            selectData: []
        }
    ]
}

class standardManage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            searchFields: {},
            seletType: false,
            editModalVisible: false,
            single: {}
        }
        this.tableThis = null
    }
    componentDidMount () {
        this.renderSelect()
    }
    renderSelect = () => {
        standardManageService.getSelectList().then((res) => {
            let city = [],
                plan = []
            for (let i = 0; i < res.cityAndCode.length; i++ ) {
                city.push({value: res.cityAndCode[i].code, text: res.cityAndCode[i].name})
            }
            for (let i = 0; i < res.typeAndCode.length; i++ ) {
                plan.push({value: res.typeAndCode[i].code, text: res.typeAndCode[i].name})
            }
            searchConfig.items[1].selectData = city
            searchConfig.items[2].selectData = plan
            this.setState({
                seletType: true
            })
        })
    }
    onSearch = (searchFields) => {
        // console.log(searchFields)
        this.setState({
            pageName: 1,
            searchFields: {
                keywords: searchFields.keywords.value,
                city: searchFields.city.value,
                planType: searchFields.planType.value
            }
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    updateBase = (record) => {
        standardManageService.addBase(record).then((res) => {
            this.tableThis.renderTable()
        })
    }
    render () {
        let _this = this
        const {
            searchFields,
            seletType,
            editModalVisible,
            single
        } = this.state
        const columns = [{
            title: 'Lotel',
            dataIndex: 'lotelNo',
            width: 150
        }, {
            title: '投资人姓名电话',
            dataIndex: 'contractNameAndPhone',
            width: 150
        }, {
            title: '计划类型',
            dataIndex: 'planType',
            width: 150
        }, {
            title: '投资城市',
            dataIndex: 'city',
            width: 150
        }, {
            title: '投资回报基准值',
            dataIndex: 'investBaseValue',
            width: 150
        }, {
            title: '合同时间',
            dataIndex: 'startTime',
            width: 150
        }, {
            title: '签约状态',
            dataIndex: 'signStatus',
            width: 150
        }, {
            title: '房源数',
            dataIndex: 'houseCount',
            width: 150
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            dataType: 'time',
            fmt: 'YYYY-MM-DD HH:mm:ss',
            width: 200
        }]
        const subTableItem = {
            getTableService: standardManageService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "planId",
            searchFields: searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10',
                type: "primary",
                onClick: function (record) {
                    _this.setState({
                        editModalVisible: true,
                        single: record
                    })
                },
                text: '设置基准值'
            }],
            operatBtnWidth: 130,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
        }
        return (
            <div>
                {seletType ? <Search onSubmit={this.onSearch} config={searchConfig} /> : null}
                <SubTable {...subTableItem} />
                {editModalVisible ? <EditModal single={single} stateChange={this.stateChange} updateBase={this.updateBase} /> : null}
            </div>
        )
    }
}

export default standardManage