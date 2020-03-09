import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, message } from 'antd'
import Search from '../../components/search'
import { SubTable } from '../../components/'
import { setArrayToData } from '../../utils/arrayTransform'
import {
    newPositionSettingService,
    newOrganizationService
} from '../../services'
import { pageOption, dataFormat, checkKey } from '../../utils/utils.js'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '公司手机号',
            key: 'comMobile',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        },
        {
            type: 'rangepicker',
            name: '手机号启用时间',
            key: 'createTimeBegin',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        },
        {
            type: 'text',
            name: '姓名/私人电话',
            key: 'search',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        },
        {
            type: 'cascader',
            name: '使用人区域',
            key: 'organizationId',
            cascaderOpts: [],
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请选择'
        },
        {
            type: 'select',
            name: '使用人职位',
            key: 'positionId',
            searchFilterType: 'string',
            selectData: [],
            defaultValue: '',
            placeholder: ''
        }
    ]
}

const mapStateToProps = (state, action) => {
    return {}
}
class CompanyMobileTable extends Component {
    constructor (props) {
        super(props)
        this.state = {
            logVisible: false,
            activeData: {}
        }
    }
    componentDidMount () {
        this.getPositionList()
        this.getTreeList()
    }
    getTreeList = () => {
        newOrganizationService
            .getTable({ pageNum: 1, pageSize: 20000, statusNotEqual: 0 })
            .then(e => {
                let data = (e.list || []).filter(item => item.id !== '0')
                let organizationData = setArrayToData(
                    e.list,
                    'parentId',
                    'id',
                    'children',
                    this.changeArray
                )
                if (organizationData && organizationData.length > 0) {
                    searchConfig['items'][3].cascaderOpts =
                        organizationData[0].children
                    this.setState({
                        organizationData: organizationData[0].children
                    })
                }
            })
    }
    changeArray = item => {
        return {
            value: item.code,
            label: item.name
        }
    }
    getPositionList = () => {
        newPositionSettingService
            .getTable({ pageNum: 1, pageSize: 20000 })
            .then(e => {
                let positionData = e.list
                let positionSelectData = positionData.map(item => {
                    return { value: item.id, text: item.name }
                })
                searchConfig['items'][4].selectData = positionSelectData
                this.setState({
                    positionSelectData
                })
            })
    }
    onSearch = searchFields => {
        let organizationId = searchFields.organizationId.value
        let createTimeBegin = searchFields.createTimeBegin.value
        this.setState(
            {
                pageNum: 1,
                searchFields: {
                    comMobile: searchFields.comMobile.value,
                    createTimeBegin: createTimeBegin && createTimeBegin[0],
                    createTimeEndEnd: createTimeBegin && createTimeBegin[1],
                    search: searchFields.search.value,
                    organizationId:
                        organizationId &&
                        organizationId[organizationId.length - 1],
                    positionId: searchFields.positionId.value
                }
            },
            this.renderTable
        )
    }
    onCancel = () => {
        this.setState({
            logVisible: false
        })
    }
    render () {
        let _this = this
        let _state = this.state
        const columns = [
            {
                title: '公司手机号',
                dataIndex: 'comMobile',
                key: 'comMobile'
            },
            {
                title: '启用时间',
                dataIndex: 'mobileCreateDate',
                key: 'mobileCreateDate',
                dataType: 'time',
                fmt: 'YYYY年MM月DD日'
            },
            {
                title: '当前使用人-部门-职位-私人电话-启用时间',
                dataIndex: 'opViews',
                key: 'opViews',
                render: (v, o) => {
                    return v.map(i => (
                        <p key={`opViews${i.fullName}`}>{i.fullName || ''}</p>
                    ))
                }
            }
        ]
        searchConfig.columns = columns
        const editKeys = {
            mobile: {
                key: 'mobile',
                label: '公司手机号',
                rules: {
                    required: true
                },
                defaultValue: '',
                placeholder: '请输入'
            }
        }
        const subTableItem = {
            getTableService: newPositionSettingService.getComMobileList,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: 'comMobileId',
            searchFields: _state.searchFields,
            operatBtn: [
                {
                    label: 'button',
                    size: 'small',
                    type: 'danger',
                    className: 'mr10',
                    key: 'log-visible-danger',
                    // visible: (record) => record.name,
                    text: '日志',
                    onClick: record => {
                        _this.setState({ activeData: record, logVisible: true })
                    }
                }
            ],
            operatBtnWidth: 160,
            editExtraKeys: {
                key: 123
            },
            orderBy: 'create_time desc',

            headerDom: {
                otherDom: null,
                addButton: {
                    name: '新增公司手机号',
                    addKeys: editKeys,
                    extraKeys: {
                        // key: 123
                    },
                    addFN: newPositionSettingService.addcComMobile
                }
            }
        }

        console.log('activeData', _state.activeData)
        let logSubTableItem = {
            getTableService: newPositionSettingService.getComMobileHistoryList,
            columns: [
                {
                    title: '使用人',
                    dataIndex: 'applyUserName',
                    key: 'applyUserName'
                },
                {
                    title: '使用起止时间',
                    dataIndex: 'applyDateBegin',
                    key: 'applyDateBegin',
                    render: (v, o) => (
                        <span>
                            {dataFormat(v, 'YYYY年MM月DD日')}-
                            {dataFormat(o.applyDateEnd, 'YYYY年MM月DD日')}
                        </span>
                    )
                }
            ],
            searchFields: { mobileId: _state.activeData.comMobileId },
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            isModal: true,
            rowKey: 'id'
        }
        return (
            <div className="CompanyMobileTable">
                {_state.organizationData &&
                    _state.positionSelectData && (
                        <Search
                            onSubmit={this.onSearch}
                            config={searchConfig}
                        />
                    )}
                <SubTable {...subTableItem} />
                <Modal
                    title="使用日志"
                    visible={_state.logVisible}
                    onCancel={this.onCancel}
                    width="640px"
                    footer={[
                        <Button onClick={this.onCancel} key="modal-footer-btn">
                            关闭
                        </Button>
                    ]}
                >
                    <SubTable {...logSubTableItem} />
                </Modal>
            </div>
        )
    }
}
export default connect(mapStateToProps)(Form.create()(CompanyMobileTable))
