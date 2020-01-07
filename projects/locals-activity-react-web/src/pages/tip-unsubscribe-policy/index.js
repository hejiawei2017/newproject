import React from 'react'
import './index.css'
document.title = '退订政策'
class App extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="section">
          <div className="section-content">
            <span>
1、在入住日的5天之前（下午三点前）取消预订，可获得全额房费退还。例如，如果入住日期是周五，则需在前一个周日的下午三点之前取消预订；<br/>
2、如果房客提前不到5天取消预订，将退还50%的房费；<br/>
3、如果房客已入住但决定提前退房，那么退订发生24小时后未住宿的天数将退还50%的房费，清洁费将不退还；<br/>
4、预订成功后，取消订单不退还预订服务费。入住日前取消订单，清洁费均可全额退还。<br/>
            </span>
          </div>
        </div>
      </div>
    )
  }
}
                        
export default App
  