<template>
    <div class="scene">
        <banner2 :banner-data="aboutBanner"></banner2>
        <three-level-source></three-level-source>
        <traceability-app></traceability-app>
        <open-app></open-app>
    </div>
</template>

<script>
    import banner2 from '@/components/Banner2.vue'
    import ThreeLevelSource from '@/components/ThreeLevelSource.vue'
    import TraceabilityApp from '@/components/TraceabilityApp.vue'
    import OpenApp from '@/components/OpenApp.vue'

    export default {
        name: "SeneServ",
        data () {
            return {
                aboutBanner:{
                    img: 'http://10.10.104.3:80/downloadfromfront/cj.png',
                    title:'场景式服务',
                    text:'',
                    textArr:['为参与企业提供符合自身情况及需求的各类场景下溯源应用办理攻略，便于企业快速上手溯源应用'],
                    maxWidth:'745px'
                },
            }
        },
        components: {
            banner2,
            ThreeLevelSource,
            TraceabilityApp,
            OpenApp
        },
        methods: {},
    }
</script>

<style scoped>

</style>
