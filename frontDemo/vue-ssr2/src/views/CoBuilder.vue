<template>
  <div class="co-builder">
    <banner2 :banner-data="coBanner"></banner2>
    <Content0 :content-zero="coContent" id="Traceability">
      <div style="padding-top: 100px" class="btn-wrap">
        <b-button class="more-btn" to="/systemMenu">用户服务</b-button>
      </div>
    </Content0>
    <!--<Content2 id="Service"></Content2>-->
    <content1 :content-one="contentOne" id="Service">
      <template  v-slot:textBtn>
        <div style="padding-top: 100px;text-align: left" class="btn-wrap">
          <b-button class="white-btn" to="/systemMenu">用户服务</b-button>
        </div>
      </template>
    </content1>
    <content3 id="Suppor">
      <div style="padding-top: 100px" class="btn-wrap">
        <b-button class="more-btn" to="/systemMenu">用户服务</b-button>
      </div>
    </content3>
    <content1 :content-one="contentOneA" id="Co-constructor">
      <div style="padding-top: 100px" class="btn-wrap">
        <b-button class="more-btn" to="/systemMenu">用户服务</b-button>
      </div>
    </content1>
    <floor :floorData="floorData"></floor>
  </div>
</template>
<script>
  import banner2 from '@/components/Banner2.vue'
  import Content0 from '@/components/Content0.vue'
  import Content1 from '@/components/Content1.vue'
  import Content3 from '@/components/Content3.vue'
  import Content2 from '@/components/Content2.vue'
  import Floor from '@/components/Floor.vue'
  export default {
    name: "CoBuilder",
    data () {
      return {
        coBanner:{
          // img: process.env.BASE_URL+'img/gjf.png',
          img:'http://10.10.104.3:80/downloadfromfront/gjf.png',
          title:'共建方服务',
          text:'',
          textArr:['共建溯源体系，实现多方共赢 ',' 为各方共建者提供全面、详细的专项服务 '],
        },
        coContent:{
          title:'溯源共建方',
          subTitle:'在全球溯源体系内提供商品溯源信息的组织或个人。',
          itemStyle: {
            width: "251px",
          },
          imgStyle: {
            width: "245px",
            height: "245px",
            padding: "60px 0",
            borderRadius: "122px",
          },
          bodyData:[
            {
              img:'http://10.10.104.3:80/downloadfromfront/ytsjzlgj2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/ytsjzlgj1.png',
              tit:'数字资产管理工具',
              text:'为数字时代的商品数据采集、识别和处置提供了一套高效低成本的工具，提高信息共享和互联互通的效率，为各类应用场景的数据再利用提供了基础。'
            },
            {
              img:'http://10.10.104.3:80/downloadfromfront/jzfxsb2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/jzfxsb1.png',
              tit:'精准风险识别',
              text:'通过对溯源数据进行科学分析与精准识别，实现风险可识别、可控制、可处置，助力用户高效风险管控。'
            },
            {
              img:'http://10.10.104.3:80/downloadfromfront/kfyy2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/kfyy1.png',
              tit:'第三方应用',
              text:'打造释放商品价值的开放应用，服务于溯源共建方，帮助其挖掘更多的数据价值。'
            },
            {
              img:'http://10.10.104.3:80/downloadfromfront/qt2.png',
              hoverImg:'http://10.10.104.3:80/downloadfromfront/qt1.png',
              tit:'其他',
              text:''
            }
          ]
        },
        contentOne:{
          title:'服务共建方',
          boldTit:'',
          text:'为共建方提供专业服务，使全球溯源体系传播更广、运行更高效及应用更优的机构或组织。服务共建方包括但不限于公证机构、检验检测机构、认证机构、溯源标识服务商等。',
          subText:'',
          img: '',
          bgImg: 'http://10.10.104.3:80/downloadfromfront/gjf-fw.png',
          cLineStyle:{
            backgroundColor:'#ffffff'
          },
          imgStyle:{
            width:'635px',
            height: '414px'
          },
          bgImgStyle:{
            height:'750px'
          },
          leftStyle:{
            color:'#FFFFFF',
            width:'384px'
          },
          bgClass: 'container card-img-overlay'
        },
        contentOneA:{
          title:'协同共建方',
          boldTit:'',
          text:'围绕全球溯源体系带动的溯源产业链，存在大量的技术应用场景，包括商品识别、防伪溯源、产品赋码、人工智能、公证服务、大数据分析应用等领域，为协同共建方提供海量优质商机。',
          subText:'',
          img: '',
          bgImg: 'http://10.10.104.3:80/downloadfromfront/bg2.png',
          imgStyle:{
            width:'635px',
            height: '414px'
          },
          bgImgStyle:{
            height:'750px'
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
                    id:'#Traceability',
                    text:'溯源共建方'
                },
                {
                    id:'#Service',
                    text:'服务共建方'
                },
                {
                    id:'#Suppor',
                    text:'支撑共建方'
                },
                {
                    id:'#Co-constructor',
                    text:'协同共建方'
                }
            ]
        }
      }
    },
    components: {
      banner2,
      Content0,
      Content1,
      Content2,
      Content3,
      Floor
    },
    methods: {},

  };
</script>
