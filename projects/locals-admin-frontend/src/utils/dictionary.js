export const dicModel = {
    cancelText : '关闭',
    okText : '确认'
}
export const adsType = {
    1: '图文',
    2: '视频',
    3: '广告链接'
}
export const accountsVerifyType = {
    '': '全部',
    0: '初始',
    1: '待校验',
    2: '校验成功'
}

export const accountsType = {
    '': '全部',
    '房东': '房东',
    '小蜜蜂': '小蜜蜂',
    '设计师': '设计师'
}

export const tradStatus = {
    '1': '交易成功',
    '0': '未确认',
    '-1': '失败'
}

export const sourseType = {
    APP: '路客APP',
    MP: '路客公众号',
    MINI_PROGRAM: '路客小程序',
    H5: '路客手机端',
    WEB: '路客PC端',
    ANT: '蚂蚁',
    PIG: '小猪',
    AIRBNB_API: 'AirbnbApi',
    AIRBNB_CALENDAR: 'AirbnbCalendar',
    // AIRBNBAPI: 'airBnbApi',
    TUJIA_API: '途家Api',
    BOOKING: 'booking',
    AIRBNB: 'Airbnb手工',
    TUJIA: '途家手工',
    BOOKING_HAND: 'BOOKING手工',
    PIG_HAND: '小猪手工',
    OFFLINE: '线下',
    ANT_HAND: '蚂蚁手工',
    ZHENGGUO_HAND: '榛果手工',
    MEITUAN_HAND: '美团手工',
    MUNIAO_HAND: '木鸟手工',
    FLIGGY_HAND: '飞猪手工',
    CTRIP_HANGD: '携程手工',
    FLIGGY: '飞猪',
    CTRIP_API: '携程API',
    XIAOZHU: '小猪',
    MAYI: '蚂蚁',
    REPAIR: '维修',
    NEW_MINI_PROGRAM: '新预订小程序',
    MEITUAN	: '美团',
    OTHER: '其它',
    LONG_TERM: '长租'
}

export const orderStatusType = {
    '1100': '已删除',
    '1101': '咨询',
    '1201': '咨询_同意',
    '1210': '咨询_拒绝',
    '1102': '待付款',
    '1207': '待入住',
    '1208': '入住中',
    '1105': '退款中',
    '1106': '已取消',
    '1104': '已退房',
    '1109': '已关闭'
}

export const invoiceType = {
    0: '不开',
    1: '开'
}

export const depositStatusType = {
    0: '/',
    1: '冻结'
}

export const commentType = {
    0: '/',
    1: '评价'
}

export const paymentTermType = {
    '': '全部',
    0: '手工单（非路客收款）',
    1: '手工单（路客收款）'
}

export const cardType = {
    '01': '身份证号码',
    '02': '护照'
}

export const sexList = ['未知','男性','女性']
export const wechatSubscribeScene = ['未知','公众号搜索','公众号迁移','名片分享','扫描二维码','图文页内名称点击','图文页右上角菜单','支付后关注','其他']
export const bannerPlatform = {
    'APP3,APP,MINI,MINI2,H5,PC': '全部',
    APP3: 'App3.0',
    APP: 'App',
    MINI: '小程序',
    MINI2: '预订小程序',
    H5: '移动官网',
    PC: 'PC官网'
}
export const bannerLocation = {
    '1': '首页广告',
    '2': '首页背景',
    '3': '首页弹窗',
    '4': '精彩'
}

export const wechatSubscribeSceneObj = {
    'ADD_SCENE_SEARCH' : '公众号搜索',
    'ADD_SCENE_ACCOUNT_MIGRATION' :'公众号迁移',
    'ADD_SCENE_PROFILE_CARD' : '名片分享',
    'ADD_SCENE_QR_CODE' : '扫描二维码',
    'ADD_SCENEPROFILE_LINK' : '图文页内名称点击',
    'ADD_SCENE_PROFILE_ITEM' : '图文页右上角菜单',
    'ADD_SCENE_PAID' : '支付后关注',
    'ADD_SCENE_OTHERS' : '其他'
}
export const categoryType = {
    STORY: '故事',
    VIDEO: '视频',
    INTRODUCE: '服务介绍',
    PROMOTION: '路客推广'
}
export const articleStatus = {
    PUBLISHED: '已发布',
    WAIT: '待发布',
    ALL: '全部'
}
export const memberCardCodeList = {
    'NORMAL': {
        level: 0,
        code: 'NORMAL',
        name: '普卡'
    },
    'SILVER': {
        level: 1,
        code: 'SILVER',
        name: '银卡'
    },
    'GOLD': {
        level: 2,
        code: 'GOLD',
        name: '金卡'
    },
    'BLACK': {
        level: 3,
        code: 'BLACK',
        name: '黑卡'
    }
}

