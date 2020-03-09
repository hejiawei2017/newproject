import React from 'react'
import { Modal } from 'antd';
import {dataFormat} from "../../utils/utils";
import './index.less'

class cancelModel extends React.Component {
  state = {
    deleteData:{
      id:1,
      name:'大大',
      state: '0',
      type:'2',
      startTime:2,
      endTime:2,
      createTime:2
    }
  }
  onChange = (value) =>{
    this.setState({selValue:value})
  }
  render () {
    const {
      visible, onCancel, onDelete,cancelData
    } = this.props;
    let newState = '';
    if(cancelData.state === 0){
      newState = '待启用'
    }else if(cancelData.state === 1) {
      newState = '已启用'
    }else if(cancelData.state === 2) {
      newState = '已过期'
    }else if(cancelData.state === 3) {
      newState = '已删除'
    }else if(cancelData.state === 4){
      newState = '已取消'
    }
    return (
      <Modal
        visible={visible}
        title="取消订单奖励规则"
        okText="确认取消"
        onCancel={onCancel}
        cancelText="返回"
        onOk={onDelete(cancelData.id)}
      >
        <p className="modelCom">
          <span className="desc">订单奖励规则ID:</span>
          <span className="detail">{cancelData.id}</span>
        </p>
        <p className="modelCom">
          <span className="desc">订单奖励规则名称:</span>
          <span className="detail">{cancelData.name}</span>
        </p>
        <p className="modelCom">
          <span className="desc">规则状态:</span>
          <span className="detail">{newState}</span>
        </p>
        <p className="modelCom">
          <span className="desc">有效期:</span>
          <span className="detail">{dataFormat(cancelData.startTime,"YYYY-MM-DD HH:mm:ss")}-{dataFormat(cancelData.endTime,"YYYY-MM-DD HH:mm:ss")}</span>
        </p>
        <p className="modelCom">
          <span className="desc">单笔订单奖励（元）:</span>
          <span className="detail">{cancelData.bonus}</span>
        </p>
        <p className="modelCom">
          <span className="desc">适用范围:</span>
          <span className="detail">{cancelData.scopeDesc}</span>
        </p>
        <p className="modelCom">
          <span className="desc">创建时间:</span>
          <span className="detail">{dataFormat(cancelData.createTime,"YYYY-MM-DD HH:mm:ss")}</span>
        </p>
      </Modal>
    );
  }
}

export default cancelModel