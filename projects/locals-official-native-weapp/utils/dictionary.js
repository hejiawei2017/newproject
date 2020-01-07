let ImOrderStatus = {
  '1100': '已删除',
  '1101': '预订咨询',
  '1102': '待付款',
  '1103': '预订已付',
  '1107': '待入住',
  '1207': '待入住',
  '1104': '已退房',
  '1108': '停租',
  '1106': '已取消',
  '1109': '已取消',
  '1110': '暂存订单',
  '1111': '待确认',
  '1201': '预订咨询', //'咨询_同意'
  '1210': '已取消',//'咨询_拒绝',
  '1208': '入住中',
  '1105': '退款中'
} 

let orderStatusDictionary = {
'1100': '已删除',
'1101': '行程沟通中',
'1102': '待付款',
'1103': '预订已付',
'1107': '待入住',
'1207': '待入住',
'1104': '已退房',
'1108': '停租',
'1106': '已取消',
'1109': '已取消',
'1110': '暂存订单',
'1111': '待确认',
'1201': '立即预订', //'咨询_同意'
'1210': '已拒绝',//'咨询_拒绝',
'1208': '入住中',
'1105': '退款中'
} 

let personnelNumber = [
{
  name: '不限',
  value: ''
},
{
  name: '1人',
  value: '1'
},
{
  name: '2人',
  value: '2'
},
{
  name: '3人',
  value: '3'
},
{
  name: '4人',
  value: '4'
},
{
  name: '5人',
  value: '5'
},
{
  name: '6人',
  value: '6'
},
{
  name: '7人',
  value: '7'
}]
let specialList = [
  {
    mustExecuted: true,
    code: '00001',
    name: '入住时间 15:00后'
  },
  {
    mustExecuted: true,
    code: '00002',
    name: '退房时间 12:00前'
  },
  {
    mustExecuted: true,
    code: '00003',
    name: '不接待境外人士'
  },
  {
    code: '7007',
    name: '允许做饭'
  },
  {
    code: '7004',
    name: '允许吸烟'
  },
  {
    code: '7002',
    name: '允许聚会'
  },
  {
    code: '7005',
    name: '允许带宠物'
  },
  {
    code: '7008',
    name: '允许商业拍照'
}]

const cityCodeList = {"北京市":"110100","天津市":"120100","上海市":"310100","重庆市":"500100","石家庄市":"130100","秦皇岛市":"130300","保定市":"130600","太原市":"140100","晋中市":"140700","呼和浩特市":"150100","大连市":"210200","哈尔滨市":"230100","南京市":"320100","无锡市":"320200","常州市":"320400","苏州市":"320500","扬州市":"321000","杭州市":"330100","宁波市":"330200","嘉兴市":"330400","合肥市":"340100","福州市":"350100","厦门市":"350200","南昌市":"360100","济南市":"370100","青岛市":"370200","烟台市":"370600","泰安市":"370900","威海市":"371000","日照市":"371100","莱芜市":"371200","郑州市":"410100","开封市":"410200","洛阳市":"410300","武汉市":"420100","咸宁市":"421200","恩施土家族苗族自治州":"422800","长沙市":"430100","张家界市":"430800","广州市":"440100","深圳市":"440300","珠海市":"440400","佛山市":"440600","惠州市":"441300","河源市":"441600","南宁市":"450100","桂林市":"450300","海口市":"460100","三亚市":"460200","成都市":"510100","乐山市":"511100","凉州区":"513400","贵阳市":"520100","昆明市":"530100","丽江市":"530700","大理白族自治州":"532900","拉萨市":"540100","西安市":"610100","汉中市":"610700","兰州市":"620100","张掖市":"620700","西宁市":"630100","银川市":"640100","乌鲁木齐市":"650100","温哥华":"BC002116"}

const memberCardInfo = {
  "NORMAL": {
    "memberCardCode": "NORMAL",
    "memberCardName": "普卡",
    "discount": 1,
    "originalPrice": 0,
    "image": "https://oss.localhome.cn/localhomeqy/ordinary-card.png"
  },
  "SILVER": {
    "buyId": "931070414685876248",
    "memberCardCode": "SILVER",
    "memberCardName": "银卡",
    "discount": 0.96,
    "originalPrice": 298,
    "image": "https://oss.localhome.cn/localhomeqy/silver-card.png"
  },
  "GOLD": {
    "buyId": "931070414685876249",
    "memberCardCode": "GOLD",
    "memberCardName": "金卡",
    "discount": 0.92,
    "originalPrice": 498,
    "image": "https://oss.localhome.cn/localhomeqy/glod-card.png"
  },
  "BLACK": {
    "buyId": "931070414685876250",
    "memberCardCode": "BLACK",
    "memberCardName": "黑卡",
    "discount": 0.88,
    "originalPrice": 898,
    "image": "https://oss.localhome.cn/localhomeqy/black-card.png"
  }
}

const guestTypeMap = new Map([['idCard', '身份证'], ['passport', 'Passport'], ['permit', '港澳回乡证'], ['mtps', '台胞证']]);

const guestTypeTextNameMap = new Map([['01', '身份证'], ['02', 'Passport'], ['03', '港澳回乡证'], ['04', '台胞证']]);

const guestTypeNoMap = new Map([['01', 'idCard'], ['02', 'passport'], ['03', 'permit'], ['04', 'mtps']]);

const typeIdMap = new Map([['idCard', '01'], ['passport', '02'], ['permit', '03'], ['mtps', '04']]);

const sortList = [
  {
    id: 0,
    value: 0,
    key: 'rankingSort',
    label: '推荐排序',
    isShowForgeignCity: true,
  },
  {
    id: 1,
    value: 0,
    key: 'starsSort',
    label: '好评优先',
  },
  {
    id: 2,
    value: 1,
    key: 'priceSort',
    label: '价格低至高',
    isShowForgeignCity: true,
  },
  {
    id: 3,
    value: 0,
    key: 'priceSort',
    label: '价格高至低',
    isShowForgeignCity: true,
  },
  {
    id: 4,
    value: 0,
    key: 'distanceSort',
    label: '距离优先',
  }
]


module.exports = {
  ImOrderStatus,
  personnelNumber,
  specialList,
  orderStatusDictionary,
  cityCodeList,
  memberCardInfo,
  guestTypeMap,
  guestTypeTextNameMap,
  guestTypeNoMap,
  typeIdMap,
  sortList
}