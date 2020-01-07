import React from 'react';
import HomePage from './homePage';
import MiniPage from './miniPage'
import {Router, Route, hashHistory} from 'react-router'

class App extends React.Component {
  render () {
    return (
        <Router history={hashHistory}>
          <Route path="/" component={HomePage}/>
          <Route path="/mini" component={MiniPage}/>
        </Router>
    );
  }
}

export default App;
