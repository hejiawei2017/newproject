import React from 'react';
import HomePage from './homePage';
import SuccessPage from './successPage'
import {Router, Route, hashHistory} from 'react-router'

class App extends React.Component {
	render () {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={HomePage}/>
				<Route path="/success" component={SuccessPage}/>
			</Router>
		);
	}
}

export default App;
