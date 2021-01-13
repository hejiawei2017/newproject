<template>
  <div class="textcss">{{ text }}</div>
</template>
<script>
export default {
  name: "Demo",
  data() {
    return {
      text: "这是一个测试组件",
      demo: [...[]]
    };
  }
};
</script>
<style scoped>
.textcss {
  color: red;
}
</style>
