'use strict';

const mysql = require('mysql2/promise');
const Redis = require('ioredis');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('es6-promisify');
const SequelizeAuto = require('sequelize-auto');
const configs = {
  dev: require('../config/config.default')({}),
  prod: {
    ...require('../config/config.default')({}),
    ...require('../config/config.prod')({}),
  },
};

const exec = promisify(childProcess.exec);

(async function() {

  const env = process.env.LOCALS_ENV;
  const isDev = env === 'development';
  const config = isDev ? configs.dev : configs.prod;

  const { datasources } = config.sequelize;
  const datasourcesCP = datasources.slice(0);


  while (datasourcesCP.length) {
    const datasource = datasourcesCP.shift();
    const connection = await mysql.createConnection({
      host: datasource.host,
      user: datasource.username,
      password: datasource.password,
    });

    const [rows] = await connection.execute('SELECT 1+1');
    if (!rows.length) {
      throw 'permission';
    }
    console.info('[mysql] Executed SELECT 1+1');
    await connection.close();
  }
  const redis = new Redis(config.redis.client);
  
  await redis.set('redis_test', 1);
  await redis.get('redis_test');


  redis.disconnect();
  console.info('[redis] Executed SET redis_test 1');

  const args = [
    'db:migrate',
    '--optionsPath',
    'lib/sequelizerc.js',
    '--env',
    env,
  ];
  const result = await exec('node_modules/.bin/sequelize ' + args.join(' '));
  console.log('[sequelize migrate]', result);

  const datasourcesCP2 = datasources.slice(0);
  while (datasourcesCP2.length) {
    const datasource = await datasourcesCP2.shift();
    const auto = new SequelizeAuto(
      datasource.database,
      datasource.username,
      datasource.password,
      {
        host: datasource.host,
        directory: `./app/model-define/${datasource.database}`,
        typescript: false,
      }
    );

    const run = promisify(auto.run);
    await run.call(auto);
  }

  // 替换sequlize-model个文件
  const pwd = process.cwd();

  let modelPath = path.resolve(pwd, 'node_modules/egg-sequelize/node_modules/sequelize/lib/model.js');
  if (!fs.existsSync(modelPath)) {
    modelPath = path.resolve(pwd, 'node_modules/sequelize/lib/model.js');
  }

  if (fs.existsSync(modelPath)) {
    const data = fs.readFileSync(path.resolve(pwd, 'overfile/egg-sequlize-model.js'));
    fs.writeFileSync(modelPath, data.toString());
  }

  console.log('开始启动');
  const bootstrap_command = isDev
    ? `LOCALS_ENV=${env} node_modules/.bin/egg-bin dev`
    : `LOCALS_ENV=${env} node_modules/.bin/egg-scripts start --title=egg-server-locals-hd-backend`;

  const ls = childProcess.exec(bootstrap_command);
  ls.stderr.on('data', console.log.bind(console, '❌ 异常：'));
  ls.stdout.on('data', console.log.bind(console, '✅ 输出：'));
})();
