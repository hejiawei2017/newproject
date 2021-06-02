<template>
  <div class="standard">
    <banner2 :banner-data="coBanner"></banner2>
    <doc-tabs></doc-tabs>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import docTabs from "@/components/DocTabs.vue";
export default {
  name: "Standard",
  data() {
    return {
      coBanner: {
        // img: process.env.BASE_URL+'img/gjf.png',
        img: "http://10.10.104.3:80/downloadfromfront/bps.png",
        title: "标准与规范",
        text: "",
        textArr: [
          "全球溯源体系标准与规范文件"
        ],
        maxWidth: "745px",
      },
    };
  },
  components: {
    banner2,
    docTabs
  },
  methods: {},
};
</script>

<style scoped>
</style>
