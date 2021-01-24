<template>
  <div class="common-table">
    <el-table
      ref="table"
      v-bind="options"
      :data="data"
      v-on="events"
      v-scrollbar="'table'"
      @row-contextmenu="rowContextMenu"
    >
      <el-table-column
        v-if="showSelection"
        v-bind="selectionOptions"
        fixed="left"
        align="center"
        type="selection"
        width="40"
        class-name="no-copy"
      ></el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        width="68"
        align="center"
        label="序号"
        class-name="no-copy"
      ></el-table-column>
      <template v-for="item in columns">
        <slot :name="item.prop" :slot-scope="item">
          <common-table-column v-bind="item"></common-table-column>
        </slot>
      </template>
      <el-table-column
        v-if="showOperation"
        fixed="right"
        :width="operationWidthCalc"
        align="center"
        label="操作"
        class-name="no-copy"
      >
        <template slot-scope="scope">
          <el-dropdown v-if="operationType === 'dropDown'">
            <!--<i class="el-icon-more"></i>-->
            <span class="el-dropdown-link">...</span>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, $key) in operationBtnGetter(scope)">
                <el-dropdown-item
                  :key="$key"
                  @click.native.prevent="item.handler(scope)"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <template v-else>
            <el-button
              class="list-btn"
              type="text"
              :icon="item.icon"
              v-for="item in operationBtnGetter(scope)"
              :key="item.label"
              @click.native.prevent="item.handler(scope)"
              >{{ item.label }}</el-button
            >
          </template>
        </template>
      </el-table-column>
      <template slot="empty">
        <slot name="empty">
          <div class="empty-content"></div>
        </slot>
      </template>
    </el-table>
    <div
      v-if="showPagination"
      class="common-table-pagination"
      :class="{ 'common-table-pagination-border': paginationBorder }"
    >
      <el-pagination
        v-bind="pagination"
        :page-size.sync="pagination.pageSize"
        :current-page.sync="pagination.currentPage"
        @current-change="current => emitLoadData(current)"
        @size-change="size => emitLoadData(1)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import commonTableColumn from "./common-table-column.vue";
import { showContextMenu } from "./contextmenu";

export default {
  name: "gtcTable",
  components: { commonTableColumn },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    /*属性名用驼峰命名法*/
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    events: {
      type: Object,
      default() {
        return {};
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    pagination: {
      type: Object,
      default() {
        return {};
      }
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    showOperation: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    operationType: {
      type: String,
      /*list：平铺的操作按钮，数量较少不超过4个，dropDown：下拉的按钮，数量可以较多*/
      default: "dropDown"
    },
    total: {
      type: Number,
      default: 0
    },
    /*操作栏的按钮列表获取方法，可根据行状态而改变显示的按钮*/
    operationBtnGetter: {
      type: Function,
      default(scope) {
        //todo 这里应该默认返回一个空数组
        return [];
      }
    },
    operationWidth: {
      type: [String, Number],
      default: null
    },
    selectionOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    this.setDefValue(this.options, this.defTableOptions);
    this.setDefValue(this.events, this.defTableEvent);
    // this.pagination.total = this.total;
    this.setDefValue(this.pagination, this.defPagination);
  },
  mounted() {
    this.bindMethods("table");
    if (this.$el.querySelector(".el-table__empty-text")) {
      this.$el.querySelector(".el-table__empty-text").style.marginLeft =
        (this.$el.offsetWidth - 300) / 2 + "px";
    }
  },
  activated() {
    this.$refs.table.doLayout();
  },
  data() {
    return {
      defTableOptions: {
        highlightCurrentRow: true
        // border: true
      },
      defTableEvent: {
        ...this.$listeners
      },
      defPagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 50, 100],
        background: true,
        layout: "sizes, prev, pager, next, total, jumper"
      }
    };
  },
  methods: {
    emitLoadData(current) {
      this.pagination.currentPage = current;
      this.$emit(
        "load-data",
        this.pagination.pageSize,
        this.pagination.currentPage
      );
    },
    rowContextMenu(row, column, event) {
      showContextMenu(row, column, event);
    }
  },
  computed: {
    paginationBorder() {
      return (
        this.options.border ||
        this.columns.some(item => item.children && item.children.length > 0)
      );
    },
    operationWidthCalc() {
      if (this.operationType === "dropDown") return "60";
      if (this.operationWidth === null)
        return this.operationBtnGetter({ row: {} }).length * 50 + "";
      else return this.operationWidth;
    }
  },
  watch: {
    total() {
      this.pagination.total = this.total;
    }
  }
};
</script>
<style scoped>
.common-table {
  border: 0;
}
.common-table >>> .el-table--scrollable-x .el-table__body-wrapper {
  overflow: hidden;
  position: relative;
}
.common-table >>> .ps__rail-x {
  opacity: 1 !important;
  z-index: 99;
}

.common-table >>> .ps__rail-x .ps__thumb-x {
  background-color: rgba(144, 147, 153, 0.3);
}
.common-table >>> .ps__rail-x .ps__thumb-x:hover {
  background-color: rgba(144, 147, 153, 0.6);
}

.common-table >>> .el-table__fixed {
  height: 100% !important;
}
.common-table >>> .el-table__fixed-right {
  height: 100% !important;
}

.el-icon-more {
  cursor: pointer;
}
.common-table-pagination {
  background-color: #ffffff;
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}
.common-table-pagination-border {
  /*border: 1px solid #ebeef5;*/
}
.common-table-pagination >>> .btn-prev,
.common-table-pagination >>> .btn-next,
.common-table-pagination >>> .el-pager li {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 4px;
}
.common-table-pagination >>> .el-pager .more {
  border: 0;
}
.common-table >>> .el-table__header .cell {
  font-weight: normal;
}
.el-dropdown-link {
  cursor: pointer;
  width: 56px;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
}
.list-btn {
  padding-top: 0;
  padding-bottom: 0;
  color: #007aff;
}
.list-btn:hover {
  opacity: 0.8;
}
.common-table >>> .el-table__empty-block {
  height: 300px !important;
}
.common-table >>> .el-table__empty-text {
  position: relative;
  left: 0;
  top: 0;
  margin-left: 590px;
  margin-top: 300px;
}
.empty-content {
  height: 300px;
  /*background: url('../../../assets/img/table-no-data2.png') no-repeat 150px 0;*/
  background-size: contain;
}
</style>
