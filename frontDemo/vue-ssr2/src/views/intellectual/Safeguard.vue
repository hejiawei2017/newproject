<template>
    <div>
        <banner2 :banner-data="aboutBanner"></banner2>
        <grid-pagination ord="101010" :grid-data="caseData"></grid-pagination>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import GridPagination from '@/components/GridPagination.vue'
  import intellectualDataSource from '../../assets/dataSource/dataSource'
  export default {
    name: "Safeguard",
    components: {
      banner2,
      GridPagination
    },
    data() {
      return {
        aboutBanner:{
          img: 'http://10.10.104.3:80/downloadfromfront/safeguard-banner.png',
          title:'维权案例',
          text:'',
          textArr:[],
          maxWidth:'745px'
        },
        caseData:intellectualDataSource[process.env.SYSTEM_TYPE].caseData,
      }
    }
  };
</script>

<style scoped>

</style>
