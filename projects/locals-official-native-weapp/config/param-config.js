const { env } = require('./env-config.js')

const envConfig = {
  dev: {
    api: "https://dev.localhome.cn/api",
    // nodeApi: "http://192.168.1.157:7001/api",
    nodeApi: "https://i.localhome.cn/api",
    imgPrefix: "http://f.localhome.cn", //房源图片
    newImagePrefix: "http://120.78.15.214", //上传图片
    designImagePrefix: "http://qy.localhome.com.cn/locals", // 签名图片
    fileUrl: "http://120.76.204.105",
    h5Url: "http://120.78.15.214:9095",
    sevenMoor: "https://webchat.7moor.com"
  },
  pre: {
    api: "https://pre.localhome.cn/api",
    nodeApi: "https://i.localhome.cn/api",
    imgPrefix: "http://f.localhome.cn", //房源图片
    newImagePrefix: "http://120.78.15.214", //上传图片
    designImagePrefix: "http://qy.localhome.com.cn/locals", // 签名图片
    fileUrl: "http://120.79.224.159"
  },
  prod: {
    api: "https://ms.localhome.cn/api",
    nodeApi: "https://i.localhome.cn/api",
    imgPrefix: "http://f.localhome.cn", //线上房源图片
    newImagePrefix: "http://120.78.15.214",
    designImagePrefix: "https://qy.localhome.com.cn/locals",
    fileUrl: "http://120.79.224.159",
    h5Url: "https://m.localhome.cn",
    sevenMoor: "https://webchat.7moor.com"
  }
};

const config = envConfig[env];

const getImgPath = path => {
  if (path && path.includes("http")) {
    return path;
  } else {
    return config.imgPrefix + path;
  }
};
const api = config.api;

const nodeApi = config.nodeApi;

const shareMenuArray = [
  "pages/index/index",
  "pages/housing/list/index",
  "pages/trip/index",
  "pages/mine/mine",
  "pages/housing/detail/index",
  "pages/housing/owner/index",
  'pages/housing/lotel-housing/index',
  'pages/housing/lotel/index',
  'pages/housing/detail/lotel',
  'pages/h5/index',
  'pages/housing/featured-houses/index',
  'pages/housing/album/index'
];

const authed_user = [
  // "18613058447",
  // "13432614798",
  // "18613175577",
  // "13217724240",
  // "13929571837",
  // "18186239152",
  // "13570522716",
  // "18302085673",
  // "18022302929",
  // "18024012906"
];

const uploadImageUrls = {
  'dev': 'https://locals-house-test.oss-cn-shenzhen.aliyuncs.com',
  'pre': 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com',
  'prod': 'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com'
}

const aliyunOssConfig = {
  uploadImageUrl: uploadImageUrls[env],
  OSSAccessKeyId: 'LTAI51rz55fhjUzU',
  AccessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
  timeout: 87600 //这个是上传文件时Policy的失效时间
}

module.exports = {
  api,
  nodeApi,
  config,
  getImgPath,
  authed_user,
  shareMenuArray,
  aliyunOssConfig
}
