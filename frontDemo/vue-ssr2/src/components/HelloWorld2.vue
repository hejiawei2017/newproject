<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <p>{{ $store.state.common.datastr }} 111</p>
    <div>{{ $store.state.user.name }} 333</div> -->

    <div>{{ $store.state.common.columnStr }}</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld2",

  asyncData: {
    // getColumn(store) {
    //   return store.dispatch("getColumn", {
    //     siteid: "webportals",
    //     // catalogname: "帮助中心",
    //     // catalogid: "syzxfff",
    //     ord: "2030",
    //     queryMode: 1,
    //   });
    // },

    getApplicationCases(store) {
      return store.dispatch("getApplicationCases");
    },
  },
  props: {
    msg: String,
  },
  mounted() {
    this.$options.asyncData.getApplicationCases(this.$store);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
