<template>
    <div>
        <div v-show="!complete" class="loading">模型加载中(<span v-text="loaded"></span>/<span v-text="total"></span>)...</div>
        <div >
            <model-obj 
                :backgroundAlpha="0" 
                mtl="static/models/obj/lu.mtl" 
                src="static/models/obj/lu.obj" 
                @on-progress="onProgress" 
                @on-load="onLoad"></model-obj>
        </div>
    </div>
</template>

<script>
import ModelObj  from '../../components/model-obj.vue';

export default {
    name: 'about',

    components: {
        ModelObj
    },

    data () {
        return {
            loaded:0,
            total:0,
            complete:false
        }
    },
    created(){
        

    },

    mounted () {
        
    },

    watch: {
        
    },

    methods: {
        onProgress:function(e){
            this.loaded = e.loaded;
            this.total = e.total;

        },
        onLoad:function(){
            this.complete = true;
        }
    }
}
</script>

<style lang="scss">
    @import "~@/common/scss/base";
    .loading{
        text-align: center;
        font-size:rem(40);
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:rem(400);
        height: rem(400);
    }
</style>
