<template>
    <div class="file-panel">
        <div class="container">
            <div class="file-content">
                <div class="left">
                    <div class="file-tit">
                        全球溯源体系
                        <div>标准与规范</div>
                    </div>
                    <div class="file-line"></div>

                    <div class="file-box"  :key="index" v-for="(item,index) of $store.state.dataSourceServ.standardsData.datas">
                        <div>
                            <router-link :to="'/Standard?idx=' + index">
                                {{item.title}}
                            </router-link>
                        </div>
                    </div>
                    <div class="file-btn">
                        <b-button class="more-btn" to="/Standard">查看详细内容</b-button>
                    </div>
                </div>
                <div class="right">
                    <img
                            :src="(BaseImgUrl+(activeData.imgpathview || ($store.state.dataSourceServ.standardsData.datas && $store.state.dataSourceServ.standardsData.datas[0].imgpathview) || '')) || defaultImg"
                            class="file-img" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dataSource from '../assets/dataSource/dataSource'
  export default {
    name: "FilePanel",
      props: {},
      data(){
        return {
            activeData: {},
            BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
            defaultImg: require("@/assets/img/home/fileImg.png")
        }
      },
      asyncData: {
          getStandardsSpecifications(store) {
              return store.dispatch("fetchStandardsSpecifications",{ord : dataSource[process.env.SYSTEM_TYPE].BZData.ord});
          },
      },
      methods: {
          handleTabsClick(id, index) {
              this.active = index;
              this.activeData = this.$store.state.dataSourceServ.standardsData.datas[index];
              console.log(id)
          },
      },
      mounted() {
          this.$options.asyncData.getStandardsSpecifications(this.$store);
      },
  };
</script>

<style scoped>

</style>
