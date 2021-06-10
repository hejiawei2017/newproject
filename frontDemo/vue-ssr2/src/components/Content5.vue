<template>
    <div class="content5 scene-serv">
        <div class="container">
            <div class="serv-cont">
                <div class="tit-wraper">
                    <div class="scene-tit">
                        {{content5Data.title}}<span>{{content5Data.titleBold}}</span>
                    </div>
                    <b-button class="more" to="/Scence" v-if="content5Data.showMoreBtn">{{content5Data.btnText}}</b-button>
                </div>
                <div class="scene-line"></div>
                <div class="wrap" :style="content5Data.wrapStyle">
                        <b-card @mouseover="hoverHandler(item,index,content5Data.hasHover)" @mouseout="hoverOut(item)"
                                v-for="(item,index) of content5Data.contentArray" :key="index"
                                :title="item.title"
                                :img-src="item.active?item.img:item.hoverImg"
                                img-alt="Image"
                                img-top
                                tag="article"
                                :style="content5Data.cardStyle"
                                :class="item.active ?'serv-card active':'serv-card'"
                        >
                            <b-card-text :style="content5Data.bottomStyle">
                                {{item.text}}
                            </b-card-text>
                        </b-card>
                    </div>
            </div>

        </div>
    </div>
</template>

<script>
  import dataSource from '../assets/dataSource/dataSource'
  export default {
    name: "Content5",
      data() {
          return {
              isHovered: false,
              hoverClass: 'serv-card',
              content5Data: dataSource[process.env.SYSTEM_TYPE].content5Data
          }
      },
    methods: {
      hoverHandler(item,idx,hasHover) {
        if(!hasHover){
          return
        }
        this.$nextTick(()=>{
          this.content5Data.contentArray.forEach((item)=> {
            this.$set(item, 'active', false);
          })
          this.$set(item,'active',true);
        })
      },
      hoverOut(item) {
        this.$set(item,'active',false);
      },
    }
  };
</script>

<style scoped>

</style>
