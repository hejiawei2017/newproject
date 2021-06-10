<template>
  <div class="my_table" :style="tableData.style">
    <div class="container">
      <template v-if="tableData.title">
        <div class="my_table_header">
          <h2 class="my_table_header_title">{{ tableData.title }}</h2>
          <div class="my_table_search">
            <b-input-group>
              <!--<template v-if="showSelector" #prepend>-->
                <!--<b-dropdown :text="targetDropItem.label" no-flip>-->
                  <!--<b-dropdown-item-->
                    <!--v-for="(item, index) of dropDownArr"-->
                    <!--:key="index"-->
                    <!--@click="toggleLabel(item)"-->
                    <!--&gt;{{ item.label }}</b-dropdown-item-->
                  <!--&gt;-->
                <!--</b-dropdown>-->
              <!--</template>-->

              <b-form-input
                placeholder="请输入您想查询的内容"
                v-model="value"
                trim
                debounce="500"
                @change="inputChange"
                @keyup.enter.native="handleSearch(value, targetDropItem.value)"
              ></b-form-input>

              <template #append>
                <button
                  class="search-btn"
                  type="button"
                  @click="handleSearch(value, targetDropItem.value)"
                >
                  <img src="~@/assets/img/search/searchIcon.png" alt="" />
                </button>
              </template>
            </b-input-group>
          </div>
          <div class="my_table_btn_group">
            <button
              v-for="(item, index) in btnList"
              :key="index"
              class="my_table_btn"
              :class="{ active: btnActive === index }"
              @click="handleBtnClick(index)"
            >
              {{ item.value }}
            </button>
          </div>
        </div>
      </template>

      <template v-if="tableData.dataSource">
        <b-table
          :items="tableData.dataSource"
          :fields="tableData.columns"
          responsive="sm"
          bordered
          hover
          :tbody-tr-class="rowClass"
          tableClass="publicity-table"
          theadClass="publicity-table-header"
          theadTrClass="publicity-table-header-tr"
          style="text-align: center"
        >
          <template #head()="data">
            <div class="drop-theader" v-if="data.field.isDrop">
              <b-dropdown id="dropdown-offset" offset="-18" no-flip :text="data.label" class="table-header-drop">
                <b-dropdown-item href="#"
                                 v-for="(d,idx) of data.field.dropArr" :key="idx"
                                 @click="clickDropItem(d,idx)">{{d.name}}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="drop-theader" v-if="data.field.isCascader">
              <button id="dropdown-offset__BV_toggle_" aria-haspopup="true" aria-expanded="false" type="button" class="btn dropdown-toggle btn-secondary">{{data.label}}</button>
              <el-cascader
                      :props="props"
                      v-model="servicearea"
                      class="drop-cascader"
              ></el-cascader>
            </div>
            <div class="publicity-table-header" v-if="!data.field.isDrop && !data.field.isCascader">{{ data.label }}</div>
          </template>
          <template #cell(level)="row">
            <b-icon icon="alert-circle-fill"></b-icon>{{ row.value }}
          </template>
        </b-table>
      </template>

      <template>
        <b-modal
          v-model="modalShow"
          centered
          modalClass="my-modal-class"
          headerClass="my-header-class"
          footerClass="my-footer-class"
          bodyClass="my-body-class"
          contentClass="my-content-class"
        >
          <template #modal-header-close>
            <b-icon icon="x-circle-fill"></b-icon> </template>
          <div class="my-mode-box">
            <img
              class="my-mode-img"
              src="@/assets/img/Inspection/my-table-img.png"
            />
            <p class="my-mode-text">抱歉您不是消费者，无法使用此功能</p>
          </div>
        </b-modal>
      </template>

      <MyPagination
        v-if="tableData.dataSource"
        :total="tableData.total || 0"
        :perPage="tableData.perPage || 1"
        :itemBgColor="(tableData.style && tableData.style.background) || '#fff'"
        @changePage="handleChangePage"
      ></MyPagination>
      <empty v-if="!tableData.dataSource"></empty>
    </div>
  </div>
</template>

