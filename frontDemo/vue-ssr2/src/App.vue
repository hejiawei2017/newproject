<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import dataSource from './assets/dataSource/dataSource'
export default {
  name: "App",
  title () {
    return dataSource[process.env.SYSTEM_TYPE].layout.systemName
  },
  data() {
    return {
      list1: [],
      list2: [],
    };
  },
  mounted() {
    this.getTheme(process.env.SYSTEM_TYPE);
    console.log("process.env.SYSTEM_TYPE", process.env.SYSTEM_TYPE);
    console.log("systemType", this.$store.state.common.systemType);
  },
  // 生命周期
  methods: {
    getTheme(type) {
      console.log(process.env);
      window.document.documentElement.setAttribute(
        "data-theme", type
      );
    },
  },
};
</script>
<style lang="scss">
@import "./styles/_handle.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  width: 100%;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
