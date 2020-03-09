import Login from './login/loadable'
import BannerList from './banner/loadable' // banner列表
import BannerEdit from './banner/loadableEdit' // banner 编辑新增
import CityList from './city/loadable' // 城市列表
import CityEdit from './city/loadableEdit' // 城市 编辑新增
import LabelManage from './labelManage/loadable' // 图文列表
import ArticleList from './articleTable/loadable' // 图文列表
import ArticleLabel from './articleLabel/loadable' // 标签列表
import ArticleAdd from './articleAdd/loadable' // 新增图文
import CommentList from './commentList/loadable' // 评论页面
import HouseList from './houseList/loadable' // 房源列表
import Order from './order/loadable' //新订单列表
import OrderList from './orderList/loadable' // 订单列表
import MallTradeRecord from './mallTradeRecord/loadable' // 商城记录列表
import AssistantIM from './assistantIM/loadable' // 商城记录列表

//商务管家//
import ServiceProviderList from './businessManage/serviceProviderList/loadable' // 服务管理
import ServiceOrderManage from './businessManage/serviceOrderManage/loadable'//服务订单管理
import ServiceItemManage from './businessManage/serviceItemManage/loadable'//服务项管理
import ServiceIncrementManage from './businessManage/serviceIncrementManage/loadable'//增值服务管理
//商务管家//
import LandlordSatisfaction from './landlordSatisfaction/loadable'

import Authority from './authority/loadable' // 权限管理
import Role from './role/loadable' // 角色管理
import NewOrganizationTree from './newOrganizationTree/loadable' // 新平台管理-组织架构
import NewRole from './newRole/loadable' // 新平台管理-新角色管理
import NewPositionSetting from './newPositionSetting/loadable' // 新平台管理-职位管理
import NewIncumbentSetting from './newIncumbentSetting/loadable' // 新平台管理-在职人员
import CompanyMobileTable from './companyMobileTable/loadable' // 新平台管理-手机号使用表
import NewRegisterSetting from './newRegisterSetting/loadable' // 新平台管理-在职人员
import NewResignationSetting from './newResignationSetting/loadable' // 新平台管理-离职人员
import UserAdmin from './userAdmin/loadable' // 用户管理
import PushManage from './pushManage/loadable' // 用户管理
import HouseResourceJudge from './houseResourceJudge/loadable' // 战略地图-筛选房源
import HouseResourceImport from './houseResourceImport/loadable' //战略地图-拓展房源
import AlipayRemit from './alipayRemit/loadable'//账务管理 支付宝汇款
import AlipayBatch from './alipayBatch/loadable'//账务管理 汇款批次
import WalletPayImport from './walletPayImport/loadable'//账务管理 钱包汇款导入
import ArrearsPayImport from './arrearsPayImport/loadable'//账务管理 欠费清理导入
import Accounts from './accounts/loadable'//账务管理 收款账户
import BuManage from './buManage/loadable' // Bu管理
import reportDboExcel from './reportDboExcel/loadable' // 管家工资报表
import BuLog from './buManage/loadableLog' // Bu日志
import SignManager from './signManager/loadable' //网上签约
import UploadImport from './uploadImport/loadable'//上传文件
import WeixinCustomerMessage from './weixinCustomerMessage/loadable' // 客服消息
import WeixinTemplateMessage from './weixinTemplateMessage/loadable' // 模板消息
import WeixinMessageRecord from './weixinMessageRecord/loadable' // 消息记录
import WeixinUserlist from './weixinUserlist/loadable' //微信用户列表
import KeywordsReply from './keywordsReply/loadable' //微信 关键词回复
import WeixinLabel from './weixinLabel/loadable' //用户标签
import MiniQRcode from './miniQRcode/loadable' //预定二维码

import Login404 from './404/loadable' // 404
import MemberManager from './memberManager/loadable' //会员管理
import Payments from './payments/loadable'
import WalletDetails from './walletDetails/loadable' // 钱包明细
import ManagementFee from './managementFee/loadable' // 钱包管理
import ActionLogs from './actionLogs/loadable' // 汇款日志
import LandlordWallet from './landlordWallet/loadable' // 汇款日志
import ExportReport from './ExportReport/loadable' // 导出报表
import PaymentType from './paymentType/loadable' // 支付类型
import AummerActivityApplication from './aummerActivityApplication/loadable' // 活动申请列表
import AummerActivityData from './aummerActivityData/loadable' // 活动数据导出表格
import AummerActivityMember from './aummerActivityMember/loadable' // 新权限管理
import InvoiceManage from './invoiceManage/loadable'
import InvoiceSummary from './invoiceSummary/loadable'
import HotHouse from './hotHouse/loadable' //热门房源
import LongRentApproval from './longRentApproval/loadable' //长租上线审批
import LongRentChange from './longRentChange/loadable' //长租变更
import LongRentHouses from './longRentHouses/loadable' //长租房源
import LongRentLease from './longRentLease/loadable' //长租租约
import HouseChecking from './houseChecking/loadable' //房源审批
import Jurisdiction from './jurisdiction/loadable' //新权限
import GoodsSellerList from './goodsSellerList/loadable' //商品供应商
import GoodsList from './goodsList/loadable' //商品列表
import GoodsOrderList from './goodsOrderList/loadable' //商品列表
import Promotion from './promotion/loadable' //推广渠道管理
import RegisterNumber from './promotionReport/registerNumber/loadable' //注册数
import RegisterDetail from './promotionReport/registerDetail/loadable' // 注册详细
import OrderQuery from './promotionReport/orderQuery/loadable' //订单查询
import OrderDetail from './promotionReport/orderDetail/loadable' //订单详细
import PoiManage from './poiManage/loadable' //标签管理 标签
import MessageManagementIm from './messageManagementIm/loadable' //im消息管理
import CustomerService from './customerService/loadable' //客服消息管理
import NewLanlordWallet from './newLandlordWallet/loadable'
import FacilityDictionary from './facilityDictionary/loadable'
import HouseSetting from './houseSetting/loadable'
import HouseManageList from './houseManageList/loadable' //房源管理
import GetCoupon from './getCoupon' // 领取优惠券（临时）
import DoorLockManageList from './doorLockManageList/loadable' //房源管理
import HouseMaintain from './houseMaintain/loadable' //房源管理

