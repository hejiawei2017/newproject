<template>
    <div class="consumer" id="pageList">
        <banner2 :banner-data="coBanner"></banner2>
        <Search2 id="consumerSearch"></Search2>
        <Announcement :tableData="tableData" id="consumerList"></Announcement>
        <content1 :content-one="contentOneA" id="consumerProtection"></content1>
        <Content0 id="syGuide" :content-zero="coContent" :show-arrow="true"></Content0>
        <AppShowContent id="appInfo"></AppShowContent>
        <floor :floorData="floorData"></floor>
    </div>
</template>

<script>
  import banner2 from '@/components/Banner2.vue'
  import Content0 from '@/components/Content0.vue'
  import Announcement from '@/components/Announcement.vue'
  import AppShowContent from '@/components/AppShowContent.vue'
  import Search2 from '@/components/Search2.vue'
  import Content1 from '@/components/Content1.vue'
  import Floor from '@/components/Floor.vue'
  export default {
    name: "Consumer",
    data () {
      return {
        coBanner:{
          // img: process.env.BASE_URL+'img/gjf.png',
          img:'http://10.10.104.3:80/downloadfromfront/xfz.png',
          title:'消费者中心',
          text:'',
          textArr:["为消费者提供查询及咨询",
            "建立在溯源数据库上的商品信息情报，真实可信",],
          maxWidth:'745px'
        },
        coContent:{
          title:'消费者服务指南',
          subTitle:'',
          itemStyle:{
            width:'268px'
          },
          imgStyle:{
            width: '268px',
            height: '268px',
            padding: '60px 0',
            borderRadius: '134px'
          },
          bodyData:[
            {
              img:'http://10.10.104.3:80/downloadfromfront/jrsy2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/jrsy1.png',
                imgText:'加入溯源',
              text:'用户需要进行\n' +
                '用户注册与账号信息维护'

            },
            {
              img:'http://10.10.104.3:80/downloadfromfront/sycx2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/sycx1.png',
                imgText:'溯源查询',
              text:'消费者通过扫码查询或手动录入\n' +
                '溯源标识值等信息，查询商品溯源数据'

            },
            {
              img:'http://10.10.104.3:80/downloadfromfront/zxfk2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/zxfk1.png',
                imgText:'咨询反馈',
              text:'进行溯源查询后，若对查询结果存疑时\n' +
                '可进行咨询反馈，维护自身权益\n'

            }
          ]
        },
        tableData: {
          bgImg: require('@/assets/img/home/Announcement-img.png'),
          columns: [
            {title: '商品查询榜单'},
            {title: '商品咨询榜单'},
            {title: '商品投诉榜单'},
            {title: '企业红榜'},
            {title: '企业黑榜'},
          ],
          dataSource: [
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
            {
              url: require('@/assets/img/about/monthly-focus.png'),
              text:'荷兰牛栏较大儿配方奶粉 荷兰牛栏较大儿配方奶粉',
              consultText:'咨询量',
              consultNum:1000
            },
          ],
        },
          contentOneA:{
              title:'权益保护机制 ',
              boldTit:'多元共治',
              text:'监管部门、企业与消费者是全球溯源体系与全球溯源中心的共建单位，消费者权益保护公共服务平台作为全球溯源中心的公共应用，向共建各方共享商品的质量信息、贸易信息、监管应用信息、消费者反馈信息等商品真实价值信息。',
              subText: '在全球溯源中心统一管理下，形成消费者投诉咨询、责任相关企业办理、监管部门监督的闭环保护机制。维权服务商的加入，通过市场化手段，促进机制更加有效运行。',
              img: '',
              bgImg: 'http://10.10.104.3:80/downloadfromfront/qy2.png',
                cLineStyle:{
                  backgroundColor:'#ffffff'
                },
              imgStyle:{
                  width:'635px',
                  height: '414px'
              },
              leftStyle:{
                  color:'#FFFFFF',
                  width:'384px'
              },
              bgClass: 'container card-img-overlay'
          },
        floorData:{
              title:'定位导航',
              positionArr:[
                  {
                      id:'#consumerSearch',
                      text:'溯源数据查询'
                  },
                  {
                      id:'#consumerList',
                      text:'消费者红黑榜'
                  },
                  {
                      id:'#consumerProtection',
                      text:'消费者维权'
                  },
                  {
                      id:'#syGuide',
                      text:'溯源查询指南'
                  },
                  {
                      id:'#appInfo',
                      text:'移动查询工具'
                  }
              ]
          }
      }
    },
    components: {
      banner2,
      Content0,
        Content1,
      Announcement,
      AppShowContent,
        Search2,
        Floor
    },
    methods: {},
  };
</script>

<style scoped>

</style>
