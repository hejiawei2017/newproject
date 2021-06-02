<template>
    <div class="gridPagination">
        <div class="container">
            <template v-if="$store.state.dataSourceServ.casesData.datas">
              <div class="title">
                  {{gridData.title}}<span> {{gridData.subTitle}}</span>
              </div>
              <div class="sub-tit">
                  {{gridData.subText}}
              </div>
              <div class="grid">
                  <b-card
                          overlay
                          v-for="(item,index) of $store.state.dataSourceServ.casesData.datas"
                          :key="index"
                          :img-src="item.imgpathview ? BaseImgUrl+item.imgpathview : require('@/assets/img/safeguard/card-img.png')"
                          text-variant="white"
                          class="grid-card"
                  >
                      <b-card-text class="grid-text">
                          {{item.title}}
                      </b-card-text>
                  </b-card>
              </div>
              <div class="g-bottom">
                  <b-pagination
                          v-model="currentPage"
                          :total-rows="$store.state.dataSourceServ.casesData.totalRows"
                          :per-page="6"
                          first-number
                          last-number
                          align="center"
                          @change="handleChangePage"
                  ></b-pagination>
              </div>
            </template>
            <empty v-else></empty>
        </div>
    </div>
</template>

<script>
  import dataSource from '@/assets/dataSource/dataSource'
  import empty from '@/components/empty'
  export default {
    name: "GridPagination",
    components: {
      empty
    },
    props: {
      ord: {
        type: String,
        required: true
      },
      gridData: {
        type: Object,
        required: true
      }
    },
    asyncData: {
      getCasesOfRightsProtection(store) {
        return store.dispatch("fetchCasesOfRightsProtection", {ord:dataSource[process.env.SYSTEM_TYPE].caseData.ord,pageNo:1});
      }
    },
    data() {
      return {
        rows: 100,
        perPage: 1,
        currentPage: 1,
        BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL
      }
    },
    mounted() {
      this.$options.asyncData.getCasesOfRightsProtection(this.$store);
    },
    methods: {
      handleChangePage(page){
        this.currentPage = page
        let data = {}
        data.ord = this.ord
        data.pageNo = this.currentPage
        this.$store.dispatch("fetchCasesOfRightsProtection", data);
      }
    }
  };
</script>

<style scoped>

</style>
