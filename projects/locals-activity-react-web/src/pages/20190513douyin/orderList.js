import React from 'react';
import { withRouter } from 'react-router-dom';
import { phoneOrders } from '../../common/api';
import TopBanner2 from './topBanner2/index';
import './index.css';

const douyinData = require('./douyinData.json');

class OrderList extends React.Component {
  state = {
    url: 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/douyin04/%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8.jpg',
    title: '订单列表',
    data: [],
    orders: [],
    phone: '',
    loading:false,
    noData:false
  };

  componentDidMount() {
    const phone = this.props.match.params.phone;
    const data = douyinData.data;
    this.setState({
      phone,
      data,
    });
    this.getData(phone);
  }

  getData(phone) {
    this.setState({
      loading:true
    })
    phoneOrders(phone)
      .then(res => {
        if (res.success) {
          const orders = res.data.list;
          const data = this.state.data;
          for (let i = 0; i < orders.length; i++) {
              orders[i].data = data[parseInt(orders[i].commodity) - 1].order;
          }
          console.log(orders)
          let noData = orders.length===0?true:false
          this.setState({ orders,noData });
        }
        this.setState({
          loading:false
        })
      })
      .catch(() => {
        this.setState({
          loading:false
        })
        alert('网络错误，请稍后重试！');
        
      });
  }

  jumpPage = (id, order, price, createTime) => {
    window.sessionStorage.orderListin = 1;
    this.props.history.push(`/complete/${parseInt(id)}/${order}/${price}/${createTime}/${this.props.match.params.phone}`);
  };
  render() {
    const { url, title, orders,loading,noData } = this.state;
    return (
      <div className="orderList">
        <TopBanner2 url={url} title={title} />
        {loading && 
          <div className='modal' >
            <div className='payModal'>
              <p>加载中请稍后</p>
            </div>
          </div> 
        }
       { noData && ( <div  className="nodata-tip" style={{'text-align':'center','margin-top':'50px'}}>抱歉您暂时没有订单信息</div>)}
        {orders.map((item, index) => (
          <div className="orders" key={index}>
            <div className="orderTitle">
              <span className="title">{item.data.title}</span>
              <div className="address">
                <img src={require('../../assets/Group.png')} alt="" />
                <span>{item.data.ad}</span>
              </div>
            </div>
            <p className="type">{`${item.data.type}`}</p>
            <p className="price">
              {`￥${item.price} `}
              <span className="priceTime">{`有效期至${item.data.time}`}</span>
            </p>
            <div className="orderNo">
              <span>{`订单号：${item.id}`}</span>
              <span className="orderBtn" onClick={this.jumpPage.bind(this, item.commodity, item.id, item.price, item.createTime)}>
                查看详情
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(OrderList);
