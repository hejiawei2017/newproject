<template>
    <div class="systemMenu">
        <div class="container">
            <div v-for="(item,index) of systemList" :key="index" class="wrap">
                <div class="title">{{item.title}}</div>
                <span v-for="(p,idx) of item.list" :key="idx" class="content">
                    <b-button class="menu-btn">{{p.name}}</b-button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "SystemMenu",
    data(){
      return {
        systemList:[
          {
            title:'政府管理部门服务',
            list:[
              {name:'共建方目录',url:'#'},
              {name:'服务管理',url:'#'},
              {name:'共建方反馈管理',url:'#'},
              {name:'信息发布管理',url:'#'},
              {name:'风险管理',url:'#'},
              ]
          },
          {
            title:'监管用户服务 ',
            list:[
              {name:'共建方目录',url:'#'},
              {name:'数据查询',url:'#'},
              {name:'风险与预警',url:'#'},
              {name:'授权管理',url:'#'},
              {name:'统计分析',url:'#'},
              {name:'溯源应用',url:'#'},
              {name:'检验检测公共服务',url:'#'},
              {name:'知识产权公共服务',url:'#'},
              {name:'消费者权益保护公共服务',url:'#'},
              {name:'溯源产业公共服务',url:'#'}
              ]
          },
          {
            title:'企业用户服务',
            list:[
              {name:'企业信息',url:'#'},
              {name:'商品资料',url:'#'},
              {name:'自证办理',url:'#'},
              {name:'公证办理',url:'#'},
              {name:'溯源标识管理',url:'#'},
              {name:'我的溯源',url:'#'},
              {name:'溯源相关服务',url:'#'},
              {name:'投诉与举报',url:'#'},
              {name:'统计分析',url:'#'},
              {name:'风险与预警',url:'#'},
              {name:'授权管理',url:'#'},
              {name:'消费者投诉咨询处理',url:'#'},
              {name:'知识产权公共服务',url:'#'},
              {name:'检验检测公共服务',url:'#'},
              {name:'消费者权益保护公共服务',url:'#'},
            ]
          },
          {
            title:'消费者服务',
            list:[
              {name:'个人用户登记',url:'#'},
              {name:'登记信息维护',url:'#'},
              {name:'登记信息查询',url:'#'},
              {name:'投诉咨询',url:'#'},
              {name:'进度查询',url:'#'},
              {name:'帮助指引',url:'#'},
              {name:'商品溯源数据查询',url:'#'},
              ]
          },
          {
            title:'第三方平台用户服务',
            list:[
              {name:'用户登记',url:'#'},
              {name:'登记信息修改',url:'#'},
              {name:'登记信息查询',url:'#'},
              {name:'商品溯源数据传输',url:'#'},
             ]
          },
        ]
      }
    }
  };
</script>

<style scoped>

</style>
