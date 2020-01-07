import React from 'react';
import { HashRouter as Router , Route } from 'react-router-dom';
import Detail from './Detail';
import './index.css';
document.title = 'Locals路客精品民宿';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Detail} />
     
        </div>
      </Router>
    );
  }
}

export default App;
