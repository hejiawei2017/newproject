<template>
  <el-select
    :class="['common-select', { 'common-select-self': !orgMultiple }]"
    v-model="svalue"
    filterable
    remote
    :placeholder="placeholder"
    reserve-keyword
    v-load-more="load"
    v-multi-show="orgMultiple"
    @change="change"
    @focus="focus"
    @blur="blur"
    :remote-method="remoteMethod"
    :loading="loading"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :clearable="clearable"
    :style="{ width: swidth }"
    :disabled="disabled"
    :readonly="readonly"
  >
    <!--
      :key="item.value"-->
    <el-option
      v-for="item in dropList"
      :label="item.label"
      :value="item.value"
      :key="item.value"
    >
      <!--<span>{{ item.text }}</span>-->
    </el-option>
  </el-select>
  <!-- </div> -->
</template>

<script>
import bus from "@/common/bus.js";
// import localCode from "./localCode";
// import localDict from "./localDict";

import Vue from "vue";
Vue.directive("loadMore", {
  inserted(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const selectdownDom = el.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    selectdownDom.addEventListener("scroll", function () {
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (condition) {
        binding.value();
      }
    });
  },
});

Vue.directive("multiShow", {
  inserted(el, binding, vnode) {
    if (binding.value) return;
    if (!vnode.componentInstance.multiple) return;
    let obj = el.querySelectorAll(".el-select__tags>span");
    obj.forEach((item) => item.remove());
    let span = document.createElement("span");
    if (vnode.componentInstance.selected.length > 0) {
      span.innerHTML = `<div class="common-select-label">
          ${vnode.componentInstance.selected.map((item) => {
            return item.label;
          })}</div>`;
    }
    el.querySelector(".el-select__tags").insertBefore(
      span,
      el.querySelector(".el-select__tags .el-select__input")
    );
  },
  update(el, binding, vnode) {
    binding.def.inserted(el, binding, vnode);
  },
  unbind(el, binding, vnode) {},
});

let localCode = {};
let localDict = {};

let allData = {
  code: { ...localCode },
  dict: { ...localDict },
};
/*1:有请求正在进行，2已加载*/
let loadStatus = {};
export function getAllDataByKey(type, key) {
  return allData[type][key];
}

export function getLabel(type, key, value) {
  let obj = allData[type][key].find((item) => item.value === value);
  if (obj) {
    return obj.label;
  }
  return null;
}
export default {
  name: "commonSelect",
  props: {
    // 必填,配置
    config: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
    placeholder: {
      type: String,
      default() {
        return "请选择";
      },
    },
    value: {
      type: [String, Array, Number],
      default() {
        return "";
      },
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
    //原始的多选样式
    orgMultiple: { type: Boolean, default: false },
    // 多选
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    /*code、dict*/
    type: { type: String, default: "code" },
    swidth: { type: String, default: "100%" },
    /*必传*/
    loadData: {
      type: Function,
      default() {
        return null;
      },
      required: true,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      //远程搜索组件
      svalue: null,
      dropList: [],
      loading: false,
      dataFilter: null,
      columns: null,
      page: 1,
      limit: 10,
      filterValue: "",
    };
  },
  created() {
    this.setSvalue();
  },
  mounted() {
    this.initData();
    bus.$on(`commonSelect.refreshCache`, (key) => {
      if (!key) return;
      delete allData[this.type][key];
      /*刷新目标缓存*/
      if (this.nowKey === key) {
        this.initData();
      }
    });
    /*重新设置*/
    bus.$on(`commonSelect.reset`, (key) => {
      if (!key) return;
      if (this.nowKey === key) {
        this.setNowList();
      }
    });
    /*慎用，会清空所有的缓存，并重新加载*/
    bus.$on("commonSelect.refreshAllCache", () => {
      allData = {
        code: { ...localCode },
        dict: { ...localDict },
      };
      this.initData();
    });
    this.clearValidate();
  },
  methods: {
    setSvalue() {
      this.svalue = this.multiple
        ? (this.value || "").split(",").filter((item) => item !== "")
        : this.value;
      // this.svalue = this.value;
      this.setNowList();
    },
    getValue() {
      // return this.svalue;
      if (this.multiple) {
        return this.svalue.length === 0 ? null : this.svalue.join(",");
      } else {
        return this.svalue === "" ? null : this.svalue;
      }
    },
    load() {
      //判断是否可以再加载，这个逻辑有点奇怪，性能不高
      if (this.listLen > this.nowAllData().length) return;
      this.page++;
      // this.setNowList();
      this.remoteMethod(this.filterValue, this.page);
    },
    change(val) {
      let v = this.getValue();
      let org = this.nowAllData().find((item) => item.value === this.svalue);
      this.$emit("change", v, org);
      if (this.events && typeof this.events.change === "function") {
        this.events.change(v, org);
      }
    },
    initData() {
      if (this.nowAllData().length > 0) {
        this.setNowList();
        return;
      }
      /*没有其他相同的key在请求时，才执行请求方法*/
      if (!loadStatus[this.nowKey]) {
        loadStatus[this.nowKey] = 1;
        this.loadData().then((data) => {
          allData[this.type][this.nowKey] = data || [];
          this.$nextTick(() => {
            bus.$emit("commonSelect.reset", this.nowKey);
          });
          loadStatus[this.nowKey] = 2;
          // this.setNowList();
        });
      }
    },
    setNowList(orgData = this.nowAllData()) {
      let val = this.svalue || "";
      if (!Number.isNaN(val)) {
        val += "";
      }
      this.dropList = orgData
        .sort((a, b) => {
          return val.includes(a.value) ? -1 : 1;
        })
        .slice(0, this.listLen);
    },
    remoteMethod(query, page = 1) {
      this.filterValue = query;
      if (query !== "") {
        this.loading = true;
        this.page = page;
        this.setNowList(
          this.nowAllData().filter((item) => {
            return item.label.includes(query);
          })
        );
        this.loading = false;
      } else {
        this.setNowList();
      }
    },
    focus() {
      this.page = 1;
      this.setNowList();
    },
    blur() {
      this.filterValue = "";
    },
    nowAllData() {
      return allData[this.type][this.nowKey] || [];
    },
    clearValidate() {
      let parent = this.$parent;
      while (parent) {
        if (typeof parent.clearValidate === "function") {
          this.$nextTick(() => {
            parent.clearValidate();
          });
          break;
        } else {
          parent = parent.$parent;
        }
      }
    },
  },
  computed: {
    listLen() {
      return this.page * this.limit;
    },
    nowKey() {
      return this.config.key || this.config.code;
    },
  },
  watch: {
    value(nv) {
      this.setSvalue();
    },
    config: {
      handler() {
        this.initData();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.common-select-self >>> .common-select-label {
  max-width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(96, 98, 102);
  font-size: 12px;
  padding-left: 15px;
}

.common-select-self >>> .el-tag {
  display: none;
}

.common-select >>> .el-icon-:before {
  content: "\E605";
}

.common-select >>> .is-focus .el-icon- {
  transform: rotateZ(0deg);
}
</style>
