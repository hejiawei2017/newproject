import React, {Component} from 'react';
import FormCom from '../../components/FormCom/FormCom'
import ShareCom from '../../components/ShareCom/ShareCom'
import adapter from '../../common/adapter'
import './index.css'
document.title='广交会优享服务四重升级'
export default class index extends Component {
  constructor (props) {
    super (props)
    this.state = {
      model: false,
      isSuccess:true
    }
  }
  // 转跳逻辑
  jumpUpgrade(type) {
    adapter.navigate({url:`/pages/activity/upgrade29-201812/index?openfn=${type}?channel=gjh2019`})
  }

  closeModel() {
    this.setState({
      model: false
    })
  }
  callback(msg){
    this.setState({
      isSuccess:msg,
      model:true
    })
  }
  render() {
    return (
      <div className='app' id="app">
        <div className='index' style={this.state.model ? {filter: 'blur(3px)'} : {}}>
          <FormCom callback = { this.callback.bind(this) }></FormCom>
          <ShareCom></ShareCom>
          <div className='upgradeCom'>
            <div className='upgrade black' onClick={this.jumpUpgrade.bind(this,'black')}></div>
            <div className='upgrade gold' onClick={this.jumpUpgrade.bind(this,'gold')}></div>
            <div className='upgrade silver' onClick={this.jumpUpgrade.bind(this,'silver')}></div>
          </div>
        </div>
        {this.state.model &&
          <div className='model'>
            <img className="modelImg" src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjhh5/modelbg.png" alt=''/>
            {this.state.isSuccess ? (
              <div className='modelInfo'>
                <span className='modelTitle'>报名成功</span>
                <span className='__info'>报名成功</span>
                <span className='__info'>我们会尽快审核，请您留意短信通知</span>
              </div>
            ) : (
              <div className='modelInfo'>
                <span className='modelTitle'>报名失败</span>
                <span className='__info'>报名失败</span>
                <span className='__info'>请检查手机号是否填写正确和图片是否上传</span>
              </div>
            )}
            <img className="backBtn" onClick={this.closeModel.bind(this)} src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjhh5/backbtn.png" alt=''/>
          </div>
        }
      </div>
    )
  }
}
