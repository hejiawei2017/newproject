import React, { Component } from 'react'
import { Button, Form, Modal, Row, Col, Input, InputNumber,DatePicker, Select, Cascader, Icon, Checkbox, message, Radio } from 'antd'
import moment from 'moment'
import { checkType } from '../../../utils/utils.js'

import './index.less'
const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker

class EditLabelModalForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editModalVisible: true,
            selectDir: [],
            rangeDis: false,
            subData: {},
            curId: '',
            labelItems: [],
            selectItems:[]
        }
        this.handleSelectLabel =  this.handleSelectLabel.bind(this)
        this.handleAllSelectLabel =  this.handleAllSelectLabel.bind(this)
        this.setAllSelect =  this.setAllSelect.bind(this)
        
    }
    componentWillMount () {
        this.setState({
            labelItems:this.props.labelItems,
            selectItems: this.props.selectItems
        })
    }
    componentDidMount (){
        
    }
    componentWillReceiveProps (nextProps,props){
        if( nextProps.labelItems != null && nextProps.labelItems instanceof Array && nextProps.labelItems.length > 0 ) {
            this.setState({
                labelItems: nextProps.labelItems
            })
        }
        //变更选择项目
        this.setState({
          selectItems: nextProps.selectItems
        })
    }

    handleCancel = () => {
        this.props.handleCancel(false);
    }
    modalEditSave = (values) => {
        this.props.modalEditSave(values,this.props.selectTarget)
    }
    onModalOk = (e) => {
        e && e.preventDefault()
        this.modalEditSave(this.state.selectItems)
    }
    afterClose = ()=>{
       
    }
    setAllSelect(){//全选按钮的选中状态
        let isAllSelect = false;
        if(this.state.selectItems.length==this.state.labelItems.length){
            isAllSelect =true
        }
        return isAllSelect
    }
    setSelect(item){//打开弹框的时候加载已经选中的
        let selectItems = this.state.selectItems
        let id = item.id;
        let hasValue = false
        for(let i=0,l=selectItems.length;i<l;i++){
            if(selectItems[i].id===id){
                hasValue =true;
                break
            }
        }
        return hasValue;
    }
    updateSelectItemStatus(item,checked){
        let labelItems = this.state.labelItems;
        let selectItems = this.state.selectItems
        let findex = 0;
        let finditem = selectItems.find((it,index)=>{
            if(it.id===item.id){
                findex = index
               return true
            }
        });
        if(!checked){
            let arr =[];
           for(var i=0,l=selectItems.length;i<l;i++){
               if(selectItems[i].id!==item.id){
                arr.push(selectItems[i])
               }
           }
           selectItems = arr;
        }else{
            selectItems.push(item)
        }
        this.setState({
            selectItems:[...selectItems]
        });
    }
    handleAllSelectLabel(e){//全选事件
        if(e.target.checked){
            this.setState({selectItems:[...this.state.labelItems]})
        }else{
            this.setState({selectItems:[]})
        }

    }
    handleSelectLabel(e,index,item){//点击选择或者不选择
       this.updateSelectItemStatus(item,e.target.checked);
    }
    renderFormItem = () => {
        const self = this;
        let formItems = this.state.labelItems;
        let formItemList = []
        formItems.map((item,index)=>{
            formItemList.push(<div className='label-select' key={item.id}><Checkbox  checked={this.setSelect(item)} onChange={(e)=>{this.handleSelectLabel(e,index,item)}}>{item.name}</Checkbox></div>)
        })
        return formItemList
    }

    render () {
        const {confirmLoading} = this.state
        const { editModalVisible } = this.props;
        return (
            <Modal
                visible={editModalVisible}
                title={"选择发送标签"}
                onOk={this.onModalOk}
                onCancel={this.handleCancel}
                confirmLoading={confirmLoading}
                cancelText="关闭"
                okText="确认发送"
                afterClose={this.afterClose}
            >
             <div  className="wxlabel-select-box">
                <p  style={this.state.labelItems.length>0?{display:'none'}:{display:'block'}} className="nodata-tip">暂无数据</p>
                <div>
                 <div className='label-select'><Checkbox key={"labeSelectAll"} checked={this.setAllSelect()} onChange={(e)=>{this.handleAllSelectLabel(e)}}>全选</Checkbox></div>
                </div>
                {this.renderFormItem()}
             </div>
            </Modal>
        )
    }
}

let EditLabelModal = Form.create()(EditLabelModalForm)
export default EditLabelModal
