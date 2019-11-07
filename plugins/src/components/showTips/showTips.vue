<template>
  <div class="toast" v-if="!hide" :style="{ opacity: opacity }">{{ innerText }}</div>
</template>
<script>
export default {
  name: "showTips",
  data() {
    return {
      opacity: 0,
      hide: false,
      innerText: "",
      interVal: 3000
    };
  },

  methods: {
    showTips(tips) {
      this.hide = false;
      this.innerText = tips;
      this.$nextTick(() => {
        this.opacity = 1;
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
        }
        this.hideTimeout = setTimeout(() => {
          this.hideTips();
        }, this.interVal);
      });
    },
    hideTips() {
      clearTimeout(this.hideTimeout);
      this.hide = true;
    }
  },

  mounted() {
    setTimeout(() => {
      this.opacity = 1;
    }, 1000);
  }
};
</script>
<style scoped>
.toast {
  position: fixed;
  z-index: 2000;
  left: 50%;
  top: 45%;
  transition: all 0.5s;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  border-radius: 5px;
  color: #fff;
  background: rgba(17, 17, 17, 0.7);
  padding: 15px;
  min-width: 150px;
  opacity: 0;
}
</style>
