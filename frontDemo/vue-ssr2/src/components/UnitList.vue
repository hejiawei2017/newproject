<template>
    <div class="unit-list">
        <div class="container">
            <div class="unit-list-content">
                <div class="">
                    <div class="unit-tit">
                        {{title}}
                    </div>
                    <div class="unit-line"></div>
                    <div class="unit-tabs">
                        <div class="tab-item"
                             v-for="(item,index) of $store.state.dataSourceServ.unitData.tabs"
                             @click="handleTabItem(item.catalogid,item.catalogname,index)"
                             :key="index">
                            <span :class="index === activeTab? 'active' : ''">{{item.catalogname}}</span>
                        </div>
                        <div v-if="showMoreBtn" class="tab-btn">
                            <b-button class="more-btn" to="/CobuildUnit">查看更多</b-button>
                        </div>
                    </div>
                </div>
                <div class="img-list" v-if="!showMap">
                    <div class="item" v-for="(item,index) of $store.state.dataSourceServ.unitData.content" :key="index">
                        <img alt=""
                             :src="BaseImgUrl+item.imgpathview" @error="imgerrorfun"
                        >
                    </div>
                </div>
                <div class="chart-box" v-if="showMap">
                    <ChartBox
                            :chartOption="ss.map"
                            :chartConfigureOption="chartConfigOption"
                            chartName="mapCharts"
                    ></ChartBox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import dataSource from '../assets/dataSource/dataSource'
  import ss from '../assets/dataSource/chartConfig';
  import ChartBox from './ChartBox';
  const mapData = [
    {
      "name": "阿联酋",
      "value": "5"
    },
    {
      "name": "澳大利亚",
      "value": "11"
    },
    {
      "name": "比利时",
      "value": "1"
    },
    {
      "name": "加拿大",
      "value": "4"
    },
    {
      "name": "中国",
      "value": "28985"
    },
    {
      "name": "德国",
      "value": "1200"
    },
    {
      "name": "西班牙",
      "value": "1"
    },
    {
      "name": "芬兰",
      "value": "1"
    },
    {
      "name": "法国",
      "value": "600"
    },
    {
      "name": "英国",
      "value": "200"
    },
    {
      "name": "印度",
      "value": "3"
    },
    {
      "name": "意大利",
      "value": "2"
    },
    {
      "name": "日本",
      "value": "44"
    },
    {
      "name": "柬埔寨",
      "value": "1"
    },
    {
      "name": "韩国",
      "value": "23"
    },
    {
      "name": "斯里兰卡",
      "value": "0"
    },
    {
      "name": "马来西亚",
      "value": "1300"
    },
    {
      "name": "尼泊尔",
      "value": "1"
    },
    {
      "name": "菲律宾",
      "value": "2"
    },
    {
      "name": "俄罗斯",
      "value": "2"
    },
    {
      "name": "瑞典",
      "value": "1"
    },
    {
      "name": "新加坡",
      "value": "27"
    },
    {
      "name": "泰国",
      "value": "17"
    },
    {
      "name": "美国",
      "value": "11"
    },
    {
      "name": "越南",
      "value": "7"
    }
  ]
  export default {
    name: "UnitList",
    props: {
      showMoreBtn: {
        type: Boolean,
        default: false
      }
    },
    components: { ChartBox },
    data() {
      return {
        ss,
        chartConfigOption:{
          series:[{
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            zlevel:100,
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: 'fill'
            },
            hoverAnimation: true,
            // label: {
            //   normal: {
            //     formatter: '{b}',
            //     position: 'right',
            //     offset: [15, 0],
            //     color: '#1DE9B6',
            //     show: true
            //   },
            // },
            itemStyle: {
              normal: {
                color:'rgba(250, 103, 0, 1)'
                /* function (value){ //随机颜色
                  return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                  }*/,
                shadowBlur: 10,
                shadowColor: '#FAFAFA'
              }
            },
            symbolSize: function (val) {
              let size = (val[2] / 200)
              return size > 10 ? 12 : (size < 10 && size > 3 ? size : 2);
            },
            data: ss.convertData(mapData),
          }],
        },
        BaseImgUrl: process.env.PROXY_URL + process.env.BASE_IMG_URL,
        title: dataSource[process.env.SYSTEM_TYPE].unitListData.title,
        showBtn: dataSource[process.env.SYSTEM_TYPE].unitListData.showBtn,
        showMap: false,
        activeTab: 0
      };
    },
    asyncData: {
      getConstructionUnit(store) {
        return store.dispatch("fetchConstructionUnit", dataSource[process.env.SYSTEM_TYPE].unitListData.ord);
      }
    },
    methods: {
      handleTabItem(id, name, idx){
        this.activeTab = idx
        this.showMap = name && name.indexOf('消费者')!==-1
        this.$store.dispatch("fetchConstructTabContent", id);
      },
      imgerrorfun(event) { // 图片
        const img = event.srcElement
        img.src = require('@/assets/img/home/unit.png')
        img.onerror = null // 控制不要一直跳动
      },
    },
    mounted() {
      this.$options.asyncData.getConstructionUnit(this.$store);
    }
  };
</script>

<style scoped>

</style>
