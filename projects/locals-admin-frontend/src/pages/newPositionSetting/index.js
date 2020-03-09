import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Modal, message} from 'antd'
import Search from '../../components/search'
import {SubTable} from '../../components/'
import { newPositionSettingService, newRoleService } from '../../services'
import { pageOption, dataFormat, checkKey } from '../../utils/utils.js'

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '职位名称',
            key: 'name',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }, {
            type: 'text',
            name: '排序',
            key: 'sort',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }
    ]
}

const mapStateToProps = (state, action) => {
    return {}
}
class positionSetting extends Component {
    constructor (props) {
        super (props)
        this.state = {
            roleData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions:pageOption.pageSizeOpts,
            haveAddAuthorDiaVisible: false,
            addDiaVisible: false
        }
    }
    componentDidMount (){

    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                roleNameLike: searchFields.roleNameLike.value
            }
        }, this.renderTable)
    }
    getRoleList = () => {
        let roleData = this.state.roleData
        if(roleData.length > 0){
            return new Promise((resolve, reject)=>{
                resolve(roleData)
            })
        }else{

            return newRoleService.getTable({pageNum: 1, pageSize:20000}).then((e)=>{
                let roleData = e.list
                this.setState({
                    roleData
                })
                return roleData
            })
        }
    }
    render () {
        let _this = this
        let _state = this.state
        const columns = [{
            title: '职位名称',
            dataIndex: 'name',
            key: 'name',
            width: 300
        }, {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            width: 300
        }]
        searchConfig.columns = columns
        const editKeys = {
            name: {
                key: 'name',
                label: '职位名称',
                rules:{
                    required: true
                },
                defaultValue:'',
                placeholder:'请输入'
            },
            sort: {
                key: 'sort',
                label: '排序',
                rules:{
                    required: true
                },
                defaultValue:'',
                element:'number',
                placeholder:'请输入'
            // },
            // role: {
            //     key: 'role',
            //     label: '角色权限',
            //     rules:{
            //         required: true
            //     },
            //     defaultValue: [],
            //     element:'multipleSelect',
            //     loadData: this.getRoleList,
            //     placeholder:'请输入'
            }
        }
        const subTableItem = {
            getTableService: newPositionSettingService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: _state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                type: "primary",
                className: 'mr10',
                visible: (record) => record.name,
                editKeys: {...editKeys,
                    id:{
                        key: 'id',
                        noVisible: true,
                        defaultValue:''
                    }},
                text: '编辑'
            }, {
                label: 'delete',
                size: "small",
                className: 'mr10',
                onClick: (record) => newPositionSettingService.deletePosition(record.id),
                text: '删除'
            }],
            operatBtnWidth: 160,
            editFNService: newPositionSettingService.putPosition,
            // editExtraKeys: {
            //     key: 123
            // },
            // orderBy: 'create_time desc',
            headerDom: {
                otherDom: null,
                addButton:{
                    name: '新增职位',
                    addKeys: editKeys,
                    extraKeys:{
                        // key: 123
                    },
                    addFN: newPositionSettingService.addPosition
                }
            }
        }
        return (
            <div>
                {/* <Search onSubmit={this.onSearch} config={searchConfig}/> */}
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}

let NewPositionSetting = Form.create()(positionSetting)
export default connect(mapStateToProps)(NewPositionSetting)
