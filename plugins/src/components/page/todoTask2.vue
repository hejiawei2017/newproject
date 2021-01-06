<template>
  <div class="flex flex-column">
    <div class="card-header flex justify-between align-center">
      <div class="flex align-center">
        <div>待办事项</div>
        <div class="task-total flex align-center">
          {{ allTaskTypeList[0].num }}
        </div>
      </div>
      <div class="flex align-center cursor-pointer">
        <div class="more-btn">更多</div>
        <img
          class="more-icon"
          src="@hsfundPposHomePage/assets/notice/more-arrow.png"
        />
        <!-- <span v-for="(item, index) in allTaskTypeList" :key="index" class="todoTitle" @click="checkToDoList">{{item.typeName}}</span>
         <img class="refresh-icon cursor-pointer" src="@hsfundPposHomePage/assets/todoTask/refresh.png" alt="" /> -->
      </div>
    </div>
    <ul class="common-type-list flex flex-column">
      <h-form :model="formItem" :label-width="80">
        <h-form-item label="下拉多选demo">
          <hs-mutil-select
            ref="remoteSel"
            :config="{}"
            use-for="common"
            v-model="formItem.value"
            :colConfig="colConfig"
            :labels="labels"
            @change="change"
            :options="options"
            :loadData="loadData"
            :getLabelslist="getLabelslist"
          ></hs-mutil-select>
        </h-form-item>
        <h-form-item>
          <h-button type="primary" @click="submit">提交</h-button>
          <h-button type="ghost" style="margin-left: 8px">取消</h-button>
        </h-form-item>
      </h-form>

      <li
        v-for="(v, j) in toDoList"
        :key="j"
        class="common-type-item flex-1 flex align-center"
      >
        <div class="level-symbol" :class="[setLevelSymbolBgc(v.level)]">
          {{ v.levelName }}
        </div>
        <div class="task-info flex flex-column">
          <div class="task-title flex-1">{{ v.title }}</div>
          <div class="flex align-center">
            <div class="current-node">当前节点：{{ v.currentNodeName }}</div>
            <div class="sponsor">发起人：{{ v.sponsor }}</div>
            <div>{{ v.time }}</div>
          </div>
        </div>
        <!-- <div class="flex align-center">
          <span>处理</span>
        </div> -->
      </li>
    </ul>
    <!-- <h-tabs v-model="currentType" showArrow class="tab-pane-box flex-1 flex flex-column">
      <h-tab-pane v-for="(item, index) in allTaskTypeList" :key="index" :label="item.typeName + '(' + item.num + ')'" :name="item.typeCode">
        <!-- “全部”标签页 -->
    <!-- <template v-if="item.typeCode === 'all'">
          <div class="flex flex-wrap align-content-stretch type-list">
            <div v-for="(v, j) in taskTypeList" :key="j" class="type-item-box flex align-stretch">
              <div class="type-item flex-1 flex justify-between align-center">
                <div>
                  <div class="type-item-title">{{v.typeName}}</div>
                  <div class="todo-label">待处理数量:</div>
                </div>
                <div class="todo-num">{{v.num}}</div>
              </div>
            </div>
          </div>
        </template> -->

    <!-- 普通标签页 -->
    <!-- <template v-else>
          <ul class="common-type-list flex flex-column">
            <li v-for="(v, j) in item.list.slice(0, 4)" :key="j" class="common-type-item flex-1 flex align-center">
              <div class="level-symbol" :class="[setLevelSymbolBgc(v.level)]">{{v.levelName}}</div>
              <div class="task-info flex flex-column">
                <div class="task-title flex-1">{{v.title}}</div>
                <div class="flex align-center">
                  <div class="current-node">当前节点：{{v.currentNodeName}}</div>
                  <div class="sponsor">发起人：{{v.sponsor}}</div>
                  <div>{{v.time}}</div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </h-tab-pane>
    </h-tabs>  -->
  </div>
</template>

