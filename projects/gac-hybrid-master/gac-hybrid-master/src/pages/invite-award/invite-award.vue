<template>
	<div style="text-align:center;" class="about-con">
		<img class="about-bg" mode="widthFix" src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191105104447182-gc_yqgz%403x.png" />
	</div>
</template>

<script>
export default {
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
.about-con {
	margin-top: rem(60);
	padding: 0 rem(20);
}
.about-bg {
	width: 100%;
	height: 100%;
	margin: auto;
	text-align: center;
}

</style>
