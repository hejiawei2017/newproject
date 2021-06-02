<template>
    <div class="banner2">
        <b-card
                overlay
                :img-src="bannerData.img"
                img-alt="Card Image"
        >
            <b-card-body>
                <div class="container">
                    <div class="banner2-content">
                        <h1 class="tit">{{bannerData.title}}</h1>
                        <div class="txt">
                            <div class="at" v-for="(item,index) of bannerData.textArr" :key="index">{{item}}</div>
                        </div>
                    </div>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
  export default {
    name: "Banner2",
    props: {
      bannerData: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style scoped>

</style>
