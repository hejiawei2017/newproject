import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal } from 'antd'
import Search from '../../components/search'
import {SubTable} from '../../components'
import { newIncumbentSettingService, newPositionSettingService, newOrganizationService } from '../../services'
import { checkType } from '../../utils/utils'
import { sexMap } from '../../utils/dictionary'
import { setArrayToData } from '../../utils/arrayTransform'
import IncumbentModal from "./modal";
const searchConfig = {
    items: [
        {
            type: 'cascader', // 级联选择
            name: '部门名称',
            key: 'organizationId',
            cascaderOpts: []
        }, {
            type: 'select',
            name: '职位名称',
            key: 'positionId',
            searchFilterType: 'string',
            selectData: [],
            defaultValue: '',
            placeholder: ''
        }, {
            type: "text",
            name: "姓名",
            key: "realName",
            searchFilterType: "string",
            defaultValue: "",
            placeholder: ""
        }, {
            type: 'text',
            name: '电话',
            key: 'mobile',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }, {
            type: 'text',
            name: '身份证',
            key: 'idCard',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }
    ]
}

const mapStateToProps = (state, action) => {
    return {}
}
class incumbentSetting extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields: {},
            jobStatus: '2', // [员工状态]1- 在职，2- 离职,
            positionData: [],
            organizationData: [],
            moveDivVisible: false,
            avtiveData: {}
        }
    }
    componentDidMount (){
        this.getPositionList()
        this.getTreeList()
    }
    changeState = (obj) =>{
        this.setState(obj)
    }
    onSearch = (searchFields) => {
        let oId = searchFields.organizationId.value
        this.setState({
            pageNum:1,
            searchFields:{
                organizationId: oId && oId.length > 0 ? oId[oId.length - 1] : '',
                positionId: searchFields.positionId.value,
                realName: searchFields.realName.value,
                mobile: searchFields.mobile.value,
                idCard: searchFields.idCard.value
            }
        }, this.renderTable)
    }
    getPositionList = () => {
        newPositionSettingService.getTable({pageNum: 1, pageSize:20000}).then((e)=>{
            let positionData = e.list
            let positionSelectData = positionData.map((item)=>{
                return {value: item.id, text: item.name}
            })
            this.setState({
                positionData,
                positionSelectData
            })
        })
    }
    getTreeList = () => {
        newOrganizationService.getTable({pageNum: 1, pageSize:20000, statusNotEqual: 0}).then((e)=>{
            let organizationData = setArrayToData(e.list, 'parentId', 'id', 'children',this.changeItem)
            this.setState({
                organizationData
            })
        })
    }
    changeItem = (item)=>{
        return {
            value: item.id,
            label: item.name
        }
    }
    render () {
        let _this = this
        let _state = this.state
        let {addDiaVisible} = _state
        const columns = [{
            title: '员工编号',
            dataIndex: 'memberCode',
            key: 'memberCode',
            width: 100
        }, {
            title: '姓名',
            dataIndex: 'realName',
            key: 'realName',
            width: 100
        }, {
            title: '部门',
            dataIndex: 'organizations',
            key: 'organizations',
            width: 200,
            render: (v)=>{
                if(checkType.isArray(v)){
                    return v.map((i, index)=>{
                        return <p className="mb5" key={`organizations-${i.id}-${index}`}>{i.fullName}</p>
                    })
                }
            }
        }, {
            title: '工作地点',
            dataIndex: 'workplace',
            key: 'workplace',
            width: 100
        }, {
            title: '职位',
            dataIndex: 'positions',
            key: 'positions',
            width: 100,
            render: (v)=>{
                if(checkType.isArray(v)){
                    return v.map((i, index)=>{
                        return <p className="mb5" key={`positions-${i.id}-${index}`}>{i.name}</p>
                    })
                }
            }
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            width: 80,
            dataType: 'select',
            selectData: sexMap
        }, {
            title: '身份证',
            dataIndex: 'idCard',
            key: 'idCard',
            width: 180
        }, {
            title: '私人邮箱',
            dataIndex: 'privateEmail',
            key: 'privateEmail',
            width: 100
        }, {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 140
        }, {
            title: '学历',
            dataIndex: 'education',
            key: 'education',
            width: 100
        }, {
            title: '公司邮箱',
            dataIndex: 'companyEmail',
            key: 'companyEmail',
            width: 100
        }, {
            title: '入职时间',
            dataIndex: 'inductionTime',
            key: 'inductionTime',
            width: 120,
            dataType: 'time',
            fmt: 'YYYY-MM-DD'
        }, {
            title: '合同转正时间',
            dataIndex: 'contractPositiveTime',
            key: 'contractPositiveTime',
            width: 120,
            dataType: 'time',
            fmt: 'YYYY-MM-DD'
        }, {
            title: '合同到期时间',
            dataIndex: 'contractExpireTime',
            key: 'contractExpireTime',
            width: 120,
            dataType: 'time',
            fmt: 'YYYY-MM-DD'
        }, {
            title: '角色',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 120
        }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width: 100,
            fixed: 'right',
            render:(v, record)=>{
                return <div>
                    <Button className="mr10" size="small" type="primary" onClick={function (){_this.changeState({avtiveData: record, moveDivVisible: true})}}>职位日志</Button>
                </div>
            }
        }]
        const subTableItem = {
            getTableService: newIncumbentSettingService.getTableJobStatus,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: {
                ..._state.searchFields,
                jobStatus: _state.jobStatus
            }
            // orderBy: 'create_time desc'
        }
        searchConfig['items'][1]['selectData'] = _state.positionSelectData
        searchConfig['items'][0]['cascaderOpts'] = _state.organizationData
        return (
            <div>
                {(_state.positionData.length > 0 && _state.organizationData.length > 0) && <Search onSubmit={this.onSearch} config={searchConfig}/>}
                <SubTable
                    {...subTableItem}
                />
                {(_state.moveDivVisible) && (
                    <IncumbentModal
                        editInfoData={_state.avtiveData}
                        moveDivVisible={_state.moveDivVisible}
                        // positionData={_state.positionData}
                        // organizationData={_state.organizationData}
                        changeState={this.changeState}
                    />)
                }
            </div>
        )
    }
}

let newIncumbentSetting = Form.create()(incumbentSetting)
export default connect(mapStateToProps)(newIncumbentSetting)
