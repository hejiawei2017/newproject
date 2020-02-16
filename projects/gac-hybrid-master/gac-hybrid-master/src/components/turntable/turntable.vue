<template>
  <div ref="box" class="turntable-box">
    <div ref="outer" class="outer lottery lotteryContent" :style="outerStyle">
      <img ref="lanrenImg" :src="opts.lanrenImg" />
    </div>
    <div
      ref="lotteryBtn"
      @click="lotteryBtnClick"
      class="inner lotteryBtn start"
      :style="{ backgroundImage: 'url(' + opts.lotteryBtnImg + ')' }"
    ></div>
  </div>
</template>
<script>
import lanrenImg from "@/components/turntable/image/lanren.png";
import lotteryBtnImg from "@/components/turntable/image/arrow.png";
var defaultOpt = {
  lanrenImg: lanrenImg, //转盘图片
  lotteryBtnImg: lotteryBtnImg, //转盘按钮图片
  rotateNum: 5, //转盘转动圈数
  direction: 0, //0为顺时针转动,1为逆时针转动
  lotteryData: [], //抽奖数据
  lotteryCount: 0, //抽奖次数
  totalLotteryCount: 100000, //能抽奖次数
  getDegByUser(selectItem, angle, count) {
    console.log(count);
    return angle;
  }
};
export default {
  name: "turntable",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      opts: {}, //配置
      doing: false, //是否在旋转
      defNum: 0, //转盘需要转动的角度
      outerStyle: {
        "-webkit-transition": "all 5s",
        transition: "all 5s"
      },
      dataDeg: 0,
      lotteryIndex: null
    };
  },
  created() {
    this.opts = Object.assign({}, defaultOpt, this.options);
    this.opts = Object.assign(this.options, this.opts);
  },
  computed: {},
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.defNum = this.opts.rotateNum * 360; //转盘需要转动的角度
      let vm = this;
      vm.$refs.outer.addEventListener("webkitTransitionEnd", () => {
        let degTemp = vm.dataDeg;
        let tempcount = vm.opts.lotteryCount;
        if (vm.opts.direction == 0 && tempcount != 1) {
          vm.outerStyle = Object.assign({
            "-webkit-transition": "none",
            transition: "none",
            "-webkit-transform": `rotate(${degTemp}deg)`,
            transform: `rotate(${degTemp}deg)`
          });
        } else {
          if (tempcount != 1) {
            vm.outerStyle = Object.assign({
              "-webkit-transition": "none",
              transition: "none",
              "-webkit-transform": `rotate(${-degTemp}deg)`,
              transform: `rotate(${-degTemp}deg)`
            });
          }
        }

        vm.selectItem && vm.$emit("lotteryEndHandler", vm.selectItem, vm);
        vm.doing = false;
      });
    },
    goLottery(_deg) {
      //去抽奖
      if (this.doing) {
        return;
      }
      var deg = _deg + this.defNum;
      this.dataDeg = _deg;
      console.log(_deg);
      var realDeg = this.opts.direction == 0 ? deg : -deg;
      this.doing = true;

      this.outerStyle = Object.assign({
        "-webkit-transition": "all 5s",
        transition: "all 5s",
        "-webkit-transform": `rotate(${realDeg}deg)`,
        transform: `rotate(${realDeg}deg)`
      });
      this.opts.lotteryCount++;
    },
    lotteryBtnClick() {
      if (this.doing) {
        this.$emit("disabledHandler", this);
        return;
      }
      this.$emit("clickHandler", this);
    },
    getRandomNum(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    countDeg(litem, readName) {
      let deg = null;
      this.selectItem = litem;
      if (readName) {
        this.selectItem.name = readName;
      }

      let angle = litem.angle;
      angle = this.opts.getDegByUser(litem, angle, this.opts.lotteryCount);
      let min = angle[0] + 5;
      let max = angle[1] - 5;
      angle && (deg = this.getRandomNum(min, max));

      return deg;
    },
    lotteryMove({
      fieldName = null,
      fieldValue = null,
      index = -1,
      readName = ""
    }) {
      if (this.opts.lotteryCount >= this.opts.totalLotteryCount) {
        this.$emit("activeComplete", this);
        return;
      }
      let deg = null;
      if (index !== -1) {
        let litem = this.opts.lotteryData[index];
        deg = this.countDeg(litem, readName);
      } else {
        let litem = this.opts.lotteryData.find(item => {
          if (item[fieldName] == fieldValue) {
            return true;
          }
        });
        deg = this.countDeg(litem, readName);
      }
      if (deg !== null) this.goLottery(deg);
    },
    setOpts(opts) {
      this.opts = Object.assign({}, defaultOpt, this.options, opts);
      this.init();
    }
  }
};
</script>
<style scoped>
.turntable-box {
  width: 300px;
  height: 300px;
}
.turntable-box .outer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
}
.turntable-box .outer img {
  width: 100%;
}
.turntable-box .inner {
  position: relative;
  width: 35%;
  height: 35%;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 2;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
}
.turntable-box .inner.start:active {
  -webkit-transform: translate(-50%, -50%) scale(0.95);
  -moz-transform: translate(-50%, -50%) scale(0.95);
  -ms-transform: translate(-50%, -50%) scale(0.95);
  -o-transform: translate(-50%, -50%) scale(0.95);
  transform: translate(-50%, -50%) scale(0.95);
}
</style>
