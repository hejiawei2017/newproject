import Layout from "../../components/Layout/Layout";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import CoBuilder from "@/views/CoBuilder.vue";
import Consumer from "@/views/Consumer.vue";
import Help from "@/views/Help.vue";
import Standard from "@/views/Standard.vue";
import SceneServ from "@/views/SceneServ.vue";
import Traceability from "@/views/Traceability.vue";
import ArticlenInformation from "@/components/ArticlenInformation.vue"
import HelloWorld from "@/components/HelloWorld.vue"
import SearchDetail from "@/components/SearchDetail.vue"
import CobuildUnit from "@/views/CobuildUnit.vue"
import SystemMenu from "@/views/SystemMenu.vue"

import SearchInfo from "@/views/SearchInfo.vue"
import EarlyWarningDetails from "@/components/EarlyWarningDetails.vue"


const centerMainRouter = [
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
  // Co-builder service
  {
    path: "/CoBuilder",
    component: Layout,
    children: [
      {
        path: '/',
        name: "CoBuilder",
        component: CoBuilder
      }
    ]
  },
  {
    path: "/CobuildUnit",
    component: Layout,
    children: [
      {
        path: '/',
        name: "CobuildUnit",
        component: CobuildUnit
      }
    ]
  },
  // Consumer Center
  {
    path: "/Consumer",
    component: Layout,
    children: [
      {
        path: '/',
        name: "Consumer",
        component: Consumer
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
  {
    path: "/Scence",
    component: Layout,
    children: [
      {
        path: '/',
        name: "SeneServ",
        component: SceneServ
      }
    ]
  },
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
        path: 'articlen-information',
        name: "articlen-information",
        component: ArticlenInformation
      }
    ]
  },
  {
    path: "/systemMenu",
    component: Layout,
    children: [
      {
        path: '/',
        name: "SystemMenu",
        component: SystemMenu
      }
    ]
  },
  {
    path: "/searchInfo",
    component: Layout,
    children: [
      {
        path: '/',
        name: "SearchInfo",
        component: SearchInfo
      }
    ]
  },
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
  {
    path: "/h",
    component: Layout,
    children: [
      {
        path: '/',
        name: "hello",
        component: HelloWorld
      }
    ]
  }
]
export default centerMainRouter
