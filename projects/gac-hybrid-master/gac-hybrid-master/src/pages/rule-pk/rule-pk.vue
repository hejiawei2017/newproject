<template>
	<div style="text-align:left" class="rule-con">
		<div class="rule-title">一、每日一答</div>
		<div class="quiz-rule-con">
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">1. 每日答对：</span>意向金用户可获得
					<div class="quiz-rule-blue">+5</div>积分，社区用户<div class="quiz-rule-blue">+3</div>积分。
				</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">2. 周末积分翻倍：</span>周六、周日答对，意向金用户可获得<div class="quiz-rule-blue">+10</div>积分，社区用户<div class="quiz-rule-blue">+6</div>积分。
				</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">3. 求援通关：</span>若答题错误，可邀请好友帮忙答题，任一好友在邀请当日成功答对，求援者当日答题
					<div class="quiz-rule-orange">可算为答对，可获得当日积分，并计入连对。</div>
				</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">4. 七天连对大奖：</span>周一至周日7天连对，意向金用户可获得
					<div class="quiz-rule-blue">+20</div>积分额外奖励，社区用户可获得
					<div class="quiz-rule-blue">+10</div>积分。
				</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">5. 一周连对奖励：</span>若未能实现周一至周日7天连对，从周中任一天至周日连续答对，也可获得连对积分奖励，意向金用户按【连对天数
					<div class="quiz-rule-blue">x2</div>积分】计算，社区用户按【连对天数<div class="quiz-rule-blue">x1</div>积分】计算。
				</div>
			</div>
		</div>
		<br/>
		<div class="rule-title">二、答题PK</div>
		<div class="quiz-rule-con">
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">1. 发起PK：</span>每日答题通关后（包括获得援助通关），可向好友发起、朋友圈发起答题PK，比拼答题通关耗时长短。
				</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">2. PK结果及奖励：</span>每人每日可进行3场PK，根据PK对象和PK结果可获得相应积分，单日最高可获得9积分的PK奖励：
				</div>
				<div class="quiz-rule-content">
					a. 与新用户PK获胜：
					<div class="quiz-rule-blue">+3</div>积分
				</div>
				<div class="quiz-rule-content">
					b. 与新用户PK战败/打平：
					<div class="quiz-rule-blue">+1</div>积分
				</div>
				<div class="quiz-rule-content">
					c. 与老用户PK获胜：
					<div class="quiz-rule-blue">+1</div>积分
				</div>
				<div class="quiz-rule-content">
					d. 与老用户PK战败/打平：
					<div class="quiz-rule-blue">+0</div>积分
				</div>
				<div class="quiz-rule-content">※ 新用户：通过分享的PK链接进入完成微信授权登录的用户。</div>
			</div>
			<div class="quiz-rule-p">
				<div class="quiz-rule-content">
					<span style="font-weight:bold;">3.求援通关耗时：</span>求援通关后，也可邀请好友进行PK，但答题耗时为固定值 30 秒。
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "about",

	components: {},

	data() {
		return {};
	},

	mounted() {},

	watch: {},

	methods: {}
};
</script>

<style lang="scss">
@import "~@/common/scss/base";
.rule-con {
	color: #051c2c;
	font-size: rem(28);
	font-family: MicrosoftYaHei;
	line-height: rem(48);
	font-weight: 400;
	margin: rem(60) rem(30);
}
.rule-title {
	font-size: rem(32);
	line-height: rem(50);
	font-family: PingFang SC;
	font-weight: bold;
	margin-bottom: rem(20);
}
.quiz-rule-con {
}
.quiz-rule-p {
	margin-bottom: rem(20);
}
.quiz-rule-content {
}
.quiz-rule-blue {
	color: #2cccd3;
	display: inline;
	margin: 0 rem(5);
}
.quiz-rule-orange {
	color: #ee9b52;
	display: inline;
	margin: 0 rem(5);
}
</style>
