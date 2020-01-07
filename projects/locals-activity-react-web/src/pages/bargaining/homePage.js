import React from "react"
import BargainHeader from "./bargainHeader"
import ScrollList from "./scrollList"
import ActivityRuleIntroduction from "./activityRuleIntroduction"
import ActivityProgressIntroduction from "./activityProgressIntroduction"
import {players} from './players'
import RuleDialog from "./ruleDialog"
import './assets/index.css'

/*活动说明引导页面*/
class HomePage extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			visibleRuleDialog: false,
			allPlayer: players
		}
	}

	changeState = (state) => {
		this.setState(state)
	}

	showRuleDialog = () => {
		this.setState({
			visibleRuleDialog: true
		})
	}

	render () {
		const {visibleRuleDialog, allPlayer} = this.state
		return (
			<div className="bargaining-container">
				{/*头图*/}
				<BargainHeader showRuleDialog={this.showRuleDialog}></BargainHeader>
				<div className="all-container home-container">
					{/*活动规则说明框*/}
					<ActivityRuleIntroduction></ActivityRuleIntroduction>
					{/*大家都在玩*/}
					<ScrollList players={allPlayer}></ScrollList>
					{/*活动流程说明框*/}
					<ActivityProgressIntroduction></ActivityProgressIntroduction>
				</div>
				{visibleRuleDialog && <RuleDialog changeParentState={this.changeState}/>}
			</div>
		)
	}
}

export default HomePage
