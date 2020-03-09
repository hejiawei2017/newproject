import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button} from 'antd'
import Search from '../../components/search'
import {SubTable} from '../../components'
import { newIncumbentSettingService, newPositionSettingService, newOrganizationService } from '../../services'
import IncumbentModal from './modal'
import { checkType } from '../../utils/utils'
import { sexMap } from '../../utils/dictionary'
import { setArrayToData } from '../../utils/arrayTransform'
import './index.less'

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
            type: 'text',
            name: '姓名/电话/身份证',
            key: 'search',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }
    ]
}

const mapStateToProps = (state, action) => {
    return {}
}
class NewIncumbentSetting extends Component {
    constructor (props) {
        super (props)
        this.state = {
            editeInfoVisible: false,
            moveDivVisible: false,
            positionData: [],
            organizationData: [],
            organizationArrData: []
        }
    }
    componentDidMount (){
        this.getPositionList()
        this.getTreeList()
    }
    handleAddUser = () => {
        this.setState({
            departmentId: '',
            positionId: '',
            mobile: '',
            userInfo: {},
            avtiveData: {},
            positionList: [],
            searchFields: {},
            editeInfoVisible: true
        })
    }
    changeState = (obj) =>{
        this.setState(obj)
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
            let data = (e.list || []).filter(item => item.id !== '0')
            let organizationData = setArrayToData(e.list, 'parentId', 'id', 'children',this.changeItem)
            if(organizationData && organizationData.length > 0){
                this.setState({
                    organizationData: organizationData[0].children,
                    organizationArrData: data
                })
            }
        })
    }
    changeItem = (item)=>{
        return {
            value: item.id,
            label: item.name
        }
    }
    submitInfoChangeTable = () => {
        this.setState({
            editeInfoVisible: false,
            moveDivVisible: false
        },()=>{
            this.tableThis.renderTable()
        })
    }
    onSearch = (searchFields) => {
        let oId = searchFields.organizationId.value
        this.setState({
            pageNum:1,
            searchFields:{
                organizationId: oId && oId.length > 0 ? oId[oId.length - 1] : '',
                positionId: searchFields.positionId.value,
                search: searchFields.search.value
            }
        }, this.renderTable)
    }
    render () {
        let _this = this
        let _state = this.state
        const columns = [{
            title: '员工编号',
            dataIndex: 'memberCode',
            key: 'memberCode',
            width: 140
        }, {
            title: '姓名',
            dataIndex: 'realName',
            key: 'realName',
            width: 100
        }, {
            title: '部门/职位',
            dataIndex: 'organizationPositionViews',
            key: 'organizationPositionViews',
            width: 200,
            render: (v)=>{
                if(checkType.isArray(v)){
                    return v.map((i, index)=>{
                        return <p className="mb5" key={`organizations-${i.organizationId}-${i.positionId}`}>{`${i.deptName} / ${i.posName}`}</p>
                    })
                }
            }
        }, {
            title: '工作地点',
            dataIndex: 'workplace',
            key: 'workplace',
            width: 100
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
            title: '私人电话',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 140
        }, {
            title: '公司电话',
            dataIndex: 'comMobile',
            key: 'comMobile',
            width: 140
        }, {
            title: '学历',
            dataIndex: 'education',
            key: 'education',
            width: 100
        }, {
            title: '公司邮箱',
            dataIndex: 'companyEmail',
            key: 'companyEmail'
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
            fixed: 'right',
            width: 150,
            render:(v, record)=>{
                return <div>
                    <Button className="mr10" size="small" type="primary" onClick={function (){_this.changeState({avtiveData: record, moveDivVisible: true})}}>异动</Button>
                    <Button size="small" type="primary" onClick={function (){_this.changeState({avtiveData: record, editeInfoVisible: true})}}>修改</Button>
                </div>
            }
        }]
        const subTableItem = {
            getTableService: newIncumbentSettingService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "memberCode",
            antdTableProps:{
                scroll: {
                    x: 4000
                }
            },
            searchFields: _state.searchFields
            // orderBy: 'create_time desc',
            // headerDom: {
            //     otherDom: <Button onClick={this.handleAddUser} type="primary">设置人员</Button>
            // }
        }
        searchConfig['items'][1]['selectData'] = _state.positionSelectData
        searchConfig['items'][0]['cascaderOpts'] = _state.organizationData
        return (
            <div className="newIncumbentSetting-page">
                {(_state.positionData.length > 0 && _state.organizationData.length > 0) && <Search onSubmit={this.onSearch} config={searchConfig}/>}
                <SubTable
                    {...subTableItem}
                />
                {(_state.editeInfoVisible || _state.moveDivVisible) && (
                    <IncumbentModal
                        editInfoData={_state.avtiveData}
                        editeInfoVisible={_state.editeInfoVisible}
                        moveDivVisible={_state.moveDivVisible}
                        positionData={_state.positionData}
                        organizationArrData={_state.organizationArrData}
                        organizationData={_state.organizationData}
                        changeState={this.changeState}
                        submitInfoChangeTable={this.submitInfoChangeTable}
                    />)
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(NewIncumbentSetting)
