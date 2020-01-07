import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.css';

class Detail extends React.Component {
  state = {
  };
  componentWillMount(){
     
  }
  componentDidMount() {
 
  }
  // 销毁时进行清理定时器，防止内存泄漏
  componentWillUnmount() {
    
  }
  render() {
    const {} = this.state;  
    return (
      <div className="Detail">
         <div className="Detail-top">
           <img  src={'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190701Extension/extent-top-img.png'}   alt="" />
           <img  src={'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190701Extension/extent-middle-img.png'}   alt="" />
           <img  src={'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/20190701Extension/extend-bottom-img.png'}   alt="" />
         </div> 
      </div>
    );
  }
}

export default withRouter(Detail);
