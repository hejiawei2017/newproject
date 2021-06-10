<template>
  <div class="white-book">
    <div class="container">
      <div class="wrap">
        <div class="content-tabs-left">
          <h3 class="left-title">标准与规范</h3>
          <div class="c-line"></div>
          <div class="content-tabs-left-tabs">
            <div
              v-for="(item, index) in $store.state.dataSourceServ.standardsData.datas"
              :key="item.id"
              class="tabs-item"
              @click="handleTabsClick(item.id, index)"
            >
              <span
                class="tabs-item-text"
                :class="{ active: active === item.id }"
                >{{item.title}}</span
              >
            </div>
          </div>
        </div>
        <div
          class="content-tabs-right animate__animated"
          :class="{ animate__fadeInUpBig: showAnimate }"
        >
          <div class="content-header">
            <span class="content-header-left">实时发布</span>
            <span class="content-header-right">
              <img src="@/assets/img/about/doc-tabs-img.png" />
            </span>
          </div>
          <h3 class="content-title">{{activeData.title || $store.state.dataSourceServ.standardsData.datas && $store.state.dataSourceServ.standardsData.datas[0].title}}</h3>
          <div id="bodyText" v-html="activeData.bodytext||$store.state.dataSourceServ.standardsData.datas[0].bodytext" v-if="activeData.bodytext||$store.state.dataSourceServ.standardsData.datas && $store.state.dataSourceServ.standardsData.datas[0].bodytext">
<!--            {{}}-->
          </div>
<!--          <p class="content-text">-->
<!--            监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息-->
<!--          </p>-->
<!--          <p class="content-text-title">消费者反馈信息等商品真实价值信息</p>-->
<!--          <p class="content-text">-->
<!--            监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息-->
<!--          </p>-->
<!--          <p class="content-text-title">消费者反馈信息等商品真实价值信息</p>-->
<!--          <p class="content-text">-->
<!--            监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息，在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息-->
<!--          </p>-->
          <div class="content-bottom">
            <span class="content-name">{{activeData.vpreparename||$store.state.dataSourceServ.standardsData.datas && $store.state.dataSourceServ.standardsData.datas[0].vpreparename||''}}</span>
            <span class="content-time">{{$moment(activeData.predate||$store.state.dataSourceServ.standardsData.datas && $store.state.dataSourceServ.standardsData.datas[0].predate).format('YYYY/MM/DD')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dataSource from '../assets/dataSource/dataSource'
export default {
  name: "DocTabs",
  props:{
    idx: {
      type: Number
    }
  },
  asyncData: {
    getStandardsSpecifications(store) {
      return store.dispatch("fetchStandardsSpecifications",{ord : dataSource[process.env.SYSTEM_TYPE].BZData.ord});
    },
  },
  data() {
    return {
      active: 0,
      activeData: {},
      showAnimate: true,
      timeId: null,
      tabsList: [
        {
          id: 0,
          text: "共建全球溯源体系倡议书",
        },
        {
          id: 1,
          text: "体系标准文件",
        },
      ],
    };
  },
  mounted() {
    console.log(dataSource[process.env.SYSTEM_TYPE].BZData.ord,'hahhahha',this.idx)
    this.hideAnimate();
    this.$options.asyncData.getStandardsSpecifications(this.$store);
    this.$nextTick(()=>{
      console.log(dataSource[process.env.SYSTEM_TYPE].BZData.ord,'hahhahha',this.idx)
    })
  },
  methods: {
    handleTabsClick(id, index) {
      this.active = index;
      this.activeData = this.$store.state.dataSourceServ.standardsData.datas[index];
      console.log(id)
      this.hideAnimate();
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
</style>