export const orderType = {
    1: '待支付',
    2: '已取消订单',
    3: '已支付',
    4: '退款申请中',
    5: '驳回退款',
    6: '退款中',
    7: '退款完成',
    8: '已取消订单'
}
export const actionType = {
    1: '草稿中',
    2: '待审批',
    3: '待执行',
    4: '执行中',
    5: '暂停中',
    6: '审批不通过',
    7: '已下架'
}

export const statusType = {
    2: '取消退单',
    5: '驳回退单',
    6: '同意退单'
}

export const activitystatus = {
    2: '提交审批',
    3: '审批通过',
    6: '驳回审批'
}

export const respStatusMap = {
    '0': '待确认',
    '1': '到账成功',
    '-1': '到账失败'
}

export const refundStatusMap = {
    '1': '退款待审核',
    '2': '拒绝退款',
    '3': '退款中',
    '4': '已退款',
    '5': '等待退款',
    '6': '可操作退款',
    '7': '冻结退款'
};

export const validTypeIdList = [
    {
        value: 0,
        label: '永久有效'
    }, {
        value: 1,
        label: '指定时间'
    }
]

export const chargeTypeList = [
    {
        value: 1,
        label: '按套餐收费'
    }, {
        value: 2,
        label: '按服务收费'
    }
]

export const ContainUnit = [
    {
        value: "次",
        label: "次"
    },{
        value: "个",
        label: "个"
    }, {
        value: "份",
        label: "份"
    },{
        value: "行李",
        label: "行李"
    }, {
        value: "件",
        label: "件"
    }
]

export const OvertopPrice = [
    {
        value: "1",
        label: '单价*超出数量'
    }
]
export const ChargeTypeList = [
    {
        value: 1,
        label: '一口价'
    },{
        value: 3,
        label: '按数量收费'
    }
]

export const serviceTemplateList = [
    {
        value: 1,
        label: '行李托运服务专用模版'
    },
    {
        value: 0,
        label: '普通服务模版'
    }
]

export const consumeList = [
    {
        value: '1501',
        label: '按数量收费'
    },
    {
        value: '1502',
        label: '按服务一次性收费'
    }
]

export const statusList = {
    '': '全部',
    0: '停用',
    1: '已激活'
}

export const validTypeIdType = {
    0: '永久有效',
    1: '指定时间'
}
export const calculateMap = {
    '0': '不计入钱包',
    '1': '收入',
    '-1': '支出'
}
export const AummerActivityStatusMap = {
    null: '未审核',
    '1': '已审核',
    '0': '已审核'
}
export const AummerActivityStatusResMap = {
    null: '',
    '1': '符合',
    '0': '不符合'
}
export const memberLevelMap = {
    '': '请选择',
    NORMAL: "普卡",
    SILVER: "银卡",
    GOLD: "金卡",
    BLACK: "黑卡"
}
export const memberLevelList = {
    null: '普卡',
    NORMAL: "普卡",
    SILVER: "银卡",
    GOLD: "金卡",
    BLACK: "黑卡"
}
export const MarginMap = {
    null: '请选择',
    '1': '是',
    '0': '否'
}

export const sexMap = {
    0: "女",
    1: "男",
    2: "未知"
}

