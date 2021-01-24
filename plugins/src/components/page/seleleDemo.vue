<template>
  <div>
    <!-- <code-dropdown></code-dropdown> -->
    <remote-select
      ref="remoteSel"
      :config="{}"
      use-for="common"
      v-model="val"
      :columnNames="columnNames"
      :defaultItems="defaultItems"
      :multiple="true"
    ></remote-select>

    <!-- <hs-mutil-select
      style="width: 300px; margin: 0 auto"
      ref="remoteSel"
      :config="{}"
      use-for="common"
      v-model="val"
      @change="change"
      :columnNames="columnNames"
      :defaultItems="defaultItems"
      :multiple="true"
    ></hs-mutil-select> -->
  </div>
</template>
<script>
// import codeDropdown from "@/components/CodeDropDown.vue";
import RemoteSelect from "@/components/RemoteSelect.vue";
// import hsMutilSelect from "@/components/hsMutilSelect.vue";
export default {
  components: {
    // codeDropdown,
    RemoteSelect,
  },
  data() {
    return {
      model19: [],
      cityList: [],

      columnNames: ["产品名称", "产品代码"],
      defaultItems: [{ value: 14, label: "item14" }],
      val: [],
    };
  },
  mounted() {
    setTimeout(() => {
      this.val = [0];

      this.cityList = [
        {
          value: "beijing",
          label: "北京市",
        },
        {
          value: "shanghai",
          label: "上海市",
        },
        {
          value: "shenzhen",
          label: "深圳市",
        },
        {
          value: "hangzhou",
          label: "杭州市",
        },
        {
          value: 1,
          label: "南京市",
        },
        {
          value: 2,
          label: "重庆市",
        },
      ];

      this.val = [14];

      this.model19 = ["beijing"];
      console.log(1111);
    }, 2000);
  },
  methods: {
    change() {
      console.log("val", this.val);
    },
  },
};
</script>

