
import Layout from "../../components/Layout/Layout";
import Home from "@/views/industry/Home.vue"
import About from '@/views/industry/About.vue'
import Help from "@/views/industry/Help.vue"
import Institutions from "@/views/industry/Institutions.vue"
import Need from '@/views/industry/Need.vue'
import Safeguard from "@/views/industry/Safeguard.vue"
import SenceSevr from '@/views/industry/SenceSevr.vue'
import MessagePublicity from "@/views/industry/MessagePublicity.vue"
import Traceability from '@/views/industry/Traceability.vue'
import ArticlenInformation from "@/components/ArticlenInformation.vue"
import SearchDetail from "@/components/SearchDetail.vue"
import ServiceEvaluation from "@/components/ServiceEvaluation.vue";
import Standard from "@/views/industry/Standard.vue";
import EarlyWarningDetails from "@/components/EarlyWarningDetails.vue"

const industryRouter = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: '/',
        name: "Home",
        component: Home
      }
    ]
  },
  {
    path: "/about",
    component: Layout,
    children: [
      {
        path: '/',
        name: "About",
        component: About
      }
    ]
  },
  {
    path: "/Help",
    component: Layout,
    children: [
      {
        path: '/',
        name: "Help",
        component: Help
      },
      {
        path: 'search-detail',
        name: "search-detail",
        component: SearchDetail
      }
    ]
  },
  // 入驻机构
  {
    path: "/institutions",
    component: Layout,
    children: [
      {
        path: '/',
        name: "CoBuilder",
        component: Institutions
      },
      {
        path: 'service-evaluation',
        name: "ServiceEvaluation",
        component: ServiceEvaluation
      }
    ]
  },
  // 需求服务
  {
    path: "/need",
    component: Layout,
    children: [
      {
        path: '/',
        name: "need",
        component: Need
      }
    ]
  },
  //平台服务
  {
    path: "/safeguard",
    component: Layout,
    children: [
      {
        path: '/',
        name: "safeguard",
        component: Safeguard
      },
      {
        path: '/senceSevr',
        name: "senceSevr",
        component: SenceSevr
      },
    ]
  },
  // 信息公示
  {
    path: "/message-publicity",
    component: Layout,
    children: [
      {
        path: '/',
        name: "message-publicity",
        component: MessagePublicity
      }
    ]
  },
  // 溯源资讯
  {
    path: "/traceability",
    component: Layout,
    children: [
      {
        path: '/',
        name: "traceability",
        component: Traceability
      },
      {
        path: '/articlen-information',
        name: "articlen-information",
        component: ArticlenInformation
      },
      {
        path: "/Standard",
        component: Layout,
        children: [
          {
            path: '/',
            name: "Standard",
            component: Standard
          }
        ]
      },
    ]
  },
  // 风险预警详情
  {
    path: "/earlyWarningDetails",
    component: Layout,
    children: [
      {
        path: '/',
        name: "EarlyWarningDetails",
        component: EarlyWarningDetails
      }
    ]
  },
]
export default industryRouter
