<template>
  <common-select
    ref="select"
    v-model="svalue"
    type="code"
    v-bind="$attrs"
    :config="code"
    :load-data="loadData"
    @change="change"
  ></common-select>
</template>

<script>
import CommonSelect from "./CommonSelect";

let result = {
  riskreportinfoicode: "0000000000000723",
  riskreportinfocode: "FXXXFB20111000008",
  risksourcedataicode: null,
  risktitle: "ndfghdfgh",
  risklevel: "FXJC19111100038",
  risklevelname: "高",
  riskwarninglevel: null,
  riskdesc: "dfghdfgh",
  riskopt: null,
  riskterr: "12,11",
  riskterrname: "租赁和商务服务业,房地产业",
  risktarea: "008,004,016",
  risktareaname: "阿尔巴尼亚,阿富汗,美属萨摩亚",
  riskagingdate: null,
  req_syscode: "UCCC19120400001",
  req_platformcode: null,
  risksubject: null,
  risktype: null,
  risktypename: null,
  status: "10",
  statusname: "未提交",
  submitdate: null,
  predate: 1605002001000,
  vprepare: "UCUS19120400001",
  vpreparename: "王力宏",
};

let queryutil = {
  getCodeList() {
    return new Promise((resolve, reject) => {
      resolve([
        {
          value: "1",
          label: "农、林、牧、渔业",
          orgData: { code: "1", name: "农、林、牧、渔业" },
        },
        {
          value: "10",
          label: "金融业",
          orgData: { code: "10", name: "金融业" },
        },
        {
          value: "11",
          label: "房地产业",
          orgData: { code: "11", name: "房地产业" },
        },
        {
          value: "12",
          label: "租赁和商务服务业",
          orgData: { code: "12", name: "租赁和商务服务业" },
        },
        {
          value: "13",
          label: "科学研究和技术服务业",
          orgData: { code: "13", name: "科学研究和技术服务业" },
        },
        {
          value: "14",
          label: "水利、环境和公共设施管理业",
          orgData: { code: "14", name: "水利、环境和公共设施管理业" },
        },
        {
          value: "15",
          label: "居民服务、修理和其他服务业",
          orgData: { code: "15", name: "居民服务、修理和其他服务业" },
        },
        { value: "16", label: "教育", orgData: { code: "16", name: "教育" } },
        {
          value: "17",
          label: "卫生和社会工作",
          orgData: { code: "17", name: "卫生和社会工作" },
        },
        {
          value: "18",
          label: "文化、体育和娱乐业",
          orgData: { code: "18", name: "文化、体育和娱乐业" },
        },
        {
          value: "19",
          label: "公共管理、社会保障和社会组织",
          orgData: { code: "19", name: "公共管理、社会保障和社会组织" },
        },
        { value: "2", label: "采矿业", orgData: { code: "2", name: "采矿业" } },
        {
          value: "20",
          label: "国际组织",
          orgData: { code: "20", name: "国际组织" },
        },
        { value: "3", label: "制造业", orgData: { code: "3", name: "制造业" } },
        {
          value: "4",
          label: "电力、热力、燃气及水生产和供应业",
          orgData: { code: "4", name: "电力、热力、燃气及水生产和供应业" },
        },
        { value: "5", label: "建筑业", orgData: { code: "5", name: "建筑业" } },
        {
          value: "6",
          label: "批发和零售业",
          orgData: { code: "6", name: "批发和零售业" },
        },
        {
          value: "7",
          label: "交通运输、仓储和邮政业",
          orgData: { code: "7", name: "交通运输、仓储和邮政业" },
        },
        {
          value: "8",
          label: "住宿和餐饮业",
          orgData: { code: "8", name: "住宿和餐饮业" },
        },
        {
          value: "9",
          label: "信息传输、软件和信息技术服务业",
          orgData: { code: "9", name: "信息传输、软件和信息技术服务业" },
        },
      ]);
    });
  },
};

export default {
  name: "codeSelect",
  components: { CommonSelect },
  props: {
    code: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: [String, Array, Number],
      default() {
        return [];
      },
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      svalue: this.value,
    };
  },
  created() {},
  mounted() {},
  methods: {
    loadData() {
      let params = {
        codeDefId: this.code.code,
        dataFilter: this.code.dataFilter,
        columns: this.code.columns,
        params: this.code.codeparams,
      };
      return new Promise((resolve, reject) => {
        queryutil
          .getCodeList(params)
          .then((response) => {
            let obj = response;
            // obj = obj.datas[0].columnValue.map((item) => {
            //   //组装下拉框内容
            //   return {
            //     value: item[0],
            //     label: item[1],
            //     orgData: item,
            //   };
            // });

            resolve([
              { value: 0, label: "文化、体育和娱乐业0" },
              { value: 1, label: "文化、体育和娱乐业1" },
              { value: 2, label: "文化、体育和娱乐业2" },
              { value: 3, label: "文化、体育和娱乐业3" },
              { value: 4, label: "文化、体育和娱乐业4" },
              { value: 5, label: "文化、体育和娱乐业5" },
              { value: 6, label: "文化、体育和娱乐业6" },
              { value: 7, label: "文化、体育和娱乐业7" },
              { value: 8, label: "文化、体育和娱乐业8" },
              { value: 9, label: "文化、体育和娱乐业9" },
            ]);
          })
          .catch((res) => {
            reject(res);
          });
      });
    },
    change(val, orgData) {
      this.$emit("change", val, orgData);
    },
  },
  computed: {},
  watch: {
    value(nv) {
      this.svalue = this.value;
    },
  },
};
</script>
<style scoped></style>
