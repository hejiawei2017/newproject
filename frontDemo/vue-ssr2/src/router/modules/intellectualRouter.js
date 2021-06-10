import Layout from "../../components/Layout/Layout";
import Home from "@/views/intellectual/Home.vue";
import About from "@/views/intellectual/About.vue";
import Help from "@/views/intellectual/Help.vue";
import Institutions from "@/views/intellectual/Institutions.vue";
import Need from "@/views/intellectual/Need.vue";
import Safeguard from "@/views/intellectual/Safeguard.vue";
import MessagePublicity from "@/views/intellectual/MessagePublicity.vue";
import Traceability from "@/views/intellectual/Traceability.vue";
import ArticlenInformation from "@/components/ArticlenInformation.vue";
import ServiceEvaluation from "@/components/ServiceEvaluation.vue";
import SearchDetail from "@/components/SearchDetail.vue"
import Standard from "@/views/intellectual/Standard.vue";
import EarlyWarningDetails from "@/components/EarlyWarningDetails.vue"
const intellectualRouter = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
    ],
  },
  {
    path: "/about",
    component: Layout,
    children: [
      {
        path: "/",
        name: "About",
        component: About,
      },
    ],
  },
  {
    path: "/Help",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Help",
        component: Help,
      },
      {
        path: 'search-detail',
        name: "search-detail",
        component: SearchDetail
      }
    ],
  },
  // 入驻机构
  {
    path: "/institutions",
    component: Layout,
    children: [
      {
        path: "/",
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
        path: "/",
        name: "need",
        component: Need,
      },
    ],
  },
  // 平台服务
  {
    path: "/safeguard",
    component: Layout,
    children: [
      {
        path: "/",
        name: "safeguard",
        component: Safeguard,
      },
    ],
  },
  // 信息公示
  {
    path: "/message-publicity",
    component: Layout,
    children: [
      {
        path: "/",
        name: "message-publicity",
        component: MessagePublicity,
      },
    ],
  },
  // 溯源资讯
  {
    path: "/traceability",
    component: Layout,
    children: [
      {
        path: "/",
        name: "traceability",
        component: Traceability,
      },
      {
        path: "/articlen-information",
        name: "articlen-information",
        component: ArticlenInformation,
      },
    ],
  },
  // 标准与规范
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
];
export default intellectualRouter;
