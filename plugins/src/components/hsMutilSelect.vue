<template>
  <h-select
    :class="['common-select']"
    v-model="svalue"
    multiple
    filterable
    remote
    :remote-method="remoteMethod"
    :placeholder="placeholder"
    queryNotEmpty
    v-loadMore="load"
    @on-change="change"
    @on-focus="focus"
    @on-blur="blur"
    :loading="loading"
    collapseTags
    :multClearable="clearable"
    :disabled="disabled"
    :size="size"
    :label="labelList"
  >
    <div v-if="colConfig.length" class="select-header">
      <span v-for="(col, index) in colConfig" :key="index">{{
        col.title
      }}</span>
    </div>

    <h-option
      v-show="haveSelectShow"
      class="select-body"
      v-for="item in haveSelectList"
      :key="item[id] + 'has'"
      :label="item[name]"
      :value="item[id]"
    >
      <slot name="option" :scope="item">
        <div class="select-list">
          <span v-for="(col, index) in colConfig" :key="index">{{
            item[col.field]
          }}</span>
        </div>
      </slot>
    </h-option>
    <h-option
      v-show="!haveSelectShow"
      class="select-body"
      v-for="item in dropList"
      :key="item[id]"
      :label="item[name]"
      :value="item[id]"
    >
      <slot name="option" :scope="item">
        <div class="select-list">
          <span v-for="(col, index) in colConfig" :key="index">{{
            item[col.field]
          }}</span>
        </div>
      </slot>
    </h-option>
    <div class="select-footer" v-if="isStaticData">
      <!-- <span @click="footerClick" class="btn">点击全选</span> -->
      <span class="select-percent"
        >{{ svalue.length }}/{{ options.length }}</span
      >
      <h-button @click="changeCheckAll()" type="primary">
        <span v-if="isCheckAll">全选</span>
        <span v-if="!isCheckAll">全不选</span>
      </h-button>
      <h-button @click="showSelectedList" type="primary">显示已选</h-button>
      <h-button @click="showAll" type="primary">显示全部</h-button>
      <!-- <span @click="showSelectedList" class="btn">显示已选</span>
      <span @click="showAll" class="btn">显示全部</span> -->
    </div>
    <div class="select-footer" v-if="!isStaticData">
      <span class="select-percent">{{ svalue.length }}/{{ pageTotal }}</span>
    </div>
  </h-select>
</template>

<script>
import axios from "axios";

import Vue from "vue";
Vue.directive("loadMore", {
  inserted(el, binding, vnode) {
    debugger;
    // 获取element-ui定义好的scroll盒子
    const selectdownDom = el.querySelector(".h-select-dropdown-content");
    selectdownDom.addEventListener("scroll", function () {
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (condition) {
        binding.value();
      }
    });
  },
});

// Vue.directive("showHeader", {
//   inserted(el, binding, vnode) {
//     if (!binding.value) return;
//     let header = document.createElement("div");
//     header.className="select-header"
//     header.innerHTML = `<label class="h-checkbox-wrapper h-select-item-checkbox">
//       <span class="h-checkbox"><span class="h-checkbox-inner"></span>
//       <input type="checkbox" tabindex="0" class="h-checkbox-input"></span>
//     </label>`
//     +`${vnode.componentInstance.$attrs.columns.map((item) => {
//            return `<span>${item.title}</span>`
//            }).join(' ')}`
//     el.querySelector(".h-select-dropdown").insertBefore(
//       header,
//       el.querySelector(".h-select-dropdown-content")
//     );
//     const checkDom = el.querySelector(
//       ".select-header .h-checkbox-input"
//     );
//     checkDom.addEventListener("click", function () {
//       checkDom.setAttribute('checked',!this.isCheckAll)
//     })
//   },
//   unbind(el, binding, vnode) {},
// });

