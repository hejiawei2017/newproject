import React from 'react';
import {langComPack}  from "./langComPack.js" //key-value配置的组件的包
class LangRepalce extends React.Component {
    constructor(props) {
      super(props);
    }
    state = {
        hasConfigKey:false, //当前语言下是否有配置的标记
        lang:this.props.lang, //当前语言标记
        compoent:null //如果有配置key下的component组件
    }
    componentDidMount(){
       let packConfig = langComPack[this.state.lang]
       //查找当前语言的配置
       if(packConfig){
           //扎到对应的key的组件
           let  compoent  =  packConfigp[this.props.key]
           compoent && this.setState({hasConfigKey:true,compoent:compoent})
       }
    }
    render() {
      return (
        <>
         {/* 如果有配置就输出配置的组件，否则输出原来的结构 */}
         {this.hasConfigKey?this.state.compoent:this.props.children}
        </>
      );
    }
  }
export default LangRepalce


//调用 
{/* <LangRepalce key="key123" >
 原来页面结构
</LangRepalce> */}