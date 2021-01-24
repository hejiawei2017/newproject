<!--<template>
  <el-table-column v-bind="$props">
    <template v-for="(item, index) in children">
      <common-table-column :key="index" v-bind="item"></common-table-column>
    </template>
    <template slot-scope="scope">
      <template v-if="isHtmlContent(scope)">
        <div class="text-wrap" v-html="contentData[scope.$index]"></div>
      </template>
      <template v-else>
        {{ contentData[scope.$index] }}
      </template>
    </template>
  </el-table-column>
</template>-->

<script>
import { TableColumn } from "element-ui";

const pattern = /<[^>]+>/g;
export default {
  name: "common-table-column",
  components: {},
  props: {
    ...TableColumn.props,
    formatter: {
      type: Function,
      default(row, column, cellValue, index) {
        return cellValue || "";
      },
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: "center",
    },
    children: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  render(h) {
    return h(
      TableColumn,
      {
        props: this.$props,
        //todo 这里先判断是否html代码，是则从作用域插槽中渲染，否则在子节点中渲染
        scopedSlots: {
          default: ({ row, column, $index }) => {
            // console.log(this);
            let text = column.formatter(
              row,
              column,
              row[column.property],
              $index
            );
            if (!text) return text;
            if (text.template) {
              let node = Vue.compile(text.template);
              return h(node, text.options);
            } else if ((text + "").match(pattern)) {
              let node = Vue.compile(text);
              return h(node);
            } else {
              return text;
            }
            // console.log(node);
          },
        },
      },
      this.children.map((child) => {
        return h(this, { props: child });
      })
    );
  },
  data() {
    return {
      isHtml: false,
      contentData: {},
    };
  },
  methods: {
    isHtmlContent(scope) {
      let { row, column, $index } = scope;
      let str = this.formatter(row, column, row[scope.column.property], $index);
      this.contentData[$index] = str;
      return (str + "").match(pattern) !== null;
    },
  },
  computed: {},
};
</script>
<style scoped>
.text-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
