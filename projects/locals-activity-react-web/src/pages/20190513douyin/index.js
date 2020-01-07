import React from 'react';
import { HashRouter as Router , Route } from 'react-router-dom';
import Inquire from './inquire';
import OrderList from './orderList';
import Order from './order';
import HouseDetail from './houseDetail';
import Complete from './complete';

import lookReason from './lookReason';
import shop from './shop';
import './index.css';

document.title = 'Locals路客精品民宿';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HouseDetail} />
          <Route exact path="/inquire" component={Inquire} />
          <Route exact path="/order/:id" component={Order} />
          <Route exact path="/orderList/:phone" component={OrderList} />
          <Route exact path="/complete/:id/:orderid/:price/:time/:phone" component={Complete} />
          <Route exact path="/lookReason" component={lookReason} />
          <Route exact path="/shop/:id" component={shop} />
        </div>
      </Router>
    );
  }
}

export default App;
