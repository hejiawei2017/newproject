import {
    BannerList,
    BannerEdit,
    CityList,
    CityEdit,
    LabelManage,
    ArticleAdd,
    ArticleList,
    ArticleLabel,
    CommentList,
    HouseList,
    Order,
    OrderList,
    ServiceProviderList,
    ServiceOrderManage,
    ServiceItemManage,
    ServiceIncrementManage,
    HouseResourceJudge,
    HouseResourceImport,
    Authority,
    UserAdmin,
    PushManage,
    AlipayRemit,
    AlipayBatch,
    Payments,
    WalletPayImport,
    ArrearsPayImport,
    Accounts,
    WeixinLabel,
    Role,
    UploadImport,
    WeixinCustomerMessage,
    WeixinCustomerSendMessage,
    WeixinTemplateMessage,
    WeixinMessageRecord,
    WeixinUserlist,
    Login404,
    MemberManager,
    WalletDetails,
    ActionLogs,
    LandlordWallet,
    ExportReport,
    ManagementFee,
    PaymentType,
    BuManage,
    BuLog,
    KeywordsReply,
    AummerActivityApplication,
    AummerActivityData,
    AummerActivityMember,
    InvoiceManage,
    InvoiceSummary,
    HotHouse,
    Jurisdiction,
    CouponRuleSetting,
    CouponList,
    CouponPackageList,
    CouponConfigUserTag,
    CouponConfigChannel,
    OneLevel,
    TwoLevel,
    CouponDispense,
    CouponSummary,
    CouponReceive,
    HouseChecking,
    GoodsSellerList,
    GoodsList,
    GoodsOrderList,
    Promotion,
    RegisterNumber,
    RegisterDetail,
    OrderQuery,
    OrderDetail,
    HouseManageList,
    PoiManage,
    MessageManagementIm,
    CustomerService,
    NewLanlordWallet,
    StandardManage,
    CostControl,
    OperateReport,
    OperateHouse,
    ReceiptPayment,
    AuditOne,
    AuditTwo,
    HouseContract,
    FacilityDictionary,
    HouseSetting,
    NewOrganizationTree,
    NewRole,
    NewIncumbentSetting,
    NewPositionSetting,
    CompanyMobileTable,
    NewRegisterSetting,
    NewResignationSetting,
    DoorLockManageList,
    MiniQRcode,
    reportDboExcel,
    LongRentApproval,
    LongRentChange,
    CleanKeepingStaffList,
    CleanKeepingCorporationList,
    CleanKeepingStaffAuditList,
    CleanKeepingOrderList,
    LongRentHouses,
    LongRentLease,
    HouseMaintain,
    PmsStoreList,
    Lotel,
    SpiderTaskDeploy,
    SignManager,
    PingAnInsure,
    MarketSetting,
    LandlordSatisfaction,
    MallTradeRecord,
    AssistantIM,
    MarketRule,
    Notify,
    NotifySave,
    ArticleManage,
    wxUserLabel
} from "./pages/index"
// const env = process.env.MY_ENV || 'dev'
const env = process.env.MY_ENV || 'dev'
/*
目录一层是首页，第一层childRoutes是一级菜单，第二层childRoutes是二级菜单
component 是匹配到本path 地址显示的模块，pathName 标题，iconType 图标，noNav :true,不会再左侧栏显示
componentDom 是react Dom元素
*/
/**
 * AUTH_ADMIN	管理员
 * AUTH_AUTHORITY_LIST	权限列表
 * AUTH_BOOKING	Booking权限
 * AUTH_MAP_ADMIN	作战地图 - 管理员
 * AUTH_MAP_HOUSE_DETAIL	作战地图 - 房源详情
 * AUTH_MAP_HOUSE_EXTENSION	作战地图 - 房源拓展管理
 * AUTH_MAP_MAP	作战地图 - 地图权限
 * AUTH_MAP_SEARCH	作战地图 - 搜索
 * AUTH_MAP_SIGN	作战地图 - 项目筹建签约管理
 * AUTH_MP_MSG	公众号消息权限
 * AUTH_NORMAL	普通
 * AUTH_ROLE_LIST	角色列表
 * AUTH_SUPER	超级管理员
 * AUTH_USER_LIST	用户列表
 * * 所有权限
 */
