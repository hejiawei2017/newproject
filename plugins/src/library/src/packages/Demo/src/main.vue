<template>
  <div class="textcss">{{ text }}</div>
</template>
<script>
import { TableColumn } from "element-ui";
export default {
  name: "Demo",
  data() {
    return {
      text: "这是一个测试组件",
      demo: [...[]],
    };
  },
  mounted() {
    this.text = JSON.stringify(TableColumn.props);
  },
};
</script>
<style scoped>
.textcss {
  color: red;
}
</style>
