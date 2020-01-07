import React from 'react';
import { isAndroid, isIOS } from '@utils/index';
import { config } from './config';
import './index.css';
import image_01 from './images/image_01.jpeg'

document.title = 'Locals路客精品民宿';

const IS_ANDROID = isAndroid();
const IS_IOS = isIOS();

class App extends React.Component {
  inputRef = React.createRef()

  state = {
    inputValue: '',
  }
  
  downloadApp() {
    var isWechat =
      navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
    if (IS_ANDROID && isWechat) {
      //在微信中打开
      alert("请点击右上角使用默认浏览器打开。");
      return;
    }

    if (IS_ANDROID) {
      // 安卓包下载地址
      window.location.href = config.androidDownloadUrl;
    } else if (IS_IOS) {
      // 苹果商店链接地址
      window.location.href = config.iosAppstoreUrl
    } else {
      alert("暂不支持，敬请期待~");
    }
  }
  
  setInputValue() {
    let href = config.androidDownloadUrl
    if (IS_ANDROID) {
        // 安卓包下载地址
        href = config.androidDownloadUrl
    } else if (IS_IOS) {
        alert('苹果即将发布，敬请期待。');
        return false;
        // 苹果商店链接地址
        // href = config.iosAppstoreUrl
    }
    this.setState({
      inputValue: href
    })
  }

  preventEvent(event) {
    event.preventDefault();
    return false;
  }

  render() {
    const { inputValue } = this.state;

    return (
      <div>
        <input id="select-input" defaultValue={inputValue} />
        <div className="swiper">
          <img onClick={this.preventEvent} id="image_01" src={image_01} alt="image_01.jpeg" />
          <div onClick={this.downloadApp} className="download" />
        </div>
      </div>
    )
  }
}

export default App
  