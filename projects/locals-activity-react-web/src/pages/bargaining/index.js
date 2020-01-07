import React from 'react'
import ActivityPage from './activityPage'
import HomePage from './homePage'
import {Router, Route, hashHistory} from 'react-router'

class App extends React.Component {
	render () {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={HomePage}/>
				<Route path="/activity" component={ActivityPage}/>
			</Router>
		)
	}
}

export default App
