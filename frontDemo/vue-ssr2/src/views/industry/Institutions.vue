<template>
    <div>
        <banner2 :banner-data="businessBanner"></banner2>
        <institution></institution>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import Institution from '@/components/Institution.vue'
  import industryDataSource from '../../assets/dataSource/dataSource'
  export default {
    name: "Institutions",
    components: {
      banner2,
      Institution
    },
    data() {
      return {
        businessBanner:industryDataSource[process.env.SYSTEM_TYPE].businessBanner,
      }
    }
  };
</script>

<style scoped>

</style>