<script>
import MyPagination from "@/components/MyPagination.vue";
import empty from "../components/empty";
import common from "@/api/common.js";
export default {
  components: {
    MyPagination,
    empty,
  },
  props: {
    tableData: {
      type: Object,
      default: () => ({
        perPage: 4, // 分页-每页行数
        columns: [
          // 表格头部数据
          { name: "共建方名称" },
          { level: "共建方警示级别" },
          { creditCode: "统一社会信用代码" },
          { region: "国别/地区" },
          { time: "警示时间" },
          { cause: "警示原因" },
        ],
        dataSource: [
          // 表格列表数据
          {
            name: "某企业",
            level: "1级",
            creditCode: "统一社会信用代码",
            region: "中国",
            time: "2021.4.21",
            cause: "警示原因",
          },
        ],
      }),
    },
    showSelector: {
      type: Boolean,
      default: false,
    },
    dropDownArr:{
      type: Array,
      default: () => ([
        { label: "需求状态", value: "OGCODE" },
        { label: "需求类型", value: "IDCARD" },
        { label: "服务分类", value: "ORDERNO" },
        { label: "发布企业", value: "VIN" },
        { label: "发布时间", value: "WAYBILLNO" },
      ]),
    }
  },
  data() {
    return {
      btnList: [
        // { value: "需求响应", id: 0 },
        { value: "免费发布需求", id: 1 },
      ],
      btnActive: 0,
      currentPage: 1,
      jumpPage: "",
      value: "",
      targetDropItem: this.dropDownArr[0],
      modalShow: false,
      servicearea:[],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node;
          common.placecode({
            codeDefId: 'GTC-MGRTB.ncode',
            params: {
              SQLFILTER: `pncode='${level > 0 ? node.value : 990001}'`
            }
          }).then(response => {
            let data = JSON.parse(response.data.data);

            const nodes = data.datas[0].columnValue.map(item => ({
              value: item[0],
              label: item[1],
              leaf: level >= 2
            }));
            resolve(nodes);
          });
        }
      },
    };
  },
  computed: {
    rows() {
      return this.tableData.dataSource.length;
    },
    isShowPagination() {
      return this.tableData.dataSource.length > this.tableData.perPage;
    },
  },
  mounted() {},
  methods: {
    handleBtnClick(index) {
      this.btnActive = index;
      console.log(index);
      this.modalShow = true;
      this.$emit("changeBtn", index);
    },
    rowClass(item) {
      if (item.rowColor) return "table-color-row";
      return "";
    },
    handleChangePage(pageSize) {
      console.log(pageSize);
      this.$emit("changePage", pageSize);
    },
    handleSearch(val, label) {
      this.$emit("search", val, label);
    },
    inputChange(e) {
      this.value = e;
    },
    toggleLabel(e) {
      this.targetDropItem = e;
    },
    clickDropItem(d,idx){
      this.$emit("search", d, idx);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.my_table {
  padding: 100px 0;
  min-height: 600px;
  @include font_color("font_color2");
  .my_table_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .my_table_header_title {
      font-size: 48px;
      font-weight: bold;
      @include font_color("font_color2");
    }
    .my_table_search {
      display: flex;
      margin-left: 300px;
      width: 455px;
      height: 55px;
      ::v-deep .btn-secondary {
        min-width: 80px;
        background: #f6f6f6;
        color: #444;
        border: none;
        border-radius: 0;
        font-size: 14px;
        &:focus {
          box-shadow: none;
        }
      }
      ::v-deep .dropdown-menu {
        min-width: 7rem;
        border-radius: 0;
        border: none;
        background: rgb(246 246 246);
        box-shadow: 7px 12px 18px 0px rgb(169 169 169 / 30%);
        .dropdown-item {
          padding: 10px 0;
          text-align: center;
          border-bottom: 1px solid rgba(68 68 68 / 10%);
        }
        li:last-child {
          .dropdown-item {
            border-bottom: none;
          }
        }
      }
      .form-control {
        flex: 1;
        height: 100%;
        padding-left: 30px;
        border: none;
        outline: none;
        background: #f6f6f6;
        &:focus {
          box-shadow: none;
        }
      }
      .search-btn {
        width: 86px;
        height: 100%;
        border: none;
        outline: none;
        opacity: 0.5;
        @include background_color("background_color1");
        img {
          width: 18px;
        }
      }
    }
    .my_table_btn {
      margin-left: 22px;
      width: 170px;
      height: 55px;
      outline: none;
      border: 1px solid #fff;
      @include border_color("border_color1");
      background: #fff;
      @include font_color("font_color1");
      &.active {
        color: #fff;
        @include background_color("background_color1");
      }
    }
  }
  ::v-deep .publicity-table {
    .publicity-table-header {
      @include background_color("background_color1");
        .dropdown-menu{
            border-radius: 0;
        }
      .publicity-table-header-tr {
        th {
          font-size: 18px;
          font-weight: 400;
          color: #fff;
          border-bottom-width: 1px;
          @include border_color("border_color1");
        }
      }
    }
    .drop-theader{
      position: relative;
      .table-header-drop{
        width: 100%;
      }
      .dropdown-menu{
        width: 100%;
        margin: 16px;
        z-index: 4;
        @include background_color('background_color1');
        border: none;
      }
      .dropdown-item{
        padding: 16px;
        color: #ffffff;
        &:hover,&:focus,&:active{
          @include background_color('background_color5');
        }

      }
      .drop-cascader{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
      .c-tit::after {
        display: inline-block;
        margin-left: 0.255em;
        vertical-align: 0.255em;
        content: "";
        border-top: 0.3em solid;
        border-right: 0.3em solid transparent;
        border-bottom: 0;
        border-left: 0.3em solid transparent;
      }
      .btn{
        padding: 0;
        font-size: 18px;
        line-height: normal;
        :focus-visible {
          outline: none;
        }
      }
      .btn-secondary {
          color: #fff;
         background-color: transparent;
         @include border_color('border_color1')
      }
      .el-cascader .el-input .el-input__inner {
        display: none;
      }
      .el-cascader .el-input .el-icon-arrow-down{
        display: none;
      }

    }
    tbody {
      tr {
        background: #fff;
        &:hover {
          background: #ececec;
        }
      }
    }
    th,
    td {
      padding: 16px;
      border: 1px solid #eee;
    }
    .table-color-row {
      @include table_row_bj_color("table_row_bj_color1");
    }
  }
}

::v-deep .my-modal-class {
  .my-content-class {
    .my-header-class {
      border: none;
    }
    .my-body-class {
      padding-bottom: 40px;
      .my-mode-box {
        text-align: center;
        // .my-mode-img {
        // }
        .my-mode-text {
          margin-top: 20px;
          font-size: 24px;
          font-weight: 400;
          color: #444444;
        }
      }
    }
    .my-footer-class {
      display: none;
    }
  }
}
</style>
