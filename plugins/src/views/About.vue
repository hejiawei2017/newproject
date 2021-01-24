<template>
  <div class="about">
    <h1>This is an about page</h1>
    <wrap-comps type="warning">5555</wrap-comps>
  </div>
</template>
<script>
import wrapComps from "@/components/wrap-comps.vue";
export default {
  components: { wrapComps },
  created() {
    console.log(this.$route.params);
    debugger;
  },
};
</script>
