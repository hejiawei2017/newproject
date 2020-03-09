import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Button, Modal, Radio, DatePicker, Select, Switch, Cascader, Tabs, message} from 'antd'
import { newIncumbentSettingService, newRoleService } from '../../services'
import {SubTable} from '../../components'
import { moveTypeList } from '../../utils/dictionary'
const mapStateToProps = (state, action) => {
    return {}
}
class NewincumbentModal extends Component {
    constructor (props) {
        super (props)
        this.state = {
            editeInfoVisible: false,
            // moveDivVisible: true,
            siteData: [],
            oSiteData: [],
            positionData: [],
            organizationData: [],
            roleData: [],
            siteDataArr: [],
            newOrganizations:[{}]
        }
    }
    componentDidMount (){
    }
    changeState = (obj) => {
        this.setState(obj)
    }
    render () {
        let _this = this
        let { editInfoData, moveDivVisible } = _this.props
        let columnsToWord = [{
            title: '异动人员',
            dataIndex: 'moveEmployeeRealName',
            key: 'moveEmployeeRealName',
            width: 100
        }, {
            title: '操作人',
            dataIndex: 'operationEmployeeRealName',
            key: 'operationEmployeeRealName',
            width: 100
        }, {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 140,
            dataType: 'time',
            fmt: 'YYYY年MM月DD日'
        }, {
            title: '异动类型',
            dataIndex: 'moveType',
            key: 'moveType',
            width: 80,
            dataType: 'select',
            selectData: moveTypeList
        }, {
            title: '异动原因',
            dataIndex: 'moveCause',
            key: 'moveCause',
            width: 100
        }, {
            title: '交接人员',
            dataIndex: 'handoverEmployeeRealName',
            key: 'handoverEmployeeRealName',
            width: 100
        }, {
            title: '原部门',
            dataIndex: 'originalPositions',
            key: 'originalPositions',
            width: 200,
            render: (v, o) =>{
                if(v && v.length > 0){
                    return v.map((item, index)=>{
                        return (<div key={`originalDepartments-originalPositions-${index}`} className="flex">
                            <div className="flex">{o['originalDepartments'] && o['originalDepartments'][index] && o['originalDepartments'][index].fullName ? (o['originalDepartments'][index].fullName + '-' ) : ''}</div>
                            <div className="text-right">{item.name}</div >
                        </div>)
                    })
                }
            }
        }, {
            title: '现部门',
            dataIndex: 'currentPositions',
            key: 'currentPositions',
            width: 200,
            render: (v, o) =>{
                if(v && v.length > 0){
                    return v.map((item, index)=>{
                        return (<div key={`currentDepartments-currentPositions-${index}`} className="flex">
                            <div className="flex">{o['currentDepartments'] && o['currentDepartments'][index] && o['currentDepartments'][index].fullName ? (o['currentDepartments'][index].fullName + '-' ) : ''}</div>
                            <div className="text-right">{item.name}</div >
                        </div>)
                    })
                }
            }
        }]
        const subTableItemToWord = {
            getTableService: newIncumbentSettingService.getMoveTable,
            columns: columnsToWord,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: {
                employeeId: editInfoData ? editInfoData.id : ''
            }
            // orderBy: 'create_time desc',
        }
        return (
            <div className="newIncumbentSetting-page--modal">
                {moveDivVisible && (
                    <Modal
                        title="职位日志"
                        visible={moveDivVisible}
                        className="newIncumbentSetting-modal"
                        width="850px"
                        onCancel={function (){
                            _this.props.changeState({moveDivVisible: false})
                        }}
                        footer={null}
                    >
                       <div>
                            <SubTable
                                {...subTableItemToWord}
                            />
                       </div>
                    </Modal>)
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(NewincumbentModal)