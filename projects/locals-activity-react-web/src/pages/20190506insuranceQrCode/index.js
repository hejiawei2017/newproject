import React from 'react'
import utils from '@common/utils';
import bg from './bg.png'
import './index.css'

class App extends React.Component {
  state = {
    image: ''
  }
  async componentDidMount() {
    const url = window.location.href;
    const { params } = utils.parseURL(url)
    const { qrCode } = params
    this.setState({
      image: decodeURIComponent(qrCode)
    })
  }
  render() {
    const { image } = this.state
    return (
      <div>
        <img className="bg-container" src={bg} alt="背景图" />
        {
          image ? (
            <img className="qrcode" src={image} alt="qrcode" />
          ) : (
            <div className="qrcode">
              获取二维码中...
            </div>
          )
        }
      </div>
    )
  }
}

export default App
  