<template>
    <div class="content1" :style="contentOne.contentOneStyle">
        <img v-if="contentOne.bgImg" :src="contentOne.bgImg" class="card-img" alt="..." :style="contentOne.bgImgStyle">
        <div :class="contentOne.bgClass">
            <div class="wrap">
                <div class="left" :style="contentOne.leftStyle">
                    <template v-if="contentOne.titleList">
                        <div class="c-tit-list">
                            <span  v-for="(item,index) in contentOne.titleList" :key="index"
                            class="c-tit-item" :class="{'title-bold': item.bold}">{{item.title}}</span>
                        </div>
                    </template>
                    <div v-else class="c-tit">
                        {{contentOne.title}}<span v-if="contentOne.boldTit">{{contentOne.boldTit}}</span>
                    </div>
                    <div v-if="contentOne.title || showLine" :style="contentOne.cLineStyle" class="c-line"></div>
                    <p class="c-txt">
                        {{contentOne.text}}
                    </p>
                    <p class="c-txt" v-if="contentOne.subText">
                        {{contentOne.subText}}
                    </p>
                    <slot name="textBtn"></slot>
                </div>
                <div class="right">
                    <img v-if="contentOne.img" :src="contentOne.img" :style="contentOne.imgStyle" alt="">
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "content1",
    props: {
        contentOne: {
          type: Object,
          required: true
        },
        showLine: {
          type: Boolean,
          default: true
        },
    }
  };
</script>

<style scoped lang="scss">
.c-tit-list {
    text-align: left;
    line-height: 40px;
    white-space: break-spaces;
    .c-tit-item {
        font-size: 48px;
        font-weight: 300;
        color: #FFFFFF;
        &.title-bold {
            font-weight: 700;
        }
    }
}
</style>
