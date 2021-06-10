<template>
    <div class="scene-serv" :style="sceneData.sceneStyle || ''">
        <div class="container">
            <div class="serv-cont">
                <div class="tit-wraper">
                    <div class="scene-tit">
                        {{sceneData.title}}<span>{{sceneData.titleBold}}</span>
                    </div>
                    <b-button class="more" to="/Scence" v-if="sceneData.showMoreBtn">{{sceneData.btnText}}</b-button>
                </div>
                <div class="scene-line"></div>
                <b-row :align-h="sceneData.alignSelf?sceneData.alignSelf:'center'">
                    <b-col v-for="(item,index) of sceneData.contentArray" :key="index">
                        <b-card @mouseover="hoverHandler(item,index,sceneData.hasHover)" @mouseout="hoverOut(item)"
                                :title="item.title"
                                :img-src="item.active?item.img:item.hoverImg"
                                img-alt="Image"
                                img-top
                                tag="article"
                                :class="item.active ?'serv-card active':'serv-card'"
                                :style="item.colStyle || ''"
                        >
                            <b-card-text>
                                {{item.text}}
                            </b-card-text>
                        </b-card>
                    </b-col>
                </b-row>
            </div>

        </div>
    </div>
</template>

<script>
  import dataSource from '../assets/dataSource/dataSource'
  export default {
    name: "SceneServ",
      data() {
          return {
              isHovered: false,
              hoverClass: 'serv-card',
              sceneData: dataSource[process.env.SYSTEM_TYPE].sceneData
          }
      },
    methods: {
      hoverHandler(item,idx,hasHover) {
        if(!hasHover){
          return
        }
        this.$nextTick(()=>{
          this.sceneData.contentArray.forEach((item)=> {
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
