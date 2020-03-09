import React, { Component } from 'react';
import { Button,Icon,message } from 'antd';
import { AAIHouseManagementService } from '../../services';
import TipsDrawer from './sidebarTipsDrawer';
class AAIHouseManagementSidebar extends Component {
    constructor (props) {
        super(props);
        const { config } = this.props;
        this.state = {
            isCommiting:false,
            ifSidebarTipsShow:false
        }
    }
    clickCb (step){
        const {handleSwitch,updateListInfo} = this.props;
        const self = this;
        return function () {
            handleSwitch(step);
            updateListInfo();
        }
    }
    _setState=(key)=>(val)=>()=>{
      this.setState({
          [key]:val
      })
    };
    handleSubmit (){
        // console.log('handleSubmit')
        const self = this;
        return async function () {
            const {houseId,config,finishedStep,apiKeyList} = self.props;
            // const {apiKeyList} = self.state;
            if(apiKeyList.every(key=>key === '' || finishedStep.includes(key))){
                if(!self.state.isCommiting){
                    self.setState({isCommiting:true});
                    const res = await AAIHouseManagementService.postPublish(houseId).catch(err=>{
                        self.setState({isCommiting:false});
                        message.error('提交失败');
                        return {error:true}
                    });
                    if( !res.error){
                        self.setState({isCommiting:false});
                        message.success('更新成功');
                    }
                }else {
                    message.info('正在提交')
                }
            }else {
                const unfinishedList = apiKeyList.filter(key=>!finishedStep.includes(key));
                const keyList = [...new Set(config.filter(val=>val.apiKey.some(key=>unfinishedList.includes(key)))
                    .map(val=>val.text))];
                const warningMsg = `${keyList.join(',')}${keyList.length > 1 ? '等' : ''}未完成，不能提交`;
                message.warning(warningMsg);
            }
        }
    }
    render (){
        const { config,width = 192,finishedStep } = this.props;
        return <div className="inline-flex-box flex-column ui-padding-12" style={{minWidth:`${width}px`, marginRight: 15}} >
            <div className="border-box inline-flex-box flex-column overflow-hidden">{config.map((item,idx)=>(
                <div
                    className={`flex-box padder-v-sm flex-align-center cursor-click option-item  ${item.code === this.props.currentCode ? 'active' : ''}`}
                    onClick={this.clickCb(item.code)} key={`sidebar-item-${idx}`}
                >
                    <Icon type="environment" theme="filled" />
                    <span>{item.text}</span>
                    <span className="text-color-red">{item.apiKey.length && item.apiKey.every(e=>finishedStep.includes(e)) ? '✔' : null}</span>
                </div>
            ))}
            </div>
            <div className="padder-v-sm" onClick={this._setState('ifSidebarTipsShow')(true)}>
                <Icon type="question-circle" theme="filled" />
                预上线&正式上线必填项
            </div>
            <Button onClick={this.handleSubmit()} >提交审核</Button>
            <TipsDrawer
                visible={this.state.ifSidebarTipsShow}
                onClose={this._setState('ifSidebarTipsShow')(false)}
                width={1200}
            />
        </div>
    }
}
export default AAIHouseManagementSidebar
