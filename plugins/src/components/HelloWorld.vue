<template>
  <div class="container">
    <h3>抽奖插件</h3>
    <turntable
      @clickHandler="clickHandler"
      @lotteryEndHandler="lotteryEndHandler"
      :options="options"
    ></turntable>
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
        lotteryData: [
          //抽奖数据
          { name: "三网通流量 10M", id: 1, angle: [0, 30] },
          { name: "iPhone7", id: 2, angle: [30, 90] },
          { name: "三网通流量 30M", id: 3, angle: [90, 150] },
          { name: "话费5元", id: 4, angle: [150, 210] },
          { name: "ipad mini4", id: 5, angle: [210, 270] },
          { name: "话费20元", id: 6, angle: [270, 330] }
        ],
        canLotteryCount: 10000, //能抽奖次数
        getDegByUser(item, angle, count) {
          //用户设定角度
          if (item.id == 1) {
            if (count % 2 == 0) {
              return [0, 30];
            } else {
              return [330, 360];
            }
          }
          return angle;
        }
      }
    };
  },
  props: {
    msg: String
  },
  methods: {
    clickHandler(e) {
      //点击去后台获取中奖数据
      e.lotteryMove({ fieldName: "id", fieldValue: 1 });
    },
    lotteryEndHandler(item) {
      //每次点击按钮抽奖结束回调用
      alert("恭喜你获得" + item.name);
    }
  }
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
