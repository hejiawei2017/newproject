<template>
    <div class="apply-carousel">
        <div class="container">
            <div class="apply-content" v-for="(item,index) in ApplyCarouselData.applyArr" :key="index">
                <div class="left">
                    <div class="apply-tit">
                        {{ApplyCarouselData.title}}<span>{{ApplyCarouselData.titleBold}}</span>
                    </div>
                    <div class="apply-line"></div>
                    <div class="apply-subTit" v-if="item.subTit">
                        {{item.subTit}}
                    </div>
                    <router-link :to="{name:'articlen-information',query:{articleid: ApplyCarouselData.articleid,catalogid:ApplyCarouselData.catalogid}}" style="display: inline-block;" class="apply-txt">
                        {{item.text}}
                    </router-link>
                </div>
                <div class="right">
                    <router-link :to="{name:'articlen-information',query:{articleid: ApplyCarouselData.articleid,catalogid:ApplyCarouselData.catalogid}}" class="apply-txt">
                        <img :src="item.img" class="apply-img" alt=""  @error="imgerrorfun">
                    </router-link>
                </div>
            </div>
            <div class="apply-bottom">
                <b-button-group>
                    <b-button class="btn-center" @click="handleUp"><b-icon icon="chevron-left"></b-icon></b-button>
                    <b-button class="btn-center" @click="handleNext"><b-icon icon="chevron-right"></b-icon></b-button>
                </b-button-group>
                <div class="apply-pagination">
                    <span class="main">
                        {{ ApplyCarouselData.pageNo >= 10 ? ApplyCarouselData.pageNo||'' : `0${ApplyCarouselData.pageNo||''}` }}
                    </span>/
                    <span>
                        {{ ApplyCarouselData.pageSumCount >= 10 ? ApplyCarouselData.pageSumCount||'' : `0${ApplyCarouselData.pageSumCount||''}` }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import dataSource from '../assets/dataSource/dataSource'
  export default {
    name: "ApplyCarousel",
    props: {
        applyData:{
            type: Object,
            default:()=>({})
        }
        
    },
    data() {
      return{
        // applyData : dataSource[process.env.SYSTEM_TYPE].applyData
      }
    },
    computed: {
        ApplyCarouselData() {
            if (this.applyData.title) {
                return this.applyData
            }else {
                return dataSource[process.env.SYSTEM_TYPE].applyData
            }
        }
    },
    methods: {
        handleUp() { // 上一页
            this.$emit('handleUp')
        },
        handleNext() { // 下一页
            this.$emit('handleNext')
        },
        imgerrorfun(event) { // 图片
            const img = event.srcElement
            img.src = require('@/assets/img/about/empty.png')
            img.onerror = null // 控制不要一直跳动
        },
    }
  };
</script>

<style scoped lang="scss">
.apply-carousel{
    .btn-center {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 45px;
        font-size: 14px;
    }
}
</style>
