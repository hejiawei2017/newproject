<template>
  <div class="count-down">
    <div class="count-down-item"><span>{{timeObj.h}}</span></div>
    <div class="count-down-space">:</div>
    <div class="count-down-item"><span>{{timeObj.m}}</span></div>
    <div class="count-down-space">:</div>
    <div class="count-down-item"><span>{{timeObj.s}}</span></div>
  </div>
</template>

<script>
  import utils from '@/libs/utils';
  export default {
    name: 'expansion',
    props: {
      time: Number,
    },
    mounted() {
      console.log(this.time);
      if (this.time > 0) {
        this.timeCopy = this.time;
        this.startCountDown();
      }
    },
    data() {
      return {
        timeCopy: 0,
        stop: false,
        timeObj: {}
      }
    },
    methods: {
      startCountDown() {
        this.timeObj = utils.secondsToDHMS(this.timeCopy)||{};
        this.timeCopy = this.timeCopy - 1;
        if (this.stop) {
          return;
        }
        if (this.timeCopy >= 0) {
          setTimeout(_ => {
            this.startCountDown();
          }, 1000)
        } else {
          this.$emit('finish');
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .count-down {
    display: flex;
    align-items: center;
  }
  .count-down-item {
    width: 40px;
    height: 40px;
    background: rgba(109,114,120,1);
    border-radius: 4px;
    opacity: 0.5;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .count-down-space {
    margin: 0 10px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(109,114,120,1);
    line-height: 40px;
  }
</style>
