<template>
  <div id="mapCharts" class="chart-box" :style="styleObj"></div>
</template>

<script>
export default {
  props: {
    chartName: {
      type: String
    },
    chartOption: {
      type: Object,
      default() {
        return {};
      }
    },
    chartConfigureOption: {
      type: Object,
      default() {
        return {};
      }
    },
    styleObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      chartObj: null
    };
  },
  watch: {
    chartConfigureOption: {
      handler(val) {
        // console.log(val)
        if (Object.keys(val).length == 0) {
        } else {
          this.$nextTick(function() {
            this.chartObj.setOption(val);
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    let chartE = document.getElementById('mapCharts');
    this.chartObj = this.$echarts.init(chartE);
    this.chartObj.setOption(this.chartOption);
  }
};
</script>

<style scoped>
.chart-box {
  width: 560px;
  height: 330px;
}
</style>
