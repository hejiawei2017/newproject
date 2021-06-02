<template>
    <div class="join-us">
        <b-card
                class="join-us"
                overlay
                img-src="../assets/img/home/joinUs.png"
                img-alt="Card Image"
        >
            <div class="container">
                <b-card-body>
                    <div class="join-tit">
                        <span>{{title}}</span>
                        <span v-if="title2">{{title2}}</span>
                    </div>
                    <div class="join-line"></div>
                    <div class="content">
                        <div class="left">
                            <div>开始创建一个账户</div>
                        </div>
                        <div class="center"></div>
                        <div class="right">
                            <b-button class="gtc-btn login-btn m-lg-5" :href="registerUrl">立即注册</b-button>
                            <b-button class="gtc-btn login-outline-btn" variant="outline-secondary" :href="loginUrl">登录</b-button>
                        </div>
                    </div>
                </b-card-body>
            </div>

        </b-card>
        </div>
</template>

<script>
  const pconfig = require('../p.config')
  export default {
    name: "JoinUs",
    props: {
        title: {
            type:String,
            default:'加入我们'
        },
        title2: {
            type:String,
            default:''
        },
    },
    data(){
      return {
        registerUrl: pconfig.registerUrl,
        loginUrl: pconfig.loginUrl
      }
    }
  };
</script>

<style scoped lang="scss">
.join-us {
    .join-tit {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
