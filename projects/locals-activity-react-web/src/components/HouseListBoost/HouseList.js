import React, {Component} from 'react'
import adapter from '../../common/adapter'
import './HouseList.css'

export default class HouseList extends Component {
	state = {
		isJumping: false
	}

	// 转跳逻辑
	jumpPage (id) {
		adapter.navigate({url: `/pages/housing/detail/index?houseId=${id}&channel=zhuhai01`})
	}

	render () {
		const list = this.props.houseList || []
		return (
			<div className="houseList">
				{list.map((item) => {
					return (
						<div className="house" key={item.houseId} onClick={this.jumpPage.bind(this, item.houseId)}>
							<div className="houseTop">
								<img src={item.imgPath} alt=""/>
							</div>
							<div className="houseBottom">
								<div className="houseTitle">{item.title}</div>
								<div className="price">
									<img
										src="https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/%E7%BB%84%2042.png"
										alt=""
									/>
									{this.props.isTurned ? (
										<span className="truePrice">
                                            <span className="unit">￥</span>
											{parseInt(item.price * this.props.discount)}
                                        </span>
									) : (
										<span className="truePrice">
                                            <span className="unit">￥</span>
											{item.price}
                                        </span>
									)}
									<span className="standardPrice">
                                        /晚<span className="standard">￥{item.price}</span>
                                    </span>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		)
	}
}
