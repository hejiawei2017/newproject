<template>
  <div>
    <div class="header-color">this is home page111</div>
    <div>{{ $store.state.datastr }}</div>
    <div>{{ $store.state.user.username }}</div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "home",
  asyncData: {
    getUserName(store) {
      return store.dispatch("user/getUserName");
    },
    loadData(store) {
      return store.dispatch("loadData");
    },
  },
  data() {
    return {};
  },
  mounted() {
    //this.$store.dispatch("user/getUserName");
    //this.$store.dispatch("loadData");
    this.$options.asyncData.getUserName(this.$store);
    //this.store.dispatch("user/getUserName");
  },
};
</script>
<style scoped>
.header-color {
  color: red;
}
</style>