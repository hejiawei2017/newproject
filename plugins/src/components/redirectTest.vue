
<template>
  <div>
    <button @click="redirect">跳转</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    redirect() {
      axios.get("/redirectTest").then(() => {});
    }
  }
};
</script>