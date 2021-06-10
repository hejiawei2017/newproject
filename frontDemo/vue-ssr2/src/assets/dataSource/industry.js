import pconfig from "../../p.config";

const industryDataSource = {
  layout: {
    systemName:'溯源产业公共服务平台',
    navItem:[
      {
        name: '·首页',
        url: '/'
      },{
        name: '·需求/服务发布',
        url: '/need'
      },{
        name: '·平台服务',
        url: '/',
        navDropdown: true,
        dropItem:[{
          name:'·服务案例',
          link:'/safeguard'
        },{
          name:'·场景式服务',
          link:'/senceSevr'
        }]
      },{
        name: '·信息公示',
        url: '/message-publicity'
      },{
        name: '·入驻商家',
        url: '/institutions'
      }, {
        name: '·资讯',
        url: '/traceability'
      },{
        name: '·帮助中心',
        url: '/Help'
      },{
        name: '·关于我们',
        url: '/about'
      }

    ],
    footerNavItem:[
      {
        name: '需求/服务发布',
        url: '/need'
      }, {
        name: '平台服务',
        url: '/safeguard',
      },{
        name: '信息公示',
        url: '/message-publicity'
      },{
        name: '入驻商家',
        url: '/institutions'
      }, {
        name: '资讯',
        url: '/traceability'
      },{
        name: '帮助中心',
        url: '/Help'
      },{
        name: '关于我们',
        url: '/about'
      }

    ],
    footerSystems:[
      {
        name:'全球溯源中心公共服务平台',
        url:pconfig.centerMainUrl
      },
      {
        name:'检验检测公共服务平台',
        url:pconfig.InspectionUrl
      },
      {
        name:'知识产权保护公共服务平台',
        url:pconfig.intellectualUrl
      },
      {
        name:'消费者权益保护公共服务平台',
        url:pconfig.consumerUrl
      }]
  },
  homeBanner: {
    interval: 4000,
    showIndicators:false,
    style:'text-shadow: 0px 0px 2px #000',
    imgArr: ['http://10.10.104.3:80/downloadfromfront/industry.png']
  },
  unitListData:{
    title : '共建单位',
    ord: '5050',
    showBtn:false,
  },
  BZData:{
    ord: '2060'
  },
  sceneData: {
    title: '场景式',
    titleBold: '服务',
    showMoreBtn: false,
    hasHover: true,
    btnText: '查看更多',
    sceneStyle: {
      paddingTop: '92px',
      backgroundColor: 'RGBA(127,127,127,.1)'
    },
    cardStyle:{
      width: '516px',
    },
    alignSelf: 'between',
    contentArray: [
      {
        title: '溯源服务展示',
        img: 'http://10.10.104.3:80/downloadfromfront/industry-bs-1.png',
        hoverImg: 'http://10.10.104.3:80/downloadfromfront/industry-bs.png',
        text: '聚焦为溯源共建方提供更有效、准确、便利的服务，延伸溯源产业链，提供相应公共服务。',
        colStyle:{
          width: '516px'
        }
      },
      {
        title: '溯源开放应用展示',
        img: 'http://10.10.104.3:80/downloadfromfront/industry-tbgz-1.png',
        hoverImg: 'http://10.10.104.3:80/downloadfromfront/industry-tbgz.png',
        text: '聚焦溯源开放应用，为拓展溯源在新技术、新场景的应用，促进溯源与相关产业融合发展，提供相应的公共服务。',
        colStyle:{
          width: '516px',
          marginLeft: 'auto'
        }
      },
    ]
  },
  content5Data: {
    title:'用户',
    titleBold:'收获',
    showMoreBtn: false,
    hasHover:false,
    btnText:'查看更多',
    bottomStyle: {
      textAlign: 'left',
      marginTop: '16px',
      fontSize: '20px',
      lineHeight: '30px'
    },
    wrapStyle:{
      justifyContent: 'space-between'
    },
    cardStyle:{
      maxWidth: '547px'
    },
    contentArray:[
      {
        title:'',
        img:'',
        hoverImg:'http://10.10.104.3:80/downloadfromfront/sence-card01.png',
        text:'1.通过全球溯源中心追溯到侵权商品的流通全过程，识别了侵权行为，监管部门进行了精准靶向处理，维护了企业的合法权益。'
      },
      {
        title:'',
        img:'',
        hoverImg:'http://10.10.104.3:80/downloadfromfront/sence-card02.png',
        text:'2.通过知识产权公共服务平台，成功筛选到了资质齐全，价格合理的服务商，快速完成了专利的申请。'
      },
    ]
  },
  applyData: {
    title: '',
    titleBold: '服务案例',
    applyArr:[{
      subTit: '溯源标识',
      text: '通过知识产权保护公共服务平台所解决的涉及侵权、涉假等案件，进行可视化展示，形象展现全球溯源中心在知识产权保护行业所发挥的作用。',
      img: 'http://10.10.104.3:80/downloadfromfront/apply2.png'
    }]
  },
  panelBi: {
    title: '一片蓝海市场',
    titleLighter: '',
    subTit: '',
    text:['全球溯源体系是各国政府部门、企业和消费者共建共享的价值传递体系。'+
    '体系秉持“共建共享、真实安全、开放便利”的原则，吸引着各类共建方加入，促进相关产业共同发展。'+
    '在此过程中，随着溯源产业行业的不断拓展，将产生大量的溯源产业服务需求，形成一片巨大的待开发市场。'],
    bgImg:'http://10.10.104.3:80/downloadfromfront/industryBi.png',
    height: '184px',
    halfHeight: '0',
    BIData:[
      [{
        startVal:0,
        endVal:8716,
        duration:10000,
        unit:'个',
        txt:'商品品牌应用'
      },{
        startVal:0,
        endVal:14974,
        duration:10000,
        unit:'家',
        txt:'参与的全球企业'
      },{
        startVal:0,
        endVal:605,
        duration:10000,
        unit:'亿美元',
        txt:'商品货值'
      }]
    ]
  },
  content4Data: {
    headerTitleArr: ['全球溯源中心'],
    content4List: [
      {
        list: [
          {
            text:
              "全球溯源中心定位为数字经济公共基础设施，是全球溯源体系的落地运营载体，",
            bold: true,
          },
          {
            text:
              "由地方政府主导建设、监管部门共建共用、社会组织 共同参与，秉持“共建共享、真实安全、开放便利”的原则，建设成 为集溯源展示、业务运作、数据监控、产业培育、风险分析、智能预 警、公共培训、国际交流学术研究于一体的现代化、智能化综合型多功能平台。",
          },
        ],
      },
      {
        list: [
          {
            text:
              "全球溯源中心将致力于实现全球商品基础数据库可视化及其应用，",
            bold: true,
          },
          {
            text:
              "支撑全球溯源体系在全球化过程中规则共商、共建、共用，打造包括 理论体系、全链条监管模式、信息化系统和多媒体平台在内的自贸区 进出口商品安全监管国际化规则示范区和全球首个“质量溯源”战略高地，致力于建立与自由贸易港相适应的高水平贸易监管体制和良性国际贸易生态机制，为区域数据资产管理提供全新解决方案。",
          },
        ],
      },
      {
        list: [
          {
            text: "全球溯源中心依托公共技术底层标准，",
          },
          {
            text:
              "打造了检验检测服务、知识产权保护、消费者权益保护、溯源产业服务等多个公共服务平台，",
            bold: true,
          },
          {
            text:
              "有效地服务产业发展和社会各方。通过全球溯源中心的建设，以商品为主线形成生产、流通、消费、服务等价值传递的规则体系，各参与者既提供信息，又享受信息的数据应用价值，通过共建共享，形成良币驱逐劣币的优质生态，打造新时代国际贸易的新型规则和解决方案，引领全球贸易规则的创新。",
          },
        ],
      },
    ],
  },
  contentTabs: {
    title: "建设区域", // 标题1
    title2: "全球溯源中心", // 标题2
    tabsList: [
      { text: "全球溯源南沙中心", id: 0 },
      { text: "全球溯源青岛中心", id: 1 },
    ],
    arrow: true, // 箭头
    bjImg: require("@/assets/img/about/content-tabs.png"), // 背景图片
    conTitle: "建设单位：广州南沙经济技术开发区创新工作局", // 右边标题1
    conTitle2: "技术主体：广州信天翁信息科技有限公司", // 右边标题2
    contentList: [ // 文字内容
      {
        text: `广州南沙经済技术开发区创新工作局于 2019 年 3 月 1
            日挂牌成立，是南沙开发区党工委、区委贯彻落实党中央关于进一步深化改革和扩大对外开放要求的具体体现；是更好地发挥南沙新区自贸区改革开放试验田作用，打造新时代改革开放新高地的重大改革举措。`,
      },
      {
        text: `创新工作将紧紧围绕国家新区、自贸区、粤港澳大湾区建设，以制度创新为核心，充分发挥“以智辅政”和核心引擎作用，积极开展前瞻性发展、前沿性问题的研究，推动国家新区、自贸区、经济技术开发区协同创新，加强改革创新系统集成，切实肩负起南沙为全国深化改革和扩大开放提供可复制可推广创新经验和示范的重要使命。`,
      },
    ],
  },
  needBanner: {
    img: 'http://10.10.104.3:80/downloadfromfront/industryNeed.png',
    title: "需求/服务发布",
    text: "",
    textArr: ["企业等需求方发布的溯源+各产业的需求及入驻各类服务商机构提供的服务能力展示"],
    maxWidth: "745px",
  },
  servBanner: {
    img: 'http://10.10.104.3:80/downloadfromfront/industruServ.png',
    title:'平台服务',
    text:'',
    textArr:['各企业在溯源产业平台中成功进行商业合作的优质案例，溯源为企业良性发展提供更智能、更广阔的蓝海空间'],
    maxWidth:'745px'
  },
  businessBanner: {
    img: 'http://10.10.104.3:80/downloadfromfront/industryBusiness.png',
    title:'入驻商家',
    text:'',
    textArr:['将入驻平台的溯源服务商按行业/领域进行分类，以列表方式进行展示，','并介绍其服务范围和内容，同时，对优质的服务商进行标识，便于企业方便快捷的查找到合适的溯源服务商。'],
    maxWidth:'745px'
  },
  traceabilityBanner: {
    img: "http://10.10.104.3:80/downloadfromfront/industryZx.png",
    title: "溯源资讯",
    text: "",
    textArr: ["溯源产业平台相关新闻资讯，便于用户快速了解、掌握溯源产业动态，包括行业动态、政策法规等内容。"],
    maxWidth: "745px",
  },
  aboutBanner:{
    img: 'http://10.10.104.3:80/downloadfromfront/industryAbout.png',
    title:'关于我们',
    text:'',
    textArr:['打造产业链路，升级再造产业生产力'],
    maxWidth:'745px'
  },
  caseData:{
    ord:'501010',
    title:'服务',
    subTitle:'案例',
    subText:'各企业在溯源产业平台中成功进行商业合作的优质案例，溯源为企业良性发展提供更智能、更广阔的蓝海空间'
  },
}

export default industryDataSource
