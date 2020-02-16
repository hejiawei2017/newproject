<template>
  <div class="header-container">
    <div class="header">
      <div class="header-left">
        <div class="header-left-icon"></div>
      </div>
      <div class="header-title">{{title}}</div>
      <div class="header-right">
        <div class="header-right-icon"></div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'expansion',
  props: {
    title: String,
    open: Boolean
  },
  mounted() {
    window.document.title = this.title;
  },
  data() {
    return {

    }
  },
  methods: {
    changeState() {

    }
  }
}
</script>
<style lang="scss" scoped>
    .header-container {
      height: 88px;
    }
    .header {
      position: fixed;
      left: 0;
      right: 0;
      line-height: 88px;
      height: 88px;
      .header-left {
        position: absolute;
        left: 0;
        top: 0;
        .header-left-icon {

        }
      }
      .header-title {
        font-size: 36px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(0,0,0,1);
        text-align: center;
      }
      .header-right {
        position: absolute;
        right: 0;
        top: 0;
        .header-right-icon {

        }
      }

    }
</style>
