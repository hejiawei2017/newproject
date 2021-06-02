<template>
  <div class="my-swiper">
     <swiper  ref="mySwiper" :options="swiperOption">
      <swiper-slide v-for="(item,index) in swiperBannerList" :key="index">
        <!-- <img class="swiper-img" :src="item.img"> -->
        <div class="swiper-bgimg" :style="{backgroundImage:`url(${item.img})`}"></div>
        <div class="my-swiper-slide-1" :style="item.slideStyle">
          <div class="container">
            <h2 class="my-swiper-box-title"><span class="title-fine" v-if="item.titleNormal">{{item.titleNormal}}</span>{{ item.title }}</h2>
            <div class="unit-line"></div>

            <template v-if="item.list">
              <div v-for="(item2,index2) in item.list" :key="index2">
                <div class="my-swiper-box-text-tit" :style="item2.titStyle">{{item2.tit}}</div>
                <p class="my-swiper-box-text" :class="{'w-480': item2.w480,'w-540': item2.w540}" :style="item2.textStyle">
                  {{item2.text}}
                </p>
              </div>
            </template>

            <template v-else>
              <p class="my-swiper-box-text" :class="{'w-480': item.w480,'w-540': item.w540}">
                {{item.text}}
              </p>
            </template>
          </div>
        </div>
      </swiper-slide>
      <!-- <swiper-slide>
        <img class="swiper-img" src="../assets/img/home/h-b-002.png">
        <div class="my-swiper-slide-1">
          <div class="container">
            <h2 class="my-swiper-box-title">商品的价值传递</h2>
            <div class="unit-line"></div>
            <p class="my-swiper-box-text">
              全球溯源在多方参与建设下，利用物联网、云计算等技术，将商品全生命周期的信息分段采集、科学分析、精准识别，形成多维度的商品数字画像，最终实现真实、高效、低成本的商品价值传递，引领国际贸易自由化与便利化。
            </p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <img class="swiper-img" src="../assets/img/home/h-b-003.png">
        <div class="my-swiper-slide-1">
          <div class="container">
            <h2 class="my-swiper-box-title">共建共享、真实安全、开放便利</h2>
            <div class="unit-line"></div>
            <p class="my-swiper-box-text w-480">
              政府、企业、消费者、监管机构、溯源服务商、第三方数据平台等共同参与，全球溯源中心将商品全生命周期的信息汇集整合，同时向关系各方传递全面有效、科学权威的价值信息实现人类数字贸易的合作共贏。
            </p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <img class="swiper-img" src="../assets/img/home/h-b-004.png">
        <div class="my-swiper-slide-1 padd-top-140">
          <div class="container">
            <h2 class="my-swiper-box-title"><span class="title-fine">全球溯源的</span>创新之处</h2>
            <div class="unit-line"></div>
            <div class="my-swiper-box-text-tit">更科学</div>
            <p class="my-swiper-box-text w-540">
              全球溯源通过全面、高效的商品质量识别体系，构建质量安全与风险可控的国际贸易生态链，适应当今全球贸易的新形势。
            </p>
            <div class="my-swiper-box-text-tit">更先进</div>
            <p class="my-swiper-box-text w-540">
              全球溯源具有市场化、法治化、国际化三大特点，符合国际通用规则，同时符合全人类对价值追求的本性。
            </p>
            <div class="my-swiper-box-text-tit">可持续</div>
            <p class="my-swiper-box-text w-540">
              全球溯源是共建共享的多方共体系，所有共建方通过自主选择，共同参与建设，以达到共同分享的目的，实现多赢。
            </p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <img class="swiper-img" src="../assets/img/home/h-b-005.png">
        <div class="my-swiper-slide-1 padd-top-140">
          <div class="container">
            <h2 class="my-swiper-box-title">1+1+1+N</h2>
            <div class="unit-line"></div>
            <div class="my-swiper-box-text-tit">一个实体运营中心</div>
            <p class="my-swiper-box-text w-540">
              专业的团队、完善的运管理组织架构、高效的管理体系和综合性实体功能中心是全球体系规则化具体化可视化的重要载体
            </p>
            <div class="my-swiper-box-text-tit">一个理论体系</div>
            <p class="my-swiper-box-text w-540">
              全球溯源体系，是共建共享的价值传递体系。以低成本实实现商品价值的真实传递和贸易便利化
            </p>
            <div class="my-swiper-box-text-tit">一套公共技术</div>
            <p class="my-swiper-box-text w-540">
              全球溯源管理系统具有公共基设施属性，依托支持共建共享体系的公共组件平台，形成开放性可复制性、可延展的技术体系
            </p>
          </div>
        </div>
      </swiper-slide> -->
      <!--以下看需要添加-->
      <!-- <div class="swiper-scrollbar"></div> //滚动条 -->
      <div slot="button-prev" class="swiper-button-prev"></div> <!-- //上一项 -->
      <div slot="button-next" class="swiper-button-next"></div> <!-- //下一项 -->
      <div slot="pagination" class="swiper-pagination"></div> <!-- //标页码 -->
    </swiper>
  </div>
