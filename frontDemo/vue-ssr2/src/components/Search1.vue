<template>
    <div class="search1">
        <b-card
                overlay
                img-src="../assets/img/banner2/help.png"
                img-alt="Card Image"
        >
            <b-card-body>
                <div class="container">
                    <div class="wrap">
                        <div class="tit">
                            帮助中心
                        </div>
                        <div class="search-cont">
                            <input type="text" v-model="value" class="search-input" placeholder="请输入您想查询的内容" @keyup.enter="handleSearch">
                            <button class="search-btn" type="button" @click="handleSearch">
                                <img src="../assets/img/search/searchIcon.png" alt="">
                                <span>点击查询</span>
                            </button>
                        </div>
                        <div class="search-bottom">
                            <div class="hot-code">
                                加入溯源
                            </div>
                            <div class="hot-code">
                                溯源查询
                            </div>
                            <div class="hot-code">
                                溯源等级
                            </div>
                            <div class="hot-code">
                                溯源服务
                            </div>
                        </div>
                    </div>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
  export default {
    name: "Search1",
    data () {
        return {
            value:''
        }
    },
    methods: {
        handleSearch() {
            this.$router.push({ name:'search-detail',query: { content: encodeURIComponent(this.value) } })
        }
    }
  };
</script>

<style scoped>

</style>
