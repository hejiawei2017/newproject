<template>
    <div class="footer-temp">
        <div class="container">
            <div class="footer-content">
                <b-row>
                    <b-col>
                        <div class="footer-tit">全球服务热线</div>
                        <div class="b-txt">400-8080-2872</div>
                        <div class="footer-tit b-m-50">服务邮箱</div>
                        <div class="b-txt">support@global-suyuan</div>
                    </b-col>
                    <b-col cols="4">
                        <div class="footer-tit">快速访问</div>
                        <div class="f-b-line"></div>
                        <b-row cols="3" class="f-b-txt">
                            <b-col class="f-li" v-for="(item,index) of layOutData.footerNavItem" :key="index"><router-link :to="item.url">{{item.name}}</router-link></b-col>
<!--                            <b-col class="f-li">共建方服务</b-col>-->
<!--                            <b-col class="f-li">消费者中心</b-col>-->
<!--                            <b-col class="f-li">白皮书</b-col>-->
<!--                            <b-col class="f-li">帮助中心</b-col>-->
                            <!--<b-col class="f-li">col-sm</b-col>-->
                        </b-row>
                    </b-col>
                    <b-col cols="5">
                        <div class="footer-tit">快速链接</div>
                        <div class="f-b-line"></div>
                        <b-row cols="2" class="f-b-txt">
                            <b-col class="f-li" v-for="(item,idx) in  layOutData.footerSystems" :key="idx"><a :href="item.url">{{item.name}}</a></b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
            <div class="footer-bottom">
                <span>
                    主办单位：南沙创新工作局   版权所有：南沙创新工作局   中文域名：www.xx.com   版权号123456
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import dataSource from '../../assets/dataSource/dataSource'
    import pconfig from '@/p.config.js'
  export default {
    name: "FooterTemp",
      data(){
        return {
            layOutData:dataSource[process.env.SYSTEM_TYPE].layout,
            process:pconfig
        }
      }
  };
</script>

<style scoped>

</style>
