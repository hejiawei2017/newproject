import React from 'react';
import './index.css';

class TopBanner extends React.Component {
  render() {
    const { title, url, icon } = this.props;
    return (
      <div className="topBanner">
        {icon ? (
          <div className="haveIcon">
            <img className={icon} src={icon} alt="" />
            <span>{title}</span>
          </div>
        ) : (
          <span className="noIcon">{title}</span>
        )}
        <img className="baseImg" src={url} alt="" />
      </div>
    );
  }
}

export default TopBanner;