//保洁管理
import CleanKeepingStaffList from './cleanKeeping/staff/loadable'
import CleanKeepingStaffAuditList from './cleanKeeping/staffAudit/loadable'
import CleanKeepingCorporationList from './cleanKeeping/corporation/loadable'
import CleanKeepingOrderList from './cleanKeeping/order/loadable'

// 参谋模块
import OperateReport from './operateReport/loadable' // 参谋lotal经营报表
import OperateHouse from './operateHouse/loadable' // 参谋lotal房源报表
import ReceiptPayment from './receiptPayment/loadable' // 参谋收支明细
import StandardManage from './standardManage/loadable' // 基准管理
import CostControl from './costControl/loadable' // 费用操作

//平安家财保模块
import PingAnInsure from './pingAnInsure/loadable'//平量投保

// 优惠券模块
import CouponRuleSetting from './couponRuleSetting'
import CouponList from './couponList'
import CouponPackageList from './couponPackageList'
import CouponConfigUserTag from './couponConfig/userTag'
import CouponConfigChannel from './couponConfig/channel'
import OneLevel from './couponApproval/oneLevel'
import TwoLevel from './couponApproval/twoLevel'
import CouponDispense from './couponDispense'
import CouponSummary from './couponStatistics/summary'
import CouponReceive from './couponStatistics/receive'
import AuditOne from './couponAudit/auditOne'
import AuditTwo from './couponAudit/auditTwo'
import SpiderTaskDeploy from './spiderTask/deploy/loadable'
import Lotel from './lotel/loadable' //Lotel

import HouseContract from './houseContract/loadable' // 房源合同


//PMS板块开始 pms
import PmsStoreList from './pms/pmsStoreList/loadable'
// import PmsActivityList from './pms/pmsActivityList/loadable'
// import PmsStoreHome from './pms/pmsStoreHome/loadable'
// import PmsEditStore from './pms/pmsEditStore/loadable'
// import PmsUnderHouse from './pms/pmsUnderHouse/loadable'
// import PmsStoreState from './pms/pmsStoreState/loadable'
// import PmsStoreFacility from './pms/pmsStoreFacility/loadable'

// 全员营销模块
import MarketSetting from './marketSetting/marketSetting'
import MarketRule from './marketRule/marketRule'

// 消息通知模块
import Notify from './notify/loadable'
import NotifySave from './notify/saveLoadable'// 微信管理模块
import ArticleManage from './wxMember/articleManage/loadable'
import wxUserLabel from './wxMember/wxUserLabel/loadable'
export {
    Login,
    BannerList,
    BannerEdit,
    CityList,
    CityEdit,
    LabelManage,
    ArticleList,
    ArticleLabel,
    ArticleAdd,
    Authority,
    Role,
    CommentList,
    HouseList,
    Order,
    OrderList,
    UserAdmin,
    PushManage,
    HouseResourceJudge,
    HouseResourceImport,
    ServiceProviderList,
    ServiceOrderManage,
    ServiceItemManage,
    ServiceIncrementManage,
    WeixinCustomerMessage,
    WeixinMessageRecord,
    WeixinTemplateMessage,
    WeixinLabel,
    AlipayRemit,
    AlipayBatch,
    WalletPayImport,
    ArrearsPayImport,
    Accounts,
    Payments,
    WalletDetails,
    ManagementFee,
    ActionLogs,
    LandlordWallet,
    ExportReport,
    PaymentType,
    BuManage,
    SignManager,
    BuLog,
    WeixinUserlist,
    UploadImport,
    KeywordsReply,
    Login404,
    MemberManager,
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
    NewOrganizationTree,
    NewRole,
    NewPositionSetting,
    NewIncumbentSetting,
    CompanyMobileTable,
    NewResignationSetting,
    NewRegisterSetting,
    HouseSetting,
    GetCoupon,
    DoorLockManageList,
    MiniQRcode,
    reportDboExcel,
    LongRentApproval,
    LongRentChange,
    HouseMaintain,
    CleanKeepingStaffList,
    CleanKeepingCorporationList,
    CleanKeepingStaffAuditList,
    CleanKeepingOrderList,
    LongRentHouses,
    LongRentLease,
    PmsStoreList,
    Lotel,
    SpiderTaskDeploy,
    PingAnInsure,
    MarketRule,
    LandlordSatisfaction,
    MallTradeRecord,
    AssistantIM,
    Notify,
    NotifySave,
    ArticleManage,
    wxUserLabel,
    MarketSetting   
     // PmsStoreState,
    // PmsActivityList,
    // PmsStoreHome,
    // PmsEditStore,
    // PmsUnderHouse,
    // PmsStoreFacility
}
