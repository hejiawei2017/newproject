<template>
  <div class="site-footer">
    <div class="container">
      <div class="site-footer-content">
        <div class="footer-qrcode">
          <img src="@/assets/img/about/app-qrcode.png" />
          <p class="footer-qrcode-text">微信公众号</p>
        </div>
        <div class="footer-information">
          <div class="site-footer-tit">全球服务热线</div>
          <div class="site-footer-txt">400-8080-2872</div>
          <div class="site-footer-tit com-tit">服务邮箱</div>
          <div class="site-footer-txt">support@global-suyuan</div>
        </div>
        <div class="footer-fast">
          <div class="footer-visit-list">
            <div class="site-footer-tit title">快速访问</div>
            <div class="footer-visit-link"><router-link v-for="(item,index) of layOutData.footerNavItem" :key="index" :to="{ path:item.url }">{{item.name}}</router-link></div>
          </div>
          <div class="footer-visit-list">
            <div class="site-footer-tit title">快速链接</div>
            <div class="footer-visit-link"><a v-for="(item,index) of layOutData.footerSystems" target="_blank" :key="index" :href="item.url + '?is=0'">{{item.name}}</a></div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>
            主办单位：南沙创新工作局   版权所有：南沙创新工作局   中文域名：www.xx.com   版权号123456
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import dataSource from '@/assets/dataSource/dataSource'
export default {
  name: "Footer2",
  data() {
    return {
      layOutData: dataSource[process.env.SYSTEM_TYPE].layout
    };
  },
};
</script>

<style lang="scss" scoped>
.site-footer {
  width: 100%;
  height: 427px;
  text-align: left;
  background-color: #252525;
  .footer-qrcode {
    margin-right: 50px;
    width: 128px;
    height: 128px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer-qrcode-text {
      font-size: 18px;
      text-align: center;
      margin-top: 10px;
      font-weight: 500;
    }
  }
  .site-footer-content {
    padding: 80px 0 50px 0;
    display: flex;
    color: #fff;
    .site-footer-tit {
      font-size: 26px;
      font-weight: 400;
    }
    .site-footer-txt {
      font-size: 18px;
      font-weight: 400;
    }
    .com-tit {
      margin-top: 80px;
    }
    .footer-information {
      flex: 2;
    }
    .footer-fast {
      flex: 6;
      .footer-visit-list {
        display: flex;
        height: 120px;
        .footer-visit-link {
          flex: 1;
          a {
            display: inline-block;
            margin-bottom: 30px;
            font-size: 18px;
            font-weight: 400;
            color: #FFFFFF;
            &:hover {
              text-decoration: none;
            }
          }
        }
        .site-footer-tit.title {
          flex: none;
          width: 200px;
        }
        &:nth-child(1) {
          border-bottom: 1px solid rgba(255,255,255,.1);
          a {
            width: 20%;
          }
        }
        &:nth-child(2) {
          padding-top: 30px;
          a {
            width: 50%;
          }
        }
      }
    }
    
  }
}
</style>