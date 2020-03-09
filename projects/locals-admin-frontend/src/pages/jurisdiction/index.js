import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, message} from 'antd'
import SubTable from '../../components/subTable'
import { jurisdictionService } from '../../services'
import {fetchJurisdictionIng,fetchJurisdictionSuccess } from '../../actions/jurisdiction'
import {checkType} from '../../utils/utils'
import EditModal from './editModal'
import Search from '../../components/search'

const mapStateToProps = (state, action) => {
    return {
        delJurisdiction: state.delJurisdiction,
        fetchJurisdiction: state.fetchJurisdiction
    }
}
let searchConfig = {
    items: [
        {
            type: 'text',
            name: 'uri',
            key: 'uriLike',
            searchFilterType: 'string',
            placeholder: '请输入uri'
        },
        {
            type: 'text',
            name: '可访问权限',
            key: 'authCodeLike',
            searchFilterType: 'string',
            placeholder: '请输入可访问权限'
        },
        {
            type: 'select',
            name: '模块',
            key: 'module',
            defaultValue: '',
            selectData: [],
            searchFilterType: 'select',
            placeholder: '请输入模块名称'
        }
    ],
    export: {
        name: '新权限列表数据'
    }
}

class JurisdictionForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{},
            modalVisable:false,
            editType: 'add',
            editModalVisible: false,
            platformData: '',
            platformSelectData: {},
            selectData:[]//接口返回的全部模块和名称，以[{value:'platform',text:'权限名称'}]的形式
        }
        this.stateChange = this.stateChange.bind(this)
        this.handleFetchConfirm = this.handleFetchConfirm.bind(this);
        this.labelModalSave = this.labelModalSave.bind(this);
    }
    componentDidMount () {
        this.getPlatform()
    }
    getPlatform () {
        jurisdictionService.platform().then((data) =>{
            let platformSelectData = {}
            let plt = []
            if(data && checkType.isArray(data)){
                data.map(item => {
                    let params = {
                        value: item.code,
                        text: item.name
                    }
                    plt.push(params)
                    if(item.code && item.name) platformSelectData[item.code] = item.name
                    return item
                })
                this.setState({
                    platformData:data,
                    selectData: [ {value: '', text: '全部'},...plt],
                    platformSelectData
                })
            }
        })
    }
    labelModalSave (data,type) {
        let that = this
        if (type === 'add' || type === undefined) {
            jurisdictionService.add(data).then((e) => {
                message.success('添加成功！')
                that.setState({
                    editModalVisible: false
                }, () => {
                    that.renderTable()
                })
            })
        } else {
            jurisdictionService.update(data).then((e)=> {
                message.success('修改成功！')
                that.setState({
                    editModalVisible: false
                }, () => {
                    that.renderTable()
                })
            })
        }
    }
    renderTable = ()=> {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                uriLike: searchFields.uriLike.value,
                authCodeLike: searchFields.authCodeLike.value,
                module: searchFields.module.value
            }
        }, this.renderTable)
    }
    stateChange (obj, fn) {
        this.setState(obj, () => fn && fn())
    }
    handleFetchConfirm () {
        let self = this
        Modal.confirm({
            title: '刷新缓存',
            content: '确认要刷新？',
            okText: '确认',
            cancelText: '取消',
            onOk: () =>{
                self.props.dispatch(fetchJurisdictionIng())
                jurisdictionService.fetch().then((data) => {
                    self.props.dispatch(fetchJurisdictionSuccess())
                    self.renderTable()
                    message.success('刷新成功')
                }).catch(()=>{
                    self.props.dispatch(fetchJurisdictionSuccess())
                })
            }
        });
    }
    render () {
        let _this = this
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            width: 200
        }, {
            title: '权限名称',
            dataIndex: 'name',
            width: 150
        }, {
            title: '编码',
            dataIndex: 'hash_code',
            width: 150
        },{
            title: 'URI',
            dataIndex: 'uri',
            width: 250
        }, {
            title: '方法',
            dataIndex: 'method',
            width: 150
        }, {
            title: '可访问权限',
            dataIndex: 'authCode',
            width: 150
        }, {
            title: '描述',
            dataIndex: 'description',
            width: 300
        }, {
            title: '模块',
            dataIndex: 'module',
            dataType: 'select',
            selectData: this.state.platformSelectData,
            width: 150
        }]
        // , {
        //     title: '状态',
        //     dataIndex: 'status'
        // }, {
        //     title: '创建时间',
        //     dataIndex: 'createTime',
        //     sorter: true,
        //     sortOrder: 'descend',
        //     dataType: 'time',
        //     fmt: 'YYYY-MM-DD HH:mm:ss'
        // }, {
        //     title: '创建者',
        //     dataIndex: 'creator'
        // }, {
        //     title: '更新人员',
        //     dataIndex: 'updator'
        // }, {
        //     title: '版本时间',
        //     dataIndex: 'timeVersion',
        //     dataType: 'time',
        //     fmt: 'YYYY-MM-DD HH:mm:ss'
        // }
        searchConfig.items[2].selectData = [..._this.state.selectData]
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: jurisdictionService.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mr10',
                type: "primary",
                onClick: function (record) {
                    _this.setState({editModalVisible: true, modalType: 'delete', editFrom: record, editType: 'edit'})
                },
                text: '修改'
            },{
                label: 'delete',
                size: "small",
                type: "primary",
                onClick: (record) => {
                    return jurisdictionService.del(record.id)
                },
                text: '删除'
            }],
            operatBtnWidth: 150,
            sorterKeys: [{
                key: 'createTime', // 触发columns key
                str: 'create_time' // 转换的 key
            }],
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true
            }
            // orderBy: 'create_time desc'
        }
        return (
            <div>
                {/* {_this.state.selectData.length > 0 &&
                    <Search onSubmit={this.onSearch} config={searchConfig} />
                } */}
                {_this.state.selectData.length > 0 ?
                    <Search onSubmit={this.onSearch} config={searchConfig} />
                    :
                    null
                }
                <div className="pt10 mb10 text-right">
                    <Button className="ml10" type="primary" onClick={function () {_this.stateChange({editType: 'add', editModalVisible: true, editFrom: {uri: null, method: null, authCode: null, description: null, module: null, id: null}})}}>新增权限</Button>
                    <Button className="ml10" type="primary" onClick={_this.handleFetchConfirm}>刷新权限</Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {
                    _this.state.editModalVisible ? <EditModal _platformData={_this.state.platformData} _data={_this.state.editFrom} editType={_this.state.editType} stateChange={_this.stateChange} renderTable={_this.renderTable} labelModalSave={_this.labelModalSave} /> : null
                }
            </div>
        )
    }
}

let Jurisdiction = Form.create()(JurisdictionForm)
export default connect(mapStateToProps)(Jurisdiction)
