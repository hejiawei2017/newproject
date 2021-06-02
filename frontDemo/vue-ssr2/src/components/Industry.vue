<template>
    <div class="industry">
        <b-card
                overlay
                img-src="../assets/img/home/5zbg.png"
                img-alt="Card Image"
        >
            <b-card-body>
                <div class="container">
                    <div class="tit">
                        行业公共服务
                    </div>
                    <div class="body">
                        <div v-for="(item,index) in textList" :key="index" class="maskItem mask" @mouseenter="active = index">
                            <!-- <img src="../assets/img/home/5z01.png" class="img" alt=""> -->
                            <div class="rotate-img" :class="'rotate-img-' + index"></div>
                            <div class="txt">
                                {{item.text}}
                            </div>
                            <!-- <div class="txt">
                                公共服务平台
                            </div> -->
                        </div>
                    </div>
                    <p class="tip-text">{{contentList[active]}}</p>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "Industry",
        data () {
            return {
                active: 0,
                contentList: [
                    '全球溯源中心汇集商品全链条信息，基于共建共享原则，消费者可获取商品的真实价值信息，同时通过全球溯源中心反馈机制维护自身权益，参与商品质量反馈，形成消费者、企业、政府部门的良性互动，打造消费者权益保护新模式。',
                    '全球溯源体系构建“溯源+"知识产权保护模式，基于全球商品基础数据库，将全球溯源体系全生命周期信息采集和物的识别应用于政府、企业、社会公众对于知识产权保护的实际需求，以最低的成本实现对生产、经营商品的知识产权保护，塑造良好的社会消费信心。',
                    '全球溯源中心汇聚溯源产业服务资源，向服务商提供潜在客户资源（广大溯源参与企业），并帮助企业找到合适的服务商，辅助企业应用溯源。溯源应用推广带动溯源产业发展，多方协作，共建溯源生态，共享溯源成果。',
                    '基于全球溯源中心汇集商品全链条信息、多方参与共建的有利基础，为检测机构提供其自身检测报告的应用情况数据，便于检测机构发现报告伪造的相关信息，维护检测机构的权益。同时，平台汇聚检验检测要素资源，为企业解决检测机构难找的问题，为检测机构带来商机。'
                ],
                textList:[
                    {
                        text:'消费者权益保护'
                    },
                    {
                        text:'知识产权保护'
                    },
                    {
                        text:'溯源产业'
                    },
                    {
                        text:'检验检测'
                    },
                ]
            }
        }

    }
</script>

<style lang="scss" scoped>
.industry {
    .rotate-img {
        width: 168px;
        height: 168px;
        background-repeat: no-repeat;
        // background-position-x: -48px;
        // background-position-y: 0;
        // background-size: cover;
        background-position-x: -4.3rem;
        background-size: 1930rem 12rem;
        background-position-y: -0.7rem;
        animation: rotate 2s steps(100) infinite;
        animation-play-state: paused;
        &:hover {
            animation-play-state: running;
        }
    }
    .rotate-img-0 {
        background-image: url('~@/assets/img/home/rotate-0.png');
    }
    .rotate-img-1 {
        background-image: url('~@/assets/img/home/rotate-1.png');
    }
    .rotate-img-2 {
        background-image: url('~@/assets/img/home/rotate-2.png');
    }
    .rotate-img-3 {
        // background-position-x: -50px;
        background-size: 1630rem 12rem;
        background-image: url('~@/assets/img/home/rotate-3.png');
        animation: rotate-2 2s steps(84) infinite;
        animation-play-state: paused;
        &:hover {
            animation-play-state: running;
        }
    }
    @keyframes rotate {
        100% {
            // background-position-x: -27000px;
            background-position-x: -1915.2rem;
        }
    }
    @keyframes rotate-2 {
        100% {
            // background-position-x: -22420px;
            background-position-x: -1615.1rem;
        }
    }
    .container {
        padding: 50px 0 0;
    }
    .body {
        margin-top: 86px;
    }
    .tip-text {
        padding: 0 20px;
        margin-top: 80px;
        font-size: 16px;
        color: #fff;
        font-weight: 400;
    }
}
</style>
