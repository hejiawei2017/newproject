<template>
  <!-- ·入驻机构 -->
  <div class="settled">
    <banner2 :banner-data="bannerData"></banner2>
    <institution></institution>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import Institution from "@/components/Institution.vue";
export default {
  name: "Settled",
  components: {
    banner2,
    Institution,
  },
  data() {
    return {
      searchValue: "",
      bannerData: {
        img: require("@/assets/img/Inspection/settled-banner.png"),
        title: "入驻机构",
        textArr: [
          "汇聚各类检验检测服务商，为检验检测需求方提供一站式服务",
        ],
        maxWidth: "745px",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
