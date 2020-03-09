import React, { Component } from 'react'
import { Carousel, Modal} from 'antd';
import {getFixNewImagePrefix} from "../../utils/utils";

import './index.less'


class LayerPhotos extends Component {
    constructor (props) {
        super (props)

        this.state = {
            title: '',
            imgLeft: 0,
            imgIndex: 0,
            prevIndex: true,
            nextIndex: true,
            modalWidth: props.modalWidth || 400,
            imgWidth: !!props.imagesDetail ? (props.imagesDetail.length * 60) : 0,
            imagesDetail: props.imagesDetail || []
        }
        this.goto = this.goto.bind(this)
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
        this.swipeBigPic = null
    }

    goto (e) {
        let nt = parseInt(e.currentTarget.getAttribute("data-key"), 10)
        this.swipeBigPic.goTo(nt)
    }
    prev () {
        this.swipeBigPic.prev()
    }
    next () {
        this.swipeBigPic.next()
    }
    afterChange = (current) => {
        let centerCount = (this.state.modalWidth - 100) / 60 / 2
        if(current <= centerCount){
            this.setState({
                imgLeft: 0
            })
        }else if(current >= this.state.imagesDetail.length - centerCount){
            this.setState({
                imgLeft: (this.state.imagesDetail.length - centerCount * 2) * 60
            })
        }else{
            this.setState({
                imgLeft: (current - centerCount) * 60
            })
        }
        this.setState({
            imgIndex: current
        })
    }
    render () {
        const self = this
        return (
            <Modal title={self.state.title} width={this.state.modalWidth}
                   visible
                   bodyStyle={{ padding: "45px 10px 10px 10px" }}
                   onCancel={self.props.handleCancelPhotos}
                   footer={false}
            >
                {
                    self.state.imagesDetail.length === 0 &&
                    <div style={{margin: 50, textAlign: 'center'}}>
                        暂无图片显示
                    </div>
                }
                <Carousel
                    dots={false}
                    ref={function (res) {
                        self.swipeBigPic = res
                    }}
                    afterChange={this.afterChange}
                >
                    {
                        self.state.imagesDetail.map(function (item, index, key) {
                            return <div className="carousel-img" key={index}>
                                <img className="wsm-full ant-masonry-cell"
                                     src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..."
                                />
                                <div className="img-p">
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        })
                    }
                </Carousel>
                <div className="swiper-dots">
                    <div className="dots-img">
                        <ul style={{ width: self.state.imgWidth + 'px', left: -self.state.imgLeft + 'px' }}>
                            {
                                self.state.imagesDetail.map(function (item, index, key) {
                                    return <li key={index} className={self.state.imgIndex === index ? "active" : ""} data-key={index} data-status="H" onClick={self.goto}>
                                        <img src={getFixNewImagePrefix(item.imgPath)} alt="加载失败..." />
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div>
                        <div className="dots-left" onClick={self.prev}></div>
                        <div className="dots-right" onClick={self.next}></div>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default LayerPhotos