</template>

<script>
import dataSource from '@/assets/dataSource/dataSource'
export default {
  name: 'mySwiper',
  data() {
    return {
      swiperBannerList : dataSource[process.env.SYSTEM_TYPE].swiperBannerList,
      swiperOption: {
        // 分页器配置
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        // 设定初始化时slide的索引
        initialSlide: 0,
        //Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
        direction: 'horizontal',
        // 自动切换图配置
        autoplay: {
          delay: 500000,
          // stopOnLastSlide: false,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        },
        // 箭头配置
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 环状轮播
        loop: true,
        loopedSlides: 1,
        loopAdditionalSlides: 0,
        // 一个屏幕展示的数量
        slidesPerView: 1,
        // 间距
        // spaceBetween: 26,
        // 修改swiper自己或子元素时，自动初始化swiper
        observer: true,
        // 修改swiper的父元素时，自动初始化swiper
        observeParents: true
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper
    }
  },
  mounted() {
    this.swiper.$el.onmouseover = () => {
      this.swiper.$data.swiper.autoplay.stop()
    }
    this.swiper.$el.onmouseout = () => {
      this.swiper.$data.swiper.autoplay.start()
    }
  }
}
</script>

<style lang="scss" scoped>
.my-swiper {
  position: relative;
  width: 100%;
  height: calc(100vh - 98px);
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-button-prev {
    padding-left: 150px;
    // width: 60px;
    // height: 60px;
    // background: url("~@/assets/images/gaei/next_l_click.png") no-repeat center;
    // &::after {
    //   content: "";
    // }
    // &.swiper-button-disabled {
    //   opacity: 1;
    //   background: url("~@/assets/images/gaei/next_l_unclick.png") no-repeat
    //     center;
    // }
  }
  .swiper-button-next {
    padding-right: 150px;
    // width: 60px;
    // height: 60px;
    // background: url("~@/assets/images/gaei/next_r_click.png") no-repeat center;
    // &::after {
    //   content: "";
    // }
    // &.swiper-button-disabled {
    //   opacity: 1;
    //   background: url("~@/assets/images/gaei/next_r_unclick.png") no-repeat
    //     center;
    // }
  }
  .swiper-pagination {
    bottom: 60px;
    ::v-deep .swiper-pagination-bullet {
      margin: 0 10px;
      width: 15px;
      height: 15px;
      border: 2px solid #fff;
      background: transparent;
      opacity: 1;
    }
    ::v-deep .swiper-pagination-bullet.swiper-pagination-bullet-active {
      background: #fff;
      opacity: 1;
      border: 2px solid #fff;
    }
  }
  .my-swiper-box-title {
    font-size: 48px;
    font-weight: bold;
    white-space: break-spaces;
  }
  .unit-line {
    width: 46px;
    height: 4px;
    margin: 70px 0;
    background: #fff;
  }
  .my-swiper-box-text {
    width: 420px;
    font-size: 20px;
    font-weight: 300;
    opacity: 0.7;
  }
  .title-fine {
    font-weight: 300;
  }
  .w-480 {
    width: 480px;
  }
  .w-540 {
    width: 540px;
  }
  .my-swiper-box-text-tit {
    margin: 30px 0 5px 0;
    font-size: 30px;
    font-weight: 400;
  }
  .swiper-img {
    width: 100%;
    height: 100%;
  }
  .swiper-bgimg {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
      object-fit: cover;
  }
  .my-swiper-slide-1 {
    position: absolute;
    top: 0;
    left: 0;
    /*padding-top: 140px;*/
    width: 100%;
    height: 100%;
      display: flex;
      align-items: center;
    text-align: left;
    color: #fff;
    // background: red no-repeat center;
    background-size: cover;

  }
  .padd-top-140 {
    padding-top: 140px;
  }
}
</style>
