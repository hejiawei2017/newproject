// 开发环境默认dev
process.env.NODE_ENV = 'dev'
// 因为dev环境也容许进行打包的，需要区分是否本地开发
process.env.isDevelopEnv = true

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path')
const app = express();
const config = require('../webpack.config.js');
const child_process = require('child_process');
const compiler = webpack(config);
const PORT = 3345
const HOST = '0.0.0.0'
const argv = JSON.parse(process.env.npm_config_argv);
const m = argv.original.slice(2).toString().split('=');
const FILENAME = m[1];

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

let url = `http://localhost:${PORT}`;
let cmd = ''

if (process.platform == 'wind32' || process.platform == 'win32' || process.platform == 'win64') {
    cmd = 'start';
} else if (process.platform == 'linux') {
    cmd = 'xdg-open';
} else if (process.platform == 'darwin') {
    cmd = 'open';
}

app.listen(PORT, function () {
  console.log(`please open http://localhost:${PORT}\n`);
  child_process.exec(`${cmd} ${url}`);
});