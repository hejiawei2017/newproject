import React from 'react';
import HomePage from './homePage'
import SharePage from './sharePage'
import './index.css';
import { Router, Route, hashHistory } from 'react-router'

class App extends React.Component {
	render() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={HomePage}/>
				<Route path="/sharePage" component={SharePage} />
			</Router>
		);
	}
}

export default App;
