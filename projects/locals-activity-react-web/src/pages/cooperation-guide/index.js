import React from 'react'
import './index.css'
import Insert from './Insert'
import utils from '../../common/utils'
import mShare from '../../common/share'
const TITLE = '路客HOTELS品牌手册'

new mShare({
  title: TITLE,
  url: window.location.href,
  desc: '',
  img:
    'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/share_icon.jpg'
})
class App extends React.Component {
  constructor () {
    super()
    utils.setTitle(TITLE)
  }
  render () {
    return (
      <div className="app-container">
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/title.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p1.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p2.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p3.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p4.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p5.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p6.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p8.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p9.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p10.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p11.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p12.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p13.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p14.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p15.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p16.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p17.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p18.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p19.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p20.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p21.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p22.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p23.jpg"
          alt=""
        ></img>{' '}
        <img
          className="img-fixwidth"
          src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/cooperation_guide/p24.jpg"
          alt=""
        ></img>{' '}
        <Insert />
      </div>
    )
  }
}

export default App
