import React from "react";
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import './assets/scroll-list.css'

export default class ScrollList extends React.Component {
	componentDidMount () {
		new Swiper('.swiper-container', {
			autoplay: true,
			loop: true,
			freeMode: true,
			direction: 'vertical',
			slidesPerView: 3,
			slidesPerGroup: 1,
			allowTouchMove: false
		})
		this.setSlideHeight()
	}

	setSlideHeight () {
		const slides = document.querySelectorAll('.swiper-slide')
		Array.from(slides).forEach(e => e.style.height = '2rem')
	}

	render () {
		const {players} = this.props
		return (
			<div className="all-play-container">
				<div className="swiper-container scroll-container">
					<div className="swiper-wrapper">
						{
							players.map((item, index) => {
								return (
									<div className="swiper-slide" data-id={index} key={index}>
										<div className="player">
											<img className="player-avatar" src={item.avatarUrl} alt=""/>
											<div className="player-name">{item.name}</div>
											{
												item.bargainingAmount === '免单' &&
												<div className="player-bargaining-amount">
													通过活动获得<span>{item.bargainingAmount}</span>
												</div>
											}
											{
												item.bargainingAmount !== '免单' &&
												<div className="player-bargaining-amount">
													通过活动已砍价<span>{item.bargainingAmount}</span>
												</div>
											}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
}
