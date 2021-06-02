<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1> -->
    <!-- <p>{{ $store.state.common.datastr }} 111</p>
    <div>{{ $store.state.user.name }} 333</div> -->

    <div>{{ $store.state.common.columnStr }}</div>

    <h1><hello></hello></h1>
  </div>
</template>

<script>
import hello from "./HelloWorld2.vue";
export default {
  name: "HelloWorld",
  components: {
    hello,
  },

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
      console.log("getApplicationCases--server-------------");
      return store.dispatch("getApplicationCases");
    },
  },
  props: {
    msg: String,
  },
  created() {
    console.log("in hello");
  },
  mounted() {
    // const matchComponents = this.$router.getMatchedComponents();
    // debugger;
    // console.log("matchComponents", matchComponents);
    // let vm = this;
    // // 匹配到路由了
    // let getAllAsyncDataFn = function (components) {
    //   let innerArr = [];
    //   Object.keys(components).forEach((compkey) => {
    //     let comp = components[compkey];
    //     if (comp.asyncData) {
    //       console.log("comp.name", comp.name);
    //       if (typeof comp.asyncData == "object") {
    //         Object.keys(comp.asyncData).forEach((key) => {
    //           innerArr.push(comp.asyncData[key](vm.$store));
    //         });
    //       } else {
    //         innerArr.push(comp.asyncData(vm.$store));
    //       }
    //     }
    //     if (comp.components) {
    //       let comchildren = [];
    //       Object.keys(comp.components).forEach((key) => {
    //         //console.log(key)
    //         comchildren.push(comp.components[key]);
    //       });
    //       let childcomp = getAllAsyncDataFn(comchildren);
    //       innerArr = innerArr.concat(childcomp);
    //     }
    //   });
    //   return innerArr;
    // };
    // let allasyncDatas = getAllAsyncDataFn(matchComponents);
    // console.log("allasyncDatas", allasyncDatas.length);
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
