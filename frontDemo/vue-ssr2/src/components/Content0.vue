<template>
  <div class="content0" :style="contentZero.contentZeroStyle">
    <div class="container">
      <div class="wrap">
        <div class="tit" v-if="contentZero.title">
          <span v-if="contentZero.normalTitle" style="font-weight:300">{{ contentZero.normalTitle }}</span>
          <span>{{ contentZero.title }}</span>
        </div>
        <div class="sub-tit" v-if="contentZero.subTitle">
          {{ contentZero.subTitle }}
        </div>
        <div class="body">
          <div v-for="(item, index) of contentZero.bodyData" :key="index" @click="handleClick(item)">
            <div class="item" :style="contentZero.itemStyle" @mouseover="hoverHandler(item, index)" @mouseout="hoverOut(item,index)" >
              <div class="img-wrap" ref="img-wrap" :class="{ active: item.active }" :style="contentZero.imgStyle" >
                <img :src="item.active ? item.hoverImg : item.img" :style="contentZero.itemImgStyle" />
                <div class="imgText" v-if="item.imgText">
                  {{ item.imgText }}
                </div>
                <img src="@/assets/img/content/arrow.png" class="arrow" v-if="showArrow && index + 1 !== contentZero.bodyData.length" />
              </div>
              <div class="body-wrap">
                <div class="body-tit" v-if="item.tit">
                  {{ item.tit }}
                </div>
                <div class="txt" v-if="item.text" style="white-space: break-spaces;">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content0",
  props: {
    contentZero: {
      type: Object,
      required: true,
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hoverHandler(item, index) {
      this.$nextTick(() => {
        this.contentZero.bodyData.forEach((item) => {
          this.$set(item, "active", false);
        });
        if (this.contentZero.imgStyle.backgroundColor) this.$refs["img-wrap"][index].style["backgroundColor"] = "";
        this.$set(item, "active", true);
      });
    },
    hoverOut(item,index) {
      this.$nextTick(() => {
        if (this.contentZero.imgStyle.backgroundColor) this.$refs["img-wrap"][index].style["backgroundColor"] = this.contentZero.imgStyle.backgroundColor;
        this.$set(item, "active", false);
      });
    },
    handleClick(item){
      this.$emit('itemClick',item)
    }
  },
};
</script>

<style scoped>
</style>
