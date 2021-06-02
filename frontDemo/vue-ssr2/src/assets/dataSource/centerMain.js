import pconfig from '../../p.config'
const centerMainDataSource = {
  layout: {
    systemName: '全球溯源中心公共服务平台',
    navItem: [
      {
        name: '·首页',
        url: '/'
      }, {
        name: '·关于我们',
        url: '/about'
      }, {
        name: '·共建方服务',
        url: '/CoBuilder'
      }, {
        name: '·消费者中心',
        url: '/Consumer'
      }, {
        name: '·标准与规范',
        url: '/Standard'
      }, {
        name: '·帮助中心',
        url: '/Help'
      },

    ],
    footerNavItem: [
      {
        name: '关于我们',
        url: '/about'
      }, {
        name: '共建方服务',
        url: '/CoBuilder'
      }, {
        name: '消费者中心',
        url: '/Consumer'
      }, {
        name: '标准与规范',
        url: '/Standard'
      }, {
        name: '帮助中心',
        url: '/Help'
      },
    ],
    footerSystems:[
      {
        name:'检验检测公共服务平台',
        url:pconfig.InspectionUrl
      },
      {
        name:'知识产权保护公共服务平台',
        url:pconfig.intellectualUrl
      },
      {
        name:'溯源产业公共服务平台',
        url:pconfig.industryUrl
      },
      {
        name:'消费者权益保护公共服务平台',
        url:pconfig.consumerUrl
      }]
  },
  homeBanner: {
    interval: 4000,
    showIndicators: true,
    style: 'text-shadow: 0px 0px 2px #000',
    imgArr: ['http://10.10.104.3:80/downloadfromfront/c-b-01.jpg',
      'http://10.10.104.3:80/downloadfromfront/c-b-02.jpg',
      'http://10.10.104.3:80/downloadfromfront/c-b-03.jpg',
      'http://10.10.104.3:80/downloadfromfront/c-b-04.jpg',
      'http://10.10.104.3:80/downloadfromfront/c-b-05.jpg']
  },
  BZData:{
    ord: '2060'
  },
  unitListData:{
    title : '共建单位',
    ord: '2080',
    showBtn:true,
  },
  sceneData: {
    title: '场景式',
    titleBold: '服务',
    showMoreBtn: true,
    hasHover: true,
    btnText: '查看更多',
    contentArray: [
      {
        title: '三级溯源',
        img: 'http://10.10.104.3:80/downloadfromfront/card-img0.png',
        hoverImg: 'http://10.10.104.3:80/downloadfromfront/card-img-a.png',
        text: '分工厂级溯源，贸易商级溯源，口岸级溯源等不同溯源服务，对相关信息进行采集、验证，并出具溯源证书的过程'
      },
      {
        title: '品牌商溯源',
        img: 'http://10.10.104.3:80/downloadfromfront/card-img1.png',
        hoverImg: 'http://10.10.104.3:80/downloadfromfront/card-img-b.png',
        text: ' 有效获得消费者真实的溯源反馈声音，有效加快商品生产流通效率，改进商品质量管控，提升消费者对品牌的信任度，帮助维护知识产权，打击仿冒、伪劣等恶性竞争。'
      },
      {
        title: '跨境+金融开放',
        img: 'http://10.10.104.3:80/downloadfromfront/card-img2.png',
        hoverImg: 'http://10.10.104.3:80/downloadfromfront/card-img-c.png',
        text: '品牌商作为溯源共建方，遵循全球溯源体系“共建共享、真实便利、开放安全”基本原则，提供商品和品牌的真实价值信息。'
      },
    ]
  },
  applyData: {
    title: '应用',
    titleBold: '案例',
    applyArr: [{
      text: '全球优品分拨中心数字服务贸易平台（DSTP）隶属于粤港澳国际供应链（广州）有限公司，是服务贸易和货物贸易服务一体化的新型服务体系，具有数字化的“生态在线、智能决策、全球履约”特征。全球优品分拨中心通过“一物一码”，实现了全流程正品溯源，以及从工厂-仓库-经销商-平台-消费者全链路追踪，助力品牌商品牌运营管理。',
      img: 'http://10.10.104.3:80/downloadfromfront/apply1.png'
    }]
  },
  panelBi: {
    title: '应用成效',
    titleLighter: '展示',
    subTit: '广泛应用于全贸易方式、全品类商品，覆盖范围包括4 大洲、全国省市',
    bgImg:'http://10.10.104.3:80/downloadfromfront/bi-bg.png',
    height: '368px',
    halfHeight: '184px',
    text:'',
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
      }],[{
        startVal:0,
        endVal:1680,
        duration:10000,
        unit:'万',
        txt:'查询人次'
      },{
        startVal:0,
        endVal:1000,
        duration:10000,
        unit:'千万+',
        txt:'发码量'
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
              "全球溯源中心定位为数字经济公共基础设施，是全球溯源体系的落地运营载体",
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
              "全球溯源中心将致力于实现全球商品基础数据库可视化及其应用， 支撑全球溯源体系在全球化过程中规则共商、共建、共用",
            bold: true,
          },
          {
            text:
              "，打造包括 理论体系、全链条监管模式、信息化系统和多媒体平台在内的自贸区 进出口商品安全监管国际化规则示范区和全球首个“质量溯源”战略高地，致力于建立与自由贸易港相适应的高水平贸易监管体制和良性国际贸易生态机制，为区域数据资产管理提供全新解决方案。",
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
              "打造了检验检测服务、知识产权保护、消费者权益保护、溯源产业服务等多个公共服务平台",
            bold: true,
          },
          {
            text:
              "，有效地服务产业发展和社会各方。" +
              "通过全球溯源中心的建设，以商品为主线形成生产、流通、消费、服务等价值传递的规则体系，各参与者既提供信息，又享受信息的数据应用价值，通过共建共享，形成良币驱逐劣币的优质生态，打造新时代国际贸易的新型规则和解决方案，引领全球贸易规则的创新。",
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
    conTitle2: "", // 右边标题2
    contentList: [ // 文字内容
      {
        text: `广州南沙经済技术开发区创新工作局于 2019 年 3 月 1 日挂牌成立，是南沙开发区党工委、区委贯彻落实党中央关于进一步深化改革和扩大对外开放要求的具体体现；是更好地发挥南沙新区自贸区改革开放试验田作用，打造新时代改革开放新高地的重大改革举措。`,
      },
      {
        text: `创新工作将紧紧围绕国家新区、自贸区、粤港澳大湾区建设，以制度创新为核心，充分发挥“以智辅政”和核心引擎作用，积极开展前瞻性发展、前沿性问题的研究，推动国家新区、自贸区、经济技术开发区协同创新，加强改革创新系统集成，切实肩负起南沙为全国深化改革和扩大开放提供可复制可推广创新经验和示范的重要使命。`,
      },
    ],
  },
  appData: {
    title:'消费者',
    title2:'移动查询工具',
    contentLeftText:'移动端溯源查询系统，支持手机扫码一键查询、溯源识别码查询',
    appDowTitle:'溯源 APP',
    appDowText:'手机应用市场下载“SUYUAN"app，扫码即可溯源',
    qrCodeTitle: '微信小程序',
    qrCodeText: '全球溯源查询服务平台微信小程序上线，扫码溯源更加方便',
    positionQrText:'全球溯源查询服务平台微信公众号，了解更多溯源信息',
    qrCodeImg: require('@/assets/img/about/mini-program-qrcode.png'),
    positionQrCodeImg: require('@/assets/img/about/app-qrcode.png'),
  },

  swiperBannerList: [
    {
      title: '你好\n欢迎了解全球溯源',
      text: '全球溯源体系是各国政府部门、企业和消费者共建共享的价值传递体系，以物联网、云计算为手段，创新市场化、法制化、国际化核心规则，分级采集商品全周期信息，科学分析与精准识别，实现风险可识别、可控制、可处置，服务于货物流通、贸易便利、权益维护，构建质量安全与风险可控的国际贸易生态链。秉承共商共建共享原则，以最低成本实现商品价值的真传递和国际贸易质量识别，形成新时代国际贸易的中国规则和中国方案，实现风险可控和精准应用，助推国际贸易最大程度便利化和自由化。',
      img: require("@/assets/img/home/h-b-001.png")
    },
    {
      title: '商品价值真实传递',
      text: '全球溯源在多方参与建设下，利用物联网、云计算等技术，将商品全生命周期的信息分段采集、科学分析、精准识别，形成多维度的商品数字画像，最终实现真实、高效、低成本的商品价值传递。',
      img: require("@/assets/img/home/h-b-002.png")
    },
    {
      title: '共建共享、真实安全、开放便利',
      list: [
        { text:'源头可溯\r|\r风险可控'},
        { text:'守信便利\r|\r失信惩戒'},
        { text:'去向可查\r|\r责任可究'},
      ],
      img: require("@/assets/img/home/h-b-003.png"),
      w480: true
    },
    {
      titleNormal: '全球溯源的',
      title: '创新之处',
      img: require("@/assets/img/home/h-b-004.png"),
      list: [
        {
          tit: '更科学',
          text: '全球溯源通过全面、高效的商品质量识别体系，构建质量安全与风险可控的国际贸易生态链，适应当今全球贸易的新形势。',
          w540: true
        },
        {
          tit: '更先进',
          text: '全球溯源具有市场化、法治化、国际化三大特点，符合国际通用规则，同时符合全人类对价值追求的本性。',
          w540: true
        },
        {
          tit: '可持续',
          text: '全球溯源是共建共享的多方共体系，所有共建方通过自主选择，共同参与建设，以达到共同分享的目的，实现多赢。',
          w540: true
        }
      ],
      'padd-top-140': true
    },
    {
      title: '全球溯源中心建设思路',
      img: require("@/assets/img/home/h-b-005.png"),
      list: [
        {
          tit: '一个运营中心',
          text: '指全球溯源中心的实体运营中心，配备专业的运营管理团队、完善的运营管理组织架构、高效的运营管理体系和综合性实体功能中心，是全球溯源体系规则具现化、可视化的重要载体。 ',
          w540: true,
          titStyle: {fontSize: '24px'},
          textStyle: {fontSize: '16px'}
        },
        {
          tit: '一个理论体系',
          text: '全球溯源规则体系，是共建共享的价值传递体系，以最低成本实现商品价值的真实传递和贸易便利化。',
          w540: true,
          titStyle: {fontSize: '24px'},
          textStyle: {fontSize: '16px'}
        },
        {
          tit: '一套公共技术',
          text: '指全球溯源中心管理系统具有公共基础设施属性，依托支持共建共享体系的溯源公共组件，形成开放性、可复制、可延展的技术体系。',
          w540: true,
          titStyle: {fontSize: '24px'},
          textStyle: {fontSize: '16px'}
        },
        {
          tit: 'N个功能平台',
          text: '指基于“共建共享”理念，以构建质量安全和风险可控的国际贸易生态链为中心，为全球溯源体系规则创新过程中催生的新技术、新模式、新业态等创新应用打造的多个公共服务平台。',
          w540: true,
          titStyle: {fontSize: '24px'},
          textStyle: {fontSize: '16px'}
        },
      ],
      slideStyle: { paddingTop: 0}
    },
  ],
}
export default centerMainDataSource