export const subscribeTagMap = {
    1: '48小时以内',
    2: '1周内',
    3: '1个月内',
    4: '三个月内',
    5: '6个月内',
    6: '6个月以后'
}
export const isStatus = {
    "-1": "已下架",
    "0": "项目筹建中",
    "1": "预上线审核中",
    "2": "预上线成功",
    "3": "预上线已拒绝",
    "4": "正式上线审核中",
    "5": "正式上线成功",
    "6": "正式上线已拒绝",
    "7": "信息被修改，等待重新审核",
    "8": "信息被修改，审核不通过"
}
export const isBeds = {//床铺code对应的文字
    "5501" : "大床 2*1.8",
    "5502" : "大床 2*1.5",
    "5503" : "大床 1.8*1.5",
    "5504" : "单人床 2*0.8",
    "5505" : "单人床 2*1.2",
    "5506" : "榻榻米 2*1.8",
    "5507" : "榻榻米 2*1.5",
    "5508" : "榻榻米 2*1.2",
    "5509" : "圆床 直径2m",
    "5510" : "圆床 直径2.2m",
    "5511" : "儿童床 1.5×1米",
    "5512" : "儿童双层床 1.8×1.2(1)米",
    "5513" : "单人沙发床",
    "5514" : "双人沙发床",
    "5515" : "双层床0.9×1.9米上床,1.2×1.9米下床",
    "5516" : "双层床 1.35×1.9米上床,1.5×1.9米",
    "5517" : "大床 2.2*1.8",
    "5518" : "大床 2.2*1.5"
}
export const isBedsType = {
    "0101": "整套房子",
    "0102": "独立房间",
    "0103": "合住房间",
    "0104": "独立套房"
}

export const generationMap = [
    {value: 1, label: '无限制'},
    {value: 2, label: '16岁以下'},
    {value: 3, label: '16~23岁'},
    {value: 4, label: '24~30岁'},
    {value: 5, label: '30~45岁'},
    {value: 6, label: '45岁~60岁'},
    {value: 7, label: '60岁以上'}
]

export const thanMap = [
    {value: '>=', label: '≥'},
    {value: '>', label: '>'},
    {value: '=', label: '='},
    {value: '<=', label: '≤'},
    {value: '<', label: '<'}
]

export const couponStatus = [
    {value: '', label: '全部'},
    {value: 1, label: '未生效'},
    {value: 2, label: '未使用'},
    {value: 3, label: '已使用'},
    {value: 4, label: '已失效'},
    {value: 5, label: '已过期'}
]

export const couponDetailStatus = {
    '-1' : '作废',
    '0' : '未使用',
    '1' : '已使用',
    '2' : '已过期'
}

export const couponBtnStatus = {
    '' : '全部',
    '0' : '未使用',
    '1' : '已使用',
    '2' : '已过期'
}

export const newOldMemberMap = [
    {value: 1, label: '新注册'},
    {value: 2, label: '旧用户'}
]

export const couponTypeMap = [
    {value: 1, label: '立减'},
    {value: 2, label: '满减'},
    {value: 3, label: '折扣'}
]
export const performStatusMap = {
    '': '全部',
    0: '未执行',
    1: '已执行'
}

export const tenancyTypeMap = {
    '1': '长租',
    '2': '短租',
    '长租': '长租',
    '短租': '短租'
}
export const respToStatusMap = {
    '-1': '返现失败',
    '1': '已返现',
    '4': '待处理'
}

export const newRentTyep = {
    '0' : '长租',
    '1' : '短租'
}
export const goodsOrderStatus = {
    ''  : '全部',
    '1' : '未支付',
    '2' : '支付成功',
    '3' : '支付失败',
    '4' : '退款成功',
    '5' : '退款失败'
}

export const mapVipType = {
    1: '个人商旅',
    2: '企业商旅'
}

export const paltformType = {
    1:  '路客app',
    2:  '路客小程序',
    3:  '路客h5',
    4:  '路客pc官网',
    5:  '途家',
    6:  'airbnb',
    7:  '飞猪',
    8:  'booking',
    11:  '路客公众号',
    99:  '其他'
}

export const imOrderType = {
    '1100': '已删除',
    '1101': '咨询',
    '1102': '待付款',
    '1104': '已退房',
    '1105': '退款中',
    '1106': '已取消',
    '1109': '已关闭',
    '1201': '咨询_同意',
    '1210': '咨询_拒绝',
    '1207': '待入住',
    '1208': '入住中'
}

