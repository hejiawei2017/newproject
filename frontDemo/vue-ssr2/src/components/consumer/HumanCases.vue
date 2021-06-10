<template>
  <div class="human-cases">
    <div class="container">
      <div class="wrap">
        <h2 class="human-cases-title">
          <span v-if="casesData.normalTitle" class="human-cases-title-normal">{{
            casesData.normalTitle
          }}</span>
          <span>{{ casesData.title }}</span>
        </h2>
        <p class="human-cases-text">{{ casesData.text }}</p>
        <ul class="human-cases-list">
          <li
            v-for="(item, index) in casesData.contentList"
            :key="index"
            class="human-cases-item"
          >
            <img class="human-cases-item-img" :src="item.img" />
            <div class="human-cases-item-content">{{ item.text }}</div>
          </li>
        </ul>
        <MyPagination
          :total="(casesData.casesData && casesData.casesData.length) || 0"
          perPage="6"
          @changePage="changePage"
          :showBgColor="false"
          :showPaginationBtn="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyPagination from "@/components/MyPagination";
export default {
  components: {
    MyPagination,
  },
  props: {
    casesData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    changePage(index) {
      console.log(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.human-cases {
  padding: 100px 0;
  color: #444444;
  font-weight: 400;
  .wrap {
    .human-cases-title {
      margin-bottom: 40px;
      font-size: 48px;
      .human-cases-title-normal {
        font-weight: 300;
      }
    }
    .human-cases-text {
      margin-bottom: 80px;
      font-size: 24px;
    }
    .human-cases-list {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style: none;
      .human-cases-item {
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        width: 30%;
        height: 310px;
        .human-cases-item-img {
          width: 100%;
          height: 100%;
        }
        .human-cases-item-content {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 24px;
          color: #fff;
          visibility: hidden;
          opacity: 0;
          transition: all .3s;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:hover {
          .human-cases-item-content {
            visibility: visible;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>