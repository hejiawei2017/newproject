<template>
    <div class="search-info">
        <div class="wrap">
            <div class="top">
                <div class="search">
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
                            <button class="search-btn" type="button" @click="search(value,targetDropItem.value)">
                                <img src="../assets/img/search/searchIcon.png" alt="">
                                <span>一键溯源</span>
                            </button>
                        </template>
                    </b-input-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const pconfig = require('../p.config')
  export default {
    name: "SearchInfo",
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
