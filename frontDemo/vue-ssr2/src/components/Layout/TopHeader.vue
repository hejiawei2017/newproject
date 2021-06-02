<template>
  <div class="topHeader">
    <div class="container">
      <b-navbar type="dark">
        <b-navbar-nav href="#">{{ layOutData.systemName }}</b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" right @click="handleOnclick"
            ><img src="../../assets/img/home/sprk.png" class="sp-img"
          /></b-nav-item>
          <b-nav-item @click="register" right> 注册 </b-nav-item>
          <b-nav-item right @click="gologin"> 登录 </b-nav-item>
          <b-nav-item right link-classes="lang">
            <div>
              <span>简</span>
              <span> / 繁</span>
              <span> / EN</span>
            </div>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import dataSource from "../../assets/dataSource/dataSource";
const pconfig = require("../../p.config");
export default {
  name: "topHeader",
  data() {
    return {
      layOutData: dataSource[process.env.SYSTEM_TYPE].layout,
      registerUrl: pconfig.registerUrl,
      loginUrl: pconfig.loginUrl,
    };
  },
  methods: {
    register() {
      this.goTroucePage("/register");
    },
    gologin() {
      this.goTroucePage("/loginpass");
    },
    handleOnclick() {
      this.$emit("handleOnclick");
    },
  },
};
</script>