export const facilityCategory = {
    '01': '房源类型',
    '55': '床型',
    '56': '房屋类型',
    '60': '空调',
    '61': '热水',
    '62': '家居',
    '63': '洗浴用品',
    '64': '厨房',
    '65': '娱乐',
    '66': '安全',
    '67': '建筑',
    '68': '周边',
    '69': '便利设施-其他',
    '70': '特殊功能'
}


export const houseManageSearch = {
    houseType: {
        '': '不限',
        '1': '路客精品',
        '2': '商务房源',
        '3': '行政会所',
        '4': '海外民宿'
    },
    quorumsNum: {
        '': '人数不限',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '>7': '7以上'
    },
    bedNum: {
        '': '床位不限',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7'
    },
    roomType: {
        '': '不限',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '>4': '4个以上'
    },
    houseManageTag : {
        '0': '问题',
        '1': '正常',
        '2': '解约'
    },
    houseFacility: [
        {label: '阳台', value: '6705'},
        {label: '允许做饭', value: '7007'},
        {label: '投影', value: '6503'},
        {label: '有停车场', value: '6806'},
        {label: '允许举办活动', value: '7002'},
        {label: '电梯', value: '6703'}
    ],
    houseStatus: {
        '' : '不限',
        '-1': '已下架',
        '0': '项目筹建',
        '1': '预上线审核中',
        '2': '预上线审核通过',
        '3': '预上线审核拒绝',
        '4': '正式上线审核中',
        '5': '正式上线审核通过',
        '6': '正式上线审核拒绝',
        '7': '修改待审核',
        '8': '修改审核拒绝'
    }
}
export const roomStatusSearch = {
    '': '房态不限',
    '1': '空房',
    '2': '预定',
    '3': '屏蔽'
}
//显示手工单信息
export const roomSource = {
    AIRBNB: 'Airbnb手工',
    TUJIA: '途家手工',
    BOOKING_HAND: 'Booking手工',
    OFFLINE: '线下',
    PIG_HAND: '小猪手工',
    FLIGGY_HAND: '飞猪手工',
    CTRIP_HANGD: '携程手工',
    MEITUAN_HAND: '美团手工',
    ANT_HAND: '蚂蚁手工',
    ZHENGGUO_HAND: '榛果手工',
    MUNIAO_HAND: '木鸟手工',
    OTHER: '其它',
    REPAIR: '维修',
    LONG_TERM: '长租'
}
//针对选择手工单（后来需要屏蔽线下和维修and蚂蚁等选项，为了不影响以前的逻辑，就增加了一个新对象）
export const selectRoomSource = {
    AIRBNB: 'Airbnb手工',
    TUJIA: '途家手工',
    BOOKING_HAND: 'Booking手工',
    // OFFLINE: '线下',
    PIG_HAND: '小猪手工',
    FLIGGY_HAND: '飞猪手工',
    CTRIP_HANGD: '携程手工',
    MEITUAN_HAND: '美团手工',
    // ANT_HAND: '蚂蚁手工',
    ZHENGGUO_HAND: '榛果手工',
    MUNIAO_HAND: '木鸟手工',
    OTHER: '其它',
    LONG_TERM: '长租'
    // REPAIR: '维修'
}
export const alipayBatchReqStatus = {
    '0': '未请求',
    '1': '请求成功',
    '-1': '请求失败'
}

export const alipayBatchRespStatus = {
    '0': '未查询',
    '1': '部分成功',
    '2': '全部成功',
    '-1': '失败'
}

export const payType = {
    alipay: '支付宝',
    weixin: '微信',
    union: '银联',
    paypay: '贝宝'
}
// [异动类型]
export const moveTypeList = {
    1: "离职",
    2: "待分配",
    3: "岗位调动",
    4: "新增人员"
}

//出租类型

export const rentOutTypeList = [
    {key:"0101", value: "整套房子"},
    {key:"0102", value: "独立房间"},
    {key:"0103", value: "合住房间"},
    {key:"0104", value: "独立套房"}
    ]

