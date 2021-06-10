<template>
    <div>
        <banner2 :banner-data="servBanner"></banner2>
        <grid-pagination ord="501010" :grid-data="caseData"></grid-pagination>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import GridPagination from '@/components/GridPagination.vue'
  import industryDataSource from '../../assets/dataSource/dataSource'
  export default {
    name: "Safeguard",
    components: {
      banner2,
      GridPagination
    },
    data() {
      return {
        servBanner: industryDataSource[process.env.SYSTEM_TYPE].servBanner,
        caseData: industryDataSource[process.env.SYSTEM_TYPE].caseData,
      }
    }
  };
</script>

<style scoped>

</style>
