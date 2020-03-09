import React, { Component, Fragment } from 'react'
import { hotHouseService } from '../../services'
import { Button, message, Form, Table } from 'antd'
import Search from '../../components/search'
import { pageOption, checkKey } from '../../utils/utils'
import EditModal from './editModal'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '城市',
            key: 'name',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入城市'
        },
        {
            type: 'select',
            name: '是否热门',
            key: 'heat',
            defaultValue: '',
            placeholder: '是/否',
            renderSelectData: {
                1: '是',
                0: '否'
            },
            selectData: [
                {value: 1, text: '是'},
                {value: 0, text: '否'}
            ]
        }
    ]
}

class HotHouseForm extends Component {
    constructor () {
        super()
        this.state = {
            tableDate: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            editType: 'add',
            editModalVisible: false,
            editFrom: {},
            searchFields: {},
            loading: false,
            btnLoading: false
        }
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch = (val) => {
        this.setState({
            pageNum: 1,
            searchFields: {
                nameLike: val.name.value,
                heat: val.heat.value
            }
        }, this.renderTable)
    }
    immediateEffect = () => {
        this.setState({btnLoading: true})
        let params = {
            "delHotCache": true
        }
        hotHouseService.immediateEffect(params).then(res => {
            message.success('立即生效')
            this.setState({btnLoading: false})
        }).catch(e => {
            message.warning('操作失败')
            this.setState({btnLoading: false})
        })
    }
    renderTable = () => {
        const params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            existCity: false,
            areaLevel: 3,
            ...this.state.searchFields
        }
        this.setState({loading: true})
        hotHouseService.getCityList(params).then((data) => {
            this.setState({
                tableDate: checkKey(data.list),
                totalCount: data.total,
                loading: false
            })
        }).catch((e) => {
            this.setState({loading: false})
            message.warning('无法获取热门房源')
        })
    }
    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    setHeat = (record) => () => {
        let params = {
            id: record.id,
            heat: Number(record.heat) === 1 ? 0 : 1
        }
        this.setState({loading: true})
        hotHouseService.putHouseHeat(params).then(res => {
            this.setState({
                loading: false
            }, this.renderTable)
        }).catch(e => {
            this.setState({loading: false})
            message.warning('设置失败')
        })
    }
    addHeatHouse = record => () => {
        this.stateChange({
            editType: 'add',
            editModalVisible: true,
            editFrom: {
                cityCode: record.code,
                cityName: record.name
            }
        })
    }
    deleteHeatHouse = record => () => {
        this.stateChange({
            editType: 'delete',
            editModalVisible: true,
            editFrom: {
                cityCode: record.code,
                cityName: record.name
            }
        })
    }
    render () {
        const that = this
        const columns = [
            {
                title: '城市',
                dataIndex: 'name'
            },
            {
                title: '是否热门',
                dataIndex: 'heat',
                render: (heat, record) => {
                    if (Number(heat) === 1) {
                        return '是'
                    } else {
                        return '否'
                    }
                }
            },
            {
                title: '操作',
                dataIndex: '',
                render: (text, record) => (
                    <div>
                        <Button
                            size="small"
                            type="primary"
                            onClick={this.setHeat(record)}
                        >
                            {Number(record.heat) === 1 ? '关闭热门' : '开启热门'}
                        </Button>
                        {Number(record.heat) === 1 ? (
                            <Fragment>
                                <Button
                                    size="small"
                                    className="ml10"
                                    type="primary"
                                    onClick={this.addHeatHouse(record)}
                                >添加</Button>
                                <Button
                                    size="small"
                                    className="ml10"
                                    type="danger"
                                    onClick={this.deleteHeatHouse(record)}
                                >查看/删除</Button>
                            </Fragment>
                        ) : null}
                    </div>
                )
            }
        ]
        const _state = this.state
        const pageObj = {
            total: Number(this.state.totalCount || 0 ),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.renderTable)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="mb10 text-right">
                    <Button type="primary" loading={this.state.btnLoading} onClick={this.immediateEffect} >立即生效</Button>
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={_state.tableDate}
                    rowKey="id"
                    pagination={pageObj}
                    onChange={this.sorterChange}
                    loading={this.state.loading}
                />
                {
                    _state.editModalVisible ? (
                        <EditModal
                            _data={_state.editFrom}
                            editType={_state.editType}
                            stateChange={that.stateChange}
                            renderTable={that.renderTable}
                            labelModalSave={that.labelModalSave}
                        />
                    ) : null
                }
            </div>
        )
    }
}

let HotHouse = Form.create()(HotHouseForm)
export default HotHouse
