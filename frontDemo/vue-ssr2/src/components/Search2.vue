<template>
    <div class="search2">
        <b-card
                overlay
                img-src="../assets/img/search/bg2.png"
                img-alt="Card Image"
        >
            <b-card-body>
                <div class="container">
                    <div class="wrap">
                        <div class="tit">
                            溯源查询，帮助您发现 <span>发现商品真实价值</span>
                        </div>
                        <div class="sub-text">
                            <div>溯源为数字时代的商品数据采集、识别和处置</div>
                            <div>提供了一套高效低成本的工具</div>
                        </div>
                        <div class="body">
                            <b-input-group>
                                <template #prepend>
                                    <b-dropdown :text="targetDropItem.label" no-flip>
                                        <b-dropdown-item
                                                v-for="(item,index) of dropDownArr"
                                                :key="index"
                                                @click="toggleLabel(item)">{{item.label}}</b-dropdown-item>
                                    </b-dropdown>
                                </template>

                                <b-form-input :placeholder="'请输入' + targetDropItem.label"
                                              v-model="value"
                                              trim
                                              debounce="500"
                                              @change="inputChange"
                                              @keyup.enter.native="search(value,targetDropItem.value)"
                                ></b-form-input>

                                <template #append>
                                    <router-link to="/searchInfo">
                                        <button class="search-btn" type="button">
                                            <img src="../assets/img/search/searchIcon.png" alt="">
                                            <span>一键溯源</span>
                                        </button>
                                    </router-link>
                                </template>
                            </b-input-group>
                        </div>
                        <!--<div class="search-bottom">-->
                            <!--<div class="txt">-->
                                <!--如您想了解更多溯源信息-->
                            <!--</div>-->
                            <!--<div class="f-btn">-->
                                <!--<b-button variant="outline-secondary">加入溯源</b-button>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
  const pconfig = require('../p.config')
  export default {
    name: "Search1",
    props: {},
    data() {
      return {
        value:'',
        targetDropItem: {"label": "溯源标识", "value": "OGCODE"},
        dropDownArr: [
          { "label": "溯源标识", "value": "OGCODE" },
          { "label": "身份证号", "value": "IDCARD" },
          { "label": "订单编号", "value": "ORDERNO" },
          { "label": "VIN号", "value": "VIN" },
          { "label": "运单号", "value": "WAYBILLNO" }],
        proxy_url: pconfig.proxy_url
      };
    },
    methods: {
      toggleLabel(e){
        this.targetDropItem = e
      },
      inputChange(e){
        this.value = e
      },
      search(value,tab){
        window.open(`${this.proxy_url}/#/generalQueryListForConsumer?value=${value}&tab=${tab}`)
      }
    },
    mounted() {
    }
  };
</script>

<style scoped>

</style>
