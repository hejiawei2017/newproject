<template>
  <div class="modal" :class="[visiable ? 'show' : '']" v-show="visiable">
    <div class="modal-container">
      <div class="modal-content">
        {{ content }}
        <slot name="content"></slot>
      </div>
      <div class="modal-bottom" @click="confirm">
        {{ confirmBtn }}
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    },
    confirmBtn: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    confirm(e) {
      this.$emit("confirm", e);
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.58);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal.show {
  background: rgba(0, 0, 0, 0.58);
}

.modal-container {
  width: 540px;
  height: 270px;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
}
.modal-content {
  padding-top: 60px;
  padding-bottom: 43px;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom: 1px solid rgba(240, 240, 240, 1);

  font-size: 28px;
  font-weight: 400;
  color: rgba(5, 28, 44, 1);
}
.modal-bottom {
  height: 86px;
  line-height: 86px;
  text-align: center;

  font-size: 30px;
  font-weight: 400;
  color: rgba(44, 204, 211, 1);
}
</style>
