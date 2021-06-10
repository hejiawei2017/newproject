<template>
    <div class="banner-a">
        <b-carousel
                id="carousel"
                :style="bannerData.style"
                fade
                :interval="bannerData.interval || true"
                :indicators="bannerData.showIndicators"
                ref="gtcCarousel"
        >
            <slot>
                <div class="carousel-control-prev" @click="prev"></div>
                <div class="carousel-control-next" @click="next"></div>
            </slot>
            <b-carousel-slide v-for="(item,index) in bannerData.imgArr" :key="index"
                    :img-src="item"
            ></b-carousel-slide>
        </b-carousel>
    </div>
</template>

<script>
    import dataSource from '../assets/dataSource/dataSource'
  export default {
    name: "Banner",
    data() {
      return{
        bannerData : dataSource[process.env.SYSTEM_TYPE].homeBanner
      }
    },
      methods: {
          prev() {
              this.$refs.gtcCarousel.prev()
          },
          next() {
              this.$refs.gtcCarousel.next()
          }
      }
  };
</script>

