module.exports = {
    apphost: "http://localhost:3000",
    //代理url
    // proxy_url: 'http://14.23.157.98:8090', //外网ip
    proxy_url: 'http:' + '//10.10.' + '104.3:80', //内网ip
    //proxy_url: 'http://127.0.0.1:3007',
    apphead: '/fbacs',
    //文件上传路径
    uploader: '/fbacs/access/form/FRONT-COMM/GTCCOMMATTACH10',
    //视频上传地址
    videoUploadUrl: 'http:' + '//10.10.' + '104.3/' + 'gtcommtool/do/commtoolvideo/',
    //图片前缀地址
    base_image_url: '/fbacs/',
    //国旗访问地址
    national_flag_url: '/flags/',
    // download_url: '/download_url/',
    //本地测试是否开启菜单权限过滤
    isFilterMenu: true,
    systemName: '运营管理中心',
    // 中心公服 centerMain 知识产权 intellectual  检测检验 Inspection  产业 industry 消费者 consumer
    systemType: 'centerMain',
    //注册url
    registerUrl: "http://10.10.104.3/#/register",
    //登录url
    loginUrl: "http://10.10.104.3/#/loginpass",
    //找回密码
    forgotpassUrl: "http://10.10.104.3/#/forgotpass",
    //找回账号
    findaccount: "http://10.10.104.3/#/findaccount",
    //登录信息修改
    personalcenter: "http://10.10.104.3/#/personalcenter",
    //各系统跳转地址
    centerMainUrl: "http://10.10.104.11:8081/", // 中心公服
    intellectualUrl: "http://10.10.104.11:8082/",  //知识产权
    InspectionUrl: "http://10.10.104.11:8083/", //检测检验
    industryUrl: "http://10.10.104.11:8084/", //产业
    consumerUrl: "http://10.10.104.11:8085/",  //消费者

    trouceUrl: 'http://10.10.104.3:80/' //溯源系统地址
};
