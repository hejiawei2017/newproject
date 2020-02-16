<template>
	<div style="text-align:center" class="about-con">
		<!-- <div class="about-title">用户服务协议</div> -->

		<ol class="about-ol">
			<li class="about-li">关于换购原则</li>
		</ol>

		<div
			class="about-p"
		>系统会优先使用积分按照商品加入购物车顺序覆盖，不足部分可付款购买。如账户存有1000积分，顾客购买两个商品，商品1价格为800积分，商品2价格为400积分，用户购买时，商品1需花800积分，商品2需花200积分+20元。</div>
		<div class="about-p">如遇退款，将按照以上支付原则的分配，退积分或退款至兑换账户。</div>
		<ol class="about-ol">
			<li class="about-li">关于退换货规定</li>
		</ol>
		<div class="about-p large">7天无理由退货</div>
		<div class="about-p">
			自物流签收之日起，
			<span class="about-b">在商品完好无损不影响二次销售的情况下，</span>可享受7天退货服务。用户收到商品的次日起算7天内，可通过App/小程序中【我的】-【在线客服】与客服申请退货，HYCAN合创商城自收到退货的商品之日起7天内退积分或退款至兑换账户。
			商品完好无损，是指商品能够保持原有品质、功能， 包括商品本身、包装、配件、赠品（如购买时有赠品）及附带的商标吊牌、使用说明书等齐全 (如在法律法规允许的范围内，申请退换货的商品为成套商品中的一部分如礼盒、礼包，则需退此整套商品）。用户基于查验需要而打开商品包装，或者为确认商品的品质、功能而进行合理、适当的试用不影响商品的完好。超出查验和试用需要而使用商品，导致商品产生明显的价值贬损，视为商品不完好。
			影响二次销售的情况包括：
			1.已穿戴、已洗涤、已染色、脏、污的商品
			2.已加工修改过的商品
			3.商品包装、吊牌、标签、配件缺失或破损的商品。
		</div>
		<ol class="about-ol">
			<li class="about-li">关于运费说明</li>
		</ol>
		<div class="about-p">如发生7天无理由退货，用户退货产生的相应运费由用户承担。不支持运费到付，但法律另有规定的除外。</div>
		<div class="about-p">如因商品质量问题/ 商品少件/破损/发错货等原因，HYCAN合创商城承担用户退换货产生的相应运费。</div>
		<ol class="about-ol">
			<li class="about-li">关于发票说明</li>
		</ol>
		<div class="about-p">现金购买部分可通过App/小程序中【我的】-【在线客服】与客服申请开具发票。</div>
		<ol class="about-ol">
			<li class="about-li">配送范围</li>
		</ol>
		<div class="about-p">中国大陆地区，港澳及海外除外</div>
		<ol class="about-ol">
			<li class="about-li">联系我们</li>
		</ol>
		<div class="about-p">在线客服：周一至周日9:00-22:00</div>
		<div class="about-bottom">最终解释权归HYCAN合创商城所有</div>
	</div>
</template>

<script>
export default {
	name: "about",

	components: {},

	data() {
		return {
			a: 1
		};
	},

	mounted() {},

	watch: {},

	methods: {}
};
</script>

<style lang="scss">
@import "~@/common/scss/base";
.about-ol {
	margin: 0;
	// padding: 0;
}
.about-li {
	list-style: disc;
	font-size: rem(30);
	font-weight: 400;
	color: rgba(34, 34, 34, 1);
	line-height: rem(30);
	margin: rem(30) auto;
	text-align: left;
}
.about-con {
	margin-top: rem(50);
}
.about-bg {
	width: rem(580);
	height: rem(430);
	margin: auto;
	text-align: center;
}
.about-title {
	text-align: center;
	font-size: rem(30);
}
.about-h3 {
	margin: rem(20) auto 0;
	width: rem(630);
	font-size: rem(28);
	font-weight: 400;
	color: rgba(34, 34, 34, 1);
	line-height: rem(60);
	text-align: left;
	text-indent: rem(54);
	word-break: break-all;
	font-weight: bold;
}

.about-p {
	margin: 0 auto rem(30);
	width: rem(680);
	font-size: rem(27);
	font-weight: 400;
	color: rgba(116, 122, 134, 1);
	line-height: rem(54);
	text-align: left;
	word-break: break-all;
}
.about-p.large {
	font-size: rem(30);
	font-weight: 400;
	color: rgba(34, 34, 34, 1);
	line-height: rem(30);
}
.about-b {
	color: #051c2c;
	text-decoration: underline;
}
.about-bottom {
	margin: rem(40) auto 0;
	text-align: center;
	font-size: rem(27);
	color: #666;
}
</style>
