<template>
    <div class="content2">
        <b-card
                overlay
                img-src="../assets/img/content/fwsy.png"
                img-alt="Card Image"
                :style="contentData"
        >
            <b-card-body>
                <div class="container">
                    <div class="wrap">
                        <div class="tit">
                            服务共建方
                        </div>
                        <div class="c-line"></div>
                        <div class="text">
                            为共建方提供专业服务，使全球溯源体系传播更广、运行更高效及应用更优的机构或组织。服务共建方包括但不限于公证机构、检验检测机构、认证机构、溯源标识服务商等。
                        </div>
                        <div class="list">
                            <div class="item">
                                <img src="../assets/img/content/bs.png" alt="">
                                <div class="txt">
                                    溯源标识产业
                                </div>
                            </div>
                            <div class="item">
                                <img src="../assets/img/content/bs.png" alt="">
                                <div class="txt">
                                    溯源标识产业
                                </div>
                            </div>
                            <div class="item">
                                <img src="../assets/img/content/gj.png" alt="">
                                <div class="txt">
                                    溯源+新技术新场景
                                </div>
                            </div>
                            <div class="item">
                                <img src="../assets/img/content/add.png" alt="">
                                <div class="txt">
                                    其他
                                </div>
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
    name: "content2",
    data(){
      return{
        contentData:{
          height:'750px'
        }
      }
    }
  };
</script>

<style scoped>

</style>
