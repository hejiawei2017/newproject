import React from 'react';
import './index.css';

class TopBanner2 extends React.Component {
  render() {
    const {  url } = this.props;
    return (
      <div className="topBanner">
        <img className="baseImg" src={url} alt="" />
      </div>
    );
  }
}

export default TopBanner2;
