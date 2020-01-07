const env = process.env.BUILD_ENV || 'dev'

let envConfig = {
    dev: {
        api: 'https://dev.localhome.cn/api',
        apiBoost: 'https://devnode.localhome.com.cn/api',
        // apiBoost: 'http://192.168.1.139:7001/api',
        imgPrefix: 'http://f.localhome.cn', //房源图片
        newImagePrefix: 'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com', //上传图片
        pcUrl: 'http://tp.localhome.cn:9094', //pc官网
        mobileURL: 'http://tp.localhome.cn:9095', //移动端官网
        designImagePrefix: 'http://qy.localhome.com.cn/locals', // 签名图片
        walletUrl: (token) => `http://tp.localhome.cn:9090/newaccounting/wallet/index/${token}/AAA/story`, // 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl: 'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com',
        wxShareUrl: 'https://f.localhome.cn/devInsurance',
        activityId: '1904222209237',
        ebookingSocket: 'http://tp.localhome.cn:10000'
    },
    test: {
        api: 'http://test.localhome.cn/api',
        imgPrefix: 'http://f.localhome.cn',
        newImagePrefix: 'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com',
        pcUrl: 'http://tp.localhome.cn:7094', //pc官网
        mobileURL: 'http://tp.localhome.cn:7095', //移动端官网
        designImagePrefix: 'http://qy.localhome.com.cn/locals',
        walletUrl: (token) => `http://tp.localhome.cn:7090/newaccounting/wallet/index/${token}/AAA/story`, // 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl: 'http://locals-house-test.oss-cn-shenzhen.aliyuncs.com', //临时下载文件地址 到时候改测试的
        wxShareUrl: 'https://f.localhome.cn/testInsurance'
    },
    pre: {
        api: 'http://pre.localhome.cn/api',
        imgPrefix: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        newImagePrefix: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        pcUrl: 'http://tp.localhome.cn:6094', //pc官网
        mobileURL: 'http://tp.localhome.cn:6095', //移动端官网
        designImagePrefix: 'http://qytest.localhome.com.cn/locals',
        walletUrl: (token) => `http://tp.localhome.cn:6090/newaccounting/wallet/index/${token}/AAA/story`, // 钱包地址
        // fileUrl:'http://192.168.0.215:9092'
        fileUrl: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com', //临时下载文件地址 到时候改测试的
        wxShareUrl: 'https://f.localhome.cn/preInsurance'
    },
    prod: {
        api: 'https://ms.localhome.cn/api',
        apiBoost: 'https://i.localhome.cn/api',
        imgPrefix: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com', //线上房源图片
        newImagePrefix: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        designImagePrefix: 'http://qy.localhome.com.cn/locals',
        fileUrl: 'http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        walletUrl: (token) => `http://mobile.localhome.com.cn/newaccounting/wallet/index/${token}/AAA/story`, // 钱包地址
        wxShareUrl: 'http://f.localhome.cn/insurance'
    }
}

envConfig = envConfig[env]

export default {
    envConfig
}
