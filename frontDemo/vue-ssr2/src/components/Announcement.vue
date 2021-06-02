<template>
  <div class="announcement" :style="{backgroundImage:`url(${tableData.bgImg})`}">
    <div class="container">
      <div class="wrap">
        <h3 class="announcement-title">榜单</h3>
        <div class="announcement-table">
          <div class="table-header">
            <div v-for="(item, index) in tabsArr"
                 :key="index" class="table-th"
                 :class="{active:active === index}"
                 @click="handleChangeTabs(index)">
              {{ item.title }}
            </div>
          </div>
          <div v-if="$store.state.dataSourceServ.announcementData && $store.state.dataSourceServ.announcementData.length" class="table-body">

            <!-- 企业红黑榜 -->
            <template v-if="active === 3 || active === 4">
              <ul class="table-body-list-msg">
                <li class="table-body-list-msg-item">
                  <div class="msg-item-ranking">排名</div>
                  <div class="msg-item-firm-name">企业名称</div>
                  <div class="msg-item-code">统一社会信用代码</div>
                  <div class="msg-item-red-panel">{{active === 3 ? '红名单' : '黑名单'}}</div>
                  <div class="msg-item-publisher">发布人</div>
                  <div class="msg-item-release-time">发布时间</div>
                </li>
                <li v-for="(item,index) in $store.state.dataSourceServ.announcementData" :key="index" class="table-body-list-msg-item">
                  <div class="msg-item-ranking">
                    <img
                      class="table-body-item-ranking-img"
                      :class="{grayscale: active === 4}"
                      v-if="index <= 2"
                      :src="renderImg(index)"
                    />
                    <span v-if="index > 2" class="table-body-item-ranking-text">{{
                      index + 1
                    }}</span>
                  </div>
                  <div class="msg-item-firm-name">{{item.ccodename}}</div>
                  <div class="msg-item-code">{{item.ccodethk}}</div>
                  <div class="msg-item-red-panel">
                    <img v-if="active === 3" src="@/assets/img/Inspection/like.png">
                    <img v-if="active === 4" src="@/assets/img/Inspection/tread.png">
                  </div>
                  <div class="msg-item-publisher">{{item.vpreparename}}</div>
                  <div class="msg-item-release-time">2{{$moment(item.modifydate).format('YYYY-MM-DD')}}</div>
                </li>
              </ul>
            </template>

            <!-- 榜单 -->
            <template v-else>
              <ul class="table-body-list">
              <!--$store.state.dataSourceServ.announcementData-->
                <li
                  v-for="(item, index) in this.$store.state.dataSourceServ.announcementData"
                  :key="index"
                  class="table-body-item"
                >
                  <div class="table-body-item-img">
                    <img :src="item.url || ''" @error="imgerrorfun"/>
                  </div>
                  <div
                    class="table-body-item-text"
                    :class="{ active: index < 3 }"
                  >
                    <span>TOP{{ index + 1 }}</span
                    >{{ item[tabsArr[active].labelName] }}
                  </div>
                  <div
                    class="table-body-item-consult"
                    :class="{ active: index < 3 }"
                  >
                    <span>{{ tabsArr[active].label }}</span
                    >：<span>{{ item[tabsArr[active].key] }}</span>
                  </div>
                  <div class="table-body-item-ranking">
                    <img
                      class="table-body-item-ranking-img"
                      v-if="index <= 2"
                      :src="renderImg(index)"
                    />
                    <span v-if="index > 2" class="table-body-item-ranking-text">{{
                      index + 1
                    }}</span>
                  </div>
                </li>
              </ul>
            </template>
          </div>
          <empty v-else></empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import empty from '@/components/empty'
export default {
  name: "Announcement",
  components: {
    empty
  },
  props: {
    tableData: {
      type: Object,
      default: ()=>({
        columns:[],
        dataSource:[]
      }),
    },
  },
  asyncData: {
    getCommodityQuery(store) {
      return store.dispatch("fetchCommodityQueryList",1);
    }
  },
  data () {
    return {
      active: 0,
      tabsArr: [{
        title:'商品查询榜单',
        label:'查询量',
        labelName:'cargoname',
        key:'querycount',
        fn:"fetchCommodityQueryList"
      },{
        title:'商品咨询榜单',
        label:'咨询量',
        labelName:'cargoname',
        key:'compconsultcount',
        fn:"fetchCommodityConsultingList"
      },{
        title:'商品投诉榜单',
        label:'投诉量',
        labelName:'cargoname',
        key:'compconsultcount',
        fn:"fetchProductComplaintList"
      },{
        title:'企业红榜',
        label:'查询量',
        labelName:'ccodename',
        key:'ccodename',
        fn:"fetchRedList"
      },{
        title:'企业黑榜',
        label:'查询量',
        labelName:'ccodename',
        key:'ccodename',
        fn:"fetchBlackList"
      }]
    }
  },
  computed: {
    renderImg() {
      return function(index) {
        if(index === 0) return require('@/assets/img/about/top1.png')
        if(index === 1) return require('@/assets/img/about/top2.png')
        if(index === 2) return require('@/assets/img/about/top3.png')
      }
    }
  },
  methods: {
    handleChangeTabs(index) {
      this.active = index
      // this.$emit('changeTabs',index)
      this.$store.dispatch(this.tabsArr[index].fn,1)
    },
    imgerrorfun(event) { // 图片
      const img = event.srcElement
      img.src = require('@/assets/img/about/monthly-focus.png')
      img.onerror = null // 控制不要一直跳动
    },
  },
  mounted() {
    this.$options.asyncData.getCommodityQuery(this.$store);
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/_handle.scss";
.table-body-list-msg {
  margin: 0;
  padding: 0;
  .table-body-list-msg-item {
    display: flex;
    height: 90px;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid rgb(68 68 68 / 20%);
      font-size: 18px;
      font-weight: 400;
    }
    .msg-item-ranking,
    .msg-item-red-panel,
    .msg-item-publisher,
    .msg-item-release-time {
      width: 15%;
      height: 100%;
    }
    .msg-item-firm-name,
    .msg-item-code {
      width: 20%;
      height: 100%;
    }
    &:nth-child(2n+1) {
      background: rgb(215 215 215 / 30%);
    }
    &:first-child {
      font-size: 18px;
      font-weight: 400;
      color: #FFFFFF;
      @include background_color("background_color1");
    }
    .msg-item-ranking {
      img {
        width: 68px;
      }
      .grayscale {
        filter: grayscale(1);
      }
    }
  }
}
</style>
