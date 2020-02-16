<template>
  <div class="content-partner">
    <div class="content-top">
      <img
        src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191217164028000-%3F%3F%3F%3Fbanner%403x.png"
      />
      <div class="content-top-tips">
        <div>如果你喜欢分享，擅长用笔头描绘世界。</div>
        <div>如果你能写会画，能导会拍，充满奇思妙想。</div>
        <div>
          欢迎加入HYCAN合创社区，与我们一同分享生活的点滴记录下生活中美好的高光时刻，成为我们的内容合创者～
        </div>
      </div>
    </div>
    <div class="content-type-item">
      <div class="header">
        <div class="border-image"></div>
        优秀合创者文章
        <div class="border-image right"></div>
      </div>
      <div clas="scroll-container">
        <div class="no-data" v-if="partnerList.length == 0">暂无投稿</div>
        <swiper
          class="swiper"
          spaceBetween="30"
          circular="true"
          bindchange="swiperChange"
          v-if="partnerList.length != 0"
          :options="listOption"
        >
          <swiper-slide
            class="swiper-item"
            v-for="(item, index) in partnerList"
            :key="index"
          >
            <div class="partner-container" @click="jumpPage(item.pgcId)">
              <div class="partner-top">
                <img
                  mode="aspectFill"
                  class="partner-top-image"
                  :src="item.coverPath"
                />
                <div class="partner-tips">{{ item.title }}</div>
              </div>
              <div class="partner-bottom">
                <div class="userimag-con">
                  <img class="userimag" mode="aspectFill" :src="item.imgUrl" />
                </div>
                <div class="msg-con">
                  <div class="msg-title">{{ item.nickName }}</div>
                  <div class="msg-tips">
                    <div>
                      文章:{{
                        item.totalCount
                      }}篇&nbsp;&nbsp;&nbsp;&nbsp;已获积分:{{ item.totalScore }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="content-type-item">
      <div class="header">
        <div class="border-image"></div>
        惊喜福利
        <div class="border-image right"></div>
      </div>
      <div class="welfare-con">
        <div class="welfare-item">
          <div class="welfare-left">
            <div class="welfare-iamge1"></div>
          </div>
          <div class="welfare-right">
            <div class="welfare-title">合创者大会</div>
            <div class="welfare-content">
              出席HYCAN合创者大会，有机会享受HYCAN专属称谓，同时授予奖项。
            </div>
          </div>
        </div>
        <div class="welfare-item">
          <div class="welfare-left">
            <div class="welfare-iamge2"></div>
          </div>
          <div class="welfare-right">
            <div class="welfare-title">专属SHOW</div>
            <div class="welfare-content">
              举办个人专属分享会，carry全场风采。
            </div>
          </div>
        </div>
        <div class="welfare-item">
          <div class="welfare-left">
            <div class="welfare-iamge3"></div>
          </div>
          <div class="welfare-right">
            <div class="welfare-title">年度纪念册</div>
            <div class="welfare-content">
              将高光时刻印刷成册，让美好回忆不仅停留在记忆。
            </div>
          </div>
        </div>
        <div class="welfare-item">
          <div class="welfare-left">
            <div class="welfare-iamge4"></div>
          </div>
          <div class="welfare-right">
            <div class="welfare-title">高管见面会</div>
            <div class="welfare-content">
              与企业高管深入交流，掌握HYCAN最新动态。
            </div>
          </div>
        </div>
        <div class="welfare-item">
          <div class="welfare-left">
            <div class="welfare-iamge5"></div>
          </div>
          <div class="welfare-right">
            <div class="welfare-title">积分奖励</div>
            <div class="welfare-content">
              文章一旦被采用即可获得2000积分/篇的积分奖励。
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-type-item">
      <div class="header">
        <div class="border-image"></div>
        写作建议方向
        <div class="border-image right"></div>
      </div>
      <img
        src="https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191212185641681-table%403x.png"
        class="table-image"
      />
    </div>
    <div class="content-type-item">
      <div class="header">
        <div class="border-image"></div>
        内容合创须知
        <div class="border-image right"></div>
      </div>
      <div class="must-know">
        <div class="must-know-item">
          1.投稿作品必须为原创，一旦发现抄袭，将取消录用资格，若因侵权给广汽蔚来带来损失，将由侵权者本人承担所有法律责任。
        </div>
        <div class="must-know-item">
          2.参与活动的投稿人，视为将该作品版权授予HYCAN合创，且无时间限制。
        </div>
        <div class="must-know-item">
          3.积分奖励将在录用发布后的10个工作日内发放。
        </div>
        <div class="must-know-item">4.所有解释权归广汽蔚来所有。</div>
      </div>
    </div>
    <div class="join-us-con">
      <div class="join-us" @click="joinUs">成为内容合伙人</div>
    </div>
    <modal
      content="请添加工作人员微信号 cyrl678 ，进行投稿"
      confirmBtn="复制微信号"
      :visiable="visiable"
      @confirm="confirm"
    ></modal>
    <show-tips ref="showTips"></show-tips>
  </div>
</template>
<script>
import axios from "@/libs/axios.js";
import util from "@/common/util.js";
import bridge from "@/libs/bridge2.js";
import modal from "@/components/modal/modal.vue";
import showTips from "@/components/showTips/showTips.vue";
export default {
  components: {
    modal: modal,
    showTips: showTips
  },
  data() {
    return {
      visiable: false,
      partnerList: [],
      listOption: {
        slidesPerView: "auto"
      }
    };
  },
  created() {
    this.token = util.jsUrlHelper.getUrlParam(window.location.href, "token");
  },

  mounted() {
    this.$refs.showTips.hideTips();
    this.loaddData().then(res => {
      if (res.data.code == 0) {
        this.partnerList = res.data.data;
      } else {
        this.$refs.showTips.showTips("抱歉请稍后再试");
      }
    });
  },
  methods: {
    jumpPage(pgcId) {
      bridge.jsCallApp(
        { method: "openLocalPage", data: { id: pgcId, pageType: 2 } },
        res => {
          console.log(res);
        }
      );
    },
    confirm() {
      util.copyText("cyrl678", () => {
        this.visiable = false;
        this.$refs.showTips.showTips("已复制微信号");
      });
    },
    loaddData() {
      return axios({
        method: "get",
        url: `/community/pgc/noAuth/front/v3.1.4/getFinePartnerList`,
        params: {},
        headers: {
          Authorization: "null"
        }
      });
    },
    joinUs() {
      this.visiable = true;
    }
  }
};
</script>

<style>
.table-image {
  width: 100%;
}
#cp_hgz_input {
  display: inline-block;
  width: 0px;
  height: 0px;
  padding: 0px;
  margin: 0px;
}
body {
  background: #f6f7f8;
  margin: 0px;
  padding: 0px;
  padding-bottom: 180px;
}
.content-partner {
  padding: 0px 30px;
  text-align: center;
  margin-top: 10px;
}
.header {
  font-size: 36px;
  font-weight: 600;
  color: rgba(5, 28, 44, 1);
  padding: 34px;
  padding-top: 60px;
}
.no-data {
  font-size: 28px;
  font-weight: 400;
  color: rgba(66, 85, 99, 1);
}
.swiper {
  height: 570px;
}
.swiper-item {
  height: 570px;
  margin-right: 20px;
}

