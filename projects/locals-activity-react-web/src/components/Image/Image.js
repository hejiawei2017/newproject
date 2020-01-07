import React, {Component} from 'react';
import baseUrl from '../../assets/pic_lose.png';

export default class Image extends Component {
	componentDidMount () {
		const that = this
		const img = document.getElementsByClassName('_lazyImage');
		this.eachShowImg(img)
		document.addEventListener('scroll', () => {
			that.eachShowImg(img)
		});
	}

	eachShowImg (img) {
		//滚动条高度+视窗高度 = 可见区域底部高度
		const visibleBottom = window.scrollY + document.documentElement.clientHeight;
		for (let i = 0; i < img.length; i++) {
			const centerY = img[i].offsetTop
			if (centerY < visibleBottom) {
				img[i].setAttribute("src", img[i].dataset.src);
				img[i].setAttribute("class", this.props.className || '');
			} else {
				break
			}
		}
	}

	render () {
		const {src, height, width, className} = this.props
		const style = {
			height: height,
			width: width
		}
		return (
			<img className={`${className || ''} _lazyImage`} style={style} ref={this.imgRef} data-src={src}
			     src={baseUrl} alt=""/>
		);
	}
}
