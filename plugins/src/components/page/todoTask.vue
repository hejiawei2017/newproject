<template>
  <div class="flex flex-column">
    <h-form :model="formItem" :label-width="80">
      <h-form-item label="输入框">
        <hs-mutil-select
          ref="remoteSel"
          :config="{}"
          use-for="common"
          v-model="formItem.value"
          :colConfig="colConfig"
          :labels="labels"
          @change="change"
          :multiple="true"
        ></hs-mutil-select>
      </h-form-item>
      <h-form-item>
        <h-button type="primary" @click="submit">提交</h-button>
        <h-button type="ghost" style="margin-left: 8px">取消</h-button>
      </h-form-item>
    </h-form>
  </div>
</template>

<script>
import hsMutilSelect from "@/components/hsMutilSelect";
export default {
  components: { hsMutilSelect },
  name: "waitTask",
  data() {
    return {
      //静态数据单选
      // formItem: {
      //   value: 345664,
      // },
      // labels: [{ value: 345664, label: "item14" }],

      //静态数据多选
      formItem: {
        value: [],
      },
      labels: [],

      options: [
        { value: 0, label: "itemq4" },
        { value: 1, label: "itemq5" },
        { value: 2, label: "itemq6" },
        { value: 3, label: "itemq7" },
        { value: 4, label: "itemq8" },
        { value: 5, label: "itemq7" },
        { value: 6, label: "itemq8" },
        { value: 7, label: "itemq7" },
        { value: 8, label: "itemq8" },
        { value: 9, label: "itemq7" },
        { value: 10, label: "itemq8" },
        { value: 11, label: "itemq7" },
        { value: 12, label: "itemq8" },
      ],
      colConfig: [
        { field: "value", title: "产品代码" },
        { field: "label", title: "产品名称" },
      ],
    };
  },
  created() {},
  mounted() {
    //多选赋值
    // this.formItem = {
    //   value: [345664, 345665],
    // };
    // this.labels = [
    //   { value: 345664, label: "itemq4" },
    //   { value: 345665, label: "itemq5" },
    // ];
    //单选赋值
    // this.formItem = {
    //   value: 14,
    // };
    // this.labels = [{ value: 14, label: "item14" }];
  },
  methods: {
    getParams(param, config) {
      //如果config有配置，用配置的
      if (config.getParam) {
        return config.getParam(param);
      }
      //没有就直接返回
      return param;
    },
    change() {
      console.log("val", this.val);
    },
    submit() {
      console.log(this.formItem);
    },
  },

  watch: {
    model19(nv) {
      debugger;
    },
  },
};
</script>
<style scoped lang="scss">
.task-total {
  height: 16px;
  margin-left: 5px;
  padding: 0 6px;
  background-color: #f14c5d;
  border-radius: 8px;
  color: #fff;
  font-size: 11px;
}
.refresh-icon {
  width: 16px;
  height: 16px;
}
/deep/ .tab-pane-box {
  .h-tabs-bar {
    height: 36px;
    margin: 0 16px;
  }
  .h-tabs-return,
  .h-tabs-enter {
    padding-top: 9.5px;
  }
  .h-tabs-content {
    flex: 1;
    padding-bottom: 26px;
  }
}
.type-list {
  height: 100%;
  padding-left: 20px;
}
.type-item-box {
  width: 25%;
  padding-right: 20px;
}
.type-item {
  margin-top: 16px;
  padding: 0 21px 0 24px;
  background-color: #f7f7f7;
  .type-item-title {
    font-size: 13px;
    color: #333;
  }
  .todo-label {
    margin-top: 8px;
    font-size: 13px;
    color: #888;
  }
  .todo-num {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 21px;
    color: #333;
    // background: url('../../assets/todoTask/task-num.png') no-repeat 100%;
  }
}
.todoTitle {
  margin-right: 10px;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid #fff;
  padding: 4px 12px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    border: 1px solid #037df3;
    color: #037df3;
    // background-color: #037DF3;
  }
}
.more-btn {
  color: #999;
  font-size: 13px;
  line-height: 25px;
}
.common-type-list {
  height: 100%;
  padding: 0 16px;
  .common-type-item {
    &:nth-child(even) {
      background-color: #eef3f9;
    }
    padding-left: 24px;
    font-size: 13px;
    color: #666;
    .level-symbol {
      width: 80px;
      min-width: 80px;
      height: 24px;
      margin-right: 27px;
      line-height: 24px;
      text-align: center;
      border-radius: 2px;
      color: #fff;
    }
    .red {
      background-color: #f14c5d;
    }
    .orange {
      background-color: #f2b044;
    }
    .blue {
      background-color: #037df3;
    }
    .task-info {
      overflow: hidden;
    }
    .task-title {
      margin-bottom: 4px;
      color: #333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .current-node,
    .sponsor {
      margin-right: 24px;
    }
  }
}
</style>,
