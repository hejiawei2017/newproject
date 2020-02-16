<template>
  <div ref="scorllContainer" :style="{height,lineHeight:height}" class="number-scroller">
    <div ref="scorllContent" class="number-scroller-inner">
      <div class="number-scroller-item" :style="{height}" v-for="(item, index) in numbers" :key="index">{{index%10}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'number-scroller',
    components: {

    },
    mounted() {
      let el = this.$refs.scorllContainer;
      this.heightInt = el.clientHeight;
      this.height = this.heightInt+'px';
      this.borderLineBottom = this.$refs.scorllContent.clientHeight;
      this.itemHeight = this.borderLineBottom / 20;
      this.borderLineTop = this.borderLineBottom / 2;
      this.initEv(el);
    },
    data() {
      return {
        heightInt: 82,
        height: '82px',
        swiperOption: {
          direction : 'vertical',
        },
        numbers: new Array(20).fill('1', 100)
      }
    },
    methods: {
      initEv(el) {
        var scrollContent = this.$refs.scorllContent,
          startTop = 0,
          endTop = 0,
          lastTop = 0,
          offsetETop = 0,
          borderLineBottom = this.borderLineBottom,
          itemHeight = this.itemHeight,
          timer = false,
          borderLineTop = this.borderLineTop;
          scrollContent.style = `transform:translateY(${-borderLineTop}px);`;
          lastTop = -borderLineTop;
        el.addEventListener('touchstart', ev => {
          let touche = ev.touches[0];
          startTop = touche.pageY;
          timer = false;
          ev.cancelable && ev.preventDefault();
        }, {passive:false});
        el.addEventListener('touchmove', ev => {
          let touche = ev.touches[0];
          endTop = touche.pageY;
          offsetETop = lastTop + (endTop - startTop) / 1.6;
          if (offsetETop >= 0) {
            offsetETop -= borderLineTop;
            lastTop -= borderLineTop;
          }
          if (offsetETop <= -(borderLineBottom - itemHeight)) {
            offsetETop += borderLineTop;
            lastTop += borderLineTop;
          }
          ev.cancelable && ev.preventDefault();
          scrollContent.style = `transform:translate3d(0,${offsetETop}px,0);`;
        }, {passive:false});
        el.addEventListener('touchend', ev => {
          let touche = ev.changedTouches[0];
          endTop = touche.pageY;
          lastTop = offsetETop;
          let index = Math.round((lastTop / this.heightInt));
          let autoComplete = index * this.heightInt;
          function linear(currentTime, startValue, changeValue, duration) {
            return changeValue * currentTime / duration + startValue;
          }
          let lastTime = Date.now();
          let changeY = autoComplete - lastTop;
          let lastY = lastTop;
          let duration = 200;
          timer = true;
          function show() {
            let changeTime = Date.now() - lastTime;
            let moveY = linear(changeTime, lastY, changeY, duration);
            if (changeTime >= duration) {
              lastTop = offsetETop =  autoComplete;
              scrollContent.style = `transform:translate3d(0,${lastTop}px,0);`;
              timer = false;
              return;
            }
            lastTop = offsetETop = moveY;
            scrollContent.style = `transform:translate3d(0,${lastTop}px,0);`;
            return timer && requestAnimationFrame(show);
          }
          show();
        }, {passive:false})
      },
      startAni() {

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/common/scss/base";
  .number-scroller {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    overflow: hidden;
  }
  .number-scroller-inner {
    width: 100%;
    text-align: center;
  }
  .number-scroller-item {

  }
  .transition {
    transition: transform .2s ease-in-out;
  }
</style>
