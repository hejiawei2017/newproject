<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <ueditor v-model="remark" :config="ueditorData.config"></ueditor>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ueditor from '@/common/ueditor/index.vue';

export default {
  name: 'home',
  components: {
    HelloWorld,
    ueditor
  },
  data() {
    return {
      remark: '111111',
      ueditorData: {}
    };
  },
  created() {
    // setTimeout(() => {
    //   this.$router.push({ name: "about", params: { name: 2224 } });
    // }, 2000);
  }
};
</script>
