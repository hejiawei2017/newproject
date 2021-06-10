import pconfig from "../../p.config";

const consumerDataSource = {
  layout: {
    systemName: '消费者权益保护公共服务平台',
    navItem: [
      {
        name: '·首页',
        url: '/'
      },
      {
        name: '·消费者服务中心',
        url: '/customer-service'
      },
      {
        name: '· 维权案例',
        url: '/human-rights-cases'
      },
      {
        name: '·溯源资讯',
        url: '/traceability'
      },
      {
        name: '·帮助中心',
        url: '/help'
      },
      {
        name: '·关于我们',
        url: '/about'
      },
    ],
    footerNavItem: [
      {
        name: '服务中心',
        url: '/customer-service'
      },
      {
        name: '维权案例',
        url: '/human-rights-cases'
      },
      {
        name: '溯源资讯',
        url: '/traceability'
      },
      {
        name: '帮助中心',
        url: '/help'
      },
      {
        name: '关于我们',
        url: '/about'
      },
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
        name:'溯源产业公共服务平台',
        url:pconfig.industryUrl
      }]
  },
  homeBanner: {
    interval: 4000,
    style: 'text-shadow: 0px 0px 2px #000',
    imgArr: [require('@/assets/img/consumer/home-banner.png')]
  },
  unitListData:{
    title : '共建单位',
    ord: '1050',
    showBtn:false,
  },
  BZData:{
    ord: '2060'
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
  sceneData: {
    title: '维权案例',
    hasHover: true,
    contentArray: [
      {
        title: '维权案例',
        img: require('@/assets/img/consumer/protect-rights.png'),
        hoverImg: require('@/assets/img/consumer/protect-rights-hover.png'),
        text: '消费者在某网购平台购买一批中性笔，商家发出的是假货。平台鉴定后只赔偿了一次假一赔十，说其他的笔是真的，但消费者已经去专柜鉴定过，其余中性笔皆为假货。消费者要求履行假一赔十承诺，并在平台进行在线投诉，相关监督平台受理后立刻对网购平台进行抽样调查，确认事实后进行了处罚，并赔偿了消费者的损失'
      },
      {
        title: '维权案例',
        img: require('@/assets/img/consumer/protect-rights.png'),
        hoverImg: require('@/assets/img/consumer/protect-rights-hover.png'),
        text: '消费者在某汽车4S店做车辆保养过程中，消费者发现店方用了假冒的机油以次充好，导致车辆受损。保留相关照片证据以后在平台的商品溯源系统中通过信息对比，确认机油是假冒产品，并在线投诉了消费者协会。最终协会方受理了消费者的赔偿请求，对4S店做出了惩戒处理'
      },
      {
        title: '维权案例',
        img: require('@/assets/img/consumer/protect-rights.png'),
        hoverImg: require('@/assets/img/consumer/protect-rights-hover.png'),
        text: '消费者在外出旅游时于某特产店购买了许多点心特产，但是回家以后发现产品包装的标签下仍然隐藏有生产信息，并且实际上产品已经过期。通过溯源平台查询后，证实产品确实有过期的情况。于是在线投诉到消费者协会，最终协会方核实情况后责令商家赔偿了消费者损失。'
      },
    ]
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
  caseData:{
    ord:'101010',
    title:'维权',
    subTitle:'案例',
    subText:'通过运营管理中心中的信息发布功能发布相关数据和图片 '
  }
}
export default consumerDataSource
