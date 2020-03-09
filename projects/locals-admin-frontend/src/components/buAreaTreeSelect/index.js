import React, { Component } from 'react'
import { TreeSelect, Tree } from 'antd'
import {houseSettingService} from '../../services'
import { connect } from "react-redux"

const TreeNode = Tree.TreeNode
/**
 * 级联选择BU大区和BU组件
 * @props disabled 是否禁用选择
 * @props buId 默认选中的BUID, 当需要清空选择框时，传空字符串进来
 * @props placeholder 默认提示
 * @props onChange(areaId,buId) 选中回调函数，返回大区，bu的id
 * @props isSelectArea   是否可以选择大区true为可选，false只能选择BU  默认值为false
 *
 * */
const mapStateToProps = (state, action) => {
    return {
        treeData: state.getAreaAndBuOrganization
    }
}
class BuAreaTreeSelect extends Component {

    constructor (props) {
        super(props)

        this.state = {
            disabled: props.disabled || false,
            areaId: '',
            buId: props.buId || '',
            placeholder: props.placeholder || '请选择BU',
            isSelectArea: props.isSelectArea || false
        }
    }
    componentDidMount (){

        if(this.props.treeData.length === 0) {
            //获取部门信息
            houseSettingService.fetchOrganizations({pageSize: 250}).then((res) => {
                let data = [ ...res.list].sort((a, b)=> a.id - b.id)
                let treeData = this.setTreeToData(data)

                this.props.dispatch({
                    type: 'GET_SECOND_AND_THREE_ORG_TREE',
                    payload: treeData
                })
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.buId !== undefined && nextProps.buId !== this.state.buId) {
            this.setState({buId: nextProps.buId})
        }
    }

    onTreeSelectChange = (value, label, extra) => {
        let buId = ''
        let areaId = ''
        if(!!value) {
            buId = value
            let str = extra.triggerNode.props.eventKey
            let arr = str.split('-')
            areaId = arr[arr.length - 2]
        }
        this.setState({
            areaId,
            buId
        },() => {
            this.props.onChange(areaId,buId)
        })

    }
    setTreeToData = (data, parentId,treeObj = {}) => {

        let treeData = []
        data.map((item)=>{

            item.key = `treedata-${item.name}-${item.parentId || ''}-${item.id}`
            item.child = {}
            item.title = item.name
            if(item.parentId !== '0'){
                let itemIndex = this.treeDataMap(treeObj, item.parentId)
                itemIndex && (itemIndex.child[item.id] = item)
            }else{
                treeObj[item.id] = item
            }
            return item
        })

        treeData = this.forObject(treeObj)

        return treeData
    }
    forObject = (treeObj) => {
        let arr = []
        for (const key in treeObj) {
            let item = treeObj[key]
            if(item.child){
                item.child = this.forObject(item.child)
            }
            arr.push(item)
        }
        return arr
    }
    treeDataMap = (treeObj, parentId) => {
        let arr = Object.keys(treeObj)
        for (const key in treeObj) {
            if(Number(key) === Number(parentId)){
                return treeObj[key]
            }else {
                let mapData = this.treeDataMap(treeObj[key].child, parentId)
                if(mapData)return mapData
            }
        }
    }
    renderTree = (data,parentData) => {
        let treeData = data || this.props.treeData

        let list = treeData.map((item)=>{
            let flag = true
            if(this.state.isSelectArea) {
                //如果开启可以选择大区，就将第一第二级的选择屏幕，开启第三第四级的选择
                if(item.parentId === '0' || item.parentId === '1') {
                    flag = false
                }
            }else {
                //若当前为最后一级时，才能选择
                flag = item.child.length === 0
            }
            return (
                <TreeNode
                    value={item.id}
                    selectable={flag}
                    disabled={this.state.buId === item.id}
                    title={(
                        <span className="flex">
                            <span>{ (item.child.length === 0 && !!parentData) ? parentData.name + '-' : '' }{item.title}</span>
                        </span>
                    )}
                    key={item.key}
                >
                    {item && item.child ? this.renderTree(item.child, item) : null}
                </TreeNode>
            )
        })
        return list
    }
    render () {
        let _this = this
        return (
            <TreeSelect
                disabled={_this.state.disabled}
                value={_this.state.buId}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder={this.state.placeholder}
                allowClear
                onChange={_this.onTreeSelectChange}
            >
                {
                    _this.renderTree()
                }
            </TreeSelect>

        )
    }
}

export default connect(mapStateToProps)(BuAreaTreeSelect)
