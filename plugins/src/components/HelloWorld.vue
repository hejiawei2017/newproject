<template>
  <div class="container">
    <h3>抽奖插件</h3>
    <turntable
      @clickHandler="clickHandler"
      @lotteryEndHandler="lotteryEndHandler"
      :options="options"
    ></turntable>
    <demo></demo>
  </div>
</template>

<script>
import turntable from "@/components/turntable/turntable.vue";
export default {
  components: { turntable },
  name: "HelloWorld",
  data() {
    return {
      options: {
        rotateNum: 5,
        totalLotteryCount: 100,
        lotteryCount: 0,
        lanrenImg:
          "https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191105110204536-shop_pic_cj_lp%403.png",
        lotteryBtnImg:
          "https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191028161011784-shop_btn_yellow_cj.png",
        lotteryData: [
          //抽奖数据
          { name: "80积分", id: 1, angle: [240, 360] },
          { name: "200积分", id: 2, angle: [0, 120] },
          { name: "免单", id: 3, angle: [120, 240] },
        ],
        getDegByUser(item, angle) {
          //用户设定角度
          if (item.id == 1 && angle.length == 0) {
            return [240, 360];
          }
          if (item.id == 2 && angle.length == 0) {
            return [0, 120];
          }
          if (item.id == 3 && angle.length == 0) {
            return [120, 240];
          }
          return angle;
        },
      },
    };
  },
  props: {
    msg: String,
  },
  methods: {
    clickHandler(e) {
      //点击去后台获取中奖数据
      e.lotteryMove({ fieldName: "id", fieldValue: 1 });
    },
    lotteryEndHandler(item) {
      //每次点击按钮抽奖结束回调用
      alert("恭喜你获得" + item.name);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
