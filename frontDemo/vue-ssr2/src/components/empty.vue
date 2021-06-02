<template>
  <div class="empty">
    <slot name="empty-img">
      <img class="empty-img" :src="renderImg" />
    </slot>
      <p class="empty-text">
        <slot name="empty-text"><span>暂时没有数据</span></slot>
      </p>
  </div>
</template>

<script>
import pconfig from '@/p.config'
export default {
  name: 'empty',
  data () {
    return {
      pconfig: pconfig
    }
  },
  computed: {
    renderImg() {
      return require(`@/assets/img/about/${this.pconfig.systemType}-empty.png`)
    }
  }
};
</script>

<style lang="scss" scoped>
.empty {
  margin: auto;
  width: 500px;
  .empty-img {
    width: 100%;
    height: auto;
  }
  .empty-text {
    margin-top: 30px;
    font-size: 24px;
    font-weight: 400;
    color: #252525;
    opacity: 0.8;
  }
}
</style>