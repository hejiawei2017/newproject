const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require(process.env.ACTIVITY_CONFIG_PATH)
const { activity_id } = config

if (!activity_id) {
  console.log('不存在activity_id参数!')
  process.exit(1)
}

function getVersion() {
  const date = new Date();
  return `${date.getFullYear() %
    100}.${date.getMonth()}.${date.getDate()}.${date.getTime() % 10000}`;
}

async function startUpload() {
  const htmlPath = path.resolve(
    __dirname,
    `../${`build/prod/${process.env.ACTIVITY_NAME}`}/index.html`
  );
  console.info('\n\n即将上传: ', htmlPath, '\n\n');

  const content = fs.readFileSync(htmlPath);
  const date = new Date();
  const version = getVersion();
  const online = process.env.ONLINE === '0' ? false : true;
  const { data } = await axios.post(
    `${process.env.BASE_API}/api/activity_admin/activity_versions`,
    {
      activity_id: activity_id,
      version: version,
      desc: `本次提交于: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      online,
      resource: content.toString(),
    }
  );
  if (!data.success) {
    throw new Error(date.errorMsg);
  }
  console.log('版本创建成功: ');
  console.log('版本号: ', version);
  console.log('是否线上版本: ', online);
  console.log(
    '接口地址: ',
    `${process.env.BASE_API}/v/${activity_id}?v=${version}`
  );
}

startUpload();
