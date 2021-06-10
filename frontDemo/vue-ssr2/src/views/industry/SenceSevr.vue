<template>
    <div>
        <banner2 :banner-data="servBanner"></banner2>
        <scene-serv></scene-serv>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import SceneServ from "@/components/SceneServ.vue";
  import industryDataSource from '../../assets/dataSource/dataSource'
  export default {
    name: "senceSevr",
    components: {
      banner2,
      SceneServ
    },
    data() {
      return {
        servBanner: industryDataSource[process.env.SYSTEM_TYPE].servBanner,
      }
    }
  };
</script>

<style scoped>

</style>