//币种
export const currencyTypeList = [
    {value:"CNY", label: "人民币"},
    {value:"USD", label: "美元"},
    {value:"CAD", label: "加元"},
    {value:"THB", label: "泰铢"},
    {value:"JPY", label: "日元"}
]
//审批状态
export const ApprovalStatus = {
    '-1': '已下架',
    '4': '已上架',
    '0': '待区域审批',
    '2': '待总部审批',
    '1': '区域审批不通过',
    '3': '总部审批不通过',
    '5': '信息变更待审批',
    '6': '信息变更审批不通过'
}

//经营状态
export const manageStatus = {
    0: '待出租',
    1: '已出租',
    2: '不可出租',
    3: '签约中'
}
//长租状态
export const longRentalStatus = {
    0: '已上架',
    1: '未上架',
    2: '审批中'
}

//酒店类型
export const HoletType = {
    1: '酒店',
    2: '公寓',
    3: '客栈',
    4: '民宿'
}
// 保洁字典
export const cleanKeeping = {
    //'[实名认证状态]  0—未认证，1—待认证，2—认证通过，3认证不通过'
    verifiedStatusList: {
        '0': '未认证',
        '1': '待认证',
        '2': '认证通过',
        '3': '认证不通过'
    },
    //[资格认证状态] 0-未认证 1-待认证 2-认证通过 3-认证不通过'
    skillVerificationStatus: {
        '0': '未认证',
        '1': '待认证',
        '2': '认证通过',
        '3': '认证不通过'
    },
    // [技能认证状态] 0-待认证 1-认证通过 2-认证不通过',
    staffVerificationStatus: {
        '0': '待认证',
        '1': '认证通过',
        '2': '认证不通过'
    },
    accountStatus: {
        '1': '正常',
        '2': '锁定',
        '3': '禁用'
    },
    //0-待审核 1-审核通过 2-审核不通过
    workflowStatus: {
        '0': '待审核',
        '1': '审核通过',
        '2': '审核不通过'
    },
    // WAIT_CLEANING(1),//待清洁
    //         CLEANING(2),//清洁中
    //         WAIT_CONFIRMED(3),//待确认
    //         CANCEL(4),//取消
    //         CLEANING_COMPLETE(5),//已完成
    //         REJECT(6),//拒单
    //         WAIT_COMPLETE(7),//待完成
    //     WAIT_ACCEPT(8),//待接单

    orderStatus: {
    '0': '待接单',
    '1': '待清洁',
    '2': '清洁中',
    '3': '待确认',
    '4': '已取消',
    '5': '已完成',
    '6': '拒单',
    '7': '待完成',
    '8': '无人接单'
    },
    //1.系统派单2.抢单3.线下单
    orderType: {
        '1': '系统派单',
        '2': '抢单',
        '3': '线下单',
        '4': '转单',
        '5': '手工派单'
    },
    ruleType: {
        '1': '日常保洁',
        '2': '线下保洁'
    }
}
//lotel 管理
export const lotelStatus = {//0:无效，1:有效,2:暂停
    0: '无效',
    1: '有效',
    2: '暂停'
}
export const spiderTaskDictionary = {
    taskTypes: {
        0: 'Airbnb日历',
        1: '途家日历'
    },
    terminalTypes: {
        0: '智能接待'
        // 1: '房东app',
        // 2: '保洁app'
    },
    status: {
        0: '停用',
        1: '启用'
    },
    networks: {
        0: 'wifi',
        1: '4G'
    },
    airbnbCityDictionary: [{

        name: '以下所有城市',
        value: '以下所有城市'
    },{
        name: 'bangkok',
        value: 'bangkok'
    },{
        name: '重庆',
        value: 'chongqing'
    },{
        name: '广州',
        value: 'guangzhou'
    },{
        name: 'le-havre',
        value: 'le-havre'
    },{
        name: 'longueuil',
        value: 'longueuil'
    },{
        name: 'montreal',
        value: 'montreal'
    },{
        name: 'toronto',
        value: 'toronto'
    }],
    tuJiaCityDictionary: ['以下所有城市','北京', '南京','合肥','哈尔滨','天津','广州','成都','杭州','武汉','济南','海口','珠海','西安','郑州','重庆','长沙','青岛']

}

