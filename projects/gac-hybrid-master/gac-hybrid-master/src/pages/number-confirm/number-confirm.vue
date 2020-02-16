<template>
  <div>
    第二个页面
  </div>
</template>

<script>
  export default {
    name: "number-select",
    components: {

    },
    data() {
      return {
        numbers: new Array(100).fill('1', 100)
      };
    },
    created() {

    },
    computed: {

    },
    mounted() {

    },

    methods: {
      goConfirm() {
        window.wx.miniProgram.postMessage({
          state: 'number-select-change-page',
          data:{
            url: ''
          }
        });
      }
    }
  };
</script>
<style scoped lang="scss">
  .scroll-number {
    margin-top: 120px;
    height: 100px;
    overflow: hidden;
  }
  .scroll-number-inner {
    height: 100px;
    color: black;
    text-align: center;
    font-size: 80px;
    line-height: 100px;
  }
</style>
