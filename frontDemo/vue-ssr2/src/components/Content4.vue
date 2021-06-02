<template>
  <div class="content4">
    <div class="container">
      <div class="wrap" :style="{paddingTop: content4Data.headerTitleArr ? '': '200px'}">
        <div v-if="content4Data.headerTitleArr" class="content4-header">
          <h3 v-for="(item,index) in content4Data.headerTitleArr" :key="index" class="content4-header-text">{{item}}</h3>
          <h3 class="content4-header-text"></h3>
          <div class="c-line"></div>
        </div>
        <div class="container-list">
          <div
            v-for="(item, index) in content4Data.content4List"
            :key="index"
            class="container-item"
          >
            <h3 class="item-title">0{{ index + 1 }}</h3>
            <p class="item-text">
              <span
                v-for="(item2, index2) in item.list"
                :key="index2"
                :class="{ 'item-text-weight': item2.bold }"
                >{{ item2.text }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataSource from "@/assets/dataSource/dataSource";
export default {
  name: "Content4",
  data() {
    return {
      content4Data: dataSource[process.env.SYSTEM_TYPE].content4Data,
    };
  },
};
</script>

<style scoped lang="scss">
.content4 {
  .content4-header {
    padding-top: 100px;
  }
}
</style>
