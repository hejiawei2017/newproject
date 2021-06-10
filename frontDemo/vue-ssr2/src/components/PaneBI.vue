<template>
  <div class="pane-bi" :style="{ marginBottom: panelBiData.halfHeight }">
    <b-card overlay :img-src="panelBiData.bgImg" img-alt="Card Image">
      <b-card-body class="container bi-content">
        <div class="bi-tit">
          <span>{{ panelBiData.title }}</span
          >{{ panelBiData.titleLighter }}
        </div>
        <div class="bi-sub-tit" v-if="panelBiData.subTit">
          {{ panelBiData.subTit }}
        </div>
        <div class="bi-text" v-if="panelBiData.text">
          <p v-for="(p, index) in panelBiData.text" :key="index">{{ p }}</p>
        </div>
      </b-card-body>
    </b-card>

    <div class="num-wrap" :style="{ height: panelBiData.height }">
      <div
        class="bi-total"
        v-for="(line, index) in panelBiData.BIData"
        :key="index"
      >
        <div class="num-total" v-for="(item, idx) in line" :key="idx">
          <div class="item">
            <div class="num">
              <countTo
                :startVal="item.startVal"
                :endVal="item.endVal"
                :duration="item.duration"
              ></countTo>
            </div>
            <span>{{ item.unit }}</span>
            <div class="txt">
              {{ item.txt }}
            </div>
          </div>
        </div>
        <!--<div class="num-total">-->
        <!--<div class="item bro">-->
        <!--<div class="num">-->
        <!--<countTo :startVal='0' :endVal='14974' :duration='10000'></countTo>-->
        <!--</div> <span>家</span>-->
        <!--<div class="txt">-->
        <!--参与的全球企业-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="num-total">-->
        <!--<div class="item bro">-->
        <!--<div class="num">-->
        <!--<countTo :startVal='0' :endVal='605' :duration='10000'></countTo>-->
        <!--</div> <span>亿美元</span>-->
        <!--<div class="txt">-->
        <!--商品货值-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <!--<div class="bi-total">-->
      <!--<div class="num-total">-->
      <!--<div class="item">-->
      <!--<div class="num">-->
      <!--<countTo :startVal='0' :endVal='1680' :duration='10000'></countTo>-->
      <!--</div> <span>万</span>-->
      <!--<div class="txt">-->
      <!--查询人次-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="num-total">-->
      <!--<div class="item bro">-->
      <!--<div class="num"><countTo :startVal='0' :endVal='1000' :duration='10000'></countTo></div> 千万+-->
      <!--<div class="txt">-->
      <!--发码量-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import dataSource from "../assets/dataSource/dataSource";
import countTo from "vue-count-to";
export default {
  name: "PaneBI",
  components: { countTo },
  data() {
    return {
      panelBiData: dataSource[process.env.SYSTEM_TYPE].panelBi || {},
    };
  },
};
</script>

<style scoped>
</style>
