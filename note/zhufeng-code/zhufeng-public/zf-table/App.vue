<template>
  <div>
    {{selectedItems}}
    <zf-table
      :columns="columns1"
      :data="data1"
      border
      :selectedItems.sync="selectedItems"
      :orderBy.sync="orderBy"
      @update:orderBy="sort"
      :height="200"
      checkable
    >
        
    </zf-table>
    <!--  @update:selectedItems="newSelected=>selectedItems=newSelected" -->
  </div>
</template>

<script>
import zfTable from "./components/zf-table";
export default {
  methods: {
    sort(r) {
      console.log(r);
    }
  },
  components: {
    zfTable
  },
  data() {
    return {
      orderBy: {
        // 如何排序
        // name:true, // 能排序
        age: "asc",
        address: "desc"
      },
      selectedItems: [], // 当前用户选中了哪一项
      columns1: [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address",
          
        }
      ],
      data1: [
        {
          id: 1,
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          id: 2,
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          id: 3,
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          id: 4,
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        },
        {
          id: 5,
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          id: 6,
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          id: 7,
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          id: 8,
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ]
    };
  }
};
</script>