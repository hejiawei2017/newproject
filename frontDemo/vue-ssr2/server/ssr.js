const Koa = require('koa')
const koaStatic = require("koa-static");
const koaMount = require('koa-mount')
const path = require('path')
// const webpack = require("webpack")
const resolve = file => path.resolve(__dirname, file);
const app = new Koa()
const compress = require('koa-compress');
const options = {
  threshold: 1024 //数据超过1kb时压缩
};
app.use(compress(options));

const proxys = require("../src/proxy.js");
const proxy = require('koa-server-http-proxy')


const isDev = process.env.NODE_ENV !== 'production'
const router = isDev ? require('./dev.ssr') : require('./server')

console.log("proxys", proxys)

Object.keys(proxys).forEach((k) => {
  app.use(proxy(k, proxys[k]))
})

// new webpack.DefinePlugin({
//   "process.env.VUE_ENV": "server"
// })
// 开放目录
app.use(koaMount('/dist', koaStatic(resolve("../dist/client"))));
app.use(koaMount('/public', koaStatic(resolve("../public"))));

app.use(router.routes()).use(router.allowedMethods())


const port = 3000;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

module.exports = app