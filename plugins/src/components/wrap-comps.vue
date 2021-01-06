<template>
  <el-tag class="my-tag" v-bind="$attrs" v-on="$listeners"
    ><slot></slot
  ></el-tag>
</template>
<style scoped>
.my-tag {
}
</style>