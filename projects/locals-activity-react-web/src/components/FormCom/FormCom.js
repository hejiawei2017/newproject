import React, { Component } from 'react';
import axios from 'axios';
import utils from '../../common/utils'
import './FormCom.css';

export default class FormCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      value: '',
      isUploading: false,
      isUploading2: false,
    };
  }
  // 提交信息
  upload(e) {
    this.setState({ isUploading: true });
    if (this.state.isUploading) {
      return;
    }
    // 错误校验
    if(!utils.validator(this.state.value,'phone')){
      alert('请填写正确的手机号！');
      this.setState({ isUploading: false });
      return;
    }
    if (this.state.url === '') {
      alert('未上传图片！');
      this.setState({ isUploading: false });
      return;
    }
    const that = this;
    const _data = {
      phone: that.state.value,
      url: that.state.url,
    };
    axios
      .post('https://i.localhome.cn/api/report/index', {
        activity_id: '1904091747498',
        payload: JSON.stringify(_data),
      })
      .then(function(response) {
        that.props.callback(response.data.success);
        that.setState({ isUploading: false });
      })
      .catch(function(error) {
        console.log(error);
        that.setState({ isUploading: false });
        alert('上传失败');
      });
  }
  // 准备上传，模拟触发
  readyUpload() {
    document.getElementById('file').click();
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  // 上传图片
  handleUpload = e => {
    this.setState({ isUploading2: true });
    if (this.state.isUploading2) {
      return;
    }
    e.preventDefault();
    const that = this;
    let file = e.target.files[0];
    const formdata = new FormData();
    formdata.append('file', file);

    for (var value of formdata.values()) {
      console.log(value);
    }
    const url = 'https://i.localhome.cn/api/upload/img';
    fetch(url, {
      method: 'POST',
      body: formdata,
      mode: 'cors',
    })
      .then(response => {
        if(response){
          response.json().then(function(data) {
            that.setState({
              url: data.url,
            });
          });
        }else{
          alert('上传失败')
        }
        that.setState({ isUploading2: false });
      })
      .catch(error => {
        console.log(error);
        that.setState({ isUploading2: false });
      });
  };
  render() {
    return (
      <div className="form">
        <div className="com">
          <input
            className={this.state.value !== '' ? '' : 'bgInput'}
            type="text"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className="com">
          {this.state.url === '' ? (
            <div>
              {this.state.isUploading2 ? (
                <div className="loadingCom">
                  <span>上传中...</span>
                  <img
                    className="loading"
                    src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/loading.gif"
                    alt=""
                  />
                </div>
              ) : (
                <img
                  onClick={this.readyUpload.bind(this)}
                  className="img"
                  src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjh/btn002.png"
                  alt=""
                />
              )}
            </div>
          ) : (
            <div>
              <span className="uploadSuccess">已成功上传图片</span>
            </div>
          )}
          <input type="file" id="file" accept="image/*" onChange={this.handleUpload.bind(this)} />
        </div>
        <div className="com" onClick={this.upload.bind(this)}>
          <img
            className="img"
            src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/gjh/btn001.png"
            alt=""
          />
        </div>
      </div>
    );
  }
}
