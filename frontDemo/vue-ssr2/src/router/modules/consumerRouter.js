import Layout from "@/components/Layout/Layout";

import Home from "@/views/consumer/Home.vue";
import CstomerService from "@/views/consumer/CstomerService.vue";
import HumanRightsCases from "@/views/consumer/HumanRightsCases.vue";
import SourceNews from "@/views/consumer/SourceNews.vue";
import ArticlenInformation from "@/components/ArticlenInformation.vue";
import Help from "@/views/consumer/Help.vue";
import About from "@/views/consumer/About.vue";
import SearchDetail from "@/components/SearchDetail.vue"
import Standard from "@/views/consumer/Standard.vue";
import EarlyWarningDetails from "@/components/EarlyWarningDetails.vue"

const consumerRouterRouter = [
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
  // 消费者中心
  {
    path: "/customer-service",
    component: Layout,
    children: [
      {
        path: "/",
        name: "CstomerService",
        component: CstomerService,
      },
    ],
  },
  // 维权案例
  {
    path: "/human-rights-cases",
    component: Layout,
    children: [
      {
        path: "/",
        name: "HumanRightsCases",
        component: HumanRightsCases,
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
export default consumerRouterRouter;
