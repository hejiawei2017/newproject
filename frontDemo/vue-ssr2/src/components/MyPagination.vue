<template>
  <div class="pagination-box">
    <b-pagination
      v-model="currentPage"
      :total-rows="total"
      ref="my-pagination"
      :per-page="perPage"
      aria-controls="my-table"
      align="center"
      hide-goto-end-buttons
      @change="handleChangePage"
    ></b-pagination>
    <template v-if="showPaginationBtn">
      <span class="pagination-text">跳转至第</span
      ><input
        class="pagination-input"
        type="text"
        v-model="jumpPage"
      />页<button class="pagination-btn" @click="handlePagiBtnClick">
        确定
      </button>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    total: { // 总页数
      type: [Number,String],
      default:4
    },
    perPage: { // 每页行数
      type: [Number,String],
      default:4
    },
    showPaginationBtn: { // 是否显示输入框和按钮
      type: Boolean,
      default:true
    },
    showBgColor:{ // 选中的分页是否增加背景颜色
      type: Boolean,
      default:true
    },
    itemBgColor:{ // 没有选中的分页的背景颜色
      type: String,
      default:'#fff'
    },
  },
  data () {
    return {
      currentPage: 1,
      jumpPage: "",
    }
  },
  mounted(){
    this.sePaginationBjColor()
  },
  methods: {
    handleChangePage(pageSize) {
      this.sePaginationBjColor();
      this.$emit("changePage", pageSize);
    },
    handlePagiBtnClick() {
      if (isNaN(+this.jumpPage)) return;
      const MaxLength = this.total - this.perPage + 1
      if (+this.jumpPage >= MaxLength) this.jumpPage = MaxLength;
      this.currentPage = this.jumpPage
      this.sePaginationBjColor();
      this.$emit("changePage", this.currentPage);
    },
    sePaginationBjColor() {
      this.$nextTick(() => {
          if (this.showBgColor) {
            this.$refs["my-pagination"].$el.children.forEach((item) => {
              item.setAttribute("id", "");
              item.children.forEach((children) => {
                children.style.backgroundColor = this.itemBgColor
                if (item.className.includes("active")) {
                  children.style.backgroundColor = "";
                  item.setAttribute("id", "active-id");
                }
              });
            });
          }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/_handle.scss";
.pagination-box {
    display: flex;
    justify-content: center;
    align-items: center;
    ::v-deep .pagination {
      margin: 0;
      font-size: 20px;
      .page-item {
        .page-link {
          @include font_color("font_color2");
          font-weight: 300;
          background-color: #fff;
          border: none;
          &:focus {
            box-shadow: none;
          }
        }
        &.active {
          .page-link {
            @include font_color("font_color1");
            font-weight: 600;
            background-color: #fff;
            border: none;
            &:focus {
              box-shadow: none;
            }
          }
        }
        &#active-id {
          .page-link {
            @include background_color("background_color1");
            color: #fff;
          }
        }
      }
    }
    .pagination-text {
      margin-left: 10px;
      font-size: 16px;
      font-weight: 300;
    }
    .pagination-input,
    .pagination-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
      height: 32px;
      font-size: 14px;
      border: 1px solid #f1f1f1;
      @include font_color("font_color2");
      background-color: #fff;
      border-radius: 3px;
      outline: none;
    }
    .pagination-input {
      width: 60px;
    }
    .pagination-btn {
      width: 60px;
      &:focus {
        @include background_color("background_color1");
        color: #fff;
      }
    }
  }
</style>
