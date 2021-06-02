<template>
  <div class="sticky-top" >
    <top-header @handleOnclick="handleOnclick"></top-header>
    <div class="navigation">
      <div class="container gtc-nav">
        <a href="/">
          <img src="../../assets/img/home/logo.png" class="logo" alt="" />
        </a>
        <b-nav fill justified>
          <div v-for="(item,index) of layOutData.navItem" :key="index" class="nav-item">
            <b-nav-item :to="item.url" v-if="!item.navDropdown" :class="{ 'active-route': activeRoute && index === 0 }" exact exact-active-class="active">{{item.name}}</b-nav-item>
            <b-nav-item-dropdown
                    v-if="item.navDropdown"
                    id="my-nav-dropdown"
                    :text="item.name"
                    toggle-class="nav-link-custom"
                    right
            >
              <b-dropdown-item v-for="(p,idx) of item.dropItem" :key="idx" :to="p.link">{{p.name}}</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>

          <!--<b-nav-item to="/about" exact exact-active-class="active"-->
          <!--&gt;·关于我们</b-nav-item-->
          <!--&gt;-->
          <!--<b-nav-item to="/CoBuilder" exact exact-active-class="active"-->
          <!--&gt;·共建方服务</b-nav-item-->
          <!--&gt;-->
          <!--<b-nav-item to="/Consumer" exact exact-active-class="active"-->
          <!--&gt;·消费者中心</b-nav-item-->
          <!--&gt;-->
          <!--<b-nav-item to="/Standard" exact exact-active-class="active"-->
          <!--&gt;·标准与规范</b-nav-item-->
          <!--&gt;-->
          <!--<b-nav-item to="/Help" exact exact-active-class="active"-->
          <!--&gt;·帮助中心</b-nav-item-->
          <!--&gt;-->
        </b-nav>
      </div>
    </div>
  </div>
</template>

<script>
  import TopHeader from './TopHeader'
  import dataSource from '../../assets/dataSource/dataSource'
export default {
  name: "Navigation",
  components: {
    TopHeader
  },
  data() {
    return {
      layOutData: dataSource[process.env.SYSTEM_TYPE].layout,
      activeRoute: false
    };
  },
  mounted() {
    this.hasActiveRoute()
  },
  methods: {
    handleOnclick() {
      this.$emit('handleOnclick')
    },
    hasActiveRoute() {
      if (this.$route.query.is) {
        this.activeRoute =  true
        return
      }
      this.activeRoute =  false
    }
  },
  watch: {
    '$route': 'hasActiveRoute'
  }
};
</script>

<style scoped>
</style>
