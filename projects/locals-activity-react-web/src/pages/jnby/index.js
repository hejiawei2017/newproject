/**
 * 江南布衣企业商旅活动
 */
import React from 'react';
import HomePageGoldVip from './homePageGoldVip';
import HomePageSilverVip from './homePageSilverVip';
import SuccessPageGoldVip from './successPageGoldVip'
import SuccessPageSilverVip from './successPageSilverVip'
import LandingPage from './landingPage'
import {Router, Route, hashHistory} from 'react-router'

class App extends React.Component {
	render () {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={HomePageGoldVip}/>
				<Route path="/landingPage" component={LandingPage}/>
				<Route path="/success" component={SuccessPageGoldVip}/>
				<Route path="/silver" component={HomePageSilverVip}/>
				<Route path="/successSilver" component={SuccessPageSilverVip}/>
			</Router>
		);
	}
}

export default App;
