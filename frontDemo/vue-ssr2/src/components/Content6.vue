<template>
  <div class="content6">
    <div class="container">
      <div class="wrap">
        <div class="left">
          <div class="tabs">
            <div
              v-for="(item, index) in $store.state.sourceServer
                .serviceProviderTabs"
              :key="index"
              class="tab-item"
              @click="handleChangeTabs(index,item.catalogid)"
            >
              <span :class="{ active: active === index }">{{
                item.catalogname
              }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ serviceProviderContent.title }}</div>
          <div class="text">
            {{ serviceProviderContent.summary }}
          </div>
          <div class="img-grid" v-for="">
            <img
              :src="BaseImgUrl + serviceProviderContent.imgpathview"
              @error="imgerrorfun"
            />
            <!-- <img src="../assets/img/home/unit.png" alt="" />
            <img src="../assets/img/home/unit.png" alt="" /> -->
          </div>
          <div class="btn-wrap">
            <b-button class="more-btn" to="/institutions">了解更多</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content6",
  data() {
    return {
      active: 0,
      BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
    };
  },
  asyncData: {
    entryServiceProvider(store, data) {
      return store.dispatch("entryServiceProvider", data);
    },
  },
  mounted() {
    this.$options.asyncData.entryServiceProvider(this.$store);
  },
  computed: {
    serviceProviderContent() {
      return (
        (this.$store.state.sourceServer.serviceProviderContent.datas &&
          this.$store.state.sourceServer.serviceProviderContent.datas[0]) ||
        {}
      );
    },
  },
  methods: {
    handleChangeTabs(index,catalogid) {
      this.active = index
      this.$options.asyncData.entryServiceProvider(this.$store, { catalogid });
    },
    imgerrorfun(event) {
      // 图片
      const img = event.srcElement;
      img.src = require("@/assets/img/home/new-tabs-img.png");
      img.onerror = null; // 控制不要一直跳动
    },
  },
};
</script>

<style scoped>
</style>