export default {
  name: "HsMutilSelect",
  props: {
    colConfig: {
      type: [Array],
      default() {
        return [
          { field: "fund_code", title: "产品代码" },
          { field: "fund_name", title: "产品名称" },
        ];
      },
    },
    //下拉列表每项显示的字段名称
    name: {
      type: String,
      default() {
        return "fund_name";
      },
    },
    //下拉列表选中的值
    id: {
      type: String,
      default() {
        return "fund_code";
      },
    },
    labels: {
      type: [Array, String],
      default() {
        return [];
      },
    },
    //配置静态数据
    options: {
      type: [Array],
      default() {
        return [];
      },
    },
    placeholder: {
      type: String,
      default() {
        return "请选择";
      },
    },
    //外层value值
    value: {
      type: [String, Array, Number],
      default() {
        return [];
      },
    },
    size: {
      type: String,
      default: "small",
    },
    showValue: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
    //原始的多选样式
    orgMultiple: { type: Boolean, default: true },
    // 多选
    multiple: { type: Boolean, default: true },

    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    /*code、dict*/
    type: { type: String, default: "code" },
    config: { type: Object },
    getParams: {
      type: Function,
      default(params, config) {
        /*如果配置里有参数处理方法。则调用该方法*/
        if (typeof config.getParams === "function") {
          return config.getParams(params, config);
        }
        return params;
      },
    },
    /* 返回promise并传回{data,totalPage,nameCol,codeCol}
     *  调用 FRONTCOMMCODE010 码表查询接口时，无需传入该方法
     * */
    loadData: {
      type: Function,
      default(params, config) {
        /*如果配置里有参数处理方法。则调用该方法*/
        if (typeof config.loadData === "function") {
          return config.loadData(params, config);
        }
        return axios.get("http://localhost:3007/loadData", { params: params });
      },
    },
    getLabelsList: {
      type: Function,
      default(params, config) {
        return axios.get("http://localhost:3007/getLabelsList", {
          params: params,
        });
      },
    },
    events: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      //远程搜索组件
      svalue: null, //当前h-select的值
      dropList: [], //下拉的数据
      loading: false, //加载中提示
      page_index: 1,
      page_size: 10,
      isloadEnd: false, //是否加载完成
      filterValue: "", //搜索关键字
      selectOptions: [], //缓存的列表
      isDictionaries: false, //是否是字段类型的，不分页的静态数据，一次展示
      haveSelectShow: false, //显示已经选择的
      haveSelectList: [],
      checkAll: [],
      isCheckAll: true,
      pageTotal: 0,
      isInput: false,
      defaultLabel: [],
      isStaticData: false, //是否是静态数据
      oldTop: 0,
    };
  },
  created() {
    this.isStaticData = this.options.length > 0;
    this.setSvalue();
  },
  mounted() {
    //加载第一页面数据
    if (this.isStaticData) {
      this.isloadEnd = true;
      this.dropList = [...this.options];
      this.pageTotal = this.options.length;
    } else {
      this.initData();
    }

    //有设置默认值过来,用于编辑的情况
    if (this.labels.length > 0 && !this.isInput) {
      let result = [...this.labels];
      this.isInput = true;
      this.setNowList(result);

      if (this.multiple) {
        this.$emit(
          "change",
          result.map((item) => {
            return item[this.id];
          })
        );
      } else {
        this.$emit(
          "change",
          result.map((item) => {
            return item[this.id];
          })[0]
        );
      }
    }
    this.listUl = this.$el.querySelector(".h-select-dropdown-content");
    this.listInner = this.$el.querySelector(".h-select-dropdown-list");

    //默认清除验证
    this.clearValidate();
  },
  methods: {
    showSelectedList() {
      if (this.multiple) {
        this.haveSelectShow = true;
        let selectItems = this.svalue.map((val) => {
          let it = this.dropList.find((item) => {
            if (item[this.id] == val) {
              return true;
            }
          });
          if (it) {
            return it;
          }
        });
        selectItems = selectItems.filter((item) => {
          if (item) {
            return true;
          }
        });
        this.haveSelectList = selectItems || [];
      }
    },
    showAll() {
      this.haveSelectShow = false;
      if (this.isStaticData) {
        this.dropList = [...this.options];
      } else {
        this.isloadEnd = false;
        this.page_index = 1;
        this.initData();
      }
    },
    changeCheckAll() {
      let selectAll = [];
      if (this.isCheckAll) {
        this.haveSelectShow = false;
        if (this.multiple) {
          selectAll = this.dropList.map((item) => {
            return item[this.id];
          });
          console.log("selectAll", selectAll);
          this.svalue = selectAll;
        }
      } else {
        this.svalue = [];
        selectAll = [];
      }
      this.isCheckAll = !this.isCheckAll;
      this.$emit("change", selectAll);
    },
    clear() {
      //点击右边X 清除已经选择的数据
      this.filterValue = "";
      this.selectOptions = [];
      this.page_index = 1;
      this.isloadEnd = false;
      this.remoteMethod(this.filterValue, this.page_index);
    },
    setSvalue() {
      //设置选中值
      this.svalue = this.value;
    },
    getValue() {
      //获取当前选中的值
      return this.svalue;
    },

    change(val) {
      //选择完成的时候发送事件到外层的父亲组件
      let v = this.getValue();
      if (!this.multiple) {
        let org = this.dropList.find((item) => item.value === this.svalue);
        this.selectOptions = [org];
      } else {
      }
      this.$emit("change", v);
      if (this.events && typeof this.events.change === "function") {
        this.events.change(v);
      }
    },
    //加载数据函数
    initData() {
      this.loading = true;
      let param = this.getParams(
        {
          filterValue: this.filterValue,
          page_index: this.page_index,
          page_size: this.page_size,
        },
        this.config
      );
      if (!param.filterValue) {
        delete param.filterValue;
      }

      this.loadData(param, this.config)
        .then((res) => {
          this.loading = false;
          let result = res.data.result;
          this.pageTotal = res.data.totalrecord;
          if (result.length < this.page_size) {
            this.isloadEnd = true;
          }
          if (this.page_index !== 1) {
            //判断是否是第一页面，不是就合并
            this.setNowList(this.dropList.concat(result));
          } else {
            //是的话就直接赋值
            if (this.isDictionaries) {
              this.isloadEnd = true;
            }
            this.setNowList(result);
          }
        })
        .catch((msg) => {
          console.error(msg);
        });
    },
    //赋值数据到当前的下拉列表
    setNowList(data) {
      data = this.getDistinctData(data);
      let val = this.svalue || "";
      if (!Number.isNaN(val)) {
        val += "";
      }
      if (data) {
        this.dropList = data;
      }
      this.$nextTick(() => {
        this.listUl.scrollTop = this.listInner.clientHeight * this.oldTop || 0;
        console.log("this.oldTop2", this.oldTop);
      });
    },
    //去重
    getDistinctData(data) {
      data = data || [];
      return this.selectOptions.concat(
        data.filter((item) => {
          return (
            this.selectOptions.findIndex((el) => {
              return el[this.id] === item[this.id];
            }) === -1
          );
        })
      );
    },
    scroll(e) {
      console.log("到哪了", e);

      if (e <= 7) {
        let handfn = () => {
          this.oldTop = this.listUl.scrollTop / this.listInner.clientHeight;
          this.load();
          console.log("this.oldTop ", this.oldTop);
        };
        if (window.timeout2) {
          clearTimeout(window.timeout2);
        }
        window.timeout2 = setTimeout(() => {
          console.log(111);

          handfn();
        }, 200);
      }
    },
    throttle2(func, delay) {
      let vm = this;
      if (vm.timeout2 !== null) clearTimeout(vm.timeout2);
      vm.timeout2 = setTimeout(func, delay);
    },
    load() {
      debugger;
      //如果是已经加载完毕就不加载了
      if (this.isloadEnd) {
        return;
      }
      //每次请求加一页，远程加载数据
      this.page_index++;
      this.remoteMethod(this.filterValue, this.page_index, false);
    },
    //搜索防抖，防止密集搜索
    throttle(func, delay) {
      let vm = this;
      if (vm.timeout !== null) clearTimeout(vm.timeout);
      vm.timeout = setTimeout(func, delay);
    },
    //远程加载函数
    remoteMethod(query, page = 1, isSearch = true) {
      this.filterValue = query;
      this.page_index = page;
      this.isloadEnd = false;
      this.haveSelectShow = false;
      let vm = this;
      let handleFn = () => {
        if (vm.isStaticData) {
          if (query === "") {
            vm.dropList = [...vm.options];
          }
          vm.dropList = vm.options.filter((item) => {
            if (item[vm.name].indexOf(query) != -1) {
              return true;
            }
          });
        } else {
          vm.initData();
        }
      };
      if (!isSearch) {
        handleFn();
      } else {
        this.oldTop = 0;
        vm.throttle(handleFn, 300);
      }
    },
    focus() {},
    blur() {
      this.filterValue = "";
    },
    //去除验证
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
    labelList() {
      let rlist = [];
      if (this.multiple) {
        rlist = [...this.labels].map((item) => {
          return item[this.name];
        });
      } else {
        rlist = [...this.labels]
          .map((item) => {
            return item[this.name];
          })
          .join(",");
      }

      return rlist;
    },
  },
  watch: {
    value(nv) {
      /*第一页数据已返回*/
      this.setSvalue();
    },
    labels(nv) {},
  },
};
</script>
<style scoped lang="scss">
.common-select {
  /deep/ .h-select-selection {
    max-width: initial;
    /deep/ .h-select-input {
      width: 20px;
    }
  }
  /deep/ .h-select-dropdown {
    /deep/ .h-select-dropdown-content {
      margin: 30px 0px 39px;
      padding: 0px;
    }
    /deep/ .h-select-dropdown-list {
      /deep/ .h-select-item {
        align-items: self-end;
        display: flex;
        background: #f9f7f7;
        border-bottom: 1px solid #fff;
        &:hover {
          background: #eaf5ff;
        }
        /deep/ .h-select-item-checkbox {
          align-items: flex-start;
          width: 20px;
        }
        /deep/ .select-list {
          flex: 1;
          display: flex;
          /deep/ span {
            flex: 1;
          }
        }
      }
    }
    /deep/ .select-header,
    /deep/ .select-footer {
      width: 100%;
      position: absolute;
      left: 0px;
      background-color: white;
      z-index: 999;
      text-align: right;
      padding: 5px 10px;
      border-top: 1px solid #ddd;
      bottom: 0px;
    }
    /deep/ .select-percent {
      line-height: 28px;
      float: left;
    }
    /deep/ .select-header {
      display: flex;
      top: 0px;
      background: #eaf5ff;
      height: 30px;
      padding-left: 40px;
      /deep/ span {
        flex: 1;
        text-align: left;
      }
    }
  }
}
.common-select-self {
  .common-select-label {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(96, 98, 102);
    font-size: 12px;
    padding-left: 15px;
  }
}
</style>
