/**
 * 泰熙家企业商旅活动
 */
import React from 'react';
import {Router, Route, hashHistory} from 'react-router'
import HomePageGoldVip from './homePageGoldVip';
import SuccessPageGoldVip from './successPageGoldVip'

class App extends React.Component {
	render () {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={HomePageGoldVip}/>
				<Route path="/success" component={SuccessPageGoldVip}/>
			</Router>
		);
	}
}

export default App;
