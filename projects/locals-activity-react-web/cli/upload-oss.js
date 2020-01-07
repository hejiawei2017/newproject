// aliyun OSS
const oss = require('ali-oss');

const fs = require('fs');
const co = require('co');
const path = require('path');

// 获取活动项目中的配置文件中的活动id
const config = require(process.env.ACTIVITY_CONFIG_PATH)
const { activity_id } = config

if (!activity_id) {
  console.log('不存在activity_id参数!')
  process.exit(1)
}

// 创建OSS上传的实例
const client = new oss({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI51rz55fhjUzU',
  accessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
  bucket: 'locals-house-prod', //locals-house-prod(生产)
  secure: true, // https访问
});

(() => {
  const root = path.resolve(__dirname, `../${`build/prod/${process.env.ACTIVITY_NAME}`}`);
  console.log('提交目录', root, '下的所有文件到 OSS \n\n')
  const files = [];

  //递归取出所有文件夹下所有文件的路径
  function readDirSync(p) {
    const pa = fs.readdirSync(p);
    pa.forEach(e => {
      const cur_path = `${p}/${e}`;
      const info = fs.statSync(cur_path);
      if (info.isDirectory()) {
        readDirSync(cur_path);
      } else {
        files.push(cur_path);
      }
    });
  }

  readDirSync(root);

  co(function*() {
    //遍历文件
    for (let index = 0; index < files.length; index += 1) {
      const e = files[index];
      const result = yield client.put(
        e.replace(root, `/localhomeqy/${activity_id}`),
        e
      );
      //提交文件到oss，文件夹会自动创建
      console.log(result.url);
    }
  });
})();
