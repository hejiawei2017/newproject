const getApi = function () {
    let prefix = {
        'dev': 'dev',
        'test': 'test',
        'pre': 'pre',
        'prod': 'ms'
    }
    // 想修改MY_ENV环境变量请到server.js中第二行修改
    return `https://${prefix[MY_ENV]}.localhome.cn/api`
}

const getEnv = function () {
    let prefix = {
        'dev': 'dev',
        'test': 'test',
        'pre': 'pre',
        'prod': 'ms'
    }
    return prefix[MY_ENV]
}

const getImgHead = function () {
    let prefix = {
        'dev': 'locals-house-test.oss-cn-shenzhen.aliyuncs.com',
        'test': 'locals-house-test.oss-cn-shenzhen.aliyuncs.com',
        'pre': 'locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
        'prod': 'locals-house-prod.oss-cn-shenzhen.aliyuncs.com'
    }
    
    return `https://${prefix[MY_ENV]}`
}

module.exports = {
    api: getApi(),
    getEnv: getEnv(),
    imgHead: getImgHead()
}