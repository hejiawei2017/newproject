import React from 'react';
import { supportWebp } from '@utils/index';
import './index.css';
import './index.css';

document.title = 'Locals路客精品民宿';

class App extends React.Component {
  swiper = null;

  state = {
    active: 0
  };

  componentDidMount () {

    const that = this;
    // eslint-disable-next-line no-undef
    this.swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      autoHeight: false,
      on: {
        slideChange (eve) {
          that.setState({ active: this.activeIndex });
          document.getElementById('menuid').scrollLeft =
            (this.activeIndex - 2) * document.getElementsByTagName('span')[0].offsetWidth;
        }
      }
    });
  }

  onClickMenuItem = e => {
    this.swiper.slideTo(e.target.dataset.index);
    this.setState({ active: Number(e.target.dataset.index) });
  };

  render () {
    const menus = ['定贵赔差', '有房保障', '安全保障', '卫生整洁', '智能门锁', '专职管家'];
    const widths = ['50%', '78%', '60%', '90%', '93%', '94%']

    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <div className='menu' id='menuid'>
          {menus.map((item, i) => (
            <span
              className={this.state.active === i ? 'active' : null}
              key={item}
              onClick={this.onClickMenuItem}
              data-index={i}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='swiper-container'>
          <div className='swiper-wrapper'>
            {menus.map((item, i) => (
              <div
                className='swiper-slide'
                style={{
                  position: 'relative',
                  backgroundImage: `url(http://oss.localhome.cn//localhomeqy/miniprogrambrandfeature/${i +
                    1}a.png?x-oss-process=image/resize,w_750/${supportWebp ? 'format,webp' : ''})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <img
                  style={{     position: 'absolute',
    bottom: 0,
    left: 0,
    width: widths[i],
    height: 'auto' }}
                  src={`http://oss.localhome.cn//localhomeqy/miniprogrambrandfeature/${i + 1}x.png`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
