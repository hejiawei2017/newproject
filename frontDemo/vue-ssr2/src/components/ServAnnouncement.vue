<template>
    <div class="servAnnouncement">
        <div class="container">
            <div class="wrap">
                <h3 class="announcement-title">服务商排行榜</h3>
                <div class="announcement-table">
                    <div class="table-body">
                        <ul class="table-body-list">
                            <li
                                    v-for="(item, index) in announcementData"
                                    :key="index"
                                    class="table-body-item"
                            >
                                <div class="table-body-item-ranking">
                                    <img
                                            class="table-body-item-ranking-img"
                                            v-if="index === 0"
                                            src="@/assets/img/servAnn/top1.png"
                                    />
                                    <img
                                            class="table-body-item-ranking-img"
                                            v-if="index === 1"
                                            src="@/assets/img/servAnn/top2.png"
                                    />
                                    <img
                                            class="table-body-item-ranking-img"
                                            v-if="index === 2"
                                            src="@/assets/img/servAnn/top3.png"
                                    />
                                    <span v-if="index > 2" class="table-body-item-ranking-text">{{
                    index + 1
                  }}</span>
                                </div>
                                <div class="table-body-item-img">
<!--                                    <img :src="item.url || ''" @error="imgerrorfun"/>-->
                                    <img src="../assets/img/servAnn/img.png" @error="imgerrorfun"/>
                                </div>
                                <div
                                        class="table-body-item-text" style="width: 25%">机构名称：{{ item.text }}
                                </div>
                                <div class="table-body-item-text" style="width: 25%">
                                    <span>服务范围：{{ item.consultText }}</span>
                                </div>
                                <div class="table-body-item-text">
                                    <span class="label">评分：</span>
                                    <span class="text">
                                        <i
                                                v-for="(index2) in 5"
                                                :key="index2"
                                                class="iconfont"
                                                :class="index2 < Math.round(item.grad) ? 'icon-start-i' : 'icon-stars-lines'"
                                                style="margin-right:5px;"
                                                :style="{ color: index2 < Math.round(item.grad) ? '#ec8200':''}"
                                        ></i>
                                      </span>
                                </div>
                                <div class="flag" v-if="item.isOk">
                                    <img src="../assets/img/servAnn/tuijian.png"  alt="">
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ServAnnouncement",
        data () {
            return {
                announcementData: [
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },
                    {
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },{
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    }
                    ,{
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },{
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    },{
                        url: require("@/assets/img/about/monthly-focus.png"),
                        text: "某某检测机构",
                        consultText: "某某某某某检测服务",
                        consultNum: 1000,
                        grad:3,
                        isOk: true
                    }

                ],
            }
        },
        methods: {
            imgerrorfun(event) { // 图片
                const img = event.srcElement
                img.src = require('@/assets/img/about/monthly-focus.png')
                img.onerror = null // 控制不要一直跳动
            },
        }
    }
</script>

<style scoped>

</style>
