<template>
  <!-- 维权案例 -->
  <div class="settled">
    <banner2 :banner-data="bannerData"></banner2>
    <grid-pagination ord="101010" :grid-data="caseData"></grid-pagination>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import GridPagination from '@/components/GridPagination.vue'
// import dataSource from '@/assets/dataSource/dataSource'
export default {
  name: "Settled",
  components: {
    banner2,
    GridPagination
  },
  data() {
    return {
      searchValue: "",
      bannerData: {
        img: require("@/assets/img/consumer/cases-banner.png"),
        title: "维权案例",
        textArr: [
          "通过平台完成的消费者维权案例展示",
        ],
        maxWidth: "745px",
      },
      // casesData: dataSource[process.env.SYSTEM_TYPE].CASEDATA,
      caseData:{
        ord:'101010',
        title:'维权',
        subTitle:'案例',
        subText:'通过运营管理中心中的信息发布功能发布相关数据和图片 '
      }
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
