<template>
    <div>
        <banner2 :banner-data="aboutBanner"></banner2>
        <institution showEvaluateBtn></institution>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import Institution from '@/components/Institution.vue'
  export default {
    name: "Institutions",
    components: {
      banner2,
      Institution
    },
    data() {
      return {
        aboutBanner:{
          img: 'http://10.10.104.3:80/downloadfromfront/rzjg.png',
          title:'入驻机构',
          text:'',
          textArr:['汇聚优质知识产权保护服务商，为企业提供确权、用权、维权等服务'],
          maxWidth:'745px'
        },
      }
    }
  };
</script>

<style scoped>

</style>