function needNoRoute () { //特定环境不屏蔽菜单
    if (env === 'uat' || env === 'test' || env === 'dev' || env === 'pre') {
        return false
    }
    return true
}

let RoutesItem = [{
    childRoutes: [{
        path: 'finance',
        pathName: '账务管理',
        iconType: 'pay-circle',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_HOURSE_CONTRACT', 'AUTH_BU'],
        childRoutes: [{
            path: 'alipayRemit',
            pathName: '支付宝汇款',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: AlipayRemit
        }, {
            path: 'payBatch',
            pathName: '汇款批次',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: AlipayBatch
        }, {
            path: 'walletPayImport',
            pathName: '钱包款项导入',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: WalletPayImport
        }, {
            path: 'arrearsPayImport',
            pathName: '欠费清理导入',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: ArrearsPayImport
        }, {
            path: 'accounts',
            pathName: '收款账户',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: Accounts
        }, {
            path: 'payments',
            pathName: '流水查询',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: Payments
        }, {
            path: 'walletDetails',
            pathName: '经营账目明细',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: WalletDetails
        }, {
            path: 'actionLogs',
            pathName: '汇款日志',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: ActionLogs
        }, {
            path: 'newlandlordWallet',
            pathName: '房东钱包管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_BU'],
            componentDom: NewLanlordWallet
        }, {
            path: 'managementFee',
            pathName: '管理费',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: ManagementFee
        }, {
            path: 'paymentType',
            pathName: '支付类型',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: PaymentType
        }, {
            path: 'invoiceManage',
            pathName: '发票订单管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: InvoiceManage
        }, {
            path: 'invoiceSummary',
            pathName: '发票订单汇总',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY' , 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: InvoiceSummary
        }, {
            path: 'exportReport',
            pathName: '导出报表',
            noRoute: true,
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY'],
            componentDom: ExportReport
        }, {
            path: 'houseContract',
            pathName: '房源合同',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FINANCE', 'AUTH_FINANCE_PAY','AUTH_HOURSE_CONTRACT'],
            componentDom: HouseContract
        }]
    }, {
        path: 'application',
        pathName: '应用管理',
        iconType: 'windows',
        authority: ['AUTH_ADMIN', 'AUTH_AUTHORITY_LIST', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_PMS_HOTEL_CREATE'],
        childRoutes: [{
            path: 'activityList',
            pathName: 'Banner',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            noChildLink: true,
            componentDom: BannerList,
            childRoutes: [{
                path: 'add',
                pathName: '新增',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                noNav: true,
                componentDom: BannerEdit
            }, {
                path: 'edit/:id',
                pathName: '编辑',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                noNav: true,
                componentDom: BannerEdit
            }]
        },
        {
            path: 'labelManage',
            pathName: '标签管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: LabelManage
        },
        {
            path: 'article/add',
            pathName: '新增图文',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: ArticleAdd
        },
        {
            path: 'article',
            pathName: '图文管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            noChildLink: true,
            componentDom: ArticleList,
            childRoutes: [{
                path: 'edit/:id',
                pathName: '修改图文',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: ArticleAdd
            }]
        }, {
            path: 'articleLabel',
            pathName: '图文标签',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: ArticleLabel
        }, {
            path: 'houseList',
            pathName: '房源列表',
            noRoute: false,
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: HouseList
        }, {
            path: 'facilityDictionary',
            pathName: '房源设施',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: FacilityDictionary
        }, {
            path: 'commentList',
            pathName: '房源评论',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: CommentList
        },
        {
            path: 'order',
            pathName: '新订单管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_PMS_HOTEL_CREATE'],
            componentDom: Order
        }, {
            path: 'pushManage',
            pathName: '推送管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: PushManage
        }, {
            path: 'cityList',
            pathName: '城市列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            noChildLink: true,
            componentDom: CityList,
            childRoutes: [{
                path: 'add',
                pathName: '新增',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                noNav: true,
                componentDom: CityEdit
            }, {
                path: 'edit/:id',
                pathName: '编辑',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                noNav: true,
                componentDom: CityEdit
            }]
        }, {
            path: 'promotion',
            pathName: '推广渠道',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: Promotion
        }, {
            path: 'poi',
            pathName: 'POI管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: PoiManage
        }, {
            path: 'promotionReport',
            pathName: '业绩报表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            childRoutes: [{
                path: 'registerNumber',
                pathName: '注册数',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: RegisterNumber
            },
            {
                path: 'registerDetail',
                pathName: '注册明细',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: RegisterDetail
            }, {
                path: 'orderQuery',
                pathName: '订单查询',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: OrderQuery
            }, {
                path: 'orderDetail',
                pathName: '订单明细',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: OrderDetail
            }]
        }, {
            path: 'miniQRcode',
            pathName: '小程序二维码',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: MiniQRcode
        }]
    }, {
        path: 'AAI',
        pathName: 'AAI',
        iconType: 'font-colors',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_ASSISTANT', 'AUTH_ASSISTANT_PART_TIME', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_HOUSE_STATUS'],
        childRoutes: [{
            path: 'IM',
            pathName: 'IM消息管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: MessageManagementIm
        }, {
            path: 'assistantIM',
            pathName: '管家消息管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_ASSISTANT', 'AUTH_ASSISTANT_PART_TIME'],
            componentDom: AssistantIM
        }, {
            path: 'houseManageList',
            pathName: '房源列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_HOUSE_STATUS'],
            componentDom: HouseManageList
        }, {
            path: 'doorLockManageList',
            pathName: 'BU门锁管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: DoorLockManageList
        }, {
            path: 'houseChecking',
            pathName: '房源审批',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: HouseChecking
        }, {
            path: 'houseSetting',
            pathName: '房源配置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_BU', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: HouseSetting
        }, {
            path: 'houseMaintain',
            pathName: '房源维护',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_ASSISTANT'],
            componentDom: HouseMaintain
        }]
    },{
        path: 'cleanKeeping',
        pathName: '保洁AAI',
        iconType: 'insurance',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU', 'AUTH_CHEANER_ASSISTANT', 'AUTH_CHEANER_HR', 'AUTH_CHEANER_FINANCEING'],
        childRoutes: [{
            path: 'staffList',
            pathName: '人员管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU', 'AUTH_CHEANER_ASSISTANT', 'AUTH_CHEANER_HR'],
            componentDom: CleanKeepingStaffList
        },{
            path: 'corporationList',
            pathName: '公司管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU', 'AUTH_CHEANER_ASSISTANT', 'AUTH_CHEANER_HR'],
            componentDom: CleanKeepingCorporationList
        },{
            path: 'orderList',
            pathName: '订单管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU', 'AUTH_CHEANER_ASSISTANT', 'AUTH_CHEANER_HR', 'AUTH_CHEANER_FINANCEING'],
            componentDom: CleanKeepingOrderList
        },{
            path: 'staffAuditList',
            pathName: '实名认证',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU'],
            componentDom: CleanKeepingStaffAuditList
        }]
    }, {
        path: 'operationManager',
        pathName: '运营管理',
        iconType: 'smile',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
        childRoutes: [{
            path: 'buManage',
            pathName: 'BU管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: BuManage
        }, {
            path: 'buLog',
            pathName: 'BU日志',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: BuLog
        }, {
            path: 'hotHouse',
            pathName: '热门房源',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: HotHouse
        }, {
            path: 'reportDboExcel',
            pathName: '运营报表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: reportDboExcel
        }]
    }, {
        path: 'businessManager',
        pathName: '商务管家',
        iconType: 'audit',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_MAP'],
        childRoutes: [{
            path: 'serviceIncrementManage',
            pathName: '增值服务管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_MAP'],
            componentDom: ServiceIncrementManage
        }, {
            path: 'serviceProviderList',
            pathName: '服务商管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_MAP'],
            componentDom: ServiceProviderList
        }, {
            path: 'serviceItemManage',
            pathName: '服务项管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_MAP'],
            componentDom: ServiceItemManage
        }, {
            path: 'serviceOrderManage',
            pathName: '服务订单管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: ServiceOrderManage
        }]
    }, {
        path: 'houseManager',
        pathName: '路客管家',
        iconType: 'team',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN'],
        childRoutes: [{
            path: 'houseResource',
            pathName: '战略地图',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN'],
            childRoutes: [{
                path: 'houseResourceJudge',
                pathName: '筛选房源',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN'],
                componentDom: HouseResourceJudge
            }, {
                path: 'houseResourceImport',
                pathName: '拓展房源',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN'],
                componentDom: HouseResourceImport
            }]
        }]
    }, {
        path: 'houseLandlord',
        pathName: '路客房东',
        iconType: 'robot',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_BU', 'AUTH_ASSISTANT'],
        childRoutes: [{
            path: 'landlordSatisfaction',
            pathName: '房东满意度',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CLEANER_AREA', 'AUTH_BU', 'AUTH_ASSISTANT'],
            componentDom: LandlordSatisfaction
        },{
            path: 'list',
            pathName: '消息列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LANDLORD'],
            componentDom: Notify
        },{
            path: 'save',
            pathName: '消息配置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LANDLORD'],
            componentDom: NotifySave
        }]
    }, {
        path: 'affiliateFun',
        pathName: '附属功能',
        iconType: 'setting',
        authority: ['ROLE_USER', 'AUTH_CONTRACT_SIGN' , 'AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN', 'ROLE_AFFILIATED_FUNCTION_USER'],
        childRoutes: [{
            path: 'uploadImport',
            pathName: '上传文件',
            authority: ['ROLE_USER', 'AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN', 'ROLE_AFFILIATED_FUNCTION_USER'],
            componentDom: UploadImport
        },{
            path: 'signManager',
            pathName: '签约管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CONTRACT_SIGN'],
            componentDom: SignManager
        }]
    }, {
        path: 'weixinInformation',
        pathName: '微信消息',
        iconType: 'message',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
        childRoutes: [{
            path: 'weixinUserlist',
            pathName: '用户列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: WeixinUserlist
        }, {
            path: 'weixinCustomerMessage',
            pathName: '客服消息',
            noChildLink: true,
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: WeixinCustomerMessage,
            childRoutes: [{
                path: 'send/:type/:id',
                noNav: true,
                pathName: '发送信息',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: WeixinCustomerSendMessage
            }]
        }, {
            path: 'weixinTemplateMessage',
            pathName: '模板消息',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: WeixinTemplateMessage
        }, {
            path: 'weixinMessageRecord',
            pathName: '消息记录',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: WeixinMessageRecord
        }, {
            path: 'keywordsReply',
            pathName: '关键词回复',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: KeywordsReply
        }, {
            path: 'weixinLabel',
            pathName: '标签管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            componentDom: WeixinLabel
        }]
    }, {
        path: 'customerManager',
        pathName: '客服管理',
        iconType: 'customer-service',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_CUSTOMER_SERVICE_MANAGER'],
        childRoutes: [{
            path: 'memberManager',
            pathName: '会员管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: MemberManager
        }, {
            path: 'customerService',
            pathName: '客服消息管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_CUSTOMER_SERVICE_MANAGER'],
            componentDom: CustomerService
        }]
    }, {
        path: 'pms',
        pathName: 'PMS系统',
        iconType: 'laptop',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER','AUTH_PMS_HOTEL_CREATE'],
        childRoutes: [{
            path: 'pmsStoreList',
            pathName: '门店列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER','AUTH_PMS_HOTEL_CREATE'],
            componentDom: PmsStoreList
        }
        ]
    }, {
        path: 'LotelManager',
        pathName: 'Lotel管理',
        iconType: 'home',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LOTEL_ASSISTANT'],
        childRoutes: [{
            path: 'lotel',
            pathName: 'Lotel门店管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LOTEL_ASSISTANT'],
            componentDom: Lotel
        }]
    }, {
        path: 'MallManager',
        pathName: '商城管理',
        iconType: 'shop',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_CUSTOMER_SERVICE_MANAGER'],
        childRoutes: [{
            path: 'MallTradeRecord',
            pathName: '商城交易记录',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN', 'AUTH_CUSTOMER_SERVICE_MANAGER'],
            componentDom: MallTradeRecord
        }]
    }, {
        path: 'couponManager',
        pathName: '优惠券管理',
        iconType: 'dollar',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
        childRoutes: [{
            path: 'couponRuleSetting',
            pathName: '金额规则设置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: CouponRuleSetting
        }, {
            path: 'couponList',
            pathName: '优惠券列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: CouponList
        }, {
            path: 'couponPackageList',
            pathName: '活动列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: CouponPackageList
        }, {
            path: 'couponDispense',
            pathName: '手动充券',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: CouponDispense
        }, {
            path: 'setting',
            pathName: '业务参数配置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            childRoutes: [{
                path: 'userTag',
                pathName: '用户标签',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: CouponConfigUserTag
            }, {
                path: 'channel',
                pathName: '渠道标识',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: CouponConfigChannel
            }]
        },{
            path: 'audit',
            pathName: '审核人入口',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            childRoutes: [{
                path: 'auditOne',
                pathName: '一级审核人',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: AuditOne
            }, {
                path: 'auditTwo',
                pathName: '二级审核人',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: AuditTwo
            }]
        },{
            path: 'couponAudit',
            pathName: '券审核管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            childRoutes: [{
                path: 'oneLevel',
                pathName: '一级审核',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: OneLevel
            }, {
                path: 'twoLevel',
                pathName: '二级审核',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: TwoLevel
            }]
        }, {
            path: 'couponStatistics',
            pathName: '发券数据统计',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            childRoutes: [{
                path: 'couponSummary',
                pathName: '优惠券发放情况汇总',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: CouponSummary
            }, {
                path: 'couponReceive',
                pathName: '领券用户列表',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
                componentDom: CouponReceive
            }]
        }]
    // }, {
    //     path: 'aummerActivity',
    //     pathName: '大学生暑假活动',
    //     iconType: 'aliwangwang',
    //     noRoute: true,
    //     authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'ROLE_CUSTOMER_SERVICE_ADMIN'],
    //     childRoutes: [{
    //         path: 'application',
    //         pathName: '活动申请列表',
    //         authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
    //         componentDom: AummerActivityApplication
    //     }, {
    //         path: 'data',
    //         pathName: '活动数据导出表格',
    //         authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
    //         componentDom: AummerActivityData
    //     }]
    }, {
        path: 'staffOfficer',
        pathName: '路客参谋',
        iconType: 'crown',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_AUTHORITY_LIST','AUTH_FIRE_USER'],
        childRoutes: [{
            path: 'operateReport',
            pathName: 'Lotal经营报表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FIRE_USER'],
            componentDom: OperateReport,
            noChildLink: true,
            childRoutes: [{
                path: 'operateHouse/:id',
                pathName: 'Lotal房源报表',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FIRE_USER'],
                noChildLink: true,
                componentDom: OperateHouse
            }, {
                path: 'receiptPayment/:name/:id',
                pathName: '收支明细',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FIRE_USER'],
                noChildLink: true,
                componentDom: ReceiptPayment
            }]
        }, {
            path: 'standardManage',
            pathName: '基准管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN', 'AUTH_FIRE_USER'],
            componentDom: StandardManage
        }, {
            path: 'costControl',
            pathName: '费用操作',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_FIRE_USER'],
            componentDom: CostControl
        }]
        }, {
            path: 'pingAn',
            pathName: '家财保',
            iconType: 'environment',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
            childRoutes: [{
                path: 'insure',
                pathName: '批量投保',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT'],
                componentDom: PingAnInsure
            }]
        }, {
        path: 'purchaseGoods',
        pathName: '扫码购',
        iconType: 'barcode',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
        childRoutes: [{
            path: 'goodsSellerList',
            pathName: '供应商管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: GoodsSellerList
        }, {
            path: 'goodsList',
            pathName: '商品管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: GoodsList
        }, {
            path: 'goodsOrderList',
            pathName: '订单管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_OPERATIONS_MANAGEMENT', 'AUTH_CUSTOMER_SERVICE_ADMIN'],
            componentDom: GoodsOrderList
        }]
    }, {
        path: 'hrModule',
        pathName: 'HR模块',
        iconType: 'safety',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
        childRoutes: [{
            path: 'registerSetting',
            pathName: '新入职员工列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: NewRegisterSetting
        }, {
            path: 'incumbentSetting',
            pathName: '在职人员配置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: NewIncumbentSetting
        }, {
            path: 'resignationSetting',
            pathName: '离职人员配置',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: NewResignationSetting
        }, {
            path: 'companyMobileTable',
            pathName: '公司手机号使用表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: CompanyMobileTable
        }]
    }, {
        path: 'longRent',
        pathName: '长租管理',
        noRoute: needNoRoute(),
        iconType: 'safety',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
        childRoutes: [{
            path: 'longRentApproval',
            pathName: '上架审批',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: LongRentApproval
        }, {
            path: 'longRentChange',
            pathName: '变更审批',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: LongRentChange
        }, {
            path: 'longRentHouses',
            pathName: '长租房源',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: LongRentHouses
        }, {
            path: 'longRentLease',
            pathName: '长租租约',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR'],
            componentDom: LongRentLease
        }]
    }, {
        path: 'server',
        pathName: '系统管理',
        iconType: 'cluster',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_AUTHORITY_LIST', 'AUTH_MAP_ADMIN'],
        childRoutes: [{
            path: 'userAdmin',
            pathName: '用户管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MAP_ADMIN'],
            componentDom: UserAdmin
        }, {
            path: 'role',
            pathName: '角色配置管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: Role
        }, {
            path: 'authority',
            pathName: '权限配置管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_AUTHORITY_LIST'],
            componentDom: Authority
        }, {
            path: 'jurisdiction',
            pathName: '新权限列表',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: Jurisdiction
        }, {
            path: 'member',
            pathName: '用户会员管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: AummerActivityMember
        }, {
            path: 'organization',
            pathName: '组织架构',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: NewOrganizationTree
        }, {
            path: 'newRole',
            pathName: '新角色管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: NewRole
        }, {
            path: 'newPositionSetting',
            pathName: '新职位管理',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER'],
            componentDom: NewPositionSetting
        }]
    },{
        path: 'marketing',
        pathName: '全员营销',
        iconType: 'gateway',
        authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
        childRoutes: [{
            path: 'setting',
            pathName: '设置页',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
            componentDom: MarketSetting
        }, {
            path: 'rule',
            pathName: '规则说明',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
            componentDom: MarketRule
        }]
    },
        {
            path: 'spiderTask',
            pathName: '爬虫管理',
            iconType: 'radar-chart',
            authority: ['AUTH_ADMIN'],
            childRoutes: [{
                path: 'deploy',
                pathName: '任务配置',
                authority: ['AUTH_ADMIN'],
                componentDom: SpiderTaskDeploy
            }]
        },
        {
            path: 'wxmember',
            pathName: '微信会员管理',
            iconType: 'gateway',
            authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
            childRoutes: [
                {
                    path: 'wxUserLabel',
                    pathName: '用户标签管理',
                    authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
                    componentDom: wxUserLabel
                },
                {
                path: 'articleManage',
                pathName: '素材管理',
                authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_MARKET_LOOK', 'AUTH_MARKET_SET'],
                componentDom: ArticleManage
            }
        ]
        },
    // {
    //     path: 'Notify',
    //     pathName: '消息通知',
    //     iconType: 'notification',
    //     authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LANDLORD'],
    //     childRoutes: [{
    //         path: 'list',
    //         pathName: '消息列表',
    //         authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LANDLORD'],
    //         componentDom: Notify
    //     },{
    //         path: 'save',
    //         pathName: '消息配置',
    //         authority: ['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_LANDLORD'],
    //         componentDom: NotifySave
    //     }]
    // },


    {
        path: '*',
        pathName: '',
        noNav: true,
        authority: ['*'],
        componentDom: Login404
    }
    ],
    loading: false,
    firstRoute: '',
    activePath: '',
    activePathName: '首页',
    lastRoutes: {}
}]

let lastRoutes = JSON.stringify(RoutesItem[0])
export default {
    RoutesItem
}
export {
    lastRoutes
}
