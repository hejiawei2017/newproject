import Layout from "@/components/Layout/Layout";

import Home from "@/views/Inspection/Home.vue";
import Need from "@/views/Inspection/Need.vue";
import Settled from "@/views/Inspection/Settled.vue";
import MessagePublicity from "@/views/Inspection/MessagePublicity.vue";
import SourceNews from "@/views/Inspection/SourceNews.vue";
import ArticlenInformation from "@/components/ArticlenInformation.vue";
import Help from "@/views/Inspection/Help.vue";
import About from "@/views/Inspection/About.vue";
import SearchDetail from "@/components/SearchDetail.vue"
import ServiceEvaluation from "@/components/ServiceEvaluation.vue";
import Standard from "@/views/Inspection/Standard.vue";
import EarlyWarningDetails from "@/components/EarlyWarningDetails.vue"
const InspectionRouterRouter = [
  // 首页
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
  // 需求/服务发布
  {
    path: "/need",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Need",
        component: Need,
      },
    ],
  },
  // ·入驻机构
  {
    path: "/settled",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Settled",
        component: Settled,
      },
      {
        path: 'service-evaluation',
        name: "ServiceEvaluation",
        component: ServiceEvaluation
      }
    ],
  },
  // 信息公示
  {
    path: "/message-publicity",
    component: Layout,
    children: [
      {
        path: "/",
        name: "MessagePublicity",
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
        name: "Traceability",
        component: SourceNews,
      },
      {
        path: "articlen-information", // 文章详情
        name: "articlen-information",
        component: ArticlenInformation,
      },
    ],
  },
  // 帮助中心
  {
    path: "/help",
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
  // 关于我们
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
export default InspectionRouterRouter;
