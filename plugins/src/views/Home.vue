<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  created() {
    // setTimeout(() => {
    //   this.$router.push({ name: "about", params: { name: 2224 } });
    // }, 2000);
  }
};
</script>
