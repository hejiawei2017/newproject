import React from 'react';
// import swiper from 'swiper/dist/js/swiper.js'
// import 'swiper/dist/css/swiper.min.css'
import './Swiper.css';

import Slider from 'react-slick';

class Swiper extends React.Component {
  state = {
    activeIndex: 0,
  };

  handleChangeActiveIndex = activeIndex => {
    this.setState({ activeIndex });
  };

  render() {
    const { swiperData } = this.props;

    var settings = {
      autoplay: true,
      autoplaySpeed: 900,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="swiper-container">
        <Slider {...settings} className="swiper-wrapper" afterChange={this.handleChangeActiveIndex}>
          {swiperData.map((item, index) => (
            <div className="swiper-slide" key={index}>
              <img src={item} alt="" />
            </div>
          ))}
        </Slider>
        <div className="activeIndex">
          <span>{`${Number(this.state.activeIndex) + 1}/${swiperData.length}`}</span>
        </div>
      </div>
    );
  }
}

export default Swiper;
