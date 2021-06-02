<template>
  <div class="app-show-content">
    <div class="container">
      <div class="wrap">
        <div class="content-left">
          <h3 class="left-title">
            {{ appData.title }}<br />
            <span v-if="appData.title2">{{ appData.title2 }}</span>
          </h3>
          <div class="c-line"></div>
          <p class="content-left-text">{{ appData.contentLeftText }}</p>
          <!-- <div class="more-mini-program-qrcode">
            <img class="more-qrcode-img" :src="appData.positionQrCodeImg" />
            <p class="more-qrcode-text">{{ appData.positionQrText }}</p>
          </div> -->
          <div class="arrow">
            <i class="iconfont icon-consumer-arrow"></i>
          </div>
        </div>
        <div class="content-right">
          <div class="content-dowload-app">
            <div class="dowload-bj">
              <!-- <span class="dowload-btn btn more btn-secondary">立即下载</span> -->
              <img class="dowload-img" :src="appData.qrCodeImg" />
            </div>
            <p class="content-dowload-app-title">{{ appData.appDowTitle }}</p>
            <p class="content-dowload-app-text">{{ appData.appDowText }}</p>
          </div>
          <div class="content-dowload-mini-program">
            <div class="dowload-bj">
              <img class="dowload-img" :src="appData.qrCodeImg" />
            </div>
            <p class="content-dowload-app-title">{{ appData.qrCodeTitle }}</p>
            <p class="content-dowload-app-text">{{ appData.qrCodeText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataSource from "@/assets/dataSource/dataSource";
export default {
  name: "AppShowContent",
  data() {
    return {
      appData: dataSource[process.env.SYSTEM_TYPE].appData,
    };
  },
};
</script>

<style scoped lang="scss">
</style>
