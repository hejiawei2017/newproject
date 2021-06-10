<template>
  <div class="three-level-source">
    <div class="container">
      <div class="wrap">
        <h3 class="source-title">三级溯源</h3>
        <ul class="source-tabs">
          <li
            v-for="item in tabsList"
            :key="item.id"
            class="source-tabs-item"
            :class="{ active: active === item.id }"
            @click="handleChangeTabs(item.id)"
          >
            {{ item.text }}
          </li>
        </ul>
        <p class="source-text animate__animated" :class="{ animate__fadeInUpBig: showAnimate }">
          {{ threeText }}
        </p>
        <div class="source-flow animate__animated" :class="{ animate__fadeInUpBig: showAnimate }">
          <span class="source-flow-item source-flow-radius" >开始</span >
            <span
              v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.register }"
              class="source-flow-item source-flow-angle arrow item-hover"
              >注册登记</span
            >
            <span
              v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.inspection }"
              class="source-flow-item source-flow-angle arrow item-hover"
              >工厂实地核查</span
            >
            <span
              v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.issue }"
              class="source-flow-item source-flow-angle arrow item-hover"
              >溯源发布</span
            >
            <span class="source-flow-item source-flow-square"
              ><span class="no-rotate around-arrow">是否<br />公证</span></span
            >
            <span
              v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.notary }"
              class="source-flow-item source-flow-angle around-down-arrow item-hover"
              >线上公证</span
            >
            <span
              v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.apply }"
              class="source-flow-item source-flow-angle position down-arrow item-hover"
              >溯源标识申领</span
            >
          <span
            v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.share }"
            class="source-flow-item source-flow-angle arrow item-hover"
            >数据共享</span
          >
          <span
            v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.queries }"
            class="source-flow-item source-flow-angle arrow item-hover"
            >溯源查询</span
          >
          <span
            v-b-popover.hover.top="{ customClass: 'popover-class', content: threeContentData.application }"
            class="source-flow-item source-flow-angle arrow item-hover"
            >数据应用</span
          >
          <span class="source-flow-item source-flow-radius arrow" >结束</span >
          <div class="source-flow-dashed">
            <span class=" source-flow-top">共建方加入</span>
          </div>
          <div class="source-flow-dashed2">
            <span class=" source-flow-top">溯源办理</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThreeLevelSource",
  data() {
    return {
      active: 0,
      showAnimate: true,
      timeId: null,
      tabsList: [
        {
          id: 0,
          text: "工厂级溯源",
        },
        {
          id: 1,
          text: "贸易商级溯源",
        },
        {
          id: 2,
          text: "口岸级溯源",
        },
      ],
      threeContentData: { // 注册登记,工厂实地核查,溯源发布,溯源标识申领,线上公证,数据共享,溯源查询,数据应用
        register:'注册登记:企业（生产商、品牌商）可使用“全球溯中心公共服务平台”右上方“注册”功能，进行注册登记。',
        inspection:'工厂实地核查：已完成注册登记的企业（生产商、品牌商），可在“全球溯中心公共服务平台”提交工厂实地核查申请，通过检测机构完成工厂实地核查并签发验厂报告。',
        issue:'溯源发布企业（生产商、品牌商）在其参与商品全生命周期过程中会产生海量的多元异构数据，“全球溯中心公共服务平台”支持企业将商品在生产、贸易、流通、消费、消亡等生命周期过程中产生的所有数据（格式范围包括但不限于文本、音频、视频、图片等），通过溯源发布功能进行发布。',
        apply:'溯源标识申领（可选）：企业（生产商、品牌商）可在“全球溯中心公共服务平台”提交溯源标识申请，并由全球溯源中心进行溯源标识统一下发，下发完成后，支持企业通过溯源标识下载功能领取溯源标识。',
        notary:'线上公证：溯源数据发布后，企业（生产商、品牌商）可针对已发布的数据进行线上公证办理。',
        share:'数据共享：企业用户可对自身发布的溯源数据和依据共享规则获得的共享数据，自主制定授权对象和授权数据范围进行数据共享。',
        queries:'溯源查询：办理了工厂级溯源的商品可通过溯源标识等条件查询商品溯源数据。',
        application:'数据应用：企业用户可查看自身发布的溯源数据和通过共享规则获得的共享数据并进行应用。',
      }
    };
  },
  computed: {
    threeText() {
      let text = ""
      if (this.active === 0) {
        text = '工厂级溯源：对生产企业进行审核及现场验核，对于源于该生产企业的商品从生产阶段到出厂流通等环节的原产地、品质和中文标识等信息进行采集、验证，并出具溯源证书的过程。'
      }
      if (this.active === 1) {
        text = '贸易商级溯源 ：以贸易商作为信息采集原点，对进出口商品的原产地、品质等信息进行采集、验证，并出具溯源证书的过程。'
      }
      if (this.active === 2) {
        text = '口岸级溯源：进出口商品抵达口岸后，以口岸为信息采集原点，对进出口商品的原产地、品质等信息进行采集、验证，并出具溯源证书的过程。'
      }
      return text
    }
  },
  mounted () {
    this.hideAnimate()
  },
  methods: {
    handleChangeTabs(id) {
      this.active = id;
      this.hideAnimate()
    },
    hideAnimate() {
      this.showAnimate = true;
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => {
        this.showAnimate = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/_handle.scss';
body {
  .bs-popover-top.popover-class::v-deep {
    border: none;
    .arrow {
      &:after {
        @include border_top_color('border_top_color1');
      }
    }
    .popover-body {
      width: 180px;
      border-radius: 6px;
      @include background_color('background_color1');
      color: #fff;
    }
  }
}
</style>
