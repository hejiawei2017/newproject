<template>
  <!-- ·需求/服务发布 -->
  <div class="about" id="pageList">
    <banner2 :banner-data="aboutBanner" style="text-align: left"></banner2>
    <MyTable
            :tableData="$store.state.dataSourceServ.demandListData"
            :dropDownArr="dropDataOne"
            showPaginationBtn
            showSelector
            @changePage="changePage"
            @changeBtn="changeBtn"
            @search="enterSearchNeed"
    ></MyTable>
    <MyTable
            :tableData="$store.state.dataSourceServ.serviceListData"
            :dropDownArr="dropDataTwo"
            showPaginationBtn
            showSelector
            @changePage="changeServPage"
            @changeBtn="changeServBtn"
            @search="enterSearch"
    ></MyTable>
    <floor :floorData="floorData"></floor>
  </div>
</template>

<script>
import banner2 from "@/components/Banner2.vue";
import Floor from "@/components/Floor.vue";
import MyTable from "@/components/MyTable.vue";
export default {
  name: "Need",
  asyncData: {
    getDemandList(store) {
      return store.dispatch("fetchDemandList");
    },
    getServiceList(store) {
      return store.dispatch("fetchServiceList");
    }
  },
  data() {
    return {
      tableData: {
        perPage: 3,
        // style: {
        //   background: "#f8f8f8",
        // },
        title: "需求一览",
        columns: [
          // 表格头部数据
          { name: "需求状态" },
          { level: "需求类型" },
          { creditCode: "服务分类/领域" },
          { region: "发布企业" },
          { time: "发布时间" },
        ],
        dataSource: [
          // 表格列表数据
          {
            name: "需求状态",
            level: "需求类型",
            creditCode: "服务分类/领域",
            region: "某企业",
            time: "2021.4.21",
          },
          {
            name: "需求状态",
            level: "需求类型",
            creditCode: "服务分类/领域",
            region: "某企业",
            time: "2021.4.21",
            rowColor: true,
          },
          {
            name: "需求状态",
            level: "需求类型",
            creditCode: "服务分类/领域",
            region: "某企业",
            time: "2021.4.21",
          },
          {
            name: "需求状态",
            level: "需求类型",
            creditCode: "服务分类/领域",
            region: "某企业",
            time: "2021.4.21",
            rowColor: true,
          },
        ],
      },
      tableData2: {
        perPage: 3,
        // style: {
        //   background: "#f8f8f8",
        // },
        title: "服务一览",
        columns: [
          // 表格头部数据
          { name: "服务范围" },
          { level: "服务地域" },
          { creditCode: "服务价格" },
          { region: "服务时效" },
          { time: "发布人" },
        ],
        dataSource: [
          // 表格列表数据
          {
            name: "服务范围",
            level: "广州",
            creditCode: "100000",
            region: "2021.4.30",
            time: "企业",
          },
          {
            name: "服务范围",
            level: "广州",
            creditCode: "100000",
            region: "2021.4.30",
            time: "企业",
            rowColor: true,
          },
          {
            name: "服务范围",
            level: "广州",
            creditCode: "100000",
            region: "2021.4.30",
            time: "企业",
          },
          {
            name: "服务范围",
            level: "广州",
            creditCode: "100000",
            region: "2021.4.30",
            time: "企业",
            rowColor: true,
          },
          {
            name: "服务范围",
            level: "广州",
            creditCode: "100000",
            region: "2021.4.30",
            time: "企业",
          },
        ],
      },
      aboutBanner: {
        img: require("@/assets/img/Inspection/need-service.png"),
        title: "需求/服务发布",
        text: "",
        textArr: ["企业等需求方发布的检验检测需求及入驻检验检测机构提供的服务能力展示"],
        maxWidth: "745px",
      },
      floorData: {
        title: "定位导航",
        positionArr: [
          {
            id: "#mission",
            text: "我们的使命",
          },
          {
            id: "#system",
            text: "全球溯源体系",
          },
          {
            id: "#global",
            text: "全球溯源中心",
          },
          {
            id: "#co-construction",
            text: "支撑共建方",
          },
          {
            id: "#development",
            text: "发展历程",
          },
        ],
      },
      needPageNo: 1,
      servPageNo: 1,
      dropDataOne:[
        { label: "需求状态", value: "statusname" },
        { label: "需求类型", value: "desiredtypename" },
        { label: "服务分类", value: "detectionterrname" },
        { label: "发布企业", value: "editccodename" },
        { label: "发布时间", value: "releasedate" },
      ],
      dropDataTwo: [
        { label: "服务范围", value: "servicerangename" },
        { label: "服务地域", value: "serviceareaname" },
        { label: "服务价格", value: "price" },
        { label: "服务时效", value: "serviceprescription" },
        { label: "发布人", value: "editccodename" },
      ]
    };
  },
  components: {
    banner2,
    Floor,
    MyTable,
  },
  methods: {
    changeBtn(index) {
      this.$store.dispatch("fetchDemandList", {pageNo: index});
    },
    changePage(index) {
      this.$store.dispatch("fetchDemandList", {pageNo: index});
    },
    changeServPage(index) {
      this.$store.dispatch("fetchServiceList", {pageNo: index});
    },
    changeServBtn(index) {
      this.$store.dispatch("fetchServiceList", {pageNo: index});
    },
    enterSearch(val, label) {
      this.$store.dispatch("fetchServiceList", {pageNo: 1,filterParam:{group:label,having:val}});
    },
    enterSearchNeed(val, label){
      this.$store.dispatch("fetchDemandList", {pageNo: 1,filterParam:{group:label,having:val}});
    }
  },
  mounted() {
    this.$options.asyncData.getDemandList(this.$store);
    this.$options.asyncData.getServiceList(this.$store);
  }
};
</script>
