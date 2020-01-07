import React from "react";
import './assets/bargain-buddy.css'

export default class BargainBuddy extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			isShowAllFriends: false,
			showAllFriendsText: '显示更多'
		}
	}

	toggleAllFriends = (e) => {
		const isShowAllFriends = !this.state.isShowAllFriends
		const showAllFriendsText = isShowAllFriends ? '收起' : '显示更多'
		this.setState({
			showAllFriendsText,
			isShowAllFriends
		})
	}

	render () {
		const {friends, isHelper} = this.props
		const {showAllFriendsText, isShowAllFriends} = this.state
		const isShowToggleBtn = friends.length > 9
		const friendsShow = isShowAllFriends ? friends : friends.slice(0, 9)
		return (
			<div className="bargain-buddy">
				<div className="bargain-buddy-head"></div>
				<div className="bargain-buddy-body">
					{
						!isHelper && friendsShow.length === 0 &&
						<div className="share-buddy-tip">赶快分享给好友，帮你砍价吧~</div>
					}
					{
						isHelper && friendsShow.length === 0 &&
						<div className="share-buddy-tip">赶快帮好友砍价，你也可以拿红包哦~</div>
					}
					{
						friendsShow.map((item, index) => {
							return (
								<div className="buddy" key={index}>
									<img className="buddy-avatar" src={item.avatarUrl} alt=""/>
									<div className="buddy-name">{item.nickName}</div>
									<div
										className="buddy-bargaining-amount">砍掉了<span>{item.bargainPrice}</span>元
									</div>
								</div>
							)
						})
					}
					{
						isShowToggleBtn && <div className="buddy-btn-row">
							<span className="buddy-btn" onClick={this.toggleAllFriends}>{showAllFriendsText}</span>
						</div>
					}
				</div>
			</div>
		)
	}
}
