import React, { Component } from 'react'
import { Button, Tree, Icon, Modal, Input, Select, notification, Popconfirm } from 'antd'
import { newOrganizationService } from '../../services'
import { setArrayToData } from '../../utils/arrayTransform'
import './index.less'
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class OrganizationTree extends Component {
    constructor () {
        super()
        this.state = {
            pageNum: 1,
            pageSize: 10000,
            modalVisible: false,
            treeData: [],
            name:'',
            description:'',
            parentId: '0',
            businessCode: '',
            businessType: '1',
            parentIds: [{id:'0', value: '路客精品民宿'}],
            type: 'add',
            treeId: '',
            expandedKeys:[]
        }
        this.tableThis = null
    }
    componentWillMount (){
        this.getTable()
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    resetState = ()=>{
        this.setState({
            modalVisible: false,
            name:'',
            description:'',
            parentId: '0',
            businessCode: '',
            businessType: '1',
            parentIds: [{id:'0', value: '路客精品民宿'}],
            type: 'add',
            treeId: ''
        })
    }
    onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
    }
    getTable = (e)=>{
        let {pageNum, pageSize, expandedKeys} = this.state
        newOrganizationService.getTable({pageNum, pageSize, statusNotEqual: 0}).then((e)=>{
            let treeData = setArrayToData(e.list, 'parentId', 'id', 'child',this.changeItem)
            if(!(expandedKeys.length > 0)){
                this.setState({
                    expandedKeys: [treeData[0].key]
                })
            }
            this.setState({
                treeData
            })
        })
    }
    changeItem (item){
        return {
            title: `${item.code ? (item.code + '-') : ''}${item.name}`
        }
    }
    setTreeData = (e)=>{
        // console.log('setTreeData1', e)
    }
    clickTree = (item, type) =>{
        let parentIds = []
        if(item.parentId)parentIds.push({id:item.parentId, value: '同级'})
        switch (type) {
            case 'edit':
                this.setState({
                    type: 'edit',
                    treeId: item.id,
                    modalVisible: true,
                    name: item.name,
                    isRegion: item.isRegion,
                    description: item.description || '',
                    parentId: item.parentId,
                    businessCode: item.businessCode || '',
                    businessType: item.businessType ? item.businessType.toString() : '1',
                    parentIds: parentIds
                })
                break;
            case 'add':
                parentIds.push({id:item.id, value: '子级'})
                this.setState({
                    type: 'add',
                    modalVisible: true,
                    name: '', // item.name,
                    isRegion: item.isRegion,
                    description: '',
                    parentId: item.parentId,
                    businessCode: '',
                    businessType: '1',
                    parentIds: parentIds
                })
                break;
            case 'remove':
                newOrganizationService.deleteTree(item.id).then(()=>{
                    notification.success({
                        message: '删除成功！'
                    })
                    this.getTable()
                })
                break;
            default:
                break;
        }
    }
    renderTree = (data, region = false) => {
        let _this = this
        let treeData = data || this.state.treeData || []
        let list = treeData.map((item)=>{
            let isRegion = region || item.title.includes('区域')
            region && (item.isRegion = region)
            return (
                <TreeNode
                    title={(
                        <span className="flex">
                            <span>{item.title}</span>
                            <span className="onhover" onClick={function (e){
                                e.stopPropagation();
                                _this.setTreeData(item);
                            }}
                            >
                                <Icon type="form" theme="outlined" onClick={function () {_this.clickTree(item, 'edit')}} />
                                <Icon type="plus-circle" theme="outlined" onClick={function () {_this.clickTree(item, 'add')}} />
                                <Popconfirm title="是否删除?" onConfirm={function (){_this.clickTree(item, 'remove')}} okText="确认" cancelText="取消">
                                    <Icon type="minus-circle" theme="outlined" />
                                </Popconfirm>
                            </span>
                        </span>
                    )}
                    key={item.key}
                >
                    {item && item.child ? this.renderTree(item.child, isRegion) : null}
                </TreeNode>
            )
        })
        return list
    }
    submitTreeData = () =>{
        let {name, description, parentId, businessCode, businessType, treeId, type} = this.state
        if(!name){
            notification.error({
                message: '名称不能为空！'
            })
            return false
        }
        let params = {
            name, description, parentId, businessCode, businessType
        }
        switch (type) {
            case 'add':
                newOrganizationService.addTree(params).then(()=>{
                    notification.success({
                        message: '添加成功！'
                    })
                    this.resetState()
                    this.getTable()
                })
                break;
            case 'edit':
                params.id = treeId
                newOrganizationService.putTree(params).then(()=>{
                    notification.success({
                        message: '修改成功！'
                    })
                    this.resetState()
                    this.getTable()
                })
                break;
            default:
                break;
        }
    }
    onExpandChange = (expandedKeys)=>{
        this.setState({
            expandedKeys
        })
    }
    render () {
        let _this = this
        let {
            treeData,
            expandedKeys,
            modalVisible,
            name,
            description,
            parentId,
            businessCode,
            businessType,
            isRegion,
            parentIds} = _this.state
        return (
            <div className="OrganizationTree-page">
                {/* <div className="mt10 mb20">
                    <Button type="primary" onClick={function (){_this.stateChange({modalVisible: true})}}>新增一级部门</Button>
                </div> */}
                <div>
                    {/* <div className="title">组织架构</div> */}
                        {treeData && (
                        <DirectoryTree
                            expandedKeys={expandedKeys}
                            onExpand={this.onExpandChange}
                            // defaultExpandedKeys={['arrayData-路客精品民宿--0']}
                            // onSelect={this.onSelect}
                        >
                            {this.renderTree()}
                        </DirectoryTree>
                        )}
                </div>
                <Modal
                    title="新增"
                    width="480px"
                    visible={modalVisible}
                    className="newOTreeModal"
                    // onOk={}
                    onOk={function (){_this.submitTreeData()}}
                    onCancel={_this.resetState}
                >
                    <div>
                        <div className="flex">
                            <div className="label">
                                名称：
                            </div>
                            <div className="flex1">
                                <Input value={name} placeholder="请输入" onChange={function (e){_this.stateChange({'name': e.target.value})}}/>
                            </div>
                        </div>
                        {parentId && (<div className="flex mt20">
                            <div className="label">
                                位置：
                            </div>
                            <div className="flex1">
                                <Select value={parentId} onChange={function (e){_this.stateChange({'parentId': e})}}>
                                    {parentIds.map((item)=><Option key={item.id}>{item.value}</Option>)}
                                </Select>
                            </div>
                        </div>)}
                        { isRegion && (
                            <div className="flex mt20">
                                <div className="label">
                                    业务类型：
                                </div>
                                <div className="flex1">
                                    <Select value={businessType} onChange={function (e){_this.stateChange({'businessType': e})}}>
                                        <Option value="1">默认</Option>
                                        <Option value="2">大区</Option>
                                        <Option value="3">BU</Option>
                                    </Select>
                                </div>
                            </div>)}
                        { (isRegion && businessType === '3') && (
                            <div className="flex mt20">
                                <div className="label">
                                    是否挂房：
                                </div>
                                <div className="flex1">
                                    <Select value={businessCode} onChange={function (e){_this.stateChange({'businessCode': e})}}>
                                        <Option value="0">否</Option>
                                        <Option value="1">是</Option>
                                    </Select>
                                </div>
                            </div>)}
                        <div className="flex mt20">
                            <div className="label">
                                描述：
                            </div>
                            <div className="flex1">
                                <Input value={description} placeholder="请输入" onChange={function (e){_this.stateChange({'description': e.target.value})}}/>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default OrganizationTree