<script>
import hsMutilSelect from "@/components/hsMutilSelect";
import { queryPlatformAuthFundByUser } from "@hsfundPposBasic/api/baseCommon";
export default {
  components: { hsMutilSelect },
  name: "waitTask",
  data() {
    return {
      // totalTask: 14, // 全部待办事项条数
      allTaskTypeList: [], // 包含“全部”标签页的待办数组
      taskTypeList: [], // 不包含“全部”标签页的待办数组
      regulateReportTaskList: [], // 监管报表待办事项
      currentType: "all", // 当前激活的标签页

      /**多选组件测试代码start*/
      pageNum: 1,
      formItem: {
        value: [],
      },
      colConfig: [
        { field: "fund_code", title: "产品代码" },
        { field: "fund_name", title: "产品名称" },
      ],
      labels: [],
      options: [],
    };
  },
  mounted() {
    this.formItem = {
      value: [345664, 345665],
    };
    this.labels = [
      { fund_code: "IF0202", fund_name: "巨杉净值线13号B证券投资基金" },
      { fund_code: "IM6141", fund_name: "西岭成长私募证券投资基金B" },
    ];
  },
  methods: {
    loadData(param) {
      let _this = this;
      let gsv = window.LOCAL_CONFIG.gsv.pposBasic;

      return queryPlatformAuthFundByUser(gsv, param);
    },
    change() {
      debugger;
      console.log("val", this.val);
    },
    submit() {
      alert("勾选的数组values为：" + this.formItem.value);
    },
    /**多选组件测试代码end*/

    setLevelSymbolBgc(val) {
      let className = "";
      switch (val) {
        case "1":
          className = "red";
          break;
        case "2":
          className = "orange";
          break;
        case "3":
          className = "blue";
          break;
      }
      return className;
    },
    checkToDoList() {},
  },
  created() {
    let list = [
      {
        level: "1",
        levelName: "紧急",
        title:
          "HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私",
        currentNode: "",
        currentNodeName: "投资监督审核确认",
        sponsor: "系统管理员",
        time: "2020-09-24 14:23:42",
      },
      {
        level: "2",
        levelName: "重要",
        title: "HS202010-恒生财富增长私HS202010",
        currentNode: "",
        currentNodeName: "投资监督审核确认",
        sponsor: "系统管理员",
        time: "2020-09-24 14:23:42",
      },
      {
        level: "2",
        levelName: "重要",
        title:
          "HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私",
        currentNode: "",
        currentNodeName: "投资监督审核确认",
        sponsor: "系统管理员",
        time: "2020-09-24 14:23:42",
      },
      {
        level: "3",
        levelName: "普通",
        title:
          "HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私",
        currentNode: "",
        currentNodeName: "投资监督审核确认",
        sponsor: "系统管理员",
        time: "2020-09-24 14:23:42",
      },
      {
        level: "1",
        levelName: "紧急",
        title:
          "HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私HS202010-恒生财富增长私",
        currentNode: "",
        currentNodeName: "投资监督审核确认",
        sponsor: "系统管理员",
        time: "2020-09-24 14:23:42",
      },
    ];

    this.taskTypeList = [
      {
        typeName: "绩效分析",
        typeCode: "performanceAnalysis",
        num: 32,
        list: list,
      },
      { typeName: "信息变更", typeCode: "infoChanged", num: 20, list: list },
      { typeName: "产品募集", typeCode: "productRaise", num: 13, list: list },
      {
        typeName: "增值税管理",
        typeCode: "taxManagement",
        num: 18,
        list: list,
      },
      { typeName: "监管报表", typeCode: "regulateReport", num: 55, list: list },
      { typeName: "TA报表用印", typeCode: "TAReportSeal", num: 26, list: list },
      {
        typeName: "估值类报表用印",
        typeCode: "appraisementReportSeal",
        num: 30,
        list: list,
      },
      { typeName: "其他", typeCode: "others", num: 16, list: list },
    ];

    this.allTaskTypeList = [
      { typeName: "全部", typeCode: "all", num: 210 },
      ...this.taskTypeList,
    ];
    this.toDoList = list;
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
    background: url("../../assets/todoTask/task-num.png") no-repeat 100%;
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
