'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const yargs = require('yargs');
const argv = yargs.argv;
const [ ACTIVITY_NAME ] = argv._
const { BUILD_ENV } = argv
const IS_NEED_ACTIVITY_ID = process.env.IS_NEED_ACTIVITY_ID

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
let envPublicUrl = ''

if (IS_NEED_ACTIVITY_ID) {
  // start时没有process.env.ACTIVITY_CONFIG_PATH变量，则获取活动内的deploy.json
  const ACTIVITY_CONFIG_PATH = process.env.ACTIVITY_CONFIG_PATH || resolveApp(`src/pages/${ACTIVITY_NAME}/deploy.json`)

  if (!fs.existsSync(ACTIVITY_CONFIG_PATH)) {
    console.log('请添加活动配置文件(deploy.json)')
    process.exit();
  }

  const config = require(ACTIVITY_CONFIG_PATH)
  const { activity_id } = config

  if (!activity_id) {
    console.log('不存在activity_id参数!')
    process.exit(1)
  }

  envPublicUrl = `${process.env.PUBLIC_URL}/${activity_id}`;
} else {
  envPublicUrl = `${process.env.PUBLIC_URL}`;
}

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  ACTIVITY_NAME: ACTIVITY_NAME,
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(`build/${BUILD_ENV}/${ACTIVITY_NAME}`),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, `src/index`),
  activityPath: resolveApp(`src/pages/${ACTIVITY_NAME}`),
  activityIndexJs: resolveModule(resolveApp, `src/pages/${ACTIVITY_NAME}/index`),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};



module.exports.moduleFileExtensions = moduleFileExtensions;
