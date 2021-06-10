<template>
    <div class="CobuildUnit">
        <banner2 :banner-data="coBanner"></banner2>
        <div class="unit-nav">
            <div class="container wrap">
                <div class="unit-nav-item"
                     :class="index === active?'active':''"
                     v-for="(item,index) of navData" :key="index" @click="handleItem(item,index)">
                    <span >{{item.name}} ( {{item.nums}} )</span>
                </div>
            </div>
        </div>
        <div class="unit-list">
            <div class="container content">
                <div class="list-item" v-for="(item,index) of navData[active].content" :key="index">
                    <div class="item">-{{item.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import banner2 from '@/components/Banner2.vue'
    export default {
        name: "CobuildUnit",
        components: {
            banner2
        },
        data(){
            return {
                coBanner:{
                    // img: process.env.BASE_URL+'img/gjf.png',
                    img:'http://10.10.104.3:80/downloadfromfront/gjf.png',
                    title:'共建共享单位',
                    text:'',
                    textArr:[],
                },
                navData:[
                    {
                        name:'中国',
                        nums: 11,
                        content:[
                            {
                                name: '澳门大学图书馆',
                                value: ''
                            },
                            {
                                name: '澳门大学图书馆',
                                value: ''
                            },
                            {
                                name: '澳门大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京师范大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京师范大学图书馆',
                                value: ''
                            },
                            {
                                name: '北京师范大学图书馆',
                                value: ''
                            },
                        ]
                    },{
                        name:'亚洲',
                        nums: 13
                    },{
                        name:'欧洲',
                        nums: 14
                    },{
                        name:'北美',
                        nums: 17
                    }
                ],
                active: 0
            }
        },
        methods: {
            handleItem(item,idx){
                this.active = idx
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
