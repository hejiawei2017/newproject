import React, {Component} from 'react'
import { houseContractServise } from '../../services'
import SubTable from '../../components/subTable'
import Search from '../../components/search'
import { Button } from 'antd'
import BatchModal from './batchModal'
import DetailModal from './detailModal'
import LogModal from './logModal'
import AccessoryModal from './accessoryModal'
import { formatMoney } from '../../utils/utils'

const searchConfig = {
    items: [{
        type: 'text',
        name: '合同编号',
        key: 'contractNumber',
        searchFilterType: 'string',
        defaultValue: '',
        placeholder: '请输入合同编号'
    }]
}

class HouseContract extends Component {
    constructor (props) {
        super(props)
        this.state = {
            searchFields: {},
            batchType: false,
            logType: false,
            logData:[],
            detailType: false,
            detailRecord: null,
            accessoryType: false,
            accessoryData: []
        }
    }
    onSearch = (searchFields) => {
        // console.log(searchFields)
        this.setState({
            pageName: 1,
            searchFields: {
                contractNumber: searchFields.contractNumber.value
            }
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    showLogModal = (record) => {
        houseContractServise.getLogs(record.id).then(res => {
            // console.log(res)
            this.setState({
                logType: true,
                logData: res
            })
        })
    }
    showAccessoryModal = (record) => {
        // 74
        houseContractServise.getAttachment(record.id).then(res => {
            // console.log(res)
            this.setState({
                accessoryType: true,
                accessoryData: res
            })
        })
    }
    showDetailModal = (record) => {
        this.setState({
            detailType: true,
            detailRecord: record
        })
    }
    showBatchModal = () => {
        this.setState({
            batchType: true
        })
    }
    onBatch = (val) => {
        // console.log('表单--->', val)
        const { contractNumberStr, signName } = val
        let params = {
            contractNumberStr,
            signName
        }
        houseContractServise.setName(params).then(res => {
            // console.log('res--->', res)
            if (res) {
                this.setState({
                    batchType: false
                })
                this.tableThis.renderTable()
            }
        }).catch(err => console.log(err))
    }
    rowKey = (o, i) => {
        return `${o.id}-${i}`
    }
    render () {
        let _this = this
        const {
            searchFields,
            batchType,
            detailType,
            detailRecord,
            logType,
            logData,
            accessoryType,
            accessoryData
        } = this.state
        const columns = [{
            title: '地址',
            dataIndex: 'address',
            width: 250
        }, {
            title: '审核状态',
            dataIndex: 'status',
            width: 150,
            render: (text, record) => {
                const { status } = record
                switch (status) {
                    case -1:
                    return '已退回'
                    case 0:
                    return '待审核'
                    case 6:
                    return '草稿'
                    case 1:
                    return '已审核'
                    case 2:
                    return '已到账'
                    case 4:
                    return '已解约'
                    default: return '已删除'
                }
            }
        }, {
            title: '区域',
            dataIndex: 'secondparty',
            width: 150
        }, {
            title: '城市',
            dataIndex: 'cityname',
            width: 150
        }, {
            title: '房东归属',
            dataIndex: 'landlordtype',
            width: 150
        }, {
            title: '申报人',
            dataIndex: 'createdby',
            width: 200
        }, {
            title: '房型',
            dataIndex: 'housetype',
            width: 150
        }, {
            title: '房东姓名',
            dataIndex: 'houseownername',
            width: 150
        }, {
            title: '确认到账',
            dataIndex: 'checkamount',
            width: 150,
            render: (t, r) => (<span>{formatMoney(r.checkamount)}</span>)
        }, {
            title: '签约人姓名',
            dataIndex: 'signname',
            width: 150
        }]
        const subTableItem = {
            getTableService: houseContractServise.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: this.rowKey,
            searchFields: searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mr5',
                type: "default",
                onClick: function (record) {
                    _this.showLogModal(record)
                },
                text: '日志'
            }, {
                label: 'button',
                size: "small",
                className: 'mr5',
                type: "default",
                onClick: function (record) {
                    _this.showAccessoryModal(record)
                },
                text: '附件'
            }, {
                label: 'button',
                size: "small",
                className: '',
                type: "primary",
                onClick: function (record) {
                    _this.showDetailModal(record)
                },
                text: '详情'
            }],
            operatBtnWidth: 175,
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right">
                    <Button className="mb10" type="primary" onClick={this.showBatchModal}>批量修改合同签约人姓名</Button>
                </div>
                <SubTable {...subTableItem} />
                <BatchModal onSubmit={this.onBatch} visible={batchType} stateChange={this.stateChange} />
                <LogModal visible={logType} data={logData} stateChange={this.stateChange} />
                <DetailModal visible={detailType} data={detailRecord} stateChange={this.stateChange} />
                <AccessoryModal visible={accessoryType} data={accessoryData} stateChange={this.stateChange} />
            </div>
        )
    }
}

export default HouseContract