.swiper-slide {
  text-align: center;

  width: 80% !important;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.swiper-slide:nth-child(2n) {
  /* width: 60% !important; */
}
.swiper-slide:nth-child(3n) {
  /* width: 40% !important; */
}

.content-top {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
}
.content-top img {
  width: 100%;
  height: 240px;
}
.content-top-tips {
  padding: 30px 40px;
  text-align: left;
  font-size: 28px;
  font-weight: 400;
  color: rgba(5, 28, 44, 1);
  line-height: 48px;
}
.content-top-tips div {
  margin-bottom: 20px;
}
.partner-container {
  width: 100%;
  height: 560px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 15px 0px rgba(100, 110, 125, 0.1);
}
.partner-top {
  width: 100%;
  height: 420px;
  background: rgba(255, 255, 255, 1);
  border-radius: 9px 10px 0px 0px;
  position: relative;
  overflow: hidden;
}
.partner-tips {
  position: absolute;
  left: 0px;
  right: 0;
  bottom: 0px;
  max-height: 86px;
  font-size: 36px;
  line-height: 50px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  padding: 19px 30px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: initial;
  font-size: 500;
}
.partner-top-image {
  width: 100%;
  height: 420px;
  border-radius: 10px 10px 0px 0px;
  object-fit: cover;
}
.partner-bottom {
  flex: 1;
  display: flex;
  padding-left: 20px;
}
.userimag-con {
  width: 120px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userimag {
  width: 100px;
  height: 100px;
  border-radius: 100%;
}

.msg-con {
  text-align: left;
  padding-left: 20px;
}
.msg-title {
  font-size: 28px;
  font-weight: bold;
  color: rgba(5, 28, 44, 1);
  margin-top: 24px;
  justify-content: flex-start;
  align-items: flex-start;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}
.msg-tips {
  font-size: 24px;
  font-weight: 400;
  color: rgba(66, 85, 99, 1);
  line-height: 20px;
  margin-top: 23px;
}

.header {
  position: relative;
}
.border-image {
  display: inline-block;
  width: 34px;
  height: 25px;
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203115422419-wzx_bg_bt_xt%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 30px;
  margin-left: 30px;
}
.border-image.right {
  transform: rotate(180deg);
  margin-left: 24px;
}
.welfare-con {
  background-color: white;
  border-radius: 10px;
}
.welfare-item {
  display: flex;
  min-height: 95px;
  text-align: left;
  padding: 40px;
  padding-bottom: 27px;
  border-bottom: 1px solid #eeeeee;
}
.welfare-left {
  width: 110px;
  display: flex;
  justify-content: left;
  align-items: top;
}
.welfare-left div {
  width: 80px;
  height: 80px;
  background: rgba(240, 247, 247, 1);
  border-radius: 100%;
}
.welfare-left .welfare-iamge1 {
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203142018439-wzx_icon_dr_fl%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.welfare-left .welfare-iamge2 {
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203143621209-wzx_icon_zjz_fl%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.welfare-left .welfare-iamge3 {
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203143650375-wzx_icon_tp_fl%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.welfare-left .welfare-iamge4 {
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203143722197-wzx_icon_hy_fl%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.welfare-left .welfare-iamge5 {
  background-image: url("https://azure-shop.obs.cn-south-1.myhuaweicloud.com/20191203143747354-wzx_icon_jf_fl%403x.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.welfare-right {
  flex: 1;
}
.welfare-right .welfare-title {
  font-size: 32px;
  font-weight: 600;
  color: rgba(5, 28, 44, 1);
  padding-bottom: 15px;
  margin-top: -5px;
}
.welfare-content {
  font-size: 28px;
  font-weight: 400;
  color: rgba(5, 28, 44, 1);
  line-height: 44px;
}
.must-know {
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(66, 85, 99, 1);
  padding: 20px;
  text-align: left;
  line-height: 36px;
}
.must-know-item {
  font-size: 24px;
  line-height: 36px;
  margin-bottom: 30px;
}
.join-us-con {
  width: 100%;
  height: 120px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  padding-top: 20px;
  z-index: 9999;
}
.join-us {
  width: 90%;
  height: 80px;
  line-height: 80px;
  background: linear-gradient(
    90deg,
    rgba(78, 225, 231, 1) 0%,
    rgba(44, 204, 211, 1) 100%
  );
  box-shadow: 0px 15px 15px 0px rgba(44, 204, 211, 0.12);
  border-radius: 44px;
  color: white;
  text-align: center;
  margin: 0 auto;
  font-size: 30px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}
.table-con {
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  color: rgba(5, 28, 44, 1);

  background-color: white;
  border-radius: 8px;
}
.tr {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(116, 122, 134, 0.2);
}

.td {
  flex: 1;
  height: 80px;
  border-right: 1px solid rgba(116, 122, 134, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.tr1 {
  font-size: 21px;
}

.tr2 {
  font-size: 20px;
}
.tr3 {
  font-size: 16px;
}
.td.w60 {
  flex: unset;
  width: 60px;
  background: rgba(175, 220, 223, 0.1);
}
.td.w80 {
  flex: unset;
  width: 80px;
}
.td.w270 {
  flex: unset;
  width: 268px;
}

.tr.nobottom {
  border-bottom: 0px;
}
.td.norigth {
  border-right: 0px;
}
</style>
