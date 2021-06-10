
const roleType = {
    "enterprise": "企业",
    "consumer": "消费者",
    "service": "服务商",
    "supervise": "监管用户",
    "coordination": "协同用户"
  }
// 需求类型
const demandtype = [
  {
    "code": "30000110",
    "name": "检测需求"
  },
  {
    "code": "30000210",
    "name": "知识产权保护需求"
  },
  {
    "code": "30000310",
    "name": "标识服务需求"
  },
  {
    "code": "30000410",
    "name": "认证需求"
  },
  {
    "code": "30000510",
    "name": "设备服务需求"
  },
  {
    "code": "30000610",
    "name": "实施需求"
  },
  {
    "code": "30000710",
    "name": "二次应用开发需求"
  },
  {
    "code": "30000810",
    "name": "图文服务需求"
  },
  {
    "code": "30000910",
    "name": "第三方公证需求"
  }
]

// 需求状态
const demandStatus = [
  {
    "code": "10",
    "name": "未提交"
  },
  {
    "code": "30",
    "name": "已发布"
  },
  {
    "code": "40",
    "name": "已响应"
  },
  {
    "code": "50",
    "name": "进行中"
  },
  {
    "code": "70",
    "name": "已完成"
  },
  {
    "code": "80",
    "name": "已关闭"
  }
]

// 服务范围
const servicerange = [
  {
    "code": 30000110,
    "name": "公证服务"
  },
  {
    "code": 30000210,
    "name": "检验检测服务"
  },
  {
    "code": 30000310,
    "name": "认证服务"
  },
  {
    "code": 30000410,
    "name": "鉴定服务"
  },
  {
    "code": 70000250,
    "name": "标识生成服务"
  },
  {
    "code": 70000260,
    "name": "标识制作服务"
  },
  {
    "code": 70000270,
    "name": "标识关联服务"
  },
  {
    "code": 70000280,
    "name": "标识信息采集服务"
  },
  {
    "code": 70000290,
    "name": "标识设备服务"
  }
]

//服务分类
const detectdomain = [
  {
    "code": "10",
    "name": "工业制造与材料"
  },
  {
    "code": "20",
    "name": "原材料与电子电气"
  },
  {
    "code": "30",
    "name": "家居生活百货"
  },
  {
    "code": "40",
    "name": "食品与农产品"
  },
  {
    "code": "50",
    "name": "纺织服装鞋包"
  },
  {
    "code": "60",
    "name": "冶金矿产与化工品"
  },
  {
    "code": "70",
    "name": "美妆与卫生清洁"
  },
  {
    "code": "80",
    "name": "汽车与零部件"
  },
  {
    "code": "90",
    "name": "石油化工"
  },
  {
    "code": "100",
    "name": "制药与医疗"
  },
  {
    "code": "110",
    "name": "环境健康"
  },
  {
    "code": "120",
    "name": "其它"
  }
]

export default {
  roleType,
  demandtype,
  demandStatus,
  servicerange,
  detectdomain
}
