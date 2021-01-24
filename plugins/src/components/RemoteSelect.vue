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
    @clear="clear"
    :remote-method="remoteMethod"
    :loading="loading"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :clearable="clearable"
    :disabled="disabled"
    :readonly="readonly"
    :size="size"
  >
    <div v-if="columnNames.length" class="select-header">
      <el-row>
        <el-col v-for="(col, index) in columnNames" :key="index">{{
          col
        }}</el-col>
      </el-row>
    </div>

    <el-option
      v-show="haveSelectShow"
      class="select-body"
      v-for="item in haveSelectList"
      :key="item[id] + 'has'"
      :label="item[name]"
      :value="item[id]"
    >
      <slot name="option" :scope="item">{{ item.label }}</slot>
    </el-option>

    <el-option
      v-show="!haveSelectShow"
      class="select-body"
      v-for="item in dropList"
      :key="item[id]"
      :label="item[name]"
      :value="item[id]"
    >
      <slot name="option" :scope="item">{{ item.label }}</slot>
    </el-option>
    <div class="select-footer">
      <span @click="footerClick" class="btn">点击全选</span>
      <span @click="haveSelect" class="btn">显示已选择</span>
    </div>
  </el-select>
</template>

<script>
import axios from "axios";

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
    console.log("multiShow");
    if (binding.value) return;

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
    //binding.def.inserted(el, binding, vnode);
  },
  unbind(el, binding, vnode) {},
});
export default {
  components: {},
  name: "remoteSelect",
  props: {
    columnNames: {
      type: [Array],
      default() {
        return [];
      },
    },
    //下拉列表每项显示的字段名称
    name: {
      type: String,
      default() {
        return "label";
      },
    },
    //下拉列表选中的值
    id: {
      type: String,
      default() {
        return "value";
      },
    },
    defaultItems: {
      type: [Array],
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
    collapseTags: {
      type: Boolean,
      default: true,
    },
    //原始的多选样式
    orgMultiple: { type: Boolean, default: true },
    // 多选
    multiple: { type: Boolean, default: false },

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
      svalue: null, //当前el-select的值
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
    };
  },
  created() {
    //绑定value值
    this.setSvalue();
  },
  mounted() {
    //加载第一页面数据
    if (this.options.length > 0) {
      this.dropList = this.options;
    } else {
      this.initData();
    }
    //有设置默认值过来,用于编辑的情况
    if (this.defaultItems.length > 0 && !this.defaultItems.isInput) {
      let result = [...this.defaultItems];
      this.defaultItems.isInput = true;
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
    //默认清除验证
    this.clearValidate();
  },
  methods: {
    haveSelect() {
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
        this.haveSelectList = selectItems;
      }
    },
    footerClick() {
      this.haveSelectShow = false;
      if (this.multiple) {
        let selectAll = this.dropList.map((item) => {
          return item[this.id];
        });
        this.svalue = selectAll;
        this.$emit("change", selectAll);
      }
    },
    selectEmpty() {
      this.svalue = [];
      this.$emit("change", []);
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
    load() {
      //如果是已经加载完毕就不加载了
      if (this.isloadEnd) {
        return;
      }
      //每次请求加一页，远程加载数据
      this.page_index++;
      this.remoteMethod(this.filterValue, this.page_index);
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
    initData() {
      //加载数据
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
    //远程加载函数
    remoteMethod(query, page = 1) {
      this.filterValue = query;
      this.page_index = page;
      this.isloadEnd = false;
      this.initData();
    },
    focus() {
      //this.page_index = 1;
      //this.isloadEnd = false;
      //this.setNowList();
    },
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
  computed: {},
  watch: {
    value(nv) {
      //外面通过v-model变化改变
      /*第一页数据已返回*/
      this.setSvalue();
    },
  },
};
</script>
<style >
.el-select-dropdown__list {
  padding-top: 30px !important;
  padding-bottom: 30px !important;
}
</style>
<style scoped>
.select-header,
.select-footer {
  width: 100%;
  height: 30px;
  position: absolute;
  left: 0px;
  background-color: white;
  z-index: 999;
  padding-left: 15px;
  padding-right: 15px;
}
.select-header {
  top: 0px;
}
.select-footer {
  bottom: 0px;
}

.select-footer .btn {
  padding: 3px 5px;
  background-color: steelblue;
  color: white;
  border-radius: 3px;
  float: right;
  margin-right: 15px;
  cursor: pointer;
}
.select-body {
}

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
