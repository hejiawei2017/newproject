<template>
  <div class="time-line">
    <div class="container">
      <div class="wrap">
        <h3 class="time-line-title">{{ timeLineObj.title }}</h3>
        <div>
          <i class="time-line-icon" @click="moveLeft"
            ><b-icon icon="chevron-left"></b-icon
          ></i>
          <div style="overflow: hidden; margin: 0 30px">
            <div ref="timeLineBox" class="time-line-box">
              <div
                class="time-line-box-year"
                ref="time-line-box-year"
                :class="index % 2 === 0 ? 'bottom' : 'top'"
                v-for="(item, index) in timeLineObj.list"
                :key="index"
                @mouseleave="handleMouseleave(index)"
                @mouseenter="handleMouseenter(index)"
                v-b-popover.hover.bottom="{
                  customClass: 'popover-time-line',
                  content: item.text,
                }"
              >
                {{ item.time }}
              </div>
              <div class="dot-wrap">
                <div
                  v-for="(item, index) in timeLineObj.list.length"
                  :key="index"
                  ref="time-line-box-dot"
                  class="time-line-box-dot"
                ></div>
              </div>
            </div>
          </div>
          <i class="time-line-icon" @click="moveRight"
            ><b-icon icon="chevron-right"></b-icon
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeLine",
  props: {
    timeLineObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      translateX: 0,
    };
  },
  methods: {
    moveLeft() {
      this.translateX = this.translateX + 200;
      if (this.translateX > 0) {
        this.translateX = 0;
      }
      this.$refs.timeLineBox.style.transform = `translateX(${this.translateX}px)`;
    },
    moveRight() {
      const width = this.timeLineObj.list.length * 70;
      this.translateX = this.translateX - 200;
      this.$refs.timeLineBox.style.transition = "transform .3s";
      if (this.translateX < -width) {
        this.$refs.timeLineBox.style.transition = "transform .1s";
        this.translateX = 0;
      }
      this.$refs.timeLineBox.style.transform = `translateX(${this.translateX}px)`;
    },
    handleMouseenter(index) {
      this.$refs["time-line-box-year"][index].classList.add("active");
      this.$refs["time-line-box-dot"][index].classList.add("active");
      console.log( "移入")
    },
    handleMouseleave(index) {
      this.$refs["time-line-box-year"][index].classList.remove("active");
      this.$refs["time-line-box-dot"][index].classList.remove("active");
      console.log("移出");
    },
  },
};
</script>

<style scoped lang="scss">
body {
  .popover.b-popover.popover-time-line {
    width: 190px;
    opacity: 0.7;
  }
}
</style>
